import { fetchapi } from '@/lib/refresh-user';
import { handleResponse } from '@/lib/handle-response';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001/api';

export const dashboardApi = {
  getAggregatedData: async () => {
    try {
      const response = await fetchapi(
        `${API_BASE_URL}/citizen/dashboard`
      );

      return await handleResponse(response);
    } catch (error) {
      console.error('Dashboard API error:', error);
      throw error;
    }
  },
};