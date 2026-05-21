"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("../middleware/auth");
const GalleryItem_1 = require("../models/GalleryItem");
const router = express_1.default.Router();
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
const storage = multer_1.default.diskStorage({
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
const upload = (0, multer_1.default)({
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
const buildMediaUrl = (fileName) => `/uploads/${fileName}`;
const normalizeStatus = (status) => (status === 'draft' ? 'draft' : 'published');
router.get('/', async (_req, res) => {
    try {
        const items = await GalleryItem_1.GalleryItem.find({ status: 'published' }).sort({ mediaType: 1, createdAt: -1 }).lean();
        return res.json({
            success: true,
            data: items,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch gallery items' });
    }
});
router.get('/admin/all', auth_1.authenticate, auth_1.requireAdmin, async (_req, res) => {
    try {
        const items = await GalleryItem_1.GalleryItem.find().sort({ createdAt: -1 }).lean();
        return res.json({
            success: true,
            data: items,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch admin gallery items' });
    }
});
router.post('/admin/upload', auth_1.authenticate, auth_1.requireAdmin, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'Media file is required' });
        }
        const mediaType = req.body.mediaType;
        if (!mediaType || !['photo', 'video'].includes(mediaType)) {
            return res.status(400).json({ error: 'Invalid media type' });
        }
        if (mediaType === 'photo' && !file.mimetype.startsWith('image/')) {
            return res.status(400).json({ error: 'Photo uploads must be image files' });
        }
        if (mediaType === 'video' && !file.mimetype.startsWith('video/')) {
            return res.status(400).json({ error: 'Video uploads must be video files' });
        }
        const title = typeof req.body.title === 'string' && req.body.title.trim() ? req.body.title.trim() : path_1.default.parse(file.originalname).name;
        const caption = typeof req.body.caption === 'string' && req.body.caption.trim() ? req.body.caption.trim() : undefined;
        const status = normalizeStatus(typeof req.body.status === 'string' ? req.body.status : undefined);
        const featured = String(req.body.featured || '').toLowerCase() === 'true';
        // If this upload is a featured video, clear previous featured flags on videos
        if (featured && mediaType === 'video') {
            await GalleryItem_1.GalleryItem.updateMany({ mediaType: 'video', featured: true }, { $set: { featured: false } });
        }
        const created = await GalleryItem_1.GalleryItem.create({
            title,
            caption,
            mediaType,
            mediaUrl: buildMediaUrl(file.filename),
            fileName: file.filename,
            mimeType: file.mimetype,
            status,
            featured,
            uploadedBy: req.user.userId,
            publishedAt: status === 'published' ? new Date() : undefined,
        });
        return res.status(201).json({ success: true, data: created });
    }
    catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to upload media' });
    }
});
router.patch('/admin/:id/feature', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const featured = Boolean(req.body.featured);
        const item = await GalleryItem_1.GalleryItem.findById(id);
        if (!item)
            return res.status(404).json({ error: 'Gallery item not found' });
        if (featured && item.mediaType === 'video') {
            // unset other featured videos
            await GalleryItem_1.GalleryItem.updateMany({ mediaType: 'video', featured: true }, { $set: { featured: false } });
        }
        item.featured = featured;
        await item.save();
        return res.json({ success: true, data: item });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to update featured flag' });
    }
});
router.delete('/admin/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const deleted = await GalleryItem_1.GalleryItem.findById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }
        const filePath = path_1.default.join(uploadsDir, deleted.fileName);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        await deleted.deleteOne();
        return res.json({ success: true, message: 'Gallery item deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to delete gallery item' });
    }
});
exports.default = router;
//# sourceMappingURL=gallery.js.map