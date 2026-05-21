# Kisan Unnati Frontend - README

This is the frontend application for the Kisan Unnati Smart Farming Platform built with **Next.js 14**, **React 18**, and **TypeScript**.

## 📦 Features

- ✅ Modern landing page with hero section
- ✅ Feature showcase with 6 key capabilities
- ✅ Farmer testimonials
- ✅ Transparent pricing page
- ✅ Call-to-action sections
- ✅ Fully responsive design (mobile + desktop)
- ✅ Tailwind CSS styling
- ✅ TypeScript support

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

For VPS/production, the frontend is served at https://agroudankisanpragati.com.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Pricing.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   ├── services/         # API clients
│   ├── store/            # State management
│   ├── styles/           # CSS files
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── postcss.config.js
```

## 🎨 Pages

- **Home** (`/`) - Landing page with all sections
- **Dashboard** (Coming Soon) - Farmer dashboard
- **Marketplace** (Coming Soon) - Buy/Sell crops

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **UI Library:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** React Icons
- **State:** Zustand (coming soon)
- **HTTP Client:** Axios

## 📋 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://api.agroudankisanpragati.com/api
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys
# Set NEXT_PUBLIC_API_URL environment variable
```

### Other Platforms

```bash
npm run build
# Deploy the .next folder
```

## 📚 Components

### Navbar
- Sticky navigation bar
- Mobile menu toggle
- Sign in / Get started buttons

### Hero
- Main headline with gradient text
- Description
- CTA buttons
- Trust indicators

### Features
- 6 feature cards
- Icons and descriptions
- Hover effects

### Testimonials
- 3 farmer testimonials
- Star ratings
- Location info

### Pricing
- 3 pricing plans
- Feature comparison
- Popular badge

### CTA
- Final call-to-action
- App download + demo buttons

### Footer
- Company info
- Links (Product, Company, Legal)
- Social media links

## 🎨 Colors & Design

**Theme:**
- Primary: Green (#22c55e)
- Secondary: Yellow (#f59e0b)
- Dark: Gray (#1f2937)

**Typography:**
- Font: Inter
- Headings: 700 weight
- Body: 400-500 weight

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

All components use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)

## 🔄 State Management

Currently using React hooks. Future upgrades:
- Zustand for global state
- React Query for server state

## 🧪 Testing

```bash
# Lint check
npm run lint

# Build check
npm run build
```

## 📖 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test locally
4. Submit PR

## 📄 License

MIT License

---

**Built for Indian Farmers 🌾**
