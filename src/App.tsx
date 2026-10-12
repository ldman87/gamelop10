import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Share2,
  FileSpreadsheet,
  CheckCircle,
  Sparkles,
  School,
  Lock,
  LogOut,
} from 'lucide-react';
import { StudentForm } from './components/StudentForm';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { ShareLinkModal } from './components/ShareLinkModal';
import { AddStudentModal } from './components/AddStudentModal';
import { StudentSubmission } from './types';

const TEACHER_EMAIL = 'ldman87@gmail.com';
const STORAGE_KEY_TEACHER = 'gvcn_teacher_auth_ldman87';

export default function App() {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Check saved teacher session on load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TEACHER);
    if (saved === 'true') {
      setIsTeacherLoggedIn(true);
    }
  }, []);

  const handleTeacherLoginSuccess = (email: string) => {
    setIsTeacherLoggedIn(true);
    localStorage.setItem(STORAGE_KEY_TEACHER, 'true');
    setActiveTab('teacher');
  };

  const handleTeacherLogout = () => {
    setIsTeacherLoggedIn(false);
    localStorage.removeItem(STORAGE_KEY_TEACHER);
    setActiveTab('student');
  };

  const handleStudentSubmitted = (newStudent: StudentSubmission) => {
    console.log('New student submission recorded:', newStudent.fullName);
  };

  const handleSwitchToTeacherTab = () => {
    if (isTeacherLoggedIn) {
      setActiveTab('teacher');
    } else {
      setIsTeacherModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Global Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / App Name */}
          <div
            onClick={() => setActiveTab('student')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Lớp Chủ Nhiệm
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full">
                  Năm học 2026-2027
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Cổng thu thập & tổng hợp thông tin học sinh
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {/* Student Mode Button */}
            <button
              onClick={() => setActiveTab('student')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'student'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Dành cho Học sinh</span>
            </button>

            {/* Teacher Mode Button */}
            <button
              onClick={handleSwitchToTeacherTab}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'teacher'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : isTeacherLoggedIn
                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">Khu vực Giáo viên</span>
              <span className="sm:hidden">GVCN</span>
              {isTeacherLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>

            {/* Quick Share Link button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
              title="Lấy link nộp & mã QR"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'student' ? (
          <StudentForm
            onSubmitSuccess={handleStudentSubmitted}
            onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
          />
        ) : (
          <TeacherDashboard
            teacherEmail={TEACHER_EMAIL}
            onLogout={handleTeacherLogout}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-medium text-slate-600">
            Hệ Thống Thu Thập & Tổng Hợp Dữ Liệu Học Sinh Lớp Chủ Nhiệm
          </p>
          <p className="text-slate-400">
            Giáo viên phụ trách:{' '}
            <button
              onClick={handleSwitchToTeacherTab}
              className="font-semibold text-indigo-600 hover:underline"
            >
              {TEACHER_EMAIL}
            </button>{' '}
            • Tự động kết xuất Excel (.xlsx) chuẩn hóa tiếng Việt có dấu
          </p>
        </div>
      </footer>

      {/* Modals */}
      <TeacherLoginModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onSuccess={handleTeacherLoginSuccess}
      />

      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          // If in teacher tab, will refresh on next interval
        }}
      />
    </div>
  );
}
