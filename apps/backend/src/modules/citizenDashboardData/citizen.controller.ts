import { UserId } from "../../entity/user/userId";
import { AppError } from "../../Error/appError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { citizenDataService } from "./citizen.service";
import { NextFunction, Response } from "express";


export const citizenDataController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("Unauthorized User", 400);
    }

    // call service
    const data = await citizenDataService(new UserId(userId.toString()));

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
}
    