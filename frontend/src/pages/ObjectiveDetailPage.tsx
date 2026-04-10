import { FormEvent, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { Objective } from '../types';

interface Props {
  objective: Objective | undefined;
  currentUserId: number;
  isManager: boolean;
  onRefresh: () => Promise<void>;
  onAddKr: (payload: { title: string; startValue: number; targetValue: number; deadline: string }) => Promise<void>;
  onDeleteKr: (krId: number) => Promise<void>;
  onSubmitObjective: () => Promise<void>;
  onUpdateProgress: (krId: number, progress: number) => Promise<void>;
  onSelfReport: (krId: number, percent: number) => Promise<void>;
  onGrade: (stars: number, comment: string) => Promise<void>;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span className="star-picker">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={(hovered || value) >= s ? 'star on' : 'star off'}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onChange(s)}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export function ObjectiveDetailPage({
  objective,
  currentUserId,
  isManager,
  onRefresh,
  onAddKr,
  onDeleteKr,
  onSubmitObjective,
  onUpdateProgress,
  onSelfReport,
  onGrade,
}: Props) {
  const [title, setTitle] = useState('');
  const [startValue, setStartValue] = useState(0);
  const [targetValue, setTargetValue] = useState(100);
  const [deadline, setDeadline] = useState('2026-06-30');
  const [reportValues, setReportValues] = useState<Record<number, string>>({});
  const [gradeStars, setGradeStars] = useState(0);
  const [gradeComment, setGradeComment] = useState('');
  const [grading, setGrading] = useState(false);
  const { t } = useI18n();

  if (!objective) {
    return (
      <div className="empty-state">
        <p>{t('detail.select')}</p>
      </div>
    );
  }

  const canMutateKr = !objective.isSubmitted && objective.status !== 'APPROVED';
  const isOwner = objective.ownerId === currentUserId;

  const overallProgress =
    objective.keyResults.length > 0
      ? Math.round(objective.keyResults.reduce((s, k) => s + k.progress, 0) / objective.keyResults.length)
      : 0;

  const avgSelfReport = (() => {
    const reported = objective.keyResults.filter((k) => k.selfReportPercent !== undefined);
    if (!reported.length) return null;
    return Math.round(reported.reduce((s, k) => s + (k.selfReportPercent ?? 0), 0) / reported.length);
  })();

  const addKr = async (e: FormEvent) => {
    e.preventDefault();
    await onAddKr({ title, startValue, targetValue, deadline });
    setTitle(''); setStartValue(0); setTargetValue(100); setDeadline('2026-06-30');
    await onRefresh();
  };

  const submitReport = async (krId: number) => {
    const raw = reportValues[krId];
    const val = Number(raw);
    if (!raw || isNaN(val)) return;
    await onSelfReport(krId, val);
    setReportValues((prev) => ({ ...prev, [krId]: '' }));
    await onRefresh();
  };

  const submitGrade = async (e: FormEvent) => {
    e.preventDefault();
    if (!gradeStars) return;
    setGrading(true);
    try {
      await onGrade(gradeStars, gradeComment);
      setGradeStars(0); setGradeComment('');
      await onRefresh();
    } finally { setGrading(false); }
  };

  return (
    <div className="page-container">
      {/* ── Header card ── */}
      <div className="detail-header-card">
        <div className="detail-header-top">
          <div>
            <h1 className="detail-title">{objective.title}</h1>
            <p className="detail-owner">👤 {objective.ownerName} · {objective.quarter}</p>
          </div>
          <div className="detail-chips">
            <span className={`chip chip-type-${objective.type.toLowerCase()}`}>{objective.type}</span>
            <span className={`chip chip-status-${objective.status.toLowerCase()}`}>{objective.status}</span>
          </div>
        </div>
        <p className="detail-desc">{objective.description}</p>

        <div className="detail-progress-row">
          <div className="progress-col">
            <p className="progress-label">{t('detail.actualProgress')}: <strong>{overallProgress}%</strong></p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.min(100, overallProgress)}%` }} />
            </div>
          </div>
          {avgSelfReport !== null && (
            <div className="progress-col">
              <p className="progress-label">{t('detail.selfReportAvg')}: <strong className={avgSelfReport > 100 ? 'text-amber' : 'text-green'}>{avgSelfReport}%</strong></p>
              <div className="progress-track">
                <div className="progress-fill self-fill" style={{ width: `${Math.min(100, avgSelfReport)}%` }} />
              </div>
            </div>
          )}
        </div>

        {!objective.isSubmitted && isOwner && (
          <button
            className="btn-primary"
            style={{ marginTop: 12 }}
            disabled={objective.keyResults.length < 1}
            onClick={onSubmitObjective}
          >
            {t('detail.submit')}
          </button>
        )}
      </div>

      {/* ── Grade display ── */}
      {objective.grade && (
        <div className="grade-display-card">
          <div className="grade-display-header">
            <span className="grade-display-label">{t('detail.gradeFromManager')}</span>
            <span className="star-display">
              {[1,2,3,4,5].map((s) => (
                <span key={s} className={s <= objective.grade!.stars ? 'star on' : 'star off'}>★</span>
              ))}
              <span className="grade-star-num"> {objective.grade.stars}/5</span>
            </span>
          </div>
          <p className="grade-comment-text">"{objective.grade.comment}"</p>
          <p className="grade-meta">— {objective.grade.graderName}, {objective.grade.gradedAt}</p>
        </div>
      )}

      {/* ── Grade form for manager ── */}
      {isManager && objective.isSubmitted && !objective.grade && (
        <div className="grade-form-card">
          <h3 className="section-title">{t('detail.gradeSection')}</h3>
          <form onSubmit={submitGrade} className="grade-form">
            <div className="field-group">
              <label className="field-label">{t('detail.gradeLabel')}</label>
              <StarPicker value={gradeStars} onChange={setGradeStars} />
            </div>
            <div className="field-group">
              <label className="field-label">{t('detail.commentLabel')}</label>
              <textarea
                className="field-input"
                value={gradeComment}
                onChange={(e) => setGradeComment(e.target.value)}
                placeholder={t('detail.commentPlaceholder')}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={!gradeStars || grading}>
              {grading ? t('detail.saving') : t('detail.saveGrade')}
            </button>
          </form>
        </div>
      )}

      {/* ── Key Results ── */}
      <div className="kr-section">
        <h2 className="section-title">{t('detail.krSection')} ({objective.keyResults.length}/3)</h2>

        {objective.keyResults.map((kr) => (
          <div key={kr.id} className="kr-card">
            <div className="kr-header">
              <h4 className="kr-title">{kr.title}</h4>
              <div className="kr-meta-chips">
                <span className="kr-deadline">📅 {kr.deadline}</span>
                {kr.selfReportPercent !== undefined && (
                  <span className={`badge ${kr.selfReportPercent > 100 ? 'badge-over' : kr.selfReportPercent >= 60 ? 'badge-ok' : 'badge-low'}`}>
                    Tự đánh giá: {kr.selfReportPercent}%
                  </span>
                )}
              </div>
            </div>

            <div className="kr-progress-row">
              <div className="progress-col">
                <p className="progress-label">Tiến độ: <strong>{kr.progress}%</strong></p>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${Math.min(100, kr.progress)}%` }} />
                </div>
              </div>
              {kr.selfReportPercent !== undefined && (
                <div className="progress-col">
                  <p className="progress-label">
                    Self-report: <strong className={kr.selfReportPercent > 100 ? 'text-amber' : 'text-green'}>{kr.selfReportPercent}%</strong>
                    {kr.selfReportedAt && <span className="field-hint"> ({kr.selfReportedAt})</span>}
                  </p>
                  <div className="progress-track">
                    <div className="progress-fill self-fill" style={{ width: `${Math.min(100, kr.selfReportPercent)}%` }} />
                  </div>
                </div>
              )}
            </div>

            <p className="kr-values">{t('detail.startValue')}: {kr.startValue} → {t('detail.targetValue')}: {kr.targetValue}</p>

            <div className="kr-actions">
              {!isManager && (
                <>
                  <button
                    className="btn-sm btn-primary"
                    onClick={() => void onUpdateProgress(kr.id, Math.min(100, kr.progress + 10))}
                  >
                    {t('detail.addProgress')}
                  </button>
                  {objective.isSubmitted && isOwner && (
                    <div className="self-report-inline">
                      <input
                        type="number"
                        className="field-input input-sm"
                        min={0} max={200}
                        placeholder="% tự đánh giá"
                        value={reportValues[kr.id] ?? ''}
                        onChange={(e) => setReportValues((p) => ({ ...p, [kr.id]: e.target.value }))}
                      />
                      <button
                        className="btn-sm btn-report"
                        onClick={() => void submitReport(kr.id)}
                        disabled={!reportValues[kr.id]}
                      >
                        {t('detail.report')}
                      </button>
                    </div>
                  )}
                </>
              )}
              {canMutateKr && isOwner && (
                <button className="btn-sm btn-danger" onClick={() => void onDeleteKr(kr.id)}>
                  {t('detail.deleteKr')}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* ── Add KR form ── */}
        {canMutateKr && isOwner && (
          <div className="add-kr-card">
            <h3 className="section-title">{t('detail.addKrTitle')}</h3>
            {objective.keyResults.length >= 3 && (
              <p className="field-hint">Đã đạt tối đa 3 KR. Xóa một KR để thêm mới.</p>
            )}
            <form onSubmit={addKr} className="add-kr-form">
              <div className="field-group">
                <label className="field-label">{t('detail.krTitleLabel')}</label>
                <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('detail.krTitlePlaceholder')} required disabled={objective.keyResults.length >= 3} />
              </div>
              <div className="form-row-3">
                <div className="field-group">
                  <label className="field-label">{t('detail.startLabel')}</label>
                  <input type="number" className="field-input" value={startValue} onChange={(e) => setStartValue(Number(e.target.value))} disabled={objective.keyResults.length >= 3} />
                </div>
                <div className="field-group">
                  <label className="field-label">{t('detail.targetLabel')}</label>
                  <input type="number" className="field-input" value={targetValue} onChange={(e) => setTargetValue(Number(e.target.value))} disabled={objective.keyResults.length >= 3} />
                </div>
                <div className="field-group">
                  <label className="field-label">{t('detail.deadlineLabel')}</label>
                  <input type="date" className="field-input" value={deadline} onChange={(e) => setDeadline(e.target.value)} disabled={objective.keyResults.length >= 3} />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={objective.keyResults.length >= 3}>{t('detail.addKrBtn')}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}


interface Props {
  objective: Objective | undefined;
  onRefresh: () => Promise<void>;
  onAddKr: (payload: {
    title: string;
    startValue: number;
    targetValue: number;
    deadline: string;
  }) => Promise<void>;
  onDeleteKr: (krId: number) => Promise<void>;
  onSubmitObjective: () => Promise<void>;
  onUpdateProgress: (krId: number, progress: number) => Promise<void>;
}
