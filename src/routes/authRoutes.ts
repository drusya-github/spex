import { Router, Request, Response } from 'express';
import { login } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);

router.get('/me', protect, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Authenticated user fetched successfully',
    data: {
      user: req.user,
    },
  });
});

export default router;