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
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 flex items-center justify-between" style={{ height: '61px' }}>
          <div className="flex items-center gap-4">
            <div className="flex-none">
              <div className="w-24 h-full overflow-hidden bg-white/0 flex items-center justify-center">
                <img src="/logo.png" alt="logo" className="h-full w-auto object-contain scale-105" />
              </div>
            </div>

            <div className="flex-1">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Farmer Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-600">Welcome, Rohit Sharma</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenProfile(true)}
              title="Profile"
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200"
            >
              {(user as any)?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(user as any).photo} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
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
