import { dynamoDb } from "@/app/lib/dynamoClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

//use uiuid for  amazon dynamo db to create user id

//route to handle login
export async function POST(request: Request) {

  
  const { user_id, title, description, status, url, company, interview_at } =
    await request.json();

  if (!user_id || !title || !status) { //added for adding itnerview calendar feature
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  // If scheduling interview, require a datetime
  if (status === "Interview Scheduled" && !interview_at) {
    return NextResponse.json({ message: "interview_at is required when status is Interview Scheduled" }, { status: 400 });
  }


  try {
    const now = new Date();
    const nowISO = new Date().toISOString();
    const nowEpoch = Date.now(); // number for easier sorting/indexing later

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
          created_at: nowISO,         // 👈 add this
          created_at_epoch: nowEpoch,
          created_month: month,
          created_year: year,
          ...(interview_at ? { interview_at } : {}),
        },
      };
      const response = await dynamoDb.send(new PutCommand(params));
      console.log("DynamoDB PutCommand Response:", response);

      return NextResponse.json({
        statusCode: 200,
        item: params.Item,
        //body: JSON.stringify({ message: "Job Application Added!", application_id: id }),
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
