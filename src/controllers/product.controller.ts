import { Request, Response } from 'express';
import Product from '../models/Product';
import Rating from '../models/Rating';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, category, brand, search } = req.query;
    
    const query: any = {};
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ itemId: req.params.id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { itemId, name, category, brand, stock, price, description } = req.body;
    
    const existingProduct = await Product.findOne({ itemId });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product ID already exists' });
    }

    const cover = req.file ? req.file.filename : 'default.jpg';

    const product = new Product({
      itemId,
      name,
      category,
      brand,
      cover,
      stock,
      price,
      description,
      averageRating: 0
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.cover = req.file.filename;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const rateProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const productId = req.params.id;
    const { rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let userRating = await Rating.findOne({ user: userId, product: productId });
    
    if (userRating) {
      userRating.rating = rating;
    } else {
      userRating = new Rating({ user: userId, product: productId, rating });
    }

    await userRating.save();

    const ratings = await Rating.find({ product: productId });
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    product.averageRating = averageRating;
    await product.save();

    res.json({ message: 'Rating submitted successfully', averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};