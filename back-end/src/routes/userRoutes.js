import { Router } from 'express';
import { register, login, me } from '../controllers/userController.js';
import { authMiddleware } from '../utils/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);

export default router;