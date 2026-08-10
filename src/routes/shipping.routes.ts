import { Router } from 'express';
import {
  getShippings,
  createShipping,
  updateShipping,
  deleteShipping
} from '../controllers/shipping.controller';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/role';

const router = Router();

router.get('/', getShippings);
router.post('/', authenticate, isAdmin, createShipping);
router.put('/:id', authenticate, isAdmin, updateShipping);
router.delete('/:id', authenticate, isAdmin, deleteShipping);

export default router;