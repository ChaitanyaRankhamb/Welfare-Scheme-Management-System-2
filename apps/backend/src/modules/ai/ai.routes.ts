import { Router } from 'express';
import { StreamQueryController } from './controllers/stream-query.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/stream', authMiddleware, StreamQueryController);

export default router;
