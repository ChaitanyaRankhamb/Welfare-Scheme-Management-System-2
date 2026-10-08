import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { Role } from '../../types/roles.enum';
import { getAdminDashboardData } from './adminDashboard.controller';
import { routeBasedRateLimiter } from '../../middlewares/route-based-rate-limiter.middleware';

const router = Router();

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get aggregated data for admin dashboard
 * @access  Private (Admin only)
 */
router.get(
  '/dashboard',
  authMiddleware,
  authorizeRoles(Role.ADMIN),
  routeBasedRateLimiter(30),
  getAdminDashboardData,
);

export default router;
