import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storage } from '../utils/storage';
import type { ConsultHistory } from '../types';
import AppLayout from '../components/AppLayout';


/* ══ 행원 대시보드 ══ */
function TellerDashboard() {
  const { user } = useApp();
  const navigate = useNavigate();
  const history: ConsultHistory[] = storage.getHistory();
  const thisMonth = new Date().toISOString().slice(0, 7);
  const CASE_LABELS: Record<string, string> = {
    foreclosure: '임의경매', notice: '내용증명', payment_order: '지급명령',
    injunction: '가압류', attachment_order: '채권압류', member_dispute: '조합원분쟁', contribution_dispute: '출자금반환',
  };
  const ALERTS = [
    { urgent: true, title: '연체 94일 — 경매 신청 권고', body: 'A-2024-0312 · 담보 있음', time: '방금 전' },
    { urgent: false, title: '가압류 결정 인용', body: '박◯◯ 예금채권 3,200만원', time: '1시간 전' },
    { urgent: false, title: '금감원 민원 회신 필요', body: '이◯◯ 금리인하요구 거부', time: '3시간 전' },
  ];

  return (
    <AppLayout activeNav="대시보드"
      topbarLeft={`${user?.institution} — 여신 법무`}
      topbarRight="2026. 03">

      <div style={{ padding: '48px 40px', flex: 1 }}>
        {/* 인사 */}
        <div style={{ marginBottom: '48px', borderBottom: '1px solid #e5e5e5', paddingBottom: '32px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '12px' }}>대시보드 /</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', color: '#000', marginBottom: '8px' }}>
            {user?.name}님, 안녕하세요
          </h1>
          <p style={{ fontSize: '14px', color: '#888' }}>
            처리 대기 <span style={{ color: '#000', fontWeight: 600 }}>2건</span>이 있습니다
          </p>
        </div>

        {/* 빠른 실행 */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '20px' }}>빠른 실행 /</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', border: '1px solid #e5e5e5' }}>
            {[
              { alpha: 'A', label: '상황별 서류 작성', desc: '연체·가압류·경매 등 상황 선택 후 서류 자동 생성', action: () => { storage.clearCurrentSession(); navigate('/consult'); } },
              { alpha: 'B', label: '채권계산기', desc: '원금·이자·지연손해금 자동 계산', action: () => navigate('/calculator') },
              { alpha: 'C', label: '금융 안내', desc: '금융 상품·금리·조합 공지', action: () => navigate('/finance') },
              { alpha: 'D', label: '집변 법률 상담', desc: '무료 · 법무법인 더 에이치 황해', action: () => window.open('https://www.homelawyer.kr/?__xq7k2mz9p4r3tn8vw6jy5hd0cb1sf2el4ng8ouaq=dongtan-gh-lake2', '_blank') },
            ].map(q => (
              <button key={q.label} onClick={q.action}
                style={{ padding: '20px', textAlign: 'left', background: '#fff', border: 'none', cursor: 'pointer', borderRight: '1px solid #e5e5e5', transition: 'background 0.1s', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#f9f9f9'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#fff'}>
                <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '10px' }}>{q.alpha} /</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#000', marginBottom: '4px' }}>{q.label}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{q.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 통계 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', border: '1px solid #e5e5e5', marginBottom: '48px' }}>
          {[
            { label: '이번 달 상담', value: history.filter(h => h.date.startsWith(thisMonth)).length },
            { label: '완료된 서류', value: history.filter(h => h.status === 'completed').length },
            { label: '총 상담 누적', value: history.length },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '20px', borderRight: i < 2 ? '1px solid #e5e5e5' : 'none' }}>
              <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.08em', marginBottom: '8px' }}>{s.label}</div>
              <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-2px', color: '#000' }}>{s.value}<span style={{ fontSize: '16px', fontWeight: 500, color: '#bbb', marginLeft: '4px' }}>건</span></div>
            </div>
          ))}
        </div>

        {/* 하단 2컬럼 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* 이력 */}
          <div>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span>최근 상담 /</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#aaa', fontFamily: 'inherit' }}>전체 보기 →</button>
            </div>
            {history.length === 0 ? (
              <div style={{ padding: '32px 0', borderTop: '1px solid #e5e5e5' }}>
                <div style={{ fontSize: '13px', color: '#bbb', marginBottom: '12px' }}>상담 이력이 없습니다</div>
                <button onClick={() => navigate('/consult')} style={{ fontSize: '14px', color: '#000', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>첫 상담 시작하기 →</button>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #e5e5e5' }}>
                {history.slice(0, 6).map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>{CASE_LABELS[item.caseType] || item.caseType}</div>
                      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{item.date}</div>
                    </div>
                    <span style={{ fontSize: '11px', color: item.status === 'completed' ? '#000' : '#888', fontWeight: item.status === 'completed' ? 600 : 400 }}>
                      {item.status === 'completed' ? '완료' : '진행중'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 알림 */}
          <div>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>알림 /</div>
            <div style={{ borderTop: '1px solid #e5e5e5' }}>
              {ALERTS.map((n, i) => (
                <div key={i} style={{ padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '3px' }}>
                    {n.urgent && <span style={{ fontSize: '10px', fontWeight: 700, color: '#c00', flexShrink: 0, marginTop: '1px' }}>긴급</span>}
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>{n.title}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '3px' }}>{n.body}</div>
                  <div style={{ fontSize: '11px', color: '#ccc' }}>{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

/* ══ 조합원 대시보드 ══ */
function MemberDashboard() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();

  const HOMELAWYER = 'https://www.homelawyer.kr/?__xq7k2mz9p4r3tn8vw6jy5hd0cb1sf2el4ng8ouaq=dongtan-gh-lake2';
  const SERVICES = [
    { alpha: '—', label: '집변 법률상담', desc: '즉시 상담 가능 · 전담 변호사 연결', action: () => window.open(HOMELAWYER, '_blank'), highlight: true },
    { alpha: 'A', label: '내 법률 현황 조회', desc: '현재 법적 단계 확인 및 대응 안내', action: () => navigate('/member-portal') },
    { alpha: 'B', label: 'AI 서류 안내', desc: '제출 필요 서류 AI 자동 안내 및 작성 보조', action: () => { storage.clearCurrentSession(); navigate('/consult'); } },
    { alpha: 'C', label: '대출 기한 연장 신청', desc: '만기 연장 신청서 작성 및 안내', action: () => { storage.clearCurrentSession(); navigate('/consult'); } },
    { alpha: 'D', label: '담보물 변경 신청', desc: '담보 교체·추가 신청서 안내', action: () => { storage.clearCurrentSession(); navigate('/consult'); } },
    { alpha: 'E', label: '커뮤니티 · 공지사항', desc: '조합 공지 확인 및 건의사항 게시판', action: () => navigate('/community') },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 헤더 */}
      <header style={{ borderBottom: '1px solid #e5e5e5', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#000', letterSpacing: '0.02em' }}>뱅크법률집사</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#888' }}>{user?.name}님</span>
          <button onClick={() => { setUser({ ...user!, role: undefined }); navigate('/role'); }}
            style={{ fontSize: '12px', color: '#bbb', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#000')}
            onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}>
            역할 변경
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>
        {/* 상태 */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #e5e5e5', paddingBottom: '32px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '12px' }}>{user?.institution} /</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '24px' }}>{user?.name}님</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', border: '1px solid #e5e5e5' }}>
            {[
              { label: '대출 잔액', value: '2,400만원' },
              { label: '연체', value: '없음' },
              { label: '출자금', value: '300만원' },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: '12px', borderRight: i < 2 ? '1px solid #e5e5e5' : 'none' }}>
                <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>{s.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 서비스 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>이용 가능한 서비스 /</div>
          <div style={{ borderTop: '1px solid #e5e5e5' }}>
            {SERVICES.map(s => (
              <button key={s.label} onClick={s.action}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '16px 12px',
                  background: (s as any).highlight ? '#000' : 'transparent',
                  border: 'none', borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.1s',
                } as React.CSSProperties}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = (s as any).highlight ? '#222' : '#f9f9f9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = (s as any).highlight ? '#000' : 'transparent'; }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    {!(s as any).highlight && <span style={{ fontSize: '10px', color: '#ccc' }}>{s.alpha} /</span>}
                    <span style={{ fontSize: '14px', fontWeight: (s as any).highlight ? 700 : 500, color: (s as any).highlight ? '#fff' : '#000' }}>{s.label}</span>
                    {(s as any).highlight && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: '2px' }}>즉시 상담 가능</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: (s as any).highlight ? 'rgba(255,255,255,0.55)' : '#999' }}>{s.desc}</div>
                </div>
                <span style={{ color: (s as any).highlight ? 'rgba(255,255,255,0.5)' : '#ccc', fontSize: '16px', flexShrink: 0 }}>→</span>
              </button>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}

/* ══ 이사장 대시보드 ══ */
function ChairmanDashboard() {
  const { user } = useApp();
  const navigate = useNavigate();

  const KPI = [
    { alpha: 'A', label: '이번 달 법적 조치', value: '7', unit: '건', delta: '전월 대비 -2' },
    { alpha: 'B', label: '연체 90일 이상', value: '8', unit: '명', delta: '전월 대비 +1' },
    { alpha: 'C', label: '변호사 비용 절감', value: '340', unit: '만원', delta: '이번 달 기준' },
    { alpha: 'D', label: 'BEP 달성률', value: '94', unit: '%', delta: '16/17개 조합' },
  ];

  const OVERDUE = [
    { id: 'A-2024-0312', name: '김◯◯', days: 94, amount: '4,200만', col: '담보', action: '경매 신청', urgent: true },
    { id: 'A-2023-0891', name: '이◯◯', days: 127, amount: '1,800만', col: '무담보', action: '지급명령', urgent: true },
    { id: 'A-2024-0078', name: '박◯◯', days: 91, amount: '2,900만', col: '담보', action: '내용증명', urgent: false },
    { id: 'A-2024-0145', name: '최◯◯', days: 92, amount: '960만', col: '무담보', action: '추심명령', urgent: false },
  ];

  return (
    <AppLayout activeNav="대시보드"
      topbarLeft={`${user?.institution} — 경영 대시보드`}
      topbarRight="2026. 03">

      <div style={{ padding: '48px 40px' }}>
        {/* 헤더 */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #e5e5e5', paddingBottom: '28px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>경영 현황 /</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px' }}>{user?.name} 이사장님</h1>
        </div>

        {/* KPI */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>주요 지표 /</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', border: '1px solid #e5e5e5' }}>
            {KPI.map((k, i) => (
              <div key={k.alpha} style={{ padding: '20px', borderRight: i < 3 ? '1px solid #e5e5e5' : 'none' }}>
                <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px' }}>{k.alpha} /</div>
                <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1.5px', color: '#000' }}>
                  {k.value}<span style={{ fontSize: '14px', fontWeight: 500, color: '#bbb', marginLeft: '3px' }}>{k.unit}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '6px' }}>{k.label}</div>
                <div style={{ fontSize: '11px', color: '#ccc', marginTop: '3px' }}>{k.delta}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 연체 테이블 */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em' }}>연체 현황 (90일 이상) /</div>
            <button onClick={() => navigate('/consult')} className="btn btn-primary btn-sm">일괄 처리 →</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000' }}>
                {['번호', '성명', '연체', '잔액', '담보', '권고 조치', ''].map(h => (
                  <th key={h} style={{ padding: '8px 0', textAlign: 'left', fontSize: '11px', color: '#aaa', fontWeight: 500, letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OVERDUE.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #f0f0f0' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f9f9f9'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                  <td style={{ padding: '12px 0', fontFamily: 'monospace', fontSize: '11px', color: '#aaa' }}>{row.id}</td>
                  <td style={{ padding: '12px 0', fontWeight: 500 }}>{row.name}</td>
                  <td style={{ padding: '12px 0', fontWeight: row.urgent ? 700 : 400, color: row.urgent ? '#c00' : '#888' }}>{row.days}일</td>
                  <td style={{ padding: '12px 0', fontWeight: 500 }}>{row.amount}</td>
                  <td style={{ padding: '12px 0', color: '#888' }}>{row.col}</td>
                  <td style={{ padding: '12px 0', color: '#444' }}>{row.action}</td>
                  <td style={{ padding: '12px 0' }}>
                    <button onClick={() => navigate('/consult')} className="btn btn-outline btn-sm">처리</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 빠른 실행 */}
        <div>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>빠른 실행 /</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', border: '1px solid #e5e5e5' }}>
            {[
              { alpha: 'A', label: '이달 현황 보고서', desc: '법적 조치 통계 리포트', action: () => navigate('/report') },
              { alpha: 'B', label: '조합원·행원 공지 발송', desc: '금융 안내 → 공지 발송', action: () => navigate('/finance') },
              { alpha: 'C', label: '집변 법률 상담', desc: '무료 · 법무법인 더 에이치 황해', action: () => window.open('https://www.homelawyer.kr/?__xq7k2mz9p4r3tn8vw6jy5hd0cb1sf2el4ng8ouaq=dongtan-gh-lake2', '_blank') },
            ].map((a, i) => (
              <button key={a.alpha} onClick={a.action}
                style={{ padding: '20px', textAlign: 'left', background: '#fff', border: 'none', borderRight: i < 2 ? '1px solid #e5e5e5' : 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#f9f9f9'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#fff'}>
                <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '10px' }}>{a.alpha} /</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#000', marginBottom: '4px' }}>{a.label}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{a.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

/* ══ 분기 ══ */
export default function Dashboard() {
  const { user } = useApp();
  const navigate = useNavigate();
  if (!user) { navigate('/login'); return null; }
  if (!user.role) { navigate('/role'); return null; }
  if (user.role === 'teller')   return <TellerDashboard />;
  if (user.role === 'member')   return <MemberDashboard />;
  if (user.role === 'chairman') return <ChairmanDashboard />;
  return null;
}
