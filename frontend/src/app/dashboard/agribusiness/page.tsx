'use client';

import Link from 'next/link';
import { FaSignOutAlt, FaCog, FaChartLine, FaGlobe, FaUsers, FaArrowUp } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AgribusinessDashboard() {
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'agribusiness') {
            router.push('/auth/role-select');
        }
    }, [isAuthenticated, user, router]);

    const handleLogout = () => {
        logout();
        router.push('/auth/role-select');
    };

    const quickLinks = [
        {
            title: 'Supply Chain',
            description: 'Manage distribution network',
            icon: <FaGlobe className="text-3xl" />,
            color: 'from-indigo-400 to-indigo-600',
            href: '#',
        },
        {
            title: 'Analytics Hub',
            description: 'Advanced business intelligence',
            icon: <FaChartLine className="text-3xl" />,
            color: 'from-green-400 to-green-600',
            href: '#',
        },
        {
            title: 'Partner Network',
            description: 'Connect with stakeholders',
            icon: <FaUsers className="text-3xl" />,
            color: 'from-blue-400 to-blue-600',
            href: '#',
        },
        {
            title: 'Performance',
            description: 'KPIs and metrics tracking',
            icon: <FaArrowUp className="text-3xl" />,
            color: 'from-purple-400 to-purple-600',
            href: '#',
        },
    ];

    const stats = [
        { label: 'Annual Yield', value: '5000 tons' },
        { label: 'Active Partnerships', value: '156' },
        { label: 'Distribution Centers', value: '12' },
        { label: 'Revenue (This Year)', value: '₹2.5 Cr' },
    ];

    if (!isAuthenticated) return null;

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Agribusiness Dashboard</h1>
                            <p className="text-sm md:text-base text-gray-600">Welcome back, {user?.name}</p>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4">
                            <Link
                                href="/auth/settings"
                                className="p-2 md:p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-700 min-h-10 min-w-10 flex items-center justify-center"
                            >
                                <FaCog size={20} />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-3 md:px-4 py-2 md:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm md:text-base font-semibold min-h-10 flex items-center gap-2"
                            >
                                <FaSignOutAlt size={18} /> <span className="hidden md:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow p-4 md:p-6">
                            <p className="text-xs md:text-sm text-gray-600 mb-2">{stat.label}</p>
                            <p className="text-lg md:text-2xl font-bold text-indigo-600">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Enterprise Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {quickLinks.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className="bg-white rounded-xl shadow hover:shadow-lg transition-all group overflow-hidden"
                            >
                                <div className={`bg-gradient-to-r ${link.color} p-4 md:p-6 text-white flex justify-center group-hover:scale-110 transition-transform`}>
                                    {link.icon}
                                </div>
                                <div className="p-4 md:p-6">
                                    <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{link.title}</h3>
                                    <p className="text-xs md:text-sm text-gray-600">{link.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Strategic Initiatives */}
                <div className="bg-white rounded-xl shadow p-4 md:p-8">
                    <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Strategic Initiatives</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 md:p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-indigo-600">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-lg md:text-xl font-bold">
                                1
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm md:text-base">Expand Distribution Network</p>
                                <p className="text-xs md:text-sm text-gray-600">Adding 5 new distribution centers across regions</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 md:p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-600">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white text-lg md:text-xl font-bold">
                                2
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm md:text-base">Sustainability Program</p>
                                <p className="text-xs md:text-sm text-gray-600">Promoting organic farming practices among suppliers</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 md:p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-600">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white text-lg md:text-xl font-bold">
                                3
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm md:text-base">Digital Transformation</p>
                                <p className="text-xs md:text-sm text-gray-600">Implementing blockchain for supply chain transparency</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
