import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import * as bcrypt from "bcrypt";
export async function handler(event: any) {
  const body = JSON.parse(event.body);
  const { username, email, password } = body;
  console.log("Parsed Payload:", { username, email, password });
  // Initialize DynamoDB client
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1", // Use a default region
  });
  console.log("before dynamo");
  console.log(`table name is ${process.env.DYNAMODB_TABLE_NAME}`);
  const dynamoDb = DynamoDBDocumentClient.from(client);
  //index by email
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    IndexName: "email-index", // index by email
    KeyConditionExpression: "email = :emailVal",
    ExpressionAttributeValues: {
      ":emailVal": email,
    },
  };

  //if email is not within db check if username is in db else throw 404 error saying email in use
  const command = new QueryCommand(params);
  const response = await dynamoDb.send(command);
  console.log("DynamoDB PutCommand Params:", params);
  console.log("DynamoDB Query Response:", response);
  if (!response.Items || response.Items.length === 0) {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      IndexName: "username-index", // index by email
      KeyConditionExpression: "username = :usernameVal",
      ExpressionAttributeValues: {
        ":usernameVal": username,
      },
    };

    //if username not within db add user to db else throw 404 error saying username in use
    const command = new QueryCommand(params);
    const response = await dynamoDb.send(command);
    if (!response.Items || response.Items.length === 0) {
      const id = uuidv4();
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      try {
        const params = {
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Item: {
            id,
            email,
            password: hash,
            username,
          },
        };
        console.log("DynamoDB PutCommand Params:", params);

        const response = await dynamoDb.send(new PutCommand(params));
        console.log("DynamoDB PutCommand Response:", response);

        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Success your registered!" }),
        };
      } catch (e: any) {
        console.error("DynamoDB PutCommand Error:", e);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Server Error", error: e.message }),
        };
      }
    } else {
      return {
        statusCode: 404,
        body: { message: "Username is already in use" },
      };
    }
  } else {
    return {
      statusCode: 404,
      body: { message: "Email is already in use" },
    };
  }
}
