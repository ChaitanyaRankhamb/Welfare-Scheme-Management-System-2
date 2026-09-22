import { fetchapi } from "@/lib/refresh-user";
import { handleResponse } from "@/lib/handle-response";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001/api";

export const schemeAPI = {
  /**
   * Creates a new government scheme.
   * // Updated scheme status system: active/deactive → drafted/published/archived
   */
  createScheme: async (data: unknown) => {
    try {
      const url = `${API_BASE_URL}/admin/schemes`;

      const response = await fetchapi(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await handleResponse(response, {
        fallbackMessage: "Failed to create scheme",
      });
    } catch (error) {
      console.error("Error creating scheme:", error);
      throw error;
    }
  },

  /**
   * Updates an existing government scheme by ID.
   */
  updateScheme: async (id: string, data: unknown) => {
    try {
      const url = `${API_BASE_URL}/admin/schemes/${id}`;

      const response = await fetchapi(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await handleResponse(response, {
        fallbackMessage: "Failed to update scheme",
      });
    } catch (error) {
      console.error("Error updating scheme:", error);
      throw error;
    }
  },

  /**
   * Updates the status of a scheme (publish, archive, restore).
   */
  updateSchemeStatus: async (
    id: string,
    action: "publish" | "archive" | "restore",
  ) => {
    try {
      console.log(id, action);
      const url = `${API_BASE_URL}/admin/schemes/${id}/${action}`;

      const response = await fetchapi(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await handleResponse(response, {
        fallbackMessage: `Failed to ${action} scheme`,
      });
    } catch (error) {
      console.error(`Error during ${action} action:`, error);
      throw error;
    }
  },

  /**
   * Deletes a scheme (Only if drafted).
   */
  deleteScheme: async (id: string) => {
    try {
      const url = `${API_BASE_URL}/admin/schemes/${id}`;
      const response = await fetchapi(url, { method: "DELETE" });
      return await handleResponse(response, {
        fallbackMessage: "Failed to delete scheme",
      });
    } catch (error) {
      console.error("Error deleting scheme:", error);
      throw error;
    }
  },

  /**
   * Fetches schemes for admin with pagination and status filtering.
   * // Added getSchemes for admin with pagination
   */
  getSchemes: async (page: number = 1, limit: number = 10, status?: string) => {
    try {
      let url = `${API_BASE_URL}/admin/schemes?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;

      const response = await fetchapi(url, { method: "GET" });

      return await handleResponse(response, {
        fallbackMessage: "Failed to fetch schemes",
      });
    } catch (error) {
      console.error("Error fetching schemes:", error);
      throw error;
    }
  },
};
