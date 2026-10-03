import { Router } from 'express';
import { createApplicationController } from './controllers/create-application.controller';
import { getMyApplicationsController } from './controllers/get-my-applications.controller';
import { markAsAppliedController } from './controllers/mark-as-applied.controller';
import { removeApplicationController } from './controllers/remove-application.controller';
import { getApplicationStatsController } from './controllers/get-application-stats.controller';
import { getRecentApplicationsController } from './controllers/get-recent-applications.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Basic CRUD and analytics for application tracking
router.get('/stats', getApplicationStatsController);
router.get('/recent', getRecentApplicationsController);
router.get('/user', getMyApplicationsController);
router.get('/my', getMyApplicationsController);
router.post('/initiate/:schemeId', (req, res) => {
  req.body = { ...req.body, schemeId: req.params.schemeId };
  return createApplicationController(req as any, res);
});
router.post('/', createApplicationController);
router.patch('/:id/status', markAsAppliedController);
router.patch('/:id/apply', markAsAppliedController);
router.delete('/:id', removeApplicationController);

export default router;
