import { useEffect, useRef } from 'react';
import { useI18n, Lang, FLAG_URLS } from '../lib/i18n';

interface Props {
  section?: string;
}

/* ══════════════════════════════════════════
   Wireframe mockup components (CSS-based)
══════════════════════════════════════════ */

function ScreenMockup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="mockup-frame">
      <div className="mockup-titlebar">
        <span className="mockup-dots"><i /><i /><i /></span>
        <span className="mockup-url">{title}</span>
      </div>
      <div className="mockup-body">{children}</div>
    </div>
  );
}

function MockupLogin() {
  return (
    <ScreenMockup title="FOKR – Login">
      <div className="mock-login">
        <div className="mock-logo-area">
          <div className="mock-rect mock-logo" />
          <div className="mock-text-lg">FOKR Workspace</div>
          <div className="mock-text-sm mock-muted">FPT Software – OKR Management</div>
        </div>
        <div className="mock-form">
          <div className="mock-label">① Tài khoản / Account</div>
          <div className="mock-input"><span className="mock-muted">▾ ManhDS@fpt.com</span></div>
          <div className="mock-label">② Mật khẩu / Password</div>
          <div className="mock-input"><span className="mock-muted">••••••••••  👁</span></div>
          <div className="mock-btn-primary">③ Đăng nhập / Sign In →</div>
        </div>
      </div>
    </ScreenMockup>
  );
}

function MockupDashboard() {
  return (
    <ScreenMockup title="FOKR – Dashboard">
      <div className="mock-layout">
        <div className="mock-sidebar-mini">
          <div className="mock-nav-item mock-active">📋 OKR</div>
          <div className="mock-nav-item">＋ Tạo</div>
          <div className="mock-nav-item">📋 Todo</div>
        </div>
        <div className="mock-main">
          <div className="mock-text-lg">📋 OKR Dashboard</div>
          <div className="mock-stats-row">
            <div className="mock-stat">Objectives<br /><strong>5</strong></div>
            <div className="mock-stat">KRs<br /><strong>12</strong></div>
            <div className="mock-stat">Submitted<br /><strong>3</strong></div>
            <div className="mock-stat">Avg %<br /><strong>45%</strong></div>
          </div>
          <div className="mock-filter-bar">
            <span className="mock-input-sm">🔍 Search...</span>
            <span className="mock-select-sm">▾ Status</span>
            <span className="mock-select-sm">▾ Type</span>
          </div>
          <div className="mock-card-row">
            <div className="mock-obj-card">
              <div className="mock-text-sm"><strong>Nâng cao chất lượng code</strong></div>
              <div className="mock-progress"><div className="mock-progress-fill" style={{ width: '60%' }} /></div>
              <div className="mock-card-actions">
                <span className="mock-chip">SUBMITTED</span>
                <span className="mock-link">Xem chi tiết →</span>
              </div>
            </div>
            <div className="mock-obj-card">
              <div className="mock-text-sm"><strong>Ứng dụng AI</strong></div>
              <div className="mock-progress"><div className="mock-progress-fill" style={{ width: '20%' }} /></div>
              <div className="mock-card-actions">
                <span className="mock-chip mock-chip-draft">DRAFT</span>
                <span className="mock-link">＋ Thêm KR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenMockup>
  );
}

function MockupCreate() {
  return (
    <ScreenMockup title="FOKR – Create Objective">
      <div className="mock-form-page">
        <div className="mock-text-lg">＋ Tạo Objective mới</div>
        <div className="mock-form-card">
          <div className="mock-label">① Tiêu đề</div>
          <div className="mock-input"><span className="mock-muted">Nhập tiêu đề objective...</span></div>
          <div className="mock-label">② Mô tả</div>
          <div className="mock-input mock-textarea"><span className="mock-muted">Mô tả chi tiết...</span></div>
          <div className="mock-form-2col">
            <div>
              <div className="mock-label">③ Quý</div>
              <div className="mock-input-sm">Q2/2026</div>
            </div>
            <div>
              <div className="mock-label">④ Loại</div>
              <div className="mock-input-sm">▾ PERSONAL</div>
            </div>
          </div>
          <div className="mock-btn-primary">⑤ 💾 Lưu Objective</div>
        </div>
      </div>
    </ScreenMockup>
  );
}

