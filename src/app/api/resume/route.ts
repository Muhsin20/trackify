import { dynamoDb, s3Client } from "@/app/lib/dynamoClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
// /pages/api/hash.js
import crypto from "crypto";
import { NextResponse } from "next/server";

//use uiuid for  amazon dynamo db to create user id
//remember to let users upload updated resume (i think it can still work as is)
const s3RandomImgName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

//function to upload file to s3
async function uploadFileToS3(file: Buffer, name: string, user_id: string) {
  const fileBuffer = file;
  const mimeType = "application/pdf";
  console.log(name);
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: name,
    Body: fileBuffer,
    ContentType: mimeType,
  };
  //upload file to s3 bucket
  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  console.log(`im here`);

  //update user resume column to new resume
  const update_params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      id: user_id, // Partition key
    },
    UpdateExpression: "SET #resume = :resume",
    ExpressionAttributeNames: {
      "#resume": "resume",
    },
    ExpressionAttributeValues: {
      ":resume": name,
    },
    ReturnValues: ReturnValue.ALL_NEW,
  };

  // Update the application status
  const update_command = new UpdateCommand(update_params);
  const update_response = await dynamoDb.send(update_command);
  //test overriding (meaning user uploads new resume replacing their old one maybe delete the old one?)
  console.log("Updated Item:", update_response.Attributes);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const userID = formData.get("userID")?.toString();
    const file = formData.get("file");
    if (!userID) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Invalid or missing file." },
        { status: 400 }
      );
    }

    // Validate the file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageName = s3RandomImgName();
    await uploadFileToS3(buffer, imageName, userID);
    return NextResponse.json(
      { message: "Success resume uploaded" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}

//code for later for users to see their resume: import { GetObjectCommand } from "@aws-sdk/client-s3";

// export async function GET(request: Request) {
//     try {
//       const { userID } = await request.json();

//       // Fetch the user record from DynamoDB
//       const userParams = {
//         TableName: process.env.DYNAMODB_TABLE_NAME,
//         Key: { id: userID },
//       };
//       const userCommand = new GetCommand(userParams);
//       const userResponse = await dynamoDb.send(userCommand);

//       if (!userResponse.Item || !userResponse.Item.resume) {
//         return NextResponse.json({ error: "Resume not found." }, { status: 404 });
//       }

//       // Generate a signed URL for the resume
//       const command = new GetObjectCommand({
//         Bucket: process.env.BUCKET_NAME,
//         Key: userResponse.Item.resume,
//       });

//       const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiration
//       return NextResponse.json({ signedUrl });
//     } catch (error) {
//       console.error("Error fetching resume:", error);
//       return NextResponse.json({ message: "Server error" }, { status: 500 });
//     }
//   }
