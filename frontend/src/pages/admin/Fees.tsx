import { useEffect, useState } from 'react';
import { getAdminFees } from '../../api/client';
import type { Fee } from '../../types';

export default function AdminFees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminFees()
      .then((res) => setFees(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">All Fees</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b"><tr>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Student ID</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Semester</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Amount</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Paid</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Due</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {fees.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No fee records</td></tr>
            ) : fees.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">{f.student_id}</td>
                <td className="px-4 py-3">{f.semester}</td>
                <td className="px-4 py-3">₹{f.amount}</td>
                <td className="px-4 py-3">₹{f.paid_amount}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    f.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>{f.status}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{f.due_date || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
