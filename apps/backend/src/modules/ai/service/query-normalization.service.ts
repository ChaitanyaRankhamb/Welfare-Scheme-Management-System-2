import { AppError } from "../../../Error/appError";

export const normalizeQuery = (query: string) => {
  if (!query) {
    throw new AppError("query is not found", 400);
  }

  let normalized = query.toLowerCase();

  // remove special chars
  normalized = normalized.replace(/[^\w\s]/gi, "");

  // trim + remove extra spaces
  normalized = normalized.trim().replace(/\s+/g, " ");

  return normalized;
}