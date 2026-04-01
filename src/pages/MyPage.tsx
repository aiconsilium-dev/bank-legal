import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storage } from '../utils/storage';
import AppLayout from '../components/AppLayout';

export default function MyPage() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();

  return (
    <AppLayout activeNav="마이페이지" topbarLeft="마이페이지">
      <div style={{ padding: '48px 40px', maxWidth: '640px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>마이페이지 /</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px' }}>내 정보</h1>
        </div>
        <div style={{ borderTop: '1px solid #000' }}>
          {[
            { label: '이름', value: user?.name || '' },
            { label: '소속 기관', value: user?.institution || '' },
            { label: '역할', value: user?.role === 'teller' ? '행원 (여신 담당)' : user?.role === 'chairman' ? '이사장' : '조합원' },
            { label: '상담 건수', value: `${storage.getHistory().length}건` },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '14px', color: '#888' }}>{row.label}</span>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '32px', display: 'flex', gap: '8px' }}>
          <button onClick={() => { setUser({ ...user!, role: undefined }); navigate('/role'); }}
            style={{ flex: 1, padding: '12px', background: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>
            역할 변경
          </button>
          <button onClick={() => { setUser(null); navigate('/login'); }}
            style={{ flex: 1, padding: '12px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>
            로그아웃
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
