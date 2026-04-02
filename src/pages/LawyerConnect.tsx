import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/AppLayout';

/* ══════════════════════════════════════════════════════
   변호사 연결 — 자문→수임 파이프라인
   ══════════════════════════════════════════════════════ */

const CASE_TYPES = [
  '가압류', '가처분', '추심명령', '지급명령', '대여금 소송',
  '채무부존재 소송', '경매 (임의/강제)', '배당이의 소송', '강제집행', '기타',
];

interface ConsultRecord {
  id: string;
  date: string;
  caseType: string;
  summary: string;
  status: '요청' | '검토중' | '자문완료' | '수임진행';
  lawyerName: string;
  result?: string;
}

const MOCK_RECORDS: ConsultRecord[] = [
  { id: 'C-001', date: '2026-03-28', caseType: '가압류', summary: '채무자 부동산 가압류 필요성 검토', status: '자문완료', lawyerName: '천상현', result: '가압류 신청 적합. 보전의 필요성 소명 가능. 즉시 의뢰 권고.' },
  { id: 'C-002', date: '2026-03-30', caseType: '경매 (임의/강제)', summary: '근저당 설정 물건 임의경매 절차 문의', status: '검토중', lawyerName: '김법률' },
  { id: 'C-003', date: '2026-04-01', caseType: '지급명령', summary: '무담보 대출 연체 960만원 지급명령 신청', status: '요청', lawyerName: '—' },
];

type Tab = 'request' | 'history';

