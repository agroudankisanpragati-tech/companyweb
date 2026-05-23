"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Mocked redeem endpoint. In a real app this should verify the user, check DB balance and persist.
router.post('/redeem', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (!userId)
            return res.status(400).json({ error: 'Missing userId' });
        const redeemAmount = Number(amount) || 0;
        if (redeemAmount <= 0)
            return res.status(400).json({ error: 'Invalid amount' });
        // For demo return new balances assuming starting points 1240 and value ₹620
        const startingPoints = 1240;
        const newPoints = Math.max(0, startingPoints - redeemAmount);
        const redeemValue = Math.round((redeemAmount / startingPoints) * 620);
        return res.json({ success: true, points: newPoints, redeemedValue: redeemValue });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=rewards.js.map