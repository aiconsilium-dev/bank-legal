import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

const MONTHLY = [
  { month: '2026.01', actions: 5, recovered: '8,200만', cost: '0원', docs: 12 },
  { month: '2026.02', actions: 9, recovered: '14,500만', cost: '0원', docs: 21 },
  { month: '2026.03', actions: 7, recovered: '11,300만', cost: '0원', docs: 18 },
];

const ACTION_BREAKDOWN = [
  { type: '임의경매 신청', count: 3, amount: '12,600만' },
  { type: '지급명령 신청', count: 8, amount: '7,200만' },
  { type: '가압류 신청', count: 5, amount: '8,900만' },
  { type: '내용증명 발송', count: 12, amount: '—' },
  { type: '채권압류·추심', count: 4, amount: '4,800만' },
  { type: '금감원 민원 대응', count: 3, amount: '—' },
];

export default function ChairmanReport() {
  const navigate = useNavigate();

  return (
    <AppLayout topbarLeft="법적 조치 리포트" topbarRight={<button onClick={() => window.print()} style={{ padding: '4px 12px', background: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit', borderRadius: '2px' }}>인쇄</button>}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #e5e5e5', paddingBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>리포트 /</div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '6px' }}>2026년 1분기 법적 조치 현황</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>뱅크법률집사를 통해 처리된 모든 법적 조치 내역입니다.</p>
        </div>

        {/* 핵심 요약 */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>A / 핵심 지표</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', border: '1px solid #e5e5e5' }}>
            {[
              { label: '총 법적 조치', value: '21건' },
              { label: '회수 금액', value: '34,000만' },
              { label: '자동 생성 서류', value: '51건' },
              { label: '변호사 비용 절감', value: '약 840만원' },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: '20px', borderRight: i < 3 ? '1px solid #e5e5e5' : 'none' }}>
                <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '6px' }}>{s.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 월별 현황 */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>B / 월별 현황</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000' }}>
                {['기간', '법적 조치', '회수 금액', '서류 생성', '법원 비용'].map(h => (
                  <th key={h} style={{ padding: '8px 0', textAlign: 'left', fontSize: '11px', color: '#aaa', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MONTHLY.map(row => (
                <tr key={row.month} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 0', fontWeight: 500 }}>{row.month}</td>
                  <td style={{ padding: '12px 0' }}>{row.actions}건</td>
                  <td style={{ padding: '12px 0', fontWeight: 500 }}>{row.recovered}</td>
                  <td style={{ padding: '12px 0' }}>{row.docs}건</td>
                  <td style={{ padding: '12px 0', color: '#888' }}>{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 유형별 */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>C / 조치 유형별 분류</div>
          <div style={{ borderTop: '1px solid #000' }}>
            {ACTION_BREAKDOWN.map((row, i) => (
              <div key={row.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#ccc', minWidth: '20px' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{row.type}</span>
                </div>
                <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
                  <span style={{ color: '#888' }}>{row.amount}</span>
                  <span style={{ fontWeight: 600, minWidth: '30px', textAlign: 'right' }}>{row.count}건</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/')} style={{ padding: '12px 24px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>대시보드 →</button>
      </div>
    </AppLayout>
  );
}
