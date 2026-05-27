# Kisan Unnati Backend - README

This is the backend API for the Kisan Unnati Smart Farming Platform built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

## 📦 Features

- ✅ User authentication (JWT)
- ✅ Crop catalog and recommendations
- ✅ Farmer marketplace
- ✅ Weather data integration
- ✅ Disease detection endpoints
- ✅ User profile management
- ✅ Admin dashboard APIs and role-based access
- ✅ MongoDB integration
- ✅ TypeScript support
- ✅ CORS enabled

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/kisan-unnati
JWT_SECRET=your_secret_key_here
FRONTEND_URL=https://agroudankisanpragati.com
ADMIN_URL=https://admin.agroudankisanpragati.com
ADMIN_EMAIL=admin@kisanunnati.in
ADMIN_PASSWORD=change_me
NODE_ENV=development
```

### Development

```bash
npm run dev
```

Server runs on [http://localhost:5000](http://localhost:5000) during development.

For VPS/production, the API is exposed at https://api.agroudankisanpragati.com.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts          # Entry point
│   ├── models/           # MongoDB schemas
│   │   ├── User.ts
│   │   ├── CropRecommendation.ts
│   │   └── Marketplace.ts
│   ├── routes/           # API routes
│   │   ├── auth.ts
│   │   ├── crops.ts
│   │   ├── marketplace.ts
│   │   ├── weather.ts
│   │   └── users.ts
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Auth, error handling
│   ├── services/         # Business logic
│   ├── config/           # Database config
│   └── utils/            # Helper functions
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new farmer
POST   /api/auth/login       - Login farmer
```

### Crops
```
GET    /api/crops/catalog    - Get all crops
GET    /api/crops/recommendations - Get AI recommendations
POST   /api/crops/detect-disease - Detect crop disease
```

### Marketplace
```
GET    /api/marketplace/listings     - Browse listings
POST   /api/marketplace/listings     - Create listing
PUT    /api/marketplace/listings/:id - Update listing
```

### Weather
```
GET    /api/weather - Get weather data
```

Weather lookups are powered by WeatherAPI.com. Set `WEATHER_API_KEY` in your backend env file for live data. The backend also accepts `OPENWEATHER_API_KEY` as a fallback name for older setups.

### Users
```
GET    /api/users/:id       - Get user profile
PUT    /api/users/:id       - Update user profile
```

### Admin
```
GET    /api/admin/overview                 - Dashboard summary
GET    /api/admin/users                    - List users
PATCH  /api/admin/users/:id/role           - Update role
PATCH  /api/admin/users/:id/verify         - Toggle verification
DELETE /api/admin/users/:id                - Delete user
GET    /api/admin/recommendations          - List crop recommendations
DELETE /api/admin/recommendations/:id      - Delete recommendation
GET    /api/admin/listings                 - List marketplace items
PATCH  /api/admin/listings/:id/status      - Update listing status
DELETE /api/admin/listings/:id             - Delete listing
```

### Health
```
GET    /api/health  - Check server status
```

## 📊 Database Models

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  farmSize: Number,
  location: {
    state: String,
    district: String,
    coordinates: { latitude, longitude }
  },
  soilType: String,
  waterSource: String,
  role: 'farmer' | 'vendor' | 'admin',
  crops: [String],
  points: Number,
  verified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### CropRecommendation
```javascript
{
  _id: ObjectId,
  userId: String,
  crop: String,
  variety: String,
  profitPotential: Number,
  waterRequirement: String,
  soilCompatibility: Number,
  seasonality: String,
  estimatedYield: Number,
  marketDemand: String,
  createdAt: Date
}
```

### MarketplaceListing
```javascript
{
  _id: ObjectId,
  sellerId: String,
  cropName: String,
  quantity: Number,
  unit: String,
  pricePerUnit: Number,
  image: String,
  description: String,
  location: {
    state: String,
    district: String
  },
  quality: String,
  organic: Boolean,
  status: 'available' | 'sold' | 'pending',
  createdAt: Date
}
```

## 🔐 Authentication

Uses **JWT (JSON Web Tokens)**

**Flow:**
1. User registers/logs in
2. Server returns JWT token
3. Client stores token
4. Each request includes: `Authorization: Bearer <token>`

Admin accounts can be bootstrapped automatically by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Language:** TypeScript
- **Authentication:** JWT + bcrypt
- **Image Upload:** Multer + Cloudinary (optional)

## 📋 Environment Variables

```env
PORT                      # Server port (default: 5000)
MONGODB_URI              # MongoDB connection string
JWT_SECRET               # JWT signing secret
CLOUDINARY_CLOUD_NAME    # Cloudinary account name
CLOUDINARY_API_KEY       # Cloudinary API key
CLOUDINARY_API_SECRET    # Cloudinary API secret
WEATHER_API_KEY          # WeatherAPI.com API key
WEATHER_API_BASE_URL     # Optional WeatherAPI base URL override
NODE_ENV                 # development | production
FRONTEND_URL             # Frontend URL for CORS
ADMIN_URL                # Admin URL for CORS
```

## 🚀 Deployment

### Railway / Render / Heroku

```bash
# Push to GitHub
git push origin main

# Platform auto-deploys
# Set environment variables in dashboard
```

### AWS / DigitalOcean

```bash
# Build
npm run build

# Deploy dist folder
# Set PORT and other env vars
npm start
```

### MongoDB Atlas

1. Create cluster on [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Get connection URI
3. Add to `.env` as `MONGODB_URI`

For the current deployment, use the Atlas URI in `backend/.env` and keep the production origins set to the live domains.

## 🧪 Testing

### Manual Testing with Postman

1. Import API endpoints
2. Set base URL: `http://localhost:5000`
3. Test each endpoint

### Example Requests

**Register:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Farmer Name",
  "email": "farmer@example.com",
  "phone": "+919876543210",
  "password": "password123",
  "farmSize": 5,
  "location": {
    "state": "Maharashtra",
    "district": "Pune",
    "coordinates": { "latitude": 18.5204, "longitude": 73.8567 }
  },
  "soilType": "Black Soil",
  "waterSource": "Well"
}
```

**Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "password123"
}
```

**Get Crops:**
```bash
GET /api/crops/catalog
```

## 📚 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [TypeScript Docs](https://www.typescriptlang.org/)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit PR

## 📄 License

MIT License

---

**Built for Indian Farmers 🌾**
