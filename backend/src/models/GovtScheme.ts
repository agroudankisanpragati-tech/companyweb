import mongoose, { Document, Schema } from 'mongoose';

export type GovtSchemeStatus = 'draft' | 'published';

export interface IGovtScheme extends Document {
    title: string;
    slug: string;
    summary: string;
    description: string;
    department: string;
    audience: string;
    benefits: string[];
    applicationLink?: string;
    coverImage?: string;
    tags: string[];
    status: GovtSchemeStatus;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const govtSchemeSchema = new Schema<IGovtScheme>(
    {
        title: { type: String, required: true, trim: true, maxlength: 180 },
        slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
        summary: { type: String, required: true, trim: true, maxlength: 320 },
        description: { type: String, required: true, trim: true },
        department: { type: String, required: true, trim: true },
        audience: { type: String, required: true, trim: true },
        benefits: [{ type: String, trim: true }],
        applicationLink: { type: String, trim: true },
        coverImage: { type: String, trim: true },
        tags: [{ type: String, trim: true, lowercase: true }],
        status: { type: String, enum: ['draft', 'published'], default: 'draft' },
        publishedAt: { type: Date },
    },
    { timestamps: true }
);

govtSchemeSchema.index({ createdAt: -1 });

export const GovtScheme = mongoose.model<IGovtScheme>('GovtScheme', govtSchemeSchema);