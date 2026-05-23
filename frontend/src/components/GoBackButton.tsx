'use client';

import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import React from 'react';

export default function GoBackButton({ fallback = '/dashboard/farmer', className }: { fallback?: string; className?: string }) {
  const router = useRouter();

  const handle = () => {
    try {
      router.back();
    } catch (e) {
      router.push(fallback);
    }
  };

  return (
    <button onClick={handle} className={className || 'inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md text-sm shadow-sm hover:shadow'}>
      <FaArrowLeft />
      <span>Go back</span>
    </button>
  );
}
