'use client';

import Link from 'next/link';
// use plain <img> for logo to avoid Next/Image sizing wrapper
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import FarmerProfileModal from './FarmerProfileModal';

export default function FarmerHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [openProfile, setOpenProfile] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth/role-select');
  };

  const initials = (user?.name || 'F').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();

  return (
    <>
      <header className="bg-white/75 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 flex items-center justify-between" style={{ height: '76px' }}>
          <div className="flex items-center gap-4">
            <div className="flex-none">
              <div className="w-28 h-full overflow-visible bg-white/0 flex items-center justify-center">
                <img src="/logo.png" alt="logo" className="h-12 md:h-16 w-auto object-contain" />
              </div>
            </div>

            <div className="flex-1">
              <div>
                <h1 className="text-lg md:text-2xl font-extrabold text-gray-900">Farmer Dashboard</h1>
                <p className="text-sm md:text-sm text-gray-600">Welcome back, <span className="font-semibold">{user?.name ?? 'Farmer'}</span></p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenProfile(true)}
              title="Profile"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center text-white hover:from-green-300 hover:to-green-500 shadow"
            >
              {(user as any)?.avatar || (user as any)?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(user as any).avatar || (user as any).photo} alt={user?.name || 'avatar'} className="w-9 h-9 rounded-full object-cover border-2 border-white" />
              ) : (
                <span className="font-semibold">{initials}</span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <FaSignOutAlt size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <FarmerProfileModal open={openProfile} onClose={() => setOpenProfile(false)} />
    </>
  );
}
