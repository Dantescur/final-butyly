// import { createClient } from "redis";
//
// const redisClient = createClient({
// 	socket: {
// 		reconnectStrategy: (attempts) => Math.min(attempts * 100, 3000),
// 	},
// });
//
// redisClient.on("error", (err) => {
// 	console.error("Redis error: ", err);
// });
//
// (async () => {
// 	await redisClient.connect();
// 	console.log("Conected to redis");
// })();
//
// process.on("SIGINT", async () => {
// 	await redisClient.quit();
// 	console.log("Redis connection closed");
// 	process.exit(0);
// });
//
// export default redisClient;

import { createClient } from "redis";

// Parse the Redis connection URL provided by Render
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379"; // Default to localhost if not set
const redisClient = createClient({
  url: redisUrl, // Use the full Redis URL
  socket: {
    reconnectStrategy: (attempts) => Math.min(attempts * 100, 3000),
  },
});

redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

(async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
})();

process.on("SIGINT", async () => {
  await redisClient.quit();
  console.log("Redis connection closed");
  process.exit(0);
});

export default redisClient;
