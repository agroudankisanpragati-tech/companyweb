export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  verified?: boolean;
};

export type Overview = {
  totals: {
    users: number;
    admins: number;
    cropRecommendations: number;
    marketplaceListings: number;
    blogPosts: number;
    govtSchemes: number;
  };
  recentUsers: AdminUser[];
  recentRecommendations: Recommendation[];
  recentListings: Listing[];
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  farmSize?: number;
  role: 'farmer' | 'vendor' | 'admin';
  verified: boolean;
  points?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Recommendation = {
  _id: string;
  userId: string;
  crop: string;
  variety?: string;
  profitPotential?: number;
  waterRequirement?: string;
  marketDemand?: string;
  createdAt?: string;
};

export type Listing = {
  _id: string;
  sellerId: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  location: {
    state: string;
    district: string;
  };
  status: 'available' | 'sold' | 'pending';
  organic?: boolean;
  createdAt?: string;
};

export type AdminBlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: 'draft' | 'published';
  authorName?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GovtScheme = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  department: string;
  audience: string;
  benefits: string[];
  applicationLink?: string;
  coverImage?: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GalleryMediaType = 'photo' | 'video';

export type GalleryItem = {
  _id: string;
  title: string;
  caption?: string;
  mediaType: GalleryMediaType;
  mediaUrl: string;
  fileName: string;
  mimeType: string;
  featured?: boolean;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};
