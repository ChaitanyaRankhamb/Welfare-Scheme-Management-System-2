import { Router } from 'express';
import { StreamQueryController } from './controllers/stream-query.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { routeBasedRateLimiter } from '../../middlewares/route-based-rate-limiter.middleware';

const router = Router();

router.get(
  '/stream',
  authMiddleware,
  routeBasedRateLimiter(10),
  StreamQueryController,
);

export default router;
