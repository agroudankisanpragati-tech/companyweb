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
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const router = express_1.default.Router();
const normalizeStoredRole = (role) => {
    return role === 'shopkeeper' || role === 'vendor' ? 'vendor' : 'farmer';
};
const safeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.verified,
});
const normalizeIncomingRole = (role) => {
    return role === 'shopkeeper' || role === 'vendor' ? 'vendor' : 'farmer';
};
const buildLocation = (location) => {
    if (location && typeof location === 'object') {
        const typedLocation = location;
        return {
            state: String(typedLocation.state || typedLocation.location || 'Unknown'),
            district: String(typedLocation.district || 'Unknown'),
            coordinates: {
                latitude: Number(typedLocation?.coordinates?.latitude ?? 0),
                longitude: Number(typedLocation?.coordinates?.longitude ?? 0),
            },
        };
    }
    if (typeof location === 'string' && location.trim()) {
        return {
            state: location.trim(),
            district: 'Unknown',
            coordinates: { latitude: 0, longitude: 0 },
        };
    }
    return {
        state: 'Unknown',
        district: 'Unknown',
        coordinates: { latitude: 0, longitude: 0 },
    };
};
// Register
router.post('/register', async (req, res) => {
    try {
        let { name, email, phone, password, farmSize, location, soilType, waterSource, role, companyName, businessType, googleId, authProvider, } = req.body;
        if (typeof email === 'string')
            email = email.trim().toLowerCase();
        const normalizedRole = normalizeIncomingRole(role);
        const hashedPassword = await bcryptjs_1.default.hash(password || crypto_1.default.randomBytes(16).toString('hex'), 10);
        const normalizedFarmSize = Number.isFinite(Number(farmSize)) ? Number(farmSize) : 0;
        // Check if user exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        // Hash password
        // Create user
        const user = new User_1.User({
            name,
            email,
            phone,
            password: hashedPassword,
            farmSize: normalizedFarmSize,
            location: buildLocation(location),
            soilType,
            waterSource,
            companyName,
            businessType,
            googleId,
            authProvider: authProvider === 'google' ? 'google' : 'local',
            role: normalizedRole,
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
// Google OAuth routes
router.get('/google', (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`;
    const role = req.query.role || 'farmer';
    const state = Buffer.from(JSON.stringify({ role })).toString('base64');
    const params = new URLSearchParams({
        client_id: clientId || '',
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
        state,
    });
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.redirect(url);
});
router.get('/google/callback', async (req, res) => {
    try {
        const { code, state } = req.query;
        const parsedState = state ? JSON.parse(Buffer.from(state, 'base64').toString()) : { role: 'farmer' };
        const role = parsedState.role || 'farmer';
        const tokenRes = await axios_1.default.post('https://oauth2.googleapis.com/token', new URLSearchParams({
            code: code,
            client_id: process.env.GOOGLE_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
            redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
            grant_type: 'authorization_code',
        }).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const idToken = tokenRes.data.id_token;
        // Get userinfo
        const userInfoRes = await axios_1.default.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
        });
        const profile = userInfoRes.data;
        const email = (profile.email || '').toLowerCase();
        // Find or create user
        let user = await User_1.User.findOne({ email });
        if (!user) {
            user = new User_1.User({
                name: profile.name || profile.email,
                email,
                phone: profile.phone_number || '',
                password: await bcryptjs_1.default.hash(crypto_1.default.randomBytes(18).toString('hex'), 10),
                farmSize: 0,
                location: {
                    state: 'Unknown',
                    district: 'Unknown',
                    coordinates: { latitude: 0, longitude: 0 },
                },
                role: role === 'shopkeeper' ? 'vendor' : 'farmer',
                verified: true,
                authProvider: 'google',
                googleId: profile.sub || profile.id,
            });
            await user.save();
        }
        else {
            if (!user.googleId) {
                user.googleId = profile.sub || profile.id;
            }
            user.verified = true;
            user.authProvider = 'google';
            user.role = role === 'shopkeeper' ? 'vendor' : 'farmer';
            await user.save();
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '30d',
        });
        // Redirect to frontend with token
        const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
        const redirectRole = role === 'shopkeeper' ? 'shopkeeper' : 'farmer';
        const redirectUrl = `${frontend}/auth/oauth-redirect?token=${token}&role=${redirectRole}`;
        res.redirect(redirectUrl);
    }
    catch (err) {
        console.error('Google callback error', err);
        res.status(500).send('Google sign-in failed');
    }
});
//# sourceMappingURL=auth.js.map