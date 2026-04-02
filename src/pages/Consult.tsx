import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/* ══════════════════════════════════════════════════════
   AI 법률상담 — 의사결정 트리 기반 절차 안내
   ══════════════════════════════════════════════════════ */

type Step = 'situation' | 'debt-recovery' | 'complaint' | 'legal-advice' | 'doc-gen' | 'procedure-detail';

interface ProcedureInfo {
  title: string;
  description: string;
  documents: { name: string; required: boolean; condition?: string }[];
  estimatedDuration: string;
  estimatedCost: string;
  relatedCases?: string[];
}

const PROCEDURES: Record<string, ProcedureInfo> = {
  '임의경매': {
    title: '임의경매 (담보권 실행)',
    description: '부동산 담보가 설정되어 있는 경우, 근저당권에 기해 임의경매를 신청합니다.',
    documents: [
      { name: '대출약정서', required: true },
      { name: '근저당권설정계약서', required: true },
      { name: '이자조회표 (원금/이자/이율/지연이자)', required: true },
      { name: '채무자/소유자 인적사항', required: true },
      { name: '근보증서', required: false, condition: '채무자 ≠ 소유자인 경우' },
      { name: '경매예정통지서 (발송 증빙)', required: true },
    ],
    estimatedDuration: '6~12개월',
    estimatedCost: '인지대 + 송달료 약 50~100만원',
    relatedCases: ['연대보증인 대위변제 후 강제경매 취하', '기한이익상실 예정통지 방법'],
  },
  '자동차경매': {
    title: '자동차 경매/공매',
    description: '차량 담보가 있는 경우, 자동차에 대한 경매 또는 공매를 진행합니다.',
    documents: [
      { name: '대출약정서', required: true },
      { name: '자동차등록증 사본', required: true },
      { name: '근저당권설정 증빙', required: true },
      { name: '이자조회표', required: true },
      { name: '채무자 인적사항', required: true },
    ],
    estimatedDuration: '3~6개월',
    estimatedCost: '인지대 + 송달료 약 30~50만원',
  },
  '지급명령': {
    title: '지급명령 신청 (간이절차)',
    description: '무담보 금전채권에 대해 법원에 지급명령을 신청합니다. 이의 없으면 판결과 동일한 효력.',
    documents: [
      { name: '대출약정서', required: true },
      { name: '거래내역서', required: true },
      { name: '이자조회표', required: true },
      { name: '채무자 인적사항', required: true },
      { name: '내용증명 발송 증빙', required: false, condition: '기한이익상실통지를 한 경우' },
    ],
    estimatedDuration: '1~2개월 (이의 없을 시)',
    estimatedCost: '인지대 약 5~15만원 + 송달료',
  },
  '대여금소송': {
    title: '대여금 반환 청구 소송',
    description: '무담보 채권으로 지급명령 이의 시 또는 바로 소송으로 진행합니다.',
    documents: [
      { name: '소장', required: true },
      { name: '대출약정서', required: true },
      { name: '거래내역서', required: true },
      { name: '이자조회표', required: true },
      { name: '기한이익상실통지 증빙', required: true },
    ],
    estimatedDuration: '6~12개월',
    estimatedCost: '인지대 + 송달료 + 변호사 비용',
  },
  '강제집행': {
    title: '강제집행',
    description: '판결문, 지급명령 결정문, 공정증서 등 집행권원이 있는 경우 강제집행을 진행합니다.',
    documents: [
      { name: '집행권원 (판결문/지급명령결정문/공정증서)', required: true },
      { name: '송달증명원', required: true },
      { name: '확정증명원 (판결·지급명령의 경우)', required: true },
      { name: '채무자 재산조회 결과', required: false, condition: '재산명시 신청한 경우' },
    ],
    estimatedDuration: '1~3개월',
    estimatedCost: '집행비용 약 30~80만원',
  },
  '강제경매': {
    title: '강제경매',
    description: '집행권원(판결문/지급명령결정문/공정증서)에 기해 부동산 강제경매를 진행합니다.',
    documents: [
      { name: '집행권원 (판결문/지급명령결정문/공정증서)', required: true },
      { name: '송달증명원', required: true },
      { name: '확정증명원', required: true },
      { name: '부동산 등기부등본', required: true },
      { name: '채무자 인적사항', required: true },
    ],
    estimatedDuration: '6~12개월',
    estimatedCost: '인지대 + 송달료 약 50~100만원',
  },
};

const COMPLAINT_TYPES = [
  { id: 'incomplete_sale', label: '불완전판매', desc: '상품 설명 불충분, 적합성 위반' },
  { id: 'interest_rate', label: '이자율 분쟁', desc: '금리인하요구권, 과다이자 주장' },
  { id: 'loan_rejection', label: '대출 거절', desc: '대출 거절 사유 소명' },
  { id: 'collection', label: '추심 관련', desc: '부당 추심 주장' },
  { id: 'personal_info', label: '개인정보', desc: '정보 유출, 동의 없는 활용' },
  { id: 'other', label: '기타', desc: '위에 해당하지 않는 민원' },
];

