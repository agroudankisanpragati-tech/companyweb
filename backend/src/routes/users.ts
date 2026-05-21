import express, { Request, Response } from 'express';
import { User } from '../models/User';

const router = express.Router();

// Get user profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Save a recommended crop to user's profile
router.post('/:id/save-recommendation', async (req: Request, res: Response) => {
  try {
    const { crop, variety } = req.body;
    const userId = req.params.id;

    if (!crop) return res.status(400).json({ error: 'crop is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const entry = variety ? `${crop} (${variety})` : crop;
    if (!user.crops) user.crops = [];
    if (!user.crops.includes(entry)) {
      user.crops.push(entry);
      await user.save();
    }

    res.json({ success: true, data: user.crops });
  } catch (error) {
    console.error('save-recommendation error', error);
    res.status(500).json({ error: 'Failed to save recommendation' });
  }
});

export default router;
