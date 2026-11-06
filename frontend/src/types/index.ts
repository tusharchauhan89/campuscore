export interface Student {
  id: number;
  name: string;
  email: string;
  rollnumber: string;
  course: string;
}

export interface Faculty {
  id: number;
  name: string;
  email: string;
  employee_id: string;
  department: string;
  designation?: string;
  phone?: string;
}

export interface Attendance {
  id: number;
  student_id: number;
  subject: string;
  date: string;
  status: string;
}

export interface Mark {
  id: number;
  student_id: number;
  subject: string;
  exam_type: string;
  marks_obtained: number;
  max_marks: number;
  semester: string;
}

export interface Fee {
  id: number;
  student_id: number;
  semester: string;
  amount: number;
  paid_amount: number;
  status: string;
  due_date?: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  course?: string;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  total_copies: number;
  available_copies: number;
}

export interface BookIssue {
  id: number;
  student_id: number;
  book_id: number;
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: string;
  fine_amount: number;
}

export interface BookRequest {
  id: number;
  student_id: number;
  book_id?: number;
  book_title: string;
  reason?: string;
  request_date: string;
  status: string;
  admin_remark?: string;
}

export interface DashboardData {
  student: Student;
  attendance: {
    total_classes: number;
    present: number;
    absent: number;
    percentage: number;
  };
  result: {
    total_subjects: number;
    total_obtained: number;
    total_max: number;
    percentage: number;
  };
  fee: {
    total_amount: number;
    total_paid: number;
    pending_amount: number;
    status: string;
  };
  notices: Notice[];
  library: {
    issued_books: number;
    total_fine: number;
  };
  pending_requests: number;
}

export type UserRole = 'student' | 'faculty' | 'admin';

export interface AuthUser {
  role: UserRole;
  data: Student | Faculty | { id: number; name: string };
}
