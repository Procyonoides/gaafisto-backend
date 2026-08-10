import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  sms: string;
  telpon: string;
  wa: string;
  email: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

const ContactSchema: Schema = new Schema({
  sms: { type: String, default: '' },
  telpon: { type: String, default: '' },
  wa: { type: String, default: '' },
  email: { type: String, default: '' },
  facebook: { type: String, default: '' },
  twitter: { type: String, default: '' },
  instagram: { type: String, default: '' },
  youtube: { type: String, default: '' }
});

export default mongoose.model<IContact>('Contact', ContactSchema);