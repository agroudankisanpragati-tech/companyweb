import mongoose, { Document, Schema } from 'mongoose';

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

const galleryItemSchema = new Schema<IGalleryItem>(
    {
        title: { type: String, required: true, trim: true, maxlength: 180 },
        caption: { type: String, trim: true, maxlength: 360 },
        mediaType: { type: String, enum: ['photo', 'video'], required: true },
        mediaUrl: { type: String, required: true, trim: true },
        fileName: { type: String, required: true, trim: true },
        mimeType: { type: String, required: true, trim: true },
        status: { type: String, enum: ['draft', 'published'], default: 'published' },
        featured: { type: Boolean, default: false },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        publishedAt: { type: Date },
    },
    { timestamps: true }
);

galleryItemSchema.index({ mediaType: 1, createdAt: -1 });

export const GalleryItem = mongoose.model<IGalleryItem>('GalleryItem', galleryItemSchema);