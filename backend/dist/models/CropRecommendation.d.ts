import mongoose, { Document } from 'mongoose';
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
export declare const CropRecommendation: mongoose.Model<ICropRecommendation, {}, {}, {}, mongoose.Document<unknown, {}, ICropRecommendation, {}, {}> & ICropRecommendation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=CropRecommendation.d.ts.map