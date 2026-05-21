"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CropRecommendation_1 = require("../models/CropRecommendation");
const router = express_1.default.Router();
// Get crop recommendations
router.get('/recommendations', async (req, res) => {
    try {
        const { userId } = req.query;
        const recommendations = await CropRecommendation_1.CropRecommendation.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json({
            success: true,
            data: recommendations,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});
// Get all crops (catalog)
router.get('/catalog', async (req, res) => {
    try {
        // Mock data - replace with actual database fetch
        const crops = [
            {
                id: 1,
                name: 'Wheat',
                profitability: 'High',
                waterNeeded: 'Medium',
                season: 'Rabi',
            },
            {
                id: 2,
                name: 'Rice',
                profitability: 'Medium',
                waterNeeded: 'High',
                season: 'Kharif',
            },
            {
                id: 3,
                name: 'Cotton',
                profitability: 'Very High',
                waterNeeded: 'Medium',
                season: 'Kharif',
            },
            {
                id: 4,
                name: 'Organic Tomato',
                profitability: 'Very High',
                waterNeeded: 'Medium',
                season: 'Year-round',
            },
        ];
        res.json({
            success: true,
            data: crops,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch crops' });
    }
});
// Disease detection (mock)
router.post('/detect-disease', async (req, res) => {
    try {
        const { imageUrl, cropType } = req.body;
        // Mock response - integrate with TensorFlow/PyTorch model later
        const mockResponse = {
            disease: 'Leaf Spot',
            confidence: 0.92,
            treatment: 'Apply fungicide XYZ weekly',
            severity: 'Medium',
        };
        res.json({
            success: true,
            data: mockResponse,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Disease detection failed' });
    }
});
// Create a new recommendation (simple rule-based mock AI)
router.post('/recommendations', async (req, res) => {
    try {
        const { userId, soilType, ph, avgRainfall, waterAvailability, location, farmSize } = req.body;
        // Simple rule-based recommendations - replace with AI model later
        const candidates = [
            { crop: 'Wheat', variety: 'Local Wheat', waterRequirement: 'Medium', profitPotential: 70, seasonality: 'Rabi' },
            { crop: 'Rice', variety: 'Hybrid Rice', waterRequirement: 'High', profitPotential: 60, seasonality: 'Kharif' },
            { crop: 'Cotton', variety: 'Bt Cotton', waterRequirement: 'Medium', profitPotential: 95, seasonality: 'Kharif' },
            { crop: 'Dragon Fruit', variety: 'Hylocereus', waterRequirement: 'Low', profitPotential: 150, seasonality: 'Year-round' },
            { crop: 'Aloe Vera', variety: 'Aloe', waterRequirement: 'Low', profitPotential: 120, seasonality: 'Year-round' },
        ];
        // scoring
        const scoreCrop = (c) => {
            let score = c.profitPotential || 50;
            if (soilType && typeof soilType === 'string') {
                const st = soilType.toLowerCase();
                if (st.includes('sandy') && c.waterRequirement === 'Low')
                    score += 15;
                if (st.includes('loamy'))
                    score += 10;
                if (st.includes('clay') && c.waterRequirement === 'High')
                    score += 10;
            }
            if (waterAvailability === 'low' && c.waterRequirement === 'Low')
                score += 20;
            if (waterAvailability === 'high' && c.waterRequirement === 'High')
                score += 15;
            if (avgRainfall && avgRainfall > 800 && c.waterRequirement === 'High')
                score += 10;
            if (farmSize && farmSize > 10 && c.crop === 'Cotton')
                score += 10; // larger farms prefer cash crops
            return score;
        };
        const ranked = candidates
            .map((c) => ({ ...c, score: scoreCrop(c) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
        const saved = await Promise.all(ranked.map(async (r) => {
            const rec = new CropRecommendation_1.CropRecommendation({
                userId: userId || 'anonymous',
                crop: r.crop,
                variety: r.variety,
                profitPotential: r.score,
                waterRequirement: r.waterRequirement,
                soilCompatibility: 80,
                seasonality: r.seasonality,
                estimatedYield: Math.round((r.score / 100) * 10),
                marketDemand: 'Local',
            });
            return await rec.save();
        }));
        res.json({ success: true, data: saved });
    }
    catch (error) {
        console.error('recommendation error', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});
exports.default = router;
//# sourceMappingURL=crops.js.map