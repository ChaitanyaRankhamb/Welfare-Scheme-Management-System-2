import { Router } from 'express';
import { createApplicationController } from './controllers/create-application.controller';
import { getMyApplicationsController } from './controllers/get-my-applications.controller';
import { markAsAppliedController } from './controllers/mark-as-applied.controller';
import { removeApplicationController } from './controllers/remove-application.controller';
import { getApplicationStatsController } from './controllers/get-application-stats.controller';
import { getRecentApplicationsController } from './controllers/get-recent-applications.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { routeBasedRateLimiter } from '../../middlewares/route-based-rate-limiter.middleware';

const router = Router();

router.use(authMiddleware);

// Basic CRUD and analytics for application tracking
router.get('/stats', routeBasedRateLimiter(40), getApplicationStatsController);
router.get('/recent', routeBasedRateLimiter(40), getRecentApplicationsController);
router.get('/user', routeBasedRateLimiter(60), getMyApplicationsController);
router.get('/my', routeBasedRateLimiter(60), getMyApplicationsController);
router.post(
  '/initiate/:schemeId',
  routeBasedRateLimiter(15),
  (req, res) => {
    req.body = { ...req.body, schemeId: req.params.schemeId };
    return createApplicationController(req as any, res);
  },
);
router.post('/', routeBasedRateLimiter(15), createApplicationController);
router.patch('/:id/status', routeBasedRateLimiter(20), markAsAppliedController);
router.patch('/:id/apply', routeBasedRateLimiter(20), markAsAppliedController);
router.delete('/:id', routeBasedRateLimiter(20), removeApplicationController);

export default router;
