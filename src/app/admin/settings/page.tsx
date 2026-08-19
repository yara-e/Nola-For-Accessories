'use client';

import { useState } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { resetAdminPassword } from '@/actions/authActions';
import { Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'New password must be at least 6 characters long' });
      return;
    }

    setLoading(true);

    try {
      const res = await resetAdminPassword(oldPassword, newPassword);
      setStatus({ type: 'success', message: res?.message || 'Password updated successfully' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <AdminNavbar />

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2A1B3D]">Admin Settings</h1>
          <p className="text-xs text-gray-500 mt-1">Update security credentials for your admin account</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border-2 border-[#D8CDE0] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E5DCEB] pb-4">
            <Lock className="w-5 h-5 text-[#80608E]" />
            <h2 className="font-serif text-xl font-bold text-[#2A1B3D]">Change Password</h2>
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
              <label className="block mb-1.5">Current Password</label>
              <input
                type="password"
                required
                disabled={loading}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full p-3.5 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl text-xs text-[#2A1B3D] focus:outline-none focus:border-[#80608E] disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block mb-1.5">New Password</label>
              <input
                type="password"
                required
                disabled={loading}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-3.5 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl text-xs text-[#2A1B3D] focus:outline-none focus:border-[#80608E] disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                disabled={loading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full p-3.5 bg-[#FAF9F6] border border-[#E0D7E5] rounded-xl text-xs text-[#2A1B3D] focus:outline-none focus:border-[#80608E] disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#5C3D6A] hover:bg-[#482D54] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}