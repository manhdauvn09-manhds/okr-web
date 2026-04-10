import { FormEvent, useEffect, useState } from 'react';
import logo from '../assets/fpt-logo.svg';
import { User } from '../types';

interface Props {
  users: User[];
  onLogin: (email: string, password: string) => Promise<void>;
  error?: string;
}

function derivePassword(email: string): string {
  return email.split('@')[0] + '@LoveAI';
}

export function LoginPage({ users, onLogin, error }: Props) {
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
            <h1 className="login-title">FOKR Workspace</h1>
            <p className="login-sub">FPT Software – OKR Management System</p>
          </div>
        </div>

        <form onSubmit={submit} className="login-form">
          <div className="field-group">
            <label className="field-label">Tài khoản</label>
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
            <label className="field-label">Mật khẩu</label>
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
            <p className="field-hint">Mật khẩu mặc định: &lt;tên tài khoản&gt;@LoveAI</p>
          </div>

          {error && <div className="banner error"><span>{error}</span></div>}

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}


