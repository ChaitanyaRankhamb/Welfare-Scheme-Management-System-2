import { Novu } from "@novu/api";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

const novuSecretKey =
  process.env.NOVU_SECRET_KEY || process.env.NOVU_API_KEY || "";

let novuClient: Novu | null = null;

if (novuSecretKey) {
  try {
    novuClient = new Novu({
      secretKey: novuSecretKey,
      ...(process.env.NOVU_BACKEND_URL && {
        serverURL: process.env.NOVU_BACKEND_URL,
      }),
    });
  } catch (error) {
    console.error("[Novu] Failed to initialize Novu client:", error);
  }
} else {
  console.warn(
    "[Novu] WARNING: NOVU_SECRET_KEY is not defined in environment variables. Novu services will be disabled.",
  );
}

export const novu = novuClient;

export const initializeNovu = async () => {
  if (!novuClient) {
    console.warn(
      "[Novu] Novu client is not initialized. Skipping initialization.",
    );
    return;
  } else {
    try {
      console.log("[Novu] Novu client initialized successfully.");
      // You can add any additional initialization logic here if needed
    } catch (error) {
      console.error("[Novu] Error during Novu initialization:", error);
    }
  }
};
