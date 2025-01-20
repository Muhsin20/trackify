import { dynamoDb, s3Client } from "@/app/lib/dynamoClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { QueryCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from "next/headers";
import redisClient from "@/app/lib/redisClient";
import jwt from "jsonwebtoken";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
// /pages/api/hash.js
import crypto, { sign } from "crypto";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No cookie found" }, { status: 400 });
    }

    const storedToken = await redisClient.get(token);
    if (!storedToken) {
      return new Response("No auth", { status: 401 });
    }

    const secret_key = process.env.JWT_SECRET || "empty";
    const parsed_token = JSON.parse(storedToken);
    const verifiedToken = jwt.verify(
      parsed_token.token,
      secret_key
    ) as jwt.JwtPayload;
    const userId = verifiedToken.id;

    // Fetch the user record from DynamoDB
    const userParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { id: userId },
    };
    const userCommand = new GetCommand(userParams);
    const userResponse = await dynamoDb.send(userCommand);

    if (!userResponse.Item || !userResponse.Item.profilePicture) {
      return NextResponse.json(
        { error: "Profile picture not found." },
        { status: 404 }
      );
    }

    // Generate a signed URL for the resume (this is profile change)
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: userResponse.Item.profilePicture,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    }); // 1 hour expiration
    console.log(`signed url is ${signedUrl}`);
    return NextResponse.json({ message: signedUrl }, { status: 200 });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
