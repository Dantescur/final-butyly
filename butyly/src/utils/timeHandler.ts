export const formatTime = (seconds: number): string => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const reminder = seconds % 60;

	let timeString = "";
	if (hours > 0) {
		timeString += `${hours} hour${hours > 1 ? "s" : ""}`;
	}
	if (minutes > 0) {
		timeString += `${minutes} minute${minutes > 1 ? "s" : ""}`;
	}
	if (reminder > 0) {
		timeString += `${reminder} second${reminder > 1 ? "s" : ""}`;
	}

	return timeString;
};

export const parseExpiration = (input: string): number => {
	const timeUnits: Record<string, number> = {
		s: 1,
		m: 60,
		h: 3600,
		d: 86400,
	};

	const match = input.match(/^(\d+)([smhd])$/);
	if (!match) throw new Error("Invalid expiration format");

	const [, value, unit] = match;
	return Number.parseInt(value, 10) * timeUnits[unit];
};
