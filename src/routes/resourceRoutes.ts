import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { create, getMyResources } from '../controllers/resourceController';

const router = Router();

router.post('/', authMiddleware, create);
router.get('/', authMiddleware, getMyResources);

export default router;