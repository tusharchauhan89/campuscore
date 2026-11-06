
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getStudentAttendance,
  getAttendanceSummary,
} from '../../api/client';
import type { Attendance, Student } from '../../types';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Search,
  TrendingUp,
  XCircle,
  BookOpen,
  RefreshCw,
  Filter,
  ChevronDown,
  Target,
  ShieldCheck,
  AlertTriangle,
  Activity,
  GraduationCap,
  ChartNoAxesCombined,
} from 'lucide-react';

const ICE_BLUE = '#38BDF8';
const TARGET = 75;

type AttendanceFilter = 'all' | 'present' | 'absent';

const formatDate = (value: string) => {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getStatus = (status: string) => {
  const normalized = (status || '').toLowerCase().trim();

  if (normalized === 'present') return 'present';
  if (normalized === 'absent') return 'absent';

  return 'other';
};

const formatNumber = (value: number) => {
  return Number.isFinite(value) ? value.toFixed(1) : '0.0';
};

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof BookOpen;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCEBFA] bg-[#EFF7FF] text-[#123B66]">
        <Icon size={19} />
      </div>

      <div>
        <h3 className="text-base font-bold text-[#123B66]">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
}

function ResultCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: typeof BookOpen;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#244F79] bg-gradient-to-br from-[#174A78] via-[#123B66] to-[#0B2545] p-5 text-white shadow-[0_5px_18px_rgba(18,59,102,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(18,59,102,0.2)]">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.06] transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-100">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight">{value}</h3>
          <p className="mt-1 text-xs text-blue-200">{subtitle}</p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[#BAE6FD] shadow-inner">
          <Icon size={21} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
        <div className="h-full w-1/3 rounded-full bg-[#38BDF8]" />
      </div>
    </div>
  );
}

function AttendanceRing({ percentage }: { percentage: number }) {
  const value = Math.min(100, Math.max(0, Number(percentage) || 0));

  return (
    <div
      className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${ICE_BLUE} ${value * 3.6}deg, #DCEBFA 0deg)`,
      }}
    >
      <div className="flex h-[116px] w-[116px] flex-col items-center justify-center rounded-full border border-[#E3EFFB] bg-white shadow-inner">
        <span className="text-2xl font-extrabold text-[#123B66]">
          {formatNumber(value)}%
        </span>
        <span className="mt-1 text-xs font-medium text-slate-500">
          Attendance
        </span>
      </div>
    </div>
  );
}

