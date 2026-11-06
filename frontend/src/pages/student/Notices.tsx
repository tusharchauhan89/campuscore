
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNotices } from '../../api/client';
import type { Notice, Student } from '../../types';
import {
  Bell,
  CalendarDays,
  RefreshCw,
  Megaphone,
  BookOpen,
  Inbox,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

const ICE_BLUE = '#38BDF8';

const formatDate = (value: string | undefined | null) => {
  if (!value) return 'Date unavailable';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
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

function NoticeCard({
  notice,
}: {
  notice: Notice;
}) {
  return (
    <div className="group rounded-2xl border border-[#DCEBFA] bg-white p-5 shadow-[0_4px_16px_rgba(18,59,102,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B8DDF8] hover:shadow-[0_8px_22px_rgba(18,59,102,0.09)] sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#DCEBFA] bg-[#EFF7FF] text-[#123B66] transition-colors group-hover:bg-[#DDF0FF]">
          <Bell size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <h3 className="text-base font-bold text-[#123B66]">
              {notice.title}
            </h3>

            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#DCEBFA] bg-[#F5F9FF] px-3 py-1.5 text-xs font-medium text-[#486581]">
              <CalendarDays size={13} />
              {formatDate(notice.created_at)}
            </span>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {notice.content}
          </p>

          {notice.course && (
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CDE7FA] bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#07549A]">
                <BookOpen size={13} />
                {notice.course}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
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
          <h3 className="mt-2 text-3xl font-bold tracking-tight">{value}</h3>
          <p className="mt-1 text-xs text-blue-200">{subtitle}</p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white shadow-inner">
          <Icon size={21} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
        <div className="h-full w-1/3 rounded-full bg-[#38BDF8]" />
      </div>
    </div>
  );
}

export default function StudentNotices() {
  const { user } = useAuth();
  const student = user?.data as Student;

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchNotices = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response = await getNotices(student?.course);
      setNotices(response.data);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
      setError('Unable to load notices. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [student?.course]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const sortedNotices = useMemo(() => {
    return [...notices].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      return dateB - dateA;
    });
  }, [notices]);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#F5F9FF]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#DCEBFA] border-t-[#123B66]" />
          <p className="mt-4 text-sm font-medium text-[#486581]">
            Loading your notices...
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
              College Notices
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Stay updated with the latest college announcements
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchNotices(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B66] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition-all hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'animate-spin' : ''}
          />
          {refreshing ? 'Refreshing...' : 'Refresh Notices'}
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
            onClick={() => fetchNotices(true)}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SummaryCard
          title="Total Notices"
          value={notices.length}
          subtitle="Announcements available to you"
          icon={Megaphone}
        />

        <SummaryCard
          title="Your Course"
          value={student?.course || 'N/A'}
          subtitle="Notices relevant to your course"
          icon={BookOpen}
        />
      </div>

      {/* Notices Section */}
      <div className="overflow-hidden rounded-2xl border border-[#DCEBFA] bg-white shadow-[0_4px_16px_rgba(18,59,102,0.05)]">
        <div className="flex flex-col justify-between gap-3 border-b border-[#E5EEF8] bg-white p-5 sm:flex-row sm:items-center sm:p-6">
          <SectionHeading
            icon={Bell}
            title="Recent Announcements"
            description="Important updates and information from your college"
          />

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCEBFA] bg-[#EFF7FF] px-3 py-1.5 text-xs font-semibold text-[#123B66]">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
            {notices.length} {notices.length === 1 ? 'Notice' : 'Notices'}
          </span>
        </div>

        <div className="space-y-4 bg-[#F8FBFF] p-4 sm:p-6">
          {sortedNotices.length > 0 ? (
            sortedNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#CFE1F2] bg-white px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#DCEBFA] bg-[#EFF7FF] text-[#123B66]">
                <Inbox size={25} />
              </div>

              <h3 className="mt-4 font-bold text-[#123B66]">
                No notices available
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                College announcements will appear here once they are published.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col justify-between gap-2 border-t border-[#E5EEF8] bg-[#F8FBFF] px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>
            Showing{' '}
            <strong className="text-[#123B66]">{sortedNotices.length}</strong>{' '}
            announcements
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
            College Communication Portal
          </span>
        </div>
      </div>
    </div>
  );
}
