
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentDashboard } from '../../api/client';
import type { Student } from '../../types';
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CheckCircle2,
  Clock3,
  CreditCard,
  GraduationCap,
  Library,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';

interface DashboardData {
  student: {
    id: number;
    name: string;
    email: string;
    rollnumber: string;
    course: string;
  };
  attendance_summary: {
    total_classes: number;
    present: number;
    absent: number;
    percentage: number;
  };
  result_summary: {
    total_subjects: number;
    total_obtained: number;
    total_max: number;
    percentage: number;
  };
  fee_summary: {
    total_amount: number;
    total_paid: number;
    pending_amount: number;
    status: string;
  };
  library_summary: {
    issued_books_count: number;
    total_fine: number;
    issued_books: any[];
  };
  book_requests: {
    pending_count: number;
    pending_requests: any[];
    recent_requests: any[];
  };
  recent_notices: {
    id: number;
    title: string;
    content: string;
    created_at: string;
  }[];
}

const currency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const percentage = (value = 0) =>
  Math.min(100, Math.max(0, Number(value) || 0));

const getDateLabel = () =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

function ProgressBar({
  value,
  color = 'bg-[#38BDF8]',
}: {
  value: number;
  color?: string;
}) {
  const safeValue = percentage(value);

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#DCEBFA]">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
  iconBg,
  accent,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconClass: string;
  iconBg: string;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#244F79] bg-gradient-to-br from-[#174A78] via-[#123B66] to-[#0B2545] p-5 text-white shadow-[0_5px_18px_rgba(18,59,102,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(18,59,102,0.2)]">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.06] transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-100">{label}</p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
            {value}
          </h3>

          <p className="mt-1 text-xs text-blue-200">{description}</p>
        </div>

        <div
          data-icon-bg={iconBg}
          className="rounded-xl border border-white/15 bg-white/10 p-3 text-white shadow-inner"
        >
          <Icon className="h-5 w-5 text-[#BAE6FD]" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
        <div
          className="h-full w-1/3 rounded-full bg-[#38BDF8]"
          data-accent={accent}
        />
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="rounded-xl border border-[#DCEBFA] bg-[#EFF7FF] p-2.5">
          <Icon className="h-5 w-5 text-[#123B66]" />
        </div>
      )}

      <div>
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#168FE0]">
            {eyebrow}
          </p>
        )}

        <h2 className="text-lg font-bold tracking-tight text-[#123B66]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
}

