import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import redisClient from "@/app/lib/redisClient";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient, Select } from "@aws-sdk/client-dynamodb";
import { NextResponse, NextRequest } from "next/server";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dynamoDb from "../../lib/dynamoClient";
// export async function POST(request: Request) {
//   const { currPage } = await request.json();

//   console.log(`current page in backend is ${currPage}`);
//   //get the cookie and the uuid from the cookie
//   const cookieStore = await cookies();
//   const token = cookieStore.get("auth-token")?.value;
//   if (!token) {
//     return new Response(JSON.stringify({ error: "No cookie found" }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     });
//   } else {
//     // Fetch the JWT from Redis
//     const redisKey = token;
//     const storedToken = await redisClient.get(redisKey);

//     //if the jwt isnt stored on redis throw 4041 no auth error
//     if (!storedToken) {
//       return new Response("no auth", { status: 401 });
//     } else {
//       //if jwt wasnt tampered then send success message and the data back to the user
//       const secret_key = process.env.JWT_SECRET || "empty";
//       const parsed_token = JSON.parse(storedToken);
//       try {
//         const verifiedToken = jwt.verify(
//           parsed_token.token,
//           secret_key
//         ) as jwt.JwtPayload;
//         const userId = verifiedToken.id || "";
//         console.log(`id is ${userId} `);
//         const length_params = {
//           TableName: "Applications",
//           KeyConditionExpression: "user_id = :userId",
//           ExpressionAttributeValues: {
//             ":userId": userId,
//           },
//           Select: Select.COUNT, // Only return the count of matching items
//         };

//         const length_command = new QueryCommand(length_params);
//         const length_response = await dynamoDb.send(length_command);
//         const app_length = length_response.Count;
//         console.log(`length in be is ${app_length}`);
//         let limit = 10;
//         // Convert page number to an offset
//         let offset = (Number(currPage) - 1) * Number(limit); // For example: page 2 => offset = 10

//         const params = {
//           TableName: "Applications",
//           KeyConditionExpression: "user_id = :userId",
//           ExpressionAttributeValues: {
//             ":userId": userId,
//           },
//           Limit: Number(limit), // 10 items per page
//         };

//         let lastEvaluatedKey = null;
//         let pageIndex = 1;
//         if (currPage == 1) {
//           const command = new QueryCommand(params);
//           const response = await dynamoDb.send(command);
//           console.log(`before sending length is ${app_length}`);
//           return new Response(
//             JSON.stringify({
//               message: "Applications Returned",
//               applications: response.Items || [],
//               applications_length: app_length,
//             }),
//             { status: 200 }
//           );
//         } else {
//           //if there are multiple pages offset the data by the page number
//           //last evaluated key is for starting the query to the next batch of applications
//           while (pageIndex < Number(currPage)) {
//             const command: any = new QueryCommand({
//               ...params,
//               ExclusiveStartKey: lastEvaluatedKey || undefined, // Ensure this is undefined if null
//             });
//             const response: any = await dynamoDb.send(command);

//             // No more data available for further pages
//             if (!response.LastEvaluatedKey) {
//               console.log("Reached end of data");
//               break; // Exit loop if no more pages
//             }

//             lastEvaluatedKey = response.LastEvaluatedKey; // Move to the next "page"
//             pageIndex++;
//           }

//           // Fetch the results for the requested page
//           const finalCommand = new QueryCommand({
//             ...params,
//             ExclusiveStartKey: lastEvaluatedKey || undefined,
//           });
//           const finalResponse = await dynamoDb.send(finalCommand);

//           return new Response(
//             JSON.stringify({
//               message: "Applications Returned",
//               applications: finalResponse.Items || [],
//               applications_length: app_length,
//             }),
//             { status: 200 }
//           );
//         }
//       } catch (e) {
//         console.log(e);
//         return new Response(JSON.stringify({ error: "Server Error" }), {
//           status: 500,
//           headers: { "Content-Type": "application/json" },
//         });
//       }
//     }
//   }
// }

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const currPage = parseInt(searchParams.get("page") || "1", 10);

  console.log(`Fetching applications for page: ${currPage}`);

  // Extract user token and verify as usual
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
  const length_params = {
    TableName: "Applications",
    KeyConditionExpression: "user_id = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
    Select: Select.COUNT, // Only return the count of matching items
  };

  const length_command = new QueryCommand(length_params);
  const length_response = await dynamoDb.send(length_command);
  const app_length = length_response.Count;
  console.log(`length in be is ${app_length}`);
  const limit = 10; // Number of applications per page
  let lastEvaluatedKey = null;
  let pageIndex = 1;

  const params = {
    TableName: "Applications",
    KeyConditionExpression: "user_id = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
    Limit: limit,
  };

  // Loop to reach the correct page
  while (pageIndex < currPage) {
    const command: any = new QueryCommand({
      ...params,
      ExclusiveStartKey: lastEvaluatedKey || undefined,
    });

    const response: any = await dynamoDb.send(command);

    if (!response.LastEvaluatedKey && pageIndex < Number(currPage)) {
      break; // Break out of loop but don’t return empty data unless needed
    }

    lastEvaluatedKey = response.LastEvaluatedKey;
    pageIndex++;
  }

  // Fetch the data for the requested page
  const finalCommand = new QueryCommand({
    ...params,
    ExclusiveStartKey: lastEvaluatedKey || undefined,
  });
  const finalResponse = await dynamoDb.send(finalCommand);

  return new Response(
    JSON.stringify({
      message: "Applications Returned",
      applications: finalResponse.Items || [],
      applications_length: app_length,
    }),
    { status: 200 }
  );
}
