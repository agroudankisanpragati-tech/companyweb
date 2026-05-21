import mongoose, { Document } from 'mongoose';
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
export declare const GovtScheme: mongoose.Model<IGovtScheme, {}, {}, {}, mongoose.Document<unknown, {}, IGovtScheme, {}, {}> & IGovtScheme & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=GovtScheme.d.ts.map