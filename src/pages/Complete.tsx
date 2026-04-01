import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CASES } from '../data/cases';
import { storage } from '../utils/storage';
import type { ConsultHistory } from '../types';

export default function Complete() {
  const { currentCaseId, formData, claimCalc, setCurrentCaseId } = useApp();
  const navigate = useNavigate();
  const caseData = currentCaseId ? CASES[currentCaseId] : null;

  useEffect(() => {
    if (!currentCaseId || !caseData) return;
    const entry: ConsultHistory = {
      id: `consult_${Date.now()}`,
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', ''),
      caseType: currentCaseId,
      caseName: caseData.name,
      status: 'completed',
      formData: formData as any,
      claimCalc: claimCalc ?? undefined,
    };
    storage.addHistory(entry);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '640px', width: '100%', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', background: '#000', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '18px', color: '#fff', fontWeight: 700 }}>✓</span>
        </div>

        <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>완료 /</div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>서류 생성 완료</h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px', lineHeight: 1.7 }}>
          {caseData?.name} 서류가 생성되었습니다.<br/>필요 시 변호사 검토 후 제출하세요.
        </p>

        {caseData && (
          <div style={{ border: '1px solid #000', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e5e5' }}>
              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px' }}>생성된 서류 /</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{caseData.name}</div>
            </div>
            {caseData.documents.filter(d => d.type === 'auto').map(doc => (
              <div key={doc.id} style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px' }}>{doc.name}</span>
                <span style={{ fontSize: '11px', color: '#000', border: '1px solid #000', padding: '2px 7px', borderRadius: '2px' }}>AI 자동생성</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate('/consult/preview')} style={{ flex: 1, padding: '12px', background: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>미리보기</button>
          <button onClick={() => window.open('https://www.homelawyer.kr/?__xq7k2mz9p4r3tn8vw6jy5hd0cb1sf2el4ng8ouaq=dongtan-gh-lake2', '_blank')} style={{ flex: 1, padding: '12px', background: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>변호사 검토</button>
          <button onClick={() => { storage.clearCurrentSession(); setCurrentCaseId(null); navigate('/'); }} style={{ flex: 1, padding: '12px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>대시보드 →</button>
        </div>
      </div>
    </div>
  );
}
