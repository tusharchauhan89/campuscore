import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentFees, getFeeStatus } from '../../api/client';
import type { Fee, Student } from '../../types';
import {
  Wallet,
  CreditCard,
  Clock3,
  Receipt,
  GraduationCap,
  RefreshCw,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  TrendingUp,
  ShieldCheck,
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
  icon: typeof Wallet;
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

function FeeCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Wallet;
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

export default function StudentFees() {
  const { user } = useAuth();
  const student = user?.data as Student;

  const [fees, setFees] = useState<Fee[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchFees = useCallback(async (isRefresh = false) => {
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

      const [feesResponse, statusResponse] = await Promise.all([
        getStudentFees(student.id),
        getFeeStatus(student.id),
      ]);

      setFees(feesResponse.data);
      setStatus(statusResponse.data);
    } catch (err) {
      console.error('Failed to fetch fees:', err);
      setError('Unable to load your fee details. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [student?.id]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const totalAmount = Number(status?.total_amount ?? 0);
  const totalPaid = Number(status?.total_paid ?? 0);
  const pendingAmount = Number(
    status?.pending_amount ?? status?.pending ?? 0
  );

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#F5F9FF]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#DCEBFA] border-t-[#123B66]" />
          <p className="mt-4 text-sm font-medium text-[#486581]">
            Loading your fee details...
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
              Fee Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View your fee details, payment history and pending dues
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchFees(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B66] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition-all hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'animate-spin' : ''}
          />

          {refreshing ? 'Refreshing...' : 'Refresh Fees'}
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
            onClick={() => fetchFees(true)}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <FeeCard
          title="Total Amount"
          value={`₹${formatNumber(totalAmount)}`}
          subtitle="Total fees for your account"
          icon={Wallet}
        />

        <FeeCard
          title="Total Paid"
          value={`₹${formatNumber(totalPaid)}`}
          subtitle="Successfully paid amount"
          icon={CheckCircle2}
        />

        <FeeCard
          title="Pending Amount"
          value={`₹${formatNumber(pendingAmount)}`}
          subtitle="Remaining fee payment"
          icon={Clock3}
        />
      </div>

      {/* Payment Overview */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        <div className="rounded-2xl border border-[#DCEBFA] bg-white p-5 shadow-[0_4px_16px_rgba(18,59,102,0.05)] sm:p-6 xl:col-span-2">
          <SectionHeading
            icon={TrendingUp}
            title="Payment Overview"
            description="Your overall fee payment progress"
          />

          <div className="mt-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Amount Paid
                </p>

                <p className="mt-1 text-2xl font-bold text-[#123B66]">
                  ₹{formatNumber(totalPaid)}
                  <span className="ml-1 text-base font-medium text-slate-400">
                    / ₹{formatNumber(totalAmount)}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-[#DCEBFA] bg-[#EFF7FF] p-3 text-[#123B66]">
                <IndianRupee size={22} />
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#E5F0FB]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#123B66] to-[#38BDF8] transition-all duration-700"
                style={{
                  width: `${
                    totalAmount > 0
                      ? Math.min(100, Math.max(0, (totalPaid / totalAmount) * 100))
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>0%</span>
              <span>100%</span>
            </div>

            <p className="mt-5 rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] p-3 text-sm text-[#486581]">
              You have paid{' '}
              <span className="font-bold text-[#123B66]">
                {totalAmount > 0
                  ? ((totalPaid / totalAmount) * 100).toFixed(1)
                  : '0'}%
              </span>{' '}
              of your total fees. Your remaining pending amount is{' '}
              <span className="font-bold text-[#123B66]">
                ₹{formatNumber(pendingAmount)}
              </span>.
            </p>
          </div>
        </div>

        {/* Payment Status Highlight */}
        <div className="relative overflow-hidden rounded-2xl border border-[#CFE5F8] bg-gradient-to-br from-[#EAF5FF] via-[#DCEEFF] to-[#F4FAFF] p-5 shadow-[0_4px_16px_rgba(18,59,102,0.06)] sm:p-6">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#38BDF8]/10" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#123B66] shadow-sm">
                <ShieldCheck size={20} />
              </div>

              <h3 className="font-bold text-[#123B66]">
                Payment Status
              </h3>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-[#486581]">
                Remaining Fee Amount
              </p>

              <h2 className="mt-2 text-4xl font-extrabold text-[#123B66]">
                ₹{formatNumber(pendingAmount)}
              </h2>

              <p className="mt-2 text-sm text-[#486581]">
                {pendingAmount <= 0
                  ? 'All your fees have been paid successfully.'
                  : 'You have an outstanding fee balance.'}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C5DDF2] bg-white/80 px-3 py-2 text-xs font-semibold text-[#123B66]">
                {pendingAmount <= 0 ? (
                  <>
                    <CheckCircle2 size={14} className="text-[#0284C7]" />
                    Fully Paid
                  </>
                ) : (
                  <>
                    <Clock3 size={14} className="text-[#0284C7]" />
                    Payment Pending
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="overflow-hidden rounded-2xl border border-[#DCEBFA] bg-white shadow-[0_4px_16px_rgba(18,59,102,0.05)]">

        <div className="flex flex-col justify-between gap-4 border-b border-[#E5EEF8] p-5 sm:flex-row sm:items-center sm:p-6">
          <SectionHeading
            icon={Receipt}
            title="Fee Records"
            description="Semester-wise fee payment details"
          />

          <div className="inline-flex items-center gap-2 rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] px-4 py-2.5 text-sm font-semibold text-[#123B66]">
            <CalendarDays size={16} />
            {fees.length} Records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="bg-[#DDF0FF] text-xs font-bold uppercase tracking-wider text-[#123B66]">
                <th className="px-6 py-4">Semester</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Paid Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EDF3FA]">
              {fees.length > 0 ? (
                fees.map((fee) => (
                  <tr
                    key={fee.id}
                    className="transition-colors odd:bg-white even:bg-[#F5F9FF] hover:bg-[#EAF5FF]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DCEBFA] bg-[#EFF7FF] text-[#123B66]">
                          <GraduationCap size={17} />
                        </div>

                        <span className="font-semibold text-slate-700">
                          {fee.semester}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-[#123B66]">
                        ₹{formatNumber(fee.amount)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#168FE0]">
                        ₹{formatNumber(fee.paid_amount)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                          fee.status === 'Paid'
                            ? 'border-[#CDE7FA] bg-[#EAF5FF] text-[#07549A]'
                            : 'border-[#DCEBFA] bg-[#EFF7FF] text-[#486581]'
                        }`}
                      >
                        {fee.status === 'Paid' ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <Clock3 size={13} />
                        )}

                        {fee.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {fee.due_date || '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF7FF] text-[#123B66]">
                      <Receipt size={23} />
                    </div>

                    <h3 className="mt-3 font-bold text-[#123B66]">
                      No Fee Records Found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Your fee records will appear here once available.
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
            <strong className="text-[#123B66]">{fees.length}</strong>{' '}
            fee records
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
            Fee Records Overview
          </span>
        </div>
      </div>
    </div>
  );
}