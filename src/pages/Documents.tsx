import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/* ══════════════════════════════════════════════════════
   서류 자동생성 — 실무 서류 유형 구체화
   ══════════════════════════════════════════════════════ */

interface DocType {
  id: string;
  name: string;
  desc: string;
  category: 'auction' | 'order' | 'notice' | 'preserve';
  fields: { label: string; placeholder: string; required: boolean; condition?: string }[];
}

const DOC_TYPES: DocType[] = [
  {
    id: 'auction_voluntary', name: '임의경매신청서', desc: '근저당권에 기한 부동산 임의경매', category: 'auction',
    fields: [
      { label: '채권자(금융기관)명', placeholder: 'OO저축은행', required: true },
      { label: '채무자 성명', placeholder: '홍길동', required: true },
      { label: '채무자 주민등록번호', placeholder: '000000-0000000', required: true },
      { label: '소유자 성명 (채무자와 다른 경우)', placeholder: '소유자명', required: false, condition: '채무자 ≠ 소유자인 경우 필수' },
      { label: '담보물건 소재지', placeholder: '서울특별시 강남구 역삼동 000-00', required: true },
      { label: '청구금액 (원금)', placeholder: '50,000,000', required: true },
      { label: '이자/지연손해금', placeholder: '3,500,000', required: true },
      { label: '근저당권 설정금액', placeholder: '65,000,000', required: true },
    ],
  },
  {
    id: 'auction_forced', name: '강제경매신청서', desc: '집행권원에 기한 부동산 강제경매', category: 'auction',
    fields: [
      { label: '채권자(금융기관)명', placeholder: 'OO저축은행', required: true },
      { label: '채무자 성명', placeholder: '홍길동', required: true },
      { label: '집행권원 종류', placeholder: '판결문 / 지급명령결정문 / 공정증서', required: true },
      { label: '사건번호', placeholder: '2026가합00000', required: true },
      { label: '부동산 소재지', placeholder: '서울특별시 강남구 역삼동 000-00', required: true },
      { label: '청구금액', placeholder: '50,000,000', required: true },
    ],
  },
  {
    id: 'payment_order', name: '지급명령신청서', desc: '금전채권 간이절차', category: 'order',
    fields: [
      { label: '채권자(금융기관)명', placeholder: 'OO저축은행', required: true },
      { label: '채무자 성명', placeholder: '홍길동', required: true },
      { label: '채무자 주소', placeholder: '서울특별시 ...', required: true },
      { label: '청구금액 (원금)', placeholder: '30,000,000', required: true },
      { label: '약정이율', placeholder: '연 12%', required: true },
      { label: '지연이율', placeholder: '연 15%', required: true },
      { label: '대출실행일', placeholder: '2024-01-15', required: true },
      { label: '연체시작일', placeholder: '2025-06-15', required: true },
    ],
  },
  {
    id: 'injunction', name: '가압류신청서', desc: '채무자 재산 사전 보전', category: 'preserve',
    fields: [
      { label: '채권자(금융기관)명', placeholder: 'OO저축은행', required: true },
      { label: '채무자 성명', placeholder: '홍길동', required: true },
      { label: '피보전채권 금액', placeholder: '50,000,000', required: true },
      { label: '가압류 대상 재산', placeholder: '부동산/예금/자동차 등', required: true },
      { label: '보전의 필요성', placeholder: '채무자 재산 은닉 우려 등', required: true },
    ],
  },
  {
    id: 'attachment_order', name: '채권압류 및 추심명령신청서', desc: '제3채무자 직접 추심', category: 'order',
    fields: [
      { label: '채권자(금융기관)명', placeholder: 'OO저축은행', required: true },
      { label: '채무자 성명', placeholder: '홍길동', required: true },
      { label: '제3채무자 (은행 등)', placeholder: 'OO은행', required: true },
      { label: '집행권원', placeholder: '판결문/지급명령결정문', required: true },
      { label: '청구금액', placeholder: '30,000,000', required: true },
    ],
  },
  {
    id: 'acceleration_notice', name: '기한이익상실통지서', desc: '대출금 기한이익 상실 통지', category: 'notice',
    fields: [
      { label: '채권자(금융기관)명', placeholder: 'OO저축은행', required: true },
      { label: '채무자 성명', placeholder: '홍길동', required: true },
      { label: '채무자 주소', placeholder: '서울특별시 ...', required: true },
      { label: '대출약정일', placeholder: '2024-01-15', required: true },
      { label: '대출금액', placeholder: '50,000,000', required: true },
      { label: '연체 시작일', placeholder: '2025-10-15', required: true },
      { label: '기한이익상실 사유', placeholder: '3개월 이상 연체', required: true },
    ],
  },
  {
    id: 'assignment_notice', name: '채권양도통지서', desc: '채권양도 사실 통지', category: 'notice',
    fields: [
      { label: '양도인(금융기관)명', placeholder: 'OO저축은행', required: true },
      { label: '양수인명', placeholder: 'OO자산관리', required: true },
      { label: '채무자 성명', placeholder: '홍길동', required: true },
      { label: '양도 채권 금액', placeholder: '50,000,000', required: true },
      { label: '양도일', placeholder: '2026-04-01', required: true },
    ],
  },
  {
    id: 'certified_mail', name: '내용증명', desc: '법적 효력 있는 통지서', category: 'notice',
    fields: [
      { label: '발송인(금융기관)명', placeholder: 'OO저축은행', required: true },
      { label: '수신인 성명', placeholder: '홍길동', required: true },
      { label: '수신인 주소', placeholder: '서울특별시 ...', required: true },
      { label: '통지 내용 요약', placeholder: '대출금 상환 독촉, 기한이익상실 예정 통지 등', required: true },
      { label: '요청 사항', placeholder: '14일 이내 상환 요청', required: true },
    ],
  },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  auction: { label: '경매', color: '#C9252C' },
  order: { label: '명령/추심', color: '#0061AF' },
  notice: { label: '통지/증명', color: '#00854A' },
  preserve: { label: '보전처분', color: '#7B61FF' },
};

