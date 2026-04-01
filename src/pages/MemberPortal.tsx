import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import AppLayout from '../components/AppLayout';

const STAGES = [
  { step: 1, label: '연체 발생', desc: '최초 연체 — 내용증명 발송 단계' },
  { step: 2, label: '법적 조치 예고', desc: '연체 30일 이상 — 지급명령 또는 가압류 준비' },
  { step: 3, label: '법원 신청', desc: '연체 60일 이상 — 가압류·지급명령 법원 접수' },
  { step: 4, label: '집행권원 확보', desc: '지급명령 확정 또는 판결 — 강제집행 가능' },
  { step: 5, label: '강제집행', desc: '압류·추심 또는 경매 진행 중' },
];

export default function MemberPortal() {
  const navigate = useNavigate();

  const [memberId, setMemberId] = useState('');
  const [searched, setSearched] = useState(false);
  const [currentStage] = useState(2); // 데모: 2단계

  const handleSearch = () => {
    if (memberId.trim()) setSearched(true);
  };

  return (
    <AppLayout topbarLeft="조합원 상황 조회">
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>조합원 포털 /</div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>현재 법적 단계를 확인하세요</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>조합원 번호를 입력하면 현재 법적 조치 단계와 대응 방법을 안내합니다.</p>
        </div>

        {/* 검색 */}
        <div style={{ marginBottom: '32px', borderBottom: '1px solid #e5e5e5', paddingBottom: '28px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.06em', marginBottom: '10px' }}>조합원 번호</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input value={memberId} onChange={e => setMemberId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="예: A-2024-0312"
              style={{ flex: 1, border: 'none', borderBottom: '1px solid #000', padding: '8px 0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: 'transparent' }}/>
            <button onClick={handleSearch}
              style={{ padding: '8px 18px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>
              조회
            </button>
          </div>
        </div>

        {searched && (
          <div>
            {/* 현재 단계 */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>현재 단계 /</div>
              <div style={{ borderTop: '1px solid #000' }}>
                {STAGES.map(s => (
                  <div key={s.step} style={{ display: 'flex', gap: '16px', padding: '14px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'flex-start' }}>
                    <div style={{ width: '20px', height: '20px', border: `1px solid ${s.step === currentStage ? '#000' : '#e5e5e5'}`, background: s.step < currentStage ? '#000' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px', borderRadius: '2px' }}>
                      {s.step < currentStage && <span style={{ fontSize: '9px', color: '#fff', fontWeight: 700 }}>✓</span>}
                      {s.step === currentStage && <div style={{ width: '6px', height: '6px', background: '#000', borderRadius: '1px' }}/>}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: s.step === currentStage ? 700 : 400, color: s.step <= currentStage ? '#000' : '#bbb' }}>{s.step}단계 — {s.label}</div>
                      <div style={{ fontSize: '12px', color: s.step === currentStage ? '#444' : '#ccc', marginTop: '2px' }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 대응 방법 */}
            <div style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '12px' }}>지금 할 수 있는 것 /</div>
              <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#444' }}>
                현재 <strong style={{ color: '#000' }}>2단계 (법적 조치 예고)</strong> 상태입니다.<br/>
                조합에서 지급명령 또는 가압류를 준비 중입니다.<br/>
                이의신청서 제출 또는 분할 상환 협의가 가능합니다.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { storage.clearCurrentSession(); navigate('/consult'); }}
                style={{ flex: 1, padding: '12px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>
                이의신청서 작성 →
              </button>
              <button onClick={() => window.open('https://www.homelawyer.kr/?__xq7k2mz9p4r3tn8vw6jy5hd0cb1sf2el4ng8ouaq=dongtan-gh-lake2', '_blank')}
                style={{ flex: 1, padding: '12px', background: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>
                변호사 상담 →
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
