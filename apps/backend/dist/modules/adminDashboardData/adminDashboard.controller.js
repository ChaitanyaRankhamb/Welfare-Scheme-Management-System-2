"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboardData = void 0;
const adminDashboard_service_1 = require("./adminDashboard.service");
const appError_1 = require("../../Error/appError");
const getAdminDashboardData = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            throw new appError_1.AppError('Unauthorized: User not found', 401);
        }
        const data = await adminDashboard_service_1.adminDashboardService.getAggregatedData(user.id);
        return res.status(200).json({
            success: true,
            data
        });
    }
    catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};
exports.getAdminDashboardData = getAdminDashboardData;
