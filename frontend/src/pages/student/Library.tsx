import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getStudentLibrary,
  getLibraryHistory,
  getLibraryFines,
  getStudentBookRequests,
  createBookRequest,
  getBooks,
} from '../../api/client';
import type { BookIssue, BookRequest, Book, Student } from '../../types';
import {
  BookOpen,
  Library,
  Clock3,
  Receipt,
  GraduationCap,
  RefreshCw,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  BookMarked,
  History,
  Send,
  FileText,
  Sparkles,
} from 'lucide-react';

const ICE_BLUE = '#38BDF8';

const formatNumber = (value: number | string | undefined | null) => {
  const number = Number(value ?? 0);

  return Number.isFinite(number)
    ? number.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
      })
    : '0';
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

function LibraryCard({
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

          <h3 className="mt-2 text-2xl font-bold tracking-tight">
            {value}
          </h3>

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

export default function StudentLibrary() {
  const { user } = useAuth();
  const student = user?.data as Student;

  const [issued, setIssued] = useState<BookIssue[]>([]);
  const [history, setHistory] = useState<BookIssue[]>([]);
  const [fines, setFines] = useState<any>(null);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  const [tab, setTab] = useState<'current' | 'history' | 'request'>('current');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [reqTitle, setReqTitle] = useState('');
  const [reqReason, setReqReason] = useState('');

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchLibrary = useCallback(async (isRefresh = false) => {
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

      const [
        issuedResponse,
        historyResponse,
        finesResponse,
        requestsResponse,
        booksResponse,
      ] = await Promise.all([
        getStudentLibrary(student.id),
        getLibraryHistory(student.id),
        getLibraryFines(student.id),
        getStudentBookRequests(student.id),
        getBooks(),
      ]);

      setIssued(issuedResponse.data);
      setHistory(historyResponse.data);
      setFines(finesResponse.data);
      setRequests(requestsResponse.data);
      setBooks(booksResponse.data);
    } catch (err) {
      console.error('Failed to fetch library details:', err);
      setError('Unable to load your library details. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [student?.id]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!student?.id || !reqTitle.trim()) return;

    try {
      setSubmitting(true);
      setMsg('');
      setError('');

      await createBookRequest({
        student_id: student.id,
        book_title: reqTitle.trim(),
        reason: reqReason.trim() || undefined,
      });

      setMsg('Request submitted successfully!');

      setReqTitle('');
      setReqReason('');

      const res = await getStudentBookRequests(student.id);
      setRequests(res.data);
    } catch (err: any) {
      setMsg(
        err.response?.data?.detail || 'Request failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const totalFine = Number(
    fines?.total_fine ?? fines?.total ?? 0
  );

  const overdueBooks = issued.filter(
    (book) => book.status === 'Overdue'
  ).length;

  const currentTabLabel =
    tab === 'current'
      ? 'Issued Books'
      : tab === 'history'
        ? 'Library History'
        : 'Book Requests';

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#F5F9FF]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#DCEBFA] border-t-[#123B66]" />

          <p className="mt-4 text-sm font-medium text-[#486581]">
            Loading your library details...
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
              Library Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your issued books, reading history and book requests
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchLibrary(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B66] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition-all hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'animate-spin' : ''}
          />

          {refreshing ? 'Refreshing...' : 'Refresh Library'}
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
            onClick={() => fetchLibrary(true)}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <LibraryCard
          title="Issued Books"
          value={issued.length}
          subtitle="Currently issued books"
          icon={BookOpen}
        />

        <LibraryCard
          title="Books Returned"
          value={history.length}
          subtitle="Previous library records"
          icon={BookMarked}
        />

        <LibraryCard
          title="Overdue Books"
          value={overdueBooks}
          subtitle="Books past their due date"
          icon={Clock3}
        />

        <LibraryCard
          title="Total Fine"
          value={`₹${formatNumber(totalFine)}`}
          subtitle="Outstanding library fine"
          icon={Receipt}
        />
      </div>

      {/* Library Overview */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        <div className="rounded-2xl border border-[#DCEBFA] bg-white p-5 shadow-[0_4px_16px_rgba(18,59,102,0.05)] sm:p-6 xl:col-span-2">
          <SectionHeading
            icon={Library}
            title="Library Overview"
            description="Your current library activity"
          />

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Available Books
                </p>

                <BookOpen size={19} className="text-[#168FE0]" />
              </div>

              <p className="mt-3 text-2xl font-bold text-[#123B66]">
                {books.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Books in library
              </p>
            </div>

            <div className="rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Book Requests
                </p>

                <Send size={19} className="text-[#168FE0]" />
              </div>

              <p className="mt-3 text-2xl font-bold text-[#123B66]">
                {requests.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Total submitted requests
              </p>
            </div>

            <div className="rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Returned Books
                </p>

                <CheckCircle2 size={19} className="text-[#168FE0]" />
              </div>

              <p className="mt-3 text-2xl font-bold text-[#123B66]">
                {history.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Previous issue records
              </p>
            </div>
          </div>

          <p className="mt-5 rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] p-3 text-sm text-[#486581]">
            You currently have{' '}
            <span className="font-bold text-[#123B66]">
              {issued.length}
            </span>{' '}
            issued books and{' '}
            <span className="font-bold text-[#123B66]">
              {overdueBooks}
            </span>{' '}
            overdue books. Keep track of your due dates to avoid additional
            library fines.
          </p>
        </div>

        {/* Fine Highlight */}
        <div className="relative overflow-hidden rounded-2xl border border-[#CFE5F8] bg-gradient-to-br from-[#EAF5FF] via-[#DCEEFF] to-[#F4FAFF] p-5 shadow-[0_4px_16px_rgba(18,59,102,0.06)] sm:p-6">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#38BDF8]/10" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#123B66] shadow-sm">
                <Receipt size={20} />
              </div>

              <h3 className="font-bold text-[#123B66]">
                Library Fine
              </h3>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-[#486581]">
                Total Fine Amount
              </p>

              <h2 className="mt-2 text-4xl font-extrabold text-[#123B66]">
                ₹{formatNumber(totalFine)}
              </h2>

              <p className="mt-2 text-sm text-[#486581]">
                {totalFine <= 0
                  ? 'You have no outstanding library fines.'
                  : 'Please check your library fine details.'}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C5DDF2] bg-white/80 px-3 py-2 text-xs font-semibold text-[#123B66]">
                {totalFine <= 0 ? (
                  <>
                    <CheckCircle2 size={14} className="text-[#0284C7]" />
                    No Pending Fine
                  </>
                ) : (
                  <>
                    <Clock3 size={14} className="text-[#0284C7]" />
                    Fine Pending
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Library Tabs */}
      <div className="overflow-hidden rounded-2xl border border-[#DCEBFA] bg-white shadow-[0_4px_16px_rgba(18,59,102,0.05)]">

        <div className="border-b border-[#E5EEF8] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <SectionHeading
              icon={BookOpen}
              title={currentTabLabel}
              description="Manage and view your library records"
            />

            <div className="inline-flex items-center gap-2 rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] px-4 py-2.5 text-sm font-semibold text-[#123B66]">
              <Library size={16} />
              {tab === 'current'
                ? `${issued.length} Books`
                : tab === 'history'
                  ? `${history.length} Records`
                  : `${requests.length} Requests`}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-b border-[#E5EEF8]">
            {(
              ['current', 'history', 'request'] as const
            ).map((t) => {
              const active = tab === t;

              return (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setMsg('');
                  }}
                  className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                    active
                      ? 'border-[#38BDF8] text-[#123B66]'
                      : 'border-transparent text-slate-500 hover:border-[#DCEBFA] hover:text-[#123B66]'
                  }`}
                >
                  {t === 'current' && <BookOpen size={16} />}
                  {t === 'history' && <History size={16} />}
                  {t === 'request' && <Send size={16} />}

                  {t === 'current'
                    ? 'Issued Books'
                    : t === 'history'
                      ? 'History'
                      : 'Request Book'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Issued Books */}
        {tab === 'current' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="bg-[#DDF0FF] text-xs font-bold uppercase tracking-wider text-[#123B66]">
                    <th className="px-6 py-4">Book ID</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Fine</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EDF3FA]">
                  {issued.length > 0 ? (
                    issued.map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors odd:bg-white even:bg-[#F5F9FF] hover:bg-[#EAF5FF]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DCEBFA] bg-[#EFF7FF] text-[#123B66]">
                              <BookOpen size={16} />
                            </div>

                            <span className="font-semibold text-[#123B66]">
                              #{item.book_id}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.issue_date}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.due_date}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                              item.status === 'Overdue'
                                ? 'border-[#C5DDF2] bg-[#DDF0FF] text-[#07549A]'
                                : 'border-[#CDE7FA] bg-[#EAF5FF] text-[#07549A]'
                            }`}
                          >
                            {item.status === 'Overdue' ? (
                              <Clock3 size={13} />
                            ) : (
                              <CheckCircle2 size={13} />
                            )}

                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-semibold text-[#123B66]">
                          ₹{formatNumber(item.fine_amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-14 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF7FF] text-[#123B66]">
                          <BookOpen size={23} />
                        </div>

                        <h3 className="mt-3 font-bold text-[#123B66]">
                          No Books Currently Issued
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Your currently issued books will appear here.
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
                <strong className="text-[#123B66]">{issued.length}</strong>{' '}
                issued books
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
                Current Library Records
              </span>
            </div>
          </div>
        )}

        {/* Library History */}
        {tab === 'history' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="bg-[#DDF0FF] text-xs font-bold uppercase tracking-wider text-[#123B66]">
                    <th className="px-6 py-4">Book ID</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Return Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EDF3FA]">
                  {history.length > 0 ? (
                    history.map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors odd:bg-white even:bg-[#F5F9FF] hover:bg-[#EAF5FF]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DCEBFA] bg-[#EFF7FF] text-[#123B66]">
                              <BookMarked size={16} />
                            </div>

                            <span className="font-semibold text-[#123B66]">
                              #{item.book_id}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.issue_date}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.return_date || '—'}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CDE7FA] bg-[#EAF5FF] px-3 py-1 text-xs font-semibold text-[#07549A]">
                            <CheckCircle2 size={13} />
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-14 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF7FF] text-[#123B66]">
                          <History size={23} />
                        </div>

                        <h3 className="mt-3 font-bold text-[#123B66]">
                          No Library History
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Your previous book issue records will appear here.
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
                <strong className="text-[#123B66]">{history.length}</strong>{' '}
                history records
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
                Previous Library Records
              </span>
            </div>
          </div>
        )}

        {/* Request Book */}
        {tab === 'request' && (
          <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2 sm:p-6">

            {/* Request Form */}
            <div className="rounded-2xl border border-[#DCEBFA] bg-white p-5 shadow-[0_4px_16px_rgba(18,59,102,0.04)] sm:p-6">
              <SectionHeading
                icon={Send}
                title="Request a Book"
                description="Submit a request for a new library book"
              />

              {msg && (
                <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#CDE7FA] bg-[#EAF5FF] px-4 py-3 text-sm font-medium text-[#07549A]">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                  {msg}
                </div>
              )}

              <form onSubmit={handleRequest} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#123B66]">
                    Book Title
                  </label>

                  <div className="relative">
                    <BookOpen
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={reqTitle}
                      onChange={(e) => setReqTitle(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#DCEBFA] bg-[#F8FBFF] py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/15"
                      placeholder="Enter book title"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#123B66]">
                    Reason
                    <span className="ml-1 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    value={reqReason}
                    onChange={(e) => setReqReason(e.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[#DCEBFA] bg-[#F8FBFF] px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/15"
                    placeholder="Tell us why you need this book..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !reqTitle.trim()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#123B66] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition-all hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={16} />

                  {submitting ? 'Submitting...' : 'Submit Book Request'}
                </button>
              </form>

              <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] p-3 text-xs text-[#486581]">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-[#168FE0]" />
                Your request will be sent to the library for review.
              </div>
            </div>

            {/* My Requests */}
            <div className="rounded-2xl border border-[#DCEBFA] bg-white p-5 shadow-[0_4px_16px_rgba(18,59,102,0.04)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <SectionHeading
                  icon={FileText}
                  title="My Requests"
                  description="Track your submitted book requests"
                />

                <span className="rounded-lg border border-[#DCEBFA] bg-[#EFF7FF] px-3 py-1.5 text-xs font-bold text-[#123B66]">
                  {requests.length} Total
                </span>
              </div>

              <div className="mt-6 max-h-[390px] space-y-3 overflow-y-auto pr-1">
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-xl border border-[#E1ECF7] bg-[#F8FBFF] p-4 transition-colors hover:border-[#B8DDF5] hover:bg-[#EFF7FF]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCEBFA] bg-white text-[#123B66]">
                          <BookOpen size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm font-bold text-[#123B66]">
                            {request.book_title}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                                request.status === 'Approved'
                                  ? 'border-[#CDE7FA] bg-[#EAF5FF] text-[#07549A]'
                                  : request.status === 'Rejected'
                                    ? 'border-[#DCEBFA] bg-[#EFF7FF] text-[#486581]'
                                    : 'border-[#C5DDF2] bg-[#DDF0FF] text-[#07549A]'
                              }`}
                            >
                              {request.status === 'Approved' ? (
                                <CheckCircle2 size={12} />
                              ) : (
                                <Clock3 size={12} />
                              )}

                              {request.status}
                            </span>

                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                              <CalendarDays size={12} />
                              {request.request_date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF7FF] text-[#123B66]">
                      <FileText size={23} />
                    </div>

                    <h3 className="mt-3 font-bold text-[#123B66]">
                      No Requests Yet
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Your submitted book requests will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}