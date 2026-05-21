'use client';

import Link from 'next/link';

export default function FarmerFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-50 border-t mt-6">
      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-600">
        <div>© {year} Kisan Unnati — Farmer Dashboard</div>
        <div className="mt-1">
          <Link href="/contact" className="text-green-600 hover:underline">Contact</Link>
          <span className="mx-2">·</span>
          <Link href="/privacy" className="text-green-600 hover:underline">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
