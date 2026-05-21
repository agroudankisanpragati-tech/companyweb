import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketplaceListing extends Document {
  sellerId: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  image: string;
  description: string;
  location: {
    state: string;
    district: string;
  };
  quality: string;
  organic: boolean;
  status: 'available' | 'sold' | 'pending';
  createdAt: Date;
}

const marketplaceListingSchema = new Schema<IMarketplaceListing>(
  {
    sellerId: { type: String, required: true },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    pricePerUnit: { type: Number, required: true },
    image: { type: String },
    description: { type: String },
    location: {
      state: { type: String, required: true },
      district: { type: String, required: true },
    },
    quality: { type: String },
    organic: { type: Boolean, default: false },
    status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' },
  },
  { timestamps: true }
);

export const MarketplaceListing = mongoose.model<IMarketplaceListing>(
  'MarketplaceListing',
  marketplaceListingSchema
);
