import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RoleSelect from './pages/RoleSelect';
import Consult from './pages/Consult';
import Documents from './pages/Documents';
import Form from './pages/Form';
import Generating from './pages/Generating';
import Preview from './pages/Preview';
import Complete from './pages/Complete';
import Finance from './pages/Finance';
import Community from './pages/Community';
import Calculator from './pages/Calculator';
import MemberPortal from './pages/MemberPortal';
import ChairmanReport from './pages/ChairmanReport';
import LawyerConnect from './pages/LawyerConnect';
import DocumentDetail from './pages/DocumentDetail';
import DocumentsCatalog from './pages/DocumentsCatalog';
import RegulationSearch from './pages/RegulationSearch';
import Board from './pages/Board';
import Notice from './pages/Notice';
import History from './pages/History';
import MyPage from './pages/MyPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, setUser } = useApp();

  // URL hash 파라미터에서 role/inst/name 자동 설정
  useEffect(() => {
    const hash = window.location.hash;
    const qIdx = hash.indexOf('?');
    if (qIdx === -1) return;
    const params = new URLSearchParams(hash.slice(qIdx + 1));
    const role = params.get('role') as 'teller' | 'member' | 'chairman' | null;
    const inst = params.get('inst');
    const name = params.get('name');
    if (role && inst && name) {
      const newUser = {
        institution: decodeURIComponent(inst),
        name: decodeURIComponent(name),
        role,
      };
      setUser(newUser);
      // URL 정리 (파라미터 제거)
      window.history.replaceState(null, '', window.location.pathname + '#/');
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/role" element={<RequireAuth><RoleSelect /></RequireAuth>} />
      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/consult" element={<RequireAuth><Consult /></RequireAuth>} />
      <Route path="/consult/documents" element={<RequireAuth><Documents /></RequireAuth>} />
      <Route path="/consult/form" element={<RequireAuth><Form /></RequireAuth>} />
      <Route path="/consult/generating" element={<RequireAuth><Generating /></RequireAuth>} />
      <Route path="/consult/preview" element={<RequireAuth><Preview /></RequireAuth>} />
      <Route path="/consult/complete" element={<RequireAuth><Complete /></RequireAuth>} />
      <Route path="/finance" element={<RequireAuth><Finance /></RequireAuth>} />
      <Route path="/community" element={<RequireAuth><Community /></RequireAuth>} />
      <Route path="/calculator" element={<RequireAuth><Calculator /></RequireAuth>} />
      <Route path="/member-portal" element={<RequireAuth><MemberPortal /></RequireAuth>} />
      <Route path="/report" element={<RequireAuth><ChairmanReport /></RequireAuth>} />
      <Route path="/lawyer" element={<RequireAuth><LawyerConnect /></RequireAuth>} />
      <Route path="/document/:type" element={<RequireAuth><DocumentDetail /></RequireAuth>} />
      <Route path="/documents-catalog" element={<RequireAuth><DocumentsCatalog /></RequireAuth>} />
      <Route path="/regulation-search" element={<RequireAuth><RegulationSearch /></RequireAuth>} />
      <Route path="/board" element={<RequireAuth><Board /></RequireAuth>} />
      <Route path="/notice" element={<RequireAuth><Notice /></RequireAuth>} />
      <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
      <Route path="/mypage" element={<RequireAuth><MyPage /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}
