import mongoose, { Schema, Document } from 'mongoose';

export interface IShipping extends Document {
  wilayah: string;
  biaya: number;
  kurir: string;
}

const ShippingSchema: Schema = new Schema({
  wilayah: { type: String, required: true },
  biaya: { type: Number, required: true },
  kurir: { type: String, default: '' }
});

export default mongoose.model<IShipping>('Shipping', ShippingSchema);