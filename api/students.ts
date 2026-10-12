const seedData = [
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

let memoryStudents = [...seedData];

export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: memoryStudents,
      total: memoryStudents.length,
      teacher: 'ldman87@gmail.com',
    });
  }

  if (req.method === 'POST') {
    const {
      fullName,
      dob,
      hamlet,
      village,
      commune,
      email,
      studentPhone,
      hasNoStudentPhone,
      parentPhone,
      parentRelationship,
      parentName,
      notes,
    } = req.body || {};

    const fullAddress = [hamlet?.trim(), village?.trim(), commune?.trim()]
      .filter(Boolean)
      .join(', ');

    const newRecord = {
      id: 'hs-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      fullName: (fullName || '').trim(),
      dob,
      hamlet: hamlet ? hamlet.trim() : '',
      village: village ? village.trim() : '',
      commune: (commune || '').trim(),
      fullAddress,
      email: (email || '').trim().toLowerCase(),
      studentPhone: hasNoStudentPhone ? '' : (studentPhone ? studentPhone.trim() : ''),
      hasNoStudentPhone: !!hasNoStudentPhone,
      parentPhone: (parentPhone || '').trim(),
      parentRelationship: parentRelationship || 'Phụ huynh',
      parentName: parentName ? parentName.trim() : '',
      notes: notes ? notes.trim() : '',
      createdAt: new Date().toISOString(),
    };

    memoryStudents.unshift(newRecord);
    return res.status(201).json({
      success: true,
      data: newRecord,
      message: 'Gửi thông tin thành công!',
    });
  }

  return res.status(200).json({ success: true, data: memoryStudents });
}
