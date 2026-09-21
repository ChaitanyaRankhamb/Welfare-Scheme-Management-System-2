import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { createApplicationService } from '../service/create-application.service';
import { createApplicationSchema } from '../../../validations/application.validation';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Initiates a new application for a scheme.
 * @param {AuthRequest} req - Authenticated Request (expects schemeId in body)
 * @param {Response} res - Express Response
 * @returns {Promise<Response>}
 * @flow
 * 1. Extract userId from AuthRequest
 * 2. Validate Input using Zod
 * 3. Call CreateApplicationService
 * 4. Send success/error response
 */
export const createApplicationController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) throw new AppError('Unauthorized', 401);

    // Validate Input
    const validation = createApplicationSchema.safeParse({ body: req.body });
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const { schemeId } = validation.data.body;

    const result = await createApplicationService(userId, schemeId);
    
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || 500);
  }
};
