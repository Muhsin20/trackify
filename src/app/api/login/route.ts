import { dynamoDb } from "../../lib/dynamoClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import redisClient from "../../lib/redisClient";
import bcrypt from "bcrypt";
//use uiuid for  amazon dynamo db to create user id

//route to handle login
export async function POST(request: Request) {
  const { email, password } = await request.json();
  const secret_key = process.env.JWT_SECRET || "empty";
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    IndexName: "email-index", // index by email
    KeyConditionExpression: "email = :emailVal",
    ExpressionAttributeValues: {
      ":emailVal": email,
    },
  };
  // return res.status(200).json({ message: "Login successful" });

  try {
    //get the response from the db and if its in the db create a session and send a success response else reject
    const command = new QueryCommand(params);
    const response = await dynamoDb.send(command);
    if (response.Items && response.Items.length > 0) {
      const user = response.Items[0];
      const hash = user.password;
      const result = await bcrypt.compare(password, hash);
      if (result) {
        //create jwt token
        const token = jwt.sign({ id: user.id }, secret_key, {
          expiresIn: "1d",
        });

        //create uuid and store id in cookie and store the id as a key in redis with jwt as value
        const id = uuidv4();
        const response = NextResponse.json({
          message: "Success your logged in!",
          user,
        });
        response.cookies.set(`auth-token`, id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use HTTPS in production
          path: "/",
          sameSite: "strict",
          maxAge: 60 * 60 * 24,
        });
        redisClient.set(id, JSON.stringify({ token }), {
          EX: 86400,
        });
        return response;
      } else {
        return NextResponse.json(
          { message: "Invalid password" },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
