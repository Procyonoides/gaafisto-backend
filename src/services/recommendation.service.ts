import Rating from '../models/Rating';
import Product from '../models/Product';

interface ItemRating {
  [itemId: string]: number;
}

interface UserRatings {
  [userId: string]: ItemRating;
}

/**
 * Item-Based Collaborative Filtering
 * Menghitung similarity antar item berdasarkan rating user
 */
export class RecommendationService {
  
  /**
   * Menghitung cosine similarity antara dua item
   */
  private cosineSimilarity(ratingsA: number[], ratingsB: number[]): number {
    if (ratingsA.length !== ratingsB.length || ratingsA.length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < ratingsA.length; i++) {
      dotProduct += ratingsA[i] * ratingsB[i];
      normA += ratingsA[i] * ratingsA[i];
      normB += ratingsB[i] * ratingsB[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    
    if (denominator === 0) return 0;
    
    return dotProduct / denominator;
  }

  /**
   * Membuat matrix user-item dari database ratings
   */
  private async buildUserItemMatrix(): Promise<{
    matrix: UserRatings;
    userIds: string[];
    itemIds: string[];
  }> {
    const ratings = await Rating.find().populate('product');
    
    const matrix: UserRatings = {};
    const userIds: Set<string> = new Set();
    const itemIds: Set<string> = new Set();

    ratings.forEach(rating => {
      const userId = rating.user.toString();
      const itemId = rating.product.toString();
      
      userIds.add(userId);
      itemIds.add(itemId);

      if (!matrix[userId]) {
        matrix[userId] = {};
      }
      matrix[userId][itemId] = rating.rating;
    });

    return {
      matrix,
      userIds: Array.from(userIds),
      itemIds: Array.from(itemIds)
    };
  }

  /**
   * Menghitung similarity matrix antar item
   */
  private async calculateItemSimilarities(): Promise<{
    [itemId: string]: { [itemId: string]: number };
  }> {
    const { matrix, userIds, itemIds } = await this.buildUserItemMatrix();
    const similarities: { [itemId: string]: { [itemId: string]: number } } = {};

    // Untuk setiap pasangan item
    for (let i = 0; i < itemIds.length; i++) {
      const itemA = itemIds[i];
      similarities[itemA] = {};

      for (let j = 0; j < itemIds.length; j++) {
        if (i === j) {
          similarities[itemA][itemIds[j]] = 1;
          continue;
        }

        const itemB = itemIds[j];
        
        // Ambil rating dari user yang telah memberi rating kedua item
        const ratingsA: number[] = [];
        const ratingsB: number[] = [];

        userIds.forEach(userId => {
          if (matrix[userId][itemA] && matrix[userId][itemB]) {
            ratingsA.push(matrix[userId][itemA]);
            ratingsB.push(matrix[userId][itemB]);
          }
        });

        // Hitung similarity
        const similarity = this.cosineSimilarity(ratingsA, ratingsB);
        similarities[itemA][itemB] = similarity;
      }
    }

    return similarities;
  }

  /**
   * Mendapatkan rekomendasi produk untuk user
   */
  public async getRecommendationsForUser(
    userId: string, 
    limit: number = 6
  ): Promise<any[]> {
    try {
      // Ambil item yang sudah di-rating oleh user
      const userRatings = await Rating.find({ user: userId });
      
      if (userRatings.length === 0) {
        // Jika user belum pernah rating, return produk dengan rating tertinggi
        return await Product.find()
          .sort({ averageRating: -1 })
          .limit(limit);
      }

      // Hitung similarity matrix
      const similarities = await this.calculateItemSimilarities();
      
      // Hitung predicted rating untuk item yang belum di-rating
      const predictions: { [itemId: string]: number } = {};
      const ratedItemIds = userRatings.map(r => r.product.toString());

      // Ambil semua produk
      const allProducts = await Product.find();
      
      for (const product of allProducts) {
        const itemId = product._id.toString();
        
        // Skip jika sudah di-rating
        if (ratedItemIds.includes(itemId)) continue;

        let numerator = 0;
        let denominator = 0;

        // Hitung predicted rating berdasarkan item similarity
        for (const userRating of userRatings) {
          const ratedItemId = userRating.product.toString();
          const similarity = similarities[itemId]?.[ratedItemId] || 0;
          
          if (similarity > 0) {
            numerator += similarity * userRating.rating;
            denominator += Math.abs(similarity);
          }
        }

        if (denominator > 0) {
          predictions[itemId] = numerator / denominator;
        }
      }

      // Sort berdasarkan predicted rating
      const sortedPredictions = Object.entries(predictions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit);

      // Ambil produk yang direkomendasikan
      const recommendedIds = sortedPredictions.map(([id]) => id);
      const recommendedProducts = await Product.find({
        _id: { $in: recommendedIds }
      });

      // Sort sesuai urutan prediksi
      return recommendedIds
        .map(id => recommendedProducts.find(p => p._id.toString() === id))
        .filter(p => p !== undefined);

    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Fallback: return produk dengan rating tertinggi
      return await Product.find()
        .sort({ averageRating: -1 })
        .limit(limit);
    }
  }

  /**
   * Mendapatkan produk yang mirip dengan produk tertentu
   */
  public async getSimilarProducts(
    productId: string, 
    limit: number = 6
  ): Promise<any[]> {
    try {
      const similarities = await this.calculateItemSimilarities();
      const productSimilarities = similarities[productId];

      if (!productSimilarities) {
        return await Product.find({ _id: { $ne: productId } })
          .sort({ averageRating: -1 })
          .limit(limit);
      }

      // Sort berdasarkan similarity
      const sortedSimilar = Object.entries(productSimilarities)
        .filter(([id]) => id !== productId)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([id]) => id);

      return await Product.find({ _id: { $in: sortedSimilar } });
    } catch (error) {
      console.error('Error getting similar products:', error);
      return await Product.find({ _id: { $ne: productId } })
        .sort({ averageRating: -1 })
        .limit(limit);
    }
  }
}