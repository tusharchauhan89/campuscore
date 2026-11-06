import { useEffect, useState } from 'react';
import { getAdminFaculty, deleteFaculty } from '../../api/client';
import type { Faculty } from '../../types';

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAdminFaculty()
      .then((res) => setFaculty(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this faculty member?')) return;
    await deleteFaculty(id);
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Faculty</h2>
      {loading ? (
        <div className="flex justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Employee ID</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Department</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Designation</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {faculty.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{f.name}</td>
                  <td className="px-4 py-3">{f.employee_id}</td>
                  <td className="px-4 py-3">{f.department}</td>
                  <td className="px-4 py-3">{f.designation || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{f.email}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">
                      Delete
                    </button>
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
