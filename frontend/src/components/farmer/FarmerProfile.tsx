"use client";

import { useState } from "react";
import { FaUser, FaLeaf } from 'react-icons/fa';

const tabs = [
  "Personal Details",
  "Farm Details",
  "Land Information",
  "Crop History",
  "Language Preferences",
  "Account Settings",
];

export default function FarmerProfile({ user }: { user?: any }) {
  const [active, setActive] = useState(0);

  const primaryBtn = 'px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition';
  const ghostBtn = 'px-3 py-1 rounded-lg border text-sm text-gray-600 hover:bg-gray-50 transition';

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden ring-1 ring-gray-100">
        <div className="flex flex-col md:flex-row">
          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 bg-gradient-to-b from-white to-emerald-50 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-bold shadow-inner"><FaUser /></div>
              <div className="mt-3">
                <div className="text-lg font-semibold text-gray-900">{user?.name ?? 'Farmer'}</div>
                <div className="text-xs text-gray-500 mt-1">{user?.location ?? 'Unknown location'}</div>
              </div>
              <div className="mt-4 w-full">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Points</div>
                    <div className="text-sm font-semibold text-amber-600">1,240</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Farms</div>
                    <div className="text-sm font-semibold text-emerald-700">2</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className={primaryBtn}>Edit Profile</button>
                  <button className={ghostBtn}>Share</button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-gray-700 mb-2">Sections</div>
              <div className="flex flex-col gap-2">
                {tabs.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setActive(i)}
                    className={`text-left px-3 py-2 rounded-lg w-full text-sm transition-colors flex items-center gap-3 ${
                      i === active
                        ? 'bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-100'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-3 h-3 bg-emerald-200 rounded-full" />
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1 p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{tabs[active]}</h2>
              <p className="text-sm text-gray-500">Update and review your {tabs[active].toLowerCase()}.</p>
            </div>

            <section className="space-y-6">
              {active === 0 && (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input defaultValue={user?.name ?? ''} placeholder="Full name" className="p-3 rounded-lg border" />
                  <input defaultValue={user?.phone ?? ''} placeholder="Phone" className="p-3 rounded-lg border" />
                  <input defaultValue={user?.email ?? ''} placeholder="Email" className="p-3 rounded-lg border col-span-1 md:col-span-2" />
                  <textarea placeholder="Short bio or notes" className="p-3 rounded-lg border col-span-1 md:col-span-2" />
                  <div className="md:col-span-2 flex justify-end">
                    <button className="px-4 py-2 rounded-lg bg-green-600 text-white">Save</button>
                  </div>
                </form>
              )}

              {active === 1 && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Farm name" className="p-3 rounded-lg border" />
                    <input placeholder="Farm size (acres)" className="p-3 rounded-lg border" />
                    <input placeholder="Irrigation type" className="p-3 rounded-lg border" />
                    <input placeholder="Soil type" className="p-3 rounded-lg border" />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="px-4 py-2 rounded-lg bg-green-600 text-white">Save Farm</button>
                  </div>
                </div>
              )}

              {active === 2 && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Plot identifier" className="p-3 rounded-lg border" />
                    <input placeholder="Area (hectares)" className="p-3 rounded-lg border" />
                    <input placeholder="Ownership type" className="p-3 rounded-lg border" />
                    <input placeholder="Coordinates / Survey no." className="p-3 rounded-lg border" />
                  </div>
                </div>
              )}

              {active === 3 && (
                <div>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg border">No crop history yet. Add a record to get started.</div>
                    <button className="px-4 py-2 rounded-lg bg-green-600 text-white">Add Crop Record</button>
                  </div>
                </div>
              )}

              {active === 4 && (
                <div>
                  <label className="block mb-2 text-sm">Preferred Languages</label>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-3 py-1 rounded-lg border">Hindi</button>
                    <button className="px-3 py-1 rounded-lg border">English</button>
                    <button className="px-3 py-1 rounded-lg border">Local</button>
                  </div>
                </div>
              )}

              {active === 5 && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Change password" type="password" className="p-3 rounded-lg border" />
                    <input placeholder="Confirm password" type="password" className="p-3 rounded-lg border" />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="px-4 py-2 rounded-lg bg-red-500 text-white">Delete account</button>
                    <button className="ml-2 px-4 py-2 rounded-lg bg-green-600 text-white">Save</button>
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
