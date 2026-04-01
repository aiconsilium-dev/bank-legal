import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CASES } from '../data/cases';
import { formatCurrency } from '../utils/calculations';

function renderTemplate(template: string, data: Record<string, string>, user: { institution: string; name: string } | null, calc: { principal: number; interest: number; delayDamage: number; total: number } | null): string {
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const replacements: Record<string, string> = {
    institution: user?.institution ?? '',
    date: today,
    principal: calc ? `${formatCurrency(calc.principal)}` : (data.principal ?? ''),
    interest: calc ? `${formatCurrency(calc.interest)}` : '0',
    delayDamage: calc ? `${formatCurrency(calc.delayDamage)}` : '0',
    total: calc ? `${formatCurrency(calc.total)}` : '0',
    ...data
  };
  let result = template;
  for (const [key, val] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), val ?? '');
  }
  return result;
}

export default function Preview() {
  const { user, currentCaseId, formData, claimCalc } = useApp();
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
  const docText = renderTemplate(
    caseData.documentTemplate,
    formData as Record<string, string>,
    user,
    claimCalc
  );

  const handlePrint = () => { window.print(); };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 헤더 */}
      <div className="no-print" style={{ borderBottom: '1px solid #e5e5e5', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/consult/form')} style={{ fontSize: '18px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>서류 미리보기</div>
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>{caseData.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate('/consult/complete')} style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', borderRadius: '2px' }}>최종 완료 →</button>
          <button onClick={handlePrint} style={{ padding: '8px 16px', background: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', borderRadius: '2px' }}>인쇄</button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>서류 미리보기 /</div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px' }}>{caseData.name}</h1>
        </div>

        {claimCalc && (
          <div style={{ marginBottom: '32px', border: '1px solid #000', padding: '20px' }}>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '14px' }}>채권 계산 결과 /</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', border: '1px solid #e5e5e5' }}>
              {[
                { label: '원금', value: `${claimCalc.principal.toLocaleString()}원` },
                { label: '이자', value: `${claimCalc.interest.toLocaleString()}원` },
                { label: '지연손해금', value: `${claimCalc.delayDamage.toLocaleString()}원` },
                { label: '합계', value: `${claimCalc.total.toLocaleString()}원` },
              ].map((s, i) => (
                <div key={s.label} style={{ padding: '12px', borderRight: i < 3 ? '1px solid #e5e5e5' : 'none' }}>
                  <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: s.label === '합계' ? 800 : 500 }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '16px', fontSize: '11px', color: '#aaa' }}>
              <span>인지대 {claimCalc.stampDuty.toLocaleString()}원</span>
              <span>송달료 {claimCalc.serviceFee.toLocaleString()}원</span>
            </div>
          </div>
        )}

        <div style={{ border: '1px solid #e5e5e5', padding: '32px', fontFamily: 'serif', fontSize: '14px', lineHeight: 2, whiteSpace: 'pre-wrap', color: '#000', letterSpacing: '0.02em' }}>
          {docText}
        </div>
      </div>

      <style>{`@media print { .no-print { display: none !important; } }`}</style>
    </div>
  );
}
