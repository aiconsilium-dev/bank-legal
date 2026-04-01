import { useApp } from '../context/AppContext';
import { storage } from '../utils/storage';
import AppLayout from '../components/AppLayout';

const CASE_LABELS: Record<string, string> = {
  foreclosure: '임의경매', notice: '내용증명', payment_order: '지급명령',
  injunction: '가압류', attachment_order: '채권압류', member_dispute: '조합원분쟁', contribution_dispute: '출자금반환',
  compulsory_auction: '강제경매', complaint_response: '민원대응',
};

export default function History() {
  const { user } = useApp();
  const history = storage.getHistory();

  return (
    <AppLayout activeNav="상담 내역" topbarLeft="상담 내역" topbarRight={`${user?.institution}`}>
      <div style={{ padding: '48px 40px', maxWidth: '900px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>상담 내역 /</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px' }}>전체 상담 이력</h1>
        </div>
        <div style={{ borderTop: '1px solid #000' }}>
          {history.length === 0 ? (
            <div style={{ padding: '32px 0', fontSize: '13px', color: '#aaa' }}>상담 이력이 없습니다.</div>
          ) : history.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{CASE_LABELS[item.caseType] || item.caseType}</div>
                <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{item.date}</div>
              </div>
              <span style={{ fontSize: '11px', color: item.status === 'completed' ? '#000' : '#aaa', border: `1px solid ${item.status === 'completed' ? '#000' : '#e5e5e5'}`, padding: '2px 8px', borderRadius: '2px' }}>
                {item.status === 'completed' ? '완료' : '진행중'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
