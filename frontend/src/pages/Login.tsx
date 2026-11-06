
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentLogin, facultyLogin } from '../api/client';

import {
  Shield,
  GraduationCap,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  BookOpen,
  ArrowRight,
  Menu,
  X,
  Moon,
  Sun,
  CalendarCheck,
  Library,
  ClipboardList,
  Wallet
} from 'lucide-react';

type RoleTab = 'student' | 'faculty' | 'admin';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState<RoleTab>(() => {
    const role = searchParams.get('role');

    if (role === 'admin' || role === 'faculty') return role;
    return 'student';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'student') {
        const res = await studentLogin(email, password);
        login('student', res.data);
        navigate('/student');

      } else if (tab === 'faculty') {
        const res = await facultyLogin(email, password);
        login('faculty', res.data);
        navigate('/faculty');

      } else {
        // Demo admin authentication
        if (
          email === 'admin@cms.com' &&
          password === 'admin123'
        ) {
          login('admin', {
            id: 0,
            name: 'Administrator'
          });
          navigate('/admin');
        } else {
          setError('Invalid admin credentials.');
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'admin', label: 'Admin', icon: Shield }
  ] as const;

  const features = [
    {
      title: 'Attendance',
      description: 'Track attendance and view detailed reports.',
      icon: CalendarCheck
    },
    {
      title: 'Examinations',
      description: 'Access examination schedules and results.',
      icon: ClipboardList
    },
    {
      title: 'Fee Management',
      description: 'Manage fee records and payment information.',
      icon: Wallet
    },
    {
      title: 'Digital Library',
      description: 'Explore books and learning resources.',
      icon: Library
    }
  ];

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode ? 'bg-slate-950' : 'bg-white'
    }`}>

      {/* NAVBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3">
        <nav className="mx-auto max-w-[1450px] rounded-2xl border border-white/70 bg-white/90 px-5 py-3 shadow-lg backdrop-blur-xl md:px-7">

          <div className="flex items-center justify-between">

            {/* LOGO */}
            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() => navigate('/')}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-950 to-emerald-800 text-white shadow-md">
                <BookOpen size={29} />
              </div>

              <div>
                <h1 className="font-serif text-xl font-bold tracking-wide text-slate-900 md:text-2xl">
                  GREENFIELD
                </h1>
                <p className="text-[10px] font-semibold tracking-[5px] text-emerald-800">
                  COLLEGE
                </p>
              </div>
            </div>

            {/* DESKTOP NAV */}
            <div className="hidden items-center gap-8 md:flex">
              <button
                onClick={() => navigate('/')}
                className="text-slate-700 transition hover:text-blue-600"
              >
                Home
              </button>

              <button
                onClick={() => navigate('/')}
                className="text-slate-700 transition hover:text-blue-600"
              >
                Courses
              </button>

              <button
                onClick={() => navigate('/signup')}
                className="text-slate-700 transition hover:text-blue-600"
              >
                Admissions
              </button>

              <button
                className="border-b-2 border-blue-600 pb-1 font-semibold text-blue-700"
              >
                Portal
              </button>

              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-slate-700 transition hover:text-blue-600"
              >
                Contact
              </button>
            </div>

            {/* NAV ACTIONS */}
            <div className="hidden items-center gap-5 md:flex">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-full p-2 text-slate-800 transition hover:bg-slate-100"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={22} /> : <Moon size={22} />}
              </button>

              <button
                onClick={() => navigate('/signup')}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
              >
                Get Started <ArrowRight size={18} />
              </button>
            </div>

            {/* MOBILE MENU */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="text-slate-800 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenu ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>

          {mobileMenu && (
            <div className="mt-4 flex flex-col gap-4 border-t border-slate-200 py-4 text-sm text-slate-700 md:hidden">
              <button onClick={() => navigate('/')}>Home</button>
              <button onClick={() => navigate('/')}>Courses</button>
              <button onClick={() => navigate('/signup')}>Admissions</button>
              <button onClick={() => setMobileMenu(false)}>Portal</button>
              <button onClick={() => setDarkMode(!darkMode)}>Toggle Theme</button>
            </div>
          )}

        </nav>
      </header>

      {/* HERO + LOGIN */}
      <section className="relative flex min-h-[850px] items-center overflow-hidden bg-slate-950 pt-28 pb-16 lg:min-h-[790px]">

        {/* CAMPUS BACKGROUND */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2200&q=90')"
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-950/75 to-slate-950/65" />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1450px] items-center gap-12 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">

          {/* LEFT CONTENT */}
          <div className="text-white">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
              <Shield size={16} className="text-emerald-300" />
              Welcome to Greenfield College
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Your Education.
              <br />
              Your Future.
              <br />
              <span className="text-blue-300">
                Our Commitment.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 md:text-lg">
              Experience smarter campus management with Greenfield College.
              Access your academic information, attendance, examinations,
              fees and more through one connected portal.
            </p>

            {/* HIGHLIGHTS */}
            <div className="mt-8 flex flex-wrap gap-3">

              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                <GraduationCap className="text-blue-300" size={22} />
                <span className="text-sm font-medium">Student Portal</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                <Users className="text-emerald-300" size={22} />
                <span className="text-sm font-medium">Faculty Portal</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                <Shield className="text-amber-300" size={22} />
                <span className="text-sm font-medium">Admin Portal</span>
              </div>

            </div>

            <div className="mt-10 border-l-4 border-blue-400 pl-5">
              <p className="text-lg font-semibold">
                Smart Campus. Better Future.
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Empowering education through technology.
              </p>
            </div>

          </div>

          {/* RIGHT LOGIN CARD */}
          <div className="mx-auto w-full max-w-[540px]">

            <div className="overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl">

              {/* CARD HEADER */}
              <div className="bg-gradient-to-r from-blue-950 to-blue-700 px-7 py-7 text-center text-white md:py-9">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/15">
                  <Shield size={29} />
                </div>

                <h2 className="text-2xl font-bold md:text-3xl">
                  Welcome Back!
                </h2>

                <p className="mt-2 text-sm text-blue-100 md:text-base">
                  Sign in to access your college portal
                </p>

              </div>

              {/* ROLE TABS */}
              <div className="flex border-b border-slate-200 bg-slate-50">

                {roles.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setTab(id);
                      setError('');
                      setPassword('');
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 border-b-4 py-4 text-sm font-semibold transition ${
                      tab === id
                        ? 'border-blue-600 bg-white text-blue-700'
                        : 'border-transparent text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </button>
                ))}

              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6 md:p-8"
              >

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {tab === 'student'
                      ? 'Student Login'
                      : tab === 'faculty'
                      ? 'Faculty Login'
                      : 'Administrator Login'}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter your credentials to continue.
                  </p>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={
                        tab === 'admin'
                          ? 'admin@cms.com'
                          : 'you@college.edu'
                      }
                      className="w-full rounded-2xl border border-slate-300 bg-blue-50/70 py-4 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-slate-300 bg-blue-50/70 py-4 pl-12 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-700"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword
                        ? <EyeOff size={20} />
                        : <Eye size={20} />
                      }
                    </button>
                  </div>
                </div>

                {/* SIGN IN */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 py-4 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={19} />
                    </>
                  )}
                </button>

                {/* STUDENT SIGNUP */}
                {tab === 'student' && (
                  <p className="text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/signup')}
                      className="font-semibold text-blue-700 hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                )}

                {/* ADMIN DEMO */}
                {tab === 'admin' && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-center">
                    <p className="text-xs font-semibold text-blue-800">
                      Demo Admin Credentials
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      admin@cms.com / admin123
                    </p>
                  </div>
                )}

              </form>
            </div>

            <p className="mt-5 text-center text-xs text-slate-300">
              Secure access to Greenfield College Management System
            </p>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className={`px-5 py-16 md:px-10 ${
        darkMode ? 'bg-slate-950' : 'bg-white'
      }`}>

        <div className="mx-auto max-w-[1400px]">

          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-0.5 w-8 bg-blue-600" />
              <span className="font-bold tracking-widest text-blue-700">
                OUR SERVICES
              </span>
              <span className="h-0.5 w-8 bg-blue-600" />
            </div>

            <h2 className={`text-3xl font-bold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Powerful Tools for Modern Campuses
            </h2>

            <p className={`mt-3 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Everything you need for a smarter college experience.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {features.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className={`flex min-h-[160px] items-center gap-4 rounded-2xl border p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-xl ${
                  darkMode
                    ? 'border-slate-700 bg-slate-900'
                    : 'border-slate-200 bg-gradient-to-br from-white to-blue-50'
                }`}
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg">
                  <Icon size={31} />
                </div>

                <div>
                  <h3 className={`font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {title}
                  </h3>

                  <p className={`mt-2 text-xs leading-5 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {description}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="bg-slate-950 px-6 py-10 text-slate-300"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">

          <div>
            <h2 className="font-serif text-xl font-bold text-white">
              GREENFIELD COLLEGE
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Smart Campus. Better Future.
            </p>
          </div>

          <div className="text-center text-sm md:text-right">
            <p>College Management System</p>
            <p className="mt-2 text-slate-500">
              © {new Date().getFullYear()} Greenfield College. All rights reserved.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
