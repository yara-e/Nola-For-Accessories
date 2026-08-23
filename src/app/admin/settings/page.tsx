'use client';

import { useState } from 'react';
import { resetAdminPassword } from '@/actions/authActions';
import { useAdminLanguage } from '@/app/admin/AdminLanguageContext'; // Adjust path if needed
import { Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const translations = {
  en: {
    title: 'Admin Settings',
    subtitle: 'Update security credentials for your admin account',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    currentPasswordPlaceholder: 'Enter current password',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'Enter new password',
    confirmPassword: 'Confirm New Password',
    confirmPasswordPlaceholder: 'Confirm new password',
    updatePassword: 'Update Password',
    updating: 'Updating...',
    mismatchError: 'New passwords do not match',
    minLengthError: 'New password must be at least 6 characters long',
    successMessage: 'Password updated successfully',
    defaultError: 'Failed to update password',
  },
  ar: {
    title: 'إعدادات المشرف',
    subtitle: 'تحديث بيانات الأمان لحساب المشرف الخاص بك',
    changePassword: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    currentPasswordPlaceholder: 'أدخل كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    newPasswordPlaceholder: 'أدخل كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور الجديدة',
    confirmPasswordPlaceholder: 'تأكيد كلمة المرور الجديدة',
    updatePassword: 'تحديث كلمة المرور',
    updating: 'جاري التحديث...',
    mismatchError: 'كلمات المرور الجديدة غير متطابقة',
    minLengthError: 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل',
    successMessage: 'تم تحديث كلمة المرور بنجاح',
    defaultError: 'فشل في تحديث كلمة المرور',
  },
};

export default function AdminSettingsPage() {
  const { lang } = useAdminLanguage();
  const t = translations[lang];

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: t.mismatchError });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: t.minLengthError });
      return;
    }

    setLoading(true);

    try {
      const res = await resetAdminPassword(oldPassword, newPassword);
      setStatus({ type: 'success', message: res?.message || t.successMessage });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || t.defaultError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2A1B3D]">{t.title}</h1>
          <p className="text-xs text-gray-500 mt-1">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border-2 border-[#D8CDE0] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E5DCEB] pb-4">
            <Lock className="w-5 h-5 text-[#80608E]" />
            <h2 className="font-serif text-xl font-bold text-[#2A1B3D]">{t.changePassword}</h2>
          </div>

          {status && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                status.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border border-rose-200 text-rose-700'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-[#3D3442]">
            <div>
              <label className="block mb-1.5 text-[#2A1B3D]">{t.currentPassword}</label>
              <input
                type="password"
                required
                disabled={loading}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={t.currentPasswordPlaceholder}
                className="w-full p-3.5 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl text-xs text-[#2A1B3D] focus:outline-none focus:border-[#80608E] disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-[#2A1B3D]">{t.newPassword}</label>
              <input
                type="password"
                required
                disabled={loading}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t.newPasswordPlaceholder}
                className="w-full p-3.5 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl text-xs text-[#2A1B3D] focus:outline-none focus:border-[#80608E] disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-[#2A1B3D]">{t.confirmPassword}</label>
              <input
                type="password"
                required
                disabled={loading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.confirmPasswordPlaceholder}
                className="w-full p-3.5 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl text-xs text-[#2A1B3D] focus:outline-none focus:border-[#80608E] disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#5C3D6A] hover:bg-[#482D54] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.updating}</span>
                </>
              ) : (
                t.updatePassword
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}