import axios from "axios";
import type { ShortenedUrl, LinkAnalytics, LinkDetails } from "./types";

const api = axios.create({
  baseURL: "",
});

export const shortenUrl = async (
  originalUrl: string,
  expiration?: string,
): Promise<ShortenedUrl> => {
  const { data } = await api.post("/shorten", { originalUrl, expiration });
  return data;
};

export const getAnalytics = async (
  id: string,
  page = 1,
  limit = 10,
): Promise<LinkAnalytics> => {
  const { data } = await api.get(`/analytics/${id}`, {
    params: { page, limit },
  });
  return data;
};

export const getAllLinks = async (): Promise<{
  totalLinks: number;
  links: LinkDetails[];
}> => {
  const { data } = await api.get("/links");
  return data;
};

