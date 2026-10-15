import * as XLSX from 'xlsx';
import { StudentSubmission } from '../types';

export function formatDateVN(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function formatDateTimeVN(isoStr: string): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch {
    return isoStr;
  }
}

export function exportToExcel(
  students: StudentSubmission[],
  teacherEmail = 'ldman87@gmail.com'
): void {
  const now = new Date();
  const exportTime = `${String(now.getDate()).padStart(2, '0')}/${String(
    now.getMonth() + 1
  ).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(
    2,
    '0'
  )}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Data rows mapped
  const dataRows = students.map((s, index) => {
    const fullAddr =
      s.fullAddress ||
      [s.hamlet, s.village, s.commune].filter(Boolean).join(', ');

    return {
      'STT': index + 1,
      'Họ và tên học sinh': s.fullName,
      'Ngày sinh': formatDateVN(s.dob),
      'Đội / Xóm': s.hamlet || '',
      'Thôn / Khu': s.village || '',
      'Xã (mới)': s.commune || '',
      'Địa chỉ đầy đủ': fullAddr,
      'Nguyện vọng': s.aspiration || s.email || 'Chưa chọn',
      'SĐT học sinh': s.hasNoStudentPhone
        ? 'Chưa có SĐT'
        : s.studentPhone || '',
      'SĐT Phụ huynh': s.parentPhone || '',
      'Mối quan hệ PH': s.parentRelationship || 'Phụ huynh',
      'Tên Phụ huynh': s.parentName || '',
      'Ghi chú': s.notes || '',
      'Thời gian gửi': formatDateTimeVN(s.createdAt),
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataRows, {
    header: [
      'STT',
      'Họ và tên học sinh',
      'Ngày sinh',
      'Đội / Xóm',
      'Thôn / Khu',
      'Xã (mới)',
      'Địa chỉ đầy đủ',
      'Nguyện vọng',
      'SĐT học sinh',
      'SĐT Phụ huynh',
      'Mối quan hệ PH',
      'Tên Phụ huynh',
      'Ghi chú',
      'Thời gian gửi',
    ],
  });

  // Calculate column widths
  const colWidths = [
    { wch: 6 }, // STT
    { wch: 26 }, // Họ tên
    { wch: 14 }, // Ngày sinh
    { wch: 16 }, // Đội / Xóm
    { wch: 18 }, // Thôn / Khu
    { wch: 22 }, // Xã (mới)
    { wch: 38 }, // Địa chỉ đầy đủ
    { wch: 22 }, // Nguyện vọng
    { wch: 16 }, // SĐT HS
    { wch: 16 }, // SĐT PH
    { wch: 16 }, // Quan hệ
    { wch: 22 }, // Tên PH
    { wch: 25 }, // Ghi chú
    { wch: 20 }, // Thời gian gửi
  ];
  worksheet['!cols'] = colWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lớp Toán 12_4');

  // Generate file name with date
  const dateSuffix = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(
    2,
    '0'
  )}${String(now.getMinutes()).padStart(2, '0')}`;
  const filename = `Danh_Sach_Lop_Toan_12_4_Thay_Man_${dateSuffix}.xlsx`;

  // Write file
  XLSX.writeFile(workbook, filename);
}

export function exportToCSV(
  students: StudentSubmission[]
): void {
  const headers = [
    'STT',
    'Họ và tên học sinh',
    'Ngày sinh',
    'Đội/Xóm',
    'Thôn/Khu',
    'Xã (mới)',
    'Địa chỉ đầy đủ',
    'Nguyện vọng',
    'SĐT học sinh',
    'SĐT Phụ huynh',
    'Mối quan hệ PH',
    'Tên Phụ huynh',
    'Ghi chú',
    'Thời gian gửi',
  ];

  const rows = students.map((s, idx) => {
    const fullAddr =
      s.fullAddress ||
      [s.hamlet, s.village, s.commune].filter(Boolean).join(', ');
    return [
      idx + 1,
      `"${(s.fullName || '').replace(/"/g, '""')}"`,
      `"${formatDateVN(s.dob)}"`,
      `"${(s.hamlet || '').replace(/"/g, '""')}"`,
      `"${(s.village || '').replace(/"/g, '""')}"`,
      `"${(s.commune || '').replace(/"/g, '""')}"`,
      `"${(fullAddr || '').replace(/"/g, '""')}"`,
      `"${(s.aspiration || s.email || 'Chưa chọn').replace(/"/g, '""')}"`,
      `"${s.hasNoStudentPhone ? 'Chưa có SĐT' : s.studentPhone || ''}"`,
      `"${(s.parentPhone || '').replace(/"/g, '""')}"`,
      `"${(s.parentRelationship || 'Phụ huynh').replace(/"/g, '""')}"`,
      `"${(s.parentName || '').replace(/"/g, '""')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
      `"${formatDateTimeVN(s.createdAt)}"`,
    ].join(',');
  });

  // UTF-8 BOM for Excel to open Vietnamese text without encoding issues
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const now = new Date();
  a.download = `Danh_Sach_Lop_Toan_12_4_Thay_Man_${now.getFullYear()}${String(
    now.getMonth() + 1
  ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
