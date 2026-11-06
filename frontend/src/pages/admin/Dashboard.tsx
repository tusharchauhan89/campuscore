import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../api/client';
import { Users, GraduationCap, Library, CreditCard } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" /></div>;

  const cards = [
    { title: 'Students', value: data?.total_students ?? data?.students ?? '—', icon: Users, color: 'bg-blue-500' },
    { title: 'Faculty', value: data?.total_faculty ?? data?.faculty ?? '—', icon: GraduationCap, color: 'bg-emerald-500' },
    { title: 'Pending Requests', value: data?.pending_requests ?? '—', icon: Library, color: 'bg-amber-500' },
    { title: 'Pending Fees', value: data?.pending_fees ?? '—', icon: CreditCard, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{c.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{c.value}</p>
                </div>
                <div className={`${c.color} p-2.5 rounded-lg text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
