"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rbac_middleware_1 = require("../../middlewares/rbac.middleware");
const roles_enum_1 = require("../../types/roles.enum");
const adminDashboard_controller_1 = require("./adminDashboard.controller");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/admin/dashboard
 * @desc    Get aggregated data for admin dashboard
 * @access  Private (Admin only)
 */
router.get('/dashboard', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.authorizeRoles)(roles_enum_1.Role.ADMIN), adminDashboard_controller_1.getAdminDashboardData);
exports.default = router;
