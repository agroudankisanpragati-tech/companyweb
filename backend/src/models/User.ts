import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  farmSize: number;
  location: {
    state: string;
    district: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  soilType: string;
  waterSource: string;
  role: 'farmer' | 'vendor' | 'admin';
  crops: string[];
  points: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    farmSize: { type: Number, required: true },
    location: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },
    soilType: { type: String },
    waterSource: { type: String },
    role: { type: String, enum: ['farmer', 'vendor', 'admin'], default: 'farmer' },
    crops: [String],
    points: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
