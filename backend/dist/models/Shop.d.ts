import mongoose, { Document } from 'mongoose';
export interface IShop extends Document {
    ownerId: string;
    name: string;
    phone?: string;
    address?: string;
    location?: {
        state?: string;
        district?: string;
        coordinates?: {
            latitude?: number;
            longitude?: number;
        };
    };
    openHours?: string;
    description?: string;
    images?: string[];
    verified?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Shop: mongoose.Model<IShop, {}, {}, {}, mongoose.Document<unknown, {}, IShop, {}, {}> & IShop & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Shop.d.ts.map