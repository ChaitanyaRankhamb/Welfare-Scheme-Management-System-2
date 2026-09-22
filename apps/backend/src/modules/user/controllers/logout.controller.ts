import { Request, Response, NextFunction } from "express";
import { logoutService } from "../services/logout.service";
import { verifyRefreshToken } from "../../../utils/jwt.utils";
import { getClearCookieOptions } from "../../../utils/cookie.utils";

/**
 * Controller to handle user logout requests
 */
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    let userId: string | undefined;

    if (refreshToken) {
      try {
        userId = verifyRefreshToken(refreshToken).userId;
      } catch {
        // The session is already invalid; cookies still need to be cleared.
      }
    }

    if (userId) {
      await logoutService(userId);
    }

    res.clearCookie("accessToken", getClearCookieOptions());
    res.clearCookie("refreshToken", getClearCookieOptions());

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
