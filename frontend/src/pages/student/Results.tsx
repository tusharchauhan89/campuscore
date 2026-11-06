
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentMarks, getStudentResult } from '../../api/client';
import type { Mark, Student } from '../../types';
import {
  Award,
  BookOpen,
  Calculator,
  ChartNoAxesCombined,
  GraduationCap,
  Search,
  RefreshCw,
  TrendingUp,
  Trophy,
  FileText,
  Sparkles,
  AlertCircle,
  Filter,
} from 'lucide-react';

const ICE_BLUE = '#38BDF8';

const formatNumber = (value: number | string | undefined | null) => {
  const number = Number(value ?? 0);

  return Number.isFinite(number)
    ? Number.isInteger(number)
      ? number
      : number.toFixed(2)
    : '0';
};

const getExamCategory = (examType: string) => {
  const value = examType?.toLowerCase() ?? '';

  if (value.includes('internal')) return 'Internal';
  if (value.includes('external')) return 'External';

  return 'Other';
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
  accent,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: typeof BookOpen;
  accent: string;
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

        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white shadow-inner"
          style={{ color: accent }}
        >
          <Icon size={21} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
        <div className="h-full w-1/3 rounded-full bg-[#38BDF8]" />
      </div>
    </div>
  );
}

function PerformanceRing({ percentage }: { percentage: number }) {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div
      className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${ICE_BLUE} ${safePercentage * 3.6}deg, #DCEBFA 0deg)`,
      }}
    >
      <div className="flex h-[116px] w-[116px] flex-col items-center justify-center rounded-full border border-[#E3EFFB] bg-white shadow-inner">
        <span className="text-2xl font-extrabold text-[#123B66]">
          {formatNumber(percentage)}%
        </span>
        <span className="mt-1 text-xs font-medium text-slate-500">
          Overall Score
        </span>
      </div>
    </div>
  );
}

