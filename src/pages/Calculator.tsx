import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/AppLayout';

function calcDays(from: string, to: string) {
  if (!from || !to) return 0;
  return Math.max(0, Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 86400000));
}

export default function Calculator() {
  const navigate = useNavigate();
  const { user } = useApp();

  const [f, setF] = useState({
    principal: '',
    loanDate: '',
    interestRate: '',
    defaultDate: '',
    delayRate: '15',
    calcDate: new Date().toISOString().slice(0, 10),
  });

  const principal = parseInt(f.principal.replace(/,/g, '')) || 0;
  const interestRate = parseFloat(f.interestRate) || 0;
  const delayRate = parseFloat(f.delayRate) || 15;
  const normalDays = calcDays(f.loanDate, f.defaultDate);
  const delayDays = calcDays(f.defaultDate, f.calcDate);
  const interest = Math.floor(principal * (interestRate / 100) * (normalDays / 365));
  const delayDamage = Math.floor(principal * (delayRate / 100) * (delayDays / 365));
  const total = principal + interest + delayDamage;

  const fmt = (n: number) => n > 0 ? n.toLocaleString() + '원' : '—';

  // 인지대 계산
  const stampDuty = total < 10000000 ? 5000
    : total < 100000000 ? Math.floor(total * 0.0005)
    : total < 1000000000 ? Math.floor(total * 0.00045)
    : Math.floor(total * 0.0004);
  const serviceFee = 5200 * 5;

  const set = (k: string, v: string) => setF(prev => ({ ...prev, [k]: v }));

  return (
    <AppLayout activeNav="채권계산기" topbarLeft={`채권계산기 — ${user?.institution}`}>
      <div style={{ display: 'grid', gridTemplateColumns: '45% 55%', gap: '0' }}>
        {/* 입력 */}
        <div style={{ padding: '48px 40px', borderRight: '1px solid #e5e5e5' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '28px' }}>입력 /</div>

          {[
            { label: '원금', key: 'principal', placeholder: '100,000,000', type: 'text', hint: '숫자만 입력 (콤마 자동)' },
            { label: '대출 실행일', key: 'loanDate', placeholder: '', type: 'date', hint: '이자 기산점' },
            { label: '약정 이자율 (%)', key: 'interestRate', placeholder: '4.5', type: 'text', hint: '연 이자율' },
            { label: '연체 시작일', key: 'defaultDate', placeholder: '', type: 'date', hint: '지연손해금 기산점' },
            { label: '지연손해금율 (%)', key: 'delayRate', placeholder: '15', type: 'text', hint: '※ 소송촉진법 제3조 제1항 · 동법 시행령 제1조의2: 연 12% (2019.6.1. 시행) / 민법 제379조: 연 5%' },
            { label: '계산 기준일', key: 'calcDate', placeholder: '', type: 'date', hint: '오늘 날짜 기본값' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.06em', marginBottom: '8px' }}>{field.label}</div>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={f[field.key as keyof typeof f]}
                onChange={e => {
                  let v = e.target.value;
                  if (field.key === 'principal') {
                    v = v.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  }
                  set(field.key, v);
                }}
                style={{ width: '100%', border: 'none', borderBottom: '1px solid #000', padding: '8px 0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: 'transparent' }}
              />
              <div style={{ fontSize: '11px', color: '#ccc', marginTop: '4px' }}>{field.hint}</div>
            </div>
          ))}
        </div>

        {/* 결과 */}
        <div style={{ padding: '48px 40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '28px' }}>계산 결과 /</div>

          {/* 기간 */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px' }}>기간</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', border: '1px solid #e5e5e5' }}>
              {[
                { label: '이자 기간', value: normalDays > 0 ? `${normalDays}일` : '—' },
                { label: '지연손해금 기간', value: delayDays > 0 ? `${delayDays}일` : '—' },
              ].map((s, i) => (
                <div key={s.label} style={{ padding: '14px', borderRight: i === 0 ? '1px solid #e5e5e5' : 'none' }}>
                  <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 채권 계산 */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px' }}>채권 금액</div>
            <div style={{ borderTop: '1px solid #000' }}>
              {[
                { label: '원금', value: fmt(principal), bold: false },
                { label: `이자 (연 ${interestRate}%, ${normalDays}일)`, value: fmt(interest), bold: false },
                { label: `지연손해금 (연 ${delayRate}%, ${delayDays}일)`, value: fmt(delayDamage), bold: false },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>{row.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #000' }}>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>합계</span>
                <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* 비용 */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px' }}>법원 비용 (추정)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', border: '1px solid #e5e5e5' }}>
              {[
                { label: '인지대', value: total > 0 ? fmt(stampDuty) : '—' },
                { label: '송달료', value: fmt(serviceFee) },
              ].map((s, i) => (
                <div key={s.label} style={{ padding: '14px', borderRight: i === 0 ? '1px solid #e5e5e5' : 'none' }}>
                  <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 법률 근거 주석 */}
          <div style={{ marginBottom: '28px', padding: '16px', background: '#f9f9f9', borderRadius: '2px' }}>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>법률 근거 /</div>
            <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.8 }}>
              ※ 소송촉진 등에 관한 특례법 제3조 제1항 · 동법 시행령 제1조의2<br/>
              &nbsp;&nbsp;&nbsp;현행 법정이율: 연 12% (2019.6.1. 시행)<br/>
              ※ 민법 제379조 법정이율: 연 5%<br/>
              ※ 인지대: 민사소송 등 인지법 제2조<br/>
              ※ 송달료: 민사소송규칙 제19조 (1회 5,200원 × 당사자 수)
            </div>
          </div>

          <button onClick={() => navigate('/consult')}
            style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', borderRadius: '2px' }}>
            AI 법률 상담으로 서류 생성 →
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
