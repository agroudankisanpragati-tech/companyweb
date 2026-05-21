'use client';

import { FaTrash } from 'react-icons/fa';
import { useAdmin } from '@/components/admin/AdminProvider';
import { TableShell } from '@/components/admin/AdminUi';
import { formatDate } from '@/components/admin/admin-api';

export default function AdminRecommendationsPage() {
  const { recommendations, deleteRecommendation } = useAdmin();

  return (
    <TableShell title="Crop recommendations" subtitle="Monitor AI suggestions being generated for farmers">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-4 pr-4 font-medium">Crop</th>
              <th className="pb-4 pr-4 font-medium">User</th>
              <th className="pb-4 pr-4 font-medium">Demand</th>
              <th className="pb-4 pr-4 font-medium">Profit</th>
              <th className="pb-4 pr-4 font-medium">Created</th>
              <th className="pb-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {recommendations.map((recommendation) => (
              <tr key={recommendation._id} className="align-top text-slate-200">
                <td className="py-4 pr-4">
                  <p className="font-semibold text-white">{recommendation.crop}</p>
                  <p className="text-xs text-slate-400">{recommendation.variety || 'No variety'}</p>
                </td>
                <td className="py-4 pr-4 text-slate-300">{recommendation.userId}</td>
                <td className="py-4 pr-4 text-slate-300">{recommendation.marketDemand || 'N/A'}</td>
                <td className="py-4 pr-4 text-slate-300">{recommendation.profitPotential ?? 0}</td>
                <td className="py-4 pr-4 text-slate-300">{formatDate(recommendation.createdAt)}</td>
                <td className="py-4">
                  <button type="button" className="admin-button-secondary text-xs" onClick={() => deleteRecommendation(recommendation._id)}>
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
