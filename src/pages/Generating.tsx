import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { calculateClaim, parseCurrencyInput } from '../utils/calculations';

const STAGES = ['채권 계산 중', '양식 적용 중', '검증 완료'];

export default function Generating() {
  const { formData, setClaimCalc } = useApp();
  const navigate = useNavigate();
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (formData?.principal) {
      const principal = parseCurrencyInput(formData.principal as string);
      const interestRate = parseFloat(formData.interestRate as string) || 0;
      const delayRate = parseFloat(formData.delayRate as string) || 15;
      const loanDate = new Date((formData.loanDate as string) || Date.now() - 365 * 86400000);
      const defaultDate = new Date((formData.defaultDate as string) || Date.now() - 90 * 86400000);
      setClaimCalc(calculateClaim(principal, interestRate, delayRate, loanDate, defaultDate));
    }
    const interval = setInterval(() => setProgress(p => p >= 100 ? 100 : p + 2), 50);
    const t1 = setTimeout(() => setStageIdx(1), 900);
    const t2 = setTimeout(() => setStageIdx(2), 1800);
    const t3 = setTimeout(() => navigate('/consult/preview'), 2800);
    return () => { clearInterval(interval); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '24px' }}>서류 생성 중 /</div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '32px' }}>서류를 생성하고 있습니다</h1>

        <div style={{ height: '2px', background: '#e5e5e5', marginBottom: '28px', borderRadius: '1px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#000', width: `${progress}%`, transition: 'width 0.1s linear' }}/>
        </div>

        <div style={{ textAlign: 'left' }}>
          {STAGES.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ width: '16px', height: '16px', border: `1px solid ${i <= stageIdx ? '#000' : '#ddd'}`, background: i < stageIdx ? '#000' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}>
                {i < stageIdx && <span style={{ fontSize: '9px', color: '#fff', fontWeight: 700 }}>✓</span>}
                {i === stageIdx && <div style={{ width: '6px', height: '6px', background: '#000', borderRadius: '1px' }}/>}
              </div>
              <span style={{ fontSize: '13px', color: i <= stageIdx ? '#000' : '#aaa', fontWeight: i === stageIdx ? 600 : 400 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
