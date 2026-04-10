import { Link, Outlet, useLocation } from 'react-router-dom';
import { User } from '../../types';
import logo from '../../assets/fpt-logo.svg';

interface Props {
  currentUser: User;
  onLogout: () => void;
  isManager: boolean;
  error?: string;
  notice?: { type: 'success' | 'error'; message: string } | null;
  onClearNotice?: () => void;
}

export function AppLayout({ currentUser, onLogout, isManager, error, notice, onClearNotice }: Props) {
  const { pathname } = useLocation();
  const active = (p: string) => pathname === p ? 'nav-link active' : 'nav-link';

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="FPT" className="fpt-logo-sm" />
          <span className="brand-text">FOKR</span>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{currentUser.name.split(' ').pop()?.charAt(0)}</div>
          <div>
            <p className="user-name">{currentUser.name}</p>
            <p className="user-email">{currentUser.email}</p>
            <span className={`role-pill ${currentUser.role === 'MANAGER' ? 'role-manager' : 'role-employee'}`}>
              {currentUser.role}
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-group-label">Cá nhân</p>
          <Link className={active('/')} to="/">📋 OKR của tôi</Link>
          <Link className={active('/create')} to="/create">＋ Tạo Objective</Link>

          {isManager && (
            <>
              <p className="nav-group-label" style={{ marginTop: 16 }}>Quản lý</p>
              <Link className={active('/members')} to="/members">👥 Members</Link>
              <Link className={active('/okr-all')} to="/okr-all">🌐 OKR Toàn team</Link>
              <Link className={active('/team-report')} to="/team-report">📊 Báo cáo Team</Link>
            </>
          )}
        </nav>

        <button className="sidebar-logout" onClick={onLogout}>⎋ Đăng xuất</button>
      </aside>

      <main className="main-content">
        {notice && (
          <div className={`banner ${notice.type}`}>
            <span>{notice.message}</span>
            <button className="banner-close" onClick={onClearNotice}>✕</button>
          </div>
        )}
        {!notice && error && <div className="banner error"><span>{error}</span></div>}
        <Outlet />
      </main>
    </div>
  );
}
