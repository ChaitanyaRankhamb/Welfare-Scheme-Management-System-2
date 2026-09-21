import { fetchapi } from '@/lib/refresh-user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

export const applicationApi = {
  initiate: async (schemeId: string) => {
    const response = await fetchapi(`${API_BASE_URL}/applications/initiate/${schemeId}`, {
      method: 'POST',
    });
    return response.json();
  },

  getUserApplications: async () => {
    const response = await fetchapi(`${API_BASE_URL}/applications/user`);
    return response.json();
  },

  getApplicationByScheme: async (schemeId: string) => {
    const response = await fetchapi(`${API_BASE_URL}/applications/scheme/${schemeId}`);
    return response.json();
  },

  updateStatus: async (id: string, status: 'APPLIED' | 'REJECTED') => {
    const response = await fetchapi(`${API_BASE_URL}/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  getStats: async () => {
    const response = await fetchapi(`${API_BASE_URL}/applications/stats`);
    return response.json();
  },

  getAll: async (skip = 0, limit = 50, status?: string) => {
    let url = `${API_BASE_URL}/applications?skip=${skip}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    const response = await fetchapi(url);
    return response.json();
  },

  getRecent: async (limit = 5, isAdmin = false) => {
    const response = await fetchapi(`${API_BASE_URL}/applications/recent?limit=${limit}&isAdmin=${isAdmin}`);
    return response.json();
  }
};
