import { useState } from 'react';
import { markAttendance } from '../../api/client';

export default function FacultyAttendance() {
  const [form, setForm] = useState({
    student_id: '',
    subject: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Present',
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await markAttendance({
        student_id: Number(form.student_id),
        subject: form.subject,
        date: form.date,
        status: form.status,
      });
      setMsg('Attendance marked successfully!');
      setForm({ ...form, student_id: '', subject: '' });
    } catch (err: any) {
      setMsg(err.response?.data?.detail || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-bold text-slate-800">Mark Attendance</h2>
      {msg && <div className="bg-indigo-50 text-indigo-700 text-sm px-4 py-3 rounded-lg">{msg}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
          <input type="number" required value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Mark Attendance'}
        </button>
      </form>
    </div>
  );
}
