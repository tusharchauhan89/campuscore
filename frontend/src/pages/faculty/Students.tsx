import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFacultyStudents } from '../../api/client';
import type { Student, Faculty } from '../../types';

export default function FacultyStudents() {
  const { user } = useAuth();
  const faculty = user?.data as Faculty;
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!faculty?.id) return;
    getFacultyStudents(faculty.id)
      .then((res) => setStudents(res.data))
      .finally(() => setLoading(false));
  }, [faculty?.id]);

  if (loading) return <div className="flex justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">My Students</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b"><tr>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Roll No</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Course</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No students found</td></tr>
            ) : students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">{s.rollnumber}</td>
                <td className="px-4 py-3">{s.course}</td>
                <td className="px-4 py-3 text-slate-500">{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
