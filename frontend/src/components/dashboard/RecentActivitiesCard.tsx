"use client";
import React from 'react';

export default function RecentActivitiesCard() {
  const activities = [
    { text: 'Sold 200 kg wheat at mandi', time: '3h ago' },
    { text: 'New recommendation available', time: '6h ago' },
    { text: 'Weather alert: Heavy rain', time: '1d ago' },
  ];

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Recent Activities</h4>
        <button className="text-xs text-green-600">See all</button>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-gray-700">
        {activities.map((a, i) => (
          <li key={i} className="flex items-center justify-between">
            <div>{a.text}</div>
            <div className="text-xs text-gray-400">{a.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
