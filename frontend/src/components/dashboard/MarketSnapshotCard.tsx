"use client";
import React from 'react';

export default function MarketSnapshotCard() {
  const items = [
    { name: 'Wheat', price: '₹ 2,050 / Quintal' },
    { name: 'Rice', price: '₹ 2,900 / Quintal' },
    { name: 'Tomato', price: '₹ 16 / kg' },
  ];

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Market Snapshot</h4>
        <span className="text-xs text-gray-400">Updated today</span>
      </div>
      <div className="mt-3 space-y-2 text-sm">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="text-gray-700">{it.name}</div>
            <div className="font-medium text-gray-900">{it.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
