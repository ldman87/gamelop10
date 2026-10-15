import React, { useState } from 'react';
import { Lock, Mail, KeyRound, ShieldCheck, X, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const AUTHORIZED_TEACHER_EMAIL = 'ldman87@gmail.com';
const TEACHER_PASSWORD = 'Man0982457876';

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState(AUTHORIZED_TEACHER_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== AUTHORIZED_TEACHER_EMAIL.toLowerCase()) {
      setError(`Email này không phải tài khoản của Thầy Mẫn được cấp quyền.`);
      return;
    }

    if (password !== TEACHER_PASSWORD) {
      setError('Mật khẩu không chính xác. Vui lòng kiểm tra lại.');
      return;
    }

    setPassword('');
    onSuccess(cleanEmail);
    onClose();
  };

  const handleClose = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Khu vực Thầy Mẫn</h3>
              <p className="text-xs text-emerald-100">Quản lý & kết xuất dữ liệu Lớp Toán 12_4</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-800 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-950">Bảo mật thông tin lớp Toán 12_4:</p>
              <p className="mt-0.5">
                Vui lòng nhập mật khẩu của Thầy Mẫn để truy cập bảng tổng hợp và tải file Excel.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Gmail Thầy Mẫn <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ldman87@gmail.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mật khẩu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" /> Đăng nhập
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
