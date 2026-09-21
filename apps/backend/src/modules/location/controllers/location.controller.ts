import { Request, Response } from 'express';
import {
  getStatesService,
  getDistrictsService,
  getTalukasService,
  getVillagesService
} from '../service/location.service';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { AppError } from '../../../Error/appError';


export const getStates = async (req: AuthRequest, res: Response) => {
  console.log("🎯 [Controller] getStates called");

  try {
    // 1. Check auth data
    const userId = req.userId;
    console.log("👤 [Controller] userId:", userId);

    if (!userId) {
      console.log("❌ [Controller] No userId found");
      throw new AppError('User not authenticated', 401);
    }

    // 2. Call service
    console.log("⚙️ [Controller] Calling getStatesService...");
    const result = await getStatesService();

    // 3. Log service result
    console.log("📊 [Controller] Service result:", result);

    if (!result || !result.data) {
      console.log("❌ [Controller] No data returned from service");
    } else {
      console.log("✅ [Controller] States count:", result.data.length);
    }

    // 4. Send response
    console.log("📤 [Controller] Sending response to client");
    return successResponse(res, result.data, result.message);

  } catch (error: any) {
    console.log("🔥 [Controller] Error occurred:", error);

    return errorResponse(
      res,
      error.message || 'Error fetching states',
      error.statusCode || 500
    );
  }
};

export const getDistricts = async (req: Request, res: Response) => {
  try {
    const { state } = req.query;
    const result = await getDistrictsService(state as string);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error fetching districts', error.statusCode || 500);
  }
};

export const getTalukas = async (req: Request, res: Response) => {
  try {
    const { district } = req.query;
    const result = await getTalukasService(district as string);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error fetching talukas', error.statusCode || 500);
  }
};

export const getVillages = async (req: Request, res: Response) => {
  try {
    const { taluka } = req.query;
    const result = await getVillagesService(taluka as string);
    return successResponse(res, result.data, result.message);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error fetching villages', error.statusCode || 500);
  }
};
