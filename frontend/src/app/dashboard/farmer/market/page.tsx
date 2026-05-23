"use client";

import Link from 'next/link';

export default function MarketPage() {
  const items = [
    { name: 'Wheat', price: '₹ 2,050 / Quintal' },
    { name: 'Rice', price: '₹ 2,900 / Quintal' },
    { name: 'Tomato', price: '₹ 16 / kg' },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Market Snapshot</h1>
        <p className="text-sm text-gray-500 mb-4">Updated today</p>

        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border shadow-sm">
              <div>{it.name}</div>
              <div className="font-medium">{it.price}</div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/dashboard/farmer" className="text-sm text-emerald-600">← Back to dashboard</Link>
        </div>
      </div>
    </div>
  );
}
