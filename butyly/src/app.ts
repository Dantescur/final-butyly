import path from "node:path";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import dotenv from "dotenv";
import router from "./router";
import morgan from "morgan";
import { limiter } from "@utils/limiter";
import logger, { stream } from "@services/logger";
import helmet from "helmet";
import cors from "cors";

const app = express();

dotenv.config();

const port = Number(process.env.PORT) || 3000;

app.use(helmet());

app.use(express.static(path.join(__dirname, "public")));

const allowedOrigins = process.env.BASE_URL?.split(",") || ["*"];
const isDev = process.env.NODE_ENV === "development";
app.use(cors({ origin: isDev ? "*" : allowedOrigins }));

app.use(morgan("combined", { stream }));

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).send("Hello");
});

app.use("/", router);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(`${req.method} ${req.url} - ${err.message}\n${err.stack}`);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`🚀 Server running at port ${port}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Shutting down gracefully...");
  process.exit(0);
});
