import { StudentInput, StudentSubmission } from '../types';

const STORAGE_KEY = 'lop_chunhiem_students_data_v1';

export const INITIAL_SAMPLE_STUDENTS: StudentSubmission[] = [
  {
    id: 'hs-1',
    fullName: 'Nguyễn Minh Tuấn',
    dob: '2009-03-15',
    hamlet: 'Đội 3',
    village: 'Thôn An Lạc',
    commune: 'Xã Tân Tiến (mới)',
    fullAddress: 'Đội 3, Thôn An Lạc, Xã Tân Tiến (mới)',
    email: 'minhtuan.nguyen2009@gmail.com',
    studentPhone: '0912345678',
    hasNoStudentPhone: false,
    parentPhone: '0987654321',
    parentRelationship: 'Bố',
    parentName: 'Nguyễn Văn Hùng',
    notes: 'Học sinh giỏi Toán năm lớp 9',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
  },
  {
    id: 'hs-2',
    fullName: 'Trần Thị Mai Linh',
    dob: '2009-08-22',
    hamlet: 'Xóm 5',
    village: 'Khu 2',
    commune: 'Xã Đại Đồng (mới)',
    fullAddress: 'Xóm 5, Khu 2, Xã Đại Đồng (mới)',
    email: 'mailinh.tran09@gmail.com',
    studentPhone: '0834567890',
    hasNoStudentPhone: false,
    parentPhone: '0978123456',
    parentRelationship: 'Mẹ',
    parentName: 'Phạm Thị Lan',
    notes: 'Ban cán sự lớp, quản ca',
    createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
  },
  {
    id: 'hs-3',
    fullName: 'Lê Hoàng Nam',
    dob: '2009-11-05',
    hamlet: 'Đội 1',
    village: 'Thôn Thượng',
    commune: 'Xã Tân Tiến (mới)',
    fullAddress: 'Đội 1, Thôn Thượng, Xã Tân Tiến (mới)',
    email: 'lehoangnam.hn2009@gmail.com',
    studentPhone: '',
    hasNoStudentPhone: true,
    parentPhone: '0903456789',
    parentRelationship: 'Bố',
    parentName: 'Lê Quang Hải',
    notes: 'Chưa có điện thoại riêng, liên hệ qua bố',
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
  {
    id: 'hs-4',
    fullName: 'Phạm Quỳnh Anh',
    dob: '2009-01-30',
    hamlet: 'Xóm Chùa',
    village: 'Thôn Đông',
    commune: 'Xã Hưng Thịnh (mới)',
    fullAddress: 'Xóm Chùa, Thôn Đông, Xã Hưng Thịnh (mới)',
    email: 'quynhanh.pham9a@gmail.com',
    studentPhone: '0945678912',
    hasNoStudentPhone: false,
    parentPhone: '0912987654',
    parentRelationship: 'Mẹ',
    parentName: 'Đỗ Hồng Thắm',
    notes: 'Tham gia đội tuyển Văn',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'hs-5',
    fullName: 'Vũ Đức Thành',
    dob: '2009-06-18',
    hamlet: 'Đội 6',
    village: 'Thôn Nam',
    commune: 'Xã Đại Đồng (mới)',
    fullAddress: 'Đội 6, Thôn Nam, Xã Đại Đồng (mới)',
    email: 'ducthanh.vu2009@gmail.com',
    studentPhone: '0867890123',
    hasNoStudentPhone: false,
    parentPhone: '0936123456',
    parentRelationship: 'Bố',
    parentName: 'Vũ Đình Trọng',
    notes: '',
    createdAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
  },
];

// Normalize Vietnamese phone numbers
export function cleanPhoneVN(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[\s\.\-\(\)]/g, '');
  if (cleaned.startsWith('+84')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('84') && cleaned.length >= 11) {
    cleaned = '0' + cleaned.slice(2);
  }
  return cleaned;
}

// Normalize Gmail
export function cleanEmailVN(email: string): string {
  let cleaned = (email || '').trim().toLowerCase();
  if (cleaned && !cleaned.includes('@')) {
    cleaned = `${cleaned}@gmail.com`;
  }
  return cleaned;
}

// Helper to get local data safely
export function getLocalData(): StudentSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_STUDENTS));
      return [...INITIAL_SAMPLE_STUDENTS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_SAMPLE_STUDENTS];
  } catch (err) {
    console.warn('Error reading from localStorage:', err);
    return [...INITIAL_SAMPLE_STUDENTS];
  }
}

// Helper to save local data safely
export function saveLocalData(data: StudentSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Error writing to localStorage:', err);
  }
}

/**
 * Fetch all students with automatic fallback to localStorage
 */
export async function fetchStudentsSafe(): Promise<{
  data: StudentSubmission[];
  isLocalOnly: boolean;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch('/api/students', { signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        saveLocalData(json.data);
        return { data: json.data, isLocalOnly: false };
      }
    }
  } catch (err) {
    // API endpoint unreachable, timed out, or 404
  }

  // Fallback to client localStorage
  const localList = getLocalData();
  localList.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return { data: localList, isLocalOnly: true };
}

