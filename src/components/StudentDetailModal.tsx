import {
  X,
  User,
  Calendar,
  MapPin,
  Phone,
  Users,
  FileText,
  Clock,
  PhoneCall,
  Target,
  Award,
} from 'lucide-react';
import { StudentSubmission } from '../types';
import { formatDateVN, formatDateTimeVN } from '../utils/excelExport';

interface StudentDetailModalProps {
  student: StudentSubmission | null;
  onClose: () => void;
  onEdit: (student: StudentSubmission) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onEdit,
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex justify-between items-start shrink-0">
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-white/20 text-white rounded-full text-xs font-medium mb-1 backdrop-blur-sm">
              Hồ sơ học sinh • Lớp Toán 12_4
            </span>
            <h3 className="font-bold text-xl leading-tight">{student.fullName}</h3>
            <p className="text-xs text-blue-100 flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5" /> Ngày sinh: {formatDateVN(student.dob)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 divide-y divide-slate-100">
          {/* Section: Địa chỉ */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-600" /> Địa chỉ cư trú (Cấp 3 phần)
            </h4>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-xs border border-slate-200/70">
              <div>
                <span className="text-slate-400 block font-medium">Đội / Xóm:</span>
                <span className="font-semibold text-slate-800">{student.hamlet || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Thôn / Khu:</span>
                <span className="font-semibold text-slate-800">{student.village || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Xã (mới):</span>
                <span className="font-semibold text-indigo-700">{student.commune}</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
              <span className="font-semibold text-indigo-900">Địa chỉ đầy đủ: </span>
              {student.fullAddress || `${student.hamlet}, ${student.village}, ${student.commune}`}
            </div>
          </div>

          {/* Section: Nguyện vọng & Liên lạc */}
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-600" /> Nguyện vọng thi & Thông tin liên lạc
            </h4>

            <div className="space-y-2">
              {/* Nguyện vọng */}
              <div className="flex items-center justify-between p-3 bg-blue-50/70 rounded-xl border border-blue-200/70">
                <div className="flex items-center gap-2.5">
                  <Target className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-[11px] text-blue-500 block font-medium">Nguyện vọng của học sinh:</span>
                    <span className="text-sm font-bold text-blue-900">
                      {(student.aspiration || '').includes('Đại học') ? '🎯 Xét tuyển Đại học / Cao đẳng' : '🎓 Xét Tốt nghiệp THPT'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">SĐT cá nhân học sinh:</span>
                    <span className="text-sm font-medium text-slate-800">
                      {student.hasNoStudentPhone
                        ? 'Chưa có điện thoại riêng'
                        : student.studentPhone || '—'}
                    </span>
                  </div>
                </div>
                {!student.hasNoStudentPhone && student.studentPhone && (
                  <a
                    href={`tel:${student.studentPhone}`}
                    className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-medium flex items-center gap-1 transition"
                  >
                    <PhoneCall className="w-3 h-3" /> Gọi
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-[11px] text-emerald-600 block">
                      SĐT Phụ huynh ({student.parentRelationship || 'Phụ huynh'}{' '}
                      {student.parentName ? `- ${student.parentName}` : ''}):
                    </span>
                    <span className="text-sm font-bold text-emerald-950 font-mono">
                      {student.parentPhone}
                    </span>
                  </div>
                </div>
                <a
                  href={`tel:${student.parentPhone}`}
                  className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm transition"
                >
                  <PhoneCall className="w-3 h-3" /> Gọi PH
                </a>
              </div>
            </div>
          </div>

          {/* Section: Ghi chú & Thời gian */}
          <div className="pt-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" /> Ghi chú thêm
            </h4>
            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70 italic">
              {student.notes || 'Không có ghi chú thêm.'}
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
              <Clock className="w-3.5 h-3.5" /> Gửi lúc: {formatDateTimeVN(student.createdAt)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-between items-center shrink-0">
          <button
            onClick={() => {
              onClose();
              onEdit(student);
            }}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition"
          >
            Chỉnh sửa thông tin này
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-xl transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
