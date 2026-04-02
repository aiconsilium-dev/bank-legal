import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CASES } from '../data/cases';
import AppLayout from '../components/AppLayout';

const LAWYERS = [
  { name: '천상현', role: '대표 변호사', specialty: '금융·채권 분야 전문', cases: '17년 경력', available: true },
  { name: '김법률', role: '파트너 변호사', specialty: '부동산 경매·집행', cases: '12년 경력', available: true },
  { name: '이민사', role: '소속 변호사', specialty: '민사 소송·화해', cases: '8년 경력', available: false },
];

export default function LawyerConnect() {
  const { currentCaseId, formData } = useApp();
  const [summary, setSummary] = useState('');
  const [sent, setSent] = useState(false);

  const caseData = currentCaseId ? CASES[currentCaseId] : null;

  const autoSummary = caseData
    ? `[${caseData.name}]\n채무자: ${(formData as any)?.debtorName || '미입력'}\n청구금액: ${(formData as any)?.principal || '미입력'}원\n계좌번호: ${(formData as any)?.accountNumber || '미입력'}`
    : '';

  return (
    <AppLayout topbarLeft="집변 법률 상담">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '36px', borderBottom: '1px solid #e5e5e5', paddingBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>변호사 연결 /</div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '6px' }}>전담 변호사에게 사건을 전달하세요</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>법무법인 더 에이치 황해의 금융·채권 전문 변호사가 검토합니다.</p>
        </div>

        {/* 변호사 목록 */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>A / 담당 변호사</div>
          <div style={{ borderTop: '1px solid #000' }}>
            {LAWYERS.map((lawyer) => (
              <div key={lawyer.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', background: '#f5f5f5', border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0, borderRadius: '2px' }}>
                    {lawyer.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{lawyer.name} {lawyer.role}</div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{lawyer.specialty} · {lawyer.cases}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: lawyer.available ? '#000' : '#bbb' }}>
                    {lawyer.available ? '상담 가능' : '부재중'}
                  </span>
                  {lawyer.available && (
                    <button onClick={() => window.open('tel:032-251-1000')}
                      style={{ padding: '5px 12px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit', borderRadius: '2px' }}>
                      연결
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 사건 요약 전달 */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>B / 사건 요약 전달</div>
          {sent ? (
            <div style={{ border: '1px solid #000', padding: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>전달 완료</div>
              <div style={{ fontSize: '14px', color: '#666' }}>사건 요약이 담당 변호사에게 전달되었습니다. 영업일 기준 1일 이내 연락드립니다.</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.06em', marginBottom: '8px' }}>사건 요약</div>
              <textarea
                value={summary || autoSummary}
                onChange={e => setSummary(e.target.value)}
                rows={6}
                placeholder="사건 내용을 요약해 주세요..."
                style={{ width: '100%', border: '1px solid #e5e5e5', padding: '12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.7, borderRadius: '2px', boxSizing: 'border-box' }}
              />
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button onClick={() => setSent(true)}
                  style={{ flex: 1, padding: '12px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', borderRadius: '2px' }}>
                  변호사에게 전달하기 →
                </button>
                <button onClick={() => window.open('https://www.homelawyer.kr/?__xq7k2mz9p4r3tn8vw6jy5hd0cb1sf2el4ng8ouaq=dongtan-gh-lake2', '_blank')}
                  style={{ padding: '12px 20px', background: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>
                  집변 바로가기 →
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ fontSize: '11px', color: '#bbb', lineHeight: 1.7 }}>
          법무법인 더 에이치 황해 · 인천 미추홀구 학익로 60 · 032-251-1000<br/>
          상담 가능 시간: 평일 09:00 ~ 18:00
        </div>
      </div>
    </AppLayout>
  );
}
