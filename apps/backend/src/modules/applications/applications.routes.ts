import { Router } from 'express';
import { createApplicationController } from './controllers/create-application.controller';
import { getMyApplicationsController } from './controllers/get-my-applications.controller';
import { markAsAppliedController } from './controllers/mark-as-applied.controller';
import { removeApplicationController } from './controllers/remove-application.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Basic CRUD for application tracking
router.post('/', createApplicationController);
router.get('/my', getMyApplicationsController);
router.patch('/:id/apply', markAsAppliedController);
router.delete('/:id', removeApplicationController);

export default router;
