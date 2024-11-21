export interface ShortenedUrl {
  shortUrl: string;
  expiresIn: string;
}

export interface LinkAnalytics {
  id: string;
  totalVisits: number;
  page: number;
  limit: number;
  details: ClickData[];
}

export interface ClickData {
  timestamp: string;
  userAgent: string;
  ip: string;
}

export interface LinkDetails {
  shortId: string;
  originalUrl: string;
  expiresIn: string;
}