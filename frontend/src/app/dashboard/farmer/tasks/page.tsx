"use client";

import Link from 'next/link';

export default function TasksPage() {
  const tasks = [
    { title: 'Irrigate Field 3', time: 'Today 6:00 AM' },
    { title: 'Inspect for pests', time: 'Today 10:00 AM' },
    { title: 'Collect soil sample', time: 'Tomorrow' },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Daily Tasks</h1>
        <p className="text-sm text-gray-500 mb-4">Manage your tasks and mark them done as you go.</p>

        <div className="space-y-3">
          {tasks.map((t, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border shadow-sm">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-gray-500">{t.time}</div>
              </div>
              <button className="px-3 py-1 rounded-lg border text-sm">Mark done</button>
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
