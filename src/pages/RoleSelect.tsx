import { useState } from 'react';
import { useApp } from '../context/AppContext';

const ROLES = [
  {
    key: 'teller' as const,
    alpha: 'A',
    label: '행원',
    sub: '여신 · 법무 담당',
    features: ['AI 법률 절차 안내', '서류 8종 자동 생성', '채권계산서 자동 계산', '법원 접수 가이드'],
  },
  {
    key: 'member' as const,
    alpha: 'B',
    label: '조합원',
    sub: '금융소비자',
    features: ['연체 단계 현황 조회', '이의신청서 셀프 작성', '출자금 반환 청구', '민원 접수 · Q&A'],
  },
  {
    key: 'chairman' as const,
    alpha: 'C',
    label: '이사장',
    sub: '경영진',
    features: ['전체 리스크 대시보드', '연체 현황 통계', '비용 절감 리포트', '자문 변호사 연결'],
  },
];

export default function RoleSelect() {
  const { user } = useApp();
  const [sel, setSel] = useState<string | null>(null);
  const [hov, setHov] = useState<string | null>(null);

  const go = (role: 'teller' | 'member' | 'chairman') => {
    if (sel) return;
    setSel(role);

    const ROLE_URLS: Record<string, string> = {
      teller:   'https://aiconsilium-dev.github.io/bankcasa-teller/',
      member:   'https://aiconsilium-dev.github.io/bankcasa-member/',
      chairman: 'https://aiconsilium-dev.github.io/bankcasa-chairman/',
    };

    // 현재 유저 정보를 URL 파라미터로 전달
    const inst = encodeURIComponent(user?.institution || '');
    const name = encodeURIComponent(user?.name || '');
    const url = `${ROLE_URLS[role]}#/?role=${role}&inst=${inst}&name=${name}`;

    setTimeout(() => {
      window.open(url, '_blank');
      setSel(null); // 스피너 해제
    }, 300);
  };

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      {/* 상단 바 */}
      <header style={{ borderBottom: '1px solid #e5e5e5', padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#000', letterSpacing: '0.08em' }}>뱅크법률집사</div>
        </div>
        <span style={{ fontSize: '12px', color: '#aaa' }}>{user?.institution} · {user?.name}</span>
      </header>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '80px 48px' }}>
        {/* 타이틀 */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.1em', marginBottom: '20px' }}>역할 선택 /</div>
          <h1 style={{ fontSize: '42px', fontWeight: 700, letterSpacing: '-1.5px', color: '#000', lineHeight: 1.2 }}>
            어떤 역할로<br/>접속하시겠어요?
          </h1>
        </div>

        {/* 역할 카드 — 가로 선 구분 */}
        <div style={{ borderTop: '1px solid #000' }}>
          {ROLES.map((r, i) => (
            <button
              key={r.key}
              onClick={() => go(r.key)}
              onMouseEnter={() => setHov(r.key)}
              onMouseLeave={() => setHov(null)}
              disabled={!!sel}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr auto',
                alignItems: 'center',
                gap: '32px',
                width: '100%',
                padding: '28px 0',
                background: hov === r.key ? '#f9f9f9' : 'transparent',
                cursor: sel ? 'default' : 'pointer',
                opacity: sel && sel !== r.key ? 0.3 : 1,
                transition: 'all 0.12s',
                textAlign: 'left',
                border: 'none',
                borderBottom: i < ROLES.length - 1 ? '1px solid #e5e5e5' : 'none',
                borderTop: 'none',
              } as React.CSSProperties}
            >
              <span style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>{r.alpha} /</span>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', color: '#000', marginBottom: '4px' }}>{r.label}</div>
                <div style={{ fontSize: '14px', color: '#888' }}>{r.sub}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {r.features.map(f => (
                  <span key={f} style={{ fontSize: '12px', color: '#666', background: '#f5f5f5', padding: '3px 10px', borderRadius: '2px' }}>{f}</span>
                ))}
              </div>
              <span style={{ fontSize: '20px', color: hov === r.key ? '#000' : '#ccc', transition: 'color 0.12s' }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
