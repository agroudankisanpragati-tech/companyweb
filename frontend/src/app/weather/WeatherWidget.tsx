"use client";
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaSearch, FaThermometerHalf } from 'react-icons/fa';
import { fetchWeather, fetchWeatherByLocation, searchLocations } from '../../services/weather';
import WeatherCard from '../../components/WeatherCard';

type LocationSuggestion = {
    name: string;
    displayName: string;
    lat: number;
    lon: number;
};

export default function WeatherWidget() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCelsius, setIsCelsius] = useState(true);
    const [location, setLocation] = useState('Your Location');
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const getGeolocation = () => {
            if (!navigator.geolocation) return fetchByCoords(26.8467, 80.9462, 'Lucknow');

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    fetchByCoords(pos.coords.latitude, pos.coords.longitude, 'Your Location');
                },
                () => {
                    fetchByCoords(26.8467, 80.9462, 'Lucknow');
                },
                { timeout: 8000 }
            );
        };

        getGeolocation();
    }, []);

    async function fetchByCoords(lat: number, lon: number, locName: string) {
        try {
            setLoading(true);
            setError(null);
            const resp = await fetchWeather(lat, lon);
            if (!resp.success) throw new Error(resp.error || 'No data');
            setData(resp.data);
            setLocation(locName);
        } catch (err: any) {
            setError(err.message || 'Failed to load weather');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!searchOpen || searchTerm.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSearchLoading(true);
                const resp = await searchLocations(searchTerm.trim());
                setSuggestions(resp?.results || []);
            } catch {
                setSuggestions([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, searchOpen]);

    const handleLocationSelect = async (item: LocationSuggestion) => {
        try {
            setLoading(true);
            setError(null);
            const resp = await fetchWeatherByLocation(item.displayName || item.name);
            if (!resp.success) throw new Error(resp.error || 'No data');
            setData(resp.data);
            setLocation(resp?.location?.displayName || item.displayName || item.name);
        } catch (err: any) {
            setError(err.message || 'Failed to load weather');
        } finally {
            setLoading(false);
            setSearchOpen(false);
            setSearchTerm('');
            setSuggestions([]);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Header with Controls */}
            <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-white via-emerald-50 to-lime-50 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                {/* Location Display */}
                <div className="flex items-center gap-3 text-emerald-950">
                    <div className="rounded-full bg-emerald-100 p-2">
                        <FaMapMarkerAlt className="text-emerald-700 text-base" />
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-600">Current location</p>
                        <span className="block font-semibold text-lg leading-tight">{location}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                    {/* Temperature Toggle */}
                    <button
                        onClick={() => setIsCelsius(!isCelsius)}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 shadow-sm"
                    >
                        <FaThermometerHalf className="text-lg" />
                        {isCelsius ? '°C' : '°F'}
                    </button>

                    {/* Search Button */}
                    <div className="relative">
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="flex min-w-[140px] items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-6 py-3 text-sm font-medium whitespace-nowrap text-emerald-900 transition hover:bg-emerald-50 md:min-w-[160px]"
                        >
                            <FaSearch className="text-lg" />
                            Search
                        </button>

                        {/* Search Dropdown */}
                        {searchOpen && (
                            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl z-50 md:w-96">
                                <div className="border-b border-emerald-100 bg-emerald-50 p-3">
                                    <input
                                        type="text"
                                        placeholder="Search any village, town, city in India..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-950 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        autoFocus
                                    />
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {searchLoading && (
                                        <div className="px-4 py-3 text-center text-sm text-emerald-600">Searching...</div>
                                    )}
                                    {!searchLoading && suggestions.length > 0 ? (
                                        suggestions.map((item) => (
                                            <button
                                                key={`${item.lat},${item.lon}`}
                                                onClick={() => handleLocationSelect(item)}
                                                className="flex w-full items-center gap-2 px-4 py-2 text-left transition hover:bg-emerald-50"
                                            >
                                                <FaMapMarkerAlt className="text-emerald-500 text-sm" />
                                                <span className="truncate text-sm text-emerald-950">{item.displayName}</span>
                                            </button>
                                        ))
                                    ) : (
                                        !searchLoading && (
                                            <div className="px-4 py-3 text-center text-sm text-emerald-600">
                                                {searchTerm.trim().length < 2 ? 'Type at least 2 letters' : 'No location found'}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading Skeleton */}
            {loading && (
                <div className="space-y-6 animate-pulse">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
                    <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
                    <p className="text-red-800 font-medium">⚠️ Error</p>
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Weather Card */}
            {!loading && !error && (
                <div className="animate-fadeIn">
                    <WeatherCard
                        data={data}
                        isCelsius={isCelsius}
                        location={location}
                    />
                </div>
            )}

            {/* Click outside to close search */}
            {searchOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSearchOpen(false)}
                />
            )}
        </div>
    );
}
