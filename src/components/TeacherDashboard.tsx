import React, { useState, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  RefreshCw,
  Search,
  Filter,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Trash2,
  Edit,
  Eye,
  Plus,
  Share2,
  Clock,
  CheckCircle,
  FileText,
  AlertTriangle,
  ArrowUpDown,
  Smartphone,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { StudentSubmission } from '../types';
import { exportToExcel, exportToCSV, formatDateVN, formatDateTimeVN } from '../utils/excelExport';
import { StudentDetailModal } from './StudentDetailModal';
import { EditStudentModal } from './EditStudentModal';

interface TeacherDashboardProps {
  teacherEmail: string;
  onLogout: () => void;
  onOpenShareModal: () => void;
  onOpenAddModal: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacherEmail,
  onLogout,
  onOpenShareModal,
  onOpenAddModal,
}) => {
  const [students, setStudents] = useState<StudentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('ALL');
  const [sortBy, setSortBy] = useState<'latest' | 'name-asc' | 'dob-asc'>('latest');

  // Modals state
  const [viewingStudent, setViewingStudent] = useState<StudentSubmission | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentSubmission | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Notification for new items
  const [newSubmissionsAlert, setNewSubmissionsAlert] = useState<string | null>(null);

  // Fetch data
  const fetchData = async (silent = false) => {
    try {
      if (!silent) setIsRefreshing(true);
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        if (silent && data.data.length > students.length && students.length > 0) {
          const added = data.data.length - students.length;
          setNewSubmissionsAlert(`Có ${added} học sinh mới vừa gửi thông tin!`);
          setTimeout(() => setNewSubmissionsAlert(null), 5000);
        }
        setStudents(data.data);
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Real-time polling every 5 seconds
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Unique communes for filter
  const communesList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.commune) set.add(s.commune.trim());
    });
    return Array.from(set).sort();
  }, [students]);

  // Filtered & sorted list
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        // Commune filter
        if (selectedCommune !== 'ALL' && s.commune.trim() !== selectedCommune) {
          return false;
        }

        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.studentPhone && s.studentPhone.includes(q)) ||
          (s.parentPhone && s.parentPhone.includes(q)) ||
          (s.fullAddress && s.fullAddress.toLowerCase().includes(q)) ||
          (s.hamlet && s.hamlet.toLowerCase().includes(q)) ||
          (s.village && s.village.toLowerCase().includes(q)) ||
          (s.commune && s.commune.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'name-asc') {
          return a.fullName.localeCompare(b.fullName, 'vi');
        }
        if (sortBy === 'dob-asc') {
          return (a.dob || '').localeCompare(b.dob || '');
        }
        return 0;
      });
  }, [students, searchQuery, selectedCommune, sortBy]);

  // Stats
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = students.filter((s) => s.createdAt?.startsWith(todayStr)).length;
  const withStudentPhoneCount = students.filter((s) => !s.hasNoStudentPhone && !!s.studentPhone).length;

  // Handle Edit Save
  const handleSaveEdit = async (updatedData: Partial<StudentSubmission>) => {
    if (!editingStudent) return;
    const res = await fetch(`/api/students/${editingStudent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    const resData = await res.json();
    if (!res.ok || !resData.success) {
      throw new Error(resData.message || 'Không thể cập nhật hồ sơ');
    }
    // Update local state
    setStudents((prev) =>
      prev.map((item) => (item.id === editingStudent.id ? resData.data : item))
    );
  };

  // Handle Delete
  const handleDeleteConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStudents((prev) => prev.filter((item) => item.id !== id));
        setDeletingId(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Handle Reset Sample
  const handleResetSample = async () => {
    try {
      await fetch('/api/students/reset-sample', { method: 'POST' });
      setShowResetConfirm(false);
      fetchData();
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  // Handle Clear All
  const handleClearAll = async () => {
    try {
      await fetch('/api/students/clear-all', { method: 'POST' });
      setShowResetConfirm(false);
      setStudents([]);
    } catch (err) {
      console.error('Clear all error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Real-time Toast Alert */}
      {newSubmissionsAlert && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-200" />
          <span className="font-semibold text-sm">{newSubmissionsAlert}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              THEO DÕI THỜI GIAN THỰC (REAL-TIME)
            </span>
            <span className="text-xs text-slate-400">
              Cập nhật lúc: {lastSyncTime.toLocaleTimeString('vi-VN')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Quản Lý & Tổng Hợp Học Sinh
          </h1>

          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <span>Giáo viên chủ nhiệm:</span>
            <strong className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">
              {teacherEmail}
            </strong>
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Main Excel Export Button */}
          <button
            onClick={() => exportToExcel(filteredStudents, teacherEmail)}
            disabled={students.length === 0}
            className="flex-1 sm:flex-initial px-5 py-3 bg-[#107c41] hover:bg-[#0c6b37] active:bg-[#0a572d] disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-800/20 transition flex items-center justify-center gap-2.5 group cursor-pointer"
            title="Tải toàn bộ danh sách định dạng Excel .xlsx chuẩn cho GVCN"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition" />
            <span>Tải file Excel (.xlsx)</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={() => exportToCSV(filteredStudents)}
            disabled={students.length === 0}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 text-slate-700 rounded-2xl font-semibold text-xs transition flex items-center gap-2"
            title="Tải file CSV UTF-8 hỗ trợ tiếng Việt"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Tải CSV</span>
          </button>

          {/* Share Link & QR Button */}
          <button
            onClick={onOpenShareModal}
            className="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl font-semibold text-xs transition flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Link & Mã QR</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => fetchData(false)}
            className={`p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            title="Làm mới ngay"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl transition"
            title="Đăng xuất giáo viên"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">
              Tổng số học sinh
            </span>
            <span className="text-2xl font-black text-slate-800">
              {students.length} <span className="text-xs font-normal text-slate-400">em</span>
            </span>
          </div>
        </div>

        {/* Today Submissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">
              Nộp hôm nay
            </span>
            <span className="text-2xl font-black text-emerald-700">
              {todayCount} <span className="text-xs font-normal text-slate-400">em</span>
            </span>
          </div>
        </div>

        {/* Student Phone Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">
              Có SĐT riêng
            </span>
            <span className="text-2xl font-black text-slate-800">
              {withStudentPhoneCount} / {students.length}
            </span>
          </div>
        </div>

        {/* Communes Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">
              Địa bàn Xã (mới)
            </span>
            <span className="text-2xl font-black text-amber-800">
              {communesList.length} <span className="text-xs font-normal text-slate-400">xã</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo Tên học sinh, SĐT, Gmail, Thôn, Xóm, Xã mới..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Commune */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCommune}
                onChange={(e) => setSelectedCommune(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tất cả Xã (mới)</option>
                {communesList.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="latest">Mới nhất trước</option>
                <option value="name-asc">Họ tên: A → Z</option>
                <option value="dob-asc">Ngày sinh tăng dần</option>
              </select>
            </div>

            {/* Add student manually */}
            <button
              onClick={onOpenAddModal}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Thêm học sinh
            </button>
          </div>
        </div>

        {/* Active Filter Indicators */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div>
            Hiển thị <strong className="text-slate-800">{filteredStudents.length}</strong> / {students.length} học sinh
            {searchQuery && (
              <span> • Khớp từ khóa: "{searchQuery}"</span>
            )}
            {selectedCommune !== 'ALL' && (
              <span> • Lọc Xã: "{selectedCommune}"</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-slate-400 hover:text-indigo-600 text-[11px] underline transition"
            >
              Quản lý dữ liệu mẫu
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
            <p className="text-sm font-medium">Đang tải danh sách học sinh...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <Users className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-base font-semibold text-slate-600">
              {students.length === 0
                ? 'Chưa có dữ liệu học sinh nào được gửi.'
                : 'Không tìm thấy kết quả phù hợp với bộ lọc.'}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {students.length === 0
                ? 'Hãy chia sẻ đường link hoặc mã QR cho học sinh để các em bắt đầu điền thông tin.'
                : 'Thử xóa từ khóa tìm kiếm hoặc chọn lại địa bàn Xã.'}
            </p>
            {students.length === 0 && (
              <button
                onClick={onOpenShareModal}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Lấy link gửi học sinh
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-12">STT</th>
                  <th className="py-3.5 px-4 min-w-[180px]">Họ tên học sinh</th>
                  <th className="py-3.5 px-4 min-w-[110px]">Ngày sinh</th>
                  <th className="py-3.5 px-4 min-w-[220px]">
                    Địa chỉ (Đội/Xóm • Thôn/Khu • Xã mới)
                  </th>
                  <th className="py-3.5 px-4 min-w-[190px]">Gmail cá nhân</th>
                  <th className="py-3.5 px-4 min-w-[130px]">SĐT học sinh</th>
                  <th className="py-3.5 px-4 min-w-[140px]">SĐT Phụ huynh</th>
                  <th className="py-3.5 px-4 min-w-[120px] text-center">Nộp lúc</th>
                  <th className="py-3.5 px-4 text-right min-w-[110px]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* STT */}
                    <td className="py-3.5 px-4 text-center font-medium text-slate-400 text-xs">
                      {idx + 1}
                    </td>

                    {/* Họ và tên */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-sm">
                        {student.fullName}
                      </div>
                      {student.notes && (
                        <div className="text-[11px] text-amber-600 truncate max-w-[200px]" title={student.notes}>
                          📝 {student.notes}
                        </div>
                      )}
                    </td>

                    {/* Ngày sinh */}
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      <div className="font-medium">{formatDateVN(student.dob)}</div>
                    </td>

                    {/* Địa chỉ 3 cấp */}
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-medium text-slate-800">
                        {[student.hamlet, student.village].filter(Boolean).join(' • ') || '—'}
                      </div>
                      <div className="text-indigo-600 font-semibold mt-0.5">
                        {student.commune}
                      </div>
                    </td>

                    {/* Gmail */}
                    <td className="py-3.5 px-4 text-xs font-mono">
                      <a
                        href={`mailto:${student.email}`}
                        className="text-slate-600 hover:text-indigo-600 hover:underline"
                      >
                        {student.email}
                      </a>
                    </td>

                    {/* SĐT cá nhân */}
                    <td className="py-3.5 px-4 text-xs font-mono">
                      {student.hasNoStudentPhone ? (
                        <span className="text-slate-400 italic">Chưa có SĐT</span>
                      ) : student.studentPhone ? (
                        <a
                          href={`tel:${student.studentPhone}`}
                          className="text-slate-700 hover:text-emerald-700 font-semibold"
                        >
                          {student.studentPhone}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* SĐT Phụ huynh */}
                    <td className="py-3.5 px-4 text-xs font-mono">
                      <a
                        href={`tel:${student.parentPhone}`}
                        className="text-emerald-800 font-bold hover:underline"
                      >
                        {student.parentPhone}
                      </a>
                      <div className="text-[11px] text-slate-400 font-sans">
                        ({student.parentRelationship || 'PH'}{student.parentName ? ` - ${student.parentName}` : ''})
                      </div>
                    </td>

                    {/* Thời gian gửi */}
                    <td className="py-3.5 px-4 text-center text-[11px] text-slate-400">
                      {formatDateTimeVN(student.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(student.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Xóa hồ sơ này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Xác nhận xóa học sinh?</h3>
            <p className="text-xs text-slate-500">
              Hành động này sẽ xóa dữ liệu học sinh này khỏi danh sách lớp và không thể hoàn tác.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDeleteConfirm(deletingId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset / Clear Data Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-800">Quản lý cơ sở dữ liệu</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bạn có thể khôi phục lại 5 học sinh mẫu ban đầu để kiểm tra tính năng tải Excel, hoặc dọn sạch danh sách để chuẩn bị thu thập dữ liệu thật cho lớp mới.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleResetSample}
                className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition"
              >
                Khôi phục 5 bản ghi mẫu ban đầu
              </button>
              <button
                onClick={handleClearAll}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition"
              >
                Dọn sạch toàn bộ (Bắt đầu lớp mới)
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <StudentDetailModal
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(student) => {
          setViewingStudent(null);
          setEditingStudent(student);
        }}
      />

      {/* Edit Modal */}
      <EditStudentModal
        student={editingStudent}
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};