function MockupDetail() {
  return (
    <ScreenMockup title="FOKR – Objective Detail">
      <div className="mock-detail-page">
        <div className="mock-text-lg">📄 Chi tiết Objective</div>
        <div className="mock-detail-header">
          <div><strong>Nâng cao chất lượng code</strong> · Q2/2026</div>
          <div className="mock-detail-chips">
            <span className="mock-chip">PERSONAL</span>
            <span className="mock-chip mock-chip-draft">DRAFT</span>
          </div>
        </div>
        <div className="mock-detail-actions">
          <span className="mock-btn-accent">🚀 Submit</span>
        </div>
        <div className="mock-kr-card">
          <div className="mock-text-sm"><strong>KR1:</strong> Giảm bug rate &lt; 2%</div>
          <div className="mock-progress"><div className="mock-progress-fill" style={{ width: '40%' }} /></div>
          <div className="mock-kr-actions">
            <span className="mock-btn-sm">+10%</span>
            <span className="mock-btn-sm mock-btn-outline">Báo cáo</span>
            <span className="mock-btn-sm mock-btn-danger">Xóa</span>
          </div>
        </div>
        <div className="mock-kr-add">
          <div className="mock-text-sm mock-muted">＋ Thêm Key Result: [Tên] [Start] [Target] [Deadline]</div>
        </div>
      </div>
    </ScreenMockup>
  );
}

function MockupMembers() {
  return (
    <ScreenMockup title="FOKR – Members">
      <div className="mock-form-page">
        <div className="mock-text-lg">👥 Objectives thành viên</div>
        <div className="mock-filter-bar">
          <span className="mock-input-sm">🔍 Tìm kiếm...</span>
          <span className="mock-select-sm">▾ Type</span>
        </div>
        <div className="mock-obj-card">
          <div className="mock-text-sm"><strong>Xây dựng CI/CD Pipeline</strong></div>
          <div className="mock-text-xs mock-muted">👤 Trần Văn Bảo · Q2/2026</div>
          <div className="mock-progress"><div className="mock-progress-fill" style={{ width: '70%' }} /></div>
          <span className="mock-link">Xem chi tiết → Chấm điểm</span>
        </div>
        <div className="mock-obj-card">
          <div className="mock-text-sm"><strong>Testing Automation</strong></div>
          <div className="mock-text-xs mock-muted">👤 Lê Thị Lan · Q2/2026</div>
          <div className="mock-progress"><div className="mock-progress-fill" style={{ width: '50%' }} /></div>
          <span className="mock-link">Xem chi tiết → Chấm điểm</span>
        </div>
      </div>
    </ScreenMockup>
  );
}

function MockupReport() {
  return (
    <ScreenMockup title="FOKR – Team Report">
      <div className="mock-form-page">
        <div className="mock-text-lg">📊 Báo cáo Team</div>
        <div className="mock-stats-row">
          <div className="mock-stat">Members<br /><strong>13</strong></div>
          <div className="mock-stat">Reported<br /><strong>10</strong></div>
          <div className="mock-stat">Graded<br /><strong>5</strong></div>
        </div>
        <div className="mock-chart">
          <div className="mock-bar" style={{ height: '70%' }}><span>70%</span></div>
          <div className="mock-bar" style={{ height: '55%' }}><span>55%</span></div>
          <div className="mock-bar" style={{ height: '85%' }}><span>85%</span></div>
          <div className="mock-bar" style={{ height: '40%' }}><span>40%</span></div>
          <div className="mock-bar" style={{ height: '60%' }}><span>60%</span></div>
        </div>
      </div>
    </ScreenMockup>
  );
}

function MockupSubsidiaries() {
  return (
    <ScreenMockup title="FOKR – Subsidiaries">
      <div className="mock-form-page">
        <div className="mock-text-lg">📋 Việc cần làm</div>
        <div className="mock-subs-card mock-subs-warning">
          <div className="mock-text-sm">📝 <strong>Objective chưa submit</strong> <span className="mock-badge-warn">2</span></div>
          <div className="mock-subs-item">
            <span>Ứng dụng AI Coaching</span>
            <span className="mock-btn-sm">Đi Submit →</span>
          </div>
        </div>
        <div className="mock-subs-card mock-subs-danger">
          <div className="mock-text-sm">🔴 <strong>Chưa chấm điểm</strong> <span className="mock-badge-danger">5</span></div>
          <div className="mock-subs-item">
            <span>CI/CD Pipeline – Trần Văn Bảo</span>
            <span className="mock-btn-sm">Chấm điểm →</span>
          </div>
        </div>
      </div>
    </ScreenMockup>
  );
}

