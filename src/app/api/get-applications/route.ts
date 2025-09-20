import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import redisClient from "@/app/lib/redisClient";
import { QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Select } from "@aws-sdk/client-dynamodb";
import { NextResponse, NextRequest } from "next/server";
import { dynamoDb } from "@/app/lib/dynamoClient";

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


// --- fetch ALL items for the user (paginate the Query), then sort & slice ---
const collectParams = {
  TableName: "Applications",
  KeyConditionExpression: "user_id = :userId",
  ExpressionAttributeValues: {
    ":userId": userId,
  },
  // (optional) ProjectionExpression: "application_id, title, company, url, description, status, interview_at, created_at",
};

let allItems: any[] = [];
let lek: Record<string, any> | undefined = undefined;

do {
  const resp = await dynamoDb.send(
    new QueryCommand({
      ...collectParams,
      ExclusiveStartKey: lek,
    })
  );
  allItems = allItems.concat(resp.Items ?? []);
  lek = resp.LastEvaluatedKey;
} while (lek);

// sort DESC by created_at (fallback to 0 when missing)
allItems.sort((a, b) => (b.created_at_epoch ?? 0) - (a.created_at_epoch ?? 0));


// paginate AFTER sorting
const pageSize = 10;
const start = (currPage - 1) * pageSize;
const paged = allItems.slice(start, start + pageSize);

// total length (you already computed app_length; you can also use allItems.length)
return NextResponse.json(
  {
    message: "Applications Returned",
    applications: paged,
    applications_length: app_length ?? allItems.length,
  },
  { status: 200 }
);


  // // Loop to reach the correct page
  // while (pageIndex < currPage) {
  //   const command: QueryCommand = new QueryCommand({
  //     ...params,
  //     ExclusiveStartKey: lastEvaluatedKey || undefined,
  //   });

  //   const response: QueryCommandOutput = await dynamoDb.send(command);

  //   if (!response.LastEvaluatedKey && pageIndex < Number(currPage)) {
  //     break; // Break out of loop but don’t return empty data unless needed
  //   }

  //   lastEvaluatedKey = response.LastEvaluatedKey;
  //   pageIndex++;
  // }


  
  // // Fetch the data for the requested page
  // const finalCommand = new QueryCommand({
  //   ...params,
  //   ExclusiveStartKey: lastEvaluatedKey || undefined,
  // });
  // const finalResponse = await dynamoDb.send(finalCommand);

  

  // return new Response(
  //   JSON.stringify({
  //     message: "Applications Returned",
  //     applications: finalResponse.Items || [],
  //     applications_length: app_length,
  //   }),
  //   { status: 200 }

    
  // );

  

  
}
