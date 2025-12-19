import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  rateProduct 
} from '../controllers/product.controller';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/role';
import { upload } from '../config/multer';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, isAdmin, upload.single('cover'), createProduct);
router.put('/:id', authenticate, isAdmin, upload.single('cover'), updateProduct);
router.delete('/:id', authenticate, isAdmin, deleteProduct);
router.post('/:id/rate', authenticate, rateProduct);

export default router;