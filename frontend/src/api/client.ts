
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ PUBLIC ============

export const getPublicStatistics = () =>
  api.get('/public/statistics');

// ============ AUTH ============

export const studentLogin = (email: string, password: string) =>
  api.post('/Student-login', { email, password });

export const studentSignup = (data: {
  name: string;
  email: string;
  password: string;
  rollnumber: string;
  course: string;
}) => api.post('/students', data);

export const facultyLogin = (email: string, password: string) =>
  api.post('/faculty/login', { email, password });

export const facultyRegister = (data: {
  name: string;
  email: string;
  password: string;
  employee_id: string;
  department: string;
  designation?: string;
  phone?: string;
}) => api.post('/faculty/register', data);

// ============ STUDENT ============

export const getStudentDashboard = (studentId: number) =>
  api.get(`/student/${studentId}/dashboard`);

export const getStudentById = (id: number) =>
  api.get(`/student/id/${id}`);

export const getStudentAttendance = (studentId: number) =>
  api.get(`/student/${studentId}/attendance`);

export const getAttendanceSummary = (studentId: number) =>
  api.get(`/student/${studentId}/attendance/summary`);

export const getStudentMarks = (studentId: number) =>
  api.get(`/student/${studentId}/marks`);

export const getStudentResult = (studentId: number) =>
  api.get(`/student/${studentId}/result`);

export const getStudentFees = (studentId: number) =>
  api.get(`/student/${studentId}/fees`);

export const getFeeStatus = (studentId: number) =>
  api.get(`/student/${studentId}/fee-status`);

export const getStudentLibrary = (studentId: number) =>
  api.get(`/student/${studentId}/library`);

export const getLibraryHistory = (studentId: number) =>
  api.get(`/student/${studentId}/library/history`);

export const getLibraryFines = (studentId: number) =>
  api.get(`/student/${studentId}/library/fines`);

export const getStudentBookRequests = (studentId: number) =>
  api.get(`/student/${studentId}/library/requests`);

export const createBookRequest = (data: {
  student_id: number;
  book_id?: number;
  book_title: string;
  reason?: string;
}) => api.post('/library/request', data);

export const updateStudent = (
  id: number,
  data: Partial<{ name: string; email: string; course: string }>
) => api.put(`/student/${id}`, data);

export const updatePassword = (id: number, password: string) =>
  api.put(`/student/${id}/password`, { password });

// ============ NOTICES ============

export const getNotices = (course?: string) =>
  api.get('/notices', { params: course ? { course } : {} });

export const getNotice = (id: number) =>
  api.get(`/notices/${id}`);

// ============ BOOKS ============

export const getBooks = () => api.get('/books');

export const getBook = (id: number) =>
  api.get(`/books/${id}`);

export const createBook = (data: {
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  total_copies?: number;
  available_copies?: number;
}) => api.post('/books', data);

// ============ FACULTY ============

export const getFacultyStudents = (facultyId: number) =>
  api.get(`/faculty/${facultyId}/students`);

export const markAttendance = (data: {
  student_id: number;
  subject: string;
  date: string;
  status: string;
}) => api.post('/faculty/attendance', data);

export const addMarks = (data: {
  student_id: number;
  subject: string;
  exam_type: string;
  marks_obtained: number;
  max_marks: number;
  semester: string;
}) => api.post('/faculty/marks', data);

export const getAllFaculty = (department?: string) =>
  api.get('/faculty', { params: department ? { department } : {} });

export const updateFaculty = (id: number, data: any) =>
  api.put(`/faculty/${id}`, data);

// ============ ADMIN ============

export const getAdminDashboard = () =>
  api.get('/admin/dashboard');

export const getAdminStudents = (course?: string) =>
  api.get('/admin/students', { params: course ? { course } : {} });

export const getAdminFaculty = (department?: string) =>
  api.get('/admin/faculty', { params: department ? { department } : {} });

export const deleteStudent = (id: number) =>
  api.delete(`/admin/student/${id}`);

export const deleteFaculty = (id: number) =>
  api.delete(`/admin/faculty/${id}`);

export const getAdminBookRequests = (status?: string) =>
  api.get('/admin/book-requests', { params: status ? { status } : {} });

export const updateBookRequest = (
  id: number,
  data: { status: string; admin_remark?: string }
) => api.put(`/admin/book-request/${id}`, data);

export const createNotice = (data: {
  title: string;
  content: string;
  course?: string;
  created_at: string;
}) => api.post('/admin/notices', data);

export const getAdminFees = () =>
  api.get('/admin/fees');

// ============ LIBRARY ADMIN ============

export const issueBook = (data: {
  student_id: number;
  book_id: number;
  issue_date: string;
  due_date: string;
}) => api.post('/library/issue', data);

export const returnBook = (issueId: number) =>
  api.put(`/library/return/${issueId}`);

export default api;
