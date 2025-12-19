import mongoose, { Schema, Document } from 'mongoose';
const bcrypt = require('bcryptjs');

export interface IUser extends Document {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: 'Laki-laki' | 'Perempuan';
  role: 'admin' | 'seller' | 'user';
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Laki-laki', 'Perempuan'], required: true },
  role: { type: String, enum: ['admin', 'seller', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(this: any, next: any) {
  if (!this.isModified('password')) {
    return next();
  }
  
  bcrypt.genSalt(10, (err: any, salt: any) => {
    if (err) return next(err);
    
    bcrypt.hash(this.password, salt, (err: any, hash: any) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);