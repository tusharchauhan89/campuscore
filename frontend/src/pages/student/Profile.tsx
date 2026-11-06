
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateStudent, updatePassword } from '../../api/client';
import type { Student } from '../../types';
import {
  User,
  Mail,
  GraduationCap,
  Lock,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  UserRound,
  KeyRound,
  BookOpen
} from 'lucide-react';

export default function StudentProfile() {
  const { user, login } = useAuth();
  const student = user?.data as Student;

  const [form, setForm] = useState({
    name: student?.name || '',
    email: student?.email || '',
    course: student?.course || ''
  });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const [profileError, setProfileError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    setForm({
      name: student?.name || '',
      email: student?.email || '',
      course: student?.course || ''
    });
  }, [student?.name, student?.email, student?.course]);

  const handleProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!student?.id) {
      setProfileError(true);
      setProfileMessage('Student information not found.');
      return;
    }

    setProfileLoading(true);
    setProfileMessage('');
    setProfileError(false);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        course: form.course.trim()
      };

      const res = await updateStudent(student.id, payload);

      login('student', res.data);

      setProfileMessage('Your profile has been updated successfully.');
      setProfileError(false);
    } catch (err: any) {
      setProfileError(true);
      setProfileMessage(
        err.response?.data?.detail || 'Unable to update profile. Please try again.'
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPasswordMessage('');
    setPasswordError(false);

    if (!student?.id) {
      setPasswordError(true);
      setPasswordMessage('Student information not found.');
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError(true);
      setPasswordMessage('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(true);
      setPasswordMessage('New password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(true);
      setPasswordMessage('New password and confirm password do not match.');
      return;
    }

    if (oldPassword === newPassword) {
      setPasswordError(true);
      setPasswordMessage('New password must be different from the current password.');
      return;
    }

    setPasswordLoading(true);

    try {
      await updatePassword(student.id, {
        old_password: oldPassword,
        new_password: newPassword
      });

      setPasswordMessage('Your password has been changed successfully.');
      setPasswordError(false);

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(true);
      setPasswordMessage(
        err.response?.data?.detail || 'Unable to update password. Please try again.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[#DCEBFA] bg-[#F8FBFF] px-4 py-3 text-sm text-[#123B66] outline-none transition-all placeholder:text-slate-400 focus:border-[#38BDF8] focus:bg-white focus:ring-4 focus:ring-[#38BDF8]/10';

  const labelClass =
    'mb-2 block text-sm font-semibold text-[#123B66]';

  const passwordInputClass =
    'w-full rounded-xl border border-[#DCEBFA] bg-[#F8FBFF] px-4 py-3 pr-12 text-sm text-[#123B66] outline-none transition-all placeholder:text-slate-400 focus:border-[#38BDF8] focus:bg-white focus:ring-4 focus:ring-[#38BDF8]/10';

  const renderMessage = (message: string, isError: boolean) => {
    if (!message) return null;

    return (
      <div
        className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
          isError
            ? 'border-rose-200 bg-rose-50 text-rose-700'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        }`}
      >
        {isError ? (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        )}
        <span>{message}</span>
      </div>
    );
  };

  if (!student) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="rounded-2xl border border-[#DCEBFA] bg-white p-8 text-center shadow-sm">
          <UserRound className="mx-auto mb-3 h-10 w-10 text-[#38BDF8]" />
          <h2 className="font-semibold text-[#123B66]">
            Student information unavailable
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Please log in again to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-lg bg-[#EFF7FF] p-2">
              <UserRound className="h-5 w-5 text-[#123B66]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#38BDF8]">
              Account Settings
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#0B2545] sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your personal information and account security.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-[#DCEBFA] bg-[#EFF7FF] px-4 py-2">
          <ShieldCheck className="h-4 w-4 text-[#123B66]" />
          <span className="text-xs font-semibold text-[#123B66]">
            Student Account
          </span>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#123B66] p-6 shadow-lg shadow-[#123B66]/10">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[24px] border-white/5" />
        <div className="absolute -bottom-20 right-28 h-40 w-40 rounded-full bg-[#38BDF8]/10 blur-2xl" />

        <div className="relative flex flex-col items-center gap-5 sm:flex-row">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl font-bold text-white shadow-inner">
            {student.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">
              Student Profile
            </p>

            <h2 className="mt-1 truncate text-2xl font-bold text-white">
              {student.name}
            </h2>

            <p className="mt-1 flex items-center justify-center gap-2 text-sm text-blue-100 sm:justify-start">
              <Mail className="h-4 w-4" />
              {student.email}
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-center">
            <p className="text-xs text-blue-200">Roll Number</p>
            <p className="mt-1 font-bold tracking-wide text-white">
              {student.rollnumber || 'Not available'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile and Password Sections */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Personal Information */}
        <section className="overflow-hidden rounded-2xl border border-[#DCEBFA] bg-white shadow-sm shadow-[#123B66]/5">
          <div className="flex items-center gap-3 border-b border-[#EAF2FA] px-6 py-5">
            <div className="rounded-xl bg-[#EFF7FF] p-2.5">
              <User className="h-5 w-5 text-[#123B66]" />
            </div>

            <div>
              <h2 className="font-bold text-[#0B2545]">
                Personal Information
              </h2>
              <p className="text-xs text-slate-500">
                Update your student details
              </p>
            </div>
          </div>

          <form onSubmit={handleProfile} className="space-y-5 p-6">

            <div>
              <label className={labelClass}>
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#38BDF8]" />

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={`${inputClass} pl-11`}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#38BDF8]" />

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className={`${inputClass} pl-11`}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Course / Department
              </label>

              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#38BDF8]" />

                <input
                  type="text"
                  value={form.course}
                  onChange={(e) =>
                    setForm({ ...form, course: e.target.value })
                  }
                  className={`${inputClass} pl-11`}
                  placeholder="Enter your course"
                  required
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] p-4">
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-[#123B66]" />
                <div>
                  <p className="text-sm font-semibold text-[#123B66]">
                    Roll Number
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {student.rollnumber || 'Not available'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Your roll number cannot be changed from this section.
                  </p>
                </div>
              </div>
            </div>

            {renderMessage(profileMessage, profileError)}

            <button
              type="submit"
              disabled={profileLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123B66] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#123B66]/15 transition-all hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {profileLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile Changes
                </>
              )}
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className="overflow-hidden rounded-2xl border border-[#DCEBFA] bg-white shadow-sm shadow-[#123B66]/5">
          <div className="flex items-center gap-3 border-b border-[#EAF2FA] px-6 py-5">
            <div className="rounded-xl bg-[#EFF7FF] p-2.5">
              <Lock className="h-5 w-5 text-[#123B66]" />
            </div>

            <div>
              <h2 className="font-bold text-[#0B2545]">
                Change Password
              </h2>
              <p className="text-xs text-slate-500">
                Keep your account secure
              </p>
            </div>
          </div>

          <form onSubmit={handlePassword} className="space-y-5 p-6">

            {/* Current Password */}
            <div>
              <label className={labelClass}>
                Current Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#38BDF8]" />

                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`${passwordInputClass} pl-11`}
                  placeholder="Enter current password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#123B66]"
                  aria-label={showOldPassword ? 'Hide password' : 'Show password'}
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className={labelClass}>
                New Password
              </label>

              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#38BDF8]" />

                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`${passwordInputClass} pl-11`}
                  placeholder="Enter new password"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#123B66]"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Use at least 6 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>
                Confirm New Password
              </label>

              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#38BDF8]" />

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${passwordInputClass} pl-11`}
                  placeholder="Confirm your new password"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#123B66]"
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {renderMessage(passwordMessage, passwordError)}

            <div className="rounded-xl border border-[#DCEBFA] bg-[#F5F9FF] p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#123B66]" />
                <div>
                  <p className="text-sm font-semibold text-[#123B66]">
                    Account Security
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Never share your password with anyone. Choose a password
                    that is difficult for others to guess.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123B66] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#123B66]/15 transition-all hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </section>
      </div>

      {/* Footer Information */}
      <div className="flex flex-col items-start justify-between gap-2 rounded-xl border border-[#DCEBFA] bg-[#EFF7FF]/60 px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#123B66]" />
          <p className="text-xs font-medium text-[#123B66]">
            Your profile information is managed by the college portal.
          </p>
        </div>

        <p className="text-xs text-slate-400">
          Student Portal
        </p>
      </div>
    </div>
  );
}