export default function LawyerConnect() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('request');
  const [caseType, setCaseType] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!caseType || !description.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setCaseType('');
    setDescription('');
    setFile('');
    setSubmitted(false);
  };

  const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    '요청': { bg: '#FFF3E0', text: '#E65100' },
    '검토중': { bg: '#E3F2FD', text: '#0061AF' },
    '자문완료': { bg: '#E8F5E9', text: '#2E7D32' },
    '수임진행': { bg: '#F3E5F5', text: '#7B1FA2' },
  };

  return (
    <AppLayout topbarLeft="변호사 연결" topbarRight={user?.institution}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e5e5e5' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '6px' }}>변호사 자문 · 수임 의뢰</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>AI 1차 상담 → 변호사 자문 → 수임 의뢰의 파이프라인으로 진행합니다.</p>
        </div>

        {/* 변호사 정보 카드 */}
        <div style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '20px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', background: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>천</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>천상현 대표변호사</div>
            <div style={{ fontSize: '13px', color: '#888' }}>법무법인 더 에이치 황해 · 금융·채권 전문 17년</div>
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>인천 미추홀구 학익로 60 · 032-251-1000</div>
          </div>
          <button onClick={() => window.open('tel:032-251-1000')}
            style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', flexShrink: 0 }}>
            전화 연결
          </button>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '28px', borderBottom: '2px solid #e5e5e5' }}>
          {[
            { key: 'request' as Tab, label: '자문 요청' },
            { key: 'history' as Tab, label: `자문 이력 (${MOCK_RECORDS.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                padding: '12px 24px', fontSize: '14px', fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? '#000' : '#888',
                background: 'none', border: 'none', borderBottom: tab === t.key ? '2px solid #000' : '2px solid transparent',
                cursor: 'pointer', fontFamily: 'inherit', marginBottom: '-2px',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ 자문 요청 탭 ══ */}
        {tab === 'request' && !submitted && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', color: '#666' }}>사건 유형과 간략한 설명을 입력하면 담당 변호사에게 자문을 요청합니다.</p>
            </div>

            {/* 사건 유형 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '8px', display: 'block' }}>
                사건 유형 <span style={{ color: '#C9252C', fontSize: '10px' }}>필수</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CASE_TYPES.map(ct => (
                  <button key={ct} onClick={() => setCaseType(ct)}
                    style={{
                      padding: '8px 16px', fontSize: '13px', fontWeight: caseType === ct ? 700 : 500,
                      background: caseType === ct ? '#0061AF' : '#fff',
                      color: caseType === ct ? '#fff' : '#666',
                      border: '1px solid ' + (caseType === ct ? '#0061AF' : '#e5e5e5'),
                      borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}>
                    {ct}
                  </button>
                ))}
              </div>
            </div>

            {/* 간략 설명 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '8px', display: 'block' }}>
                간략 설명 <span style={{ color: '#C9252C', fontSize: '10px' }}>필수</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
                placeholder="사건 개요, 채무자 정보, 채권금액, 담보 유무 등을 간략히 기재해 주세요..."
                style={{
                  width: '100%', padding: '14px', border: '1px solid #e5e5e5', borderRadius: '8px',
                  fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'vertical',
                  lineHeight: 1.7, boxSizing: 'border-box',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#0061AF')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
              />
            </div>

            {/* 첨부파일 */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '8px', display: 'block' }}>
                첨부파일 <span style={{ color: '#aaa', fontSize: '11px', fontWeight: 400 }}>선택</span>
              </label>
              <div style={{
                border: '1px dashed #ccc', borderRadius: '8px', padding: '24px', textAlign: 'center',
                cursor: 'pointer', background: '#FAFAFA',
              }}
                onClick={() => setFile('대출약정서_김OO.pdf')}>
                {file ? (
                  <div style={{ fontSize: '14px', color: '#0061AF', fontWeight: 600 }}>📎 {file}</div>
                ) : (
                  <div>
                    <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>클릭하여 파일 첨부</div>
                    <div style={{ fontSize: '12px', color: '#ccc' }}>PDF, HWP, DOC 등</div>
                  </div>
                )}
              </div>
            </div>

            <button onClick={handleSubmit}
              disabled={!caseType || !description.trim()}
              style={{
                width: '100%', padding: '16px', fontSize: '15px', fontWeight: 700,
                background: caseType && description.trim() ? '#C9252C' : '#ccc',
                color: '#fff', border: 'none', borderRadius: '8px',
                cursor: caseType && description.trim() ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
              }}>
              변호사 자문 요청 →
            </button>
          </div>
        )}

        {/* 제출 완료 */}
        {tab === 'request' && submitted && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>자문 요청이 전달되었습니다</h3>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
              사건 유형: <strong>{caseType}</strong>
            </p>
            <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '24px' }}>
              담당 변호사가 영업일 기준 1일 이내 검토 후 회신드립니다.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={handleReset}
                style={{ padding: '12px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}>
                추가 요청
              </button>
              <button onClick={() => setTab('history')}
                style={{ padding: '12px 24px', background: '#fff', color: '#000', border: '1px solid #000', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>
                자문 이력 보기
              </button>
            </div>
          </div>
        )}

        {/* ══ 자문 이력 탭 ══ */}
        {tab === 'history' && (
          <div>
            {MOCK_RECORDS.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', fontSize: '14px', color: '#aaa' }}>자문 이력이 없습니다.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {MOCK_RECORDS.map(r => (
                  <div key={r.id} style={{ border: '1px solid #e5e5e5', borderRadius: '8px', overflow: 'hidden' }}>
                    <div
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 600,
                          color: STATUS_COLORS[r.status].text,
                          background: STATUS_COLORS[r.status].bg,
                          padding: '4px 10px', borderRadius: '12px',
                        }}>
                          {r.status}
                        </span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{r.caseType} — {r.summary}</div>
                          <div style={{ fontSize: '12px', color: '#aaa' }}>{r.date} · 담당: {r.lawyerName}</div>
                        </div>
                      </div>
                      <span style={{ color: '#ccc', fontSize: '14px', transition: 'transform 0.2s', transform: expandedId === r.id ? 'rotate(180deg)' : 'none' }}>▾</span>
                    </div>

                    {expandedId === r.id && (
                      <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f0f0f0' }}>
                        {r.result ? (
                          <div>
                            <div style={{ fontSize: '12px', color: '#00854A', fontWeight: 600, marginTop: '16px', marginBottom: '8px' }}>자문 결과</div>
                            <div style={{ fontSize: '14px', color: '#333', lineHeight: 1.7, background: '#F8FFF8', padding: '14px', borderRadius: '6px', marginBottom: '16px' }}>
                              {r.result}
                            </div>
                            <button onClick={() => navigate('/history')}
                              style={{ padding: '12px 24px', background: '#00854A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit' }}>
                              수임 의뢰 →
                            </button>
                          </div>
                        ) : (
                          <div style={{ padding: '16px 0', fontSize: '14px', color: '#888' }}>
                            {r.status === '요청' ? '변호사 배정 대기 중입니다.' : '변호사가 검토 중입니다. 곧 결과를 안내드립니다.'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 하단 안내 */}
        <div style={{ marginTop: '40px', fontSize: '11px', color: '#bbb', lineHeight: 1.7, borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
          법무법인 더 에이치 황해 · 인천 미추홀구 학익로 60 · 032-251-1000<br/>
          상담 가능 시간: 평일 09:00 ~ 18:00<br/>
          <button onClick={() => window.open('https://www.homelawyer.kr/?__xq7k2mz9p4r3tn8vw6jy5hd0cb1sf2el4ng8ouaq=dongtan-gh-lake2', '_blank')}
            style={{ fontSize: '11px', color: '#0061AF', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, marginTop: '4px' }}>
            집변 법률상담 바로가기 →
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
