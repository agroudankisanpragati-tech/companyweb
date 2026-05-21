'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaSeedling, FaSpinner } from 'react-icons/fa';

type Rec = {
    _id: string;
    crop: string;
    variety?: string;
    profitPotential?: number;
    waterRequirement?: string;
    seasonality?: string;
};

export default function RecommendationsPage() {
    const [soilType, setSoilType] = useState('Loamy');
    const [ph, setPh] = useState(6.5);
    const [avgRainfall, setAvgRainfall] = useState(600);
    const [waterAvailability, setWaterAvailability] = useState('medium');
    const [farmSize, setFarmSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Rec[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const { user } = useAuth();

    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

    const [usingProfile, setUsingProfile] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const res = await fetch(`${apiBase}/users/${user.id}`);
                if (!res.ok) return;
                const data = await res.json();
                const u = data.data;
                if (!u) return;

                // map backend fields to form
                if (u.soilType) setSoilType(u.soilType);
                if (typeof u.farmSize === 'number') setFarmSize(u.farmSize);
                // waterSource mapping
                if (u.waterSource) {
                    const ws = String(u.waterSource).toLowerCase();
                    if (ws.includes('low')) setWaterAvailability('low');
                    else if (ws.includes('high')) setWaterAvailability('high');
                    else setWaterAvailability('medium');
                }

                // mark that the profile was loaded and used
                setUsingProfile(true);
            } catch (err) {
                // ignore
            }
        };

        fetchProfile();
    }, [user, apiBase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/crops/recommendations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soilType, ph, avgRainfall, waterAvailability, farmSize }),
            });

            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setResults(data.data || []);
        } catch (err) {
            console.error(err);
            setMessage('Network or server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow p-6 md:p-8 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><FaSeedling /> Crop Recommendations</h1>
                    <p className="text-sm text-gray-600 mt-2">Tell us about your farm to get tailored crop suggestions.</p>

                    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Soil Type</label>
                            <input value={soilType} onChange={(e) => setSoilType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Soil pH</label>
                            <input type="number" step="0.1" value={ph} onChange={(e) => setPh(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Avg Annual Rainfall (mm)</label>
                            <input type="number" value={avgRainfall} onChange={(e) => setAvgRainfall(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Water Availability</label>
                            <select value={waterAvailability} onChange={(e) => setWaterAvailability(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Farm Size (acres)</label>
                            <input type="number" value={farmSize} onChange={(e) => setFarmSize(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
                        </div>

                        <div className="md:col-span-2 flex gap-3 mt-2">
                            <button disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2">
                                {loading ? <FaSpinner className="animate-spin" /> : 'Get Recommendations'}
                            </button>
                            <button type="button" onClick={() => { setResults([]); setMessage(null); }} className="px-6 py-2 border rounded-lg">Clear</button>
                        </div>
                    </form>
                </div>

                {message && <div className="mb-4 p-4 bg-red-50 text-red-800 rounded">{message}</div>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {results.length === 0 ? (
                        <div className="md:col-span-3 p-6 text-center text-sm text-gray-600 bg-white rounded-xl">No recommendations yet. Fill the form and click Get Recommendations.</div>
                    ) : (
                        results.map((r) => (
                            <div key={r._id} className="bg-white p-4 rounded-xl shadow flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{r.crop}</h3>
                                    <p className="text-sm text-gray-600">Variety: {r.variety}</p>
                                    <p className="mt-2 text-sm">Profit Score: <span className="font-semibold text-green-600">{r.profitPotential}</span></p>
                                    <p className="text-sm">Water Needed: {r.waterRequirement}</p>
                                    <p className="text-sm">Season: {r.seasonality}</p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={async () => {
                                            if (!user) return setMessage('Please sign in to save recommendations');
                                            try {
                                                const resp = await fetch(`${apiBase}/users/${user.id}/save-recommendation`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ crop: r.crop, variety: r.variety }),
                                                });
                                                if (!resp.ok) throw new Error('save failed');
                                                setMessage(`${r.crop} saved to your profile`);
                                            } catch (err) {
                                                console.error(err);
                                                setMessage('Failed to save recommendation');
                                            }
                                        }}
                                        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                    >
                                        Save to Profile
                                    </button>
                                    <button className="px-3 py-2 border rounded text-sm">View Details</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
