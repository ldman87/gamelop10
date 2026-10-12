import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { StudentSubmission } from '../types';

interface EditStudentModalProps {
  student: StudentSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<StudentSubmission>) => Promise<void>;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave,
}) => {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [hamlet, setHamlet] = useState('');
  const [village, setVillage] = useState('');
  const [commune, setCommune] = useState('');
  const [email, setEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [hasNoStudentPhone, setHasNoStudentPhone] = useState(false);
  const [parentPhone, setParentPhone] = useState('');
  const [parentRelationship, setParentRelationship] = useState('Bố');
  const [parentName, setParentName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setFullName(student.fullName || '');
      setDob(student.dob || '');
      setHamlet(student.hamlet || '');
      setVillage(student.village || '');
      setCommune(student.commune || '');
      setEmail(student.email || '');
      setStudentPhone(student.studentPhone || '');
      setHasNoStudentPhone(!!student.hasNoStudentPhone);
      setParentPhone(student.parentPhone || '');
      setParentRelationship(student.parentRelationship || 'Bố');
      setParentName(student.parentName || '');
      setNotes(student.notes || '');
      setError(null);
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Vui lòng nhập họ và tên học sinh');
      return;
    }
    if (!dob) {
      setError('Vui lòng chọn ngày tháng năm sinh');
      return;
    }
    if (!commune.trim()) {
      setError('Vui lòng nhập Xã (mới)');
      return;
    }
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ Gmail');
      return;
    }
    if (!parentPhone.trim()) {
      setError('Vui lòng nhập số điện thoại Phụ huynh');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        fullName: fullName.trim(),
        dob,
        hamlet: hamlet.trim(),
        village: village.trim(),
        commune: commune.trim(),
        email: email.trim().toLowerCase(),
        studentPhone: hasNoStudentPhone ? '' : studentPhone.trim(),
        hasNoStudentPhone,
        parentPhone: parentPhone.trim(),
        parentRelationship,
        parentName: parentName.trim(),
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật thông tin');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="bg-slate-800 p-5 text-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-bold text-lg leading-tight">Chỉnh sửa hồ sơ học sinh</h3>
            <p className="text-xs text-slate-300">Cập nhật thông tin chính xác</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Họ và tên học sinh <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ngày tháng năm sinh <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="border border-slate-100 bg-slate-50 p-3 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-600 block uppercase">
              Địa chỉ cư trú:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                  Đội / Xóm
                </label>
                <input
                  type="text"
                  value={hamlet}
                  onChange={(e) => setHamlet(e.target.value)}
                  placeholder="Ví dụ: Xóm 3, Đội 2"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                  Thôn / Khu
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Ví dụ: Thôn Xuân Hạ"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                Xã (mới) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="Ví dụ: Xã Lệ Thủy (mới)"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Địa chỉ Gmail cá nhân <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="border border-slate-100 bg-slate-50 p-3 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                SĐT cá nhân học sinh
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasNoStudentPhone}
                  onChange={(e) => setHasNoStudentPhone(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Chưa có SĐT riêng
              </label>
            </div>
            {!hasNoStudentPhone && (
              <input
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            )}
          </div>

          <div className="border border-slate-100 bg-slate-50 p-3 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              SĐT Phụ huynh <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={parentRelationship}
                onChange={(e) => setParentRelationship(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
              >
                <option value="Bố">Bố</option>
                <option value="Mẹ">Mẹ</option>
                <option value="Ông/Bà">Ông/Bà</option>
                <option value="Giám hộ">Giám hộ</option>
              </select>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Tên PH (tùy chọn)"
                className="col-span-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
              />
            </div>
            <input
              type="tel"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="Số điện thoại PH (bắt buộc)"
              className="w-full px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú thêm
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
