import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service';

const recommendationService = new RecommendationService();

// Get personalized recommendations for logged-in user
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const limit = Number(req.query.limit) || 6;

    const recommendations = await recommendationService.getRecommendationsForUser(userId, limit);

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to get recommendations', 
      error 
    });
  }
};

// Get similar products based on a product
export const getSimilarProducts = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const limit = Number(req.query.limit) || 6;

    const similarProducts = await recommendationService.getSimilarProducts(productId, limit);

    res.json({
      success: true,
      similarProducts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to get similar products', 
      error 
    });
  }
};