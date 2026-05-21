import express, { Response } from 'express';
import { GovtScheme, GovtSchemeStatus } from '../models/GovtScheme';
import { AuthenticatedRequest, authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

const buildSlug = (rawTitle: string) =>
    rawTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

const generateUniqueSlug = async (baseTitle: string, currentSchemeId?: string) => {
    const baseSlug = buildSlug(baseTitle) || `scheme-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await GovtScheme.findOne({ slug });

        if (!existing || (currentSchemeId && existing._id.toString() === currentSchemeId)) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter += 1;
    }
};

const sanitizeList = (items: unknown): string[] => {
    if (!Array.isArray(items)) return [];

    return items
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 12);
};

router.get('/', async (req, res: Response) => {
    try {
        const status = (req.query.status as GovtSchemeStatus | undefined) || 'published';

        if (!['draft', 'published'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status filter' });
        }

        const schemes = await GovtScheme.find({ status })
            .sort({ publishedAt: -1, createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            data: schemes,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch government schemes' });
    }
});

router.get('/admin/all', authenticate, requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
    try {
        const schemes = await GovtScheme.find().sort({ updatedAt: -1 }).lean();

        return res.json({
            success: true,
            data: schemes,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch admin schemes' });
    }
});

router.post('/admin', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            title,
            summary,
            description,
            department,
            audience,
            benefits,
            applicationLink,
            coverImage,
            tags,
            status,
        } = req.body as {
            title?: string;
            summary?: string;
            description?: string;
            department?: string;
            audience?: string;
            benefits?: unknown;
            applicationLink?: string;
            coverImage?: string;
            tags?: unknown;
            status?: GovtSchemeStatus;
        };

        if (!title || !summary || !description || !department || !audience) {
            return res.status(400).json({ error: 'Title, summary, description, department, and audience are required' });
        }

        if (!['draft', 'published'].includes(status || 'draft')) {
            return res.status(400).json({ error: 'Invalid scheme status' });
        }

        const slug = await generateUniqueSlug(title);
        const now = new Date();

        const created = await GovtScheme.create({
            title: title.trim(),
            summary: summary.trim(),
            description: description.trim(),
            department: department.trim(),
            audience: audience.trim(),
            benefits: sanitizeList(benefits),
            applicationLink: applicationLink?.trim(),
            coverImage: coverImage?.trim(),
            tags: sanitizeList(tags).map((tag) => tag.toLowerCase()),
            status: status || 'draft',
            slug,
            publishedAt: (status || 'draft') === 'published' ? now : undefined,
        });

        return res.status(201).json({ success: true, data: created });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create government scheme' });
    }
});

router.patch('/admin/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            title,
            summary,
            description,
            department,
            audience,
            benefits,
            applicationLink,
            coverImage,
            tags,
            status,
        } = req.body as {
            title?: string;
            summary?: string;
            description?: string;
            department?: string;
            audience?: string;
            benefits?: unknown;
            applicationLink?: string;
            coverImage?: string;
            tags?: unknown;
            status?: GovtSchemeStatus;
        };

        const existing = await GovtScheme.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Government scheme not found' });
        }

        if (title?.trim() && title.trim() !== existing.title) {
            existing.slug = await generateUniqueSlug(title.trim(), existing._id.toString());
            existing.title = title.trim();
        }

        if (summary?.trim()) existing.summary = summary.trim();
        if (description?.trim()) existing.description = description.trim();
        if (department?.trim()) existing.department = department.trim();
        if (audience?.trim()) existing.audience = audience.trim();
        if (Array.isArray(benefits)) existing.benefits = sanitizeList(benefits);
        if (typeof applicationLink === 'string') existing.applicationLink = applicationLink.trim() || undefined;
        if (typeof coverImage === 'string') existing.coverImage = coverImage.trim() || undefined;
        if (Array.isArray(tags)) existing.tags = sanitizeList(tags).map((tag) => tag.toLowerCase());

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
        return res.status(500).json({ error: 'Failed to update government scheme' });
    }
});

router.delete('/admin/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const deleted = await GovtScheme.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Government scheme not found' });
        }

        return res.json({ success: true, message: 'Government scheme deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete government scheme' });
    }
});

router.get('/:slug', async (req, res: Response) => {
    try {
        const scheme = await GovtScheme.findOne({ slug: req.params.slug, status: 'published' }).lean();

        if (!scheme) {
            return res.status(404).json({ error: 'Government scheme not found' });
        }

        return res.json({
            success: true,
            data: scheme,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch government scheme' });
    }
});

export default router;