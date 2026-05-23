'use client';

import Link from 'next/link';

export default function FarmerFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-b from-white via-green-100 to-green-500 border-t border-green-400 mt-6">
      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-green-950">
        <div>© {year} Kisan Unnati — Farmer Dashboard</div>
        <div className="mt-1">
          <a href="tel:+916378095181" className="text-green-800 hover:underline">+91 6378095181</a>
          <span className="mx-2">·</span>
          <a href="mailto:agroudankisanpragati@gmail.com" className="text-green-800 hover:underline">agroudankisanpragati@gmail.com</a>
          <span className="mx-2">·</span>
          <span>Main Market Barna, Jalsu, Jaipur Rajasthan</span>
        </div>
      </div>
    </footer>
  );
}
