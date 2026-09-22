import { fetchapi } from '@/lib/refresh-user';
import { handleResponse } from '@/lib/handle-response';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001/api';

export const dashboardApi = {
  getAggregatedData: async () => {
    try {
      const response = await fetchapi(`${API_BASE_URL}/admin/dashboard`);
      return await handleResponse(response, {
        fallbackMessage: 'Failed to fetch dashboard data',
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};
