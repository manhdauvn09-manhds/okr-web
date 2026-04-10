import { FormEvent, useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { User } from '../types';

const logo = 'https://mms.businesswire.com/media/20230801164604/en/698855/5/FPT_Software_Doc.jpg';

interface Props {
  users: User[];
  onLogin: (email: string, password: string) => Promise<void>;
  error?: string;
}

function derivePassword(email: string): string {
  return email.split('@')[0] + '@LoveAI';
}

export function LoginPage({ users, onLogin, error }: Props) {
  const { t } = useI18n();
  const [email, setEmail] = useState(users[0]?.email ?? '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (email) setPassword(derivePassword(email));
  }, [email]);

  useEffect(() => {
    if (users.length > 0 && !email) {
      setEmail(users[0].email);
    }
  }, [users]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <img src={logo} alt="FPT" className="fpt-logo" />
          <div>
            <h1 className="login-title">{t('login.title')}</h1>
            <p className="login-sub">{t('login.sub')}</p>
          </div>
        </div>

        <form onSubmit={submit} className="login-form">
          <div className="field-group">
            <label className="field-label">{t('login.account')}</label>
            <select
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-select"
            >
              {users.map((u) => (
                <option key={u.id} value={u.email}>
                  {u.email} — {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">{t('login.password')}</label>
            <div className="pw-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="field-hint">{t('login.passwordHint')}</p>
          </div>

          {error && <div className="banner error"><span>{error}</span></div>}

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? t('login.loading') : t('login.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}


