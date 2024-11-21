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

// Fetch Redis credentials from environment variables
const redisHost = process.env.REDIS_HOST || "127.0.0.1"; // Default to localhost if not set
const redisPort = parseInt(process.env.REDIS_PORT || "6379"); // Default to port 6379
const redisPassword = process.env.REDIS_PASSWORD || ""; // Default to no password

const redisClient = createClient({
  socket: {
    host: redisHost, // Use the host from Render environment variable
    port: redisPort, // Use the port from Render environment variable
    reconnectStrategy: (attempts) => Math.min(attempts * 100, 3000),
  },
  password: redisPassword, // Use the password from Render environment variable
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
