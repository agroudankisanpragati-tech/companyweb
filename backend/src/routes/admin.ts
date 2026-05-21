import express, { Response } from 'express';
import { BlogPost } from '../models/BlogPost';
import { GovtScheme } from '../models/GovtScheme';
import { User } from '../models/User';
import { CropRecommendation } from '../models/CropRecommendation';
import { MarketplaceListing } from '../models/Marketplace';
import { AuthenticatedRequest, authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.use(authenticate, requireAdmin);

const publicUserFields = 'name email phone farmSize location soilType waterSource role crops points verified createdAt updatedAt';

router.get('/overview', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalRecommendations,
      totalListings,
      totalBlogPosts,
      totalSchemes,
      recentUsers,
      recentRecommendations,
      recentListings,
    ] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'admin' }),
        CropRecommendation.countDocuments(),
        MarketplaceListing.countDocuments(),
        BlogPost.countDocuments(),
        GovtScheme.countDocuments(),
        User.find().select(publicUserFields).sort({ createdAt: -1 }).limit(5),
        CropRecommendation.find().sort({ createdAt: -1 }).limit(5),
        MarketplaceListing.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          admins: totalAdmins,
          cropRecommendations: totalRecommendations,
          marketplaceListings: totalListings,
          blogPosts: totalBlogPosts,
          govtSchemes: totalSchemes,
        },
        recentUsers,
        recentRecommendations,
        recentListings,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load admin overview' });
  }
});

router.get('/users', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await User.find().select(publicUserFields).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.patch('/users/:id/role', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.body;

    if (!['farmer', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select(publicUserFields);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

router.patch('/users/:id/verify', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { verified } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { verified: Boolean(verified) },
      { new: true }
    ).select(publicUserFields);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update verification' });
  }
});

router.delete('/users/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/recommendations', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const recommendations = await CropRecommendation.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

router.delete('/recommendations/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deletedRecommendation = await CropRecommendation.findByIdAndDelete(req.params.id);

    if (!deletedRecommendation) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }

    res.json({
      success: true,
      message: 'Recommendation deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recommendation' });
  }
});

router.get('/listings', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const listings = await MarketplaceListing.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: listings,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

router.patch('/listings/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;

    if (!['available', 'sold', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedListing = await MarketplaceListing.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({
      success: true,
      data: updatedListing,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update listing status' });
  }
});

router.delete('/listings/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deletedListing = await MarketplaceListing.findByIdAndDelete(req.params.id);

    if (!deletedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;