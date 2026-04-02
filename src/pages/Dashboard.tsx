import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/AppLayout';

/* ══════════════════════════════════════════════════════
   행원(Teller) 대시보드 — 실무 데이터 기반 전면 재작성
   ══════════════════════════════════════════════════════ */

function TellerDashboard() {
  const { user } = useApp();
  const navigate = useNavigate();

  /* ── 내 업무 (행원 직접 처리) ── */
  const MY_TASKS = {
    complaints: [
      { id: 'CM-2026-041', type: '금리인하요구 거부', debtor: '이◯◯', deadline: '04/05', status: '대기' as const },
      { id: 'CM-2026-039', type: '불완전판매', debtor: '최◯◯', deadline: '04/07', status: '대기' as const },
      { id: 'CM-2026-038', type: '이자율 분쟁', debtor: '정◯◯', deadline: '처리중', status: '처리중' as const },
    ],
    consultRequests: 2,
  };

  /* ── 법무법인 의뢰 현황 ── */
  const LAW_FIRM_CASES = [
    { type: '가압류', count: 2, color: '#0061AF' },
    { type: '경매', count: 1, color: '#C9252C' },
    { type: '지급명령', count: 3, color: '#0061AF' },
    { type: '추심명령', count: 1, color: '#00854A' },
  ];
  const RECENT_COMPLETE = { type: '추심완료', debtor: '박◯◯', amount: '3,200만원', date: '03/28' };

  /* ── 유사 사례 (법률QA) ── */
  const LEGAL_QA = [
    { title: '기한이익상실 예정통지 방법', desc: '내용증명 vs 등기우편 — 판례 기준 정리', tag: '자주 조회' },
    { title: '이중 채권양수도 리스크', desc: '양수인 간 우선순위 판단 기준', tag: '최근 질의' },
    { title: '연대보증인 대위변제 후 경매 취하', desc: '보증인이 전액 변제 시 경매 취하 절차', tag: '실무 사례' },
  ];

  return (
    <AppLayout activeNav="대시보드"
      topbarLeft={`${user?.institution} — 여신 법무`}
      topbarRight="2026. 04">

      <div style={{ padding: '40px 40px 60px', flex: 1, overflowY: 'auto' }}>

        {/* ── 인사 ── */}
        <div style={{ marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid #e5e5e5' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', color: '#000', marginBottom: '6px' }}>
            {user?.name}님, 안녕하세요
          </h1>
          <p style={{ fontSize: '14px', color: '#888' }}>
            금감원 민원 대기 <span style={{ color: '#C9252C', fontWeight: 600 }}>{MY_TASKS.complaints.filter(c => c.status === '대기').length}건</span> · 법무법인 진행 중 <span style={{ fontWeight: 600, color: '#000' }}>{LAW_FIRM_CASES.reduce((s, c) => s + c.count, 0)}건</span>
          </p>
        </div>

        {/* ── 바로가기 4칸 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '40px' }}>
          {[
            { label: 'AI 법률상담', desc: '의사결정 트리 기반', bg: '#00854A', action: () => navigate('/consult') },
            { label: '서류 자동작성', desc: '경매·지급명령·가압류', bg: '#0061AF', action: () => navigate('/consult/documents') },
            { label: '사건 현황', desc: '법무법인 대행 사건', bg: '#555', action: () => navigate('/history') },
            { label: '변호사 연결', desc: '자문→수임 의뢰', bg: '#C9252C', action: () => navigate('/lawyer') },
          ].map(q => (
            <button key={q.label} onClick={q.action}
              style={{ padding: '20px 16px', textAlign: 'left', background: q.bg, border: 'none', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{q.label}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{q.desc}</div>
            </button>
          ))}
        </div>

        {/* ── 2컬럼: 내 업무 / 법무법인 의뢰 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>

          {/* [내 업무] */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '4px', height: '18px', background: '#0061AF', borderRadius: '2px' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#000', letterSpacing: '0.02em' }}>내 업무</span>
              <span style={{ fontSize: '11px', color: '#aaa' }}>행원 직접 처리</span>
            </div>

            {/* 금감원 민원 */}
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px', fontWeight: 600 }}>금감원 민원 현황</div>
            <div style={{ border: '1px solid #e5e5e5', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
              {MY_TASKS.complaints.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: i < MY_TASKS.complaints.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#000' }}>{c.type}</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{c.debtor} · {c.id}</div>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '12px',
                    background: c.status === '대기' ? '#FFF3E0' : '#E8F5E9',
                    color: c.status === '대기' ? '#E65100' : '#2E7D32',
                  }}>
                    {c.status === '대기' ? `마감 ${c.deadline}` : '처리중'}
                  </span>
                </div>
              ))}
            </div>

            {/* 법률 자문 요청 */}
            <button onClick={() => navigate('/consult')} style={{ width: '100%', padding: '14px', border: '1px solid #0061AF', borderRadius: '6px', background: '#F5F9FF', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0061AF' }}>💬 AI 법률 상담 바로가기</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>연체 채권, 민원 대응, 약관 해석 등</div>
            </button>
          </div>

          {/* [법무법인 의뢰 현황] */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '4px', height: '18px', background: '#00854A', borderRadius: '2px' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#000', letterSpacing: '0.02em' }}>법무법인 의뢰 현황</span>
              <span style={{ fontSize: '11px', color: '#aaa' }}>법무법인 대행</span>
            </div>

            {/* 진행 중 사건 */}
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px', fontWeight: 600 }}>진행 중 사건</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {LAW_FIRM_CASES.map(c => (
                <div key={c.type} style={{ border: '1px solid #e5e5e5', borderRadius: '6px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: c.color, letterSpacing: '-1px' }}>{c.count}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{c.type}</div>
                </div>
              ))}
            </div>

            {/* 최근 완료 */}
            <div style={{ border: '1px solid #e5e5e5', borderRadius: '6px', padding: '14px', background: '#F8FFF8' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#00854A', fontWeight: 600, marginBottom: '4px' }}>✓ 최근 완료</div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{RECENT_COMPLETE.type} — {RECENT_COMPLETE.debtor}</div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{RECENT_COMPLETE.amount} · {RECENT_COMPLETE.date}</div>
                </div>
                <button onClick={() => navigate('/history')} style={{ fontSize: '11px', color: '#00854A', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  전체 보기 →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 유사 사례 참고 (법률QA) ── */}
        <div>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.08em', marginBottom: '14px' }}>📚 유사 사례 참고 /</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {LEGAL_QA.map(qa => (
              <div key={qa.title} style={{ border: '1px solid #e5e5e5', borderRadius: '6px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#0061AF')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}>
                <div style={{ fontSize: '10px', color: '#0061AF', fontWeight: 600, marginBottom: '8px', background: '#F5F9FF', display: 'inline-block', padding: '2px 8px', borderRadius: '10px' }}>{qa.tag}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#000', marginBottom: '4px', lineHeight: 1.4 }}>{qa.title}</div>
                <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.5 }}>{qa.desc}</div>
              </div>
            ))}
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
    { alpha: 'B', label: 'AI 서류 안내', desc: '제출 필요 서류 AI 자동 안내 및 작성 보조', action: () => navigate('/consult') },
    { alpha: 'C', label: '대출 기한 연장 신청', desc: '만기 연장 신청서 작성 및 안내', action: () => navigate('/consult') },
    { alpha: 'D', label: '담보물 변경 신청', desc: '담보 교체·추가 신청서 안내', action: () => navigate('/consult') },
    { alpha: 'E', label: '커뮤니티 · 공지사항', desc: '조합 공지 확인 및 건의사항 게시판', action: () => navigate('/community') },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <header style={{ borderBottom: '1px solid #e5e5e5', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#000' }}>뱅크법률집사</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#888' }}>{user?.name}님</span>
          <button onClick={() => { setUser({ ...user!, role: undefined }); navigate('/role'); }}
            style={{ fontSize: '12px', color: '#bbb', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            역할 변경
          </button>
        </div>
      </header>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>
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
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>이용 가능한 서비스 /</div>
          <div style={{ borderTop: '1px solid #e5e5e5' }}>
            {SERVICES.map(s => (
              <button key={s.label} onClick={s.action}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '16px 12px',
                  background: s.highlight ? '#000' : 'transparent',
                  border: 'none', borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                } as React.CSSProperties}
                onMouseEnter={e => { e.currentTarget.style.background = s.highlight ? '#222' : '#f9f9f9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = s.highlight ? '#000' : 'transparent'; }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    {!s.highlight && <span style={{ fontSize: '10px', color: '#ccc' }}>{s.alpha} /</span>}
                    <span style={{ fontSize: '14px', fontWeight: s.highlight ? 700 : 500, color: s.highlight ? '#fff' : '#000' }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: s.highlight ? 'rgba(255,255,255,0.55)' : '#999' }}>{s.desc}</div>
                </div>
                <span style={{ color: s.highlight ? 'rgba(255,255,255,0.5)' : '#ccc', fontSize: '16px' }}>→</span>
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
      topbarRight="2026. 04">
      <div style={{ padding: '48px 40px' }}>
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #e5e5e5', paddingBottom: '28px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>경영 현황 /</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px' }}>{user?.name} 이사장님</h1>
        </div>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>주요 지표 /</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', border: '1px solid #e5e5e5' }}>
            {KPI.map((k, i) => (
              <div key={k.alpha} style={{ padding: '20px', borderRight: i < 3 ? '1px solid #e5e5e5' : 'none' }}>
                <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px' }}>{k.alpha} /</div>
                <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1.5px' }}>{k.value}<span style={{ fontSize: '14px', fontWeight: 500, color: '#bbb', marginLeft: '3px' }}>{k.unit}</span></div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '6px' }}>{k.label}</div>
                <div style={{ fontSize: '11px', color: '#ccc', marginTop: '3px' }}>{k.delta}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em' }}>연체 현황 (90일 이상) /</div>
            <button onClick={() => navigate('/consult')} className="btn btn-primary btn-sm">일괄 처리 →</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000' }}>
                {['번호', '성명', '연체', '잔액', '담보', '권고 조치', ''].map(h => (
                  <th key={h} style={{ padding: '8px 0', textAlign: 'left', fontSize: '11px', color: '#aaa', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OVERDUE.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid #f0f0f0' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
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
                onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '10px' }}>{a.alpha} /</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{a.label}</div>
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
  if (user.role === 'teller') return <TellerDashboard />;
  if (user.role === 'member') return <MemberDashboard />;
  if (user.role === 'chairman') return <ChairmanDashboard />;
  return null;
}
