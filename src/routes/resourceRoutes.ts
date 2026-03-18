import { Router } from 'express';
import { create } from '../controllers/resourceController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, create);

export default router;