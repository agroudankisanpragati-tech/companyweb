'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import FarmerFooter from '@/components/FarmerFooter';
import FarmerSidebar from '@/components/FarmerSidebar';
import AiFarmSection from '@/components/AiFarmSection';
import { FaBell, FaMapMarkerAlt, FaMicrophone, FaCloudSun, FaTint, FaTree, FaChartLine, FaMicroscope, FaArrowRight, FaWind, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { fetchWeatherByLocation } from '@/services/weather';
import { mandiApi } from '@/services/mandibav';

export default function FarmerDashboard() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [weather, setWeather] = useState<any | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [market, setMarket] = useState<any | null>(null);
    const [marketPrevious, setMarketPrevious] = useState<any | null>(null);
    const [marketLoading, setMarketLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<{ title: string; body: React.ReactNode } | null>(null);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'farmer') {
            router.push('/auth/role-select');
        }
    }, [isAuthenticated, user, router]);

    // fetch weather and market data on mount
    useEffect(() => {
        async function load() {
            if ((user as any)?.location) {
                try {
                    setWeatherLoading(true);
                    const loc = typeof (user as any).location === 'string' ? (user as any).location : (user as any).location?.state || '';
                    const w = await fetchWeatherByLocation(loc);
                    setWeather(w);
                } catch (e) {
                    // ignore
                } finally {
                    setWeatherLoading(false);
                }
            }

            try {
                setMarketLoading(true);
                const res = await mandiApi.getPrices({});
                const data = res?.data || [];
                setMarket(data[0] || null);
                setMarketPrevious(data[1] || null);
            } catch (e) {
                // ignore
            } finally {
                setMarketLoading(false);
            }
        }

        load();
    }, [user]);

    function handleCardClick(key: string) {
        switch (key) {
            case 'weather':
                setModalContent({ title: 'Weather Details', body: weather ? (<div>{JSON.stringify(weather)}</div>) : (<div>No weather data available</div>) });
                setModalOpen(true);
                break;
            case 'market':
                setModalContent({ title: 'Market Details', body: market ? (<div>{JSON.stringify(market)}</div>) : (<div>No market data available</div>) });
                setModalOpen(true);
                break;
            case 'moisture':
                setModalContent({ title: 'Soil Moisture', body: (<div>Current soil moisture is estimated at 48% — optimal for most crops.</div>) });
                setModalOpen(true);
                break;
            case 'crop':
                setModalContent({ title: 'Crop Health', body: (<div>Crop health looks good. No major pests or nutrient deficiencies detected.</div>) });
                setModalOpen(true);
                break;
            case 'disease':
                setModalContent({ title: 'Disease Scan', body: (<div>No disease detected. For scans upload leaf images to run a detailed check.</div>) });
                setModalOpen(true);
                break;
            default:
                break;
        }
    }

    const marketPrice = market?.modalPrice ?? market?.modal_price ?? null;
    const previousMarketPrice = marketPrevious?.modalPrice ?? marketPrevious?.modal_price ?? null;
    const marketChangePercent =
        typeof marketPrice === 'number' && typeof previousMarketPrice === 'number' && previousMarketPrice > 0
            ? ((marketPrice - previousMarketPrice) / previousMarketPrice) * 100
            : null;
    const marketIsUp = marketChangePercent === null ? true : marketChangePercent >= 0;
    const currentWeather = weather?.data?.current ?? weather?.current ?? {};
    const currentWeatherLabel = currentWeather?.weather?.text || currentWeather?.weather?.main || 'Partly cloudy';
    const currentWeatherTemp = currentWeather?.temp ?? weather?.data?.current?.temp ?? 32;
    const currentWeatherHumidity = currentWeather?.humidity ?? 68;
    const currentWeatherWind = currentWeather?.wind_kph ?? currentWeather?.wind_speed ?? 12;

    // Allow preview in development without authentication
    if (!isAuthenticated && process.env.NODE_ENV !== 'development') return null;

    return (
        <>
            <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                <FarmerSidebar open={true} onClose={() => undefined} />

                <div className="flex-1 flex flex-col">
                    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-transparent">
                        <div>
                            <div className="text-2xl md:text-3xl font-extrabold font-sans text-slate-800">
                                <span className="mr-2">Good morning,</span>
                                {user?.name ? (
                                    <>
                                        <span className="text-emerald-700">{user.name}</span>
                                        <span className="ml-2">! 👋</span>
                                    </>
                                ) : (
                                    <span className="text-emerald-700">Farmer</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-2 bg-white shadow-sm rounded-md text-sm">
                                <FaMapMarkerAlt className="text-emerald-600" />
                                <span>Select location</span>
                            </button>

                            <button aria-label="Notifications" className="p-2 rounded-md hover:bg-gray-100 border border-emerald-500">
                                <FaBell className="text-xl text-slate-700" />
                            </button>

                            <button aria-label="AI Assistant" className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                                <FaMicrophone className="text-xl text-white" />
                                <span className="text-sm font-medium text-white">AI Assistant</span>
                            </button>

                            <button
                                onClick={() => { logout(); router.push('/auth/role-select'); }}
                                className="ml-2 px-3 py-2 rounded-md border border-gray-200 text-sm text-slate-700 hover:bg-gray-50"
                            >
                                Logout
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 p-6">
                        {/* fetch live weather & mandi data */}
                        {/* Note: these calls are defensive; they will silently fail if backend not configured */}
                        <>
                            {/* load weather & market once on mount */}
                            {null}
                        </>
                        <section className="mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div onClick={() => handleCardClick('weather')} className="cursor-pointer h-[17.58rem] rounded-2xl bg-gradient-to-br from-sky-50 via-cyan-50 to-amber-50 p-4 shadow-sm hover:shadow-md transition overflow-hidden">
                                    <div className="flex h-full flex-col justify-between">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Weather Today</div>
                                            </div>
                                            <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm backdrop-blur">
                                                Live
                                            </div>
                                        </div>

                                        <div className="relative mt-3 flex flex-1 items-center justify-center rounded-3xl bg-white/55 px-4 py-4 shadow-inner backdrop-blur-sm">
                                            <div className="absolute -left-5 top-3 h-20 w-20 rounded-full bg-sky-300/30 blur-2xl" />
                                            <div className="absolute -right-3 bottom-0 h-24 w-24 rounded-full bg-amber-300/30 blur-2xl" />
                                            <div className="relative flex flex-col items-center text-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-400 to-amber-300 text-white shadow-lg">
                                                        <FaCloudSun className="text-4xl" />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-4xl font-extrabold tracking-tight text-slate-800">
                                                            {weatherLoading ? '—' : `${Math.round(currentWeatherTemp)}°C`}
                                                        </div>
                                                        <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">{currentWeatherLabel}</div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 grid w-full grid-cols-2 gap-3">
                                                    <div className="rounded-2xl bg-sky-50 px-3 py-2 text-left shadow-sm">
                                                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
                                                            <FaTint />
                                                            Humidity
                                                        </div>
                                                        <div className="mt-1 text-base font-bold text-slate-800">
                                                            {weatherLoading ? '—' : `${Math.round(currentWeatherHumidity)}%`}
                                                        </div>
                                                    </div>
                                                    <div className="rounded-2xl bg-cyan-50 px-3 py-2 text-left shadow-sm">
                                                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                                                            <FaWind />
                                                            Wind
                                                        </div>
                                                        <div className="mt-1 text-base font-bold text-slate-800">
                                                            {weatherLoading ? '—' : `${Math.round(currentWeatherWind)} km/h`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full mt-3">
                                            <button onClick={() => handleCardClick('weather')} className="w-full -mx-4 flex items-center justify-between gap-2 border-t border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 rounded-b-2xl">
                                                <span>View forecast</span>
                                                <FaArrowRight className="text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div onClick={() => handleCardClick('moisture')} className="cursor-pointer h-[17.58rem] rounded-2xl bg-cyan-50 p-4 shadow-sm hover:shadow-md transition">
                                    <div className="flex h-full flex-col justify-between">
                                        <div className="flex flex-1 flex-col items-center justify-center text-center">
                                            <div className="flex items-center gap-3 rounded-2xl bg-cyan-100 px-4 py-3 shadow-sm">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-200 text-cyan-700">
                                                    <FaTint className="text-2xl" />
                                                </div>
                                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Soil Moisture</div>
                                            </div>
                                            <div className="mt-2 w-full text-left text-4xl font-extrabold tracking-tight text-slate-800">48%</div>
                                            <div className="mt-2 w-full text-left text-sm font-semibold text-slate-600">Good Level</div>
                                            <div className="mt-3 w-full rounded-full bg-emerald-100 p-1">
                                                <div className="h-3 w-[68%] rounded-full bg-emerald-500 shadow-sm" />
                                            </div>
                                        </div>
                                        <div className="w-full mt-auto">
                                            <button onClick={() => handleCardClick('moisture')} className="w-full -mx-4 flex items-center justify-between gap-2 border-t border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 rounded-b-2xl">
                                                <span>Details</span>
                                                <FaArrowRight className="text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div onClick={() => handleCardClick('crop')} className="cursor-pointer h-[17.58rem] rounded-2xl bg-emerald-50 p-4 shadow-sm hover:shadow-md transition overflow-hidden">
                                    <div className="flex h-full flex-col justify-between">
                                        <div className="pt-1">
                                            <div className="text-2xl font-extrabold uppercase tracking-wide text-emerald-800">Crop Health</div>
                                        </div>

                                        <div className="flex flex-1 flex-col items-start justify-center text-left pl-1">
                                            <div className="text-2xl font-extrabold text-emerald-700">Good</div>
                                            <div className="mt-1 text-sm font-medium text-slate-600">All crops are healthy</div>
                                        </div>

                                        <div className="flex items-center justify-end">
                                            <div className="flex h-28 w-28 items-center justify-center overflow-hidden">
                                                <img
                                                    src="/FARMER%20DESK%20IMH/soil%20icon.png"
                                                    alt="Soil icon"
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full mt-auto">
                                            <button onClick={() => handleCardClick('crop')} className="w-full -mx-4 flex items-center justify-between gap-2 text-sm font-medium text-emerald-600 border-t border-emerald-600 px-4 py-2 rounded-b-2xl">
                                                <span>View crop</span>
                                                <FaArrowRight className="text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div onClick={() => handleCardClick('market')} className="cursor-pointer h-[17.58rem] rounded-2xl bg-rose-50 p-4 shadow-sm hover:shadow-md transition overflow-hidden">
                                    <div className="flex h-full flex-col justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-200 text-rose-600 shadow-sm">
                                                <FaChartLine className="text-2xl" />
                                            </div>
                                            <div className="pt-1">
                                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Price / quintal</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-1 flex-col items-center justify-center text-center">
                                            <div className="text-4xl font-extrabold tracking-tight text-slate-800">
                                                {marketLoading ? 'Loading...' : '₹2250.90'}
                                            </div>
                                            <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                                                Rice (quintal)
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                                            <FaArrowUp className="text-emerald-600" />
                                            <span className="text-emerald-600">8% From yesterday</span>
                                        </div>

                                        <div className="w-full mt-3">
                                            <button onClick={() => handleCardClick('market')} className="w-full -mx-4 flex items-center justify-between gap-2 text-sm font-medium text-emerald-600 border-t border-emerald-600 px-4 py-2 rounded-b-2xl">
                                                <span>View prices</span>
                                                <FaArrowRight className="text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div onClick={() => handleCardClick('disease')} className="cursor-pointer h-[17.58rem] rounded-2xl bg-violet-50 p-4 shadow-sm hover:shadow-md transition">
                                    <div className="flex items-center gap-3 flex-col h-full justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-violet-200 text-violet-700 flex items-center justify-center">
                                                <FaMicroscope className="text-2xl" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Disease Scan</div>
                                                <div className="text-lg font-bold text-slate-800">No alerts</div>
                                            </div>
                                        </div>
                                        <div className="w-full mt-auto">
                                            <button onClick={() => handleCardClick('disease')} className="w-full -mx-4 flex items-center justify-between gap-2 text-sm font-medium text-emerald-600 border-t border-emerald-600 px-4 py-2 rounded-b-2xl">
                                                <span>Go now</span>
                                                <FaArrowRight className="text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* AI Farming Assistant Section */}
                        <AiFarmSection />

                        {modalOpen && modalContent && (
                            <div className="fixed inset-0 z-60 flex items-center justify-center">
                                <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
                                <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-lg font-semibold">{modalContent.title}</h3>
                                        <button onClick={() => setModalOpen(false)} className="text-sm text-slate-500 hover:text-slate-700">Close</button>
                                    </div>
                                    <div className="mt-4 text-sm text-slate-700">
                                        {modalContent.body}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Additional main content goes here */}
                    </main>

                    <FarmerFooter />
                </div>
            </div>
        </>
    );
}
