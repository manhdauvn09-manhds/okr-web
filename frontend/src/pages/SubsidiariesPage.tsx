import { useI18n } from '../lib/i18n';
import { SubsidiariesData } from '../types';

interface Props {
  data: SubsidiariesData | null;
  onGoToObjective: (objectiveId: number) => void;
}

export function SubsidiariesPage({ data, onGoToObjective }: Props) {
  const { t } = useI18n();

  if (!data) {
    return <div className="page-container"><p className="meta-line">{t('login.loading2')}</p></div>;
  }

  const hasPending =
    data.myDraftCount > 0 ||
    data.mySelfReportPendingCount > 0 ||
    (data.isManager && (data.objectivesPendingGrade > 0 || data.membersNotSubmitted.length > 0));

  return (
    <div className="page-container">
      <h1 className="page-title">{t('subs.title')}</h1>

      {/* ── My Tasks ── */}
      <div className="subs-section">
        <h2 className="section-title">{t('subs.myTasks')}</h2>

        {/* Draft objectives */}
        {data.myDraftCount > 0 && (
          <div className="subs-card subs-card-warning">
            <div className="subs-card-header">
              <span className="subs-card-icon">📝</span>
              <span className="subs-card-label">{t('subs.draftObj')}</span>
              <span className="subs-badge badge-warning">{data.myDraftCount}</span>
            </div>
            <div className="subs-card-body">
              {data.myDraftObjectives.map((o) => (
                <div key={o.id} className="subs-item">
                  <div className="subs-item-info">
                    <span className="subs-item-title">{o.title}</span>
                    <span className="subs-item-meta">
                      {o.krCount > 0 ? `${o.krCount} KR` : t('subs.noKr')}
                    </span>
                  </div>
                  <button className="btn-sm btn-primary" onClick={() => onGoToObjective(o.id)}>
                    {t('subs.goSubmit')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KRs without self-report */}
        {data.mySelfReportPendingCount > 0 && (
          <div className="subs-card subs-card-info">
            <div className="subs-card-header">
              <span className="subs-card-icon">📊</span>
              <span className="subs-card-label">{t('subs.selfReportPending')}</span>
              <span className="subs-badge badge-info">{data.mySelfReportPendingCount}</span>
            </div>
            <div className="subs-card-body">
              {data.myKrsWithoutSelfReport.map((kr) => (
                <div key={`${kr.objectiveId}-${kr.krId}`} className="subs-item">
                  <div className="subs-item-info">
                    <span className="subs-item-title">{kr.krTitle}</span>
                    <span className="subs-item-meta">{kr.objectiveTitle}</span>
                  </div>
                  <button className="btn-sm btn-primary" onClick={() => onGoToObjective(kr.objectiveId)}>
                    {t('subs.goSelfReport')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.myDraftCount === 0 && data.mySelfReportPendingCount === 0 && (
          <p className="subs-all-done">{t('subs.allDone')}</p>
        )}
      </div>

      {/* ── Manager Tasks ── */}
      {data.isManager && (
        <div className="subs-section">
          <h2 className="section-title">{t('subs.managerTasks')}</h2>

          {/* Team overview stats */}
          <div className="subs-stats-grid">
            <div className="subs-stat">
              <span className="subs-stat-value">{data.totalTeamMembers}</span>
              <span className="subs-stat-label">{t('subs.totalMembers')}</span>
            </div>
            <div className="subs-stat">
              <span className="subs-stat-value accent-green">{data.membersFullySubmitted}</span>
              <span className="subs-stat-label">{t('subs.fullySubmitted')}</span>
            </div>
            <div className="subs-stat">
              <span className="subs-stat-value accent-amber">{data.membersNotSubmitted.length}</span>
              <span className="subs-stat-label">{t('subs.notFullySubmitted')}</span>
            </div>
            <div className="subs-stat">
              <span className="subs-stat-value accent-red">{data.objectivesPendingGrade}</span>
              <span className="subs-stat-label">{t('subs.pendingGrade')}</span>
            </div>
            <div className="subs-stat">
              <span className="subs-stat-value accent-blue">{data.objectivesGraded}</span>
              <span className="subs-stat-label">{t('subs.alreadyGraded')}</span>
            </div>
          </div>

          {/* Members not fully submitted */}
          {data.membersNotSubmitted.length > 0 && (
            <div className="subs-card subs-card-warning">
              <div className="subs-card-header">
                <span className="subs-card-icon">⚠️</span>
                <span className="subs-card-label">{t('subs.membersNotSubmitted')}</span>
                <span className="subs-badge badge-warning">{data.membersNotSubmitted.length}</span>
              </div>
              <div className="subs-card-body">
                {data.membersNotSubmitted.map((m) => (
                  <div key={m.memberId} className="subs-item">
                    <div className="subs-item-info">
                      <span className="subs-item-title">👤 {m.memberName}</span>
                      <span className="subs-item-meta">
                        {m.submittedObjectives}{t('subs.of')}{m.totalObjectives} {t('subs.submitted')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Objectives pending review */}
          {data.objectivesPendingGrade > 0 && (
            <div className="subs-card subs-card-danger">
              <div className="subs-card-header">
                <span className="subs-card-icon">⭐</span>
                <span className="subs-card-label">{t('subs.objPendingReview')}</span>
                <span className="subs-badge badge-danger">{data.objectivesPendingGrade}</span>
              </div>
              <div className="subs-card-body">
                {data.membersPendingReview.map((item) => (
                  <div key={item.objectiveId} className="subs-item">
                    <div className="subs-item-info">
                      <span className="subs-item-title">{item.objectiveTitle}</span>
                      <span className="subs-item-meta">👤 {item.memberName}</span>
                    </div>
                    <button className="btn-sm btn-primary" onClick={() => onGoToObjective(item.objectiveId)}>
                      {t('subs.goReview')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.membersNotSubmitted.length === 0 && data.objectivesPendingGrade === 0 && (
            <p className="subs-all-done">{t('subs.allDone')}</p>
          )}
        </div>
      )}

      {!hasPending && (
        <div className="subs-congrats">
          <p className="subs-congrats-text">{t('subs.allDone')}</p>
        </div>
      )}
    </div>
  );
}
