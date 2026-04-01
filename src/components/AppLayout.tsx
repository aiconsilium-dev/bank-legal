import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storage } from '../utils/storage';

interface NavItem {
  label: string;
  action?: () => void;
  active?: boolean;
  external?: boolean;
  dividerAfter?: boolean;
  highlight?: boolean;
}

interface AppLayoutProps {
  children: React.ReactNode;
  activeNav?: string;
  topbarLeft?: React.ReactNode;
  topbarRight?: React.ReactNode;
}

const HOMELAWYER = 'https://www.homelawyer.kr/?__xq7k2mz9p4r3tn8vw6jy5hd0cb1sf2el4ng8ouaq=dongtan-gh-lake2';

export default function AppLayout({ children, activeNav, topbarLeft, topbarRight }: AppLayoutProps) {
  const navigate = useNavigate();
  const { user, setUser } = useApp();
  const role = user?.role;

  const clear = () => storage.clearCurrentSession();

  // ── 역할별 메뉴 정의 ──────────────────────────────
  const tellerNav: NavItem[] = [
    { label: '집변 법률상담', external: true, highlight: true },
    { label: '상황별 서류 작성', action: () => { clear(); navigate('/consult'); } },
    { label: '서류 자동화', action: () => navigate('/documents-catalog') },
    { label: '채권계산기', action: () => navigate('/calculator') },
    { label: 'AI 법령·지침 검색', action: () => navigate('/regulation-search') },
    { label: '상담 내역', action: () => navigate('/history') },
    { label: '마이페이지', action: () => navigate('/mypage') },
  ];

  const chairmanNav: NavItem[] = [
    { label: '집변 법률상담', external: true, highlight: true },
    { label: '경영 대시보드', action: () => navigate('/') },
    { label: '연체·법적조치 현황', action: () => navigate('/report') },
    { label: 'AI 법령·지침 검색', action: () => navigate('/regulation-search') },
    { label: '조합원 게시판', action: () => navigate('/board') },
    { label: '공지 발송', action: () => navigate('/notice') },
    { label: '채권계산기', action: () => navigate('/calculator') },
    { label: '마이페이지', action: () => navigate('/mypage') },
  ];

  // 조합원은 사이드바 없음 (모바일형 헤더)
  const navItems = role === 'chairman' ? chairmanNav : tellerNav;
  const isMember = role === 'member';

  const handleNav = (item: NavItem) => {
    if (item.external) {
      window.open(HOMELAWYER, '_blank');
    } else if (item.action) {
      item.action();
    }
  };

  const isActive = (item: NavItem) =>
    activeNav ? item.label === activeNav : false;

  // ── 조합원 — 모바일형 헤더만 ───────────────────────
  if (isMember) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <header style={{
          borderBottom: '1px solid #e5e5e5',
          padding: '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: '#fff', zIndex: 10,
        }}>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.02em' }}>뱅크법률집사</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: '#888' }}>{user?.name}님</span>
            <button
              onClick={() => { setUser({ ...user!, role: undefined }); navigate('/role'); }}
              style={{ fontSize: '11px', color: '#bbb', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#000')}
              onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}>
              역할 변경
            </button>
          </div>
        </header>
        <main>
          {(topbarLeft || topbarRight) && (
            <div style={{ borderBottom: '1px solid #e5e5e5', padding: '12px 24px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', color: '#888' }}>{topbarLeft}</div>
              <div style={{ fontSize: '12px', color: '#bbb' }}>{topbarRight}</div>
            </div>
          )}
          {children}
        </main>
      </div>
    );
  }

  // ── 행원 / 이사장 — 사이드바 레이아웃 ─────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff' }}>
      {/* 사이드바 */}
      <aside style={{ width: '200px', borderRight: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* 로고 */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #e5e5e5', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#000', letterSpacing: '0.02em' }}>뱅크법률집사</div>
          <div style={{ fontSize: '10px', color: '#aaa', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.institution}
          </div>
        </div>

        {/* 네비 */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = isActive(item);
            if (item.highlight) {
              return (
                <div key={item.label} style={{ marginBottom: '16px' }}>
                  <button
                    onClick={() => handleNav(item)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#fff',
                      background: '#000',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                    }}>
                    {item.label}
                    {item.external && <span style={{ fontSize: '9px', marginLeft: '4px', opacity: 0.5 }}>↗</span>}
                  </button>
                </div>
              );
            }
            return (
              <div key={item.label}>
                <button
                  onClick={() => handleNav(item)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: active ? 600 : 500,
                    color: active ? '#000' : '#888',
                    background: active ? '#f5f5f5' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    fontFamily: 'inherit',
                    transition: 'color 0.1s',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#000';
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#888';
                  }}>
                  {item.label}
                </button>
                {item.dividerAfter && (
                  <div style={{ height: '1px', background: '#e5e5e5', margin: '6px 0' }}/>
                )}
              </div>
            );
          })}
        </nav>

        {/* 유저 */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #e5e5e5', position: 'sticky', bottom: 0, background: '#fff' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#000' }}>{user?.name}</div>
          <div style={{ fontSize: '10px', color: '#bbb', marginTop: '2px' }}>
            {role === 'teller' ? '여신 담당' : role === 'chairman' ? '이사장' : ''}
          </div>
          <button
            onClick={() => { setUser({ ...user!, role: undefined }); navigate('/role'); }}
            style={{ marginTop: '6px', fontSize: '11px', color: '#bbb', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#000')}
            onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}>
            역할 변경 →
          </button>
        </div>
      </aside>

      {/* 메인 */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {(topbarLeft || topbarRight) && (
          <div style={{ borderBottom: '1px solid #e5e5e5', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ fontSize: '14px', color: '#888' }}>{topbarLeft}</div>
            <div style={{ fontSize: '12px', color: '#bbb' }}>{topbarRight}</div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
