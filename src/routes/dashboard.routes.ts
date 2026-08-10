import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/role';

const router = Router();

router.get('/', authenticate, isAdmin, getDashboardStats);

export default router;