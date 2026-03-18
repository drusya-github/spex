import { Router } from 'express';
import { createResource } from '../controllers/resourceController';
import { protect } from '../middleware/authMiddleware';
import { validateCreateResource } from '../middleware/validateCreateResource';

const router = Router();

router.post('/', protect, validateCreateResource, createResource);

export default router;