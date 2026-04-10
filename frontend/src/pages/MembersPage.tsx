import { useMemo, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { Objective } from '../types';

interface Props {
  objectives: Objective[];
  onOpenObjective: (id: number) => void;
}

export function MembersPage({ objectives, onOpenObjective }: Props) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PERSONAL' | 'TEAM'>('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return objectives
      .filter((o) => (typeFilter === 'ALL' ? true : o.type === typeFilter))
      .filter((o) => !q || o.title.toLowerCase().includes(q) || o.ownerName.toLowerCase().includes(q));
  }, [objectives, query, typeFilter]);

  return (
    <div className="page-container">
      <h1 className="page-title">{t('members.title')}</h1>
      <p className="meta-line">{t('members.hint')}</p>

      <div className="filter-bar two-col">
        <input className="field-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('members.searchPlaceholder')} />
        <select className="field-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}>
          <option value="ALL">{t('dash.allType')}</option>
          <option value="PERSONAL">Personal</option>
          <option value="TEAM">Team</option>
        </select>
      </div>

      {filtered.map((o) => {
        const avgP = o.keyResults.length > 0
          ? Math.round(o.keyResults.reduce((s, k) => s + k.progress, 0) / o.keyResults.length)
          : 0;
        return (
          <div className="card" key={o.id}>
            <div className="card-header">
              <div>
                <h3 className="card-title">{o.title}</h3>
                <p className="meta-line">👤 {o.ownerName} · {o.quarter}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <span className={`chip chip-type-${o.type.toLowerCase()}`}>{o.type}</span>
                <span className={`chip chip-status-${o.status.toLowerCase()}`}>{o.status}</span>
                {o.grade && (
                  <span className="chip chip-graded">
                    {'★'.repeat(o.grade.stars)} {o.grade.stars}/5
                  </span>
                )}
              </div>
            </div>
            <div className="progress-wrap" style={{ marginTop: 8 }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(100, avgP)}%` }} />
              </div>
              <span className="meta-line">{avgP}% tiến độ · {o.keyResults.length} KR</span>
            </div>
            <button className="btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => onOpenObjective(o.id)}>{t('dash.viewDetail')}</button>
          </div>
        );
      })}
      {filtered.length === 0 && <p className="meta-line">{t('members.noResult')}</p>}
    </div>
  );
}


interface Props {
  objectives: Objective[];
}