function MockupDelegation() {
  return (
    <ScreenMockup title="FOKR – Delegation">
      <div className="mock-form-page">
        <div className="mock-text-lg">🔀 Quản lý nhân sự</div>
        <table className="mock-table">
          <thead>
            <tr><th>Tên</th><th>Role</th><th>Chuyển</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Trần Văn Bảo</td>
              <td><span className="mock-chip mock-chip-role">EMP</span></td>
              <td><span className="mock-select-sm">▾ Manager</span></td>
              <td>
                <span className="mock-btn-sm">Chuyển</span>{' '}
                <span className="mock-btn-sm mock-btn-outline">↑ Nâng cấp</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ScreenMockup>
  );
}

function MockupLanguage() {
  return (
    <ScreenMockup title="FOKR – Header">
      <div className="mock-header-demo">
        <div className="mock-header-left">
          <div className="mock-rect mock-logo" />
          <span className="mock-text-sm"><strong>FOKR – OKR System</strong></span>
        </div>
        <div className="mock-header-right">
          <span className="mock-text-xs">Đào Sỹ Mạnh</span>
          <span className="mock-chip mock-chip-role">MANAGER</span>
          <div className="mock-lang-group">
            <div className="mock-lang-btn">
              <img src={FLAG_URLS.vi} alt="VN" className="mock-flag" />
              <span>VN</span>
            </div>
            <div className="mock-lang-btn mock-lang-active">
              <img src={FLAG_URLS.en} alt="EN" className="mock-flag" />
              <span>EN</span>
            </div>
            <div className="mock-lang-btn">
              <img src={FLAG_URLS.ja} alt="JP" className="mock-flag" />
              <span>JP</span>
            </div>
          </div>
        </div>
      </div>
    </ScreenMockup>
  );
}

const MOCKUPS: Record<string, () => JSX.Element> = {
  login: MockupLogin,
  dashboard: MockupDashboard,
  create: MockupCreate,
  detail: MockupDetail,
  members: MockupMembers,
  report: MockupReport,
  subsidiaries: MockupSubsidiaries,
  delegation: MockupDelegation,
  language: MockupLanguage,
};

/* ══════════════════════════════════════════
   Multi-language manual content
══════════════════════════════════════════ */
interface ManualSection { id: string; title: string; content: string; }
function getSections(lang: Lang): ManualSection[] {
  if (lang === 'en') return sectionsEn;
  if (lang === 'ja') return sectionsJa;
  return sectionsVi;
}

const FLAG_VI = FLAG_URLS.vi;
const FLAG_EN = FLAG_URLS.en;
const FLAG_JA = FLAG_URLS.ja;

