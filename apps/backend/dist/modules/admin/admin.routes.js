"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_scheme_controller_1 = require("./controllers/create-scheme.controller");
const delete_scheme_controller_1 = require("./controllers/delete-scheme.controller");
const get_applications_controller_1 = require("./controllers/get-applications.controller");
const update_application_status_controller_1 = require("./controllers/update-application-status.controller");
const get_users_controller_1 = require("./controllers/get-users.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rbac_middleware_1 = require("../../middlewares/rbac.middleware");
const roles_enum_1 = require("../../types/roles.enum");
const update_scheme_controller_1 = require("./controllers/update-scheme.controller");
const update_scheme_status_controller_1 = require("./controllers/update-scheme-status.controller");
const get_schemes_controller_1 = require("./controllers/get-schemes.controller");
const toggle_user_status_controller_1 = require("./controllers/toggle-user-status.controller");
const get_user_applications_controller_1 = require("./controllers/get-user-applications.controller");
const get_user_profile_controller_1 = require("./controllers/get-user-profile.controller");
const router = (0, express_1.Router)();
// Apply authentication and ADMIN role requirement to ALL routes here
router.use(auth_middleware_1.authMiddleware, (0, rbac_middleware_1.authorizeRoles)(roles_enum_1.Role.ADMIN));
// Schemes Management
// Pagination applied using skip & limit
router.get('/schemes', get_schemes_controller_1.getAdminSchemesController);
router.post('/schemes', create_scheme_controller_1.createSchemeController);
router.put('/schemes/:id', update_scheme_controller_1.updateSchemeController);
router.delete('/schemes/:id', delete_scheme_controller_1.deleteSchemeController);
// Updated scheme status system: active/deactive → drafted/published/archived
router.patch('/schemes/:id/:action', update_scheme_status_controller_1.updateSchemeStatusController);
// Applications Management
router.get('/applications', get_applications_controller_1.getApplicationsController);
router.patch('/applications/:id/status', update_application_status_controller_1.updateApplicationStatusController);
// User Management
router.get('/users', get_users_controller_1.getUsersController);
router.patch('/users/:id/status', toggle_user_status_controller_1.toggleUserStatusController);
router.get('/users/:id/applications', get_user_applications_controller_1.getUserApplicationsController);
router.get('/users/:id/profile', get_user_profile_controller_1.getUserProfileController);
exports.default = router;
