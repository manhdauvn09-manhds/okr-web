import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Objective, ObjectiveType, User } from './types';

interface CreateObjectiveInput {
  title: string;
  description: string;
  quarter: string;
  type: ObjectiveType;
}

interface AddKrInput {
  title: string;
  startValue: number;
  targetValue: number;
  deadline: string;
}

interface UpdateKrProgressInput {
  progress: number;
}

@Injectable()
export class DataStoreService {
  private readonly users: User[] = [
    { id: 1, name: 'Nguyễn Minh Anh',  role: 'MANAGER',  email: 'AnhNM@fpt.com',  password: 'AnhNM@LoveAI'  },
    { id: 2, name: 'Trần Gia Bảo',     role: 'EMPLOYEE', email: 'BaoTG@fpt.com',  password: 'BaoTG@LoveAI', managerId: 1  },
    { id: 3, name: 'Lê Thu Hà',        role: 'EMPLOYEE', email: 'HaLT@fpt.com',   password: 'HaLT@LoveAI', managerId: 1   },
    { id: 4, name: 'Phạm Quốc Huy',    role: 'MANAGER',  email: 'HuyPQ@fpt.com',  password: 'HuyPQ@LoveAI'  },
    { id: 5, name: 'Võ Khánh Linh',    role: 'EMPLOYEE', email: 'LinhVK@fpt.com', password: 'LinhVK@LoveAI', managerId: 1 },
    { id: 6, name: 'Đoàn Tiến Đạt',   role: 'EMPLOYEE', email: 'DatDT@fpt.com',  password: 'DatDT@LoveAI', managerId: 1  },
    { id: 7, name: 'Bùi Ngọc Mai',     role: 'EMPLOYEE', email: 'MaiBN@fpt.com',  password: 'MaiBN@LoveAI', managerId: 4  },
    { id: 8, name: 'Hoàng Gia Kiệt',   role: 'EMPLOYEE', email: 'KietHG@fpt.com', password: 'KietHG@LoveAI', managerId: 9 },
    { id: 9, name: 'Đậu Sỹ Mạnh',     role: 'MANAGER',  email: 'ManhDS@fpt.com', password: 'ManhDS@LoveAI' },
    // ── New 30 employees ──
    { id: 10, name: 'Nguyễn Hữu Tùng',  role: 'EMPLOYEE', email: 'TungNH@fpt.com',  password: 'TungNH@LoveAI', managerId: 1 },
    { id: 11, name: 'Trần Thị Lan',      role: 'EMPLOYEE', email: 'LanTT@fpt.com',   password: 'LanTT@LoveAI', managerId: 1 },
    { id: 12, name: 'Lê Minh Phúc',      role: 'EMPLOYEE', email: 'PhucLM@fpt.com',  password: 'PhucLM@LoveAI', managerId: 1 },
    { id: 13, name: 'Phạm Ngọc Diệp',   role: 'EMPLOYEE', email: 'DiepPN@fpt.com',  password: 'DiepPN@LoveAI', managerId: 1 },
    { id: 14, name: 'Hoàng Văn Sơn',     role: 'EMPLOYEE', email: 'SonHV@fpt.com',   password: 'SonHV@LoveAI', managerId: 1 },
    { id: 15, name: 'Vũ Thái Hòa',       role: 'EMPLOYEE', email: 'HoaVT@fpt.com',   password: 'HoaVT@LoveAI', managerId: 1 },
    { id: 16, name: 'Đặng Quỳnh Anh',    role: 'EMPLOYEE', email: 'AnhDQ@fpt.com',   password: 'AnhDQ@LoveAI', managerId: 1 },
    { id: 17, name: 'Bùi Đức Trung',     role: 'EMPLOYEE', email: 'TrungBD@fpt.com', password: 'TrungBD@LoveAI', managerId: 1 },
    { id: 18, name: 'Ngô Thanh Tâm',     role: 'EMPLOYEE', email: 'TamNT@fpt.com',   password: 'TamNT@LoveAI', managerId: 1 },
    { id: 19, name: 'Dương Minh Khôi',   role: 'EMPLOYEE', email: 'KhoiDM@fpt.com',  password: 'KhoiDM@LoveAI', managerId: 1 },
    { id: 20, name: 'Tô Hải Yến',        role: 'EMPLOYEE', email: 'YenTH@fpt.com',   password: 'YenTH@LoveAI', managerId: 4 },
    { id: 21, name: 'Lý Quốc Bảo',       role: 'EMPLOYEE', email: 'BaoLQ@fpt.com',   password: 'BaoLQ@LoveAI', managerId: 4 },
    { id: 22, name: 'Hồ Thị Mỹ Linh',   role: 'EMPLOYEE', email: 'LinhHTM@fpt.com', password: 'LinhHTM@LoveAI', managerId: 4 },
    { id: 23, name: 'Phan Anh Tuấn',     role: 'EMPLOYEE', email: 'TuanPA@fpt.com',  password: 'TuanPA@LoveAI', managerId: 4 },
    { id: 24, name: 'Mai Xuân Đức',       role: 'EMPLOYEE', email: 'DucMX@fpt.com',   password: 'DucMX@LoveAI', managerId: 4 },
    { id: 25, name: 'Cao Thị Hương',      role: 'EMPLOYEE', email: 'HuongCT@fpt.com', password: 'HuongCT@LoveAI', managerId: 4 },
    { id: 26, name: 'Trịnh Văn Nam',     role: 'EMPLOYEE', email: 'NamTV@fpt.com',   password: 'NamTV@LoveAI', managerId: 4 },
    { id: 27, name: 'Lương Thị Nga',     role: 'EMPLOYEE', email: 'NgaLT@fpt.com',   password: 'NgaLT@LoveAI', managerId: 4 },
    { id: 28, name: 'Đinh Công Vinh',    role: 'EMPLOYEE', email: 'VinhDC@fpt.com',  password: 'VinhDC@LoveAI', managerId: 9 },
    { id: 29, name: 'Chu Thị Thu Hà',    role: 'EMPLOYEE', email: 'HaCTT@fpt.com',   password: 'HaCTT@LoveAI', managerId: 9 },
    { id: 30, name: 'Đỗ Hoàng Long',     role: 'EMPLOYEE', email: 'LongDH@fpt.com',  password: 'LongDH@LoveAI', managerId: 9 },
    { id: 31, name: 'Nguyễn Thị Thanh',  role: 'EMPLOYEE', email: 'ThanhNT@fpt.com', password: 'ThanhNT@LoveAI', managerId: 9 },
    { id: 32, name: 'Trần Đình Phong',   role: 'EMPLOYEE', email: 'PhongTD@fpt.com', password: 'PhongTD@LoveAI', managerId: 9 },
    { id: 33, name: 'Lê Thị Bích Ngọc', role: 'EMPLOYEE', email: 'NgocLTB@fpt.com', password: 'NgocLTB@LoveAI', managerId: 9 },
    { id: 34, name: 'Phạm Tiến Dũng',   role: 'EMPLOYEE', email: 'DungPT@fpt.com',  password: 'DungPT@LoveAI', managerId: 9 },
    { id: 35, name: 'Hoàng Minh Châu',   role: 'EMPLOYEE', email: 'ChauHM@fpt.com',  password: 'ChauHM@LoveAI', managerId: 9 },
    { id: 36, name: 'Vũ Đình Khoa',      role: 'EMPLOYEE', email: 'KhoaVD@fpt.com',  password: 'KhoaVD@LoveAI', managerId: 9 },
    { id: 37, name: 'Đặng Thị Kim Chi',  role: 'EMPLOYEE', email: 'ChiDTK@fpt.com',  password: 'ChiDTK@LoveAI', managerId: 9 },
    { id: 38, name: 'Bùi Xuân Trường',   role: 'EMPLOYEE', email: 'TruongBX@fpt.com',password: 'TruongBX@LoveAI', managerId: 9 },
    { id: 39, name: 'Ngô Văn Hiếu',      role: 'EMPLOYEE', email: 'HieuNV@fpt.com',  password: 'HieuNV@LoveAI', managerId: 9 },
  ];

