import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import redisClient from "@/app/lib/redisClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse, NextRequest } from "next/server";
import { dynamoDb } from "@/app/lib/dynamoClient";

type InterviewItem = {
  application_id: string;
  title: string;
  company: string;
  interview_at: string; // ISO UTC
  url?: string;

  // computed, client-local flags
  isPastLocal: boolean;          // before today (local)
  isTodayLocal: boolean;         // today (local)
  hasPassedTodayLocal: boolean;  // today and time already passed
  isFutureLocal: boolean;        // after today (local)
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    // client timezone offset minutes (from Date().getTimezoneOffset())
    const offsetMinParam = url.searchParams.get("offsetMin");
    const offsetMin = Number.isFinite(Number(offsetMinParam))
      ? Number(offsetMinParam)
      : 0;
    const offsetMs = offsetMin * 60_000;

    // --- auth ---
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "No cookie found" }, { status: 400 });

    const storedToken = await redisClient.get(token);
    if (!storedToken) return NextResponse.json({ error: "No auth" }, { status: 401 });

    const secret_key = process.env.JWT_SECRET || "empty";
    const parsed_token = JSON.parse(storedToken);
    const verified = jwt.verify(parsed_token.token, secret_key) as jwt.JwtPayload;
    const userId = verified.id;

    // --- collect all items ---
    const collectParams = {
      TableName: "Applications",
      KeyConditionExpression: "user_id = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    };

    let allItems: any[] = [];
    let lek: Record<string, any> | undefined = undefined;
    do {
      const resp = await dynamoDb.send(
        new QueryCommand({ ...collectParams, ExclusiveStartKey: lek })
      );
      allItems = allItems.concat(resp.Items ?? []);
      lek = resp.LastEvaluatedKey;
    } while (lek);

    // build today's LOCAL window using client offset
    const nowUTC = Date.now();
    const nowLocalTs = nowUTC - offsetMs;

    const startLocal = new Date(nowLocalTs);
    startLocal.setHours(0, 0, 0, 0);
    const startLocalTs = startLocal.getTime();

    const endLocal = new Date(nowLocalTs);
    endLocal.setHours(23, 59, 59, 999);
    const endLocalTs = endLocal.getTime();

    const interviews: InterviewItem[] = allItems
      .filter((it) => it.status === "Interview Scheduled" && typeof it.interview_at === "string")
      .map((it) => {
        const utc = new Date(it.interview_at);
        const utcTs = utc.getTime();

        // convert that UTC timestamp into the client's local timeline
        const localTs = utcTs - offsetMs;

        const isTodayLocal = localTs >= startLocalTs && localTs <= endLocalTs;
        const isPastLocal = localTs < startLocalTs;
        const isFutureLocal = localTs > endLocalTs;
        const hasPassedTodayLocal = isTodayLocal && localTs <= nowLocalTs;

        return {
          application_id: it.application_id,
          title: it.title,
          company: it.company,
          interview_at: it.interview_at,
          url: it.url,
          isPastLocal,
          isTodayLocal,
          hasPassedTodayLocal,
          isFutureLocal,
        };
      })
      .sort((a, b) => new Date(a.interview_at).getTime() - new Date(b.interview_at).getTime());

    return NextResponse.json({ interviews }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
