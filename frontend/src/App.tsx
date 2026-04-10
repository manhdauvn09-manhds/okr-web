import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import {
  addKeyResult,
  createObjective,
  deleteKeyResult,
  getMemberObjectives,
  getMemberReport,
  getObjectives,
  getUsers,
  gradeObjective,
  login,
  selfReportKr,
  submitObjective,
  updateKrProgress,
} from './lib/api';
import { CreateObjectivePage } from './pages/CreateObjectivePage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ManagerReportPage } from './pages/ManagerReportPage';
import { MembersPage } from './pages/MembersPage';
import { ObjectiveDetailPage } from './pages/ObjectiveDetailPage';
import { MemberReportEntry, Objective, User } from './types';

const LOGIN_STORAGE_KEY = 'fokr_user_id';

export function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(() => {
    const raw = localStorage.getItem(LOGIN_STORAGE_KEY);
    return raw ? Number(raw) : null;
  });
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [memberObjectives, setMemberObjectives] = useState<Objective[]>([]);
  const [memberReport, setMemberReport] = useState<MemberReportEntry[]>([]);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const navigate = useNavigate();

  const currentUser = useMemo(
    () => (currentUserId === null ? undefined : users.find((u) => u.id === currentUserId)),
    [users, currentUserId],
  );
  const isManager = currentUser?.role === 'MANAGER';

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.users);
  };

  const loadObjectives = async () => {
    if (!currentUser) return;
    try {
      const res = await getObjectives(currentUser.id);
      setObjectives(res.objectives);
      setError('');
    } catch (e) { setError(String(e)); }
  };

  const loadMemberData = async () => {
    if (!currentUser || !isManager) return;
    try {
      const [moRes, rptRes] = await Promise.all([
        getMemberObjectives(currentUser.id),
        getMemberReport(currentUser.id),
      ]);
      setMemberObjectives(moRes.objectives);
      setMemberReport(rptRes.report);
    } catch { setMemberObjectives([]); setMemberReport([]); }
  };

  useEffect(() => { void loadUsers(); }, []);

  useEffect(() => {
    if (currentUserId === null || !currentUser) return;
    void loadObjectives();
    void loadMemberData();
  }, [currentUserId, currentUser?.id]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await login(email, password);
      setCurrentUserId(res.user.id);
      localStorage.setItem(LOGIN_STORAGE_KEY, String(res.user.id));
      setError('');
      setNotice({ type: 'success', message: `Chào mừng ${res.user.name}!` });
      navigate('/');
    } catch (e) { setError(String(e)); }
  };

  const handleLogout = () => {
    localStorage.removeItem(LOGIN_STORAGE_KEY);
    setCurrentUserId(null);
    setObjectives([]); setMemberObjectives([]); setMemberReport([]);
    setSelectedObjectiveId(null);
    navigate('/login');
  };

  const showNotice = (msg: string) => setNotice({ type: 'success', message: msg });
  const showError = (e: unknown) => setNotice({ type: 'error', message: String(e) });

  const selectedObjective = objectives.find((o) => o.id === selectedObjectiveId)
    ?? memberObjectives.find((o) => o.id === selectedObjectiveId);

  if (users.length === 0) return <div className="content">Đang tải dữ liệu...</div>;

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage users={users} onLogin={handleLogin} error={error} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route
        path="/"
        element={
          <AppLayout
            currentUser={currentUser}
            onLogout={handleLogout}
            isManager={isManager}
            error={error}
            notice={notice}
            onClearNotice={() => setNotice(null)}
          />
        }
      >
        <Route index element={
          <DashboardPage
            objectives={objectives}
            onOpenObjective={(id) => { setSelectedObjectiveId(id); navigate('/objective-detail'); }}
            onAddNewKr={(id) => { setSelectedObjectiveId(id); navigate('/objective-detail'); }}
          />
        } />
        <Route path="create" element={
          <CreateObjectivePage
            currentUser={currentUser}
            onCreate={async (payload) => {
              try {
                await createObjective(currentUser.id, payload);
                await loadObjectives();
                showNotice('Đã tạo objective thành công.');
                navigate('/');
              } catch (e) { showError(e); }
            }}
          />
        } />
        <Route path="members" element={
          <MembersPage
            objectives={memberObjectives}
            onOpenObjective={(id) => {
              setSelectedObjectiveId(id);
              navigate('/objective-detail');
            }}
          />
        } />
        <Route path="okr-all" element={
          <DashboardPage
            objectives={objectives}
            onOpenObjective={(id) => { setSelectedObjectiveId(id); navigate('/objective-detail'); }}
            onAddNewKr={(id) => { setSelectedObjectiveId(id); navigate('/objective-detail'); }}
          />
        } />
        <Route path="team-report" element={<ManagerReportPage report={memberReport} />} />
        <Route path="objective-detail" element={
          <ObjectiveDetailPage
            objective={selectedObjective}
            currentUserId={currentUser.id}
            isManager={isManager}
            onRefresh={async () => { await loadObjectives(); await loadMemberData(); }}
            onAddKr={async (payload) => {
              if (!selectedObjectiveId) return;
              try { await addKeyResult(currentUser.id, selectedObjectiveId, payload); await loadObjectives(); showNotice('Đã thêm KR.'); }
              catch (e) { showError(e); }
            }}
            onDeleteKr={async (krId) => {
              if (!selectedObjectiveId) return;
              try { await deleteKeyResult(currentUser.id, selectedObjectiveId, krId); await loadObjectives(); showNotice('Đã xóa KR.'); }
              catch (e) { showError(e); }
            }}
            onSubmitObjective={async () => {
              if (!selectedObjectiveId) return;
              try { await submitObjective(currentUser.id, selectedObjectiveId); await loadObjectives(); showNotice('Objective đã được submit.'); }
              catch (e) { showError(e); }
            }}
            onUpdateProgress={async (krId, progress) => {
              if (!selectedObjectiveId) return;
              try { await updateKrProgress(currentUser.id, selectedObjectiveId, krId, progress); await loadObjectives(); showNotice('Cập nhật tiến độ thành công.'); }
              catch (e) { showError(e); }
            }}
            onSelfReport={async (krId, percent) => {
              if (!selectedObjectiveId) return;
              try { await selfReportKr(currentUser.id, selectedObjectiveId, krId, percent); await loadObjectives(); showNotice('Đã lưu tự đánh giá.'); }
              catch (e) { showError(e); }
            }}
            onGrade={async (stars, comment) => {
              if (!selectedObjectiveId) return;
              try { await gradeObjective(currentUser.id, selectedObjectiveId, stars, comment); await loadObjectives(); await loadMemberData(); showNotice('Đã lưu đánh giá Objective.'); }
              catch (e) { showError(e); }
            }}
          />
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
