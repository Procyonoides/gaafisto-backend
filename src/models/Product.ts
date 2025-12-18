import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  itemId: string;
  name: string;
  category: string;
  brand: string;
  cover: string;
  stock: number;
  price: number;
  description: string;
  averageRating: number;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  cover: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProduct>('Product', ProductSchema);