import express, { Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { AuthenticatedRequest, authenticate, requireAdmin } from '../middleware/auth';
import { GalleryItem, GalleryItemStatus, GalleryMediaType } from '../models/GalleryItem';

const router = express.Router();
const uploadsDir = path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, uploadsDir);
    },
    filename: (_req, file, callback) => {
        const safeName = file.originalname
            .toLowerCase()
            .replace(/[^a-z0-9.\-_]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

        callback(null, `${Date.now()}-${safeName}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            callback(null, true);
            return;
        }

        callback(new Error('Only image and video files are allowed'));
    },
});

const buildMediaUrl = (fileName: string) => `/uploads/${fileName}`;

const normalizeStatus = (status?: string): GalleryItemStatus => (status === 'draft' ? 'draft' : 'published');

router.get('/', async (_req: AuthenticatedRequest, res: Response) => {
    try {
        const items = await GalleryItem.find({ status: 'published' }).sort({ mediaType: 1, createdAt: -1 }).lean();

        return res.json({
            success: true,
            data: items,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch gallery items' });
    }
});

router.get('/admin/all', authenticate, requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
    try {
        const items = await GalleryItem.find().sort({ createdAt: -1 }).lean();

        return res.json({
            success: true,
            data: items,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch admin gallery items' });
    }
});

router.post('/admin/upload', authenticate, requireAdmin, upload.single('file'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'Media file is required' });
        }

        const mediaType = req.body.mediaType as GalleryMediaType | undefined;
        if (!mediaType || !['photo', 'video'].includes(mediaType)) {
            return res.status(400).json({ error: 'Invalid media type' });
        }

        if (mediaType === 'photo' && !file.mimetype.startsWith('image/')) {
            return res.status(400).json({ error: 'Photo uploads must be image files' });
        }

        if (mediaType === 'video' && !file.mimetype.startsWith('video/')) {
            return res.status(400).json({ error: 'Video uploads must be video files' });
        }

        const title = typeof req.body.title === 'string' && req.body.title.trim() ? req.body.title.trim() : path.parse(file.originalname).name;
        const caption = typeof req.body.caption === 'string' && req.body.caption.trim() ? req.body.caption.trim() : undefined;
        const status = normalizeStatus(typeof req.body.status === 'string' ? req.body.status : undefined);
        const featured = String(req.body.featured || '').toLowerCase() === 'true';

        // If this upload is a featured video, clear previous featured flags on videos
        if (featured && mediaType === 'video') {
            await GalleryItem.updateMany({ mediaType: 'video', featured: true }, { $set: { featured: false } });
        }

        const created = await GalleryItem.create({
            title,
            caption,
            mediaType,
            mediaUrl: buildMediaUrl(file.filename),
            fileName: file.filename,
            mimeType: file.mimetype,
            status,
            featured,
            uploadedBy: req.user!.userId,
            publishedAt: status === 'published' ? new Date() : undefined,
        });

        return res.status(201).json({ success: true, data: created });
    } catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to upload media' });
    }
});

router.patch('/admin/:id/feature', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const featured = Boolean(req.body.featured);

        const item = await GalleryItem.findById(id);
        if (!item) return res.status(404).json({ error: 'Gallery item not found' });

        if (featured && item.mediaType === 'video') {
            // unset other featured videos
            await GalleryItem.updateMany({ mediaType: 'video', featured: true }, { $set: { featured: false } });
        }

        item.featured = featured;
        await item.save();

        return res.json({ success: true, data: item });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update featured flag' });
    }
});

router.delete('/admin/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const deleted = await GalleryItem.findById(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        const filePath = path.join(uploadsDir, deleted.fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await deleted.deleteOne();

        return res.json({ success: true, message: 'Gallery item deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete gallery item' });
    }
});

export default router;