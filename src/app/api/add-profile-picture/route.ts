import { dynamoDb, s3Client } from "@/app/lib/dynamoClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
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
  const result = await fileTypeFromBuffer(fileBuffer);

  if (
    !result ||
    ![
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/bmp",
      "image/tiff",
    ].includes(result.mime)
  ) {
    return false; // Invalid file type
  }

  const resizedImage = await sharp(fileBuffer)
    .resize(200, 200, { fit: "cover", position: "center" })
    .toBuffer();

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: name,
    Body: resizedImage,
    ContentType: result.mime,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const updateParams = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: { id: user_id },
    UpdateExpression: "SET #profilePicture = :profilePicture",
    ExpressionAttributeNames: { "#profilePicture": "profilePicture" },
    ExpressionAttributeValues: { ":profilePicture": name },
    ReturnValues: ReturnValue.ALL_OLD,
  };

  const updateCommand = new UpdateCommand(updateParams);
  const updateResponse = await dynamoDb.send(updateCommand);

  // Optionally delete the previous image
  const oldImage = updateResponse.Attributes?.profilePicture;
  if (oldImage) {
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: oldImage,
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  }

  return true;
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

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 2MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageName = s3RandomImgName();
    const funcResult = await uploadFileToS3(buffer, imageName, userID);
    if (funcResult) {
      return NextResponse.json(
        { message: "Success profile image uploaded!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "file is not in correct format" },
        { status: 400 }
      );
    }
  } catch (e) {
    console.error("Error uploading profile image:", e);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
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
