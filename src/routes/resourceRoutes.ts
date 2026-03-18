import { Router } from 'express';
import { create } from '../controllers/resourceController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, create);

export default router;