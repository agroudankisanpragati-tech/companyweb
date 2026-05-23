'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketplaceRedirect() {
  const router = useRouter();

  useEffect(() => {
    // redirect to shops listing
    router.replace('/shops');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold">Redirecting to Marketplace...</h2>
        <p className="text-sm text-gray-600 mt-2">If you are not redirected, <a href="/shops" className="text-green-600 underline">click here</a>.</p>
      </div>
    </div>
  );
}
