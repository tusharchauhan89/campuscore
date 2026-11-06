
import { useEffect, useState } from 'react';
import {
  Link,
  Outlet,
  useNavigate,
  useLocation
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import {
  LayoutDashboard,
  User,
  ClipboardList,
  GraduationCap,
  CreditCard,
  Bell,
  Library,
  Users,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen
} from 'lucide-react';

const studentLinks = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/attendance', icon: ClipboardList, label: 'Attendance' },
  { to: '/student/results', icon: GraduationCap, label: 'Results' },
  { to: '/student/fees', icon: CreditCard, label: 'Fees' },
  { to: '/student/library', icon: Library, label: 'Library' },
  { to: '/student/notices', icon: Bell, label: 'Notices' },
  { to: '/student/profile', icon: User, label: 'Profile' },
];

const facultyLinks = [
  { to: '/faculty', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/faculty/students', icon: Users, label: 'My Students' },
  { to: '/faculty/attendance', icon: ClipboardList, label: 'Mark Attendance' },
  { to: '/faculty/marks', icon: GraduationCap, label: 'Add Marks' },
  { to: '/faculty/profile', icon: User, label: 'Profile' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/students', icon: Users, label: 'Students' },
  { to: '/admin/faculty', icon: GraduationCap, label: 'Faculty' },
  { to: '/admin/library', icon: Library, label: 'Library Requests' },
  { to: '/admin/notices', icon: Bell, label: 'Notices' },
  { to: '/admin/fees', icon: CreditCard, label: 'Fees' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Redirect unauthenticated users.
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Close mobile sidebar whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const links =
    user.role === 'student'
      ? studentLinks
      : user.role === 'faculty'
        ? facultyLinks
        : adminLinks;

  const name =
    'name' in user.data && user.data.name
      ? user.data.name
      : 'Administrator';

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part.charAt(0).toUpperCase())
    .join('');

  const roleLabel =
    user.role === 'student'
      ? 'Student Portal'
      : user.role === 'faculty'
        ? 'Faculty Portal'
        : 'Administration';

  const currentPage =
    links.find((link) =>
      link.to === `/${user.role}`
        ? location.pathname === link.to
        : location.pathname === link.to ||
          location.pathname.startsWith(`${link.to}/`)
    )?.label || 'Dashboard';

  const isActive = (path: string) => {
    if (path === `/${user.role}`) {
      return location.pathname === path;
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#F5F9FF] text-[#0B2545]">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0B2545]/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          border-r border-[#DCEBFA]
          bg-white shadow-xl shadow-[#123B66]/5
          transition-all duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none
          ${
            sidebarCollapsed ? 'lg:w-[88px]' : 'lg:w-[270px]'
          }
          w-[270px]
          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >

        {/* Logo */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#EAF2FA] px-5">
          <Link
            to={`/${user.role}`}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#123B66] to-[#0B2545] shadow-md shadow-[#123B66]/20">
              <Shield className="h-6 w-6 text-white" />
            </div>

            <div className={sidebarCollapsed ? 'lg:hidden' : ''}>
              <h1 className="text-lg font-extrabold tracking-tight text-[#0B2545]">
                CMS<span className="text-[#38BDF8]">.</span>
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                College Portal
              </p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-[#EFF7FF] hover:text-[#123B66] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-[#EFF7FF] hover:text-[#123B66] lg:block"
            aria-label="Toggle sidebar"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* User Information */}
        <div className={`border-b border-[#EAF2FA] p-4 ${sidebarCollapsed ? 'lg:px-3' : ''}`}>
          <div className={`flex items-center gap-3 rounded-xl bg-[#F5F9FF] p-3 ${sidebarCollapsed ? 'lg:justify-center lg:p-2' : ''}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#123B66] text-sm font-bold text-white shadow-sm">
              {initials || 'U'}
            </div>

            <div className={`min-w-0 flex-1 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
              <p className="truncate text-sm font-bold text-[#123B66]">
                {name}
              </p>
              <p className="mt-0.5 text-[11px] font-medium capitalize text-slate-500">
                {user.role} Account
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-5 pb-2 pt-6">
          <p className={`text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
            Main Menu
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {links.map((link) => {
            const active = isActive(link.to);
            const Icon = link.icon;

            return (
              <Link
                key={link.to}
                to={link.to}
                title={sidebarCollapsed ? link.label : undefined}
                className={`
                  group relative flex items-center gap-3
                  rounded-xl px-3 py-3 text-sm font-semibold
                  transition-all duration-200
                  ${
                    active
                      ? 'bg-[#123B66] text-white shadow-md shadow-[#123B66]/20'
                      : 'text-slate-500 hover:bg-[#EFF7FF] hover:text-[#123B66]'
                  }
                  ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}
                `}
              >
                {active && (
                  <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-[#38BDF8]" />
                )}

                <Icon
                  className={`
                    h-[19px] w-[19px] shrink-0 transition-transform duration-200
                    ${
                      active
                        ? 'text-[#7DD3FC]'
                        : 'text-slate-400 group-hover:scale-110 group-hover:text-[#123B66]'
                    }
                  `}
                />

                <span className={`flex-1 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                  {link.label}
                </span>

                {active && (
                  <ChevronRight className={`h-4 w-4 text-[#7DD3FC] ${sidebarCollapsed ? 'lg:hidden' : ''}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom */}
        <div className="shrink-0 border-t border-[#EAF2FA] p-3">
          <div className={`mb-3 flex items-center gap-2 rounded-xl bg-[#EFF7FF] p-3 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
            <div className="rounded-lg bg-white p-2">
              <BookOpen className="h-4 w-4 text-[#123B66]" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#123B66]">
                CMS Portal
              </p>
              <p className="text-[10px] text-slate-500">
                Your academic workspace
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Logout' : undefined}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600 ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
          >
            <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            <span className={sidebarCollapsed ? 'lg:hidden' : ''}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-[#DCEBFA] bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">

          <div className="flex min-w-0 items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[#DCEBFA] bg-white p-2.5 text-[#123B66] shadow-sm transition hover:bg-[#EFF7FF] lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="hidden sm:inline">CMS Portal</span>
                <ChevronRight className="hidden h-3 w-3 sm:inline" />
                <span className="capitalize">{user.role}</span>
              </div>

              <h2 className="mt-0.5 truncate text-lg font-bold text-[#0B2545] sm:text-xl">
                {currentPage}
              </h2>
            </div>
          </div>

          {/* Header Right */}
          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-[#123B66]">
                {roleLabel}
              </p>
              <p className="text-[11px] text-slate-400">
                Welcome back
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCEBFA] bg-[#EFF7FF] text-sm font-bold text-[#123B66]">
              {initials || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#DCEBFA] bg-white px-6 py-4">
          <div className="flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
            <p>
              © {new Date().getFullYear()} CMS Portal. All rights reserved.
            </p>

            <p className="font-medium text-[#486581]">
              College Management System
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
