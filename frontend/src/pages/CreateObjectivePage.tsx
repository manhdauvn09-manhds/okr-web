import { FormEvent, useMemo, useState } from 'react';
import { User } from '../types';

interface Props {
  currentUser: User;
  onCreate: (payload: {
    title: string;
    description: string;
    quarter: string;
    type: 'PERSONAL' | 'TEAM';
  }) => Promise<void>;
}

export function CreateObjectivePage({ currentUser, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quarter, setQuarter] = useState('Q2/2026');
  const [type, setType] = useState<'PERSONAL' | 'TEAM'>('PERSONAL');

  const allowedTypes = useMemo(() => {
    return currentUser.role === 'MANAGER' ? ['PERSONAL', 'TEAM'] : ['PERSONAL'];
  }, [currentUser.role]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await onCreate({ title, description, quarter, type });
    setTitle('');
    setDescription('');
    setQuarter('Q2/2026');
    setType('PERSONAL');
  };

  return (
    <div className="card">
      <h1>Create Objective</h1>
      <p className="meta-line">
        Owner is automatically the current user. Employees can create only PERSONAL objectives.
      </p>
      <form onSubmit={submit} className="grid">
        <label className="field-label">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label className="field-label">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label className="field-label">Quarter</label>
        <input value={quarter} onChange={(e) => setQuarter(e.target.value)} required />

        <label className="field-label">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'PERSONAL' | 'TEAM')}
          required
        >
          {allowedTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button type="submit">Save Objective</button>
      </form>
    </div>
  );
}
