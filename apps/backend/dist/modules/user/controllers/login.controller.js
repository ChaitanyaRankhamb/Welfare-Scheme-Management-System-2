"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const login_service_1 = require("../services/login.service");
const user_login_validation_1 = require("../../../validations/user.login.validation");
/**
 * Controller to handle user login requests and set tokens
 */
const loginController = async (req, res, next) => {
    try {
        // extract email from req body
        const { email } = req.body;
        // validate email
        const validation = await (0, user_login_validation_1.loginValidation)(email);
        console.log("validated Email", validation);
        // take user and tokens from service
        const { user, accessToken, refreshToken } = await (0, login_service_1.loginService)(validation.email);
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
        };
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 30 * 60 * 1000, // 30 minutes
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
        });
    }
    catch (error) {
        // error handling middleware return the error
        next(error);
    }
};
exports.loginController = loginController;
