export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    success: true,
    data: {
      total: 5,
      todayCount: 1,
      withStudentPhoneCount: 4,
      uniqueCommunesCount: 3,
      lastUpdated: new Date().toISOString(),
    },
  });
}
