'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaStore, FaBuilding } from 'react-icons/fa';
import type { UserRole } from '@/context/AuthContext';

const roles = {
    farmer: {
        label: 'Farmer',
        icon: <FaUser className="text-2xl" />,
        color: 'from-green-500 to-green-700',
    },
    shopkeeper: {
        label: 'Shopkeeper',
        icon: <FaStore className="text-2xl" />,
        color: 'from-blue-500 to-blue-700',
    },
    agribusiness: {
        label: 'Agribusiness',
        icon: <FaBuilding className="text-2xl" />,
        color: 'from-amber-500 to-orange-700',
    },
} as const;

export default function RoleSelectPage() {
    const [activeRole, setActiveRole] = useState<UserRole>('farmer');
    const role = roles[activeRole];

    return (
        <main className="h-[100dvh] overflow-hidden bg-[url('/background%20img.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
            <div className="fixed inset-0 z-0 bg-black/40" />

            <div className="w-full max-w-md px-4 relative z-10">
                <div className="relative overflow-hidden rounded-2xl border border-white/30 shadow-2xl">
                    <div className="absolute inset-0 bg-[url('/background%20img.jpg')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-black/45" />

                    <div className="relative z-10 p-5 backdrop-blur-md">
                        <div className="flex justify-center mb-3">
                            <Image src="/logo.png" alt="Kisan Unnati" width={52} height={52} className="rounded-lg" />
                        </div>

                        <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-4">Select Role</h1>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {(Object.keys(roles) as UserRole[]).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setActiveRole(key)}
                                    className={`h-10 rounded-lg text-xs font-semibold transition ${activeRole === key
                                            ? 'bg-white/90 text-gray-900'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                >
                                    {roles[key].label}
                                </button>
                            ))}
                        </div>

                        <div className="rounded-xl border border-white/30 bg-white/10 p-4 mb-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${role.color} text-white flex items-center justify-center mx-auto mb-3`}>
                                {role.icon}
                            </div>
                            <p className="text-center text-white font-semibold">{role.label}</p>
                        </div>

                        <div className="space-y-2">
                            <Link
                                href={`/auth/register?role=${activeRole}`}
                                className={`block w-full h-10 rounded-lg bg-gradient-to-r ${role.color} text-white font-semibold text-center leading-10`}
                            >
                                Register
                            </Link>
                            <Link
                                href={`/auth/login?role=${activeRole}`}
                                className="block w-full h-10 rounded-lg border border-white/40 bg-white/10 text-white font-semibold text-center leading-10"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
