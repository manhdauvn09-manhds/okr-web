import { useI18n } from '../lib/i18n';
import { MemberReportEntry } from '../types';

interface Props {
  report: MemberReportEntry[];
}

function StarDisplay({ stars }: { stars: number }) {
  return (
    <span className="star-display">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= stars ? 'star on' : 'star off'}>★</span>
      ))}
    </span>
  );
}

function MiniBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="minibar-track">
      <div className="minibar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function SvgBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const barW = 36;
  const gap = 14;
  const maxH = 110;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const svgW = data.length * (barW + gap) + gap;

  return (
    <svg width={svgW} height={maxH + 36} className="svg-chart" role="img" aria-label="Biểu đồ tự đánh giá">
      {data.map((d, i) => {
        const barH = Math.round((d.value / maxVal) * maxH);
        const x = gap + i * (barW + gap);
        const y = maxH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={6} fill={d.color} opacity={0.9} />
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={11} fill="#94a3b8">
              {d.value}%
            </text>
            <text
              x={x + barW / 2}
              y={maxH + 20}
              textAnchor="middle"
              fontSize={10}
              fill="#64748b"
            >
              {d.label.substring(0, 6)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export function ManagerReportPage({ report }: Props) {
  const { t } = useI18n();
  const reported = report.filter((r) => r.reportedKrs > 0);
  const graded = report.filter((r) => r.gradedObjectives > 0);
  const totalMembers = report.length;

  const chartData = report.map((r, i) => ({
    label: r.user.name.split(' ').pop() ?? r.user.name,
    value: r.avgSelfReportPercent ?? 0,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="page-container">
      <h1 className="page-title">{t('report.title')}</h1>

      {/* ── KPI summary ── */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">{t('report.totalMembers')}</span>
          <strong className="kpi-value">{totalMembers}</strong>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">{t('report.selfReported')}</span>
          <strong className="kpi-value accent-green">{reported.length}/{totalMembers}</strong>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">{t('report.graded')}</span>
          <strong className="kpi-value accent-blue">{graded.length}/{totalMembers}</strong>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">{t('report.avgSelfReport')}</span>
          <strong className="kpi-value accent-violet">
            {reported.length > 0
              ? Math.round(
                  report.reduce((s, r) => s + (r.avgSelfReportPercent ?? 0), 0) / totalMembers,
                )
              : 0}%
          </strong>
        </div>
      </div>

      {/* ── SVG Chart ── */}
      <div className="report-card">
        <h3 className="section-title">Biểu đồ tự đánh giá trung bình theo thành viên</h3>
        <SvgBarChart data={chartData} />
        <p className="field-hint" style={{ marginTop: 8 }}>
          Trục Y: % tự đánh giá trung bình trên toàn bộ KR đã report. Giá trị &gt;100% = vượt mục tiêu.
        </p>
      </div>

      {/* ── Detail table ── */}
      <div className="report-card">
        <h3 className="section-title">Chi tiết từng thành viên</h3>
        <div className="table-scroll">
          <table className="report-table">
            <thead>
              <tr>
                <th>Thành viên</th>
                <th>Objectives</th>
                <th>Đã submit</th>
                <th>KR đã report</th>
                <th>Tự đánh giá TB</th>
                <th>Tiến độ TB</th>
                <th>Đã chấm điểm</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {report.map((r, i) => (
                <tr key={r.user.id} className={i % 2 === 0 ? 'tr-even' : 'tr-odd'}>
                  <td>
                    <div className="member-cell">
                      <div className="avatar" style={{ background: COLORS[i % COLORS.length] }}>
                        {r.user.name.split(' ').pop()?.charAt(0)}
                      </div>
                      <div>
                        <p className="member-name">{r.user.name}</p>
                        <p className="member-email">{r.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="cell-center">{r.totalObjectives}</td>
                  <td className="cell-center">{r.submittedObjectives}</td>
                  <td className="cell-center">
                    {r.reportedKrs}/{r.totalKrs}
                  </td>
                  <td>
                    {r.avgSelfReportPercent !== null ? (
                      <div>
                        <span
                          className={
                            (r.avgSelfReportPercent ?? 0) > 100
                              ? 'badge badge-over'
                              : (r.avgSelfReportPercent ?? 0) >= 60
                              ? 'badge badge-ok'
                              : 'badge badge-low'
                          }
                        >
                          {r.avgSelfReportPercent}%
                        </span>
                        <MiniBar
                          value={r.avgSelfReportPercent ?? 0}
                          max={120}
                          color={
                            (r.avgSelfReportPercent ?? 0) > 100
                              ? '#f59e0b'
                              : (r.avgSelfReportPercent ?? 0) >= 60
                              ? '#10b981'
                              : '#ef4444'
                          }
                        />
                      </div>
                    ) : (
                      <span className="badge badge-none">Chưa report</span>
                    )}
                  </td>
                  <td>
                    <span>{r.avgProgress}%</span>
                    <MiniBar value={r.avgProgress} max={100} color="#6366f1" />
                  </td>
                  <td className="cell-center">{r.gradedObjectives}</td>
                  <td>
                    {r.reportedKrs > 0 ? (
                      <span className="status-pill status-reported">✓ Đã báo cáo</span>
                    ) : (
                      <span className="status-pill status-pending">Chưa báo cáo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Objective drill-down ── */}
      <div className="report-card">
        <h3 className="section-title">Chi tiết Objective & Feedback</h3>
        {report.map((r, ri) =>
          r.objectives
            .filter((o) => o.isSubmitted && o.grade)
            .map((o) => (
              <div key={o.id} className="grade-row">
                <div className="grade-left">
                  <p className="grade-who">{r.user.name}</p>
                  <p className="grade-obj">{o.title}</p>
                </div>
                <div className="grade-right">
                  <StarDisplay stars={o.grade!.stars} />
                  <p className="grade-comment">"{o.grade!.comment}"</p>
                  <p className="grade-meta">— {o.grade!.graderName}, {o.grade!.gradedAt}</p>
                </div>
              </div>
            )),
        )}
      </div>
    </div>
  );
}
