import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/role';

const router = Router();

router.get('/', getProfile);
router.put('/', authenticate, isAdmin, updateProfile);

export default router;