import { Router } from 'express';
import { searchSchemesController } from './controllers/search-schemes.controller';
import { getSchemeByIdController } from './controllers/get-scheme-by-id.controller';
import { getSchemesController } from './controllers/get-schemes.controller';

const router = Router();

router.get('/search', searchSchemesController);
router.get('/:id', getSchemeByIdController);
router.get('/', getSchemesController);

export default router;
