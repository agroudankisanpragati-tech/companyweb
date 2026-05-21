"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GovtScheme_1 = require("../models/GovtScheme");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const buildSlug = (rawTitle) => rawTitle
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
const generateUniqueSlug = async (baseTitle, currentSchemeId) => {
    const baseSlug = buildSlug(baseTitle) || `scheme-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;
    while (true) {
        const existing = await GovtScheme_1.GovtScheme.findOne({ slug });
        if (!existing || (currentSchemeId && existing._id.toString() === currentSchemeId)) {
            return slug;
        }
        slug = `${baseSlug}-${counter}`;
        counter += 1;
    }
};
const sanitizeList = (items) => {
    if (!Array.isArray(items))
        return [];
    return items
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 12);
};
router.get('/', async (req, res) => {
    try {
        const status = req.query.status || 'published';
        if (!['draft', 'published'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status filter' });
        }
        const schemes = await GovtScheme_1.GovtScheme.find({ status })
            .sort({ publishedAt: -1, createdAt: -1 })
            .lean();
        return res.json({
            success: true,
            data: schemes,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch government schemes' });
    }
});
router.get('/admin/all', auth_1.authenticate, auth_1.requireAdmin, async (_req, res) => {
    try {
        const schemes = await GovtScheme_1.GovtScheme.find().sort({ updatedAt: -1 }).lean();
        return res.json({
            success: true,
            data: schemes,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch admin schemes' });
    }
});
router.post('/admin', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { title, summary, description, department, audience, benefits, applicationLink, coverImage, tags, status, } = req.body;
        if (!title || !summary || !description || !department || !audience) {
            return res.status(400).json({ error: 'Title, summary, description, department, and audience are required' });
        }
        if (!['draft', 'published'].includes(status || 'draft')) {
            return res.status(400).json({ error: 'Invalid scheme status' });
        }
        const slug = await generateUniqueSlug(title);
        const now = new Date();
        const created = await GovtScheme_1.GovtScheme.create({
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to create government scheme' });
    }
});
router.patch('/admin/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { title, summary, description, department, audience, benefits, applicationLink, coverImage, tags, status, } = req.body;
        const existing = await GovtScheme_1.GovtScheme.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Government scheme not found' });
        }
        if (title?.trim() && title.trim() !== existing.title) {
            existing.slug = await generateUniqueSlug(title.trim(), existing._id.toString());
            existing.title = title.trim();
        }
        if (summary?.trim())
            existing.summary = summary.trim();
        if (description?.trim())
            existing.description = description.trim();
        if (department?.trim())
            existing.department = department.trim();
        if (audience?.trim())
            existing.audience = audience.trim();
        if (Array.isArray(benefits))
            existing.benefits = sanitizeList(benefits);
        if (typeof applicationLink === 'string')
            existing.applicationLink = applicationLink.trim() || undefined;
        if (typeof coverImage === 'string')
            existing.coverImage = coverImage.trim() || undefined;
        if (Array.isArray(tags))
            existing.tags = sanitizeList(tags).map((tag) => tag.toLowerCase());
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to update government scheme' });
    }
});
router.delete('/admin/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const deleted = await GovtScheme_1.GovtScheme.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Government scheme not found' });
        }
        return res.json({ success: true, message: 'Government scheme deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to delete government scheme' });
    }
});
router.get('/:slug', async (req, res) => {
    try {
        const scheme = await GovtScheme_1.GovtScheme.findOne({ slug: req.params.slug, status: 'published' }).lean();
        if (!scheme) {
            return res.status(404).json({ error: 'Government scheme not found' });
        }
        return res.json({
            success: true,
            data: scheme,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch government scheme' });
    }
});
exports.default = router;
//# sourceMappingURL=schemes.js.map