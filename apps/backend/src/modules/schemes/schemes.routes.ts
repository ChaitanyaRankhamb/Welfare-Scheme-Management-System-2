import { Router } from 'express';
import { searchSchemesController } from './controllers/search-schemes.controller';
import { getSchemeByIdController } from './controllers/get-scheme-by-id.controller';
import { getSchemesController } from './controllers/get-schemes.controller';
import { routeBasedRateLimiter } from '../../middlewares/route-based-rate-limiter.middleware';

const router = Router();

router.get('/search', routeBasedRateLimiter(40), searchSchemesController);
router.get('/:id', routeBasedRateLimiter(60), getSchemeByIdController);
router.get('/', routeBasedRateLimiter(60), getSchemesController);

export default router;
