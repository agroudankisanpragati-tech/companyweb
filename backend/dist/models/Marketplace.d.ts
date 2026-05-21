import mongoose, { Document } from 'mongoose';
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
export declare const MarketplaceListing: mongoose.Model<IMarketplaceListing, {}, {}, {}, mongoose.Document<unknown, {}, IMarketplaceListing, {}, {}> & IMarketplaceListing & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Marketplace.d.ts.map