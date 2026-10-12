import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'students.json');

app.use(express.json());

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const initialSeedData = [
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

function readData(): any[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeedData, null, 2), 'utf-8');
      return initialSeedData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading students data:', err);
    return [];
  }
}

function writeData(data: any[]): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing students data:', err);
    return false;
  }
}

// In-memory initialize
readData();

// API Endpoints
app.get('/api/students', (req, res) => {
  const data = readData();
  // Sort descending by createdAt
  data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({
    success: true,
    data,
    total: data.length,
    teacher: 'ldman87@gmail.com',
  });
});

app.post('/api/students', (req, res) => {
  try {
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
    } = req.body;

    // Basic validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập họ và tên học sinh' });
    }
    if (!dob) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn ngày tháng năm sinh' });
    }
    if (!commune || !commune.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập Xã (mới)' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập địa chỉ Gmail cá nhân' });
    }
    if (!parentPhone || !parentPhone.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập số điện thoại Phụ huynh' });
    }

    const fullAddress = [hamlet?.trim(), village?.trim(), commune?.trim()]
      .filter(Boolean)
      .join(', ');

    const newRecord = {
      id: 'hs-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      fullName: fullName.trim(),
      dob,
      hamlet: hamlet ? hamlet.trim() : '',
      village: village ? village.trim() : '',
      commune: commune.trim(),
      fullAddress,
      email: email.trim().toLowerCase(),
      studentPhone: hasNoStudentPhone ? '' : (studentPhone ? studentPhone.trim() : ''),
      hasNoStudentPhone: !!hasNoStudentPhone,
      parentPhone: parentPhone.trim(),
      parentRelationship: parentRelationship || 'Phụ huynh',
      parentName: parentName ? parentName.trim() : '',
      notes: notes ? notes.trim() : '',
      createdAt: new Date().toISOString(),
    };

    const currentList = readData();
    currentList.unshift(newRecord);
    writeData(currentList);

    return res.status(201).json({
      success: true,
      message: 'Gửi thông tin thành công!',
      data: newRecord,
    });
  } catch (error: any) {
    console.error('Save student error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lưu dữ liệu' });
  }
});

app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const currentList = readData();
  const index = currentList.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ học sinh' });
  }

  const existing = currentList[index];
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
  } = req.body;

  const fullAddress = [hamlet?.trim(), village?.trim(), commune?.trim()]
    .filter(Boolean)
    .join(', ');

  const updated = {
    ...existing,
    fullName: fullName ? fullName.trim() : existing.fullName,
    dob: dob || existing.dob,
    hamlet: hamlet !== undefined ? hamlet.trim() : existing.hamlet,
    village: village !== undefined ? village.trim() : existing.village,
    commune: commune ? commune.trim() : existing.commune,
    fullAddress,
    email: email ? email.trim().toLowerCase() : existing.email,
    studentPhone: hasNoStudentPhone ? '' : (studentPhone !== undefined ? studentPhone.trim() : existing.studentPhone),
    hasNoStudentPhone: hasNoStudentPhone !== undefined ? hasNoStudentPhone : existing.hasNoStudentPhone,
    parentPhone: parentPhone ? parentPhone.trim() : existing.parentPhone,
    parentRelationship: parentRelationship || existing.parentRelationship,
    parentName: parentName !== undefined ? parentName.trim() : existing.parentName,
    notes: notes !== undefined ? notes.trim() : existing.notes,
    updatedAt: new Date().toISOString(),
  };

  currentList[index] = updated;
  writeData(currentList);

  return res.json({ success: true, data: updated, message: 'Cập nhật thành công!' });
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const currentList = readData();
  const filtered = currentList.filter((item) => item.id !== id);

  if (filtered.length === currentList.length) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ để xóa' });
  }

  writeData(filtered);
  return res.json({ success: true, message: 'Đã xóa hồ sơ thành công' });
});

app.post('/api/students/reset-sample', (req, res) => {
  writeData(initialSeedData);
  res.json({ success: true, message: 'Đã khôi phục dữ liệu mẫu ban đầu' });
});

app.post('/api/students/clear-all', (req, res) => {
  writeData([]);
  res.json({ success: true, message: 'Đã dọn sạch toàn bộ danh sách' });
});

// Stats summary endpoint
app.get('/api/stats', (req, res) => {
  const data = readData();
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = data.filter((item) => item.createdAt?.startsWith(today)).length;
  const withStudentPhoneCount = data.filter((item) => !item.hasNoStudentPhone && !!item.studentPhone).length;
  const uniqueCommunes = new Set(data.map((item) => item.commune).filter(Boolean));

  res.json({
    success: true,
    data: {
      total: data.length,
      todayCount,
      withStudentPhoneCount,
      uniqueCommunesCount: uniqueCommunes.size,
      lastUpdated: data.length > 0 ? data[0].createdAt : null,
    },
  });
});

// Configure Vite or Static
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express] App running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
