import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

const safeUser = (user: { _id: any; name: string; email: string; role: string; verified: boolean }) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  verified: user.verified,
});

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    let { name, email, phone, password, farmSize, location, soilType, waterSource } = req.body;
    if (typeof email === 'string') email = email.trim().toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;
    if (typeof email === 'string') email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Current user
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

export default router;
