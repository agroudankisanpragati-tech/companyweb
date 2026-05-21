"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBell, FaCloud, FaHome } from 'react-icons/fa';
import TopBar from '@/components/TopBar';
import WeatherWidget from './WeatherWidget';

export default function Page() {
    return (
        <>
            <TopBar />
            <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.16),_transparent_28%),linear-gradient(180deg,_#f8fdf7_0%,_#f2fbf5_42%,_#eef7ee_100%)]">
                <div className="pointer-events-none absolute inset-0 opacity-60">
                    <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl" />
                    <div className="absolute right-0 top-40 h-56 w-56 rounded-full bg-lime-300/20 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />
                </div>

                {/* Header */}
                <div className="relative border-b border-white/50 bg-gradient-to-r from-emerald-700 via-green-700 to-lime-600 text-white shadow-[0_14px_34px_rgba(22,101,52,0.14)]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 md:py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                            <div className="flex items-center gap-2.5 md:gap-3">
                            <div className="rounded-lg bg-white/15 p-1.5 ring-1 ring-white/20 backdrop-blur">
                                <Image
                                    src="/logo.png"
                                    alt="Kisan Unnati Logo"
                                    width={30}
                                    height={30}
                                    className="rounded-md bg-white p-0.5"
                                />
                            </div>
                            <div className="min-w-0">
                                <h1 className="truncate text-xl sm:text-2xl font-bold tracking-tight text-white">Live Farm Forecast</h1>
                            </div>
                        </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/95 backdrop-blur transition hover:bg-white/15">
                                    <FaHome className="text-[0.8rem]" />
                                    Home
                                </Link>
                                <button className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/95 backdrop-blur transition hover:bg-white/15">
                                    <FaBell className="text-[0.8rem]" />
                                    Notifications
                                </button>
                                <button className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/95 backdrop-blur transition hover:bg-white/15">
                                    <FaCloud className="text-[0.8rem]" />
                                    Weather Forecast
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    {/* Weather Widget */}
                    <div className="overflow-auto rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_24px_70px_rgba(20,83,45,0.12)] backdrop-blur-md md:p-8">
                        <WeatherWidget />
                    </div>

                </div>
            </main >
        </>
    );
}
