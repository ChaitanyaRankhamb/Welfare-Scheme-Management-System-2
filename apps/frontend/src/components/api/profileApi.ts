import { fetchapi } from '@/lib/refresh-user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

export const profileApi = {
  /**
   * Fetches the current user's profile
   */
  getProfile: async () => {
    try {
      const response = await fetchapi(`${API_BASE_URL}/profile`);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  },

  /**
   * Updates user profile section
   */
  updateSection: async (section: string, data: any) => {
    try {
      const response = await fetchapi(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, data }),
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  },
};
