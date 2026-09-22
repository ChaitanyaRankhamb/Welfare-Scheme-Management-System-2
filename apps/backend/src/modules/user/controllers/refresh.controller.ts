import { Request, Response, NextFunction } from "express";
import { refreshService } from "../services/refresh.service";
import {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
} from "../../../utils/cookie.utils";

/**
 * Controller to handle token refresh requests.
 * The refresh token is stored only in Redis (backend-side).
 * We identify the user by their expired access token.
 */
export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 3. Fetch the refresh token from cookies.
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // 4. Call the service to rotate the tokens
    // The service verifies the refresh token and updates it in Redis
    const { accessToken, refreshToken: newRefreshToken } =
      await refreshService(refreshToken);

    // 5. Store the new access token in the same cookie that authMiddleware reads.
    // Without this, the retried request still sends the old (expired) cookie,
    // and refresh appears to "not work".
    res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
    res.cookie(
      "refreshToken",
      newRefreshToken,
      getRefreshTokenCookieOptions(),
    );

    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};
