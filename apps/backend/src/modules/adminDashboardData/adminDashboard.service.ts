import { UserModel } from '../../database/mongo/models/user.model';
import { SchemeModel } from '../../database/mongo/models/scheme.model';
import { ApplicationModel } from '../../database/mongo/models/application.model';
import { AppError } from '../../Error/appError';
import { Role } from '../../types/roles.enum';

export class AdminDashboardService {
  async getAggregatedData(adminId: string) {
    // Step 1: Validate Admin
    const admin = await UserModel.findById(adminId);
    if (!admin || admin.role !== Role.ADMIN) {
      throw new AppError('Access forbidden: Admins only', 403);
    }

    // Step 2: Fetch Aggregated Data in Parallel
    const [
      totalUsers,
      totalActiveUsers,
      totalDeactivatedUsers,
      usersList,
      totalSchemes,
      totalDraftedSchemes,
      totalPublishedSchemes,
      totalArchivedSchemes,
      schemesList,
      totalApplications,
      applicationStats,
      totalApplied,
      totalInitiated,
      applicationsList
    ] = await Promise.all([
      // Users Data
      UserModel.countDocuments(),
      UserModel.countDocuments({ isActive: true }),
      UserModel.countDocuments({ isActive: false }),
      UserModel.find().sort({ createdAt: -1 }).limit(10),

      // Schemes Data
      // Updated scheme status system: active/deactive → drafted/published/archived
      SchemeModel.countDocuments(),
      SchemeModel.countDocuments({ status: 'drafted' }),
      SchemeModel.countDocuments({ status: 'published' }),
      SchemeModel.countDocuments({ status: 'archived' }),
      SchemeModel.find().sort({ createdAt: -1 }).limit(10),

      // Applications Data
      ApplicationModel.countDocuments({ isDeleted: false }),
      ApplicationModel.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      ApplicationModel.countDocuments({ status: 'APPLIED', isDeleted: false }),
      ApplicationModel.countDocuments({ status: 'INITIATED', isDeleted: false }),
      ApplicationModel.find({ isDeleted: false })
        .populate('userId', 'email username')
        .populate('schemeId', 'title')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    // Format application status counts
    const statusCounts = {
      approved: 0, // Not in schema yet, but requested
      rejected: 0, // Not in schema yet, but requested
      pending: 0,   // Mapping INITIATED to pending for dashboard purposes if needed
      applied: totalApplied,
      initiated: totalInitiated
    };

    applicationStats.forEach((stat: any) => {
      if (stat._id === 'APPLIED') statusCounts.pending = stat.count; // Usually APPLIED is pending review
      if (stat._id === 'INITIATED') statusCounts.initiated = stat.count;
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

export const adminDashboardService = new AdminDashboardService();
