import { Types } from 'mongoose';
import { IApplication } from '../../../database/mongo/models/application.model';

export class GetApplicationByIdService {
  public async getApplicationById(
    userId: string | Types.ObjectId,
    applicationId: string | Types.ObjectId
  ): Promise<IApplication | null> {
    throw new Error('Not implemented');
  }
}

export const getApplicationByIdService = new GetApplicationByIdService();
