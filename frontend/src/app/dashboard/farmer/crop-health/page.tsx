"use client";

import Link from 'next/link';

export default function CropHealthPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Crop Health</h1>
        <p className="text-sm text-gray-500 mb-4">Updated 2h ago — Overview of crop metrics</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border shadow-sm text-center">
            <div className="text-sm text-gray-500">Moisture</div>
            <div className="text-xl font-bold text-emerald-700">72%</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border shadow-sm text-center">
            <div className="text-sm text-gray-500">Pests</div>
            <div className="text-xl font-bold">Low</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border shadow-sm text-center">
            <div className="text-sm text-gray-500">Nutrients</div>
            <div className="text-xl font-bold">OK</div>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/dashboard/farmer" className="text-sm text-emerald-600">← Back to dashboard</Link>
        </div>
      </div>
    </div>
  );
}
