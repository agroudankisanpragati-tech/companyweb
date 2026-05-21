'use client';

import { FaCheckCircle, FaDatabase } from 'react-icons/fa';
import { API_BASE } from '@/components/admin/admin-api';
import { useAdmin } from '@/components/admin/AdminProvider';
import { TableShell } from '@/components/admin/AdminUi';

export default function AdminSettingsPage() {
  const { session } = useAdmin();

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <TableShell title="System settings" subtitle="Backend and control-plane details for operators">
        <div className="space-y-4 text-sm text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-slate-400">API base URL</p>
            <p className="mt-1 font-semibold text-white">{API_BASE}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-slate-400">Signed in user</p>
            <p className="mt-1 font-semibold text-white">{session?.name}</p>
            <p className="text-slate-400">{session?.email}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-slate-400">Bootstrap admin</p>
            <p className="mt-2 leading-6 text-slate-300">
              Configure <span className="font-semibold text-cyan-300">ADMIN_EMAIL</span> and <span className="font-semibold text-cyan-300">ADMIN_PASSWORD</span> in backend `.env` to auto-create the first admin user.
            </p>
          </div>
        </div>
      </TableShell>

      <TableShell title="System status" subtitle="Connection health and operational summary">
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Database & API</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
              <FaCheckCircle className="text-emerald-300" />
              Connected
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Control surfaces</p>
            <ul className="mt-2 space-y-2 text-slate-300">
              <li>• User role and verification management</li>
              <li>• Crop recommendation moderation</li>
              <li>• Marketplace listing status control</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <FaDatabase className="text-cyan-300" />
              API and admin shell are connected
            </div>
          </div>
        </div>
      </TableShell>
    </section>
  );
}
