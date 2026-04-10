import { useMemo, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { Objective } from '../types';

interface Props {
  objectives: Objective[];
  onOpenObjective: (id: number) => void;
  onAddNewKr: (id: number) => void;
}

export function DashboardPage({ objectives, onOpenObjective, onAddNewKr }: Props) {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | 'DRAFT' | 'SUBMITTED' | 'APPROVED'>('ALL');
  const [type, setType] = useState<'ALL' | 'PERSONAL' | 'TEAM'>('ALL');

  const totalKrs = useMemo(() => objectives.reduce((sum, o) => sum + o.keyResults.length, 0), [objectives]);

  const averageProgress = useMemo(() => {
    const all = objectives.flatMap((o) => o.keyResults);
    if (!all.length) return 0;
    return Math.round(all.reduce((sum, kr) => sum + kr.progress, 0) / all.length);
  }, [objectives]);

  const filteredObjectives = useMemo(() => {
    return objectives
      .filter((o) => (status === 'ALL' ? true : o.status === status))
      .filter((o) => (type === 'ALL' ? true : o.type === type))
      .filter((o) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q);
      });
  }, [objectives, search, status, type]);

  return (
    <div className="page-container">
      <h1 className="page-title">{t('dash.title')}</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <span>{t('dash.totalObj')}</span>
          <strong>{objectives.length}</strong>
        </div>
        <div className="stat-card">
          <span>{t('dash.totalKr')}</span>
          <strong>{totalKrs}</strong>
        </div>
        <div className="stat-card">
          <span>{t('dash.submitted')}</span>
          <strong>{objectives.filter((o) => o.status === 'SUBMITTED').length}</strong>
        </div>
        <div className="stat-card">
          <span>{t('dash.avgProgress')}</span>
          <strong>{averageProgress}%</strong>
        </div>
      </div>

      <div className="filter-bar">
        <input
          className="field-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('dash.searchPlaceholder')}
        />
        <select className="field-select" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <option value="ALL">{t('dash.allStatus')}</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="APPROVED">Approved</option>
        </select>
        <select className="field-select" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
          <option value="ALL">{t('dash.allType')}</option>
          <option value="PERSONAL">Personal</option>
          <option value="TEAM">Team</option>
        </select>
      </div>

      {filteredObjectives.map((o) => {
        const canAddKr = !o.isSubmitted && o.status !== 'APPROVED' && o.keyResults.length < 3;
        return (
          <div className="card" key={o.id}>
            <div className="card-header">
              <div>
                <h3 className="card-title">{o.title}</h3>
                <p className="meta-line" style={{ marginTop: 4 }}>{o.description}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <span className={`chip chip-type-${o.type.toLowerCase()}`}>{o.type}</span>
                <span className={`chip chip-status-${o.status.toLowerCase()}`}>{o.status}</span>
              </div>
            </div>
            <p className="meta-line" style={{ marginTop: 8 }}>
              📅 {o.quarter} &nbsp;·&nbsp; Key Results: {o.keyResults.length}/3
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button className="btn-primary btn-sm" onClick={() => onOpenObjective(o.id)}>
                {t('dash.viewDetail')}
              </button>
              <button
                className="secondary btn-sm"
                onClick={() => onAddNewKr(o.id)}
                disabled={!canAddKr}
              >
                {t('dash.addKr')}
              </button>
            </div>
          </div>
        );
      })}
      {filteredObjectives.length === 0 && (
        <div className="empty-state">
          <p>Không có objective nào phù hợp với bộ lọc.</p>
        </div>
      )}
    </div>
  );
}
