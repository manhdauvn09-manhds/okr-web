import { Link, Outlet, useLocation } from 'react-router-dom';
import { useI18n, Lang, LANG_LABELS, LANG_SHORT, FLAG_URLS } from '../../lib/i18n';
import { User } from '../../types';

const logo = 'https://mms.businesswire.com/media/20230801164604/en/698855/5/FPT_Software_Doc.jpg';

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
  const { t, lang, setLang } = useI18n();
  const active = (p: string) => pathname === p ? 'nav-link active' : 'nav-link';
  const manualActive = (p: string) => pathname === p ? 'nav-link manual-link active' : 'nav-link manual-link';

  return (
    <div className="app-shell">
      {/* ── Top Header ── */}
      <header className="top-header">
        <div className="top-header-left">
          <img src={logo} alt="FPT Software" className="header-logo" />
          <span className="header-title">{t('header.title')}</span>
        </div>
        <div className="top-header-right">
          <span className="header-user-name">{currentUser.name}</span>
          <span className={`role-pill ${currentUser.role === 'MANAGER' ? 'role-manager' : 'role-employee'}`}>
            {currentUser.role}
          </span>
          <div className="lang-btn-group">
            {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
              <button
                key={l}
                className={`lang-btn ${lang === l ? 'lang-btn-active' : ''}`}
                onClick={() => setLang(l)}
                title={LANG_LABELS[l]}
              >
                <img src={FLAG_URLS[l]} alt={LANG_SHORT[l].code} className="lang-flag-img" />
                <span className="lang-code">{LANG_SHORT[l].code}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
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
            <p className="nav-group-label">{t('nav.personal')}</p>
            <Link className={active('/')} to="/">{t('nav.myOkr')}</Link>
            <Link className={active('/create')} to="/create">{t('nav.createObj')}</Link>
            <Link className={active('/subsidiaries')} to="/subsidiaries">{t('nav.subsidiaries')}</Link>

            {isManager && (
              <>
                <p className="nav-group-label" style={{ marginTop: 16 }}>{t('nav.management')}</p>
                <Link className={active('/members')} to="/members">{t('nav.members')}</Link>
                <Link className={active('/okr-all')} to="/okr-all">{t('nav.okrAll')}</Link>
                <Link className={active('/team-report')} to="/team-report">{t('nav.teamReport')}</Link>
                <Link className={active('/delegation')} to="/delegation">{t('nav.delegation')}</Link>
              </>
            )}

            <div className="nav-manual-divider" />
            <p className="nav-group-label nav-manual-label">{t('nav.manualGroup')}</p>
            <Link className={manualActive('/manual')} to="/manual">{t('nav.manualOverview')}</Link>
          </nav>

          <button className="sidebar-logout" onClick={onLogout}>{t('nav.logout')}</button>
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

      {/* ── Footer ── */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <img src={logo} alt="FPT Software" className="footer-logo" />
            <div>
              <p className="footer-company">{t('footer.company')}</p>
              <p className="footer-address">{t('footer.address')}</p>
            </div>
          </div>
          <div className="footer-center">
            <p className="footer-link-title">{t('footer.links')}</p>
            <a href="https://fptsoftware.com/" target="_blank" rel="noopener noreferrer" className="footer-link">FPT Software</a>
            <a href="https://fpt.com/" target="_blank" rel="noopener noreferrer" className="footer-link">FPT Corporation</a>
            <a href="https://career.fpt-software.com/" target="_blank" rel="noopener noreferrer" className="footer-link">{t('footer.recruitment')}</a>
          </div>
          <div className="footer-right">
            <p className="footer-link-title">{t('footer.support')}</p>
            <p className="footer-text">Hotline: (+84) 243 768 9048</p>
            <p className="footer-text">Email: support@fpt.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
