import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CASES } from '../data/cases';
import { formatCurrencyInput } from '../utils/calculations';

export default function Form() {
  const { currentCaseId, formData, setFormData } = useApp();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentCaseId || !CASES[currentCaseId]) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <button onClick={() => navigate('/consult')} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', borderRadius: '2px' }}>상담 시작 →</button>
      </div>
    );
  }

  const caseData = CASES[currentCaseId];
  const fields = caseData.formFields;

  const validate = () => {
    const e: Record<string, string> = {};
    fields.filter(f => f.required).forEach(f => {
      if (!formData[f.id as keyof typeof formData]) e[f.id] = '필수 항목입니다.';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) navigate('/consult/generating');
  };

  const handleChange = (id: string, val: string) => {
    setFormData({ ...formData, [id]: val });
    if (errors[id]) setErrors(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{ borderBottom: '1px solid #e5e5e5', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate('/consult/documents')} style={{ fontSize: '18px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>정보 입력</div>
          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>{caseData.name}</div>
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>정보 입력 /</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px' }}>서류 생성에 필요한 정보를 입력해주세요</h1>
        </div>

        <div style={{ borderTop: '1px solid #e5e5e5' }}>
          {fields.map(field => (
            <div key={field.id} style={{ padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#000', letterSpacing: '0.05em' }}>{field.label}</label>
                {field.required && <span style={{ fontSize: '10px', color: '#c00' }}>*</span>}
              </div>
              {field.type === 'date' ? (
                <input type="date" value={formData[field.id as keyof typeof formData] as string || ''}
                  onChange={e => handleChange(field.id, e.target.value)}
                  style={{ width: '100%', border: 'none', borderBottom: `1px solid ${errors[field.id] ? '#c00' : '#000'}`, padding: '8px 0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: 'transparent', color: '#000' }}/>
              ) : (
                <input type="text"
                  placeholder={field.placeholder}
                  value={formData[field.id as keyof typeof formData] as string || ''}
                  onChange={e => {
                    let val = e.target.value;
                    if ((field as any).format === 'currency') val = formatCurrencyInput(val);
                    handleChange(field.id, val);
                  }}
                  style={{ width: '100%', border: 'none', borderBottom: `1px solid ${errors[field.id] ? '#c00' : '#000'}`, padding: '8px 0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: 'transparent', color: '#000' }}/>
              )}
              {(field as any).help && <div style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>{(field as any).help}</div>}
              {errors[field.id] && <div style={{ fontSize: '11px', color: '#c00', marginTop: '4px' }}>{errors[field.id]}</div>}
            </div>
          ))}
        </div>

        <button onClick={handleSubmit}
          style={{ width: '100%', marginTop: '32px', padding: '14px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', borderRadius: '2px' }}>
          서류 생성하기 →
        </button>
      </div>
    </div>
  );
}
