"use client";

import FarmerProfile from '@/components/farmer/FarmerProfile';
import { useAuth } from '@/context/AuthContext';

export default function Page() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <FarmerProfile user={user} />
      </div>
    </div>
  );
}
