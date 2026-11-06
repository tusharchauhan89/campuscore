
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import DashboardLayout from './layouts/DashboardLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Student
import StudentDashboard from './pages/student/Dashboard';
import StudentAttendance from './pages/student/Attendance';
import StudentResults from './pages/student/Results';
import StudentFees from './pages/student/Fees';
import StudentLibrary from './pages/student/Library';
import StudentNotices from './pages/student/Notices';
import StudentProfile from './pages/student/Profile';

// Faculty
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyStudents from './pages/faculty/Students';
import FacultyAttendance from './pages/faculty/Attendance';
import FacultyMarks from './pages/faculty/Marks';
import FacultyProfile from './pages/faculty/Profile';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminFaculty from './pages/admin/Faculty';
import AdminLibrary from './pages/admin/Library';
import AdminNotices from './pages/admin/Notices';
import AdminFees from './pages/admin/Fees';


function ProtectedRoute({
  children,
  role
}: {
  children: React.ReactNode;
  role?: string;
}) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={`/${user?.role}`} replace />;
  }

  return <>{children}</>;
}


export default function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="library" element={<StudentLibrary />} />
        <Route path="notices" element={<StudentNotices />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Faculty Routes */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute role="faculty">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FacultyDashboard />} />
        <Route path="students" element={<FacultyStudents />} />
        <Route path="attendance" element={<FacultyAttendance />} />
        <Route path="marks" element={<FacultyMarks />} />
        <Route path="profile" element={<FacultyProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="faculty" element={<AdminFaculty />} />
        <Route path="library" element={<AdminLibrary />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="fees" element={<AdminFees />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
