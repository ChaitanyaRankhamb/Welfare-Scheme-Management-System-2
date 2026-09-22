import { fetchapi } from "@/lib/refresh-user";
import { handleResponse } from "@/lib/handle-response";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001/api";

export const applicationApi = {
  initiate: async (schemeId: string) => {
    const response = await fetchapi(
      `${API_BASE_URL}/applications/initiate/${schemeId}`,
      {
        method: "POST",
      },
    );
    return handleResponse(response);
  },

  getUserApplications: async () => {
    const response = await fetchapi(`${API_BASE_URL}/applications/user`);
    return handleResponse(response);
  },

  getApplicationByScheme: async (schemeId: string) => {
    const response = await fetchapi(
      `${API_BASE_URL}/applications/scheme/${schemeId}`,
    );
    return handleResponse(response);
  },

  updateStatus: async (id: string, status: "APPLIED" | "REJECTED") => {
    const response = await fetchapi(
      `${API_BASE_URL}/applications/${id}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await fetchapi(`${API_BASE_URL}/applications/stats`);
    return handleResponse(response);
  },

  getAll: async (skip = 0, limit = 50, status?: string) => {
    let url = `${API_BASE_URL}/applications?skip=${skip}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    const response = await fetchapi(url);
    return handleResponse(response);
  },

  getRecent: async (limit = 5, isAdmin = false) => {
    const response = await fetchapi(
      `${API_BASE_URL}/applications/recent?limit=${limit}&isAdmin=${isAdmin}`,
    );
    return handleResponse(response);
  },
};
