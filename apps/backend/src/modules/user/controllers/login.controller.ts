import { Request, Response, NextFunction } from "express";
import { loginService } from "../services/login.service";
import { loginValidation } from "../../../validations/user.login.validation";
import {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
} from "../../../utils/cookie.utils";

/**
 * Controller to handle user login requests and set tokens
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // extract email from req body
    const { email } = req.body;

    // validate email
    const validation = await loginValidation(email);

    console.log("validated Email", validation);

    // take user and tokens from service
    const { accessToken, refreshToken } = await loginService(validation.email);

    res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    // error handling middleware return the error
    next(error);
  }
};
