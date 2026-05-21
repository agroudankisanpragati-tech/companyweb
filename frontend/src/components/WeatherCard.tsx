"use client";
import React, { useState } from 'react';
import { FaWind, FaTint, FaEye, FaCompress } from 'react-icons/fa';

type Weather = {
    current: {
        temp?: number;
        humidity?: number;
        wind_speed?: number;
        weather?: { main?: string; description?: string; icon?: string } | null;
    };
    daily?: Array<any>;
    hourly?: Array<any>;
};

interface Props {
    data: Weather | null;
    isCelsius?: boolean;
    location?: string;
}

export default function WeatherCard({ data, isCelsius = true, location = 'Your Location' }: Props) {
    const [activeTab, setActiveTab] = useState<'current' | 'daily' | 'hourly'>('current');

    if (!data) return <div className="p-8 bg-white rounded-lg shadow">No weather data available</div>;

    const cur = data.current || {};
    const icon = cur.weather?.icon ? `https://openweathermap.org/img/wn/${cur.weather.icon}@4x.png` : null;

    const tempC = cur.temp ?? 0;
    const tempF = (tempC * 9 / 5) + 32;
    const displayTemp = isCelsius ? tempC : tempF;
    const unit = isCelsius ? '°C' : '°F';

    const getWeatherGradient = (weather?: string) => {
        switch (weather?.toLowerCase()) {
            case 'clear':
            case 'sunny':
                return 'from-amber-400 via-yellow-500 to-lime-500';
            case 'clouds':
            case 'cloudy':
                return 'from-slate-500 to-emerald-700';
            case 'rain':
                return 'from-emerald-600 to-teal-800';
            case 'thunderstorm':
                return 'from-slate-800 to-emerald-900';
            default:
                return 'from-emerald-500 to-lime-600';
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Current Weather - Large Card */}
            <div className={`bg-gradient-to-br ${getWeatherGradient(cur.weather?.main)} rounded-[2rem] p-6 md:p-8 text-white shadow-[0_24px_70px_rgba(15,118,110,0.22)] transition hover:shadow-[0_28px_80px_rgba(15,118,110,0.28)]`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium opacity-90">{location}</p>
                        <p className="text-sm opacity-80">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                    {icon && <img src={icon} alt="weather" className="w-24 h-24 drop-shadow-lg" />}
                </div>

                <div className="mb-6">
                    <div className="text-5xl md:text-6xl font-black tracking-tight">{Math.round(displayTemp)}{unit}</div>
                    <p className="text-lg md:text-xl font-semibold opacity-95 capitalize">{cur.weather?.main || '—'}</p>
                    <p className="text-sm opacity-80 capitalize">{cur.weather?.description || ''}</p>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/18 p-4 backdrop-blur-md ring-1 ring-white/20">
                        <div className="flex items-center gap-2 mb-2">
                            <FaTint className="text-lg" />
                            <span className="text-sm font-medium opacity-80">Humidity</span>
                        </div>
                        <p className="text-2xl font-bold">{cur.humidity ?? '--'}%</p>
                    </div>
                    <div className="rounded-2xl bg-white/18 p-4 backdrop-blur-md ring-1 ring-white/20">
                        <div className="flex items-center gap-2 mb-2">
                            <FaWind className="text-lg" />
                            <span className="text-sm font-medium opacity-80">Wind Speed</span>
                        </div>
                        <p className="text-2xl font-bold">{(cur.wind_speed ?? 0).toFixed(1)} m/s</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 rounded-2xl border border-emerald-100 bg-white/80 p-1 shadow-sm backdrop-blur-sm">
                {(['current', 'daily', 'hourly'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-4 py-2 rounded-md capitalize transition font-medium ${activeTab === tab
                            ? 'bg-gradient-to-r from-emerald-600 to-lime-600 text-white shadow'
                            : 'text-emerald-700 hover:text-emerald-950'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Daily Forecast */}
            {activeTab === 'daily' && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-emerald-950">7-Day Forecast</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {(data.daily || []).map((d: any, idx: number) => (
                            <div key={idx} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                                <p className="mb-3 text-sm font-medium text-emerald-700">
                                    {new Date(d.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                                </p>
                                <div className="text-center mb-3">
                                    {d.weather?.icon && (
                                        <img
                                            src={`https://openweathermap.org/img/wn/${d.weather.icon}@2x.png`}
                                            alt="icon"
                                            className="w-12 h-12 mx-auto"
                                        />
                                    )}
                                </div>
                                <div className="space-y-1 text-center">
                                    <p className="text-lg font-bold text-emerald-950">
                                        {isCelsius ? Math.round(d.temp?.day || 0) : Math.round((d.temp?.day || 0) * 9 / 5 + 32)}{unit}
                                    </p>
                                    <p className="text-xs text-emerald-600">{d.weather?.main || '—'}</p>
                                    <p className="text-xs font-medium text-lime-700">💧 {Math.round((d.pop || 0) * 100)}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Hourly Forecast */}
            {activeTab === 'hourly' && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-emerald-950">24-Hour Forecast</h3>
                    <div className="overflow-x-auto">
                        <div className="flex gap-3 pb-2">
                            {(data.hourly || []).slice(0, 12).map((h: any, idx: number) => (
                                <div key={idx} className="min-w-[84px] flex-shrink-0 rounded-2xl border border-emerald-100 bg-white p-3 text-center shadow-sm">
                                    <p className="mb-2 text-xs font-medium text-emerald-700">
                                        {new Date(h.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit' })}
                                    </p>
                                    {h.weather?.icon && (
                                        <img
                                            src={`https://openweathermap.org/img/wn/${h.weather.icon}@2x.png`}
                                            alt="icon"
                                            className="w-8 h-8 mx-auto mb-1"
                                        />
                                    )}
                                    <p className="font-bold text-emerald-950">
                                        {isCelsius ? Math.round(h.temp || 0) : Math.round((h.temp || 0) * 9 / 5 + 32)}{unit}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Current Tab - Additional Details */}
            {activeTab === 'current' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FaEye className="text-emerald-700" />
                            <span className="text-xs font-medium text-emerald-700">Visibility</span>
                        </div>
                        <p className="text-xl font-bold text-emerald-950">10 km</p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-lime-50 to-emerald-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FaCompress className="text-lime-700" />
                            <span className="text-xs font-medium text-emerald-700">Pressure</span>
                        </div>
                        <p className="text-xl font-bold text-emerald-950">1013 mb</p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">☀️</span>
                            <span className="text-xs font-medium text-emerald-700">Feels Like</span>
                        </div>
                        <p className="text-xl font-bold text-emerald-950">{Math.round(displayTemp - 2)}{unit}</p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-lime-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🌡️</span>
                            <span className="text-xs font-medium text-emerald-700">UV Index</span>
                        </div>
                        <p className="text-xl font-bold text-emerald-950">5</p>
                    </div>
                </div>
            )}
        </div>
    );
}
