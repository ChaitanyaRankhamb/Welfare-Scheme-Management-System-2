import { Request, Response, NextFunction } from 'express';
import { getApplicationByIdService } from '../service/get-application-by-id.service';

export class GetApplicationByIdController {
  public async getApplicationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as any)._id;
      const { id } = req.params;
      const app = await getApplicationByIdService.getApplicationById(userId, id);

      if (!app) {
        res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
        return;
      }

      res.status(200).json({ success: true, data: app });
    } catch (error) {
      next(error);
    }
  }
}

export const getApplicationByIdController = new GetApplicationByIdController();
