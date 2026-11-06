import { useEffect, useState } from 'react';
import { getAdminStudents, deleteStudent } from '../../api/client';
import type { Student } from '../../types';

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState('');

  const load = () => {
    setLoading(true);
    getAdminStudents(course || undefined)
      .then((res) => setStudents(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [course]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this student?')) return;
    await deleteStudent(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-bold text-slate-800">Students</h2>
        <select value={course} onChange={(e) => setCourse(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All Courses</option>
          {['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">ID</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Roll No</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Course</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{s.id}</td>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{s.rollnumber}</td>
                  <td className="px-4 py-3">{s.course}</td>
                  <td className="px-4 py-3 text-slate-500">{s.email}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">
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