  private objectives: Objective[] = [
    // ── 1. AnhNM Manager TEAM Submitted ──
    {
      id: 1, title: 'Nâng cao tiêu chuẩn chất lượng sản phẩm Q2/2026',
      description: 'Xây dựng văn hóa code quality và tự động hóa kiểm thử để giảm lỗi production.',
      ownerId: 1, ownerName: 'Nguyễn Minh Anh', ownerRoleAtCreation: 'MANAGER',
      quarter: 'Q2/2026', type: 'TEAM', isSubmitted: true, status: 'SUBMITTED',
      keyResults: [
        { id: 11, title: 'Tổ chức 4 buổi Tech Workshop về Code Review & Clean Code', progress: 75, selfReportPercent: 75, selfReportedAt: '2026-04-05', startValue: 0, targetValue: 4, deadline: '2026-06-20' },
        { id: 12, title: 'Giảm 30% tỷ lệ lỗi escaped lên môi trường production', progress: 50, selfReportPercent: 60, selfReportedAt: '2026-04-05', startValue: 0, targetValue: 30, deadline: '2026-06-30' },
        { id: 13, title: 'Đạt tỷ lệ pass regression test tự động 85%', progress: 62, selfReportPercent: 65, selfReportedAt: '2026-04-05', startValue: 0, targetValue: 85, deadline: '2026-06-30' },
      ],
    },
    // ── 2. BaoTG Employee PERSONAL Submitted graded 4★ ──
    {
      id: 2, title: 'Nâng cao năng lực kiến trúc Frontend React tại dự án FPT IS',
      description: 'Tập trung vào component reusability, performance optimization và React best practices.',
      ownerId: 2, ownerName: 'Trần Gia Bảo', ownerRoleAtCreation: 'EMPLOYEE',
      quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED',
      grade: { stars: 4, comment: 'Bảo đã có tiến bộ đáng kể. Lighthouse score cải thiện rõ rệt. Cần tập trung hơn vào accessibility trong Q3.', gradedAt: '2026-04-08', gradedBy: 1, graderName: 'Nguyễn Minh Anh' },
      keyResults: [
        { id: 21, title: 'Hoàn thiện và release 6 React UI Component tái sử dụng trong design system', progress: 80, selfReportPercent: 80, selfReportedAt: '2026-04-06', startValue: 0, targetValue: 6, deadline: '2026-06-15' },
        { id: 22, title: 'Nâng điểm Lighthouse Performance Score của ứng dụng lên 90+', progress: 65, selfReportPercent: 70, selfReportedAt: '2026-04-06', startValue: 0, targetValue: 90, deadline: '2026-06-28' },
        { id: 23, title: 'Refactor 8 component phức tạp sang Hooks pattern, giảm re-render', progress: 55, selfReportPercent: 55, selfReportedAt: '2026-04-06', startValue: 0, targetValue: 8, deadline: '2026-06-20' },
      ],
    },
    // ── 3. HaLT Employee PERSONAL Submitted graded 5★ ──
    {
      id: 3, title: 'Xây dựng hệ thống Observability & Alerting cho API Backend',
      description: 'Triển khai distributed tracing, metrics và alerting để phát hiện sự cố nhanh hơn.',
      ownerId: 3, ownerName: 'Lê Thu Hà', ownerRoleAtCreation: 'EMPLOYEE',
      quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED',
      grade: { stars: 5, comment: 'Xuất sắc! Hệ thống observability triển khai mẫu mực. Incident detection time giảm vượt mục tiêu. Đề xuất chia sẻ kinh nghiệm với team khác.', gradedAt: '2026-04-09', gradedBy: 1, graderName: 'Nguyễn Minh Anh' },
      keyResults: [
        { id: 31, title: 'Triển khai distributed tracing (OpenTelemetry) cho 100% critical endpoint', progress: 70, selfReportPercent: 72, selfReportedAt: '2026-04-07', startValue: 0, targetValue: 100, deadline: '2026-06-18' },
        { id: 32, title: 'Xây dựng 5 SLO dashboard trên Grafana cho team operations', progress: 60, selfReportPercent: 63, selfReportedAt: '2026-04-07', startValue: 0, targetValue: 5, deadline: '2026-06-25' },
        { id: 33, title: 'Giảm MTTR (Mean Time to Recover) sự cố xuống dưới 10 phút', progress: 45, selfReportPercent: 48, selfReportedAt: '2026-04-07', startValue: 30, targetValue: 10, deadline: '2026-06-30' },
      ],
    },
    // ── 4. HuyPQ Manager TEAM Submitted ──
    {
      id: 4, title: 'Mở rộng năng lực delivery cho roadmap Enterprise Q2',
      description: 'Cải thiện throughput team và đảm bảo on-time delivery các milestone dự án lớn.',
      ownerId: 4, ownerName: 'Phạm Quốc Huy', ownerRoleAtCreation: 'MANAGER',
      quarter: 'Q2/2026', type: 'TEAM', isSubmitted: true, status: 'SUBMITTED',
      keyResults: [
        { id: 41, title: 'Bàn giao đúng hạn 3 milestone Enterprise cho khách hàng', progress: 67, selfReportPercent: 70, selfReportedAt: '2026-04-04', startValue: 0, targetValue: 3, deadline: '2026-06-27' },
        { id: 42, title: 'Duy trì Sprint Commitment Reliability trên 90%', progress: 78, selfReportPercent: 80, selfReportedAt: '2026-04-04', startValue: 0, targetValue: 90, deadline: '2026-06-30' },
        { id: 43, title: 'Giảm 25% story point carryover sang sprint kế tiếp', progress: 52, selfReportPercent: 50, selfReportedAt: '2026-04-04', startValue: 0, targetValue: 25, deadline: '2026-06-30' },
      ],
    },
    // ── 5. LinhVK Employee PERSONAL Submitted – KR2 tự đánh giá >100% ──
    {
      id: 5, title: 'Cải thiện hành trình Onboarding cho khách hàng Enterprise mới',
      description: 'Rút ngắn time-to-value, tăng tỷ lệ activation trong tuần đầu sử dụng.',
      ownerId: 5, ownerName: 'Võ Khánh Linh', ownerRoleAtCreation: 'EMPLOYEE',
      quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED',
      keyResults: [
        { id: 51, title: 'Ra mắt guided onboarding checklist tích hợp trong sản phẩm', progress: 72, selfReportPercent: 75, selfReportedAt: '2026-04-06', startValue: 0, targetValue: 1, deadline: '2026-06-10' },
        { id: 52, title: 'Rút ngắn thời gian đạt first value từ 14 xuống 7 ngày', progress: 64, selfReportPercent: 115, selfReportedAt: '2026-04-06', startValue: 14, targetValue: 7, deadline: '2026-06-30' },
        { id: 53, title: 'Xuất bản 10 playbook onboarding theo từng vai trò người dùng', progress: 50, selfReportPercent: 52, selfReportedAt: '2026-04-06', startValue: 0, targetValue: 10, deadline: '2026-06-24' },
      ],
    },
    // ── 6. DatDT Employee PERSONAL Submitted – KR2 tự đánh giá 10% ──
    {
      id: 6, title: 'Tự động hóa kiểm thử release cho hệ thống API Backend FPT',
      description: 'Tăng coverage test tự động, giảm rủi ro rollback sau mỗi lần deploy.',
      ownerId: 6, ownerName: 'Đoàn Tiến Đạt', ownerRoleAtCreation: 'EMPLOYEE',
      quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED',
      keyResults: [
        { id: 61, title: 'Viết 25 test case kiểm thử contract API theo chuẩn Pact', progress: 76, selfReportPercent: 76, selfReportedAt: '2026-04-05', startValue: 0, targetValue: 25, deadline: '2026-06-19' },
        { id: 62, title: 'Tự động hóa smoke test cho 8 critical flow quan trọng nhất', progress: 58, selfReportPercent: 10, selfReportedAt: '2026-04-05', startValue: 0, targetValue: 8, deadline: '2026-06-22' },
        { id: 63, title: 'Giảm tỷ lệ rollback production xuống dưới 2%', progress: 45, selfReportPercent: 45, selfReportedAt: '2026-04-05', startValue: 10, targetValue: 2, deadline: '2026-06-30' },
      ],
    },
    // ── 7. MaiBN Employee PERSONAL Submitted ──
    {
      id: 7, title: 'Xây dựng nền tảng Data Analytics & Reporting cho hệ thống OKR',
      description: 'Đảm bảo dữ liệu OKR tin cậy, real-time và có thể audit được.',
      ownerId: 7, ownerName: 'Bùi Ngọc Mai', ownerRoleAtCreation: 'EMPLOYEE',
      quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED',
      keyResults: [
        { id: 71, title: 'Xuất bản OKR Adoption Dashboard cập nhật mỗi tuần', progress: 83, selfReportPercent: 85, selfReportedAt: '2026-04-07', startValue: 0, targetValue: 1, deadline: '2026-06-12' },
        { id: 72, title: 'Triển khai 6 bộ data quality check tự động trong ETL pipeline', progress: 69, selfReportPercent: 72, selfReportedAt: '2026-04-07', startValue: 0, targetValue: 6, deadline: '2026-06-26' },
        { id: 73, title: 'Duy trì độ trễ dữ liệu analytics dưới 2 giờ liên tục', progress: 61, selfReportPercent: 65, selfReportedAt: '2026-04-07', startValue: 24, targetValue: 2, deadline: '2026-06-30' },
      ],
    },
    // ── 8. KietHG Employee PERSONAL Submitted graded 3★ – KR1 tự đánh giá >100% ──
    {
      id: 8, title: 'Nâng cao hiệu quả hỗ trợ khách hàng và giảm ticket tồn đọng',
      description: 'Cải thiện SLA, tăng tỷ lệ tự giải quyết và giảm escalation.',
      ownerId: 8, ownerName: 'Hoàng Gia Kiệt', ownerRoleAtCreation: 'EMPLOYEE',
      quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED',
      grade: { stars: 3, comment: 'Tiến bộ nhưng chưa đều. Self-report KR1 cao hơn thực tế. Tập trung vào first-response SLA trong Q3.', gradedAt: '2026-04-09', gradedBy: 9, graderName: 'Đậu Sỹ Mạnh' },
      keyResults: [
        { id: 81, title: 'Phản hồi 95% ticket ưu tiên cao trong vòng 2 giờ làm việc', progress: 74, selfReportPercent: 118, selfReportedAt: '2026-04-06', startValue: 0, targetValue: 95, deadline: '2026-06-30' },
        { id: 82, title: 'Giảm 40% lượng ticket tồn đọng chưa xử lý quá 3 ngày', progress: 56, selfReportPercent: 57, selfReportedAt: '2026-04-06', startValue: 0, targetValue: 40, deadline: '2026-06-28' },
        { id: 83, title: 'Xuất bản 20 bài viết self-help trên Knowledge Base nội bộ', progress: 48, selfReportPercent: 48, selfReportedAt: '2026-04-06', startValue: 0, targetValue: 20, deadline: '2026-06-25' },
      ],
    },
    // ── 9. BaoTG Employee Draft Q3 ──
    {
      id: 9, title: 'Nghiên cứu ứng dụng AI Coaching vào quy trình OKR nội bộ FPT',
      description: 'Khám phá khả năng dùng AI để gợi ý cải thiện chất lượng KR và nhắc nhở tiến độ.',
      ownerId: 2, ownerName: 'Trần Gia Bảo', ownerRoleAtCreation: 'EMPLOYEE',
      quarter: 'Q3/2026', type: 'PERSONAL', isSubmitted: false, status: 'DRAFT',
      keyResults: [
        { id: 91, title: 'Thử nghiệm mô hình AI scoring trên 50 objective thực tế', progress: 20, startValue: 0, targetValue: 50, deadline: '2026-08-05' },
        { id: 92, title: 'Thu thập feedback từ 12 người dùng trong chương trình pilot', progress: 10, startValue: 0, targetValue: 12, deadline: '2026-08-15' },
        { id: 93, title: 'Xây dựng playbook can thiệp cho KR có chất lượng thấp', progress: 15, startValue: 0, targetValue: 1, deadline: '2026-08-20' },
      ],
    },
    // ── 10. HuyPQ Manager Draft Q3 ──
    {
      id: 10, title: 'Xây dựng hệ thống truyền thông Release tập trung cho FPT Software',
      description: 'Tạo single source of truth cho thông tin release, giảm miscommunication đa team.',
      ownerId: 4, ownerName: 'Phạm Quốc Huy', ownerRoleAtCreation: 'MANAGER',
      quarter: 'Q3/2026', type: 'TEAM', isSubmitted: false, status: 'DRAFT',
      keyResults: [
        { id: 101, title: 'Thiết kế Release Calendar tích hợp dependency timeline đa team', progress: 30, startValue: 0, targetValue: 1, deadline: '2026-08-08' },
        { id: 102, title: 'Tích hợp deployment metadata tự động từ 3 service CI/CD', progress: 18, startValue: 0, targetValue: 3, deadline: '2026-08-18' },
        { id: 103, title: 'Chạy thử dry-run communication với 2 đợt major release', progress: 12, startValue: 0, targetValue: 2, deadline: '2026-08-25' },
      ],
    },
    // ── 11. HuyPQ Manager PERSONAL Approved graded 5★ ──
    {
      id: 11, title: 'Nâng cao văn hóa 1-on-1 Coaching thường xuyên cho direct report',
      description: 'Tạo nhịp coaching đều đặn, giúp thành viên team phát triển năng lực cá nhân.',
      ownerId: 4, ownerName: 'Phạm Quốc Huy', ownerRoleAtCreation: 'MANAGER',
      quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'APPROVED',
      grade: { stars: 5, comment: 'Huy là hình mẫu về văn hóa coaching tại FPT. Kết quả 100% coaching session. Đề xuất chia sẻ framework này với các manager khác.', gradedAt: '2026-04-01', gradedBy: 9, graderName: 'Đậu Sỹ Mạnh' },
      keyResults: [
        { id: 111, title: 'Hoàn thành 24 buổi 1-on-1 coaching theo lịch 2 tuần/lần', progress: 100, selfReportPercent: 100, selfReportedAt: '2026-03-30', startValue: 0, targetValue: 24, deadline: '2026-06-30' },
        { id: 112, title: 'Đạt 85% hành động follow-through từ meeting notes', progress: 94, selfReportPercent: 94, selfReportedAt: '2026-03-30', startValue: 0, targetValue: 85, deadline: '2026-06-30' },
        { id: 113, title: 'Tăng điểm Team Engagement Pulse lên 12 điểm so với Q1', progress: 88, selfReportPercent: 90, selfReportedAt: '2026-03-30', startValue: 0, targetValue: 12, deadline: '2026-06-30' },
      ],
    },
    // ── 12. LinhVK Employee Draft Q3 ──
    {
      id: 12, title: 'Tối ưu hóa quy trình Customer Retention cho tài khoản Enterprise',
      description: 'Xây dựng playbook và cơ chế early warning để giảm churn rate.',
      ownerId: 5, ownerName: 'Võ Khánh Linh', ownerRoleAtCreation: 'EMPLOYEE',
      quarter: 'Q3/2026', type: 'PERSONAL', isSubmitted: false, status: 'DRAFT',
      keyResults: [
        { id: 121, title: 'Thiết lập early-warning system phát hiện risk churn từ 30 ngày trước', progress: 22, startValue: 0, targetValue: 1, deadline: '2026-08-12' },
        { id: 122, title: 'Pilot playbook retention với 8 tài khoản khách hàng chiến lược', progress: 16, startValue: 0, targetValue: 8, deadline: '2026-08-25' },
        { id: 123, title: 'Đạt tỷ lệ feature adoption trong tuần 2 lên 75%', progress: 14, startValue: 0, targetValue: 75, deadline: '2026-08-30' },
      ],
    },
    // ── 13. DatDT Employee Draft Q3 ──
    {
      id: 13, title: 'Tăng độ tin cậy CI/CD Pipeline cho toàn bộ dịch vụ Backend',
      description: 'Giảm flaky test, tăng tốc build và chuẩn hóa rollback tự động.',
      ownerId: 6, ownerName: 'Đoàn Tiến Đạt', ownerRoleAtCreation: 'EMPLOYEE',
      quarter: 'Q3/2026', type: 'PERSONAL', isSubmitted: false, status: 'DRAFT',
      keyResults: [
        { id: 131, title: 'Giảm tỷ lệ flaky CI test xuống dưới 3%', progress: 18, startValue: 12, targetValue: 3, deadline: '2026-08-20' },
        { id: 132, title: 'Rút ngắn thời gian build pipeline trung bình xuống 20%', progress: 25, startValue: 0, targetValue: 20, deadline: '2026-08-28' },
        { id: 133, title: 'Tự động hóa rollback verification cho 5 service quan trọng', progress: 20, startValue: 0, targetValue: 5, deadline: '2026-08-30' },
      ],
    },
    // ── 14. MaiBN Employee Draft Q3 ──
    {
      id: 14, title: 'Triển khai Data Governance framework cho OKR Reporting FPT',
      description: 'Đảm bảo tính toàn vẹn, ownership và audit trail cho toàn bộ dữ liệu báo cáo.',
      ownerId: 7, ownerName: 'Bùi Ngọc Mai', ownerRoleAtCreation: 'EMPLOYEE',
      quarter: 'Q3/2026', type: 'PERSONAL', isSubmitted: false, status: 'DRAFT',
      keyResults: [
        { id: 141, title: 'Định nghĩa data ownership map cho 15 metric OKR chủ chốt', progress: 27, startValue: 0, targetValue: 15, deadline: '2026-08-18' },
        { id: 142, title: 'Triển khai 10 automated schema check trong data pipeline', progress: 19, startValue: 0, targetValue: 10, deadline: '2026-08-24' },
        { id: 143, title: 'Xuất bản Data Trust Scorecard sau mỗi sprint', progress: 24, startValue: 0, targetValue: 1, deadline: '2026-08-30' },
      ],
    },
    // ── 15. KietHG Employee Draft Q3 ──
    {
      id: 15, title: 'Tăng tỷ lệ tự giải quyết vấn đề qua kênh Self-Service',
      description: 'Giảm tải support team bằng cách cải thiện tài liệu và in-product guidance.',
      ownerId: 8, ownerName: 'Hoàng Gia Kiệt', ownerRoleAtCreation: 'EMPLOYEE',
      quarter: 'Q3/2026', type: 'PERSONAL', isSubmitted: false, status: 'DRAFT',
      keyResults: [
        { id: 151, title: 'Xuất bản 15 guided troubleshooting flow cho các lỗi phổ biến', progress: 21, startValue: 0, targetValue: 15, deadline: '2026-08-15' },
        { id: 152, title: 'Tăng tỷ lệ self-solved ticket lên 35% tổng ticket', progress: 17, startValue: 0, targetValue: 35, deadline: '2026-08-28' },
        { id: 153, title: 'Giảm tỷ lệ ticket lặp lại (same issue) xuống 20%', progress: 14, startValue: 0, targetValue: 20, deadline: '2026-08-30' },
      ],
    },
    // ── 16. ManhDS Manager TEAM Submitted ──
    {
      id: 16, title: 'Xây dựng văn hóa kỹ thuật bền vững tại FPT Software Division',
      description: 'Thúc đẩy Engineer Excellence, open-source mindset và coding standard thống nhất.',
      ownerId: 9, ownerName: 'Đậu Sỹ Mạnh', ownerRoleAtCreation: 'MANAGER',
      quarter: 'Q2/2026', type: 'TEAM', isSubmitted: true, status: 'SUBMITTED',
      keyResults: [
        { id: 161, title: 'Tổ chức 3 buổi Tech Talk nội bộ chia sẻ công nghệ mới', progress: 67, selfReportPercent: 70, selfReportedAt: '2026-04-08', startValue: 0, targetValue: 3, deadline: '2026-06-25' },
        { id: 162, title: 'Đạt 80% engineer có ít nhất 1 open-source contribution trong Q2', progress: 45, selfReportPercent: 50, selfReportedAt: '2026-04-08', startValue: 0, targetValue: 80, deadline: '2026-06-30' },
        { id: 163, title: 'Hoàn thiện và publish 5 bộ Coding Standard được team đồng thuận', progress: 60, selfReportPercent: 62, selfReportedAt: '2026-04-08', startValue: 0, targetValue: 5, deadline: '2026-06-28' },
      ],
    },
    // ── 17. ManhDS Manager TEAM Submitted graded 4★ ──
    {
      id: 17, title: 'Tăng cường năng lực bảo mật thông tin cho các dự án trọng điểm FPT',
      description: 'Áp dụng OWASP, thực hiện security audit và giảm SAST findings severity cao.',
      ownerId: 9, ownerName: 'Đậu Sỹ Mạnh', ownerRoleAtCreation: 'MANAGER',
      quarter: 'Q2/2026', type: 'TEAM', isSubmitted: true, status: 'SUBMITTED',
      grade: { stars: 4, comment: 'Security training rất tốt, toàn team được nâng cao nhận thức. Cần đẩy nhanh SAST remediation trong tháng 5.', gradedAt: '2026-04-10', gradedBy: 1, graderName: 'Nguyễn Minh Anh' },
      keyResults: [
        { id: 171, title: 'Hoàn thành security audit toàn diện cho 5 dự án trọng điểm', progress: 80, selfReportPercent: 82, selfReportedAt: '2026-04-08', startValue: 0, targetValue: 5, deadline: '2026-06-20' },
        { id: 172, title: 'Tổ chức 2 buổi Security Training thực chiến OWASP Top 10 cho developer', progress: 100, selfReportPercent: 100, selfReportedAt: '2026-04-08', startValue: 0, targetValue: 2, deadline: '2026-06-10' },
        { id: 173, title: 'Giảm 50% SAST finding có mức độ severity High & Critical', progress: 72, selfReportPercent: 75, selfReportedAt: '2026-04-08', startValue: 0, targetValue: 50, deadline: '2026-06-30' },
      ],
    },
    // ═══════════════════════════════════════════════
    // NEW 30 MEMBERS – Submitted, no self-report yet
    // ═══════════════════════════════════════════════
    // ── Manager 1 (AnhNM id=1) team: ids 10-19 ──
    { id: 18, title: 'Phát triển module Authentication đa nền tảng', description: 'Xây dựng hệ thống SSO hỗ trợ OAuth2, SAML cho các ứng dụng nội bộ FPT.', ownerId: 10, ownerName: 'Nguyễn Hữu Tùng', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 201, title: 'Hoàn thiện flow OAuth2 cho 3 ứng dụng nội bộ', progress: 35, startValue: 0, targetValue: 3, deadline: '2026-06-20' },
      { id: 202, title: 'Viết tài liệu kỹ thuật cho SAML integration', progress: 20, startValue: 0, targetValue: 1, deadline: '2026-06-25' },
      { id: 203, title: 'Đạt 100% unit test coverage cho auth module', progress: 15, startValue: 0, targetValue: 100, deadline: '2026-06-30' },
    ] },
    { id: 19, title: 'Thiết kế hệ thống Notification Center realtime', description: 'Xây dựng notification hub hỗ trợ push, email và in-app cho toàn hệ thống.', ownerId: 11, ownerName: 'Trần Thị Lan', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 204, title: 'Triển khai WebSocket gateway cho real-time notification', progress: 40, startValue: 0, targetValue: 1, deadline: '2026-06-18' },
      { id: 205, title: 'Tích hợp email template engine cho 5 loại notification', progress: 25, startValue: 0, targetValue: 5, deadline: '2026-06-22' },
      { id: 206, title: 'Xây dựng notification preference UI cho user', progress: 10, startValue: 0, targetValue: 1, deadline: '2026-06-28' },
    ] },
    { id: 20, title: 'Tối ưu hiệu năng Database cho hệ thống báo cáo', description: 'Cải thiện query performance và indexing strategy cho các báo cáo lớn.', ownerId: 12, ownerName: 'Lê Minh Phúc', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 207, title: 'Giảm 60% thời gian query cho 10 báo cáo chậm nhất', progress: 30, startValue: 0, targetValue: 60, deadline: '2026-06-20' },
      { id: 208, title: 'Triển khai read replica cho reporting database', progress: 20, startValue: 0, targetValue: 1, deadline: '2026-06-25' },
      { id: 209, title: 'Viết stored procedure tối ưu cho 5 aggregate report', progress: 15, startValue: 0, targetValue: 5, deadline: '2026-06-30' },
    ] },
    { id: 21, title: 'Xây dựng Design System component library', description: 'Tạo thư viện UI component chuẩn hóa cho toàn bộ sản phẩm FPT Software.', ownerId: 13, ownerName: 'Phạm Ngọc Diệp', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 210, title: 'Publish 15 base component lên internal NPM registry', progress: 45, startValue: 0, targetValue: 15, deadline: '2026-06-15' },
      { id: 211, title: 'Viết Storybook documentation cho 100% component', progress: 30, startValue: 0, targetValue: 100, deadline: '2026-06-22' },
      { id: 212, title: 'Đạt 90% accessibility compliance (WCAG 2.1 AA)', progress: 20, startValue: 0, targetValue: 90, deadline: '2026-06-28' },
    ] },
    { id: 22, title: 'Triển khai CI/CD pipeline cho microservices', description: 'Tự động hóa build, test, deploy cho kiến trúc microservices mới.', ownerId: 14, ownerName: 'Hoàng Văn Sơn', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 213, title: 'Setup GitLab CI cho 8 microservice repositories', progress: 50, startValue: 0, targetValue: 8, deadline: '2026-06-18' },
      { id: 214, title: 'Triển khai automated canary deployment cho 3 service', progress: 25, startValue: 0, targetValue: 3, deadline: '2026-06-25' },
      { id: 215, title: 'Giảm deployment time trung bình xuống dưới 10 phút', progress: 35, startValue: 30, targetValue: 10, deadline: '2026-06-30' },
    ] },
    { id: 23, title: 'Nghiên cứu ứng dụng Machine Learning cho fraud detection', description: 'Xây dựng mô hình phát hiện gian lận giao dịch cho nền tảng fintech.', ownerId: 15, ownerName: 'Vũ Thái Hòa', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 216, title: 'Train và đánh giá 3 model ML trên tập dữ liệu lịch sử', progress: 40, startValue: 0, targetValue: 3, deadline: '2026-06-20' },
      { id: 217, title: 'Đạt precision 92% trên tập test cho mô hình tốt nhất', progress: 30, startValue: 0, targetValue: 92, deadline: '2026-06-25' },
      { id: 218, title: 'Deploy model lên staging và chạy shadow mode 2 tuần', progress: 10, startValue: 0, targetValue: 1, deadline: '2026-06-30' },
    ] },
    { id: 24, title: 'Cải thiện UX cho mobile app FPT Workspace', description: 'Redesign 5 flow chính trên mobile để tăng task completion rate.', ownerId: 16, ownerName: 'Đặng Quỳnh Anh', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 219, title: 'Hoàn thành UX audit và wireframe cho 5 flow chính', progress: 55, startValue: 0, targetValue: 5, deadline: '2026-06-15' },
      { id: 220, title: 'Tăng task completion rate từ 65% lên 85%', progress: 30, startValue: 65, targetValue: 85, deadline: '2026-06-25' },
      { id: 221, title: 'Giảm 40% lượng support ticket từ mobile user', progress: 20, startValue: 0, targetValue: 40, deadline: '2026-06-30' },
    ] },
    { id: 25, title: 'Xây dựng API Gateway cho hệ thống microservices', description: 'Thiết kế và triển khai API Gateway centralized với rate limiting và caching.', ownerId: 17, ownerName: 'Bùi Đức Trung', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 222, title: 'Triển khai Kong API Gateway cho 10 endpoint chính', progress: 45, startValue: 0, targetValue: 10, deadline: '2026-06-18' },
      { id: 223, title: 'Cấu hình rate limiting policy cho 100% public API', progress: 30, startValue: 0, targetValue: 100, deadline: '2026-06-24' },
      { id: 224, title: 'Giảm latency P99 xuống dưới 200ms qua caching strategy', progress: 20, startValue: 500, targetValue: 200, deadline: '2026-06-30' },
    ] },
    { id: 26, title: 'Tích hợp hệ thống Payment cho sản phẩm SaaS', description: 'Kết nối payment gateway và xây dựng billing module cho subscription model.', ownerId: 18, ownerName: 'Ngô Thanh Tâm', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 225, title: 'Tích hợp Stripe payment gateway cho 3 plan subscription', progress: 35, startValue: 0, targetValue: 3, deadline: '2026-06-20' },
      { id: 226, title: 'Xây dựng billing dashboard với invoice generation', progress: 25, startValue: 0, targetValue: 1, deadline: '2026-06-25' },
      { id: 227, title: 'Hoàn thiện webhook handler cho payment event processing', progress: 20, startValue: 0, targetValue: 1, deadline: '2026-06-28' },
    ] },
    { id: 27, title: 'Phát triển module Analytics Dashboard cho khách hàng', description: 'Xây dựng embedded analytics cho phép khách hàng tự tạo báo cáo tùy chỉnh.', ownerId: 19, ownerName: 'Dương Minh Khôi', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 228, title: 'Triển khai drag-drop chart builder với 8 chart type', progress: 40, startValue: 0, targetValue: 8, deadline: '2026-06-18' },
      { id: 229, title: 'Hỗ trợ export report sang PDF và Excel', progress: 30, startValue: 0, targetValue: 2, deadline: '2026-06-24' },
      { id: 230, title: 'Đạt thời gian render dashboard dưới 3 giây cho 100K rows', progress: 15, startValue: 10, targetValue: 3, deadline: '2026-06-30' },
    ] },
    // ── Manager 4 (HuyPQ id=4) team: ids 20-29 ──
    { id: 28, title: 'Thiết kế hệ thống Event-Driven Architecture', description: 'Chuyển đổi từ synchro sang async communication giữa các services.', ownerId: 20, ownerName: 'Tô Hải Yến', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 231, title: 'Triển khai Kafka cluster với 5 topic chính', progress: 50, startValue: 0, targetValue: 5, deadline: '2026-06-18' },
      { id: 232, title: 'Migrate 3 synchronous flow sang event-driven', progress: 30, startValue: 0, targetValue: 3, deadline: '2026-06-24' },
      { id: 233, title: 'Xây dựng dead letter queue và retry mechanism', progress: 20, startValue: 0, targetValue: 1, deadline: '2026-06-30' },
    ] },
    { id: 29, title: 'Xây dựng hệ thống Log Aggregation tập trung', description: 'Triển khai ELK stack cho centralized logging và troubleshooting nhanh.', ownerId: 21, ownerName: 'Lý Quốc Bảo', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 234, title: 'Deploy Elasticsearch cluster với 3 node', progress: 45, startValue: 0, targetValue: 3, deadline: '2026-06-15' },
      { id: 235, title: 'Cấu hình Logstash pipeline cho 12 service', progress: 30, startValue: 0, targetValue: 12, deadline: '2026-06-22' },
      { id: 236, title: 'Tạo 10 Kibana dashboard cho operations monitoring', progress: 20, startValue: 0, targetValue: 10, deadline: '2026-06-28' },
    ] },
    { id: 30, title: 'Tối ưu hóa Mobile App Performance', description: 'Giảm app size, cải thiện startup time và memory usage cho React Native app.', ownerId: 22, ownerName: 'Hồ Thị Mỹ Linh', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 237, title: 'Giảm app bundle size xuống dưới 15MB', progress: 35, startValue: 25, targetValue: 15, deadline: '2026-06-20' },
      { id: 238, title: 'Cải thiện cold start time xuống dưới 2 giây', progress: 25, startValue: 5, targetValue: 2, deadline: '2026-06-25' },
      { id: 239, title: 'Giảm 30% memory usage trên device thấp cấp', progress: 20, startValue: 0, targetValue: 30, deadline: '2026-06-30' },
    ] },
    { id: 31, title: 'Phát triển Chatbot AI cho hỗ trợ khách hàng', description: 'Xây dựng chatbot thông minh dựa trên LLM cho customer support.', ownerId: 23, ownerName: 'Phan Anh Tuấn', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 240, title: 'Train fine-tuned model trên 10,000 conversation history', progress: 45, startValue: 0, targetValue: 10000, deadline: '2026-06-18' },
      { id: 241, title: 'Đạt 80% accuracy trên intent classification', progress: 35, startValue: 0, targetValue: 80, deadline: '2026-06-24' },
      { id: 242, title: 'Giảm 25% ticket escalation qua chatbot resolution', progress: 15, startValue: 0, targetValue: 25, deadline: '2026-06-30' },
    ] },
    { id: 32, title: 'Xây dựng Infrastructure as Code cho cloud migration', description: 'Triển khai Terraform modules cho AWS infrastructure tiêu chuẩn.', ownerId: 24, ownerName: 'Mai Xuân Đức', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 243, title: 'Viết Terraform module cho 8 loại AWS resource', progress: 50, startValue: 0, targetValue: 8, deadline: '2026-06-15' },
      { id: 244, title: 'Migrate 5 service từ manual setup sang IaC', progress: 30, startValue: 0, targetValue: 5, deadline: '2026-06-22' },
      { id: 245, title: 'Triển khai GitOps workflow với Terraform Cloud', progress: 20, startValue: 0, targetValue: 1, deadline: '2026-06-28' },
    ] },
    { id: 33, title: 'Cải thiện quy trình Code Review và chất lượng code', description: 'Standardize code review process và tích hợp automated code quality checks.', ownerId: 25, ownerName: 'Cao Thị Hương', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 246, title: 'Viết Code Review Guideline chuẩn cho 4 ngôn ngữ', progress: 40, startValue: 0, targetValue: 4, deadline: '2026-06-18' },
      { id: 247, title: 'Tích hợp SonarQube quality gate vào CI pipeline', progress: 55, startValue: 0, targetValue: 1, deadline: '2026-06-22' },
      { id: 248, title: 'Đạt code coverage trung bình 80% cho toàn repository', progress: 30, startValue: 60, targetValue: 80, deadline: '2026-06-30' },
    ] },
    { id: 34, title: 'Phát triển hệ thống Feature Flag management', description: 'Cho phép toggle feature on/off mà không cần deploy lại.', ownerId: 26, ownerName: 'Trịnh Văn Nam', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 249, title: 'Xây dựng feature flag service với A/B testing support', progress: 40, startValue: 0, targetValue: 1, deadline: '2026-06-20' },
      { id: 250, title: 'Tích hợp SDK cho Frontend và Backend (JS, Java)', progress: 25, startValue: 0, targetValue: 2, deadline: '2026-06-25' },
      { id: 251, title: 'Migrate 10 hardcoded feature toggle sang hệ thống mới', progress: 15, startValue: 0, targetValue: 10, deadline: '2026-06-30' },
    ] },
    { id: 35, title: 'Xây dựng Data Pipeline cho Business Intelligence', description: 'Thiết kế ETL pipeline đưa dữ liệu từ production vào data warehouse.', ownerId: 27, ownerName: 'Lương Thị Nga', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 252, title: 'Xây dựng Airflow DAG cho 6 data source chính', progress: 45, startValue: 0, targetValue: 6, deadline: '2026-06-18' },
      { id: 253, title: 'Thiết kế star schema cho 3 business domain', progress: 35, startValue: 0, targetValue: 3, deadline: '2026-06-24' },
      { id: 254, title: 'Đạt data freshness dưới 1 giờ cho critical metrics', progress: 20, startValue: 24, targetValue: 1, deadline: '2026-06-30' },
    ] },
    // ── Manager 9 (ManhDS id=9) team: ids 28-39 ──
    { id: 36, title: 'Triển khai Container Orchestration với Kubernetes', description: 'Migrate ứng dụng từ Docker Compose sang Kubernetes cluster.', ownerId: 28, ownerName: 'Đinh Công Vinh', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 255, title: 'Setup K8s cluster với 3 worker node trên AWS EKS', progress: 50, startValue: 0, targetValue: 3, deadline: '2026-06-15' },
      { id: 256, title: 'Viết Helm chart cho 6 core services', progress: 35, startValue: 0, targetValue: 6, deadline: '2026-06-22' },
      { id: 257, title: 'Cấu hình HPA và resource limits cho toàn bộ pods', progress: 20, startValue: 0, targetValue: 1, deadline: '2026-06-28' },
    ] },
    { id: 37, title: 'Xây dựng hệ thống Monitoring và Alerting toàn diện', description: 'Triển khai Prometheus + Grafana cho full observability của infrastructure.', ownerId: 29, ownerName: 'Chu Thị Thu Hà', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 258, title: 'Deploy Prometheus và Grafana trên K8s cluster', progress: 55, startValue: 0, targetValue: 1, deadline: '2026-06-15' },
      { id: 259, title: 'Tạo 15 alert rule cho critical infrastructure metrics', progress: 35, startValue: 0, targetValue: 15, deadline: '2026-06-22' },
      { id: 260, title: 'Xây dựng on-call runbook cho top 10 incident type', progress: 25, startValue: 0, targetValue: 10, deadline: '2026-06-28' },
    ] },
    { id: 38, title: 'Phát triển Internal Developer Portal', description: 'Xây dựng Backstage-based portal cho developer productivity và service catalog.', ownerId: 30, ownerName: 'Đỗ Hoàng Long', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 261, title: 'Setup Backstage portal với service catalog cho 12 services', progress: 40, startValue: 0, targetValue: 12, deadline: '2026-06-18' },
      { id: 262, title: 'Tích hợp TechDocs documentation cho 100% APIs', progress: 25, startValue: 0, targetValue: 100, deadline: '2026-06-24' },
      { id: 263, title: 'Xây dựng 5 software template cho scaffolding dự án mới', progress: 20, startValue: 0, targetValue: 5, deadline: '2026-06-30' },
    ] },
    { id: 39, title: 'Tối ưu hóa Search Engine cho sản phẩm E-commerce', description: 'Cải thiện relevancy và performance của full-text search với Elasticsearch.', ownerId: 31, ownerName: 'Nguyễn Thị Thanh', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 264, title: 'Redesign search index với custom analyzer cho tiếng Việt', progress: 45, startValue: 0, targetValue: 1, deadline: '2026-06-18' },
      { id: 265, title: 'Triển khai autocomplete và fuzzy matching', progress: 35, startValue: 0, targetValue: 1, deadline: '2026-06-22' },
      { id: 266, title: 'Cải thiện search relevancy score lên 85% MRR@10', progress: 25, startValue: 60, targetValue: 85, deadline: '2026-06-28' },
    ] },
    { id: 40, title: 'Xây dựng Performance Testing Framework', description: 'Tạo framework load test chuẩn hóa cho toàn bộ API services.', ownerId: 32, ownerName: 'Trần Đình Phong', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 267, title: 'Viết k6 load test scenarios cho 15 critical APIs', progress: 40, startValue: 0, targetValue: 15, deadline: '2026-06-20' },
      { id: 268, title: 'Tích hợp performance test vào CI pipeline', progress: 25, startValue: 0, targetValue: 1, deadline: '2026-06-25' },
      { id: 269, title: 'Đạt throughput 1000 RPS cho payment API', progress: 15, startValue: 200, targetValue: 1000, deadline: '2026-06-30' },
    ] },
    { id: 41, title: 'Phát triển Document Management System', description: 'Xây dựng hệ thống quản lý tài liệu với version control và collaboration.', ownerId: 33, ownerName: 'Lê Thị Bích Ngọc', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 270, title: 'Xây dựng file upload service với S3 integration', progress: 50, startValue: 0, targetValue: 1, deadline: '2026-06-15' },
      { id: 271, title: 'Triển khai document versioning và diff viewer', progress: 30, startValue: 0, targetValue: 1, deadline: '2026-06-22' },
      { id: 272, title: 'Hỗ trợ real-time collaboration editing cho 5 file type', progress: 15, startValue: 0, targetValue: 5, deadline: '2026-06-30' },
    ] },
    { id: 42, title: 'Xây dựng hệ thống Backup và Disaster Recovery', description: 'Đảm bảo RTO/RPO cho toàn bộ critical database và storage.', ownerId: 34, ownerName: 'Phạm Tiến Dũng', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 273, title: 'Thiết lập automated backup cho 8 production database', progress: 55, startValue: 0, targetValue: 8, deadline: '2026-06-18' },
      { id: 274, title: 'Thực hiện Disaster Recovery drill thành công 2 lần', progress: 30, startValue: 0, targetValue: 2, deadline: '2026-06-24' },
      { id: 275, title: 'Đạt RPO dưới 15 phút và RTO dưới 1 giờ', progress: 20, startValue: 0, targetValue: 1, deadline: '2026-06-30' },
    ] },
    { id: 43, title: 'Phát triển Multi-tenant Architecture cho SaaS platform', description: 'Thiết kế data isolation và tenant management cho nền tảng SaaS.', ownerId: 35, ownerName: 'Hoàng Minh Châu', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 276, title: 'Thiết kế tenant isolation schema cho database layer', progress: 40, startValue: 0, targetValue: 1, deadline: '2026-06-18' },
      { id: 277, title: 'Xây dựng tenant provisioning API tự động', progress: 25, startValue: 0, targetValue: 1, deadline: '2026-06-24' },
      { id: 278, title: 'Triển khai tenant-aware caching layer', progress: 15, startValue: 0, targetValue: 1, deadline: '2026-06-30' },
    ] },
    { id: 44, title: 'Tối ưu hóa Email Delivery System', description: 'Cải thiện deliverability rate và giảm bounce rate cho transactional email.', ownerId: 36, ownerName: 'Vũ Đình Khoa', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 279, title: 'Cấu hình SPF, DKIM, DMARC cho 5 sending domain', progress: 60, startValue: 0, targetValue: 5, deadline: '2026-06-15' },
      { id: 280, title: 'Tăng email deliverability rate lên 98%', progress: 40, startValue: 85, targetValue: 98, deadline: '2026-06-24' },
      { id: 281, title: 'Xây dựng email analytics dashboard tracking', progress: 25, startValue: 0, targetValue: 1, deadline: '2026-06-30' },
    ] },
    { id: 45, title: 'Xây dựng Configuration Management centralized', description: 'Triển khai hệ thống quản lý config tập trung cho toàn bộ environments.', ownerId: 37, ownerName: 'Đặng Thị Kim Chi', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 282, title: 'Triển khai HashiCorp Vault cho secrets management', progress: 45, startValue: 0, targetValue: 1, deadline: '2026-06-18' },
      { id: 283, title: 'Migrate 100% hardcoded config sang centralized system', progress: 30, startValue: 0, targetValue: 100, deadline: '2026-06-25' },
      { id: 284, title: 'Xây dựng config audit trail và rollback mechanism', progress: 20, startValue: 0, targetValue: 1, deadline: '2026-06-30' },
    ] },
    { id: 46, title: 'Phát triển Integration Testing Automation', description: 'Xây dựng bộ integration test tự động cho các external service dependencies.', ownerId: 38, ownerName: 'Bùi Xuân Trường', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 285, title: 'Setup Testcontainers cho 6 external dependencies', progress: 50, startValue: 0, targetValue: 6, deadline: '2026-06-18' },
      { id: 286, title: 'Viết 30 integration test cases cho critical flows', progress: 35, startValue: 0, targetValue: 30, deadline: '2026-06-24' },
      { id: 287, title: 'Đạt 90% pass rate trên CI cho integration suite', progress: 20, startValue: 0, targetValue: 90, deadline: '2026-06-30' },
    ] },
    { id: 47, title: 'Xây dựng hệ thống Rate Limiting và DDoS Protection', description: 'Bảo vệ API endpoints khỏi abuse và tấn công từ chối dịch vụ.', ownerId: 39, ownerName: 'Ngô Văn Hiếu', ownerRoleAtCreation: 'EMPLOYEE', quarter: 'Q2/2026', type: 'PERSONAL', isSubmitted: true, status: 'SUBMITTED', keyResults: [
      { id: 288, title: 'Triển khai Redis-based rate limiter cho 100% public API', progress: 45, startValue: 0, targetValue: 100, deadline: '2026-06-18' },
      { id: 289, title: 'Cấu hình WAF rules cho top 10 attack vectors', progress: 30, startValue: 0, targetValue: 10, deadline: '2026-06-24' },
      { id: 290, title: 'Load test để đảm bảo xử lý 5000 RPS mà không downtime', progress: 15, startValue: 0, targetValue: 5000, deadline: '2026-06-30' },
    ] },
  ];

  private objectiveIdSeq = 500;
  private krIdSeq = 5000;

  // ══════════════════ METHODS ══════════════════

  getUsers(): Omit<User, 'password'>[] {
    return this.users.map(({ password: _pw, ...u }) => u);
  }

  getUser(userId: number): User {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  loginByEmail(email: string, password: string): Omit<User, 'password'> {
    const user = this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const { password: _pw, ...safeUser } = user;
    return safeUser;
  }

  createObjective(viewerId: number, input: CreateObjectiveInput): Objective {
    const viewer = this.getUser(viewerId);
    if (viewer.role === 'EMPLOYEE' && input.type !== 'PERSONAL') {
      throw new ForbiddenException('Employees can only create PERSONAL objectives');
    }
    const objective: Objective = {
      id: this.objectiveIdSeq++,
      title: input.title,
      description: input.description,
      ownerId: viewer.id,
      ownerName: viewer.name,
      ownerRoleAtCreation: viewer.role,
      quarter: input.quarter,
      type: input.type,
      isSubmitted: false,
      status: 'DRAFT',
      keyResults: [],
    };
    this.objectives.unshift(objective);
    return objective;
  }

  addKr(viewerId: number, objectiveId: number, input: AddKrInput) {
    const objective = this.findObjective(objectiveId);
    this.guardOwner(viewerId, objective);
    this.guardCanMutateKr(objective);
    if (objective.keyResults.length >= 3) {
      throw new BadRequestException('Maximum 3 key results per objective');
    }
    objective.keyResults.push({
      id: this.krIdSeq++,
      title: input.title,
      progress: 0,
      startValue: input.startValue,
      targetValue: input.targetValue,
      deadline: input.deadline,
    });
    return objective;
  }

  deleteKr(viewerId: number, objectiveId: number, krId: number) {
    const objective = this.findObjective(objectiveId);
    this.guardOwner(viewerId, objective);
    this.guardCanMutateKr(objective);
    objective.keyResults = objective.keyResults.filter((k) => k.id !== krId);
    return objective;
  }

  submitObjective(viewerId: number, objectiveId: number) {
    const objective = this.findObjective(objectiveId);
    this.guardOwner(viewerId, objective);
    if (objective.keyResults.length < 1) {
      throw new BadRequestException('Need at least 1 key result before submitting');
    }
    objective.isSubmitted = true;
    objective.status = 'SUBMITTED';
    return objective;
  }

  updateKrProgress(
    viewerId: number,
    objectiveId: number,
    krId: number,
    input: UpdateKrProgressInput,
  ) {
    const objective = this.findObjective(objectiveId);
    this.guardOwner(viewerId, objective);
    const kr = objective.keyResults.find((k) => k.id === krId);
    if (!kr) throw new NotFoundException('Key result not found');
    if (input.progress < 0 || input.progress > 100) {
      throw new BadRequestException('Progress must be 0-100');
    }
    kr.progress = input.progress;
    return objective;
  }

  selfReportKr(viewerId: number, objectiveId: number, krId: number, percent: number) {
    const objective = this.findObjective(objectiveId);
    if (objective.ownerId !== viewerId) {
      throw new ForbiddenException('Only owner can self-report');
    }
    if (!objective.isSubmitted) {
      throw new BadRequestException('Can only self-report after submitting');
    }
    const kr = objective.keyResults.find((k) => k.id === krId);
    if (!kr) throw new NotFoundException('Key result not found');
    if (percent < 0 || percent > 200) {
      throw new BadRequestException('Self-report percent must be 0-200');
    }
    kr.selfReportPercent = percent;
    kr.selfReportedAt = new Date().toISOString().split('T')[0];
    return objective;
  }

  gradeObjective(
    viewerId: number,
    objectiveId: number,
    input: { stars: number; comment: string },
  ) {
    const viewer = this.getUser(viewerId);
    if (viewer.role !== 'MANAGER') {
      throw new ForbiddenException('Only managers can grade objectives');
    }
    const objective = this.findObjective(objectiveId);
    if (!objective.isSubmitted) {
      throw new BadRequestException('Can only grade submitted objectives');
    }
    if (input.stars < 1 || input.stars > 5) {
      throw new BadRequestException('Stars must be 1-5');
    }
    objective.grade = {
      stars: input.stars,
      comment: input.comment,
      gradedAt: new Date().toISOString().split('T')[0],
      gradedBy: viewer.id,
      graderName: viewer.name,
    };
    return objective;
  }

  getMemberReport(viewerId: number) {
    const viewer = this.getUser(viewerId);
    if (viewer.role !== 'MANAGER') {
      throw new ForbiddenException('Only managers can access team report');
    }
    const employees = this.users.filter((u) => u.managerId === viewer.id);
    return employees.map((emp) => {
      const empObjectives = this.objectives.filter((o) => o.ownerId === emp.id);
      const submitted = empObjectives.filter((o) => o.isSubmitted);
      const graded = submitted.filter((o) => o.grade);
      const allKrs = empObjectives.flatMap((o) => o.keyResults);
      const reportedKrs = allKrs.filter((k) => k.selfReportPercent !== undefined);
      const avgSelfReport =
        reportedKrs.length > 0
          ? Math.round(reportedKrs.reduce((s, k) => s + (k.selfReportPercent ?? 0), 0) / reportedKrs.length)
          : null;
      const avgProgress =
        allKrs.length > 0
          ? Math.round(allKrs.reduce((s, k) => s + k.progress, 0) / allKrs.length)
          : 0;
      const { password: _pw, ...safeEmp } = emp;
      return {
        user: safeEmp,
        totalObjectives: empObjectives.length,
        submittedObjectives: submitted.length,
        gradedObjectives: graded.length,
        totalKrs: allKrs.length,
        reportedKrs: reportedKrs.length,
        avgSelfReportPercent: avgSelfReport,
        avgProgress,
        objectives: empObjectives,
      };
    });
  }

  getObjectiveDetail(viewerId: number, objectiveId: number): Objective {
    const objective = this.findObjective(objectiveId);
    const viewer = this.getUser(viewerId);
    if (!objective.isSubmitted && objective.ownerId !== viewer.id) {
      throw new ForbiddenException('Draft objective is only visible to its creator');
    }
    return objective;
  }

  getObjectivesForViewer(viewerId: number): Objective[] {
    const viewer = this.getUser(viewerId);
    return this.objectives.filter((o) => {
      if (!o.isSubmitted) return o.ownerId === viewer.id;
      return true;
    });
  }

  getMemberObjectivesForManager(viewerId: number): Objective[] {
    const viewer = this.getUser(viewerId);
    if (viewer.role !== 'MANAGER') {
      throw new ForbiddenException('Only managers can access Members page');
    }
    const teamMemberIds = this.users
      .filter((u) => u.managerId === viewer.id)
      .map((u) => u.id);
    return this.objectives.filter(
      (o) => teamMemberIds.includes(o.ownerId) && o.isSubmitted,
    );
  }

  // ══════════════════ DELEGATION ══════════════════

  getTeamMembers(viewerId: number): Omit<User, 'password'>[] {
    const viewer = this.getUser(viewerId);
    if (viewer.role !== 'MANAGER') {
      throw new ForbiddenException('Only managers can access delegation');
    }
    return this.users
      .filter((u) => u.managerId === viewer.id)
      .map(({ password: _pw, ...u }) => u);
  }

  getAllManagers(): Omit<User, 'password'>[] {
    return this.users
      .filter((u) => u.role === 'MANAGER')
      .map(({ password: _pw, ...u }) => u);
  }

  assignMember(viewerId: number, memberId: number, targetManagerId: number) {
    const viewer = this.getUser(viewerId);
    if (viewer.role !== 'MANAGER') {
      throw new ForbiddenException('Only managers can assign members');
    }
    const member = this.users.find((u) => u.id === memberId);
    if (!member) throw new NotFoundException('Member not found');
    if (member.role === 'MANAGER') {
      throw new BadRequestException('Cannot reassign a manager');
    }
    const targetManager = this.users.find((u) => u.id === targetManagerId);
    if (!targetManager) throw new NotFoundException('Target manager not found');
    if (targetManager.role !== 'MANAGER') {
      throw new BadRequestException('Target must be a manager');
    }
    member.managerId = targetManagerId;
    return { success: true };
  }

  promoteMember(viewerId: number, memberId: number) {
    const viewer = this.getUser(viewerId);
    if (viewer.role !== 'MANAGER') {
      throw new ForbiddenException('Only managers can promote members');
    }
    const member = this.users.find((u) => u.id === memberId);
    if (!member) throw new NotFoundException('Member not found');
    if (member.role === 'MANAGER') {
      throw new BadRequestException('User is already a manager');
    }
    member.role = 'MANAGER';
    member.managerId = undefined;
    return { success: true };
  }

  // ══════════════════ SUBSIDIARIES ══════════════════

  getSubsidiaries(viewerId: number) {
    const viewer = this.getUser(viewerId);

    // ── My own pending tasks ──
    const myObjectives = this.objectives.filter((o) => o.ownerId === viewer.id);
    const myDraftObjectives = myObjectives.filter((o) => !o.isSubmitted);
    const mySubmittedNoSelfReport = myObjectives
      .filter((o) => o.isSubmitted)
      .filter((o) => o.keyResults.some((kr) => kr.selfReportPercent === undefined));
    const myKrsWithoutSelfReport = mySubmittedNoSelfReport.flatMap((o) =>
      o.keyResults
        .filter((kr) => kr.selfReportPercent === undefined)
        .map((kr) => ({ objectiveId: o.id, objectiveTitle: o.title, krId: kr.id, krTitle: kr.title })),
    );

    // ── Manager tasks: members needing review ──
    let membersPendingReview: { memberId: number; memberName: string; objectiveId: number; objectiveTitle: string }[] = [];
    let membersNotSubmitted: { memberId: number; memberName: string; totalObjectives: number; submittedObjectives: number }[] = [];
    let totalTeamMembers = 0;
    let membersFullySubmitted = 0;
    let objectivesPendingGrade = 0;
    let objectivesGraded = 0;

    if (viewer.role === 'MANAGER') {
      const teamMembers = this.users.filter((u) => u.managerId === viewer.id);
      totalTeamMembers = teamMembers.length;

      for (const member of teamMembers) {
        const memberObjs = this.objectives.filter((o) => o.ownerId === member.id);
        const submitted = memberObjs.filter((o) => o.isSubmitted);
        const ungraded = submitted.filter((o) => !o.grade);
        const graded = submitted.filter((o) => o.grade);

        objectivesPendingGrade += ungraded.length;
        objectivesGraded += graded.length;

        if (memberObjs.length > 0 && submitted.length < memberObjs.length) {
          membersNotSubmitted.push({
            memberId: member.id,
            memberName: member.name,
            totalObjectives: memberObjs.length,
            submittedObjectives: submitted.length,
          });
        } else if (memberObjs.length > 0 && submitted.length === memberObjs.length) {
          membersFullySubmitted++;
        }

        for (const obj of ungraded) {
          membersPendingReview.push({
            memberId: member.id,
            memberName: member.name,
            objectiveId: obj.id,
            objectiveTitle: obj.title,
          });
        }
      }
    }

    return {
      myDraftCount: myDraftObjectives.length,
      myDraftObjectives: myDraftObjectives.map((o) => ({ id: o.id, title: o.title, krCount: o.keyResults.length })),
      myKrsWithoutSelfReport,
      mySelfReportPendingCount: myKrsWithoutSelfReport.length,
      // Manager-only
      isManager: viewer.role === 'MANAGER',
      totalTeamMembers,
      membersFullySubmitted,
      membersNotSubmitted,
      membersPendingReview,
      objectivesPendingGrade,
      objectivesGraded,
    };
  }

  private findObjective(objectiveId: number): Objective {
    const objective = this.objectives.find((o) => o.id === objectiveId);
    if (!objective) throw new NotFoundException('Objective not found');
    return objective;
  }

  private guardOwner(userId: number, objective: Objective) {
    if (objective.ownerId !== userId) {
      throw new ForbiddenException('Only the creator can modify this objective');
    }
  }

  private guardCanMutateKr(objective: Objective) {
    if (objective.isSubmitted || objective.status === 'APPROVED') {
      throw new ForbiddenException('Cannot modify key results after submit or approval');
    }
  }
}
