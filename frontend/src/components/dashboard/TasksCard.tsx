"use client";
import React from 'react';

export default function TasksCard() {
  const tasks = [
    { title: 'Irrigate Field 3', time: 'Today 6:00 AM' },
    { title: 'Inspect for pests', time: 'Today 10:00 AM' },
    { title: 'Collect soil sample', time: 'Tomorrow' },
  ];

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Daily Tasks</h4>
        <span className="text-xs text-gray-400">3 items</span>
      </div>
      <ul className="mt-3 space-y-2">
        {tasks.map((t, i) => (
          <li key={i} className="flex items-center justify-between text-sm">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-gray-500">{t.time}</div>
            </div>
            <button className="px-3 py-1 text-xs rounded-lg border">Done</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