export default function Documents() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState<DocType | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? DOC_TYPES : DOC_TYPES.filter(d => d.category === filter);

  const handleFieldChange = (label: string, value: string) => {
    setFormValues(prev => ({ ...prev, [label]: value }));
  };

  const allRequiredFilled = selectedDoc
    ? selectedDoc.fields.filter(f => f.required).every(f => (formValues[f.label] || '').trim() !== '')
    : false;

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{ borderBottom: '1px solid #e5e5e5', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => selectedDoc ? setSelectedDoc(null) : navigate(-1)} style={{ fontSize: '18px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedDoc ? selectedDoc.name : '서류 자동생성'}</div>
          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>{user?.institution}</div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ══ 서류 목록 ══ */}
        {!selectedDoc && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>서류 자동생성</h1>
              <p style={{ fontSize: '14px', color: '#888' }}>법원 양식 전국 동일 — 단일 템플릿으로 즉시 생성</p>
            </div>

            {/* 필터 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: '전체' },
                { key: 'auction', label: '경매' },
                { key: 'order', label: '명령/추심' },
                { key: 'preserve', label: '보전처분' },
                { key: 'notice', label: '통지/증명' },
              ].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  style={{
                    padding: '8px 16px', fontSize: '13px', fontWeight: filter === f.key ? 700 : 500,
                    background: filter === f.key ? '#000' : '#fff',
                    color: filter === f.key ? '#fff' : '#888',
                    border: '1px solid ' + (filter === f.key ? '#000' : '#e5e5e5'),
                    borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* 서류 카드 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(doc => {
                const cat = CATEGORY_LABELS[doc.category];
                return (
                  <button key={doc.id} onClick={() => { setSelectedDoc(doc); setFormValues({}); setShowPreview(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px',
                      border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fff',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = cat.color)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 700, color: cat.color,
                        background: cat.color + '15', padding: '4px 10px', borderRadius: '12px',
                        flexShrink: 0,
                      }}>
                        {cat.label}
                      </span>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '3px' }}>{doc.name}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{doc.desc} · 입력 {doc.fields.length}항목</div>
                      </div>
                    </div>
                    <span style={{ color: '#ccc', fontSize: '16px' }}>→</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ 서류 입력 폼 ══ */}
        {selectedDoc && !showPreview && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <span style={{
                fontSize: '10px', fontWeight: 700, color: CATEGORY_LABELS[selectedDoc.category].color,
                background: CATEGORY_LABELS[selectedDoc.category].color + '15',
                padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '12px',
              }}>
                {CATEGORY_LABELS[selectedDoc.category].label}
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '6px' }}>{selectedDoc.name}</h2>
              <p style={{ fontSize: '14px', color: '#888' }}>{selectedDoc.desc}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {selectedDoc.fields.map(field => (
                <div key={field.label}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    {field.label}
                    {field.required && <span style={{ fontSize: '10px', color: '#C9252C' }}>필수</span>}
                  </label>
                  {field.condition && (
                    <div style={{ fontSize: '11px', color: '#E65100', marginBottom: '4px' }}>⚠️ {field.condition}</div>
                  )}
                  <input
                    value={formValues[field.label] || ''}
                    onChange={e => handleFieldChange(field.label, e.target.value)}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%', padding: '12px 14px', border: '1px solid #e5e5e5', borderRadius: '6px',
                      fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#0061AF')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowPreview(true)} disabled={!allRequiredFilled}
                style={{
                  flex: 1, padding: '16px', background: allRequiredFilled ? '#0061AF' : '#ccc',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  cursor: allRequiredFilled ? 'pointer' : 'not-allowed',
                  fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
                }}>
                미리보기 →
              </button>
              <button onClick={() => setSelectedDoc(null)}
                style={{ padding: '16px 20px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                목록으로
              </button>
            </div>
          </div>
        )}

        {/* ══ 미리보기 ══ */}
        {selectedDoc && showPreview && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>{selectedDoc.name} — 미리보기</h2>
              <p style={{ fontSize: '13px', color: '#888' }}>입력하신 내용으로 생성된 서류 미리보기입니다.</p>
            </div>

            <div style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '28px', background: '#FAFAFA', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{selectedDoc.name}</h3>
              </div>
              <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '16px' }}>
                {selectedDoc.fields.map(f => (
                  <div key={f.label} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: '180px', fontSize: '13px', color: '#888', flexShrink: 0 }}>{f.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{formValues[f.label] || '—'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '16px', background: '#0061AF', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit' }}>
                📥 다운로드
              </button>
              <button onClick={() => navigate('/lawyer')}
                style={{ flex: 1, padding: '16px', background: '#00854A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit' }}>
                법무법인에 의뢰 →
              </button>
            </div>
            <button onClick={() => setShowPreview(false)}
              style={{ marginTop: '16px', fontSize: '13px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              ← 수정하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
