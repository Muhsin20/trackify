import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import redisClient from "@/app/lib/redisClient";
import dynamoDb from "@/app/lib/dynamoClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function GET() {
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
      return new Response("no auth", { status: 401 });
    } else {
      //if jwt wasnt tampered then send success message and the data back to the user
      const secret_key = process.env.JWT_SECRET || "empty";
      const parsed_token = JSON.parse(storedToken);
      try {
        const verifiedToken = jwt.verify(
          parsed_token.token,
          secret_key
        ) as jwt.JwtPayload;
        if (verifiedToken) {
          const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME, // The DynamoDB table name
            KeyConditionExpression: "id = :id", // Query by the partition key "id"
            ExpressionAttributeValues: {
              ":id": verifiedToken.id, // Replace "userId" with the actual value you're querying for
            },
          };

          // return res.status(200).json({ message: "Login successful" });

          //get the response from the db and if its in the db create a session and send a success response else reject
          const command = new QueryCommand(params);
          const response = await dynamoDb.send(command);
          if (response.Items && response.Items.length > 0) {
            const user = response.Items[0];
            const email = user.email;
            const username = user.username;
            const userObj = {
              email: email,
              username: username,
              id: verifiedToken.id,
            };
            return new Response(
              JSON.stringify({ message: "Authenticated", user: userObj }),
              { status: 200 }
            );
          }
        } else {
          return new Response(JSON.stringify({ error: "Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
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
