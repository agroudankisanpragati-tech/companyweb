'use client';

import { FaEye, FaTrash } from 'react-icons/fa';
import { useAdmin } from '@/components/admin/AdminProvider';
import { TableShell } from '@/components/admin/AdminUi';
import { formatDate } from '@/components/admin/admin-api';

export default function AdminUsersPage() {
  const { users, pendingAction, updateUserRole, toggleVerification, deleteUser } = useAdmin();

  return (
    <TableShell title="User management" subtitle="Promote users, verify accounts, or remove access">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-4 pr-4 font-medium">Name</th>
              <th className="pb-4 pr-4 font-medium">Email</th>
              <th className="pb-4 pr-4 font-medium">Role</th>
              <th className="pb-4 pr-4 font-medium">Verified</th>
              <th className="pb-4 pr-4 font-medium">Joined</th>
              <th className="pb-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.map((user) => (
              <tr key={user._id} className="align-top text-slate-200">
                <td className="py-4 pr-4">
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">Points: {user.points ?? 0}</p>
                </td>
                <td className="py-4 pr-4 text-slate-300">{user.email}</td>
                <td className="py-4 pr-4">
                  <select
                    className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none"
                    aria-label={`Change role for ${user.name}`}
                    value={user.role}
                    onChange={(event) => updateUserRole(user._id, event.target.value as 'farmer' | 'vendor' | 'admin')}
                    disabled={pendingAction === `role-${user._id}`}
                  >
                    <option value="farmer">Farmer</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-4 pr-4">
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${user.verified ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-slate-300'}`}
                    onClick={() => toggleVerification(user._id, !user.verified)}
                    disabled={pendingAction === `verify-${user._id}`}
                  >
                    {user.verified ? 'Verified' : 'Unverified'}
                  </button>
                </td>
                <td className="py-4 pr-4 text-slate-300">{formatDate(user.createdAt)}</td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="admin-button-secondary text-xs" onClick={() => toggleVerification(user._id, true)}>
                      <FaEye />
                      Verify
                    </button>
                    <button type="button" className="admin-button-secondary text-xs" onClick={() => deleteUser(user._id)}>
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}
