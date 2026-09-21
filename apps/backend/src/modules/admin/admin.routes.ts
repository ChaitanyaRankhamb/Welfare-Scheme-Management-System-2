import { Router } from 'express';
import { createSchemeController } from './controllers/create-scheme.controller';
import { deleteSchemeController } from './controllers/delete-scheme.controller';
import { getApplicationsController } from './controllers/get-applications.controller';
import { updateApplicationStatusController } from './controllers/update-application-status.controller';
import { getUsersController } from './controllers/get-users.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { Role } from '../../types/roles.enum';
import { updateSchemeController } from './controllers/update-scheme.controller';
import { updateSchemeStatusController } from './controllers/update-scheme-status.controller';

import { getAdminSchemesController } from './controllers/get-schemes.controller';

import { toggleUserStatusController } from './controllers/toggle-user-status.controller';
import { getUserApplicationsController } from './controllers/get-user-applications.controller';
import { getUserProfileController } from './controllers/get-user-profile.controller';

const router = Router();

// Apply authentication and ADMIN role requirement to ALL routes here
router.use(authMiddleware, authorizeRoles(Role.ADMIN));

// Schemes Management
// Pagination applied using skip & limit
router.get('/schemes', getAdminSchemesController);
router.post('/schemes', createSchemeController);
router.put('/schemes/:id', updateSchemeController);
router.delete('/schemes/:id', deleteSchemeController);
// Updated scheme status system: active/deactive → drafted/published/archived
router.patch('/schemes/:id/:action', updateSchemeStatusController);

// Applications Management
router.get('/applications', getApplicationsController);
router.patch('/applications/:id/status', updateApplicationStatusController);

// User Management
router.get('/users', getUsersController);
router.patch('/users/:id/status', toggleUserStatusController);
router.get('/users/:id/applications', getUserApplicationsController);
router.get('/users/:id/profile', getUserProfileController);

export default router;
