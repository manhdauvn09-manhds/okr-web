import { FormEvent, useMemo, useState } from 'react';
import { useI18n } from '../lib/i18n';
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
  const { t } = useI18n();

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
    <div className="page-container">
      <h1 className="page-title">{t('create.title')}</h1>
      <div className="card">
        <p className="meta-line" style={{ marginBottom: 20 }}>
          {t('create.hint')}
        </p>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="field-group">
            <label className="field-label">{t('create.labelTitle')}</label>
            <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder={t('create.placeholderTitle')} />
          </div>

          <div className="field-group">
            <label className="field-label">{t('create.labelDesc')}</label>
            <textarea className="field-input" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder={t('create.placeholderDesc')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field-group">
              <label className="field-label">{t('create.quarter')}</label>
              <input className="field-input" value={quarter} onChange={(e) => setQuarter(e.target.value)} required />
            </div>

            <div className="field-group">
              <label className="field-label">{t('create.type')}</label>
              <select
                className="field-select"
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
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            {t('create.save')}
          </button>
        </form>
      </div>
    </div>
  );
}
