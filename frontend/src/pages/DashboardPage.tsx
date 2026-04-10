import { useMemo, useState } from 'react';
import { Objective } from '../types';

interface Props {
  objectives: Objective[];
  onOpenObjective: (id: number) => void;
  onAddNewKr: (id: number) => void;
}

export function DashboardPage({ objectives, onOpenObjective, onAddNewKr }: Props) {
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
    <div>
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Objectives</span>
          <strong>{objectives.length}</strong>
        </div>
        <div className="stat-card">
          <span>Total KRs</span>
          <strong>{totalKrs}</strong>
        </div>
        <div className="stat-card">
          <span>Submitted</span>
          <strong>{objectives.filter((o) => o.status === 'SUBMITTED').length}</strong>
        </div>
        <div className="stat-card">
          <span>Avg KR Progress</span>
          <strong>{averageProgress}%</strong>
        </div>
      </div>

      <div className="card filter-panel">
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by objective title or description"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="ALL">All status</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="ALL">All type</option>
            <option value="PERSONAL">Personal</option>
            <option value="TEAM">Team</option>
          </select>
        </div>
      </div>

      {filteredObjectives.map((o) => (
        <div className="card" key={o.id}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>{o.title}</h3>
            <span className="chip">
              {o.type} | {o.status}
            </span>
          </div>
          <p>{o.description}</p>
          <p className="meta-line">
            Quarter: {o.quarter} | KRs: {o.keyResults.length}/3
          </p>
          <div className="row">
            <button onClick={() => onOpenObjective(o.id)}>Detail</button>
            <button className="secondary" onClick={() => onAddNewKr(o.id)}>
              Add New KR
            </button>
          </div>
        </div>
      ))}
      {filteredObjectives.length === 0 && <p>No objectives matched your filters.</p>}
    </div>
  );
}
