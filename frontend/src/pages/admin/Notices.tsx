import { useState } from 'react';
import { createNotice } from '../../api/client';

export default function AdminNotices() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    course: '',
    created_at: new Date().toISOString().slice(0, 10),
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await createNotice({
        ...form,
        course: form.course || undefined,
      });
      setMsg('Notice created successfully!');
      setForm({ title: '', content: '', course: '', created_at: new Date().toISOString().slice(0, 10) });
    } catch (err: any) {
      setMsg(err.response?.data?.detail || 'Failed to create notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-bold text-slate-800">Create Notice</h2>
      {msg && <div className="bg-indigo-50 text-indigo-700 text-sm px-4 py-3 rounded-lg">{msg}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
          <textarea required rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Course (optional, leave blank for all)</label>
          <input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}
            placeholder="CSE, IT, etc."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input type="date" required value={form.created_at} onChange={(e) => setForm({ ...form, created_at: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Publishing...' : 'Publish Notice'}
        </button>
      </form>
    </div>
  );
}