function AttendanceIndicator({ percentage }: { percentage: number }) {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative flex h-11 w-11 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(#168FE0 ${safePercentage * 3.6}deg, #E5F0FB 0deg)`,
        }}
      >
        <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full border border-[#EAF3FC] bg-white">
          <span className="text-[10px] font-extrabold text-[#123B66]">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StudentAttendance() {
  const { user } = useAuth();
  const student = user?.data as Student | undefined;

  const [records, setRecords] = useState<Attendance[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [filter, setFilter] = useState<AttendanceFilter>('all');
  const [search, setSearch] = useState('');

  const fetchAttendance = useCallback(async () => {
    if (!student?.id) {
      setError('Student information not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setError('');
      setRefreshing(true);

      const [attendanceResponse, summaryResponse] = await Promise.all([
        getStudentAttendance(student.id),
        getAttendanceSummary(student.id),
      ]);

      setRecords(attendanceResponse.data || []);
      setSummary(summaryResponse.data);
    } catch (err: any) {
      console.error('Attendance error:', err);
      setError(
        err.response?.data?.detail ||
          'Unable to load attendance information.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [student?.id]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const recordStats = useMemo(() => {
    const present = records.filter(
      (record) => getStatus(record.status) === 'present'
    ).length;

    const absent = records.filter(
      (record) => getStatus(record.status) === 'absent'
    ).length;

    const other = records.length - present - absent;

    return { present, absent, other };
  }, [records]);

  const totalClasses = Number(
    summary?.total_classes ?? summary?.total ?? records.length
  );

  const present = Number(summary?.present ?? recordStats.present);
  const absent = Number(summary?.absent ?? recordStats.absent);

  const percentage = Number(
    summary?.percentage ??
      (present + absent > 0
        ? (present / (present + absent)) * 100
        : 0)
  );

  const attendancePercentage = Math.min(
    100,
    Math.max(0, Number.isFinite(percentage) ? percentage : 0)
  );

  // Calculate the number of consecutive classes needed to reach 75%.
  const classesNeeded =
    attendancePercentage < TARGET && totalClasses > 0
      ? Math.max(
          0,
          Math.ceil(
            (TARGET * totalClasses - 100 * present) / (100 - TARGET)
          )
        )
      : 0;

  // Calculate how many additional absences are possible before going below 75%.
  const safeAbsences =
    attendancePercentage >= TARGET && totalClasses > 0
      ? Math.max(
          0,
          Math.floor(present / (TARGET / 100) - totalClasses)
        )
      : 0;

  const subjectStats = useMemo(() => {
    const grouped: Record<
      string,
      { total: number; present: number; absent: number }
    > = {};

    records.forEach((record) => {
      const subject = record.subject || 'Unspecified subject';

      if (!grouped[subject]) {
        grouped[subject] = { total: 0, present: 0, absent: 0 };
      }

      const status = getStatus(record.status);

      if (status === 'present') {
        grouped[subject].present += 1;
        grouped[subject].total += 1;
      } else if (status === 'absent') {
        grouped[subject].absent += 1;
        grouped[subject].total += 1;
      }
    });

    return Object.entries(grouped)
      .filter(([, stats]) => stats.total > 0)
      .map(([subject, stats]) => ({
        subject,
        ...stats,
        percentage: (stats.present / stats.total) * 100,
      }))
      .sort((a, b) => a.percentage - b.percentage);
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records
      .filter((record) => {
        const status = getStatus(record.status);

        const matchesFilter =
          filter === 'all' ||
          (filter === 'present' && status === 'present') ||
          (filter === 'absent' && status === 'absent');

        const matchesSearch = (record.subject || '')
          .toLowerCase()
          .includes(search.toLowerCase().trim());

        return matchesFilter && matchesSearch;
      })
      .slice()
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        if (Number.isNaN(dateA) || Number.isNaN(dateB)) return 0;
        return dateB - dateA;
      });
  }, [records, filter, search]);

  const filters: { label: string; value: AttendanceFilter }[] = [
    { label: 'All records', value: 'all' },
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#F5F9FF]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#DCEBFA] border-t-[#123B66]" />
          <p className="mt-4 text-sm font-medium text-[#486581]">
            Loading your attendance records...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F9FF] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={26} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-[#123B66]">
            Attendance unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <button
            onClick={fetchAttendance}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#123B66] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B2545]"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen space-y-7 bg-[#F5F9FF] p-4 pb-10 sm:p-6 lg:p-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#123B66] text-white shadow-md shadow-blue-900/15">
            <GraduationCap size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#123B66]">
              Student Attendance
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track your attendance and monitor your academic progress
            </p>
          </div>
        </div>

        <button
          onClick={fetchAttendance}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B66] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition-all hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'animate-spin' : ''}
          />
          {refreshing ? 'Refreshing...' : 'Refresh Attendance'}
        </button>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          title="Total Classes"
          value={totalClasses}
          subtitle="Classes recorded"
          icon={CalendarDays}
        />

        <ResultCard
          title="Present"
          value={present}
          subtitle="Classes attended"
          icon={CheckCircle2}
        />

        <ResultCard
          title="Absent"
          value={absent}
          subtitle="Classes missed"
          icon={XCircle}
        />

        <ResultCard
          title="Attendance"
          value={`${attendancePercentage.toFixed(1)}%`}
          subtitle="Overall attendance"
          icon={ChartNoAxesCombined}
        />
      </section>

      {/* Attendance overview */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#DCEBFA] bg-white p-5 shadow-[0_4px_16px_rgba(18,59,102,0.05)] sm:p-6 xl:col-span-2">
          <SectionHeading
            icon={TrendingUp}
            title="Attendance Overview"
            description="Your overall attendance and academic progress"
          />

          <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row sm:justify-around">
            <AttendanceRing percentage={attendancePercentage} />

            <div className="w-full flex-1">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold ${
                  attendancePercentage >= TARGET
                    ? 'border-[#CDE7FA] bg-[#EAF5FF] text-[#07549A]'
                    : 'border-[#CDE7FA] bg-[#EFF7FF] text-[#123B66]'
                }`}
              >
                {attendancePercentage >= TARGET ? (
                  <ShieldCheck size={14} />
                ) : (
                  <AlertTriangle size={14} />
                )}
                {attendancePercentage >= TARGET
                  ? 'Target achieved'
                  : 'Below target'}
              </div>

              <h3 className="mt-3 text-xl font-bold text-[#123B66]">
                {attendancePercentage >= TARGET
                  ? 'Good progress!'
                  : 'Needs attention'}
              </h3>

              <p className="mt-2 max-w-md text-xs leading-5 text-slate-500">
                {attendancePercentage >= TARGET
                  ? 'You are currently meeting the 75% reference attendance level. Keep attending regularly.'
                  : 'Your attendance is below the 75% reference level. Focus on attending upcoming classes.'}
              </p>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#E5F0FB]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#123B66] to-[#38BDF8] transition-all duration-700"
                  style={{ width: `${attendancePercentage}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>0%</span>
                <span>75% target</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-[#DCEBFA] bg-[#EFF7FF] p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#07549A]">
                Present
              </p>
              <p className="mt-1 text-xl font-bold text-[#123B66]">
                {present}
              </p>
            </div>

            <div className="rounded-xl border border-[#DCEBFA] bg-[#EFF7FF] p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#07549A]">
                Absent
              </p>
              <p className="mt-1 text-xl font-bold text-[#123B66]">
                {absent}
              </p>
            </div>

            <div className="rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Other
              </p>
              <p className="mt-1 text-xl font-bold text-[#123B66]">
                {recordStats.other}
              </p>
            </div>
          </div>
        </div>

        {/* Academic highlight */}
        <div className="relative overflow-hidden rounded-2xl border border-[#CFE5F8] bg-gradient-to-br from-[#EAF5FF] via-[#DCEEFF] to-[#F4FAFF] p-5 shadow-[0_4px_16px_rgba(18,59,102,0.06)] sm:p-6">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#38BDF8]/10" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#123B66] shadow-sm">
                <Target size={20} />
              </div>

              <h3 className="font-bold text-[#123B66]">
                Attendance Target
              </h3>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-[#486581]">
                Required Attendance
              </p>

              <h2 className="mt-2 text-4xl font-extrabold text-[#123B66]">
                {TARGET}%
              </h2>

              <p className="mt-2 text-xs leading-5 text-[#486581]">
                Maintain at least 75% attendance to stay on track with the
                reference attendance requirement.
              </p>

              <div className="mt-6 rounded-xl border border-[#C5DDF2] bg-white/80 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#486581]">
                    Your attendance
                  </span>
                  <span className="text-sm font-bold text-[#123B66]">
                    {attendancePercentage.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#DCEBFA]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#123B66] to-[#38BDF8]"
                    style={{ width: `${attendancePercentage}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#C5DDF2] bg-white/80 px-3 py-2 text-xs font-semibold text-[#123B66]">
                <Activity size={14} className="text-[#0284C7]" />
                Academic progress overview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target planner */}
      <section className="relative overflow-hidden rounded-2xl border border-[#244F79] bg-gradient-to-br from-[#174A78] via-[#123B66] to-[#0B2545] p-6 text-white shadow-[0_5px_18px_rgba(18,59,102,0.13)] sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[#38BDF8]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                Your target planner
              </p>
              <h2 className="mt-1 text-lg font-bold">
                75% Attendance Goal
              </h2>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 p-3">
              <Target className="h-5 w-5 text-[#BAE6FD]" />
            </div>
          </div>

          <p className="mt-4 max-w-md text-xs leading-5 text-blue-100/70">
            A simple estimate based on your current total classes and present
            count.
          </p>

          {totalClasses > 0 ? (
            attendancePercentage >= TARGET ? (
              <div className="mt-7 rounded-2xl border border-[#38BDF8]/25 bg-white/[0.08] p-5">
                <div className="flex items-center gap-2 text-[#BAE6FD]">
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-bold">
                    You're meeting the target
                  </span>
                </div>

                <p className="mt-3 text-3xl font-bold">
                  {safeAbsences}
                  <span className="ml-2 text-sm font-medium text-blue-100/80">
                    additional {safeAbsences === 1 ? 'absence' : 'absences'}*
                  </span>
                </p>

                <p className="mt-2 text-xs leading-5 text-blue-100/70">
                  Estimated absences possible before dropping below 75%,
                  assuming no additional classes are attended.
                </p>
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-[#38BDF8]/25 bg-white/[0.08] p-5">
                <div className="flex items-center gap-2 text-[#BAE6FD]">
                  <AlertTriangle size={20} />
                  <span className="text-sm font-bold">
                    You need to improve
                  </span>
                </div>

                <p className="mt-3 text-3xl font-bold">
                  {classesNeeded}
                  <span className="ml-2 text-sm font-medium text-blue-100/80">
                    consecutive classes
                  </span>
                </p>

                <p className="mt-2 text-xs leading-5 text-blue-100/70">
                  Attend the next {classesNeeded} classes without missing any
                  to reach at least 75%.
                </p>
              </div>
            )
          ) : (
            <div className="mt-7 rounded-2xl border border-white/15 bg-white/[0.08] p-5">
              <p className="text-sm font-semibold text-white">
                No attendance data yet
              </p>
              <p className="mt-2 text-xs text-blue-100/70">
                Your target calculation will appear when classes are recorded.
              </p>
            </div>
          )}

          <div className="mt-5 flex items-start gap-2 text-[10px] leading-4 text-blue-100/60">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            *Estimates assume the college uses a 75% requirement and each class
            has equal weight. Confirm your college's official attendance rules.
          </div>
        </div>
      </section>

      {/* Subject analysis */}
      <section className="rounded-2xl border border-[#DCEBFA] bg-white p-5 shadow-[0_4px_16px_rgba(18,59,102,0.05)] sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <SectionHeading
            icon={BookOpen}
            title="Subject-wise Attendance"
            description="Compare attendance percentages across your recorded subjects"
          />

          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
            At least 75%
            <span className="ml-2 h-2 w-2 rounded-full bg-[#123B66]" />
            Below 75%
          </div>
        </div>

        {subjectStats.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
            {subjectStats.map((subject) => {
              const safe = subject.percentage >= TARGET;

              return (
                <div key={subject.subject}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#DCEBFA] bg-[#EFF7FF] text-[#123B66]">
                        <BookOpen size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-[#123B66]">
                          {subject.subject}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {subject.present} present · {subject.absent} absent
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-[#123B66]">
                        {subject.percentage.toFixed(1)}%
                      </p>
                      <p className="text-[9px] text-slate-400">
                        {safe ? 'On track' : 'Needs attention'}
                      </p>
                    </div>
                  </div>

                  <div className="relative h-2.5 overflow-hidden rounded-full bg-[#E5F0FB]">
                    <div
                      className="absolute inset-y-0 w-px bg-[#123B66]/50"
                      style={{ left: `${TARGET}%` }}
                    />

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#123B66] to-[#38BDF8] transition-all duration-700"
                      style={{
                        width: `${Math.min(100, subject.percentage)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF7FF] text-[#123B66]">
              <BookOpen size={23} />
            </div>

            <p className="mt-3 text-sm font-semibold text-[#123B66]">
              No subject records yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Subject-wise information will appear when records are available.
            </p>
          </div>
        )}

        {subjectStats.length > 0 && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] px-4 py-3">
            <AlertCircle size={16} className="shrink-0 text-[#486581]" />
            <p className="text-[10px] leading-4 text-[#486581]">
              Subject percentages are calculated from the records currently
              returned by your attendance API.
            </p>
          </div>
        )}
      </section>

      {/* Attendance history */}
      <section className="overflow-hidden rounded-2xl border border-[#DCEBFA] bg-white shadow-[0_4px_16px_rgba(18,59,102,0.05)]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E5EEF8] p-5 sm:flex-row sm:items-center sm:p-6">
          <SectionHeading
            icon={ClipboardCheck}
            title="Class History"
            description="Review and search your recorded attendance"
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject..."
                className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FBFF] py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/15 sm:w-52"
              />
            </div>

            <div className="relative">
              <Filter
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#486581]"
              />

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as AttendanceFilter)
                }
                className="w-full appearance-none rounded-xl border border-[#DCEBFA] bg-[#F8FBFF] py-2.5 pl-9 pr-8 text-sm text-[#123B66] outline-none transition focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/15 sm:w-40"
              >
                {filters.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#486581]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-[#E5EEF8] bg-[#F8FBFF] px-6 py-3">
          <p className="text-xs font-medium text-slate-500">
            Showing{' '}
            <span className="font-bold text-[#123B66]">
              {filteredRecords.length}
            </span>{' '}
            of {records.length} records
          </p>

          {(search || filter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setFilter('all');
              }}
              className="text-[10px] font-bold text-[#07549A] transition hover:text-[#123B66]"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="bg-[#DDF0FF] text-xs font-bold uppercase tracking-wider text-[#123B66]">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Record</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EDF3FA]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF7FF] text-[#123B66]">
                      <ClipboardCheck size={23} />
                    </div>

                    <h3 className="mt-3 font-bold text-[#123B66]">
                      No attendance records found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const status = getStatus(record.status);

                  return (
                    <tr
                      key={record.id}
                      className="transition-colors odd:bg-white even:bg-[#F5F9FF] hover:bg-[#EAF5FF]"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-8 w-8 place-items-center rounded-lg border border-[#DCEBFA] bg-[#EFF7FF] text-[#123B66]">
                            <CalendarDays size={15} />
                          </div>

                          <span className="text-xs font-semibold text-slate-700">
                            {formatDate(record.date)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen
                            size={16}
                            className="shrink-0 text-[#168FE0]"
                          />
                          <span className="text-xs font-semibold text-slate-700">
                            {record.subject || 'Unspecified subject'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CDE7FA] bg-[#EAF5FF] px-3 py-1.5 text-[10px] font-bold text-[#07549A]">
                          {status === 'present' ? (
                            <CheckCircle2 size={13} />
                          ) : status === 'absent' ? (
                            <XCircle size={13} />
                          ) : (
                            <Clock3 size={13} />
                          )}
                          {record.status || 'Unknown'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <AttendanceIndicator
                          percentage={status === 'present' ? 100 : 0}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-[#E5EEF8] bg-[#F8FBFF] px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>
            Showing{' '}
            <strong className="text-[#123B66]">
              {filteredRecords.length}
            </strong>{' '}
            of{' '}
            <strong className="text-[#123B66]">{records.length}</strong>{' '}
            records
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
            Attendance Records Overview
          </span>
        </div>
      </section>
    </main>
  );
}
