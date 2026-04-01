import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CASES } from '../data/cases';

const TYPE_LABEL: Record<string, string> = {
  auto: 'AI 자동생성',
  separate: '별도 발급',
  standard: '표준양식',
};

export default function Documents() {
  const { currentCaseId } = useApp();
  const navigate = useNavigate();

  if (!currentCaseId || !CASES[currentCaseId]) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px' }}>오류 /</div>
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>상담을 먼저 진행해주세요.</div>
          <button onClick={() => navigate('/consult')} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>상담 시작 →</button>
        </div>
      </div>
    );
  }

  const caseData = CASES[currentCaseId];

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{ borderBottom: '1px solid #e5e5e5', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate('/consult')} style={{ fontSize: '18px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>서류 안내</div>
          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>{caseData.name}</div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* 케이스 헤더 */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #e5e5e5', paddingBottom: '28px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>필요 서류 /</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>{caseData.name}</h1>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>{caseData.description}</p>
          <div style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '12px', color: '#aaa' }}>
            <span>서류 {caseData.documents.length}건</span>
            <span>예상 소요 {caseData.estimatedTime}</span>
          </div>
        </div>

        {/* 서류 목록 */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>서류 목록 /</div>
          <div style={{ borderTop: '1px solid #000' }}>
            {caseData.documents.map((doc, i) => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#ccc', minWidth: '24px' }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>{doc.name}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{doc.description}</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: doc.type === 'auto' ? '#000' : '#888', border: `1px solid ${doc.type === 'auto' ? '#000' : '#e5e5e5'}`, padding: '3px 8px', borderRadius: '2px', flexShrink: 0 }}>
                  {TYPE_LABEL[doc.type]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 절차 */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>진행 절차 /</div>
          <div style={{ borderTop: '1px solid #e5e5e5' }}>
            {caseData.procedureSteps.map((step, i) => (
              <div key={step.id} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: '16px', padding: '14px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'start' }}>
                <span style={{ fontSize: '11px', color: '#ccc', paddingTop: '2px' }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>{step.title}</div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{step.description}</div>
                </div>
                <span style={{ fontSize: '11px', color: '#aaa', flexShrink: 0, paddingTop: '2px' }}>{step.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button onClick={() => navigate('/consult/form')}
          style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', borderRadius: '2px' }}>
          정보 입력 및 서류 생성 시작 →
        </button>
      </div>
    </div>
  );
}
