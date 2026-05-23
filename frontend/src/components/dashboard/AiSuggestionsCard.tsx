"use client";
import React from 'react';
import { FaRobot } from 'react-icons/fa';

export default function AiSuggestionsCard() {
  return (
    <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-300 to-indigo-500 text-white flex items-center justify-center text-xl shadow-md"><FaRobot /></div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold">AI Suggestions</h4>
            <span className="text-xs text-gray-400">Priority</span>
          </div>
          <ul className="mt-2 text-sm space-y-2">
            <li className="text-gray-700">• Apply nitrogen fertilizer to Block A next week.</li>
            <li className="text-gray-700">• Sow short-duration millet variety for upcoming season.</li>
          </ul>
          <div className="mt-3 text-right">
            <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs">View full suggestions</button>
          </div>
        </div>
      </div>
    </div>
  );
}
