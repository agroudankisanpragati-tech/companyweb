import express, { Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { BlogPost, BlogPostStatus } from '../models/BlogPost';
import { AuthenticatedRequest, authenticate, requireAdmin } from '../middleware/auth';

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
        fileSize: 20 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
            callback(null, true);
            return;
        }

        callback(new Error('Only image files are allowed'));
    },
});

const buildMediaUrl = (fileName: string) => `/uploads/${fileName}`;

const buildSlug = (rawTitle: string) =>
    rawTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

const generateUniqueSlug = async (baseTitle: string, currentPostId?: string) => {
    const baseSlug = buildSlug(baseTitle) || `post-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await BlogPost.findOne({ slug });

        if (!existing || (currentPostId && existing._id.toString() === currentPostId)) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter += 1;
    }
};

const sanitizeTags = (tags: unknown): string[] => {
    if (!Array.isArray(tags)) return [];

    return tags
        .filter((tag): tag is string => typeof tag === 'string')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 8);
};

router.get('/', async (req, res: Response) => {
    try {
        const status = (req.query.status as BlogPostStatus | undefined) || 'published';

        if (!['draft', 'published'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status filter' });
        }

        const posts = await BlogPost.find({ status })
            .sort({ publishedAt: -1, createdAt: -1 })
            .populate('authorId', 'name')
            .lean();

        return res.json({
            success: true,
            data: posts.map((post) => ({
                ...post,
                authorName: (post.authorId as { name?: string } | null)?.name || 'Admin',
            })),
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

router.get('/admin/all', authenticate, requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
    try {
        const posts = await BlogPost.find()
            .sort({ updatedAt: -1 })
            .populate('authorId', 'name')
            .lean();

        return res.json({
            success: true,
            data: posts.map((post) => ({
                ...post,
                authorName: (post.authorId as { name?: string } | null)?.name || 'Admin',
            })),
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch admin blog posts' });
    }
});

router.post('/admin/upload-cover', authenticate, requireAdmin, upload.single('file'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Cover image file is required' });
        }

        return res.status(201).json({
            success: true,
            data: {
                coverImage: buildMediaUrl(file.filename),
                fileName: file.filename,
                mimeType: file.mimetype,
            },
        });
    } catch (error) {
        if (req.file) {
            const filePath = path.join(uploadsDir, req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to upload cover image' });
    }
});

router.post('/admin', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, excerpt, content, coverImage, tags, status } = req.body as {
            title?: string;
            excerpt?: string;
            content?: string;
            coverImage?: string;
            tags?: unknown;
            status?: BlogPostStatus;
        };

        if (!title || !excerpt || !content) {
            return res.status(400).json({ error: 'Title, excerpt, and content are required' });
        }

        if (!['draft', 'published'].includes(status || 'draft')) {
            return res.status(400).json({ error: 'Invalid blog status' });
        }

        const slug = await generateUniqueSlug(title);
        const now = new Date();

        const created = await BlogPost.create({
            title: title.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            coverImage: coverImage?.trim(),
            tags: sanitizeTags(tags),
            status: status || 'draft',
            slug,
            authorId: req.user!.userId,
            publishedAt: (status || 'draft') === 'published' ? now : undefined,
        });

        return res.status(201).json({ success: true, data: created });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create blog post' });
    }
});

router.patch('/admin/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, excerpt, content, coverImage, tags, status } = req.body as {
            title?: string;
            excerpt?: string;
            content?: string;
            coverImage?: string;
            tags?: unknown;
            status?: BlogPostStatus;
        };

        const existing = await BlogPost.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        if (title?.trim() && title.trim() !== existing.title) {
            existing.slug = await generateUniqueSlug(title.trim(), existing._id.toString());
            existing.title = title.trim();
        }

        if (excerpt?.trim()) existing.excerpt = excerpt.trim();
        if (content?.trim()) existing.content = content.trim();
        if (typeof coverImage === 'string') existing.coverImage = coverImage.trim() || undefined;
        if (Array.isArray(tags)) existing.tags = sanitizeTags(tags);

        if (status && ['draft', 'published'].includes(status)) {
            const wasDraft = existing.status === 'draft';
            existing.status = status;
            if (status === 'published' && wasDraft) {
                existing.publishedAt = new Date();
            }
            if (status === 'draft') {
                existing.publishedAt = undefined;
            }
        }

        await existing.save();

        return res.json({ success: true, data: existing });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update blog post' });
    }
});

router.delete('/admin/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const deleted = await BlogPost.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        return res.json({ success: true, message: 'Blog post deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete blog post' });
    }
});

router.get('/:slug', async (req, res: Response) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' })
            .populate('authorId', 'name')
            .lean();

        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        return res.json({
            success: true,
            data: {
                ...post,
                authorName: (post.authorId as { name?: string } | null)?.name || 'Admin',
            },
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch blog post' });
    }
});

export default router;
