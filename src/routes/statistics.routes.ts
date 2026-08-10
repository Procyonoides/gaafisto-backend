import { Router } from 'express';
import { getStats } from '../controllers/statistics.controller';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/role';

const router = Router();

router.get('/', authenticate, isAdmin, getStats);

export default router;