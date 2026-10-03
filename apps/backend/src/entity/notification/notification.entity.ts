import { UserId } from "../user/userId";
import { NotificationId } from "./notificationId";

export type NotificationType = "scheme_match" | "user_status" | "system";
export type NotificationStatus = "pending" | "sent" | "failed";

export interface NotificationData {
  title: string;
  description: string;
  benefits?: string[];
  requiredDocuments?: string[];
  applicationUrl?: string;
  username?: string;
  isActive?: boolean;
  status?: string;
}

export interface NotificationSnapshot {
  userId: UserId;
  schemeId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  workflowId: string;
  status: NotificationStatus;
  readAt?: Date;
  sentAt?: Date;
  failedAt?: Date;
}

export class Notification {
  constructor(
    public readonly id: NotificationId,
    private snapshot: NotificationSnapshot,
    public readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {}

  getUserId(): UserId {
    return this.snapshot.userId;
  }
  getSchemeId(): string | undefined {
    return this.snapshot.schemeId;
  }
  getType(): NotificationType {
    return this.snapshot.type;
  }
  getTitle(): string {
    return this.snapshot.title;
  }
  getMessage(): string {
    return this.snapshot.message;
  }
  getData(): Readonly<NotificationData> {
    return this.snapshot.data;
  }
  getWorkflowId(): string {
    return this.snapshot.workflowId;
  }
  getStatus(): NotificationStatus {
    return this.snapshot.status;
  }
  getReadAt(): Date | undefined {
    return this.snapshot.readAt;
  }
  getSentAt(): Date | undefined {
    return this.snapshot.sentAt;
  }
  getFailedAt(): Date | undefined {
    return this.snapshot.failedAt;
  }
  isRead(): boolean {
    return Boolean(this.snapshot.readAt);
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.snapshot.userId.toString(),
      schemeId: this.snapshot.schemeId,
      type: this.snapshot.type,
      title: this.snapshot.title,
      message: this.snapshot.message,
      data: this.snapshot.data,
      workflowId: this.snapshot.workflowId,
      status: this.snapshot.status,
      readAt: this.snapshot.readAt,
      sentAt: this.snapshot.sentAt,
      failedAt: this.snapshot.failedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  markSent(): void {
    this.snapshot.status = "sent";
    this.snapshot.sentAt = new Date();
    this.snapshot.failedAt = undefined;
    this.touch();
  }

  markFailed(): void {
    this.snapshot.status = "failed";
    this.snapshot.failedAt = new Date();
    this.touch();
  }

  markRead(): void {
    if (!this.snapshot.readAt) {
      this.snapshot.readAt = new Date();
      this.touch();
    }
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
