import type { ApplicationId } from './applicationId';
import { UserId } from '../user/userId';
import { SchemeId } from '../schemes/schemeId';

export type ApplicationStatus = 'INITIATED' | 'APPLIED' | 'REJECTED';

export class Application {
  constructor(
    public readonly id: ApplicationId,
    private userId: UserId,
    private schemeId: SchemeId,
    private status: ApplicationStatus,
    private isDeleted: boolean,
    private createdAt: Date,
    private updatedAt: Date,
    private appliedAt?: Date
  ) {}

  getUserId(): UserId {
    return this.userId;
  }

  getSchemeId(): SchemeId {
    return this.schemeId;
  }

  getStatus(): ApplicationStatus {
    return this.status;
  }

  getIsDeleted(): boolean {
    return this.isDeleted;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getAppliedAt(): Date | undefined {
    return this.appliedAt;
  }

  updateStatus(status: ApplicationStatus): void {
    if (this.isDeleted) return;
    this.status = status;
    if (status === 'APPLIED') {
      this.appliedAt = new Date();
    }
    this.touch();
  }

  remove(): void {
    this.isDeleted = true;
    this.touch();
  }

  restore(): void {
    this.isDeleted = false;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
