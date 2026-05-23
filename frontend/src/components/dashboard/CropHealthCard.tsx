"use client";
import React from 'react';
import { FaSeedling } from 'react-icons/fa';

export default function CropHealthCard() {
  return (
    <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-200 to-emerald-400 text-white flex items-center justify-center text-xl shadow-md"><FaSeedling /></div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold">Crop Health</h4>
            <span className="text-xs text-gray-400">Updated 2h ago</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Overall status: <span className="font-semibold text-emerald-700">Good</span></p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="p-3 bg-emerald-50 rounded-lg">Moisture<br/><span className="font-bold">72%</span></div>
            <div className="p-3 bg-yellow-50 rounded-lg">Pests<br/><span className="font-bold">Low</span></div>
            <div className="p-3 bg-red-50 rounded-lg">Nutrients<br/><span className="font-bold">OK</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
