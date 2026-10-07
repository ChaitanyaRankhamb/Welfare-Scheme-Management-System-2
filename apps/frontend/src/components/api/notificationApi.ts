import { fetchapi } from "@/lib/refresh-user";
import { handleResponse } from "@/lib/handle-response";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001/api";

export interface NotificationItem {
  id: string;
  type: "scheme_match" | "system";
  title: string;
  message: string;
  readAt?: string;
  createdAt: string;
  data: {
    title: string;
    description: string;
    applicationUrl?: string;
  };
}

interface NotificationResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface AllNotificationsResponse {
  success: boolean;
  data: { items: NotificationItem[] };
  message: string;
}

export const notificationApi = {
  getAllNotifications: async () => {
    const response = await fetchapi(`${API_BASE_URL}/notifications/all`);
    return handleResponse<AllNotificationsResponse>(response, {
      fallbackMessage: "Failed to fetch notifications",
    });
  },

  getUnreadCount: async () => {
    const response = await fetchapi(
      `${API_BASE_URL}/notifications/unread-count`,
    );
    return handleResponse<NotificationResponse<{ count: number }>>(response);
  },

  getNotifications: async (unread = false, limit = 20) => {
    const query = new URLSearchParams({ page: "1", limit: String(limit) });
    if (unread) query.set("unread", "true");

    const response = await fetchapi(
      `${API_BASE_URL}/notifications?${query.toString()}`,
    );
    return handleResponse<
      NotificationResponse<{
        items: NotificationItem[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>
    >(response);
  },

  markAsRead: async (notificationId: string) => {
    const response = await fetchapi(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      { method: "PATCH" },
    );
    return handleResponse<NotificationResponse<NotificationItem>>(response);
  },

  markAllAsRead: async () => {
    const response = await fetchapi(`${API_BASE_URL}/notifications/read-all`, {
      method: "PATCH",
    });
    return handleResponse<NotificationResponse<{ updatedCount: number }>>(
      response,
    );
  },
};
