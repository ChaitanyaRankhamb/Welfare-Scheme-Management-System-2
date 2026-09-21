import { Router } from 'express';
import { HandleQueryController } from './controllers/handle-query.controller';
import { StreamQueryController } from './controllers/stream-query.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/query', authMiddleware, HandleQueryController );

router.get('/stream', authMiddleware, StreamQueryController);

export default router;