function AttendanceRing({ value }: { value: number }) {
  const safeValue = percentage(value);

  const color =
    safeValue >= 75
      ? '#10b981'
      : safeValue >= 60
        ? '#f59e0b'
        : '#ef4444';

  return (
    <div
      className="relative grid h-36 w-36 shrink-0 place-items-center rounded-full"
      style={{
        background: `conic-gradient(${color} ${safeValue * 3.6}deg, #DCEBFA 0deg)`,
      }}
    >
      <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full border border-[#E3EFFB] bg-white">
        <span className="text-3xl font-bold tracking-tight text-[#123B66]">
          {safeValue}%
        </span>

        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Attendance
        </span>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const student = user?.data as Student | undefined;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    if (!student?.id) {
      setError('Student information not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await getStudentDashboard(student.id);
      setData(response.data);
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError(
        err.response?.data?.detail || 'Unable to load your dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [student?.id]);

  const firstName = useMemo(
    () => data?.student?.name?.trim().split(' ')[0] || 'Student',
    [data?.student?.name]
  );

  if (loading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 bg-[#F5F9FF]">
        <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-[#DCEBFA] bg-[#EFF7FF]">
          <RefreshCw className="h-6 w-6 animate-spin text-[#123B66]" />
        </div>

        <div className="text-center">
          <p className="font-semibold text-[#123B66]">
            Preparing your workspace
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Fetching your academic information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>

        <h2 className="mt-4 text-lg font-bold text-[#123B66]">
          Dashboard unavailable
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {error || 'No dashboard data found.'}
        </p>

        <button
          onClick={fetchDashboard}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#123B66] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B2545]"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  const attendance = data.attendance_summary;
  const result = data.result_summary;
  const fees = data.fee_summary;
  const library = data.library_summary;

  const feeProgress =
    fees.total_amount > 0
      ? percentage((fees.total_paid / fees.total_amount) * 100)
      : 0;

  const attendanceValue = percentage(attendance.percentage);
  const resultValue = percentage(result.percentage);

  const attendanceStatus =
    attendanceValue >= 75
      ? {
          label: 'Good standing',
          text: 'text-emerald-700',
          bg: 'bg-emerald-50',
          message: 'Your attendance is above the usual 75% requirement.',
        }
      : {
          label: attendanceValue >= 60 ? 'Needs attention' : 'Low attendance',
          text: 'text-amber-700',
          bg: 'bg-amber-50',
          message:
            'Your attendance is below 75%. Attend upcoming classes regularly.',
        };

  const feePaid = fees.pending_amount <= 0;

  return (
    <div className="min-h-screen space-y-7 bg-[#F5F9FF] p-4 text-slate-700 sm:p-6 lg:p-8">

      {/* Header */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#174A78] via-[#123B66] to-[#0B2545] px-6 py-7 text-white shadow-xl shadow-blue-900/10 sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#38BDF8]/20 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-100px] right-[25%] h-64 w-64 rounded-full bg-[#38BDF8]/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-blue-100">
              <Sparkles className="h-3.5 w-3.5 text-[#38BDF8]" />
              STUDENT COMMAND CENTRE
            </div>

            <p className="text-sm font-medium text-slate-300">
              {getDateLabel()}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Hello, {firstName}
              <span className="text-[#38BDF8]">.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Your academic activity, performance and campus updates — all in
              one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-xs text-slate-200">
                Roll No. <strong className="ml-1 text-white">{data.student.rollnumber || '—'}</strong>
              </span>

              <span className="rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-xs text-slate-200">
                Course <strong className="ml-1 text-white">{data.student.course || '—'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm lg:min-w-[245px]">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-xl font-bold text-blue-100">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-white">
                {data.student.name}
              </p>

              <p className="mt-1 truncate text-xs text-slate-300">
                {data.student.email}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Student account
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI strip */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Attendance"
          value={`${attendanceValue}%`}
          description={`${attendance.present} present out of ${attendance.total_classes} classes`}
          icon={Activity}
          iconClass="text-[#BAE6FD]"
          iconBg="bg-white/10"
          accent="bg-[#38BDF8]"
        />

        <MetricCard
          label="Academic score"
          value={`${resultValue}%`}
          description={`${result.total_subjects} subjects recorded`}
          icon={GraduationCap}
          iconClass="text-[#BAE6FD]"
          iconBg="bg-white/10"
          accent="bg-[#38BDF8]"
        />

        <MetricCard
          label="Outstanding fees"
          value={`₹${currency(fees.pending_amount)}`}
          description={feePaid ? 'No pending payment' : 'Payment pending'}
          icon={Wallet}
          iconClass="text-[#BAE6FD]"
          iconBg="bg-white/10"
          accent="bg-[#38BDF8]"
        />

        <MetricCard
          label="Books issued"
          value={String(library.issued_books_count)}
          description={`Library fine: ₹${currency(library.total_fine)}`}
          icon={Library}
          iconClass="text-[#BAE6FD]"
          iconBg="bg-white/10"
          accent="bg-[#38BDF8]"
        />
      </section>

      {/* Main analytics */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">

        {/* Attendance health */}
        <div className="rounded-2xl border border-[#DCEBFA] bg-white p-6 shadow-[0_4px_16px_rgba(18,59,102,0.05)] xl:col-span-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <SectionHeading
              eyebrow="Academic analytics"
              title="Attendance health"
              description="A clear view of your class participation."
              icon={Activity}
            />

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${attendanceStatus.bg} ${attendanceStatus.text}`}
            >
              {attendanceStatus.label}
            </span>
          </div>

          <div className="mt-8 flex flex-col items-center gap-7 sm:flex-row sm:items-center">
            <AttendanceRing value={attendanceValue} />

            <div className="w-full flex-1">
              <p className="text-sm leading-6 text-slate-500">
                {attendanceStatus.message}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Present
                  </div>

                  <p className="mt-2 text-2xl font-bold text-emerald-800">
                    {attendance.present}
                  </p>
                </div>

                <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-rose-700">
                    <ArrowDownRight className="h-4 w-4" />
                    Absent
                  </div>

                  <p className="mt-2 text-2xl font-bold text-rose-800">
                    {attendance.absent}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 border-t border-[#E5EEF8] pt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">
                Classes attended
              </span>

              <span className="font-bold text-[#123B66]">
                {attendance.present} / {attendance.total_classes}
              </span>
            </div>

            <ProgressBar
              value={attendanceValue}
              color="bg-[#38BDF8]"
            />
          </div>
        </div>

        {/* Academic performance */}
        <div className="rounded-2xl border border-[#DCEBFA] bg-white p-6 shadow-[0_4px_16px_rgba(18,59,102,0.05)] xl:col-span-2">
          <SectionHeading
            eyebrow="Results overview"
            title="Academic performance"
            description="Your overall marks summary."
            icon={GraduationCap}
          />

          <div className="mt-7 rounded-2xl border border-[#DCEBFA] bg-gradient-to-br from-[#EAF5FF] via-[#DCEEFF] to-[#F4FAFF] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#168FE0]">
              Overall percentage
            </p>

            <div className="mt-2 flex items-end justify-between gap-3">
              <h3 className="text-4xl font-bold tracking-tight text-[#123B66]">
                {resultValue}%
              </h3>

              <div className="mb-1 rounded-lg border border-[#DCEBFA] bg-white p-2 text-[#123B66] shadow-sm">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5">
              <ProgressBar value={resultValue} color="bg-[#123B66]" />
            </div>

            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>Marks obtained</span>

              <strong className="text-[#123B66]">
                {result.total_obtained} / {result.total_max}
              </strong>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#DCEBFA] bg-[#F8FBFF] p-4">
              <p className="text-xs text-slate-400">Subjects recorded</p>

              <p className="mt-1 text-2xl font-bold text-[#123B66]">
                {result.total_subjects}
              </p>
            </div>

            <div className="rounded-xl border border-[#DCEBFA] bg-[#F8FBFF] p-4">
              <p className="text-xs text-slate-400">Maximum marks</p>

              <p className="mt-1 text-2xl font-bold text-[#123B66]">
                {result.total_max}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fee and campus activity */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">

        {/* Fee status */}
        <div className="rounded-2xl border border-[#DCEBFA] bg-white p-6 shadow-[0_4px_16px_rgba(18,59,102,0.05)] xl:col-span-2">
          <SectionHeading
            eyebrow="Finance"
            title="Fee status"
            description="Your payment breakdown."
            icon={CreditCard}
          />

          <div className="mt-7">
            <p className="text-xs font-medium text-slate-400">
              Total payable amount
            </p>

            <h3 className="mt-1 text-3xl font-bold tracking-tight text-[#123B66]">
              ₹{currency(fees.total_amount)}
            </h3>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs">
              <span className="font-medium text-emerald-700">
                Paid ₹{currency(fees.total_paid)}
              </span>

              <strong className="text-[#123B66]">
                {Math.round(feeProgress)}%
              </strong>
            </div>

            <ProgressBar value={feeProgress} color="bg-[#38BDF8]" />
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-[#FDE7B0] bg-amber-50 p-4">
            <div>
              <p className="text-xs font-medium text-amber-700">
                Remaining balance
              </p>

              <p className="mt-1 text-xl font-bold text-amber-900">
                ₹{currency(fees.pending_amount)}
              </p>
            </div>

            {feePaid ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            ) : (
              <Clock3 className="h-6 w-6 text-amber-600" />
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-medium">
            {feePaid ? (
              <>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">All fees cleared</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700">Payment is pending</span>
              </>
            )}
          </div>
        </div>

        {/* Notices */}
        <div className="overflow-hidden rounded-2xl border border-[#DCEBFA] bg-white shadow-[0_4px_16px_rgba(18,59,102,0.05)] xl:col-span-3">
          <div className="flex items-center justify-between border-b border-[#E5EEF8] px-6 py-5">
            <SectionHeading
              eyebrow="Campus updates"
              title="Latest notices"
              description="Announcements from your college."
              icon={Bell}
            />

            <span className="rounded-full border border-[#DCEBFA] bg-[#EFF7FF] px-3 py-1 text-xs font-semibold text-[#123B66]">
              {data.recent_notices.length} updates
            </span>
          </div>

          {data.recent_notices.length > 0 ? (
            <div className="divide-y divide-[#E5EEF8]">
              {data.recent_notices.slice(0, 4).map((notice) => (
                <div
                  key={notice.id}
                  className="flex gap-4 px-6 py-4 transition hover:bg-[#F5F9FF]"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#DCEBFA] bg-[#EFF7FF]">
                    <Bell className="h-4 w-4 text-[#123B66]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-[#123B66]">
                      {notice.title}
                    </h4>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {notice.content}
                    </p>

                    <p className="mt-2 text-[11px] text-slate-400">
                      {notice.created_at
                        ? new Date(notice.created_at).toLocaleDateString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )
                        : 'Date unavailable'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Bell className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-[#123B66]">
                No notices right now
              </p>

              <p className="mt-1 text-xs text-slate-400">
                New college announcements will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Library and requests */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#DCEBFA] bg-white p-6 shadow-[0_4px_16px_rgba(18,59,102,0.05)]">
          <SectionHeading
            eyebrow="Library"
            title="Your library activity"
            description="A quick look at your issued books."
            icon={BookOpen}
          />

          <div className="mt-6 flex items-center justify-between rounded-xl border border-[#DCEBFA] bg-gradient-to-r from-[#EAF5FF] to-[#F5F9FF] p-4">
            <div>
              <p className="text-xs font-medium text-[#07549A]">
                Currently issued
              </p>

              <p className="mt-1 text-2xl font-bold text-[#123B66]">
                {library.issued_books_count}
              </p>
            </div>

            <Library className="h-8 w-8 text-[#168FE0]" />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#E5EEF8] pt-4">
            <span className="text-sm text-slate-500">Outstanding fine</span>

            <span className="font-bold text-[#123B66]">
              ₹{currency(library.total_fine)}
            </span>
          </div>

          {library.issued_books?.length > 0 && (
            <div className="mt-4 space-y-2">
              {library.issued_books.slice(0, 3).map((book: any, index) => (
                <div
                  key={book.id ?? index}
                  className="flex items-center gap-3 rounded-xl border border-[#E5EEF8] bg-[#F8FBFF] p-3 transition hover:bg-[#EAF5FF]"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg border border-[#DCEBFA] bg-[#EFF7FF]">
                    <BookOpen className="h-4 w-4 text-[#123B66]" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#123B66]">
                      {book.book_title || book.title || book.book_name || 'Issued book'}
                    </p>

                    <p className="text-xs text-slate-400">
                      {book.issue_date
                        ? `Issued ${new Date(book.issue_date).toLocaleDateString('en-IN')}`
                        : 'Currently issued'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#DCEBFA] bg-white p-6 shadow-[0_4px_16px_rgba(18,59,102,0.05)]">
          <SectionHeading
            eyebrow="Library requests"
            title="Book request activity"
            description="Track your recent library requests."
            icon={Library}
          />

          <div className="mt-6 flex items-center justify-between rounded-xl border border-[#DCEBFA] bg-gradient-to-r from-[#EAF5FF] to-[#F5F9FF] p-4">
            <div>
              <p className="text-xs font-medium text-[#07549A]">
                Pending requests
              </p>

              <p className="mt-1 text-2xl font-bold text-[#123B66]">
                {data.book_requests.pending_count}
              </p>
            </div>

            <Clock3 className="h-8 w-8 text-[#168FE0]" />
          </div>

          {data.book_requests.recent_requests?.length > 0 ? (
            <div className="mt-4 space-y-2">
              {data.book_requests.recent_requests.slice(0, 3).map(
                (request: any, index) => (
                  <div
                    key={request.id ?? index}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#E5EEF8] bg-[#F8FBFF] p-3 transition hover:bg-[#EAF5FF]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#DCEBFA] bg-[#EFF7FF]">
                        <BookOpen className="h-4 w-4 text-[#123B66]" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#123B66]">
                          {request.book_title || request.title || 'Book request'}
                        </p>

                        <p className="text-xs text-slate-400">
                          {request.created_at
                            ? new Date(request.created_at).toLocaleDateString('en-IN')
                            : 'Recent request'}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold capitalize text-amber-700">
                      {request.status || 'Pending'}
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-[#DCEBFA] bg-[#F8FBFF] px-4 py-7 text-center">
              <BookOpen className="mx-auto h-7 w-7 text-slate-300" />

              <p className="mt-2 text-sm font-medium text-[#123B66]">
                No recent requests
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Your book requests will show up here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer note */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DCEBFA] pt-5 text-xs text-slate-400">
        <p>Student Portal · Academic overview</p>

        <p className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Dashboard data loaded from your college database
        </p>
      </div>
    </div>
  );
}
