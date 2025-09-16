import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { QueryCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, s3Client } from "@/app/lib/dynamoClient";
import redisClient from "@/app/lib/redisClient";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

// ===== ENV =====
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const JWT_SECRET = process.env.JWT_SECRET || "empty";
const USERS_TABLE = process.env.DYNAMODB_TABLE_NAME!;
const EMAIL_INDEX = "email-index";           // your GSI
const BUCKET_NAME = process.env.BUCKET_NAME!;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Small helper: fetch Google photo -> JPEG buffer
async function fetchAndProcessGooglePhoto(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Google photo");
  const arrayBuf = await res.arrayBuffer();
  const buf = Buffer.from(arrayBuf);

  // normalize to a nice JPEG to avoid weird formats
  return sharp(buf).resize(512, 512, { fit: "cover" }).jpeg({ quality: 88 }).toBuffer();
}

// Upload avatar to S3 and return the key we stored
async function uploadAvatarToS3(userId: string, jpegBuffer: Buffer) {
  const key = `avatars/${userId}.jpg`;
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: jpegBuffer,
      ContentType: "image/jpeg",
      ACL: "private",
    })
  );
  return key;
}

export async function POST(req: Request) {
  try {
    const { idToken, overwriteAvatar = false } = await req.json();

    if (!idToken) {
      return NextResponse.json({ message: "Missing idToken" }, { status: 400 });
    }

    // 1) Verify token with Google
    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return NextResponse.json({ message: "Invalid Google token" }, { status: 401 });
    }

    const email = payload.email;
    const googleSub = payload.sub || "";
    const gName = payload.name || "";
    const gPicture = payload.picture || ""; // external URL

    // 2) Look up user by email (link if found)
    const q = new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: EMAIL_INDEX,
      KeyConditionExpression: "email = :emailVal",
      ExpressionAttributeValues: { ":emailVal": email },
      Limit: 1,
    });
    const result = await dynamoDb.send(q);
    let user = result.Items?.[0];

    let userId: string;
    let shouldUploadAvatar = false;

    if (user) {
      // Existing account: link Google (no duplicate)
      userId = user.id as string;

      // Decide whether to upload/update avatar:
      // - If no S3-backed profile picture yet, upload Google photo
      // - If client passed overwriteAvatar=true, replace it
      if (!user.profilePicture || overwriteAvatar) {
        // only attempt if Google gave us a picture URL
        shouldUploadAvatar = Boolean(gPicture);
      }

      await dynamoDb.send(
        new UpdateCommand({
          TableName: USERS_TABLE,
          Key: { id: userId },
          UpdateExpression:
            "SET provider = :p, googleSub = :s, #n = if_not_exists(#n, :n), updatedAt = :u",
          ExpressionAttributeNames: { "#n": "name" },
          ExpressionAttributeValues: {
            ":p": user.provider || "google",
            ":s": googleSub,
            ":n": user.name || gName,
            ":u": new Date().toISOString(),
          },
        })
      );
    } else {
      // New user (first Google sign-in)
      userId = uuidv4();
      const now = new Date().toISOString();

      user = {
        id: userId,
        email,
        name: gName,
        provider: "google",
        googleSub,
        createdAt: now,
        updatedAt: now,
      };

      await dynamoDb.send(
        new PutCommand({
          TableName: USERS_TABLE,
          Item: user,
        })
      );

      // if Google has a picture, we can upload it now
      shouldUploadAvatar = Boolean(gPicture);
    }

    // 3) If needed, upload avatar to S3 and update user.profilePicture key
    if (shouldUploadAvatar && gPicture) {
      try {
        const jpeg = await fetchAndProcessGooglePhoto(gPicture);
        const key = await uploadAvatarToS3(userId, jpeg);

        await dynamoDb.send(
          new UpdateCommand({
            TableName: USERS_TABLE,
            Key: { id: userId },
            UpdateExpression: "SET profilePicture = :pp, updatedAt = :u",
            ExpressionAttributeValues: {
              ":pp": key,
              ":u": new Date().toISOString(),
            },
            ReturnValues: "UPDATED_NEW",
          })
        );
      } catch (e) {
        // Non-fatal: continue login even if avatar upload fails
        console.error("Avatar upload failed:", e);
      }
    }

    // 4) Create your app session (JWT + Redis + cookie), same as your email/password route
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
    const sessionId = uuidv4();

    const response = NextResponse.json({
      message: "Google login success",
      userId,
    });

    response.headers.set("Cache-Control", "no-store");
    response.cookies.set("auth-token", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    await redisClient.set(sessionId, JSON.stringify({ token }), { EX: 86400 });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
