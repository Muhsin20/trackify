import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL, // Use the Redis container or local Redis
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

await redisClient.connect();

export default redisClient;
