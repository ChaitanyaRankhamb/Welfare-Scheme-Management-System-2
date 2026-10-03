import mongoose, { Document, Schema, Types } from "mongoose";
import type {
  NotificationData,
  NotificationStatus,
  NotificationType,
} from "../../../entity/notification/notification.entity";

export interface INotification extends Document {
  userId: Types.ObjectId;
  schemeId?: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  workflowId: string;
  status: NotificationStatus;
  readAt?: Date;
  sentAt?: Date;
  failedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    schemeId: { type: Schema.Types.ObjectId, ref: "Scheme", index: true },
    type: { type: String, enum: ["scheme_match", "user_status", "system"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      benefits: { type: [String], default: [] },
      requiredDocuments: { type: [String], default: [] },
      applicationUrl: { type: String, default: "" },
      username: { type: String },
      isActive: { type: Boolean },
      status: { type: String },
    },
    workflowId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    readAt: { type: Date },
    sentAt: { type: Date },
    failedAt: { type: Date },
  },
  { timestamps: true },
);

//using this index, mongodb directly jumps the subset of the documents with the given userId and sorts them by createdAt in descending order. This is useful for fetching the latest notifications for a user.
notificationSchema.index({ userId: 1, createdAt: -1 });

// This index is useful for efficiently querying unread notifications for a specific user. It allows MongoDB to quickly locate documents with the given userId and readAt set to null, which indicates that the notification has not been read yet.
notificationSchema.index({ userId: 1, readAt: 1 });

export const NotificationModel = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
