"use client";

import { useEffect, useState } from "react";
import {
  NotificationItem,
  notificationApi,
} from "@/components/api/notificationApi";

export type NotificationTab = "all" | "unread";

export function useNotifications(isLogged: boolean) {
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [isLoading, setIsLoading] = useState(false);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationApi.getAllNotifications();
      setAllNotifications(response.data.items);
      setUnreadCount(response.data.items.filter((item) => !item.readAt).length);
    } catch {
      setAllNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLogged) void loadNotifications();
  }, [isLogged]);

  const selectTab = (tab: NotificationTab) => {
    setActiveTab(tab);
  };

  const markAsRead = async (notificationId: string) => {
    const notification = allNotifications.find(
      (item) => item.id === notificationId,
    );
    if (!notification || notification.readAt) return;

    setAllNotifications((current) =>
      current.map((item) =>
        item.id === notificationId
          ? { ...item, readAt: new Date().toISOString() }
          : item,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - 1));

    try {
      await notificationApi.markAsRead(notificationId);
    } catch {
      setAllNotifications((current) =>
        current.map((item) =>
          item.id === notificationId ? { ...item, readAt: undefined } : item,
        ),
      );
      setUnreadCount((count) => count + 1);
    }
  };

  const markAllAsRead = async () => {
    if (!unreadCount) return;

    const previousNotifications = allNotifications;
    setAllNotifications((current) =>
      current.map((item) => ({
        ...item,
        readAt: item.readAt ?? new Date().toISOString(),
      })),
    );
    setUnreadCount(0);

    try {
      await notificationApi.markAllAsRead();
    } catch {
      setAllNotifications(previousNotifications);
      setUnreadCount(
        previousNotifications.filter((item) => !item.readAt).length,
      );
    }
  };

  return {
    notifications:
      activeTab === "unread"
        ? allNotifications.filter((item) => !item.readAt)
        : allNotifications,
    unreadCount,
    activeTab,
    isLoading,
    selectTab,
    markAsRead,
    markAllAsRead,
  };
}
