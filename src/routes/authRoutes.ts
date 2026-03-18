import { Router } from 'express';
import { registerUser } from '../controllers/authController';
import { validateRegister } from '../middleware/validateRegister';

const router = Router();

router.post('/register', validateRegister, registerUser);

export default router;