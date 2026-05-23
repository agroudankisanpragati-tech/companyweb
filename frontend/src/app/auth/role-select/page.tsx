"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaStore, FaUser } from 'react-icons/fa';

const roleCards = [
    {
        role: 'farmer',
        title: 'Farmer',
        description: 'Crop guidance, weather, schemes, and a simple dashboard built for growers.',
        points: ['AI crop advice', 'Weather alerts', 'Farmer dashboard'],
        accent: 'from-green-500 via-emerald-600 to-lime-500',
        glow: 'shadow-green-500/20',
        icon: <FaUser className="text-2xl" />,
    },
    {
        role: 'shopkeeper',
        title: 'Shopkeeper',
        description: 'Inventory, local supply, and farmer connections for agri stores and vendors.',
        points: ['Product listings', 'Order management', 'Shop dashboard'],
        accent: 'from-blue-500 via-cyan-600 to-sky-500',
        glow: 'shadow-blue-500/20',
        icon: <FaStore className="text-2xl" />,
    },
] as const;

export default function RoleSelectPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 30);
        return () => clearTimeout(t);
    }, []);

    return (
        <main className="min-h-[100dvh] overflow-hidden bg-[url('/background%20img.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-6">
            <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_rgba(0,0,0,0.55))]" />

            <div className="w-full max-w-5xl relative z-10">
                <div className="overflow-hidden rounded-[2rem] border border-white/25 shadow-2xl backdrop-blur-md">
                    <div className="absolute inset-0 bg-black/35" />

                    <div className="relative z-10 p-5 md:p-8">
                        <div className="flex justify-center mb-4 md:mb-6">
                            <Image src="/logo.png" alt="Kisan Unnati" width={56} height={56} className="rounded-xl ring-2 ring-white/50" />
                        </div>

                        <div className="text-center mb-6 md:mb-8">
                            <p className="text-[11px] md:text-xs tracking-[0.35em] uppercase text-green-100/80 mb-2">Choose your path</p>
                            <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">Farmer and shopkeeper are separate here</h1>
                            <p className="max-w-2xl mx-auto text-sm md:text-base text-white/75">
                                Pick the path that matches your work. Each side gets its own login, registration, and dashboard experience.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {roleCards.map((card, i) => {
                                const delays = ['delay-75', 'delay-150', 'delay-300', 'delay-500'];
                                const d = delays[i % delays.length];
                                return (
                                    <div
                                        key={card.role}
                                        className={`relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-5 md:p-6 shadow-xl ${card.glow} transform transition-all duration-500 ease-out ${d} ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                                    >
                                        <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.accent}`} />
                                        <div className="relative">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-r ${card.accent} text-white flex items-center justify-center shadow-lg`}>
                                                    {card.icon}
                                                </div>
                                                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
                                                    {card.title}
                                                </span>
                                            </div>

                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{card.title}</h2>
                                            <p className="text-sm md:text-base text-white/75 mb-4">{card.description}</p>

                                            <div className="space-y-2 mb-5">
                                                {card.points.map((point) => (
                                                    <div key={point} className="flex items-center gap-2 text-sm text-white/85">
                                                        <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${card.accent}`} />
                                                        <span>{point}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid gap-2 sm:grid-cols-2">
                                                <Link
                                                    href={`/auth/register?role=${card.role}`}
                                                    className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${card.accent} px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]`}
                                                >
                                                    Register as {card.title}
                                                    <FaArrowRight size={12} />
                                                </Link>
                                                <Link
                                                    href={`/auth/login?role=${card.role}`}
                                                    className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                                                >
                                                    Sign in
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export const dynamic = 'force-dynamic';
