import { Router } from 'express';
import { createResource } from '../controllers/resourceController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createResource);

export default router;