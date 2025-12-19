import { Router } from 'express';
import { getRecommendations, getSimilarProducts } from '../controllers/recommendation.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get personalized recommendations (requires login)
router.get('/for-you', authenticate, getRecommendations);

// Get similar products based on productId (public)
router.get('/similar/:productId', getSimilarProducts);

export default router;