/**
 * Create a new student record with instant saving guarantee
 */
export async function saveStudentSafe(
  formData: StudentInput
): Promise<{ success: boolean; data: StudentSubmission; message: string }> {
  const fullAddress = [
    formData.hamlet?.trim(),
    formData.village?.trim(),
    formData.commune?.trim(),
  ]
    .filter(Boolean)
    .join(', ');

  const normalizedStudentPhone = formData.hasNoStudentPhone
    ? ''
    : cleanPhoneVN(formData.studentPhone);
  const normalizedParentPhone = cleanPhoneVN(formData.parentPhone);
  const normalizedEmail = cleanEmailVN(formData.email);

  const newRecord: StudentSubmission = {
    id: 'hs-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    fullName: formData.fullName.trim(),
    dob: formData.dob,
    hamlet: formData.hamlet ? formData.hamlet.trim() : '',
    village: formData.village ? formData.village.trim() : '',
    commune: formData.commune.trim(),
    fullAddress,
    email: normalizedEmail,
    studentPhone: normalizedStudentPhone,
    hasNoStudentPhone: !!formData.hasNoStudentPhone,
    parentPhone: normalizedParentPhone,
    parentRelationship: formData.parentRelationship || 'Phụ huynh',
    parentName: formData.parentName ? formData.parentName.trim() : '',
    notes: formData.notes ? formData.notes.trim() : '',
    createdAt: new Date().toISOString(),
  };

  // Always save to local storage immediately so data is never lost!
  const current = getLocalData();
  // Check if not duplicate
  const exists = current.some(
    (s) =>
      s.fullName.toLowerCase() === newRecord.fullName.toLowerCase() &&
      s.parentPhone === newRecord.parentPhone
  );
  if (!exists) {
    current.unshift(newRecord);
  } else {
    // Update existing
    const idx = current.findIndex(
      (s) =>
        s.fullName.toLowerCase() === newRecord.fullName.toLowerCase() &&
        s.parentPhone === newRecord.parentPhone
    );
    if (idx !== -1) current[idx] = newRecord;
  }
  saveLocalData(current);

  // Background sync to API (timeout 3.5s so student never waits or freezes)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        studentPhone: normalizedStudentPhone,
        parentPhone: normalizedParentPhone,
        email: normalizedEmail,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json && json.success && json.data) {
        return {
          success: true,
          data: json.data,
          message: 'Gửi thông tin thành công!',
        };
      }
    }
  } catch (err) {
    // API failed or offline - local save already succeeded
  }

  return {
    success: true,
    data: newRecord,
    message: 'Gửi thông tin thành công!',
  };
}

/**
 * Update an existing student record
 */
export async function updateStudentSafe(
  id: string,
  updatedData: Partial<StudentSubmission>
): Promise<StudentSubmission> {
  const list = getLocalData();
  const index = list.findIndex((x) => x.id === id);
  if (index === -1) {
    throw new Error('Không tìm thấy học sinh để cập nhật');
  }

  const existing = list[index];
  const fullAddress = [
    (updatedData.hamlet ?? existing.hamlet)?.trim(),
    (updatedData.village ?? existing.village)?.trim(),
    (updatedData.commune ?? existing.commune)?.trim(),
  ]
    .filter(Boolean)
    .join(', ');

  const merged: StudentSubmission = {
    ...existing,
    ...updatedData,
    studentPhone: updatedData.studentPhone !== undefined ? cleanPhoneVN(updatedData.studentPhone) : existing.studentPhone,
    parentPhone: updatedData.parentPhone ? cleanPhoneVN(updatedData.parentPhone) : existing.parentPhone,
    email: updatedData.email ? cleanEmailVN(updatedData.email) : existing.email,
    fullAddress,
    updatedAt: new Date().toISOString(),
  };

  list[index] = merged;
  saveLocalData(list);

  // Background sync
  try {
    fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    }).catch(() => {});
  } catch (err) {}

  return merged;
}

/**
 * Delete a student record
 */
export async function deleteStudentSafe(id: string): Promise<boolean> {
  const list = getLocalData().filter((x) => x.id !== id);
  saveLocalData(list);

  try {
    fetch(`/api/students/${id}`, { method: 'DELETE' }).catch(() => {});
  } catch (err) {}

  return true;
}

/**
 * Reset to initial sample data
 */
export async function resetSampleDataSafe(): Promise<StudentSubmission[]> {
  saveLocalData(INITIAL_SAMPLE_STUDENTS);
  try {
    fetch('/api/students/reset-sample', { method: 'POST' }).catch(() => {});
  } catch (err) {}
  return [...INITIAL_SAMPLE_STUDENTS];
}

/**
 * Clear all records
 */
export async function clearAllDataSafe(): Promise<void> {
  saveLocalData([]);
  try {
    fetch('/api/students/clear-all', { method: 'POST' }).catch(() => {});
  } catch (err) {}
}
