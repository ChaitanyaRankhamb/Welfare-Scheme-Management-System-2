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
import { routeBasedRateLimiter } from '../../middlewares/route-based-rate-limiter.middleware';

const router = Router();

// Apply authentication and ADMIN role requirement to ALL routes here
router.use(authMiddleware, authorizeRoles(Role.ADMIN));

// Schemes Management
router.get('/schemes', routeBasedRateLimiter(60), getAdminSchemesController);
router.post('/schemes', routeBasedRateLimiter(20), createSchemeController);
router.put('/schemes/:id', routeBasedRateLimiter(20), updateSchemeController);
router.delete('/schemes/:id', routeBasedRateLimiter(20), deleteSchemeController);
router.patch('/schemes/:id/:action', routeBasedRateLimiter(20), updateSchemeStatusController);

// Applications Management
router.get('/applications', routeBasedRateLimiter(60), getApplicationsController);
router.patch('/applications/:id/status', routeBasedRateLimiter(30), updateApplicationStatusController);

// User Management
router.get('/users', routeBasedRateLimiter(60), getUsersController);
router.patch('/users/:id/status', routeBasedRateLimiter(20), toggleUserStatusController);
router.get('/users/:id/applications', routeBasedRateLimiter(60), getUserApplicationsController);
router.get('/users/:id/profile', routeBasedRateLimiter(60), getUserProfileController);

export default router;
