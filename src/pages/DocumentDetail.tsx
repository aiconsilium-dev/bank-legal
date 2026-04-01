import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CASES } from '../data/cases';
import { storage } from '../utils/storage';
import AppLayout from '../components/AppLayout';

const DOC_META: Record<string, { title: string; sub: string; caseId: string; faq: { q: string; a: string }[] }> = {
  foreclosure: {
    title: '임의경매 신청서',
    sub: '근저당권 기반 담보 부동산 경매',
    caseId: 'foreclosure',
    faq: [
      { q: '임의경매와 강제경매의 차이는?', a: '임의경매는 근저당권 등 담보권을 근거로 신청하며 집행권원이 필요 없습니다. 강제경매는 판결·지급명령 등 집행권원이 있어야 합니다.' },
      { q: '신청 후 얼마나 걸리나요?', a: '법원 접수 후 경매 개시결정까지 약 1~2주, 매각까지 통상 3~6개월 소요됩니다.' },
      { q: '인지대는 얼마나 되나요?', a: '청구금액의 0.04~0.05% 수준이며 채권계산기에서 자동 계산됩니다.' },
    ],
  },
  injunction: {
    title: '가압류 신청서',
    sub: '부동산·채권·동산 보전 처분',
    caseId: 'injunction',
    faq: [
      { q: '가압류 신청 시 담보 제공이 필요한가요?', a: '법원이 요구하는 경우 청구금액의 1/10~1/5 수준의 공탁금이 필요할 수 있습니다.' },
      { q: '가압류 후 본안소송 기한은?', a: '가압류 집행 후 2주 이내에 본안소송을 제기해야 하며, 미제기 시 채무자가 취소 신청 가능합니다.' },
    ],
  },
  payment_order: {
    title: '지급명령 신청서',
    sub: '소송 없이 집행권원 확보',
    caseId: 'payment_order',
    faq: [
      { q: '지급명령과 소송의 차이는?', a: '지급명령은 채무자가 2주 내 이의신청하지 않으면 확정되어 즉시 강제집행 가능합니다. 소송 대비 비용·시간이 적게 듭니다.' },
      { q: '이의신청되면 어떻게 되나요?', a: '자동으로 통상 소송 절차로 이행됩니다.' },
    ],
  },
  notice: {
    title: '내용증명 (연체 독촉)',
    sub: '법적 효력 있는 채무 이행 촉구',
    caseId: 'notice',
    faq: [
      { q: '내용증명이 법적으로 어떤 의미인가요?', a: '그 자체로 강제력은 없으나, 소멸시효 중단 효력이 있으며 향후 소송에서 증거로 활용됩니다.' },
      { q: '발송 방법은?', a: '우체국 창구에서 내용증명 우편으로 발송하며, 발송 확인서를 반드시 보관해야 합니다.' },
    ],
  },
  attachment_order: {
    title: '압류·추심명령 신청서',
    sub: '집행권원 기반 채권 추심',
    caseId: 'attachment_order',
    faq: [
      { q: '추심명령과 전부명령의 차이는?', a: '추심명령은 채권자가 직접 제3채무자(은행 등)에서 추심하는 방식이고, 전부명령은 채권 자체가 채권자에게 이전됩니다.' },
    ],
  },
  member_dispute: {
    title: '조합원 이의신청서',
    sub: '제명·탈퇴 결정 이의 제기',
    caseId: 'member_dispute',
    faq: [
      { q: '이의신청 기한이 있나요?', a: '조합 정관에서 정한 기한이 있으며, 통상 결정 통보 후 30일 이내입니다.' },
    ],
  },
  contribution_dispute: {
    title: '출자금 반환 청구 내용증명',
    sub: '탈퇴 후 미반환 출자금 청구',
    caseId: 'contribution_dispute',
    faq: [
      { q: '출자금 반환 기한은?', a: '조합 정관에서 정한 기한(통상 60~90일)이며, 기한 경과 시 지연손해금을 청구할 수 있습니다.' },
    ],
  },
  compulsory_auction: {
    title: '강제경매 신청서',
    sub: '판결·지급명령 기반 경매',
    caseId: 'compulsory_auction',
    faq: [
      { q: '강제경매 신청 전 필요 서류는?', a: '집행권원(판결문 정본 등), 송달증명원, 확정증명원이 필요합니다.' },
    ],
  },
};

export default function DocumentDetail() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { setCurrentCaseId } = useApp();

  const meta = type ? DOC_META[type] : null;
  const caseData = meta ? CASES[meta.caseId] : null;

  if (!meta || !caseData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>서류 정보를 찾을 수 없습니다.</div>
          <button onClick={() => navigate('/')} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', borderRadius: '2px' }}>대시보드 →</button>
        </div>
      </div>
    );
  }

  const handleStart = () => {
    setCurrentCaseId(meta.caseId);
    storage.setCurrentCase(meta.caseId);
    navigate('/consult/documents');
  };

  return (
    <AppLayout topbarLeft={meta?.title || '서류 상세'}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* 헤더 */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid #e5e5e5', paddingBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>서류 상세 /</div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '6px' }}>{meta.title}</h1>
            <p style={{ fontSize: '14px', color: '#666' }}>{caseData.description}</p>
          </div>
          <button onClick={handleStart}
            style={{ padding: '12px 24px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', borderRadius: '2px', flexShrink: 0 }}>
            바로 생성하기 →
          </button>
        </div>

        {/* 필요 서류 */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>필요 서류 /</div>
          <div style={{ borderTop: '1px solid #000' }}>
            {caseData.documents.map((doc, i) => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#ccc', minWidth: '20px' }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{doc.name}</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{doc.description}</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', border: `1px solid ${doc.type === 'auto' ? '#000' : '#e5e5e5'}`, color: doc.type === 'auto' ? '#000' : '#aaa', padding: '2px 7px', borderRadius: '2px', flexShrink: 0 }}>
                  {doc.type === 'auto' ? 'AI 자동' : doc.type === 'separate' ? '별도 발급' : '표준양식'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 진행 절차 */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>진행 절차 /</div>
          <div style={{ borderTop: '1px solid #e5e5e5' }}>
            {caseData.procedureSteps.map((step, i) => (
              <div key={step.id} style={{ display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: '14px', padding: '14px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'start' }}>
                <span style={{ fontSize: '10px', color: '#ccc', paddingTop: '3px' }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{step.title}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{step.description}</div>
                </div>
                <span style={{ fontSize: '11px', color: '#aaa', flexShrink: 0 }}>{step.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        {meta.faq.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>자주 묻는 질문 /</div>
            <div style={{ borderTop: '1px solid #e5e5e5' }}>
              {meta.faq.map((f, i) => (
                <div key={i} style={{ padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Q. {f.q}</div>
                  <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>A. {f.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleStart}
          style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', borderRadius: '2px' }}>
          {meta.title} 생성 시작 →
        </button>
      </div>
    </AppLayout>
  );
}
