import { dynamoDb, s3Client } from "@/app/lib/dynamoClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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
    ReturnValues: ReturnValue.ALL_OLD,
  };

  // Update the application status
  const update_command = new UpdateCommand(update_params);
  const update_response = await dynamoDb.send(update_command);
  const oldImage = update_response.Attributes?.resume;
  if (oldImage) {
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: oldImage,
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  }
  //test overriding (meaning user uploads new resume replacing their old one maybe delete the old one?)
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
