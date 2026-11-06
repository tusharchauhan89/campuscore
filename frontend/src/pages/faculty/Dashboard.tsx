import { useAuth } from '../../context/AuthContext';
import type { Faculty } from '../../types';
import { Users, ClipboardList, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const faculty = user?.data as Faculty;

  const cards = [
    { title: 'My Students', desc: 'View students in your department', to: '/faculty/students', icon: Users, color: 'bg-blue-500' },
    { title: 'Mark Attendance', desc: 'Record student attendance', to: '/faculty/attendance', icon: ClipboardList, color: 'bg-emerald-500' },
    { title: 'Add Marks', desc: 'Enter exam results', to: '/faculty/marks', icon: GraduationCap, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome, {faculty?.name}</h2>
        <p className="text-slate-500 mt-1">{faculty?.designation || 'Faculty'} · {faculty?.department} · {faculty?.employee_id}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.to} to={c.to} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className={`${c.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800">{c.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{c.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
