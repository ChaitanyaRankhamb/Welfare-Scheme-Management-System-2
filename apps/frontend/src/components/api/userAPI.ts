import { fetchapi } from "@/lib/refresh-user";
import { handleResponse } from "@/lib/handle-response";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001/api";

export const userAPI = {
  /**
   * Fetches users with pagination and status filtering
   */
  getUsers: async (page: number = 1, limit: number = 10, status?: string) => {
    let url = `${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`;
    if (status && status !== "all") {
      url += `&status=${status}`;
    }
    const response = await fetchapi(url, { method: "GET" });
    return handleResponse(response, {
      fallbackMessage: "Failed to fetch users",
    });
  },

  /**
   * Toggles the active status of a user
   */
  toggleUserStatus: async (userId: string) => {
    const response = await fetchapi(
      `${API_BASE_URL}/admin/users/${userId}/status`,
      {
        method: "PATCH",
      },
    );
    return handleResponse(response, {
      fallbackMessage: "Failed to update user status",
    });
  },

  /**
   * Fetches detailed profile of a specific user
   */
  getUserProfile: async (userId: string) => {
    const response = await fetchapi(
      `${API_BASE_URL}/admin/users/${userId}/profile`,
      {
        method: "GET",
      },
    );
    return handleResponse(response, {
      fallbackMessage: "Failed to fetch user profile",
    });
  },

  /**
   * Fetches applications of a specific user
   */
  getUserApplications: async (userId: string) => {
    const response = await fetchapi(
      `${API_BASE_URL}/admin/users/${userId}/applications`,
      {
        method: "GET",
      },
    );
    return handleResponse(response, {
      fallbackMessage: "Failed to fetch user applications",
    });
  },
};
