'use client';

import Link from 'next/link';
import { FaSignOutAlt, FaCog, FaChartLine, FaCloudSun, FaLeaf, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FarmerDashboard() {
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();

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

    const stats = [
        { label: 'Farm Size', value: '5 Acres' },
        { label: 'Soil Type', value: 'Loamy' },
        { label: 'Active Crops', value: '3' },
        { label: 'Total Yield', value: '2.5 Tons' },
    ];

    if (!isAuthenticated) return null;

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
                            <p className="text-sm md:text-base text-gray-600">Welcome back, {user?.name}</p>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4">
                            <Link
                                href="/dashboard/farmer/edit-profile"
                                className="p-2 md:p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-700 min-h-10 min-w-10 flex items-center justify-center"
                                title="Edit Profile"
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
                            <p className="text-xl md:text-2xl font-bold text-green-600">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Quick Access</h2>
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

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow p-4 md:p-8">
                    <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 pb-4 border-b">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <FaLeaf className="text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm md:text-base">Crop Recommendation Updated</p>
                                <p className="text-xs md:text-sm text-gray-600">AI suggests growing Wheat based on your soil conditions</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 pb-4 border-b">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <FaCloudSun className="text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm md:text-base">Weather Alert</p>
                                <p className="text-xs md:text-sm text-gray-600">Rain expected in next 2 hours, consider rescheduling irrigation</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                <FaShoppingCart className="text-yellow-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm md:text-base">Marketplace Listing Created</p>
                                <p className="text-xs md:text-sm text-gray-600">Your wheat crop is now visible to buyers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
