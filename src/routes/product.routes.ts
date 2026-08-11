import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  rateProduct,
  getMyProducts
} from '../controllers/product.controller';
import { authenticate } from '../middleware/auth';
import { isAdmin, isSeller } from '../middleware/role';
import { upload } from '../config/multer';

const router = Router();

router.get('/', getProducts);
router.get('/my-products', authenticate, isSeller, getMyProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, isSeller, upload.single('cover'), createProduct);
router.put('/:id', authenticate, isSeller, upload.single('cover'), updateProduct);
router.delete('/:id', authenticate, isSeller, deleteProduct);
router.post('/:id/rate', authenticate, rateProduct);

export default router;