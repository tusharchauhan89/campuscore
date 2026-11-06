import { useState } from 'react';
import { addMarks } from '../../api/client';

export default function FacultyMarks() {
  const [form, setForm] = useState({
    student_id: '',
    subject: '',
    exam_type: 'Midterm',
    marks_obtained: '',
    max_marks: '100',
    semester: '1',
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await addMarks({
        student_id: Number(form.student_id),
        subject: form.subject,
        exam_type: form.exam_type,
        marks_obtained: Number(form.marks_obtained),
        max_marks: Number(form.max_marks),
        semester: form.semester,
      });
      setMsg('Marks added successfully!');
      setForm({ ...form, student_id: '', subject: '', marks_obtained: '' });
    } catch (err: any) {
      setMsg(err.response?.data?.detail || 'Failed to add marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-bold text-slate-800">Add Marks</h2>
      {msg && <div className="bg-indigo-50 text-indigo-700 text-sm px-4 py-3 rounded-lg">{msg}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        {[
          { name: 'student_id', label: 'Student ID', type: 'number' },
          { name: 'subject', label: 'Subject', type: 'text' },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
            <input type={f.type} required value={(form as any)[f.name]}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Exam Type</label>
          <select value={form.exam_type} onChange={(e) => setForm({ ...form, exam_type: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>Midterm</option>
            <option>Final</option>
            <option>Quiz</option>
            <option>Assignment</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Marks Obtained</label>
            <input type="number" required value={form.marks_obtained}
              onChange={(e) => setForm({ ...form, marks_obtained: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Max Marks</label>
            <input type="number" required value={form.max_marks}
              onChange={(e) => setForm({ ...form, max_marks: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
          <input value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Add Marks'}
        </button>
      </form>
    </div>
  );
}
