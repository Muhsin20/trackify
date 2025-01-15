import dynamoDb from "../../lib/dynamoClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import redisClient from "../../lib/redisClient";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

//route to handle login
export async function POST(request: Request) {
  //get the cookie and the uuid from the cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "No cookie found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    // Fetch the JWT from Redis
    const redisKey = token;
    const storedToken = await redisClient.get(redisKey);

    //if the jwt isnt stored on redis throw 4041 no auth error
    if (!storedToken) {
      return new Response("Store Error", { status: 401 });
    } else {
      //if jwt wasnt tampered then send success message and the data back to the user
      const secret_key = process.env.JWT_SECRET || "empty";
      const parsed_token = JSON.parse(storedToken);
      try {
        const verifiedToken = jwt.verify(parsed_token.token, secret_key);
        if (verifiedToken) {
          redisClient.del(redisKey);
          (await cookies()).delete("auth-token");
          return new Response(
            JSON.stringify({
              message: "Successfully Deleted Cookie",
            }),
            { status: 200 }
          );
        }
      } catch (e) {
        console.log(e);
        return new Response(JSON.stringify({ error: "Server Error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  }
}
