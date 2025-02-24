import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { dynamoDb } from "@/app/lib/dynamoClient";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId, applicationId } = body;

    if (!userId || !applicationId) {
      return NextResponse.json(
        { error: "Both userId and applicationId are required" },
        { status: 400 }
      );
    }

    const params = {
      TableName: "Applications",
      Key: {
        user_id: userId,
        application_id: applicationId,
      },
    };

    await dynamoDb.send(new DeleteCommand(params));

    return NextResponse.json(
      {statusCode: 200, message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DynamoDB Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}