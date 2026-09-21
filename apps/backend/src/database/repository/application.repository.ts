import { IApplicationRepository, CreateApplicationData } from '../../repository/application.repository';
import { ApplicationId } from '../../entity/application/applicationId';
import { UserId } from '../../entity/user/userId';
import { SchemeId } from '../../entity/schemes/schemeId';
import { ApplicationModel } from '../mongo/models/application.model';
import { Application } from '../../entity/application/application.entity';

export class ApplicationModelRepo implements IApplicationRepository {

  private mapToDomain(doc: any): Application {
    const userIdStr = doc.userId?._id ? doc.userId._id.toString() : doc.userId.toString();
    const schemeIdStr = doc.schemeId?._id ? doc.schemeId._id.toString() : doc.schemeId.toString();

    // Attach basic user/scheme data if populated for view usage (optional, but helpful for frontend)
    const app = new Application(
      new ApplicationId(doc._id.toString()),
      new UserId(userIdStr),
      new SchemeId(schemeIdStr),
      doc.status,
      doc.isDeleted,
      doc.createdAt,
      doc.updatedAt,
      doc.appliedAt
    );

    // If populated, we might want to attach them, but the Application entity doesn't have fields for them.
    // For now, we'll just handle them as plain objects in controllers if needed, or update Entity.
    // Given the constraints, let's keep Entity pure.
    return app;
  }

  async createApplication(data: CreateApplicationData): Promise<Application> {
    const newDoc = new ApplicationModel({
      userId: data.userId,
      schemeId: data.schemeId,
      status: data.status,
      isDeleted: data.isDeleted,
      appliedAt: data.appliedAt
    });

    const savedDoc = await newDoc.save();
    return this.mapToDomain(savedDoc);
  }

  async findApplicationById(id: string): Promise<Application | null> {
    const doc = await ApplicationModel.findById(id).populate('userId').populate('schemeId');
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async findApplicationsByUserId(userId: string, includeDeleted: boolean = false, skip = 0, limit = 20): Promise<{ applications: Application[]; total: number }> {
    const query: any = { userId };
    if (!includeDeleted) {
      query.isDeleted = false;
    }
    const [docs, total] = await Promise.all([
      ApplicationModel.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).populate('schemeId'),
      ApplicationModel.countDocuments(query)
    ]);
    return {
      applications: docs.map(doc => this.mapToDomain(doc)),
      total
    };
  }

  async findAllApplications(skip = 0, limit = 20, filters: any = {}): Promise<{ applications: Application[]; total: number }> {
    const query: any = { ...filters };
    const [docs, total] = await Promise.all([
      ApplicationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId').populate('schemeId'),
      ApplicationModel.countDocuments(query)
    ]);
    return {
      applications: docs.map(doc => this.mapToDomain(doc)),
      total
    };
  }

  async findApplicationByUserAndScheme(userId: string, schemeId: string): Promise<Application | null> {
    const doc = await ApplicationModel.findOne({ userId, schemeId });
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async updateApplication(id: string, application: Application): Promise<Application | null> {
    const updatedDoc = await ApplicationModel.findByIdAndUpdate(
      id,
      {
        status: application.getStatus(),
        isDeleted: application.getIsDeleted(),
        appliedAt: application.getAppliedAt(),
      },
      { new: true }
    );

    if (!updatedDoc) return null;
    return this.mapToDomain(updatedDoc);
  }

  async getApplicationStats(): Promise<any> {
    const [total, initiated, applied, rejected] = await Promise.all([
      ApplicationModel.countDocuments({ isDeleted: false }),
      ApplicationModel.countDocuments({ status: 'INITIATED', isDeleted: false }),
      ApplicationModel.countDocuments({ status: 'APPLIED', isDeleted: false }),
      ApplicationModel.countDocuments({ status: 'REJECTED', isDeleted: false }),
    ]);

    const calcPercentage = (count: number) => total > 0 ? Math.round((count / total) * 100) : 0;

    return {
      total,
      initiated,
      applied,
      rejected,
      appliedPercentage: calcPercentage(applied),
      rejectedPercentage: calcPercentage(rejected),
      initiatedPercentage: calcPercentage(initiated),
    };
  }

  async findRecentApplications(limit: number, userId?: string): Promise<any[]> {
    const query: any = { isDeleted: false };
    if (userId) query.userId = userId;

    const docs = await ApplicationModel.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('userId')
      .populate('schemeId');
    
    return docs; // Returning docs directly as they are populated and easier to use in controllers for frontend
  }
}

export const applicationRepository = new ApplicationModelRepo();
