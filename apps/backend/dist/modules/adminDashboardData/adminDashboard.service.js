"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDashboardService = exports.AdminDashboardService = void 0;
const user_model_1 = require("../../database/mongo/models/user.model");
const scheme_model_1 = require("../../database/mongo/models/scheme.model");
const application_model_1 = require("../../database/mongo/models/application.model");
const appError_1 = require("../../Error/appError");
const roles_enum_1 = require("../../types/roles.enum");
class AdminDashboardService {
    async getAggregatedData(adminId) {
        // Step 1: Validate Admin
        const admin = await user_model_1.UserModel.findById(adminId);
        if (!admin || admin.role !== roles_enum_1.Role.ADMIN) {
            throw new appError_1.AppError('Access forbidden: Admins only', 403);
        }
        // Step 2: Fetch Aggregated Data in Parallel
        const [totalUsers, totalActiveUsers, totalDeactivatedUsers, usersList, totalSchemes, totalDraftedSchemes, totalPublishedSchemes, totalArchivedSchemes, schemesList, totalApplications, applicationStats, totalApplied, totalInitiated, applicationsList] = await Promise.all([
            // Users Data
            user_model_1.UserModel.countDocuments(),
            user_model_1.UserModel.countDocuments({ isActive: true }),
            user_model_1.UserModel.countDocuments({ isActive: false }),
            user_model_1.UserModel.find().sort({ createdAt: -1 }).limit(10),
            // Schemes Data
            // Updated scheme status system: active/deactive → drafted/published/archived
            scheme_model_1.SchemeModel.countDocuments(),
            scheme_model_1.SchemeModel.countDocuments({ status: 'drafted' }),
            scheme_model_1.SchemeModel.countDocuments({ status: 'published' }),
            scheme_model_1.SchemeModel.countDocuments({ status: 'archived' }),
            scheme_model_1.SchemeModel.find().sort({ createdAt: -1 }).limit(10),
            // Applications Data
            application_model_1.ApplicationModel.countDocuments({ isDeleted: false }),
            application_model_1.ApplicationModel.aggregate([
                { $match: { isDeleted: false } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            application_model_1.ApplicationModel.countDocuments({ status: 'APPLIED', isDeleted: false }),
            application_model_1.ApplicationModel.countDocuments({ status: 'INITIATED', isDeleted: false }),
            application_model_1.ApplicationModel.find({ isDeleted: false })
                .populate('userId', 'email username')
                .populate('schemeId', 'title')
                .sort({ createdAt: -1 })
                .limit(10)
        ]);
        // Format application status counts
        const statusCounts = {
            approved: 0, // Not in schema yet, but requested
            rejected: 0, // Not in schema yet, but requested
            pending: 0, // Mapping INITIATED to pending for dashboard purposes if needed
            applied: totalApplied,
            initiated: totalInitiated
        };
        applicationStats.forEach((stat) => {
            if (stat._id === 'APPLIED')
                statusCounts.pending = stat.count; // Usually APPLIED is pending review
            if (stat._id === 'INITIATED')
                statusCounts.initiated = stat.count;
        });
        return {
            dashboard: {
                totalUsers,
                totalSchemes,
                totalApplications,
                totalPendingReviews: totalApplied, // Applications that are APPLIED need review
                applicationStatusCounts: {
                    approved: statusCounts.approved,
                    rejected: statusCounts.rejected,
                    pending: totalApplied
                }
            },
            users: {
                totalUsers,
                totalActiveUsers,
                totalDeactivatedUsers,
                usersList
            },
            schemes: {
                totalSchemes,
                totalDraftedSchemes,
                totalPublishedSchemes,
                totalArchivedSchemes,
                schemesList
            },
            applications: {
                totalAppliedApplications: totalApplied,
                totalInitiatedApplications: totalInitiated,
                totalRejectedApplications: 0, // Not tracked yet
                applicationsList
            }
        };
    }
}
exports.AdminDashboardService = AdminDashboardService;
exports.adminDashboardService = new AdminDashboardService();
