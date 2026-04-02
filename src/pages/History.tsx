import { useState } from 'react';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/AppLayout';

/* ══════════════════════════════════════════════════════
   사건 현황 — 법무법인 대행 사건 목록
   ══════════════════════════════════════════════════════ */

interface LawCase {
  id: string;
  caseNumber: string;
  type: string;
  debtor: string;
  amount: string;
  status: '접수' | '서류준비' | '법원제출' | '진행중' | '완료';
  lawFirm: string;
  updatedAt: string;
  description?: string;
}

const STATUS_STEPS = ['접수', '서류준비', '법원제출', '진행중', '완료'] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  '접수': { bg: '#FFF3E0', text: '#E65100' },
  '서류준비': { bg: '#E3F2FD', text: '#0061AF' },
  '법원제출': { bg: '#E8F5E9', text: '#2E7D32' },
  '진행중': { bg: '#F3E5F5', text: '#7B1FA2' },
  '완료': { bg: '#F5F5F5', text: '#616161' },
};

const MOCK_CASES: LawCase[] = [
  { id: '1', caseNumber: '2026카합10234', type: '가압류', debtor: '김◯◯', amount: '5,200만원', status: '진행중', lawFirm: '법무법인 더에이치황해', updatedAt: '2026-04-01', description: '채무자 부동산 가압류 신청' },
  { id: '2', caseNumber: '2026카합10198', type: '가압류', debtor: '박◯◯', amount: '3,200만원', status: '법원제출', lawFirm: '법무법인 더에이치황해', updatedAt: '2026-03-29', description: '채무자 예금채권 가압류' },
  { id: '3', caseNumber: '2026타경5678', type: '경매', debtor: '이◯◯', amount: '8,500만원', status: '진행중', lawFirm: '법무법인 더에이치황해', updatedAt: '2026-03-25', description: '근저당권 실행 임의경매' },
  { id: '4', caseNumber: '2026차1234', type: '지급명령', debtor: '최◯◯', amount: '1,800만원', status: '서류준비', lawFirm: '법무법인 더에이치황해', updatedAt: '2026-04-02' },
  { id: '5', caseNumber: '2026차1190', type: '지급명령', debtor: '정◯◯', amount: '2,400만원', status: '접수', lawFirm: '법무법인 더에이치황해', updatedAt: '2026-04-02' },
  { id: '6', caseNumber: '2026차1102', type: '지급명령', debtor: '한◯◯', amount: '960만원', status: '법원제출', lawFirm: '법무법인 더에이치황해', updatedAt: '2026-03-28' },
  { id: '7', caseNumber: '2025타채9012', type: '강제집행', debtor: '유◯◯', amount: '4,100만원', status: '진행중', lawFirm: '법무법인 더에이치황해', updatedAt: '2026-03-20' },
  { id: '8', caseNumber: '2025가단56789', type: '추심명령', debtor: '서◯◯', amount: '1,500만원', status: '완료', lawFirm: '법무법인 더에이치황해', updatedAt: '2026-03-28', description: '추심완료 — 전액 회수' },
];

const FILTER_TYPES = ['전체', '가압류', '경매', '지급명령', '강제집행', '추심명령'];

