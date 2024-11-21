import { Router } from "express";
import redisClient from "@services/redis";
import { generateShortId } from "@utils/id";
import isUrl from "validator/lib/isURL";
import { formatTime, parseExpiration } from "@utils/timeHandler";

const router = Router();

const baseURL = "http://localhost:3000";

router.post("/shorten", async (req, res) => {
	const { originalUrl, expiration } = req.body;

	if (!originalUrl || !isUrl(originalUrl)) {
		res.status(400).json({ error: "Must provide a URL" });
		return;
	}

	const shortId = generateShortId();

	const idExists = await redisClient.exists(shortId);
	if (idExists) {
		res.status(409).json({ error: "ID already exists" });
		return;
	}

	let ttl = 86400; // Default to 1 day
	if (expiration && typeof expiration === "string") {
		try {
			ttl = parseExpiration(expiration);
		} catch (err) {
			res.status(400).json({ error: "Invalid expiration format" });
			return;
		}
	}

	await redisClient.setEx(shortId, ttl, originalUrl);

	res.json({
		shortUrl: `${baseURL}/${shortId}`,
		expiresIn: `${formatTime(ttl)}`,
	});
});

router.get("/:id", async (req, res) => {
	const { id } = req.params;
	const originalUrl = await redisClient.get(id);

	if (!originalUrl) {
		res.status(404).json({ error: "URL not found" });
		return;
	}

	const analyticsKey = `analytics:${id}`;
	const clickData = {
		timestamp: new Date().toISOString(),
		userAgent: req.headers["user-agent"] || "unknown",
		ip: req.ip || req.socket.remoteAddress || "unknown",
	};

	await redisClient.rPush(analyticsKey, JSON.stringify(clickData));

	res.redirect(originalUrl);
});

router.get("/analytics/:id", async (req, res) => {
	const { id } = req.params;

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;

	if (Number.isNaN(page) || Number.isNaN(limit)) {
		res.status(400).json({ error: "Page and limit must be valid numbers" });
		return;
	}

	const analyticsKey = `analytics:${id}`;

	const start = (page - 1) * limit;
	const end = start + limit - 1;

	const totalVisits = await redisClient.lLen(analyticsKey);
	const clickData = await redisClient.lRange(analyticsKey, start, end);

	res.json({
		id,
		totalVisits,
		page: Number(page),
		limit: Number(limit),
		details: clickData.map((entry) => JSON.parse(entry)),
	});
});

export default router;