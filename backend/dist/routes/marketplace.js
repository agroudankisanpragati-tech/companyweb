"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const Marketplace_1 = require("../models/Marketplace");
const router = express_1.default.Router();
const allowedStatuses = ['available', 'sold', 'pending'];
const isAllowedStatus = (value) => typeof value === 'string' && allowedStatuses.includes(value);
const parsePositiveInteger = (value, fallback, max = Number.MAX_SAFE_INTEGER) => {
    const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : NaN;
    if (!Number.isFinite(parsed) || parsed < 1) {
        return fallback;
    }
    return Math.min(parsed, max);
};
const parseOptionalNumber = (value) => {
    if (typeof value !== 'string') {
        return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};
// Get listings
router.get('/listings', async (req, res) => {
    try {
        const { crop, state, minPrice, maxPrice, status, page, limit } = req.query;
        const query = {};
        if (crop)
            query.cropName = { $regex: crop, $options: 'i' };
        if (state)
            query['location.state'] = state;
        if (isAllowedStatus(status)) {
            query.status = status;
        }
        else {
            query.status = 'available';
        }
        if (minPrice || maxPrice) {
            query.pricePerUnit = {};
            const parsedMinPrice = parseOptionalNumber(minPrice);
            const parsedMaxPrice = parseOptionalNumber(maxPrice);
            if (parsedMinPrice !== undefined) {
                query.pricePerUnit.$gte = parsedMinPrice;
            }
            if (parsedMaxPrice !== undefined) {
                query.pricePerUnit.$lte = parsedMaxPrice;
            }
        }
        const pageNumber = parsePositiveInteger(page, 1);
        const limitNumber = parsePositiveInteger(limit, 20, 100);
        const skip = (pageNumber - 1) * limitNumber;
        const [listings, total] = await Promise.all([
            Marketplace_1.MarketplaceListing.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),
            Marketplace_1.MarketplaceListing.countDocuments(query),
        ]);
        res.json({
            success: true,
            data: listings,
            meta: {
                page: pageNumber,
                limit: limitNumber,
                total,
                hasMore: skip + listings.length < total,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});
// Create listing
router.post('/listings', async (req, res) => {
    try {
        const { sellerId, cropName, quantity, pricePerUnit, location } = req.body;
        if (!sellerId || !cropName || !quantity || !pricePerUnit || !location?.state || !location?.district) {
            return res.status(400).json({
                error: 'sellerId, cropName, quantity, pricePerUnit, location.state, and location.district are required',
            });
        }
        const listing = new Marketplace_1.MarketplaceListing({
            ...req.body,
            status: isAllowedStatus(req.body.status) ? req.body.status : 'available',
        });
        await listing.save();
        res.status(201).json({
            success: true,
            message: 'Listing created successfully',
            data: listing,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create listing' });
    }
});
// Get listing by ID
router.get('/listings/:id', async (req, res) => {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
            return res.status(400).json({ error: 'Invalid listing id' });
        }
        const listing = await Marketplace_1.MarketplaceListing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.json({
            success: true,
            data: listing,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch listing' });
    }
});
const updateListing = async (req, res) => {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
            return res.status(400).json({ error: 'Invalid listing id' });
        }
        const updatePayload = {
            ...req.body,
            ...(isAllowedStatus(req.body.status) ? { status: req.body.status } : {}),
        };
        const listing = await Marketplace_1.MarketplaceListing.findByIdAndUpdate(req.params.id, updatePayload, { new: true, runValidators: true });
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.json({
            success: true,
            data: listing,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update listing' });
    }
};
// Update listing
router.put('/listings/:id', updateListing);
router.patch('/listings/:id', updateListing);
// Mark listing as sold
router.patch('/listings/:id/mark-sold', async (req, res) => {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
            return res.status(400).json({ error: 'Invalid listing id' });
        }
        const listing = await Marketplace_1.MarketplaceListing.findByIdAndUpdate(req.params.id, { status: 'sold' }, { new: true });
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.json({
            success: true,
            message: 'Listing marked as sold',
            data: listing,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update listing status' });
    }
});
// Delete listing
router.delete('/listings/:id', async (req, res) => {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
            return res.status(400).json({ error: 'Invalid listing id' });
        }
        const listing = await Marketplace_1.MarketplaceListing.findByIdAndDelete(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.json({
            success: true,
            message: 'Listing deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete listing' });
    }
});
exports.default = router;
//# sourceMappingURL=marketplace.js.map