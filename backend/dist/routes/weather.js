"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const weatherService_1 = __importDefault(require("../services/weatherService"));
const router = express_1.default.Router();
// GET /api/weather?latitude=..&longitude=..
router.get('/', async (req, res) => {
    try {
        const { latitude, longitude, location } = req.query;
        if (location) {
            const payload = await weatherService_1.default.fetchWeatherByLocationQuery(location);
            return res.json({ success: true, ...payload });
        }
        if (!latitude || !longitude) {
            return res.status(400).json({ success: false, error: 'latitude and longitude or location are required' });
        }
        const data = await weatherService_1.default.fetchWeather(latitude, longitude);
        res.json({ success: true, data });
    }
    catch (error) {
        console.error('Weather fetch error:', error?.message || error);
        if (error?.name === 'LocationNotFoundError') {
            return res.status(404).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: 'Failed to fetch weather' });
    }
});
// GET /api/weather/search?query=...
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string' || !query.trim()) {
            return res.status(400).json({ success: false, error: 'query is required' });
        }
        const results = await weatherService_1.default.searchLocations(query);
        return res.json({ success: true, results });
    }
    catch (error) {
        console.error('Weather search error:', error?.message || error);
        return res.status(500).json({ success: false, error: 'Failed to search locations' });
    }
});
exports.default = router;
//# sourceMappingURL=weather.js.map