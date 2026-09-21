import { Application } from '../entity/application/application.entity';
import type { ApplicationStatus } from '../entity/application/application.entity';

export interface CreateApplicationData {
  userId: string;
  schemeId: string;
  status?: ApplicationStatus;
  isDeleted?: boolean;
  appliedAt?: Date;
}

export interface ApplicationStats {
  total: number;
  initiated: number;
  applied: number;
  rejected: number;
  appliedPercentage: number;
  rejectedPercentage: number;
  initiatedPercentage: number;
}

export interface IApplicationRepository {
  createApplication(applicationData: CreateApplicationData): Promise<Application>;
  findApplicationById(id: string): Promise<Application | null>;
  findApplicationsByUserId(userId: string, includeDeleted?: boolean, skip?: number, limit?: number): Promise<{ applications: Application[]; total: number }>;
  findAllApplications(skip?: number, limit?: number, filters?: any): Promise<{ applications: Application[]; total: number }>;
  findApplicationByUserAndScheme(userId: string, schemeId: string): Promise<Application | null>;
  updateApplication(id: string, application: Application): Promise<Application | null>;
  getApplicationStats(): Promise<ApplicationStats>;
  findRecentApplications(limit: number, userId?: string): Promise<Application[]>;
}
