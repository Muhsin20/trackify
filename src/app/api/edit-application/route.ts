import { NextResponse } from "next/server";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { dynamoDb } from "@/app/lib/dynamoClient";

export async function POST(request: Request) {
  const { user_id, newStatus, application_id, interview_at } = await request.json();
  console.log(`application id is: ${application_id}`);

  if (!user_id || !application_id || !newStatus) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  // If interview is being scheduled, require a datetime
  if (newStatus === "Interview Scheduled" && !interview_at) {
    return NextResponse.json({ message: "interview_at is required when scheduling" }, { status: 400 });
  }

  

  // Optional: validate interview_at looks like a real date
  if (interview_at) {
    const d = new Date(interview_at);
    if (isNaN(d.getTime())) {
      return NextResponse.json(
        { message: "interview_at must be a valid datetime (ISO string recommended)" },
        { status: 400 }
      );
    }
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

      // Build dynamic update (set status always; set/remove interview_at)
      let UpdateExpression = "SET #status = :status";
      const ExpressionAttributeNames: Record<string, string> = { "#status": "status" };
      const ExpressionAttributeValues: Record<string, any> = { ":status": newStatus };
      
      // If scheduling, set interview_at; otherwise remove it
      let removePart = "";
      if (newStatus === "Interview Scheduled" && interview_at) {
        UpdateExpression += ", interview_at = :iat";
        ExpressionAttributeValues[":iat"] = interview_at; // ISO string
      } else {
        // If moving away from Interview Scheduled, remove interview_at (safe even if absent)
        removePart = " REMOVE interview_at";
      }

      
      const update_params = {
        TableName: "Applications",
        Key: {
          user_id: user_id, // Partition key
          application_id: application_id, // Sort key
        },
        UpdateExpression: UpdateExpression + removePart,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
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
