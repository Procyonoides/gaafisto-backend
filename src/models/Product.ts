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
  seller?: mongoose.Types.ObjectId;
  discountPercent: number;
  sold: number;
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
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  sold: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProduct>('Product', ProductSchema);