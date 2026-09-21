"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = void 0;
const logout_service_1 = require("../services/logout.service");
/**
 * Controller to handle user logout requests
 */
const logoutController = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (userId) {
            await (0, logout_service_1.logoutService)(userId);
        }
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logoutController = logoutController;
