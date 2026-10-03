import { Types } from "mongoose";
import {
  Notification,
  NotificationSnapshot,
} from "../../entity/notification/notification.entity";
import { UserId } from "../../entity/user/userId";
import {
  CreateNotificationData,
  INotificationRepository,
} from "../../repository/notification.repository";
import { NotificationModel } from "../mongo/models/notification.model";

export class NotificationModelRepo implements INotificationRepository {
  private mapToDomain(doc: any): Notification {
    const snapshot: NotificationSnapshot = {
      userId: new UserId(doc.userId.toString()),
      schemeId: doc.schemeId?.toString(),
      type: doc.type,
      title: doc.title,
      message: doc.message,
      data: {
        title: doc.data.title,
        description: doc.data.description,
        benefits: doc.data.benefits ?? [],
        requiredDocuments: doc.data.requiredDocuments ?? [],
        applicationUrl: doc.data.applicationUrl ?? "",
        username: doc.data.username,
        isActive: doc.data.isActive,
        status: doc.data.status,
      },
      workflowId: doc.workflowId,
      status: doc.status,
      readAt: doc.readAt,
      sentAt: doc.sentAt,
      failedAt: doc.failedAt,
    };

    return new Notification(
      doc._id.toString(),
      snapshot,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async createNotification(
    data: CreateNotificationData,
  ): Promise<Notification> {
    const doc = await NotificationModel.create({
      userId: new Types.ObjectId(data.userId),
      schemeId: data.schemeId ? new Types.ObjectId(data.schemeId) : undefined,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data,
      workflowId: data.workflowId,
      status: data.status ?? "pending",
    });

    return this.mapToDomain(doc);
  }

  async findNotificationByUserAndScheme(
    userId: string,
    schemeId: string,
    type: CreateNotificationData["type"],
  ): Promise<Notification | null> {
    const doc = await NotificationModel.findOne({
      userId: new Types.ObjectId(userId),
      schemeId: new Types.ObjectId(schemeId),
      type,
    });
    return doc ? this.mapToDomain(doc) : null;
  }

  async findNotificationByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Notification | null> {
    const doc = await NotificationModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    return doc ? this.mapToDomain(doc) : null;
  }

  async findNotificationsByUserId(
    userId: string,
    skip = 0,
    limit = 20,
    unreadOnly = false,
  ) {
    const filter = {
      userId: new Types.ObjectId(userId),
      ...(unreadOnly ? { readAt: { $exists: false } } : {}),
    };
    const [docs, total] = await Promise.all([
      NotificationModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NotificationModel.countDocuments(filter),
    ]);

    return { notifications: docs.map((doc) => this.mapToDomain(doc)), total };
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    return NotificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      readAt: { $exists: false },
    });
  }

  async findAllNotificationsByUserId(userId: string): Promise<Notification[]> {
    const docs = await NotificationModel.find({
      userId: new Types.ObjectId(userId),
    }).sort({ createdAt: -1 }); // it will return all notifications for the user, sorted by createdAt in descending order(createdAt: -1 means the most recent notifications will be first in the list)

    return docs.map((doc) => this.mapToDomain(doc));
  }

  async markAllAsReadByUserId(userId: string): Promise<number> {
    const result = await NotificationModel.updateMany(
      {
        userId: new Types.ObjectId(userId),
        readAt: { $exists: false },
      },
      { $set: { readAt: new Date() } },
    );

    return result.modifiedCount;
  }

  async updateNotification(
    id: string,
    notification: Notification,
  ): Promise<Notification | null> {
    const doc = await NotificationModel.findByIdAndUpdate(
      id,
      {
        status: notification.getStatus(),
        readAt: notification.getReadAt(),
        sentAt: notification.getSentAt(),
        failedAt: notification.getFailedAt(),
      },
      { new: true },
    );

    return doc ? this.mapToDomain(doc) : null;
  }
}

export const notificationRepository = new NotificationModelRepo();
