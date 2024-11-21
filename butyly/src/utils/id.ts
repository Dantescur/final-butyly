import { randomUUID } from "node:crypto";

export const generateShortId = (): string => {
	return randomUUID().slice(0, 8);
};