export default function History() {
  const { user } = useApp();
  const [filter, setFilter] = useState('전체');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === '전체' ? MOCK_CASES : MOCK_CASES.filter(c => c.type === filter);

  const typeCounts = FILTER_TYPES.slice(1).map(t => ({
    type: t,
    count: MOCK_CASES.filter(c => c.type === t).length,
  }));

  return (
    <AppLayout activeNav="상담 내역" topbarLeft="사건 현황" topbarRight={`${user?.institution}`}>
      <div style={{ padding: '40px 40px 60px', maxWidth: '960px' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>사건 현황</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>법무법인 대행 사건 목록 · 총 {MOCK_CASES.length}건</p>
        </div>

        {/* 유형별 요약 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '28px' }}>
          {typeCounts.map(tc => (
            <div key={tc.type} onClick={() => setFilter(tc.type)}
              style={{
                border: '1px solid ' + (filter === tc.type ? '#0061AF' : '#e5e5e5'),
                borderRadius: '8px', padding: '14px', textAlign: 'center', cursor: 'pointer',
                background: filter === tc.type ? '#F5F9FF' : '#fff',
                transition: 'all 0.15s',
              }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: filter === tc.type ? '#0061AF' : '#000', letterSpacing: '-1px' }}>
                {tc.count}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{tc.type}</div>
            </div>
          ))}
        </div>

        {/* 필터 탭 */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {FILTER_TYPES.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px', fontSize: '13px', fontWeight: filter === f ? 700 : 500,
                background: filter === f ? '#000' : '#fff', color: filter === f ? '#fff' : '#888',
                border: '1px solid ' + (filter === f ? '#000' : '#e5e5e5'),
                borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit',
              }}>
              {f} {f !== '전체' ? `(${MOCK_CASES.filter(c => c.type === f).length})` : ''}
            </button>
          ))}
        </div>

        {/* 사건 목록 */}
        <div style={{ border: '1px solid #e5e5e5', borderRadius: '8px', overflow: 'hidden' }}>
          {/* 테이블 헤더 */}
          <div style={{
            display: 'grid', gridTemplateColumns: '140px 80px 70px 100px 80px 1fr',
            padding: '12px 16px', background: '#FAFAFA', borderBottom: '1px solid #e5e5e5',
            fontSize: '11px', color: '#888', fontWeight: 600, letterSpacing: '0.04em',
          }}>
            <span>사건번호</span>
            <span>유형</span>
            <span>차주</span>
            <span>금액</span>
            <span>상태</span>
            <span>최근 업데이트</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', fontSize: '14px', color: '#aaa' }}>
              해당 유형의 사건이 없습니다.
            </div>
          ) : filtered.map(c => (
            <div key={c.id}>
              <div
                onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                style={{
                  display: 'grid', gridTemplateColumns: '140px 80px 70px 100px 80px 1fr',
                  padding: '14px 16px', borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer', alignItems: 'center', transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9F9F9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#555' }}>{c.caseNumber}</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{c.type}</span>
                <span style={{ fontSize: '13px' }}>{c.debtor}</span>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{c.amount}</span>
                <span style={{
                  fontSize: '11px', fontWeight: 600,
                  color: STATUS_COLORS[c.status].text,
                  background: STATUS_COLORS[c.status].bg,
                  padding: '3px 8px', borderRadius: '10px', display: 'inline-block', textAlign: 'center',
                }}>
                  {c.status}
                </span>
                <span style={{ fontSize: '12px', color: '#aaa' }}>{c.updatedAt}</span>
              </div>

              {/* 확장 상세 */}
              {expandedId === c.id && (
                <div style={{ padding: '16px 20px 20px', background: '#FAFAFA', borderBottom: '1px solid #e5e5e5' }}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                    {c.description || `${c.type} — ${c.debtor}`} · {c.lawFirm}
                  </div>

                  {/* 진행 단계 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {STATUS_STEPS.map((s, i) => {
                      const currentIdx = STATUS_STEPS.indexOf(c.status);
                      const isActive = i <= currentIdx;
                      const isCurrent = i === currentIdx;
                      return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{
                            padding: '6px 14px', borderRadius: '16px', fontSize: '12px', fontWeight: isCurrent ? 700 : 500,
                            background: isActive ? (isCurrent ? '#0061AF' : '#E3F2FD') : '#F5F5F5',
                            color: isActive ? (isCurrent ? '#fff' : '#0061AF') : '#bbb',
                          }}>
                            {s}
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div style={{ width: '16px', height: '1px', background: isActive ? '#0061AF' : '#ddd' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
