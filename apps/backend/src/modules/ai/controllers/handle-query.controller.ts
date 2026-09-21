import { Response, NextFunction } from 'express';
import { handleQueryService } from '../service/handle-query.service';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { UserId } from '../../../entity/user/userId';

export const HandleQueryController = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query } = req.body;
      const userId = req.userId;

      if (!query) {
        res.status(400).json({ success: false, message: 'Query string is required' });
        return;
      }

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const response = await handleQueryService(query, new UserId(userId));

      res.status(200).json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  }