/* New table performance indicator */
function ScoreIndicator({ score }: { score: number }) {
  const safeScore = Math.min(100, Math.max(0, score));

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative flex h-11 w-11 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(#168FE0 ${safeScore * 3.6}deg, #E5F0FB 0deg)`,
        }}
      >
        <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full border border-[#EAF3FC] bg-white">
          <span className="text-[10px] font-extrabold text-[#123B66]">
            {formatNumber(score)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StudentResults() {
  const { user } = useAuth();
  const student = user?.data as Student;

  const [marks, setMarks] = useState<Mark[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchResults = useCallback(async (isRefresh = false) => {
    if (!student?.id) {
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const [marksResponse, resultResponse] = await Promise.all([
        getStudentMarks(student.id),
        getStudentResult(student.id),
      ]);

      setMarks(marksResponse.data);
      setResult(resultResponse.data);
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setError('Unable to load your results. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [student?.id]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const totalSubjects = Number(result?.total_subjects ?? 0);
  const totalObtained = Number(result?.total_obtained ?? 0);
  const totalMax = Number(result?.total_max ?? 0);
  const percentage = Number(result?.percentage ?? 0);

  const highestMark = useMemo(() => {
    if (!marks.length) return null;

    return marks.reduce<Mark | null>((highest, current) => {
      if (!highest) return current;

      const currentPercentage =
        Number(current.max_marks) > 0
          ? (Number(current.marks_obtained) / Number(current.max_marks)) * 100
          : 0;

      const highestPercentage =
        Number(highest.max_marks) > 0
          ? (Number(highest.marks_obtained) / Number(highest.max_marks)) * 100
          : 0;

      return currentPercentage > highestPercentage ? current : highest;
    }, null);
  }, [marks]);

  const filteredMarks = useMemo(() => {
    return marks.filter((mark) => {
      const matchesSearch = [
        mark.subject,
        mark.exam_type,
        mark.semester,
      ]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === 'All' ||
        getExamCategory(mark.exam_type) === category;

      return matchesSearch && matchesCategory;
    });
  }, [marks, search, category]);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#F5F9FF]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#DCEBFA] border-t-[#123B66]" />
          <p className="mt-4 text-sm font-medium text-[#486581]">
            Loading your academic results...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-7 bg-[#F5F9FF] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#123B66] text-white shadow-md shadow-blue-900/15">
            <GraduationCap size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#123B66]">
              Examination Results
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View your academic performance and subject-wise marks
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchResults(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B66] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition-all hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'animate-spin' : ''}
          />
          {refreshing ? 'Refreshing...' : 'Refresh Results'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
          <button
            onClick={() => fetchResults(true)}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ResultCard
          title="Total Subjects"
          value={formatNumber(totalSubjects)}
          subtitle="Subjects included in results"
          icon={BookOpen}
          accent="#BAE6FD"
        />

        <ResultCard
          title="Marks Obtained"
          value={formatNumber(totalObtained)}
          subtitle="Total marks achieved"
          icon={Award}
          accent="#BAE6FD"
        />

        <ResultCard
          title="Maximum Marks"
          value={formatNumber(totalMax)}
          subtitle="Total possible marks"
          icon={Calculator}
          accent="#BAE6FD"
        />

        <ResultCard
          title="Overall Percentage"
          value={`${formatNumber(percentage)}%`}
          subtitle="Overall academic performance"
          icon={ChartNoAxesCombined}
          accent="#BAE6FD"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        <div className="rounded-2xl border border-[#DCEBFA] bg-white p-5 shadow-[0_4px_16px_rgba(18,59,102,0.05)] sm:p-6 xl:col-span-2">
          <SectionHeading
            icon={TrendingUp}
            title="Performance Overview"
            description="Your overall academic progress"
          />

          <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row sm:justify-around">
            <PerformanceRing percentage={percentage} />

            <div className="w-full flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Marks Obtained
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#123B66]">
                    {formatNumber(totalObtained)}
                    <span className="ml-1 text-base font-medium text-slate-400">
                      / {formatNumber(totalMax)}
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-[#DCEBFA] bg-[#EFF7FF] p-3 text-[#123B66]">
                  <Trophy size={22} />
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#E5F0FB]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#123B66] to-[#38BDF8] transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.max(0, percentage))}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>0%</span>
                <span>100%</span>
              </div>

              <p className="mt-5 rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] p-3 text-sm text-[#486581]">
                Your overall score is{' '}
                <span className="font-bold text-[#123B66]">
                  {formatNumber(percentage)}%
                </span>
                . Keep tracking your progress to improve your academic
                performance.
              </p>
            </div>
          </div>
        </div>

        {/* Academic Highlight */}
        <div className="relative overflow-hidden rounded-2xl border border-[#CFE5F8] bg-gradient-to-br from-[#EAF5FF] via-[#DCEEFF] to-[#F4FAFF] p-5 shadow-[0_4px_16px_rgba(18,59,102,0.06)] sm:p-6">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#38BDF8]/10" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#123B66] shadow-sm">
                <Trophy size={20} />
              </div>
              <h3 className="font-bold text-[#123B66]">
                Academic Highlight
              </h3>
            </div>

            {highestMark ? (
              <div className="mt-8">
                <p className="text-sm font-medium text-[#486581]">
                  Highest Individual Exam Score
                </p>

                <h2 className="mt-2 text-4xl font-extrabold text-[#123B66]">
                  {Number(highestMark.max_marks) > 0
                    ? `${formatNumber(
                        (Number(highestMark.marks_obtained) /
                          Number(highestMark.max_marks)) *
                          100
                      )}%`
                    : '—'}
                </h2>

                <p className="mt-2 text-base font-bold text-[#123B66]">
                  {highestMark.subject}
                </p>

                <p className="mt-1 text-xs text-[#486581]">
                  {highestMark.exam_type} · Semester {highestMark.semester}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C5DDF2] bg-white/80 px-3 py-2 text-xs font-semibold text-[#123B66]">
                  <Sparkles size={14} className="text-[#0284C7]" />
                  Your top-performing exam
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-[#CFE5F8] bg-white/70 p-4 text-sm text-[#486581]">
                No marks available to highlight yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subject-wise Marks */}
      <div className="overflow-hidden rounded-2xl border border-[#DCEBFA] bg-white shadow-[0_4px_16px_rgba(18,59,102,0.05)]">

        <div className="flex flex-col justify-between gap-4 border-b border-[#E5EEF8] p-5 sm:flex-row sm:items-center sm:p-6">
          <SectionHeading
            icon={FileText}
            title="Subject-wise Marks"
            description="Detailed breakdown of your examination results"
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#DCEBFA] bg-[#F8FBFF] py-2.5 pl-9 pr-8 text-sm text-[#123B66] outline-none transition focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/15 sm:w-36"
              >
                <option value="All">All Exams</option>
                <option value="Internal">Internal</option>
                <option value="External">External</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="bg-[#DDF0FF] text-xs font-bold uppercase tracking-wider text-[#123B66]">
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Examination</th>
                <th className="px-6 py-4">Semester</th>
                <th className="px-6 py-4">Marks Obtained</th>
                <th className="px-6 py-4 text-center">Performance</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EDF3FA]">
              {filteredMarks.length > 0 ? (
                filteredMarks.map((mark) => {
                  const obtained = Number(mark.marks_obtained ?? 0);
                  const maximum = Number(mark.max_marks ?? 0);
                  const score =
                    maximum > 0 ? (obtained / maximum) * 100 : 0;

                  return (
                    <tr
                      key={mark.id}
                      className="transition-colors odd:bg-white even:bg-[#F5F9FF] hover:bg-[#EAF5FF]"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DCEBFA] bg-[#EFF7FF] text-[#123B66]">
                            <BookOpen size={16} />
                          </div>
                          <span className="font-semibold text-slate-700">
                            {mark.subject}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-3">
                        <span className="inline-flex rounded-full border border-[#CDE7FA] bg-[#EAF5FF] px-3 py-1 text-xs font-semibold text-[#07549A]">
                          {mark.exam_type}
                        </span>
                      </td>

                      <td className="px-6 py-3 text-sm text-slate-600">
                        {mark.semester}
                      </td>

                      <td className="px-6 py-3">
                        <span className="font-bold text-[#123B66]">
                          {formatNumber(obtained)}
                        </span>
                        <span className="text-sm text-slate-400">
                          {' '}/ {formatNumber(maximum)}
                        </span>
                      </td>

                      {/* Circular performance indicator instead of bar */}
                      <td className="px-6 py-2">
                        <ScoreIndicator score={score} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF7FF] text-[#123B66]">
                      <FileText size={23} />
                    </div>

                    <h3 className="mt-3 font-bold text-[#123B66]">
                      No results found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {marks.length
                        ? 'Try changing your search or exam filter.'
                        : 'Your examination marks will appear here once available.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-[#E5EEF8] bg-[#F8FBFF] px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>
            Showing{' '}
            <strong className="text-[#123B66]">{filteredMarks.length}</strong>{' '}
            of{' '}
            <strong className="text-[#123B66]">{marks.length}</strong> records
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
            Academic Records Overview
          </span>
        </div>
      </div>
    </div>
  );
}
