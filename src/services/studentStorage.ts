import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { StudentInput, StudentSubmission } from '../types';

const STORAGE_KEY = 'lop_chunhiem_students_data_v1';
const COLLECTION_NAME = 'students';

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

// Local cache
export function getLocalData(): StudentSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function saveLocalData(data: StudentSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }
}

/**
 * Fetch all students from Cloud Firestore with fallback to local cache
 */
export async function fetchStudentsSafe(): Promise<{
  data: StudentSubmission[];
  isCloudConnected: boolean;
}> {
  try {
    const studentsCol = collection(db, COLLECTION_NAME);
    const snap = await getDocs(studentsCol);

    const list: StudentSubmission[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data() as StudentSubmission;
      list.push({ ...d, id: docSnap.id });
    });

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Update local cache
    saveLocalData(list);
    return { data: list, isCloudConnected: true };
  } catch (err) {
    console.warn('Firestore fetch failed, using local cache:', err);
    const local = getLocalData();
    return { data: local.length > 0 ? local : INITIAL_SAMPLE_STUDENTS, isCloudConnected: false };
  }
}

/**
 * Real-time listener for Firestore changes
 */
export function subscribeStudentsRealtime(
  callback: (students: StudentSubmission[], isCloud: boolean) => void
): () => void {
  try {
    const studentsCol = collection(db, COLLECTION_NAME);
    const unsubscribe = onSnapshot(
      studentsCol,
      (snapshot) => {
        const list: StudentSubmission[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data() as StudentSubmission;
          list.push({ ...d, id: docSnap.id });
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        saveLocalData(list);
        callback(list, true);
      },
      (error) => {
        console.warn('Real-time snapshot error:', error);
        callback(getLocalData(), false);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach realtime snapshot:', err);
    callback(getLocalData(), false);
    return () => {};
  }
}

/**
 * Create a new student record directly in Cloud Firestore
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

  const studentId = 'hs-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

  const newRecord: StudentSubmission = {
    id: studentId,
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

  // 1. Save to Cloud Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, studentId);
    await setDoc(docRef, newRecord);
  } catch (err) {
    console.error('Error saving directly to Firestore, saving to local cache:', err);
  }

  // 2. Also save to local cache
  const local = getLocalData();
  local.unshift(newRecord);
  saveLocalData(local);

  return {
    success: true,
    data: newRecord,
    message: 'Gửi thông tin thành công!',
  };
}

/**
 * Update a student record in Cloud Firestore
 */
export async function updateStudentSafe(
  id: string,
  updatedData: Partial<StudentSubmission>
): Promise<StudentSubmission> {
  const fullAddress = [
    updatedData.hamlet?.trim(),
    updatedData.village?.trim(),
    updatedData.commune?.trim(),
  ]
    .filter(Boolean)
    .join(', ');

  const merged = {
    ...updatedData,
    ...(fullAddress ? { fullAddress } : {}),
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, merged);
  } catch (err) {
    console.warn('Error updating in Firestore:', err);
  }

  const local = getLocalData();
  const idx = local.findIndex((x) => x.id === id);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...merged };
    saveLocalData(local);
  }

  return { ...local[idx], ...merged } as StudentSubmission;
}

/**
 * Delete a student record from Cloud Firestore
 */
export async function deleteStudentSafe(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Error deleting from Firestore:', err);
  }

  const local = getLocalData().filter((x) => x.id !== id);
  saveLocalData(local);
  return true;
}

/**
 * Seed initial sample students to Cloud Firestore
 */
export async function resetSampleDataSafe(): Promise<StudentSubmission[]> {
  try {
    for (const student of INITIAL_SAMPLE_STUDENTS) {
      await setDoc(doc(db, COLLECTION_NAME, student.id), student);
    }
  } catch (err) {
    console.warn('Error seeding sample data to Firestore:', err);
  }
  saveLocalData(INITIAL_SAMPLE_STUDENTS);
  return [...INITIAL_SAMPLE_STUDENTS];
}

/**
 * Clear all records from Cloud Firestore (Start fresh class)
 */
export async function clearAllDataSafe(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    for (const docSnap of snap.docs) {
      await deleteDoc(doc(db, COLLECTION_NAME, docSnap.id));
    }
  } catch (err) {
    console.warn('Error clearing Firestore collection:', err);
  }
  saveLocalData([]);
}
