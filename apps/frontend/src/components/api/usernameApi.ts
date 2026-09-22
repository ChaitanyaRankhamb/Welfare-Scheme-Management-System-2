/**
 * API client for username availability related requests
 */

import { fetchapi } from "@/lib/refresh-user";
import { handleResponse } from "@/lib/handle-response";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Checks if a username is available.
 * @param username - The username to check.
 * @returns Object containing availability status.
 */
export const checkUsernameAvailability = async (username: string) => {
  try {
    // pass the username as the query parameter to the backend
    const response = await fetchapi(
      `${API_BASE_URL}/check-username?username=${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await handleResponse(response, {
      fallbackMessage: "Failed to check username",
    });

    return data;
  } catch (error) {
    console.error("Check Username API error:", error);
    throw error;
  }
};
