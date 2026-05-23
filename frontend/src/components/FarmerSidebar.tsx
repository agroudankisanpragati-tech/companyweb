'use client';

import Link from 'next/link';
import { FaLeaf, FaCloudSun, FaShoppingCart, FaChartLine, FaUser } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function FarmerSidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const { user } = useAuth();

  const nav = [
    { title: 'Home', href: '/dashboard/farmer', icon: <FaLeaf /> },
    { title: 'Recommendations', href: '/dashboard/farmer/recommendations', icon: <FaLeaf /> },
    { title: 'Weather', href: '/weather', icon: <FaCloudSun /> },
    { title: 'Marketplace', href: '/shops', icon: <FaShoppingCart /> },
    { title: 'Analytics', href: '#', icon: <FaChartLine /> },
    { title: 'Profile', href: '/dashboard/farmer/profile', icon: <FaUser /> },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 transform w-64 p-5 overflow-y-auto transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      aria-hidden={!open && typeof window !== 'undefined'}
    >
      <div className="h-full flex flex-col justify-between bg-gradient-to-b from-white/80 via-green-50 to-green-100 border border-gray-100 rounded-r-2xl p-4 shadow-lg backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-200 to-green-400 text-white flex items-center justify-center text-lg font-bold shadow-md">{(user?.name || 'F').slice(0,1)}</div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{user?.name ?? 'Farmer'}</div>
              <div className="text-xs text-green-700 capitalize">{user?.role ?? 'farmer'}</div>
            </div>
          </div>

          <div className="mb-4">
            <input
              placeholder="Search features..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-100 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <nav className="flex flex-col gap-2">
            {nav.map((n, i) => (
              <Link
                key={i}
                href={n.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                onClick={() => onClose && onClose()}
              >
                <span className="text-lg text-green-600">{n.icon}</span>
                <span>{n.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs">Need help?</div>
              <a href="mailto:agroudankisanpragati@gmail.com" className="text-green-800 hover:underline">Contact us</a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
