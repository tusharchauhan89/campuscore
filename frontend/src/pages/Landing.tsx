
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  Moon,
  Sun,
  ArrowRight,
  UserRound,
  ClipboardList,
  Wallet,
  Library,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

import { getPublicStatistics } from '../api/client';

const features = [
  {
    title: 'Attendance Tracking',
    description:
      'Automate attendance with smart biometric and geolocation integration. Real-time reports and insights.',
    icon: UserRound,
    color: 'blue',
  },
  {
    title: 'Online Examinations',
    description:
      'Conduct secure, proctored exams online with auto-evaluation and detailed analytics.',
    icon: ClipboardList,
    color: 'indigo',
  },
  {
    title: 'Fee Management',
    description:
      'Manage fee collection, invoices, due reminders and payment gateways seamlessly.',
    icon: Wallet,
    color: 'sky',
  },
  {
    title: 'Library',
    description:
      'Digital library access with e-books, journals, catalog search and member management.',
    icon: Library,
    color: 'blue',
  },
];

interface Statistics {
  total_students: number;
  total_faculty: number;
  total_courses: number;
  attendance_percentage: number;
}

export default function Landing() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const [stats, setStats] = useState<Statistics>({
    total_students: 0,
    total_faculty: 0,
    total_courses: 0,
    attendance_percentage: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getPublicStatistics();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch college statistics:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const statistics = [
    {
      title: 'Total Students',
      value: stats.total_students.toLocaleString(),
      change: 'Live database count',
      icon: Users,
    },
    {
      title: 'Faculty',
      value: stats.total_faculty.toLocaleString(),
      change: 'Registered faculty',
      icon: GraduationCap,
    },
    {
      title: 'Courses',
      value: stats.total_courses.toLocaleString(),
      change: 'Available courses',
      icon: BookOpen,
    },
    {
      title: 'Attendance',
      value: `${stats.attendance_percentage}%`,
      change: 'Recorded attendance',
      icon: CalendarCheck,
    },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    });
    setMobileMenu(false);
  };

  const colors: Record<string, string> = {
    blue: 'from-blue-500 to-blue-700',
    indigo: 'from-indigo-500 to-indigo-700',
    sky: 'from-sky-400 to-blue-600',
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
      }`}
    >
      {/* NAVBAR */}
      <header className="fixed top-3 left-3 right-3 z-50">
        <nav className="mx-auto max-w-[1450px] rounded-2xl border border-white/70 bg-white/90 px-5 py-3 shadow-lg backdrop-blur-xl md:px-7">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
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

            {/* DESKTOP NAVIGATION */}
            <div className="hidden items-center gap-9 md:flex">
              <button
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
                className="border-b-2 border-blue-600 pb-1 font-medium text-slate-900"
              >
                Home
              </button>

              <button
                onClick={() => scrollTo('features')}
                className="text-slate-700 transition hover:text-blue-600"
              >
                Courses
              </button>

              <button
                onClick={() => scrollTo('admissions')}
                className="text-slate-700 transition hover:text-blue-600"
              >
                Admissions
              </button>

              <button
                onClick={() => navigate('/login')}
                className="text-slate-700 transition hover:text-blue-600"
              >
                Portal
              </button>

              <button
                onClick={() => scrollTo('contact')}
                className="text-slate-700 transition hover:text-blue-600"
              >
                Contact
              </button>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="hidden items-center gap-5 md:flex">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-full p-2 text-slate-800 transition hover:bg-slate-100"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={23} /> : <Moon size={23} />}
              </button>

              <button
                onClick={() => scrollTo('contact')}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
              >
                Get In Touch <ArrowRight size={18} />
              </button>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="text-slate-900 md:hidden"
              aria-label="Toggle navigation"
            >
              {mobileMenu ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* MOBILE MENU */}
          {mobileMenu && (
            <div className="mt-4 flex flex-col gap-4 border-t border-slate-200 py-4 text-slate-800 md:hidden">
              <button
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              >
                Home
              </button>
              <button onClick={() => scrollTo('features')}>Courses</button>
              <button onClick={() => scrollTo('admissions')}>
                Admissions
              </button>
              <button onClick={() => navigate('/login')}>Portal</button>
              <button onClick={() => scrollTo('contact')}>Contact</button>
              <button onClick={() => setDarkMode(!darkMode)}>
                Toggle Theme
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* HERO SECTION */}
      <section
        className="relative flex min-h-[690px] items-center overflow-hidden bg-cover bg-center pt-24 md:min-h-[610px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=90')",
        }}
      >
        {/* IMAGE OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-slate-950/30" />

        <div className="relative mx-auto grid w-full max-w-[1450px] items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-12">
          {/* HERO TEXT */}
          <div className="text-white">
            <span className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
              Welcome to Greenfield College
            </span>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Welcome to Greenfield College Management System
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              Smart campus management for a connected, efficient and
              empowered college community.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-3 rounded-xl border border-blue-300 bg-blue-600 px-6 py-4 font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] transition hover:-translate-y-1 hover:bg-blue-700"
              >
                <Users size={22} />
                Student Login
              </button>

              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-3 rounded-xl border border-white/60 bg-white/15 px-6 py-4 font-semibold text-white backdrop-blur-lg transition hover:-translate-y-1 hover:bg-white/25"
              >
                <Shield size={23} />
                Admin Portal
              </button>
            </div>
          </div>

          {/* LIVE STATISTICS CARDS */}
          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            {statistics.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="flex flex-col items-center rounded-2xl border border-white/50 bg-white/20 px-3 py-7 text-center text-white shadow-xl backdrop-blur-xl transition hover:-translate-y-2 hover:bg-white/30"
                >
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue-700 shadow-lg">
                    <Icon size={29} />
                  </div>

                  <p className="text-sm font-medium text-white/90">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                    {statsLoading ? '...' : stat.value}
                  </h2>

                  <p className="mt-3 text-xs font-medium text-emerald-200">
                    {statsLoading ? 'Loading...' : stat.change}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CURVED BOTTOM */}
        <div className="absolute -bottom-1 left-0 h-12 w-full rounded-t-[50%] bg-white md:h-16" />
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className={`px-5 py-16 md:px-10 ${
          darkMode ? 'bg-slate-950' : 'bg-white'
        }`}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-0.5 w-8 bg-blue-600" />
              <span className="font-bold tracking-widest text-blue-700">
                FEATURES
              </span>
              <span className="h-0.5 w-8 bg-blue-600" />
            </div>

            <h2
              className={`text-3xl font-bold md:text-4xl ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Powerful Tools for Modern Campuses
            </h2>

            <p
              className={`mt-3 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Interactive features designed to simplify administration and
              enhance learning experiences.
            </p>
          </div>

          {/* FEATURE CARDS */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`group flex min-h-[190px] items-center gap-4 rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    darkMode
                      ? 'border-slate-700 bg-slate-900'
                      : 'border-slate-200 bg-gradient-to-br from-white to-blue-50'
                  }`}
                >
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colors[feature.color]} text-white shadow-lg transition group-hover:scale-110`}
                  >
                    <Icon size={32} />
                  </div>

                  <div>
                    <h3
                      className={`mb-2 font-bold ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {feature.title}
                    </h3>

                    <p
                      className={`text-xs leading-5 ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FEATURE CAROUSEL INDICATORS */}
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              onClick={() =>
                setActiveFeature(
                  (activeFeature + features.length - 1) % features.length
                )
              }
              className="text-slate-500 hover:text-blue-600"
              aria-label="Previous feature"
            >
              <ChevronLeft size={24} />
            </button>

            {features.map((feature, index) => (
              <button
                key={feature.title}
                onClick={() => setActiveFeature(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  activeFeature === index
                    ? 'scale-125 bg-blue-600'
                    : 'bg-slate-300'
                }`}
                aria-label={`Feature ${index + 1}`}
              />
            ))}

            <button
              onClick={() =>
                setActiveFeature((activeFeature + 1) % features.length)
              }
              className="text-slate-500 hover:text-blue-600"
              aria-label="Next feature"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* ADMISSIONS SECTION */}
      <section
        id="admissions"
        className="bg-gradient-to-r from-blue-950 to-blue-800 px-6 py-16 text-center text-white"
      >
        <h2 className="text-3xl font-bold">Your Future Starts Here</h2>

        <p className="mx-auto mt-4 max-w-2xl text-blue-100">
          Join Greenfield College and become part of a modern learning
          community.
        </p>

        <button
          onClick={() => navigate('/signup')}
          className="mt-7 rounded-xl bg-white px-7 py-3 font-semibold text-blue-800 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
        >
          Apply for Admission <ArrowRight className="ml-2 inline" size={18} />
        </button>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className={`px-6 py-10 ${
          darkMode
            ? 'bg-slate-950 text-slate-300'
            : 'bg-slate-900 text-slate-300'
        }`}
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
              © {new Date().getFullYear()} Greenfield College. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
