import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import ruletaRoutes from './ruleta.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuario', userRoutes);
router.use('/ruleta', ruletaRoutes);

export default router;
