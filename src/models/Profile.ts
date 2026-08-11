import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  namaToko: string;
  description: string;
  alamatToko: string;
  kotaToko: string;
  provinsiToko: string;
  kodePos: string;
}

const ProfileSchema: Schema = new Schema({
  namaToko: { type: String, required: true, default: 'Gaafisto' },
  description: { type: String, default: '' },
  alamatToko: { type: String, required: true },
  kotaToko: { type: String, required: true },
  provinsiToko: { type: String, required: true },
  kodePos: { type: String, required: true }
});

export default mongoose.model<IProfile>('Profile', ProfileSchema);