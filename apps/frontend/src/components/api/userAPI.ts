import { fetchapi } from '@/lib/refresh-user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

export const userAPI = {
  /**
   * Fetches users with pagination and status filtering
   */
  getUsers: async (page: number = 1, limit: number = 10, status?: string) => {
    let url = `${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`;
    if (status && status !== 'all') {
      url += `&status=${status}`;
    }
    const response = await fetchapi(url, { method: 'GET' });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }
    return response.json();
  },

  /**
   * Toggles the active status of a user
   */
  toggleUserStatus: async (userId: string) => {
    const response = await fetchapi(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user status');
    }
    return response.json();
  },

  /**
   * Fetches detailed profile of a specific user
   */
  getUserProfile: async (userId: string) => {
    const response = await fetchapi(`${API_BASE_URL}/admin/users/${userId}/profile`, {
      method: 'GET',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user profile');
    }
    return response.json();
  },

  /**
   * Fetches applications of a specific user
   */
  getUserApplications: async (userId: string) => {
    const response = await fetchapi(`${API_BASE_URL}/admin/users/${userId}/applications`, {
      method: 'GET',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user applications');
    }
    return response.json();
  }
};
