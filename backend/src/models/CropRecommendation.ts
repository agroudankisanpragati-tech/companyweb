import mongoose, { Schema, Document } from 'mongoose';

export interface ICropRecommendation extends Document {
  userId: string;
  crop: string;
  variety: string;
  profitPotential: number;
  waterRequirement: string;
  soilCompatibility: number;
  seasonality: string;
  estimatedYield: number;
  marketDemand: string;
  createdAt: Date;
}

const cropRecommendationSchema = new Schema<ICropRecommendation>(
  {
    userId: { type: String, required: true },
    crop: { type: String, required: true },
    variety: { type: String },
    profitPotential: { type: Number },
    waterRequirement: { type: String },
    soilCompatibility: { type: Number },
    seasonality: { type: String },
    estimatedYield: { type: Number },
    marketDemand: { type: String },
  },
  { timestamps: true }
);

export const CropRecommendation = mongoose.model<ICropRecommendation>(
  'CropRecommendation',
  cropRecommendationSchema
);
