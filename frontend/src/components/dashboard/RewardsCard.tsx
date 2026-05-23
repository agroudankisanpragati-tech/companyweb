"use client";
import React from 'react';

export default function RewardsCard() {
  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition flex items-center justify-between">
      <div>
        <h4 className="text-sm font-semibold">Reward Points</h4>
        <p className="text-xs text-gray-500">Earned for sustainable practices</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-amber-600">1,240</div>
        <div className="text-xs text-gray-500">Redeemable ₹ 620</div>
      </div>
    </div>
  );
}
