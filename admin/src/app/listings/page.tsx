'use client';

import { FaTrash } from 'react-icons/fa';
import { useAdmin } from '@/components/admin/AdminProvider';
import { TableShell } from '@/components/admin/AdminUi';
import { formatDate } from '@/components/admin/admin-api';

export default function AdminListingsPage() {
  const { listings, pendingAction, updateListingStatus, deleteListing } = useAdmin();

  return (
    <TableShell title="Marketplace listings" subtitle="Approve, sold-mark, or remove listings from circulation">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-4 pr-4 font-medium">Crop</th>
              <th className="pb-4 pr-4 font-medium">Location</th>
              <th className="pb-4 pr-4 font-medium">Price</th>
              <th className="pb-4 pr-4 font-medium">Status</th>
              <th className="pb-4 pr-4 font-medium">Created</th>
              <th className="pb-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {listings.map((listing) => (
              <tr key={listing._id} className="align-top text-slate-200">
                <td className="py-4 pr-4">
                  <p className="font-semibold text-white">{listing.cropName}</p>
                  <p className="text-xs text-slate-400">{listing.quantity} {listing.unit} {listing.organic ? '• Organic' : ''}</p>
                </td>
                <td className="py-4 pr-4 text-slate-300">{listing.location?.district}, {listing.location?.state}</td>
                <td className="py-4 pr-4 text-slate-300">₹{listing.pricePerUnit}/{listing.unit}</td>
                <td className="py-4 pr-4">
                  <select
                    className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none"
                    aria-label={`Change listing status for ${listing.cropName}`}
                    value={listing.status}
                    onChange={(event) => updateListingStatus(listing._id, event.target.value as 'available' | 'sold' | 'pending')}
                    disabled={pendingAction === `listing-${listing._id}`}
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                </td>
                <td className="py-4 pr-4 text-slate-300">{formatDate(listing.createdAt)}</td>
                <td className="py-4">
                  <button type="button" className="admin-button-secondary text-xs" onClick={() => deleteListing(listing._id)}>
                    <FaTrash />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}
