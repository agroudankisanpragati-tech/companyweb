import mongoose, { Schema, Document } from 'mongoose';

export interface IShop extends Document {
    ownerId: string;
    name: string;
    phone?: string;
    address?: string;
    location?: {
        state?: string;
        district?: string;
        coordinates?: { latitude?: number; longitude?: number };
    };
    openHours?: string;
    description?: string;
    images?: string[];
    verified?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const shopSchema = new Schema<IShop>(
    {
        ownerId: { type: String, required: true, index: true },
        name: { type: String, required: true },
        phone: { type: String },
        address: { type: String },
        location: {
            state: { type: String },
            district: { type: String },
            coordinates: {
                latitude: { type: Number },
                longitude: { type: Number },
            },
        },
        openHours: { type: String },
        description: { type: String },
        images: [String],
        verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Shop = mongoose.model<IShop>('Shop', shopSchema);
