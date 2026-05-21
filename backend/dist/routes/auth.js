"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const safeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.verified,
});
// Register
router.post('/register', async (req, res) => {
    try {
        let { name, email, phone, password, farmSize, location, soilType, waterSource } = req.body;
        if (typeof email === 'string')
            email = email.trim().toLowerCase();
        // Check if user exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const user = new User_1.User({
            name,
            email,
            phone,
            password: hashedPassword,
            farmSize,
            location,
            soilType,
            waterSource,
            role: 'farmer',
        });
        await user.save();
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '30d',
        });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: safeUser(user),
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        if (typeof email === 'string')
            email = email.trim().toLowerCase();
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '30d',
        });
        res.json({
            message: 'Login successful',
            token,
            user: safeUser(user),
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});
// Current user
router.get('/me', auth_1.authenticate, async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch current user' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map