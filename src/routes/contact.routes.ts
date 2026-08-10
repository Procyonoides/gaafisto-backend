import { Router } from 'express';
import { getContact, updateContact, sendMessage } from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/role';

const router = Router();

router.get('/', getContact);
router.put('/', authenticate, isAdmin, updateContact);
router.post('/send', sendMessage);

export default router;