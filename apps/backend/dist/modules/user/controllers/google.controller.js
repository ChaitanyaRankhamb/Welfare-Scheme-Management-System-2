"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCallbackController = void 0;
const google_service_1 = require("../services/google.service");
const appError_1 = require("../../../Error/appError");
const googleCallbackController = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new appError_1.AppError("User not found from passport", 400);
        }
        const { accessToken, refreshToken, existingUser } = await (0, google_service_1.handleGoogleLoginService)(user);
        if (!existingUser.isUserActive())
            // Set refresh token in HTTP-only cookie if desired, but for now just redirect
            // back to the frontend with the access token in the query params.
            // In production, consider a more secure way to pass tokens. maybe cookies!
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
        const citizenDashboardUrl = process.env.FRONTEND_URL || "http://localhost:3001/citizenDashboard";
        const adminDashboardUrl = process.env.FRONTEND_URL || "http://localhost:3001/adminDashboard";
        return res.redirect(`${existingUser.getRole() === "admin" ? adminDashboardUrl : citizenDashboardUrl}`);
    }
    catch (error) {
        next(error);
    }
};
exports.googleCallbackController = googleCallbackController;
