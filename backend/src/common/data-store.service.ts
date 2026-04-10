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
    { id: 2, name: 'Trần Gia Bảo',     role: 'EMPLOYEE', email: 'BaoTG@fpt.com',  password: 'BaoTG@LoveAI'  },
    { id: 3, name: 'Lê Thu Hà',        role: 'EMPLOYEE', email: 'HaLT@fpt.com',   password: 'HaLT@LoveAI'   },
    { id: 4, name: 'Phạm Quốc Huy',    role: 'MANAGER',  email: 'HuyPQ@fpt.com',  password: 'HuyPQ@LoveAI'  },
    { id: 5, name: 'Võ Khánh Linh',    role: 'EMPLOYEE', email: 'LinhVK@fpt.com', password: 'LinhVK@LoveAI' },
    { id: 6, name: 'Đoàn Tiến Đạt',   role: 'EMPLOYEE', email: 'DatDT@fpt.com',  password: 'DatDT@LoveAI'  },
    { id: 7, name: 'Bùi Ngọc Mai',     role: 'EMPLOYEE', email: 'MaiBN@fpt.com',  password: 'MaiBN@LoveAI'  },
    { id: 8, name: 'Hoàng Gia Kiệt',   role: 'EMPLOYEE', email: 'KietHG@fpt.com', password: 'KietHG@LoveAI' },
    { id: 9, name: 'Đậu Sỹ Mạnh',     role: 'MANAGER',  email: 'ManhDS@fpt.com', password: 'ManhDS@LoveAI' },
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
    const employees = this.users.filter((u) => u.role === 'EMPLOYEE');
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
    return this.objectives.filter(
      (o) => o.ownerRoleAtCreation === 'EMPLOYEE' && o.isSubmitted,
    );
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
