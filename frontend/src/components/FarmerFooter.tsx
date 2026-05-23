'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function FarmerFooter() {
  const year = new Date().getFullYear();
  const { user } = useAuth();
  return (
    <footer className="mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-700">
        {user && (
          <div className="mb-2 text-sm text-gray-800">Signed in as <strong>{user.name}</strong>{user.email ? ` · ${user.email}` : ''}</div>
        )}
        <div className="text-xs text-gray-500">© {year} Kisan Unnati — Farmer Dashboard</div>
      </div>
    </footer>
  );
}
