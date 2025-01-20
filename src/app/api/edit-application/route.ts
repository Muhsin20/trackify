import { NextResponse } from "next/server";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { dynamoDb } from "@/app/lib/dynamoClient";

export async function POST(request: Request) {
  const { user_id, newStatus, application_id } = await request.json();
  console.log(`application id is: ${application_id}`);

  if (!user_id) {
    return NextResponse.json(
      { message: "No user ID provided" },
      { status: 400 }
    );
  }

  const params = {
    TableName: "Applications",
    KeyConditionExpression: "user_id = :userId AND application_id = :appId",
    ExpressionAttributeValues: {
      ":userId": user_id,
      ":appId": application_id,
    },
  };

  try {
    // Query the database to check if the application exists
    const command = new QueryCommand(params);
    const response = await dynamoDb.send(command);

    if (response.Items && response.Items.length > 0) {
      console.log("Application found, updating...");
      const update_params = {
        TableName: "Applications",
        Key: {
          user_id: user_id, // Partition key
          application_id: application_id, // Sort key
        },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": newStatus,
        },
        ReturnValues: ReturnValue.ALL_NEW,
      };

      // Update the application status
      const update_command = new UpdateCommand(update_params);
      const update_response = await dynamoDb.send(update_command);

      console.log("Updated Item:", update_response.Attributes);

      return NextResponse.json({
        statusCode: 200,
        message: "Job Application Edited!",
        updatedAttributes: update_response.Attributes,
      });
    } else {
      // If the application does not exist, return 404
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
