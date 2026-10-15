export interface StudentSubmission {
  id: string;
  fullName: string;
  dob: string; // YYYY-MM-DD
  hamlet: string; // Đội / Xóm
  village: string; // Thôn / Khu
  commune: string; // Xã (mới)
  fullAddress: string;
  aspiration: string; // 'Đại học' | 'Tốt nghiệp'
  email?: string;
  studentPhone: string;
  hasNoStudentPhone?: boolean;
  parentPhone: string;
  parentRelationship?: string;
  parentName?: string;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt?: string;
}

export interface StudentInput {
  fullName: string;
  dob: string;
  hamlet: string;
  village: string;
  commune: string;
  aspiration: string; // 'Đại học' | 'Tốt nghiệp'
  studentPhone: string;
  hasNoStudentPhone: boolean;
  parentPhone: string;
  parentRelationship: string;
  parentName?: string;
  notes?: string;
}

export interface StatsResponse {
  total: number;
  todayCount: number;
  withStudentPhoneCount: number;
  uniqueCommunesCount: number;
  lastUpdated: string | null;
}
