import dynamoDb from "../../lib/dynamoClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import redisClient from "../../lib/redisClient";
import bcrypt from "bcrypt";
//use uiuid for  amazon dynamo db to create user id

//route to handle login
export async function POST(request: Request) {
  const { user_id, title, description, status, url, company } =
    await request.json();

  //we have to index this by user id

  const params = {
    TableName: "Applications",
    KeyConditionExpression: "user_id = :userId",
    ExpressionAttributeValues: {
      ":userId": user_id,
    },
  };

  try {
    const command = new QueryCommand(params);
    const response = await dynamoDb.send(command);
    try {
      const id = uuidv4();
      const date = new Date(); // Current date
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const params = {
        TableName: "Applications",
        Item: {
          user_id: user_id,
          application_id: id,
          title,
          description,
          status,
          url,
          company,
          created_month: month,
          created_year: year,
        },
      };
      const response = await dynamoDb.send(new PutCommand(params));
      console.log("DynamoDB PutCommand Response:", response);

      return NextResponse.json({
        statusCode: 200,
        body: JSON.stringify({ message: "Job Application Added!" }),
      });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
