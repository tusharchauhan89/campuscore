import { useEffect, useState } from 'react';
import { getAdminBookRequests, updateBookRequest } from '../../api/client';
import type { BookRequest } from '../../types';

export default function AdminLibrary() {
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => {
    setLoading(true);
    getAdminBookRequests(statusFilter || undefined)
      .then((res) => setRequests(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleUpdate = async (id: number, status: string) => {
    const remark = prompt('Admin remark (optional):') || undefined;
    await updateBookRequest(id, { status, admin_remark: remark });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-bold text-slate-800">Book Requests</h2>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Student ID</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Book Title</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No requests</td></tr>
              ) : requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{r.student_id}</td>
                  <td className="px-4 py-3 font-medium">{r.book_title}</td>
                  <td className="px-4 py-3">{r.request_date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      r.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {r.status === 'Pending' && (
                      <>
                        <button onClick={() => handleUpdate(r.id, 'Approved')} className="text-emerald-600 hover:text-emerald-800 text-xs font-medium">Approve</button>
                        <button onClick={() => handleUpdate(r.id, 'Rejected')} className="text-red-600 hover:text-red-800 text-xs font-medium">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
