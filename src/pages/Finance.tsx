import { useState } from 'react';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/AppLayout';

const PRODUCTS = {
  예금: [
    { name: '정기예금', desc: '일정 기간 예치 후 약정 이자 지급' },
    { name: '자유적금', desc: '자유 납입 적립식, 높은 금리' },
    { name: '보통예탁금', desc: '입출금 자유 수시 예탁' },
  ],
  대출: [
    { name: '조합원 담보대출', desc: '부동산 등 담보 제공 대출' },
    { name: '신용대출', desc: '담보 없이 신용도 기반 대출' },
    { name: '농업자금대출', desc: '농업 경영 지원 정책 대출' },
  ],
  공제: [
    { name: '생명공제', desc: '사망·고도장해 시 공제금 지급' },
    { name: '상해공제', desc: '사고로 인한 상해 보장' },
  ],
} as const;

const RATES = [
  { product: '정기예금 (1년)', base: '연 3.5%', pref: '+0.3%', max: '연 3.8%' },
  { product: '자유적금', base: '연 4.0%', pref: '+0.5%', max: '연 4.5%' },
  { product: '조합원 담보대출', base: '연 4.5%', pref: '-0.5%', max: '연 4.0%' },
  { product: '신용대출', base: '연 6.0%', pref: '-1.0%', max: '연 5.0%' },
];

const NOTICES = [
  { tag: '공지', title: '2026년 1분기 정기총회 개최 안내', date: '2026.03.15' },
  { tag: '공지', title: '금리인하요구권 행사 방법 안내', date: '2026.03.10' },
  { tag: '안내', title: '개인정보처리방침 개정 안내', date: '2026.03.05' },
];

export default function Finance() {
  const { user } = useApp();
  const [noticeSent, setNoticeSent] = useState(false);

  return (
    <AppLayout activeNav="금융 안내" topbarLeft={`금융 안내 — ${user?.institution}`} topbarRight="2026. 03">
      <div style={{ padding: '48px 40px', maxWidth: '800px' }}>
        <div style={{ marginBottom: '36px', borderBottom: '1px solid #e5e5e5', paddingBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>금융 안내 /</div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.5px' }}>금융 상품 및 공지 안내</h1>
        </div>

        {(['예금', '대출', '공제'] as const).map((cat, ci) => (
          <div key={cat} style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '12px' }}>{String.fromCharCode(65 + ci)} / {cat}</div>
            <div style={{ borderTop: '1px solid #000' }}>
              {PRODUCTS[cat].map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{p.desc}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#ccc' }}>→</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '12px' }}>D / 금리·조건 안내</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000' }}>
                {['상품', '기준 금리', '우대 조건', '최대 금리'].map(h => (
                  <th key={h} style={{ padding: '8px 0', textAlign: 'left', fontSize: '11px', color: '#aaa', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RATES.map(r => (
                <tr key={r.product} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 0', fontWeight: 500 }}>{r.product}</td>
                  <td style={{ padding: '10px 0', color: '#666' }}>{r.base}</td>
                  <td style={{ padding: '10px 0', color: '#666' }}>{r.pref}</td>
                  <td style={{ padding: '10px 0', fontWeight: 600 }}>{r.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em' }}>E / 조합 공지</div>
            <button onClick={() => setNoticeSent(true)}
              style={{ padding: '6px 14px', background: noticeSent ? '#f5f5f5' : '#000', color: noticeSent ? '#aaa' : '#fff', border: noticeSent ? '1px solid #e5e5e5' : 'none', cursor: noticeSent ? 'default' : 'pointer', fontSize: '12px', fontFamily: 'inherit', borderRadius: '2px' }}>
              {noticeSent ? '발송 완료' : '조합원 공지 발송'}
            </button>
          </div>
          {noticeSent && <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>SMS/앱 알림이 발송되었습니다.</div>}
          <div style={{ borderTop: '1px solid #000' }}>
            {NOTICES.map((n, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '10px', border: '1px solid #000', padding: '1px 6px', borderRadius: '2px' }}>{n.tag}</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{n.title}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#aaa' }}>{n.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
