'use client';

import Link from 'next/link';
import { FaSignOutAlt, FaCog, FaChartLine, FaCloudSun, FaLeaf, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import FarmerHeader from '@/components/FarmerHeader';
import FarmerFooter from '@/components/FarmerFooter';
import FarmerSidebar from '@/components/FarmerSidebar';
import WeatherCard from '@/components/WeatherCard';
import CropHealthCard from '@/components/dashboard/CropHealthCard';
import AiSuggestionsCard from '@/components/dashboard/AiSuggestionsCard';
import { useState } from 'react';

export default function FarmerDashboard() {
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'farmer') {
            router.push('/auth/role-select');
        }
    }, [isAuthenticated, user, router]);

    const handleLogout = () => {
        logout();
        router.push('/auth/role-select');
    };

    const quickLinks = [
        {
            title: 'Crop Recommendations',
            description: 'Get AI-powered crop suggestions',
            icon: <FaLeaf className="text-3xl" />,
            color: 'from-green-400 to-green-600',
            href: '/dashboard/farmer/recommendations',
        },
        {
            title: 'Weather Updates',
            description: 'Real-time weather for your location',
            icon: <FaCloudSun className="text-3xl" />,
            color: 'from-blue-400 to-blue-600',
            href: '/weather',
        },
        {
            title: 'Marketplace',
            description: 'Sell your produce directly',
            icon: <FaShoppingCart className="text-3xl" />,
            color: 'from-yellow-400 to-yellow-600',
            href: '#',
        },
        {
            title: 'Analytics',
            description: 'Track your farm performance',
            icon: <FaChartLine className="text-3xl" />,
            color: 'from-purple-400 to-purple-600',
            href: '#',
        },
    ];


    if (!isAuthenticated) return null;

        return (
                <>
                        <FarmerHeader />
                        <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                            <FarmerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                            <div className="flex-1">
                                <main className="min-h-screen">
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl md:text-2xl font-bold">Dashboard</h2>
                                            <button
                                                className="md:hidden px-3 py-2 bg-white rounded shadow"
                                                onClick={() => setSidebarOpen(true)}
                                                aria-label="Open menu"
                                            >
                                                ☰
                                            </button>
                                        </div>

                                        {/* Quick Links */}
                                        <div className="mb-8 md:mb-12">
                                            <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {quickLinks.map((link, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={link.href}
                                                        className="flex flex-col items-start gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                                                        aria-label={link.title}
                                                    >
                                                        <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-white`} style={{ background: 'linear-gradient(135deg,#68D391,#38B2AC)' }}>
                                                            {link.icon}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-semibold text-gray-900">{link.title}</h4>
                                                            <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Dashboard Widgets */}
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <Link href="/weather" className="block">
                                                        <WeatherCard data={null} />
                                                    </Link>
                                                </div>
                                                <div className="space-y-6">
                                                    <Link href="/dashboard/farmer/crop-health" className="block">
                                                        <CropHealthCard />
                                                    </Link>
                                                    <Link href="/dashboard/farmer/ai-suggestions" className="block">
                                                        <AiSuggestionsCard />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </main>
                                <FarmerFooter />
                            </div>
                        </div>
                </>
        );
}
