import { fetchapi } from "@/lib/refresh-user";
import { handleResponse } from "@/lib/handle-response";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";
const AI_QUERY_PATH = "/api/ai/stream";
const AI_QUERY_PATH_WITH_API_BASE = "/ai/stream";

const buildAiQueryUrl = () => {
  const trimmedBaseUrl = API_BASE_URL.replace(/\/+$/, "");
  const path = trimmedBaseUrl.endsWith("/api")
    ? AI_QUERY_PATH_WITH_API_BASE
    : AI_QUERY_PATH;
  return `${trimmedBaseUrl}${path}`;
};

export const handleAiQuery = async (query: string): Promise<Response> => {
  try {
    const url = new URL(buildAiQueryUrl());
    url.searchParams.append("query", query);

    const response = await fetchapi(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "text/event-stream",
      },
    });

    return await handleResponse<Response>(response, {
      fallbackMessage: "Failed to process AI query",
      rawSuccess: true,
    });
  } catch (error) {
    console.error("AI API Error:", error);
    throw error;
  }
};