const SIMILAR_CASES = [
  { title: '기한이익상실 예정통지 방법', desc: '내용증명 vs 등기우편 — 판례 기준', tag: '자주 조회' },
  { title: '이중 채권양수도 리스크 해소', desc: '양수인 간 우선순위 판단', tag: '최근 질의' },
  { title: '할부항변권 처리', desc: '할부거래에서의 항변권 인정 범위', tag: '실무 사례' },
  { title: '사기이용계좌 대출제한', desc: '전자금융거래법상 제한 범위', tag: '최근 질의' },
];

export default function Consult() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('situation');
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [complaintDraft, setComplaintDraft] = useState<string | null>(null);
  const [generatingDraft, setGeneratingDraft] = useState(false);

  const procedure = selectedProcedure ? PROCEDURES[selectedProcedure] : null;

  const handleDocCheck = (docName: string) => {
    setCheckedDocs(prev => {
      const next = new Set(prev);
      if (next.has(docName)) next.delete(docName);
      else next.add(docName);
      return next;
    });
  };

  const handleComplaintGenerate = (type: string) => {
    setSelectedComplaint(type);
    setGeneratingDraft(true);
    setTimeout(() => {
      setComplaintDraft(`[금융감독원 민원 답변서 초안]\n\n민원 유형: ${type}\n\n1. 민원 요지\n  고객 ◯◯◯님은 ${type} 관련하여 이의를 제기하셨습니다.\n\n2. 당행 검토 의견\n  당행은 관련 법령 및 내부 규정에 따라 적법하게 업무를 수행하였으며,\n  구체적인 사실관계는 아래와 같습니다.\n\n  [상세 내용 작성 필요]\n\n3. 결론\n  위와 같은 사유로 고객의 민원에 대해 아래와 같이 회신드립니다.\n\n  [결론 작성 필요]\n\n* 이 초안은 AI가 생성한 것으로, 반드시 담당자의 검토가 필요합니다.`);
      setGeneratingDraft(false);
    }, 1500);
  };

  const goToProcedure = (procKey: string) => {
    setSelectedProcedure(procKey);
    setCheckedDocs(new Set());
    setStep('procedure-detail');
  };

  const restart = () => {
    setStep('situation');
    setSelectedProcedure(null);
    setCheckedDocs(new Set());
    setSelectedComplaint(null);
    setComplaintDraft(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{ borderBottom: '1px solid #e5e5e5', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/')} style={{ fontSize: '18px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>AI 법률상담</div>
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>{user?.institution} · 의사결정 트리 기반</div>
          </div>
        </div>
        <button onClick={restart} style={{ fontSize: '12px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          처음으로
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', maxWidth: '720px', margin: '0 auto', width: '100%', padding: '32px 24px' }}>

        {/* ══ Step 1: 상황 선택 ══ */}
        {step === 'situation' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', color: '#0061AF', fontWeight: 600, marginBottom: '8px' }}>STEP 1</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>
                {user?.name}님, 어떤 상황이신가요?
              </h2>
              <p style={{ fontSize: '14px', color: '#888' }}>해당하는 상황을 선택하면 바로 절차를 안내합니다.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}>
              {[
                { label: '연체 채권이 있어요', desc: '담보 유무에 따라 경매·지급명령·소송 안내', icon: '💰', next: 'debt-recovery' as Step },
                { label: '금감원 민원이 들어왔어요', desc: '민원 유형별 답변서 초안 AI 생성', icon: '📋', next: 'complaint' as Step },
                { label: '법률 해석이 필요해요', desc: '약관 해석, 판례 검토, 변호사 자문 연결', icon: '⚖️', next: 'legal-advice' as Step },
                { label: '서류를 만들어야 해요', desc: '경매신청서, 지급명령서, 가압류 등 자동생성', icon: '📄', next: 'doc-gen' as Step },
              ].map(opt => (
                <button key={opt.label} onClick={() => setStep(opt.next)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '20px',
                    border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fff',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0061AF'; e.currentTarget.style.background = '#F5F9FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.background = '#fff'; }}>
                  <span style={{ fontSize: '28px' }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#000', marginBottom: '4px' }}>{opt.label}</div>
                    <div style={{ fontSize: '13px', color: '#888' }}>{opt.desc}</div>
                  </div>
                  <span style={{ color: '#ccc', fontSize: '18px' }}>→</span>
                </button>
              ))}
            </div>

            {/* 유사 사례 참고 */}
            <div>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '12px' }}>📚 유사 사례 참고</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {SIMILAR_CASES.map(c => (
                  <div key={c.title} style={{ border: '1px solid #f0f0f0', borderRadius: '6px', padding: '14px', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#0061AF')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#f0f0f0')}>
                    <div style={{ fontSize: '10px', color: '#0061AF', fontWeight: 600, marginBottom: '6px' }}>{c.tag}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>{c.title}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ Step 2: 채권회수 — 담보 유무 ══ */}
        {step === 'debt-recovery' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', color: '#0061AF', fontWeight: 600, marginBottom: '8px' }}>STEP 2 — 채권회수</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>담보 상황을 선택하세요</h2>
              <p style={{ fontSize: '14px', color: '#888' }}>담보 유무에 따라 최적의 법적 절차가 달라집니다.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: '부동산 담보가 있어요', desc: '근저당권 기반 임의경매 신청', procedure: '임의경매', icon: '🏠' },
                { label: '차량 담보가 있어요', desc: '자동차 경매 또는 공매 진행', procedure: '자동차경매', icon: '🚗' },
                { label: '담보가 없어요', desc: '지급명령(간이) 또는 대여금 소송', procedure: '지급명령', icon: '📝' },
                { label: '이미 판결/지급명령이 있어요', desc: '강제집행 또는 강제경매 진행', procedure: '강제집행', icon: '⚡' },
              ].map(opt => (
                <button key={opt.label} onClick={() => goToProcedure(opt.procedure)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '20px',
                    border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fff',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0061AF'; e.currentTarget.style.background = '#F5F9FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.background = '#fff'; }}>
                  <span style={{ fontSize: '28px' }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{opt.label}</div>
                    <div style={{ fontSize: '13px', color: '#888' }}>{opt.desc}</div>
                  </div>
                  <span style={{ color: '#ccc', fontSize: '18px' }}>→</span>
                </button>
              ))}
            </div>

            <button onClick={() => setStep('situation')} style={{ marginTop: '24px', fontSize: '13px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              ← 이전으로
            </button>
          </div>
        )}

        {/* ══ Step 3: 절차별 상세 안내 ══ */}
        {step === 'procedure-detail' && procedure && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', color: '#00854A', fontWeight: 600, marginBottom: '8px' }}>STEP 3 — 절차 상세</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>{procedure.title}</h2>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>{procedure.description}</p>
            </div>

            {/* 예상 정보 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
              <div style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px' }}>예상 소요기간</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0061AF' }}>{procedure.estimatedDuration}</div>
              </div>
              <div style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px' }}>예상 비용</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>{procedure.estimatedCost}</div>
              </div>
            </div>

            {/* 필요 서류 체크리스트 */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📋 필요 서류 체크리스트
                <span style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>
                  ({checkedDocs.size}/{procedure.documents.length} 준비)
                </span>
              </div>
              <div style={{ border: '1px solid #e5e5e5', borderRadius: '8px', overflow: 'hidden' }}>
                {procedure.documents.map((doc, i) => (
                  <label key={doc.name} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
                    borderBottom: i < procedure.documents.length - 1 ? '1px solid #f0f0f0' : 'none',
                    cursor: 'pointer', background: checkedDocs.has(doc.name) ? '#F8FFF8' : '#fff',
                    transition: 'background 0.1s',
                  }}>
                    <input type="checkbox" checked={checkedDocs.has(doc.name)} onChange={() => handleDocCheck(doc.name)}
                      style={{ marginTop: '2px', accentColor: '#00854A', width: '18px', height: '18px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {doc.name}
                        {doc.required && <span style={{ fontSize: '10px', color: '#C9252C', fontWeight: 700 }}>필수</span>}
                      </div>
                      {doc.condition && (
                        <div style={{ fontSize: '12px', color: '#E65100', marginTop: '3px' }}>⚠️ {doc.condition}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 유사 사례 */}
            {procedure.relatedCases && procedure.relatedCases.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '10px' }}>📚 관련 사례</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {procedure.relatedCases.map(c => (
                    <span key={c} style={{ fontSize: '12px', color: '#0061AF', background: '#F5F9FF', padding: '6px 12px', borderRadius: '16px', border: '1px solid #D6E8FF' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => navigate('/lawyer')}
                style={{ flex: 1, padding: '16px', background: '#00854A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit' }}>
                법무법인에 의뢰하기 →
              </button>
              <button onClick={() => navigate('/consult/documents')}
                style={{ padding: '16px 20px', background: '#fff', color: '#0061AF', border: '2px solid #0061AF', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}>
                서류 작성
              </button>
            </div>

            <button onClick={() => setStep('debt-recovery')} style={{ marginTop: '20px', fontSize: '13px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              ← 이전으로
            </button>
          </div>
        )}

        {/* ══ 금감원 민원 대응 ══ */}
        {step === 'complaint' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', color: '#C9252C', fontWeight: 600, marginBottom: '8px' }}>STEP 2 — 민원 대응</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>민원 유형을 선택하세요</h2>
              <p style={{ fontSize: '14px', color: '#888' }}>유형에 맞는 답변서 초안을 AI가 생성합니다.</p>
            </div>

            {!complaintDraft ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '24px' }}>
                {COMPLAINT_TYPES.map(ct => (
                  <button key={ct.id} onClick={() => handleComplaintGenerate(ct.label)}
                    disabled={generatingDraft}
                    style={{
                      padding: '18px', border: '1px solid #e5e5e5', borderRadius: '8px',
                      background: '#fff', cursor: generatingDraft ? 'wait' : 'pointer',
                      textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!generatingDraft) { e.currentTarget.style.borderColor = '#C9252C'; e.currentTarget.style.background = '#FFF5F5'; } }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.background = '#fff'; }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{ct.label}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{ct.desc}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#C9252C', marginBottom: '12px' }}>📝 {selectedComplaint} — 답변서 초안</div>
                <div style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '20px', background: '#FAFAFA', marginBottom: '20px' }}>
                  <pre style={{ fontSize: '13px', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#333', margin: 0 }}>
                    {complaintDraft}
                  </pre>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ flex: 1, padding: '14px', background: '#C9252C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit' }}>
                    답변서 다운로드
                  </button>
                  <button onClick={() => { setComplaintDraft(null); setSelectedComplaint(null); }}
                    style={{ padding: '14px 20px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                    다른 유형
                  </button>
                </div>
              </div>
            )}

            {generatingDraft && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>AI 답변서 초안 생성 중...</div>
                <div style={{ fontSize: '24px' }}>⏳</div>
              </div>
            )}

            <button onClick={() => setStep('situation')} style={{ marginTop: '24px', fontSize: '13px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              ← 이전으로
            </button>
          </div>
        )}

        {/* ══ 법률 해석 / 자문 ══ */}
        {step === 'legal-advice' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', color: '#0061AF', fontWeight: 600, marginBottom: '8px' }}>법률 자문</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>어떤 법률 해석이 필요하신가요?</h2>
              <p style={{ fontSize: '14px', color: '#888' }}>AI가 1차 안내를 드리고, 복잡한 건은 변호사에게 자문 요청합니다.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
              {[
                { label: '약관 조항 해석', desc: '대출약관, 보증약관, 연체이자 조항 등', action: () => {} },
                { label: '판례 검토 요청', desc: '유사 판례 검색 및 적용 가능성 검토', action: () => {} },
                { label: '절차 적법성 확인', desc: '기한이익상실통지, 경매절차 등 적법성', action: () => {} },
              ].map(opt => (
                <button key={opt.label} onClick={opt.action}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0061AF'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{opt.desc}</div>
                  </div>
                  <span style={{ color: '#ccc' }}>→</span>
                </button>
              ))}
            </div>

            <button onClick={() => navigate('/lawyer')}
              style={{ width: '100%', padding: '16px', background: '#C9252C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit' }}>
              변호사 자문 요청 →
            </button>

            <button onClick={() => setStep('situation')} style={{ marginTop: '20px', fontSize: '13px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              ← 이전으로
            </button>
          </div>
        )}

        {/* ══ 서류 자동생성 (Documents 페이지로 이동) ══ */}
        {step === 'doc-gen' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', color: '#0061AF', fontWeight: 600, marginBottom: '8px' }}>서류 자동생성</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>어떤 서류가 필요하신가요?</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: '경매신청서 (임의/강제)', desc: '부동산 담보 경매 신청', action: () => navigate('/consult/documents') },
                { label: '지급명령신청서', desc: '금전채권 간이절차', action: () => navigate('/consult/documents') },
                { label: '가압류신청서', desc: '채무자 재산 사전 보전', action: () => navigate('/consult/documents') },
                { label: '채권압류 및 추심명령신청서', desc: '제3채무자 직접 추심', action: () => navigate('/consult/documents') },
                { label: '기한이익상실통지서', desc: '대출금 기한이익 상실 통지', action: () => navigate('/consult/documents') },
                { label: '채권양도통지서', desc: '채권양도 사실 통지', action: () => navigate('/consult/documents') },
                { label: '내용증명', desc: '법적 효력 있는 통지서', action: () => navigate('/consult/documents') },
              ].map(opt => (
                <button key={opt.label} onClick={opt.action}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px',
                    border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fff',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0061AF'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e5e5'; }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{opt.desc}</div>
                  </div>
                  <span style={{ color: '#ccc' }}>→</span>
                </button>
              ))}
            </div>

            <button onClick={() => setStep('situation')} style={{ marginTop: '24px', fontSize: '13px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              ← 이전으로
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
