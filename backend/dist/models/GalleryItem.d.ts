import mongoose, { Document } from 'mongoose';
export type GalleryMediaType = 'photo' | 'video';
export type GalleryItemStatus = 'draft' | 'published';
export interface IGalleryItem extends Document {
    title: string;
    caption?: string;
    mediaType: GalleryMediaType;
    mediaUrl: string;
    fileName: string;
    mimeType: string;
    status: GalleryItemStatus;
    featured: boolean;
    uploadedBy: mongoose.Types.ObjectId;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const GalleryItem: mongoose.Model<IGalleryItem, {}, {}, {}, mongoose.Document<unknown, {}, IGalleryItem, {}, {}> & IGalleryItem & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=GalleryItem.d.ts.map