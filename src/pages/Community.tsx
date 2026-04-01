import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/AppLayout';

type Tab = 'board' | 'qa' | 'complaint';

const POSTS = [
  { id: 5, title: '대출 연장 신청 방법이 궁금합니다', author: '김◯◯', date: '03.24', status: '답변완료' },
  { id: 4, title: '출자금 배당 시기 문의', author: '이◯◯', date: '03.22', status: '답변완료' },
  { id: 3, title: '탈퇴 절차에 대해 알고 싶습니다', author: '박◯◯', date: '03.20', status: '답변중' },
  { id: 2, title: '금리인하요구권 신청 자격은?', author: '최◯◯', date: '03.18', status: '답변완료' },
  { id: 1, title: '예금 만기 자동 연장 확인 방법', author: '정◯◯', date: '03.15', status: '답변완료' },
];

const FAQS = [
  { q: '조합원 가입 자격은 어떻게 되나요?', a: '신협·농협·새마을금고 각 정관에서 정한 자격 요건을 충족하면 가입 가능합니다.' },
  { q: '금리인하요구권이란 무엇인가요?', a: '대출 이후 신용 상태가 개선된 경우 금리 인하를 요구할 수 있는 권리입니다.' },
  { q: '출자금은 언제 돌려받을 수 있나요?', a: '탈퇴 신청 후 조합 정관에서 정한 기한(통상 60~90일) 이내에 반환됩니다.' },
  { q: '제명되면 어떤 불이익이 있나요?', a: '조합 서비스 이용 제한, 신용정보원 연체 등록 등의 불이익이 발생할 수 있습니다.' },
  { q: '민원은 어디에 신고하나요?', a: '조합 자체 민원 처리 → 금융감독원 → 금융소비자원 순으로 단계적 신고가 가능합니다.' },
];

const COMPLAINT_TYPES = ['연체등록 이의', '금리인하요구', '불완전판매', '개인정보 침해', '기타'];

export default function Community() {
  const { user } = useApp();
  const navigate = useNavigate();

  // 조합원만 접근 가능
  useEffect(() => {
    if (user && user.role !== 'member') {
      navigate('/');
    }
  }, [user, navigate]);
  const [tab, setTab] = useState<Tab>('board');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', memberId: '', type: '', content: '' });
  const [submitted, setSubmitted] = useState(false);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'board', label: '게시판' },
    { key: 'qa', label: 'Q&A' },
    { key: 'complaint', label: '민원 접수' },
  ];

  return (
    <AppLayout activeNav="커뮤니티" topbarLeft={`커뮤니티 — ${user?.institution}`}>
      {/* 탭 */}
      <div style={{ borderBottom: '1px solid #e5e5e5', padding: '0 32px', display: 'flex', flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: '14px 20px', fontSize: '13px', fontWeight: tab === t.key ? 600 : 400, color: tab === t.key ? '#000' : '#aaa', background: 'none', border: 'none', borderBottom: tab === t.key ? '2px solid #000' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '32px', maxWidth: '900px' }}>
        {tab === 'board' && (
          <div>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>게시판 /</div>
            <div style={{ borderTop: '1px solid #000' }}>
              {POSTS.map(post => (
                <div key={post.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f0f0', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#ccc', minWidth: '20px' }}>{post.id}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{post.title}</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{post.author} · {post.date}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: post.status === '답변완료' ? '#000' : '#888', border: `1px solid ${post.status === '답변완료' ? '#000' : '#e5e5e5'}`, padding: '2px 7px', borderRadius: '2px' }}>{post.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'qa' && (
          <div>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>자주 묻는 질문 /</div>
            <div style={{ borderTop: '1px solid #000' }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{faq.q}</span>
                    <span style={{ fontSize: '16px', color: '#aaa', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 0 16px', fontSize: '14px', color: '#666', lineHeight: 1.7 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'complaint' && (
          <div>
            <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>민원 접수 /</div>
            {submitted ? (
              <div style={{ borderTop: '1px solid #000', paddingTop: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>접수 완료</div>
                <div style={{ fontSize: '13px', color: '#666' }}>영업일 기준 5일 이내 처리 결과를 안내드립니다.</div>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #e5e5e5' }}>
                {[{ label: '조합원명', field: 'name', placeholder: '홍길동' }, { label: '조합원 번호', field: 'memberId', placeholder: 'A-2024-0001' }].map(f => (
                  <div key={f.field} style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px' }}>{f.label}</div>
                    <input value={form[f.field as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: '100%', border: 'none', borderBottom: '1px solid #000', padding: '6px 0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: 'transparent' }}/>
                  </div>
                ))}
                <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '10px' }}>민원 유형</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {COMPLAINT_TYPES.map(t => (
                      <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))}
                        style={{ padding: '6px 12px', fontSize: '12px', background: form.type === t ? '#000' : '#fff', color: form.type === t ? '#fff' : '#666', border: `1px solid ${form.type === t ? '#000' : '#e5e5e5'}`, cursor: 'pointer', fontFamily: 'inherit', borderRadius: '2px' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px' }}>민원 내용 (50자 이상)</div>
                  <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                    placeholder="민원 내용을 상세히 작성해주세요..." rows={5}
                    style={{ width: '100%', border: '1px solid #e5e5e5', padding: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', borderRadius: '2px' }}/>
                  <div style={{ fontSize: '11px', color: form.content.length >= 50 ? '#888' : '#ccc', marginTop: '4px' }}>{form.content.length} / 50자 이상</div>
                </div>
                <button onClick={() => { if (form.name && form.memberId && form.type && form.content.length >= 50) setSubmitted(true); }}
                  style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', borderRadius: '2px' }}>
                  민원 접수하기 →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