/* ── Vietnamese ── */
const sectionsVi: ManualSection[] = [
  { id: 'overview', title: '📖 Tổng quan hệ thống FOKR', content: `
<p><strong>FOKR – OKR Management System</strong> là hệ thống quản lý OKR nội bộ của FPT Software.</p>
<div class="manual-info-box manual-info-blue"><div class="manual-info-icon">ℹ️</div><div><strong>OKR là gì?</strong><br/>OKR = Objectives and Key Results. Mỗi Objective gồm 1-3 Key Result đo lường được.</div></div>
<h3>🔑 Vai trò trong hệ thống</h3>
<div class="manual-role-grid">
  <div class="manual-role-card manual-role-emp"><div class="manual-role-header">👤 Employee</div><ul><li>Tạo Objective cá nhân (PERSONAL)</li><li>Thêm tối đa 3 Key Result</li><li>Tự đánh giá tiến độ (Self-Report)</li><li>Submit OKR cho Manager review</li></ul></div>
  <div class="manual-role-card manual-role-mgr"><div class="manual-role-header">👔 Manager</div><ul><li>Toàn bộ quyền Employee</li><li>Tạo thêm Team Objective</li><li>Xem OKR toàn team + Chấm điểm ★</li><li>Xem báo cáo + Quản lý nhân sự</li></ul></div>
</div>
<h3>📱 Bố cục giao diện</h3>
<div class="manual-layout-diagram">
  <div class="manual-layout-header"><span>🏢 Logo FPT</span><span>FOKR – OKR System</span><span>👤 Tên · Role · <img src="${FLAG_VI}" class="manual-mini-flag"/> <img src="${FLAG_EN}" class="manual-mini-flag"/> <img src="${FLAG_JA}" class="manual-mini-flag"/></span></div>
  <div class="manual-layout-body">
    <div class="manual-layout-sidebar"><div>📋 OKR Dashboard</div><div>＋ Tạo Objective</div><div>📋 Việc cần làm</div><div class="mock-muted">── Quản lý ──</div><div>👥 Members</div><div>📊 Báo cáo</div><div>🔀 Nhân sự</div><div class="mock-muted">── Hướng dẫn ──</div><div>📖 Manual</div></div>
    <div class="manual-layout-main">Nội dung trang</div>
  </div>
  <div class="manual-layout-footer">Footer: Thông tin FPT · Liên kết · Hỗ trợ</div>
</div>` },
  { id: 'login', title: '🔐 Màn hình Đăng nhập', content: `
<div class="manual-flow-steps">
  <div class="manual-flow-step"><div class="manual-step-num">1</div><div class="manual-step-content"><strong>Truy cập hệ thống</strong><br/>Mở trình duyệt → <code>http://&lt;server&gt;/f-okr/</code></div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">2</div><div class="manual-step-content"><strong>Chọn tài khoản</strong><br/>Click ô <em>"Tài khoản"</em> → chọn email từ dropdown<br/><span class="manual-tip">💡 Mật khẩu tự động: <code>&lt;tên&gt;@LoveAI</code></span></div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">3</div><div class="manual-step-content"><strong>Nhấn "Đăng nhập"</strong> → Chuyển tới Dashboard</div></div>
</div>
<div class="manual-info-box manual-info-green"><div class="manual-info-icon">💡</div><div><strong>Mẹo:</strong> Nhấn 👁 xem mật khẩu. Phiên được ghi nhớ – không cần login lại.</div></div>` },
  { id: 'dashboard', title: '📋 OKR Dashboard (Trang chủ)', content: `
<p>Trang chính hiển thị tổng quan OKR của bạn.</p>
<div class="manual-callout-grid">
  <div class="manual-callout"><div class="manual-callout-letter">A</div><div><strong>Thẻ thống kê</strong> – Tổng Objectives, KRs, đã Submit, Tiến độ TB</div></div>
  <div class="manual-callout"><div class="manual-callout-letter">B</div><div><strong>Thanh lọc</strong> – Tìm kiếm, lọc trạng thái, lọc loại</div></div>
  <div class="manual-callout"><div class="manual-callout-letter">C</div><div><strong>Danh sách Objective</strong> – Card: tên, quý, tiến độ, trạng thái</div></div>
</div>
<h3>Thao tác nhanh</h3>
<div class="manual-action-table">
  <div class="manual-action-row"><span class="manual-action-trigger">Nhấn <strong>"Xem chi tiết"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Mở trang Chi tiết Objective</span></div>
  <div class="manual-action-row"><span class="manual-action-trigger">Nhấn <strong>"＋ Thêm KR"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Thêm Key Result (chỉ khi DRAFT &amp; &lt;3 KR)</span></div>
  <div class="manual-action-row"><span class="manual-action-trigger">Gõ <strong>ô tìm kiếm</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Lọc nhanh theo tên/mô tả</span></div>
</div>` },
  { id: 'create', title: '＋ Tạo Objective mới', content: `
<div class="manual-flow-steps">
  <div class="manual-flow-step"><div class="manual-step-num">1</div><div class="manual-step-content"><strong>Mở trang tạo</strong> – Nhấn <em>"＋ Tạo Objective"</em> trên sidebar</div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">2</div><div class="manual-step-content"><strong>Điền thông tin</strong><br/><span class="manual-field-tag">Tiêu đề</span> bắt buộc · <span class="manual-field-tag">Mô tả</span> bắt buộc<br/><span class="manual-field-tag">Quý</span> mặc định Q2/2026 · <span class="manual-field-tag">Loại</span> PERSONAL hoặc TEAM</div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">3</div><div class="manual-step-content"><strong>Nhấn "💾 Lưu"</strong> → Tạo <span class="manual-status-tag draft">DRAFT</span> → Về Dashboard</div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">4</div><div class="manual-step-content"><strong>Tiếp:</strong> Vào chi tiết → Thêm 1-3 KR → Submit</div></div>
</div>
<div class="manual-info-box manual-info-orange"><div class="manual-info-icon">⚠️</div><div>Cần 1-3 KR trước khi submit. Employee chỉ tạo PERSONAL.</div></div>` },
  { id: 'detail', title: '📄 Chi tiết Objective & Key Results', content: `
<h3>Các hành động chính</h3>
<div class="manual-action-table">
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>🚀 Submit</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result"><span class="manual-status-tag draft">DRAFT</span> → <span class="manual-status-tag submitted">SUBMITTED</span></span></div>
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>+10% Tiến độ</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Cập nhật tiến độ KR (sau submit)</span></div>
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>"Báo cáo"</strong> → nhập %</span><span class="manual-action-arrow">→</span><span class="manual-action-result">Self-Report mức hoàn thành KR</span></div>
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>"Xóa"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Xóa KR (chỉ trước submit)</span></div>
</div>
<h3>Luồng công việc hoàn chỉnh</h3>
<div class="manual-flow-horizontal">
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">📝</div><div>Tạo OKR</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">🔑</div><div>Thêm KR</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">🚀</div><div>Submit</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">📊</div><div>Self-Report</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">⭐</div><div>Manager Chấm</div></div>
</div>
<h3>Chấm điểm <em>(Manager)</em></h3>
<div class="manual-flow-steps">
  <div class="manual-flow-step"><div class="manual-step-num">1</div><div class="manual-step-content">Mở objective đã submit (từ Members)</div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">2</div><div class="manual-step-content">Chọn sao 1-5 ★ + nhập nhận xét</div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">3</div><div class="manual-step-content">Nhấn <strong>"Lưu đánh giá"</strong></div></div>
</div>` },
  { id: 'members', title: '👥 Objectives thành viên', content: `
<div class="manual-info-box manual-info-purple"><div class="manual-info-icon">👔</div><div><strong>Chỉ dành cho Manager.</strong> Xem objective đã submit từ team.</div></div>
<div class="manual-action-table">
  <div class="manual-action-row"><span class="manual-action-trigger">Nhấn <strong>"👥 Members"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Xem danh sách objective team</span></div>
  <div class="manual-action-row"><span class="manual-action-trigger">Gõ <strong>ô tìm kiếm</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Lọc theo tên objective/thành viên</span></div>
  <div class="manual-action-row"><span class="manual-action-trigger">Nhấn <strong>"Xem chi tiết"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Mở → Chấm điểm ★</span></div>
</div>` },
  { id: 'report', title: '📊 Báo cáo Team', content: `
<div class="manual-info-box manual-info-purple"><div class="manual-info-icon">👔</div><div><strong>Chỉ dành cho Manager.</strong> Báo cáo tổng hợp OKR team.</div></div>
<div class="manual-callout-grid">
  <div class="manual-callout"><div class="manual-callout-letter">A</div><div><strong>Thẻ thống kê</strong> – Tổng thành viên, Đã self-report, Đã chấm, TB %</div></div>
  <div class="manual-callout"><div class="manual-callout-letter">B</div><div><strong>Biểu đồ cột</strong> – So sánh % tự đánh giá</div></div>
  <div class="manual-callout"><div class="manual-callout-letter">C</div><div><strong>Bảng chi tiết</strong> – Từng thành viên: Objectives, KR, %, sao</div></div>
</div>` },
  { id: 'subsidiaries', title: '📝 Việc cần làm', content: `
<p>Dashboard hiển thị <strong>tất cả việc pending</strong> cần xử lý.</p>
<h3>👤 Tất cả người dùng</h3>
<div class="manual-action-table">
  <div class="manual-action-row"><span class="manual-action-trigger">📝 <strong>Chưa submit</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Nhấn <em>"Đi Submit"</em></span></div>
  <div class="manual-action-row"><span class="manual-action-trigger">📊 <strong>Chưa self-report</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Nhấn <em>"Đi tự đánh giá"</em></span></div>
</div>
<h3>👔 Manager (thêm)</h3>
<div class="manual-callout-grid">
  <div class="manual-callout"><div class="manual-callout-letter">①</div><div><strong>Tổng quan Team</strong> – 5 thẻ thống kê</div></div>
  <div class="manual-callout"><div class="manual-callout-letter">②</div><div><strong>Members chưa submit đủ</strong></div></div>
  <div class="manual-callout"><div class="manual-callout-letter">③</div><div><strong>Objectives chưa chấm</strong> → "Đi chấm điểm"</div></div>
</div>
<div class="manual-info-box manual-info-green"><div class="manual-info-icon">🎉</div><div>Hoàn thành hết → <strong>"Không còn việc pending nào!"</strong></div></div>` },
  { id: 'delegation', title: '🔄 Quản lý nhân sự', content: `
<div class="manual-info-box manual-info-purple"><div class="manual-info-icon">👔</div><div><strong>Chỉ dành cho Manager.</strong></div></div>
<h3>Chuyển thành viên</h3>
<div class="manual-flow-steps">
  <div class="manual-flow-step"><div class="manual-step-num">1</div><div class="manual-step-content">Chọn Manager đích từ dropdown</div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">2</div><div class="manual-step-content">Nhấn <strong>"Chuyển"</strong> → Nhân viên sang team mới</div></div>
</div>
<h3>Nâng cấp lên Manager</h3>
<div class="manual-flow-steps">
  <div class="manual-flow-step"><div class="manual-step-num">1</div><div class="manual-step-content">Nhấn <strong>"Nâng lên Manager"</strong></div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">2</div><div class="manual-step-content">Xác nhận → OK</div></div>
</div>
<div class="manual-info-box manual-info-orange"><div class="manual-info-icon">⚠️</div><div>Nâng cấp Manager là hành động quan trọng, cần cân nhắc kỹ.</div></div>` },
  { id: 'language', title: '🌐 Chuyển đổi ngôn ngữ', content: `
<p>Hệ thống hỗ trợ 3 ngôn ngữ, nút chuyển ở <strong>góc phải header</strong>:</p>
<div class="manual-lang-demo">
  <div class="manual-lang-item"><img src="${FLAG_VI}" alt="VN" class="manual-lang-flag" /><div><strong>VN</strong> – Tiếng Việt</div></div>
  <div class="manual-lang-item"><img src="${FLAG_EN}" alt="EN" class="manual-lang-flag" /><div><strong>EN</strong> – English</div></div>
  <div class="manual-lang-item"><img src="${FLAG_JA}" alt="JP" class="manual-lang-flag" /><div><strong>JP</strong> – 日本語</div></div>
</div>
<div class="manual-flow-steps">
  <div class="manual-flow-step"><div class="manual-step-num">1</div><div class="manual-step-content">Nhìn góc phải header → 3 nút cờ</div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">2</div><div class="manual-step-content">Nhấn cờ muốn chuyển → Giao diện đổi ngay</div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">3</div><div class="manual-step-content">Ngôn ngữ được lưu, lần sau giữ nguyên</div></div>
</div>` },
];

