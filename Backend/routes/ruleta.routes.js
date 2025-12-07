import { Router } from 'express';
import { jugarRuleta } from '../controllers/ruleta.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/apostar', authMiddleware, jugarRuleta);

export default router;
