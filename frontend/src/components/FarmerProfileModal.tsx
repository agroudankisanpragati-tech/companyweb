'use client';

import React, { useEffect, useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Profile {
  name?: string;
  phone?: string;
  farmSize?: string;
  soilType?: string;
  address?: string;
  location?: { state?: string; district?: string };
  photo?: string;
}

export default function FarmerProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState<Profile>({
    name: '',
    phone: '',
    farmSize: '',
    soilType: '',
    address: '',
    location: { state: '', district: '' },
    photo: '',
  });

  useEffect(() => {
    const local = typeof window !== 'undefined' ? localStorage.getItem('farmerProfile') : null;
    if (local) {
      try {
        const p = JSON.parse(local) as Profile;
        setForm((prev) => ({ ...prev, ...p }));
      } catch { }
    }

    if (user) {
      setForm((prev) => ({ ...prev, name: user.name || '', phone: (user as any).phone || '', photo: (user as any).photo || '' }));
    }
  }, [user]);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.agroudankisanpragati.com/api';

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
  const isJwtToken = (value: string | null) => !!value && value.split('.').length === 3;

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const token = getToken();

    if (!isJwtToken(token)) {
      try {
        const pid = (user as any)?.id || `local-farmer-${Date.now()}`;
        const payload = { ...form, id: pid };
        localStorage.setItem('farmerProfile', JSON.stringify(payload));
        setMessage('Saved locally');
        setTimeout(() => {
          onClose();
        }, 700);
      } catch (err) {
        console.error(err);
        setMessage('Failed to save locally');
      } finally {
        setSaving(false);
      }
      return;
    }

    try {
      const userId = (user as any)?.id;
      const res = await fetch(`${apiBase}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessage(err.error || 'Failed to update');
        setSaving(false);
        return;
      }

      setMessage('Profile updated');
      setTimeout(() => onClose(), 800);
    } catch (err) {
      console.error(err);
      setMessage('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Your Profile</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={form.photo || '/logo.png'} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-gray-900">{form.name || 'Farmer'}</p>
              <p className="text-sm text-gray-500">{form.phone || '—'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" placeholder="Full name" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border p-2 rounded" placeholder="Mobile" />
            <input value={form.farmSize} onChange={(e) => setForm({ ...form, farmSize: e.target.value })} className="border p-2 rounded" placeholder="Farm size" />
            <input value={form.soilType} onChange={(e) => setForm({ ...form, soilType: e.target.value })} className="border p-2 rounded" placeholder="Soil type" />
            <input value={form.location?.state} onChange={(e) => setForm({ ...form, location: { ...(form.location || {}), state: e.target.value } })} className="border p-2 rounded" placeholder="State" />
            <input value={form.location?.district} onChange={(e) => setForm({ ...form, location: { ...(form.location || {}), district: e.target.value } })} className="border p-2 rounded" placeholder="District" />
          </div>

          <div>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} className="w-full border p-2 rounded" placeholder="Address"></textarea>
          </div>

          <div>
            <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} className="border p-2 rounded w-full" placeholder="Photo URL (optional)" />
          </div>

          {message && <div className={`p-3 rounded ${message.includes('updated') || message.includes('Saved') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{message}</div>}

          <div className="flex justify-end gap-3">
            <button onClick={() => router.push('/dashboard/farmer/edit-profile')} className="px-4 py-2 border rounded">Open full editor</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded inline-flex items-center gap-2 disabled:opacity-50">
              <FaSave /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