/* ── English ── */
const sectionsEn: ManualSection[] = [
  { id: 'overview', title: '📖 FOKR System Overview', content: `
<p><strong>FOKR</strong> is FPT Software's internal OKR management platform.</p>
<div class="manual-info-box manual-info-blue"><div class="manual-info-icon">ℹ️</div><div><strong>What is OKR?</strong><br/>OKR = Objectives and Key Results. Each Objective has 1-3 measurable Key Results.</div></div>
<h3>🔑 Roles</h3>
<div class="manual-role-grid">
  <div class="manual-role-card manual-role-emp"><div class="manual-role-header">👤 Employee</div><ul><li>Create PERSONAL objectives</li><li>Add up to 3 KRs</li><li>Self-report progress</li><li>Submit for review</li></ul></div>
  <div class="manual-role-card manual-role-mgr"><div class="manual-role-header">👔 Manager</div><ul><li>All Employee abilities</li><li>Create TEAM objectives</li><li>Grade with ★</li><li>Reports + HR mgmt</li></ul></div>
</div>` },
  { id: 'login', title: '🔐 Login', content: `
<div class="manual-flow-steps">
  <div class="manual-flow-step"><div class="manual-step-num">1</div><div class="manual-step-content">Open <code>http://&lt;server&gt;/f-okr/</code></div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">2</div><div class="manual-step-content">Select email. Password auto-fills: <code>&lt;name&gt;@LoveAI</code></div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">3</div><div class="manual-step-content">Click <strong>"Sign In"</strong> → Dashboard</div></div>
</div>
<div class="manual-info-box manual-info-green"><div class="manual-info-icon">💡</div><div>Click 👁 to show password. Sessions persist.</div></div>` },
  { id: 'dashboard', title: '📋 Dashboard', content: `
<div class="manual-callout-grid">
  <div class="manual-callout"><div class="manual-callout-letter">A</div><div><strong>Stats</strong> – Objectives, KRs, Submitted, Avg %</div></div>
  <div class="manual-callout"><div class="manual-callout-letter">B</div><div><strong>Filters</strong> – Search, status, type</div></div>
  <div class="manual-callout"><div class="manual-callout-letter">C</div><div><strong>Cards</strong> – Name, quarter, progress, status</div></div>
</div>
<div class="manual-action-table">
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>"View details"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Open detail page</span></div>
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>"＋ Add KR"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Add Key Results</span></div>
</div>` },
  { id: 'create', title: '＋ Create Objective', content: `
<div class="manual-flow-steps">
  <div class="manual-flow-step"><div class="manual-step-num">1</div><div class="manual-step-content">Click "＋ Create Objective" in sidebar</div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">2</div><div class="manual-step-content">Fill: <span class="manual-field-tag">Title</span> <span class="manual-field-tag">Description</span> <span class="manual-field-tag">Quarter</span> <span class="manual-field-tag">Type</span></div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">3</div><div class="manual-step-content">Save → <span class="manual-status-tag draft">DRAFT</span> → Dashboard</div></div>
</div>` },
  { id: 'detail', title: '📄 OKR Detail', content: `
<div class="manual-action-table">
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>🚀 Submit</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result"><span class="manual-status-tag submitted">SUBMITTED</span></span></div>
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>+10%</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Update KR progress</span></div>
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>"Report"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Self-Report KR</span></div>
</div>
<div class="manual-flow-horizontal">
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">📝</div><div>Create</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">🔑</div><div>KRs</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">🚀</div><div>Submit</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">📊</div><div>Report</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">⭐</div><div>Graded</div></div>
</div>` },
  { id: 'members', title: '👥 Members', content: `
<div class="manual-info-box manual-info-purple"><div class="manual-info-icon">👔</div><div><strong>Manager only.</strong></div></div>
<div class="manual-action-table">
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>"Members"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">View team objectives</span></div>
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>"View details"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Grade with ★</span></div>
</div>` },
  { id: 'report', title: '📊 Team Report', content: `
<div class="manual-info-box manual-info-purple"><div class="manual-info-icon">👔</div><div><strong>Manager only.</strong></div></div>
<div class="manual-callout-grid">
  <div class="manual-callout"><div class="manual-callout-letter">A</div><div>Stats cards</div></div>
  <div class="manual-callout"><div class="manual-callout-letter">B</div><div>Bar chart</div></div>
  <div class="manual-callout"><div class="manual-callout-letter">C</div><div>Detail table</div></div>
</div>` },
  { id: 'subsidiaries', title: '📝 To-do', content: `
<div class="manual-action-table">
  <div class="manual-action-row"><span class="manual-action-trigger">📝 <strong>Unsubmitted</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">"Go to Submit"</span></div>
  <div class="manual-action-row"><span class="manual-action-trigger">📊 <strong>No Report</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">"Go to Self-Report"</span></div>
</div>` },
  { id: 'delegation', title: '🔄 Delegation', content: `
<div class="manual-info-box manual-info-purple"><div class="manual-info-icon">👔</div><div><strong>Manager only.</strong></div></div>
<div class="manual-action-table">
  <div class="manual-action-row"><span class="manual-action-trigger">Select manager → <strong>"Assign"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Transfer member</span></div>
  <div class="manual-action-row"><span class="manual-action-trigger"><strong>"Promote"</strong></span><span class="manual-action-arrow">→</span><span class="manual-action-result">Employee → Manager</span></div>
</div>` },
  { id: 'language', title: '🌐 Language', content: `
<div class="manual-lang-demo">
  <div class="manual-lang-item"><img src="${FLAG_VI}" alt="VN" class="manual-lang-flag" /><div><strong>VN</strong></div></div>
  <div class="manual-lang-item"><img src="${FLAG_EN}" alt="EN" class="manual-lang-flag" /><div><strong>EN</strong></div></div>
  <div class="manual-lang-item"><img src="${FLAG_JA}" alt="JP" class="manual-lang-flag" /><div><strong>JP</strong></div></div>
</div>
<p>Click flag in header top-right. Choice is saved.</p>` },
];

