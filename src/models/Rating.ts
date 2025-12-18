import mongoose, { Schema, Document } from 'mongoose';

export interface IRating extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  createdAt: Date;
}

const RatingSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

RatingSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model<IRating>('Rating', RatingSchema);