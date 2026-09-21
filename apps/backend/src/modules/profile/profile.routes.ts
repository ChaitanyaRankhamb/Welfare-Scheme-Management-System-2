import { Router } from 'express';
import { getProfileController } from './controllers/get-profile.controller';
import { createProfileController } from './controllers/create-profile.controller';
import { updateProfileController } from './controllers/update-profile.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Protect all profile routes
router.use(authMiddleware);

router.get('/', getProfileController);
router.post('/', createProfileController);
router.put('/', updateProfileController);

export default router;