/* ── Japanese ── */
const sectionsJa: ManualSection[] = [
  { id: 'overview', title: '📖 概要', content: `
<p><strong>FOKR</strong>はFPTソフトウェアの社内OKR管理システムです。</p>
<div class="manual-role-grid">
  <div class="manual-role-card manual-role-emp"><div class="manual-role-header">👤 Employee</div><ul><li>個人目標作成</li><li>KR追加（最大3）</li><li>自己評価・提出</li></ul></div>
  <div class="manual-role-card manual-role-mgr"><div class="manual-role-header">👔 Manager</div><ul><li>全権限＋チーム目標</li><li>評価・レポート</li><li>人事管理</li></ul></div>
</div>` },
  { id: 'login', title: '🔐 ログイン', content: `
<div class="manual-flow-steps">
  <div class="manual-flow-step"><div class="manual-step-num">1</div><div class="manual-step-content"><code>/f-okr/</code>にアクセス</div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">2</div><div class="manual-step-content">メール選択。PW: <code>&lt;名前&gt;@LoveAI</code></div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">3</div><div class="manual-step-content">「ログイン」→ ダッシュボード</div></div>
</div>` },
  { id: 'dashboard', title: '📋 ダッシュボード', content: `
<div class="manual-callout-grid">
  <div class="manual-callout"><div class="manual-callout-letter">A</div><div>統計カード</div></div>
  <div class="manual-callout"><div class="manual-callout-letter">B</div><div>フィルター</div></div>
  <div class="manual-callout"><div class="manual-callout-letter">C</div><div>目標リスト</div></div>
</div>` },
  { id: 'create', title: '＋ 目標作成', content: `
<div class="manual-flow-steps">
  <div class="manual-flow-step"><div class="manual-step-num">1</div><div class="manual-step-content">「＋ 目標作成」クリック</div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">2</div><div class="manual-step-content"><span class="manual-field-tag">タイトル</span> <span class="manual-field-tag">説明</span> <span class="manual-field-tag">四半期</span> <span class="manual-field-tag">タイプ</span></div></div>
  <div class="manual-flow-arrow">↓</div>
  <div class="manual-flow-step"><div class="manual-step-num">3</div><div class="manual-step-content">保存 → <span class="manual-status-tag draft">DRAFT</span></div></div>
</div>` },
  { id: 'detail', title: '📄 詳細', content: `
<div class="manual-flow-horizontal">
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">📝</div><div>作成</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">🔑</div><div>KR</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">🚀</div><div>提出</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">📊</div><div>報告</div></div><div class="manual-flow-h-arrow">→</div>
  <div class="manual-flow-h-step"><div class="manual-flow-h-icon">⭐</div><div>評価</div></div>
</div>` },
  { id: 'members', title: '👥 メンバー', content: `<div class="manual-info-box manual-info-purple"><div class="manual-info-icon">👔</div><div>管理者専用</div></div><p>チーム目標一覧表示 → 「詳細」→ ★評価。</p>` },
  { id: 'report', title: '📊 レポート', content: `<div class="manual-info-box manual-info-purple"><div class="manual-info-icon">👔</div><div>管理者専用</div></div><p>統計カード、棒グラフ、詳細テーブル。</p>` },
  { id: 'subsidiaries', title: '📝 タスク', content: `<p>未提出 → 「提出へ」。未評価 → 「自己評価へ」。</p>` },
  { id: 'delegation', title: '🔄 人事', content: `<div class="manual-info-box manual-info-purple"><div class="manual-info-icon">👔</div><div>管理者専用</div></div><p>メンバー移動・昇格。</p>` },
  { id: 'language', title: '🌐 言語', content: `
<div class="manual-lang-demo">
  <div class="manual-lang-item"><img src="${FLAG_VI}" alt="VN" class="manual-lang-flag" /><div>VN</div></div>
  <div class="manual-lang-item"><img src="${FLAG_EN}" alt="EN" class="manual-lang-flag" /><div>EN</div></div>
  <div class="manual-lang-item"><img src="${FLAG_JA}" alt="JP" class="manual-lang-flag" /><div>JP</div></div>
</div><p>ヘッダー右上の国旗クリックで即時切替。</p>` },
];

