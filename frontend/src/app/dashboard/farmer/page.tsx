'use client';

import Link from 'next/link';
import { FaSignOutAlt, FaCog, FaChartLine, FaCloudSun, FaLeaf, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import FarmerHeader from '@/components/FarmerHeader';
import FarmerFooter from '@/components/FarmerFooter';

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


    if (!isAuthenticated) return null;

    return (
        <>
            <FarmerHeader />
            <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* (Stats removed per request) */}

                {/* Quick Links */}
                <div className="mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Quick Access</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickLinks.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-150"
                                aria-label={link.title}
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-md bg-green-50 text-green-600 text-xl">
                                    {link.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900">{link.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* (Recent Activity removed per request) */}
            </div>
        </main>
            <FarmerFooter />
        </>
    );
}
