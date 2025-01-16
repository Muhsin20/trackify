import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import redisClient from "@/app/lib/redisClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Select } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";
import dynamoDb from "../../lib/dynamoClient";
/* eslint-disable no-unused-vars */

const getApplicationsByStatus = async (userId: string, status: string) => {
  const params = {
    TableName: "Applications",
    IndexName: "userIdStatusIndex", // Your GSI
    KeyConditionExpression: "user_id = :userId AND #status = :status",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const command = new QueryCommand(params);
  const response = await dynamoDb.send(command);
  return response.Items || [];
};
const getApplicationsByYear = async (userId: string, year: number) => {
  const params = {
    TableName: "Applications",
    IndexName: "UserIdYearIndex", // GSI with user_id and created_year
    KeyConditionExpression: "user_id = :userId AND created_year = :year",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":year": year,
    },
  };

  const command = new QueryCommand(params);
  const response = await dynamoDb.send(command);

  // Group applications by month
  const applicationsData = Array.from({ length: 12 }, (_, index) => ({
    month: new Date(0, index).toLocaleString("default", { month: "long" }),
    applications: 0,
  }));

  response.Items?.forEach((application) => {
    const month = application.created_month;
    const monthIndex = applicationsData.findIndex(
      (data) => data.month === month
    );
    if (monthIndex !== -1) {
      applicationsData[monthIndex].applications++;
    }
  });

  return applicationsData;
};

export async function GET() {
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

  try {
    // ** Query applications by different statuses **
    const interviewApplications = await getApplicationsByStatus(
      userId,
      "Interview Scheduled"
    );
    const offerApplications = await getApplicationsByStatus(
      userId,
      "Offer Received"
    );
    const rejectionApplications = await getApplicationsByStatus(
      userId,
      "Rejected"
    );
    const currentYear = new Date().getFullYear();
    const monthlyCounts = await getApplicationsByYear(userId, currentYear);

    return NextResponse.json({
      message: "Applications by status returned successfully",

      applications: {
        "Interview Scheduled": {
          count: interviewApplications.length,
          data: interviewApplications,
        },
        "Offer Received": {
          count: offerApplications.length,
          data: offerApplications,
        },
        "Rejected Applications": {
          count: rejectionApplications.length,
          data: rejectionApplications,
        },
        "application length": {
          count: app_length,
        },
        "Month Counts": {
          data: monthlyCounts,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching applications by status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
