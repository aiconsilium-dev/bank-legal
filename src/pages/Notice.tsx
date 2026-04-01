import { useState } from 'react';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/AppLayout';

export default function Notice() {
  const { user } = useApp();
  const [target, setTarget] = useState<'all' | 'members' | 'tellers'>('all');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sent, setSent] = useState(false);

  const TARGETS = [
    { key: 'all' as const, label: '전체' },
    { key: 'members' as const, label: '조합원' },
    { key: 'tellers' as const, label: '행원' },
  ];

  const handleSend = () => {
    if (title.trim() && content.trim()) setSent(true);
  };

  return (
    <AppLayout activeNav="공지 발송" topbarLeft="공지 발송" topbarRight={`${user?.institution}`}>
      <div style={{ padding: '48px 40px', maxWidth: '600px' }}>
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>공지 발송 /</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px' }}>새 공지사항 작성</h1>
        </div>

        {sent ? (
          <div style={{ borderTop: '1px solid #000', paddingTop: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>발송 완료</div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
              {target === 'all' ? '전체' : target === 'members' ? '조합원' : '행원'}에게 공지가 발송되었습니다.
            </div>
            <button onClick={() => { setSent(false); setTitle(''); setContent(''); }}
              style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>
              새 공지 작성 →
            </button>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid #e5e5e5' }}>
            <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '10px' }}>발송 대상</div>
              <div style={{ display: 'flex', gap: '0', border: '1px solid #000' }}>
                {TARGETS.map((t, i) => (
                  <button key={t.key} onClick={() => setTarget(t.key)}
                    style={{ flex: 1, padding: '8px', fontSize: '13px', background: target === t.key ? '#000' : '#fff', color: target === t.key ? '#fff' : '#888', border: 'none', borderRight: i < 2 ? '1px solid #000' : 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '8px' }}>공지 제목</div>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력하세요"
                style={{ width: '100%', border: 'none', borderBottom: '1px solid #000', padding: '8px 0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: 'transparent' }}/>
            </div>
            <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '8px' }}>내용</div>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="공지 내용을 입력하세요..."
                rows={6} style={{ width: '100%', border: '1px solid #e5e5e5', padding: '10px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', borderRadius: '2px' }}/>
            </div>
            <button onClick={handleSend}
              style={{ width: '100%', marginTop: '20px', padding: '14px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', borderRadius: '2px' }}>
              공지 발송하기 →
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
