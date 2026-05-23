import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import cropRoutes from './routes/crops';
import weatherRoutes from './routes/weather';
import userRoutes from './routes/users';
import mandiRoutes from './routes/mandi';
import adminRoutes from './routes/admin';
import blogRoutes from './routes/blogs';
import galleryRoutes from './routes/gallery';
import schemeRoutes from './routes/schemes';
import shopRoutes from './routes/shops';
import rewardsRoutes from './routes/rewards';
import { ensureBootstrapAdmin } from './utils/bootstrapAdmin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const buildAllowedOrigins = () => {
  const configuredOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL]
    .filter(Boolean)
    .flatMap((value) => (value as string).split(','))
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaultOrigins = process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:3000', 'http://localhost:3001'];

  return Array.from(new Set([...defaultOrigins, ...configuredOrigins]));
};

const allowedOrigins = buildAllowedOrigins();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server and non-browser requests that do not send an Origin header.
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
// marketplace routes removed per request (UI replaced with mandi-bhav integration)
app.use('/api/weather', weatherRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/rewards', rewardsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Kisan Unnati Backend is running' });
});

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const startServer = async () => {
  await connectDB();
  await ensureBootstrapAdmin();

  app.listen(PORT, () => {
    console.log(`🌾 Kisan Unnati Backend running on port ${PORT}`);
  });
};

startServer();
