/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'agroudankisanpragati.com', 'api.agroudankisanpragati.com', 'images.unsplash.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.agroudankisanpragati.com/api',
  },
};

module.exports = nextConfig;
