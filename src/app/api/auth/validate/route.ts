import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import redisClient from "@/app/lib/redisClient";
export async function GET() {
  //get the cookie and the uuid from the cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) {
    return new Response("no cookie", { status: 400 });
  } else {
    // Fetch the JWT from Redis
    const redisKey = token;
    const storedToken = await redisClient.get(redisKey);

    //if the jwt isnt stored on redis throw 4041 no auth error
    if (!storedToken) {
      return new Response("no auth", { status: 401 });
    } else {
      //if jwt wasnt tampered then send success message and the data back to the user
      const secret_key = process.env.JWT_SECRET || "empty";
      const parsed_token = JSON.parse(storedToken);
      try {
        const verifiedToken = jwt.verify(parsed_token.token, secret_key);
        if (verifiedToken) {
          return new Response(
            JSON.stringify({ message: "Authenticated", user: verifiedToken }),
            { status: 200 }
          );
        }
      } catch (e) {
        console.log(e);
        return new Response("Unauthorized", { status: 500 });
      }
    }
  }
}
