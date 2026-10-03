import {
  Notification,
  NotificationData,
  NotificationStatus,
  NotificationType,
} from "../entity/notification/notification.entity";

export interface CreateNotificationData {
  userId: string;
  schemeId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  workflowId: string;
  status?: NotificationStatus;
}

export interface INotificationRepository {
  createNotification(data: CreateNotificationData): Promise<Notification>;
  findNotificationByUserAndScheme(
    userId: string,
    schemeId: string,
    type: NotificationType,
  ): Promise<Notification | null>;
  findNotificationByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Notification | null>;
  findNotificationsByUserId(
    userId: string,
    skip?: number,
    limit?: number,
    unreadOnly?: boolean,
  ): Promise<{ notifications: Notification[]; total: number }>;
  findAllNotificationsByUserId(userId: string): Promise<Notification[]>;
  countUnreadByUserId(userId: string): Promise<number>;
  markAllAsReadByUserId(userId: string): Promise<number>;
  updateNotification(
    id: string,
    notification: Notification,
  ): Promise<Notification | null>;
}