/* ══════════════════════════════════════════ */
export function UserManualPage({ section }: Props) {
  const { lang } = useI18n();
  const sections = getSections(lang);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (section && sectionRefs.current[section]) {
      sectionRefs.current[section]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [section]);

  return (
    <div className="page-container manual-page">
      <h1 className="page-title">
        {lang === 'en' ? '📖 User Manual' : lang === 'ja' ? '📖 利用ガイド' : '📖 Hướng dẫn sử dụng'}
      </h1>
      <div className="manual-toc">
        <h3 className="manual-toc-title">{lang === 'en' ? 'Table of Contents' : lang === 'ja' ? '目次' : 'Mục lục'}</h3>
        <ol className="manual-toc-list">
          {sections.map((s) => (
            <li key={s.id}>
              <a className="manual-toc-link" href={`#manual-${s.id}`} onClick={(e) => { e.preventDefault(); sectionRefs.current[s.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </div>
      {sections.map((s) => {
        const MockComp = MOCKUPS[s.id];
        return (
          <div key={s.id} id={`manual-${s.id}`} ref={(el) => { sectionRefs.current[s.id] = el; }} className={`manual-section ${section === s.id ? 'manual-section-highlight' : ''}`}>
            <h2 className="manual-section-title">{s.title}</h2>
            {MockComp && (
              <div className="manual-mockup-wrapper">
                <div className="manual-mockup-label">{lang === 'en' ? '🖥 Screen Preview' : lang === 'ja' ? '🖥 画面プレビュー' : '🖥 Minh họa màn hình'}</div>
                <MockComp />
              </div>
            )}
            <div className="manual-section-body" dangerouslySetInnerHTML={{ __html: s.content }} />
          </div>
        );
      })}
    </div>
  );
}
