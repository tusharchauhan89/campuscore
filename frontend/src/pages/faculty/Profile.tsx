import { useAuth } from '../../context/AuthContext';
import type { Faculty } from '../../types';
import { User } from 'lucide-react';

export default function FacultyProfile() {
  const { user } = useAuth();
  const faculty = user?.data as Faculty;

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-2xl font-bold text-slate-800">Profile</h2>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <p className="font-semibold text-lg">{faculty?.name}</p>
            <p className="text-sm text-slate-500">{faculty?.designation} · {faculty?.department}</p>
          </div>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <dt className="text-slate-500">Employee ID</dt>
            <dd className="font-medium">{faculty?.employee_id}</dd>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium">{faculty?.email}</dd>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <dt className="text-slate-500">Department</dt>
            <dd className="font-medium">{faculty?.department}</dd>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <dt className="text-slate-500">Phone</dt>
            <dd className="font-medium">{faculty?.phone || '—'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
