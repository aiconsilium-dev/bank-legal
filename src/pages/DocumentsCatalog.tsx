import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CASES } from '../data/cases';
import { storage } from '../utils/storage';
import AppLayout from '../components/AppLayout';

const DOC_TYPES = [
  { id: 'foreclosure', title: '임의경매 신청서', desc: '근저당권 기반 담보 부동산 경매 신청', icon: '01' },
  { id: 'injunction', title: '가압류 신청서', desc: '부동산·채권·동산 보전 처분', icon: '02' },
  { id: 'payment_order', title: '지급명령 신청서', desc: '소송 없이 집행권원 확보', icon: '03' },
  { id: 'attachment_order', title: '압류·추심명령 신청서', desc: '집행권원 기반 채권 추심', icon: '04' },
  { id: 'notice', title: '내용증명 (연체 독촉)', desc: '법적 효력 있는 채무 이행 촉구', icon: '05' },
  { id: 'compulsory_auction', title: '강제경매 신청서', desc: '판결·지급명령 기반 경매', icon: '06' },
  { id: 'member_dispute', title: '조합원 이의신청서', desc: '제명·탈퇴 결정 이의 제기', icon: '07' },
  { id: 'contribution_dispute', title: '출자금 반환 청구서', desc: '탈퇴 후 미반환 출자금 청구', icon: '08' },
];

export default function DocumentsCatalog() {
  const { user, setCurrentCaseId } = useApp();
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setCurrentCaseId(id);
    storage.setCurrentCase(id);
    navigate('/consult/documents');
  };

  return (
    <AppLayout activeNav="서류 자동화" topbarLeft="서류 자동화" topbarRight={`${user?.institution}`}>
      <div style={{ padding: '48px 40px', maxWidth: '900px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>서류 자동화 /</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>자동 생성 서류 카탈로그</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>서류를 선택하면 바로 정보 입력 및 자동 생성이 시작됩니다.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', border: '1px solid #e5e5e5' }}>
          {DOC_TYPES.map((doc, i) => (
            <button key={doc.id} onClick={() => handleSelect(doc.id)}
              style={{
                padding: '24px', textAlign: 'left', background: '#fff', border: 'none',
                borderRight: i % 2 === 0 ? '1px solid #e5e5e5' : 'none',
                borderBottom: i < DOC_TYPES.length - 2 ? '1px solid #e5e5e5' : 'none',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#f9f9f9'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#fff'}>
              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '10px' }}>{doc.icon} /</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#000', marginBottom: '6px' }}>{doc.title}</div>
              <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.6 }}>{doc.desc}</div>
              <div style={{ fontSize: '12px', color: '#ccc', marginTop: '12px' }}>
                서류 {CASES[doc.id]?.documents?.length || 0}건 · 약 {CASES[doc.id]?.estimatedTime || '15분'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
