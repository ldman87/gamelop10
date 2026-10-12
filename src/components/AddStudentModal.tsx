import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { StudentInput } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ và tên học sinh');
      return;
    }
    if (!formData.dob) {
      setError('Vui lòng chọn ngày tháng năm sinh');
      return;
    }
    if (!formData.commune.trim()) {
      setError('Vui lòng nhập Xã (mới)');
      return;
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập địa chỉ Gmail cá nhân');
      return;
    }
    if (!formData.parentPhone.trim()) {
      setError('Vui lòng nhập số điện thoại Phụ huynh');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Lỗi thêm học sinh');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Không thể thêm học sinh');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="bg-indigo-600 p-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            <h3 className="font-bold text-lg">Thêm học sinh mới vào danh sách</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg transition"
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
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              placeholder="VD: Lê Thị Thu Hương"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ngày tháng năm sinh <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.dob}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dob: e.target.value }))
              }
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-600 block uppercase">
              Địa chỉ:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Đội / Xóm"
                value={formData.hamlet}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hamlet: e.target.value }))
                }
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              />
              <input
                type="text"
                placeholder="Thôn / Khu"
                value={formData.village}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, village: e.target.value }))
                }
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              />
            </div>
            <input
              type="text"
              required
              placeholder="Xã (mới) *"
              value={formData.commune}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, commune: e.target.value }))
              }
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gmail cá nhân <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="hocsinh@gmail.com"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700">
                SĐT cá nhân học sinh
              </label>
              <label className="text-xs text-slate-500 flex items-center gap-1 cursor-pointer">
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
                />
                Chưa có SĐT
              </label>
            </div>
            {!formData.hasNoStudentPhone && (
              <input
                type="tel"
                value={formData.studentPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    studentPhone: e.target.value,
                  }))
                }
                placeholder="0912345678"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              />
            )}
          </div>

          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 space-y-2">
            <label className="block text-xs font-semibold text-emerald-950">
              SĐT Phụ huynh <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={formData.parentRelationship}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    parentRelationship: e.target.value,
                  }))
                }
                className="px-2 py-1.5 rounded-lg border border-emerald-200 text-xs bg-white"
              >
                <option value="Bố">Bố</option>
                <option value="Mẹ">Mẹ</option>
                <option value="Ông/Bà">Ông/Bà</option>
                <option value="Giám hộ">Giám hộ</option>
              </select>
              <input
                type="text"
                placeholder="Tên PH"
                value={formData.parentName || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    parentName: e.target.value,
                  }))
                }
                className="col-span-2 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs bg-white"
              />
            </div>
            <input
              type="tel"
              required
              placeholder="Số điện thoại PH *"
              value={formData.parentPhone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parentPhone: e.target.value,
                }))
              }
              className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 text-xs bg-white font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl disabled:opacity-50"
            >
              {isSubmitting ? 'Đang thêm...' : 'Thêm học sinh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
