import { createLogger, format, transports } from "winston";

const logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.printf(
			({ level, message, timestamp }) =>
				`${timestamp} [${level.toUpperCase()}]: ${message}`,
		),
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: "logs/error.log", level: "error" }),
		new transports.File({ filename: "logs/combined.log" }),
	],
});

export const stream = {
	write: (message: string) => logger.info(message.trim()),
};

export default logger;
