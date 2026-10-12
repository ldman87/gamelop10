import React, { useState } from 'react';
import {
  GraduationCap,
  User,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  RotateCcw,
  Eye,
  Pencil,
  ArrowLeft,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { StudentInput, StudentSubmission } from '../types';
import { formatDateVN } from '../utils/excelExport';

interface StudentFormProps {
  onSubmitSuccess: (data: StudentSubmission) => void;
  onOpenTeacherModal: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  onSubmitSuccess,
  onOpenTeacherModal,
}) => {
  const [formData, setFormData] = useState<StudentInput>({
    fullName: '',
    dob: '',
    hamlet: '',
    village: '',
    commune: '',
    email: '',
    studentPhone: '',
    hasNoStudentPhone: false,
    parentPhone: '',
    parentRelationship: 'Bố',
    parentName: '',
    notes: '',
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedStudent, setSubmittedStudent] = useState<StudentSubmission | null>(null);

  // Address preview
  const addressPreview = [
    formData.hamlet.trim(),
    formData.village.trim(),
    formData.commune.trim(),
  ]
    .filter(Boolean)
    .join(', ');

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({ ...prev, fullName: val }));
  };

  const handleQuickAppendGmail = () => {
    if (!formData.email.includes('@')) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email.trim() ? `${prev.email.trim()}@gmail.com` : '@gmail.com',
      }));
    }
  };

  const validate = (): string | null => {
    if (!formData.fullName.trim()) return 'Vui lòng điền đầy đủ Họ và tên học sinh';
    if (!formData.dob) return 'Vui lòng chọn Ngày tháng năm sinh';
    if (!formData.commune.trim()) return 'Vui lòng điền Xã (mới) / Phường hiện tại';

    // Check Gmail
    const emailClean = formData.email.trim().toLowerCase();
    if (!emailClean) return 'Vui lòng điền địa chỉ Gmail cá nhân';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      return 'Địa chỉ Gmail không đúng định dạng (Ví dụ: hocsinh@gmail.com)';
    }

    // Check Student phone if provided and not checked
    if (!formData.hasNoStudentPhone && formData.studentPhone.trim()) {
      const cleanPhone = formData.studentPhone.trim().replace(/\s/g, '');
      if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(cleanPhone)) {
        return 'Số điện thoại cá nhân học sinh phải gồm 10 chữ số hợp lệ (bắt đầu bằng 03, 05, 07, 08, 09)';
      }
    }

    // Check Parent phone
    const cleanParentPhone = formData.parentPhone.trim().replace(/\s/g, '');
    if (!cleanParentPhone) return 'Vui lòng nhập Số điện thoại của Phụ huynh';
    if (!/^(0[2|3|5|7|8|9])[0-9]{8,9}$/.test(cleanParentPhone)) {
      return 'Số điện thoại Phụ huynh phải gồm 10 chữ số hợp lệ (ví dụ: 0987654321)';
    }

    return null;
  };

  // Step 1: Click "Xem lại thông tin"
  const handleProceedToPreview = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setErrorMessage(error);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setErrorMessage(null);
    setIsPreviewMode(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Step 2: Back to edit form
  const handleBackToEdit = () => {
    setIsPreviewMode(false);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Step 3: Final submit from preview
  const handleConfirmSubmit = async () => {
    const error = validate();
    if (error) {
      setErrorMessage(error);
      setIsPreviewMode(false);
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Không thể lưu thông tin. Vui lòng thử lại.');
      }

      setSubmittedStudent(resData.data);
      setIsPreviewMode(false);
      onSubmitSuccess(resData.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Đã có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setSubmittedStudent(null);
    setIsPreviewMode(false);
    setFormData({
      fullName: '',
      dob: '',
      hamlet: '',
      village: '',
      commune: '',
      email: '',
      studentPhone: '',
      hasNoStudentPhone: false,
      parentPhone: '',
      parentRelationship: 'Bố',
      parentName: '',
      notes: '',
    });
    setErrorMessage(null);
  };

  // ==========================================
  // VIEW 1: SUCCESS CONFIRMATION
  // ==========================================
  if (submittedStudent) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-800">
          Gửi thông tin thành công!
        </h2>
        <p className="text-slate-600 mt-2 text-sm max-w-md mx-auto">
          Thông tin của em <strong className="text-emerald-700 font-bold">{submittedStudent.fullName}</strong> đã được lưu trữ và tổng hợp tự động vào danh sách lớp của Thầy/Cô chủ nhiệm.
        </p>

        {/* Summary Card */}
        <div className="my-6 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-3 text-xs sm:text-sm">
          <div className="font-semibold text-slate-700 border-b border-slate-200 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-indigo-700">
              <FileCheck2 className="w-4 h-4" /> Bản tóm tắt phiếu thu thập:
            </span>
            <span className="text-xs text-slate-400 font-normal">Mã: {submittedStudent.id}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-slate-400 block text-xs">Họ và tên học sinh:</span>
              <span className="font-bold text-slate-800">{submittedStudent.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Ngày sinh:</span>
              <span className="font-semibold text-slate-800">{formatDateVN(submittedStudent.dob)}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-xs">Địa chỉ đang ở:</span>
            <span className="font-medium text-slate-800">
              {submittedStudent.fullAddress || `${submittedStudent.hamlet}, ${submittedStudent.village}, ${submittedStudent.commune}`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block text-xs">Gmail cá nhân:</span>
              <span className="font-medium text-slate-800">{submittedStudent.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">SĐT cá nhân học sinh:</span>
              <span className="font-medium text-slate-800">
                {submittedStudent.hasNoStudentPhone
                  ? 'Chưa có điện thoại riêng'
                  : submittedStudent.studentPhone}
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-xs">SĐT Phụ huynh:</span>
            <span className="font-bold text-emerald-800 font-mono">
              {submittedStudent.parentPhone} ({submittedStudent.parentRelationship || 'Phụ huynh'})
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleResetForAnother}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
          >
            <RotateCcw className="w-4 h-4" /> Điền phiếu cho học sinh khác
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: PREVIEW CONFIRMATION SCREEN
  // ==========================================
  if (isPreviewMode) {
    return (
      <div className="max-w-3xl mx-auto my-6 sm:my-10 px-4 sm:px-0 animate-fade-in">
        {/* Preview Top Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white p-6 sm:p-7 rounded-3xl shadow-xl shadow-indigo-900/10 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">
            <Eye className="w-4 h-4 text-amber-300" />
            BƯỚC KIỂM TRA & XÁC NHẬN THÔNG TIN
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xem lại thông tin trước khi nộp
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-indigo-100 max-w-xl">
            Vui lòng kiểm tra kỹ các mục bên dưới. Nếu có sai sót, em có thể bấm nút <strong className="underline">Chỉnh sửa lại</strong> để cập nhật trước khi gửi cho Thầy/Cô.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900">Thông báo lỗi:</p>
              <p className="text-xs sm:text-sm mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Detailed Preview Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden divide-y divide-slate-100">
          {/* Card Item 1: Họ tên & Ngày sinh */}
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" /> 1. Họ tên & Ngày tháng năm sinh
              </span>
              <button
                type="button"
                onClick={handleBackToEdit}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition"
              >
                <Pencil className="w-3.5 h-3.5" /> Sửa mục này
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Họ và tên học sinh:</span>
                <span className="text-base font-extrabold text-slate-800">{formData.fullName}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Ngày tháng năm sinh:</span>
                <span className="text-base font-bold text-slate-800">
                  {formatDateVN(formData.dob)}
                </span>
              </div>
            </div>
          </div>

          {/* Card Item 2: Địa chỉ cư trú */}
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" /> 2. Địa chỉ đang ở (Đội/Xóm, Thôn/Khu, Xã mới)
              </span>
              <button
                type="button"
                onClick={handleBackToEdit}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition"
              >
                <Pencil className="w-3.5 h-3.5" /> Sửa mục này
              </button>
            </div>
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Đội / Xóm:</span>
                  <span className="font-semibold text-slate-800">{formData.hamlet || '(Chưa nhập)'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Thôn / Khu:</span>
                  <span className="font-semibold text-slate-800">{formData.village || '(Chưa nhập)'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Xã (mới):</span>
                  <span className="font-bold text-indigo-700">{formData.commune}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 text-xs">
                <span className="text-slate-400 block font-medium">Địa chỉ đầy đủ sẽ lưu vào bảng:</span>
                <span className="font-semibold text-slate-800">{addressPreview}</span>
              </div>
            </div>
          </div>

          {/* Card Item 3: Gmail & SĐT học sinh */}
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-indigo-600" /> 3. Gmail & SĐT cá nhân học sinh
              </span>
              <button
                type="button"
                onClick={handleBackToEdit}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition"
              >
                <Pencil className="w-3.5 h-3.5" /> Sửa mục này
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Gmail cá nhân:</span>
                <span className="text-sm font-semibold text-slate-800 font-mono">{formData.email}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">SĐT cá nhân học sinh:</span>
                <span className="text-sm font-semibold text-slate-800 font-mono">
                  {formData.hasNoStudentPhone
                    ? 'Chưa có số điện thoại riêng'
                    : formData.studentPhone || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Card Item 4: SĐT Phụ huynh */}
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" /> 4. Số điện thoại Phụ huynh
              </span>
              <button
                type="button"
                onClick={handleBackToEdit}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition"
              >
                <Pencil className="w-3.5 h-3.5" /> Sửa mục này
              </button>
            </div>
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-emerald-700 block font-medium">
                    Người liên hệ: {formData.parentRelationship || 'Phụ huynh'} {formData.parentName ? `(${formData.parentName})` : ''}
                  </span>
                  <span className="text-lg font-black text-emerald-950 font-mono">
                    {formData.parentPhone}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                  <ShieldCheck className="w-4 h-4" /> Số điện thoại chính
                </span>
              </div>
            </div>
          </div>

          {/* Optional: Notes */}
          {formData.notes && (
            <div className="p-6 sm:p-7">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Ghi chú thêm gửi Thầy/Cô:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 italic">
                {formData.notes}
              </p>
            </div>
          )}

          {/* Bottom Dual Action Buttons: Edit OR Confirm Submit */}
          <div className="p-6 sm:p-7 bg-slate-50 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            {/* Edit Button */}
            <button
              type="button"
              onClick={handleBackToEdit}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 rounded-2xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Chỉnh sửa lại (Edit)</span>
            </button>

            {/* Confirm Submit Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmSubmit}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] disabled:opacity-50 text-white rounded-2xl text-sm sm:text-base font-extrabold shadow-lg shadow-emerald-700/25 transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang gửi thông tin...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Xác nhận chính xác & Gửi phiếu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: INPUT FORM
  // ==========================================
  return (
    <div className="max-w-3xl mx-auto my-6 sm:my-10 px-4 sm:px-0">
      {/* Top Banner / Announcement */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-indigo-900/10 mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100 mb-3 border border-white/20">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            LỚP CHỦ NHIỆM • NĂM HỌC 2026 - 2027
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Phiếu Thu Thập Thông Tin Học Sinh
          </h1>

          <p className="mt-2 text-blue-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Chào các em! Thầy/Cô chủ nhiệm tạo biểu mẫu này để cập nhật hồ sơ lớp học và thông tin liên lạc phục vụ công tác liên lạc trong năm học.
          </p>

          <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Học sinh <strong>không cần đăng nhập</strong>. Có bước <strong>xem lại</strong> trước khi gửi.</span>
            </div>
            <button
              type="button"
              onClick={onOpenTeacherModal}
              className="text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg text-white font-medium transition backdrop-blur-sm"
            >
              Khu vực Giáo viên (ldman87@gmail.com) →
            </button>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-9">
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900">Vui lòng kiểm tra lại:</p>
              <p className="text-xs sm:text-sm mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleProceedToPreview} className="space-y-8">
          {/* Section 1: Thông tin học sinh & Ngày sinh */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm uppercase tracking-wider pb-2 border-b border-slate-100">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
                1
              </div>
              <span>Họ tên học sinh & Ngày tháng năm sinh</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Họ và tên học sinh <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 pl-1">
                  Nhập họ và tên có dấu rõ ràng (VD: Nguyễn Văn An)
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ngày sinh <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 pl-1">
                  {formData.dob ? `Đã chọn: ${formatDateVN(formData.dob)}` : 'Ngày / Tháng / Năm'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Địa chỉ cư trú (Đội/Xóm, Thôn/Khu, Xã mới) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm uppercase tracking-wider pb-2 border-b border-slate-100">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
                2
              </div>
              <span>Địa chỉ đang ở (Đội/Xóm, Thôn/Khu, Xã mới)</span>
            </div>

            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-4">
              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                Vui lòng điền chi tiết 3 cấp hành chính theo yêu cầu của Thầy/Cô:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Đội / Xóm */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đội / Xóm / Tổ
                  </label>
                  <input
                    type="text"
                    value={formData.hamlet}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, hamlet: e.target.value }))
                    }
                    placeholder="VD: Đội 3, Xóm 5, Tổ 2"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                {/* Thôn / Khu */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thôn / Khu / Bản
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, village: e.target.value }))
                    }
                    placeholder="VD: Thôn An Lạc, Khu 2"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                {/* Xã (mới) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Xã (mới) / Phường / TT <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.commune}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, commune: e.target.value }))
                    }
                    placeholder="VD: Xã Tân Tiến (mới)"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Preview Address */}
              <div className="p-3 bg-white rounded-xl border border-dashed border-indigo-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Xem trước địa chỉ sẽ lưu:</span>
                <span className="font-semibold text-indigo-700 text-right">
                  {addressPreview || 'Chưa nhập địa chỉ'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Gmail cá nhân & SĐT cá nhân */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm uppercase tracking-wider pb-2 border-b border-slate-100">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
                3
              </div>
              <span>Gmail cá nhân & Số điện thoại của học sinh</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gmail cá nhân */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Địa chỉ Gmail cá nhân <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="tenhocsinh@gmail.com"
                    className="w-full pl-10 pr-24 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition"
                  />
                  {!formData.email.includes('@') && formData.email.trim() && (
                    <button
                      type="button"
                      onClick={handleQuickAppendGmail}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition"
                    >
                      + @gmail.com
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 pl-1">
                  Dùng để nhận tài liệu học tập, bài tập trực tuyến
                </p>
              </div>

              {/* SĐT cá nhân */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Số điện thoại cá nhân (hiện tại)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer font-medium hover:text-indigo-600 transition">
                    <input
                      type="checkbox"
                      checked={formData.hasNoStudentPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hasNoStudentPhone: e.target.checked,
                          studentPhone: e.target.checked ? '' : prev.studentPhone,
                        }))
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <span>Chưa có ĐT riêng</span>
                  </label>
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    disabled={formData.hasNoStudentPhone}
                    value={formData.studentPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, studentPhone: e.target.value }))
                    }
                    placeholder={
                      formData.hasNoStudentPhone
                        ? 'Chưa có điện thoại riêng'
                        : 'Ví dụ: 0912345678'
                    }
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm font-medium transition ${
                      formData.hasNoStudentPhone
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 pl-1">
                  {formData.hasNoStudentPhone
                    ? 'Thầy/Cô sẽ liên hệ qua số điện thoại của Phụ huynh'
                    : '10 chữ số (VD: 098..., 038..., 086...)'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Số điện thoại Phụ huynh */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm uppercase tracking-wider pb-2 border-b border-slate-100">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
                4
              </div>
              <span>Số điện thoại Phụ huynh (hiện tại)</span>
            </div>

            <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Quan hệ */}
                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                    Mối quan hệ
                  </label>
                  <select
                    value={formData.parentRelationship}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        parentRelationship: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-3 bg-white rounded-xl border border-emerald-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  >
                    <option value="Bố">Bố</option>
                    <option value="Mẹ">Mẹ</option>
                    <option value="Ông/Bà">Ông / Bà</option>
                    <option value="Người giám hộ">Người giám hộ</option>
                  </select>
                </div>

                {/* Tên PH */}
                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                    Họ và tên Phụ huynh <span className="text-slate-400 font-normal">(tùy chọn)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.parentName || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, parentName: e.target.value }))
                    }
                    placeholder="VD: Nguyễn Văn Nam"
                    className="w-full px-3.5 py-3 bg-white rounded-xl border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>

                {/* SĐT PH */}
                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                    Số điện thoại PH <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.parentPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, parentPhone: e.target.value }))
                      }
                      placeholder="VD: 0987654321"
                      className="w-full pl-10 pr-3.5 py-3 bg-white rounded-xl border border-emerald-300 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-emerald-800">
                ⚠️ Bắt buộc điền đúng số điện thoại của Phụ huynh để Thầy/Cô liên hệ khi có việc khẩn cấp hoặc trao đổi học tập.
              </p>
            </div>
          </div>

          {/* Optional: Ghi chú thêm */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ghi chú thêm gửi Thầy/Cô chủ nhiệm <span className="text-slate-400 font-normal">(nếu có)</span>
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Ví dụ: Em tham gia tuyến xe buýt số 3; Hoàn cảnh gia đình; Năng khiếu..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Preview Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 active:scale-[0.99] text-white rounded-2xl text-base font-bold shadow-lg shadow-indigo-700/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-5 h-5" />
              <span>Xem lại & Kiểm tra thông tin trước khi nộp</span>
            </button>
            <p className="text-center text-xs text-slate-400 mt-2.5">
              Em sẽ được xem lại toàn bộ thông tin và có thể bấm <strong>Chỉnh sửa lại</strong> trước khi gửi chính thức.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
