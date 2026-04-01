import { useState } from 'react';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/AppLayout';

const POSTS = [
  { id: 1, title: '대출 연장 절차가 궁금합니다', author: '김◯◯', date: '03.27', content: '현재 만기가 다가오는데 연장 절차를 알고 싶습니다.', comments: [{ author: '관리자', body: '지점 방문 또는 앱에서 신청 가능합니다.', date: '03.27' }] },
  { id: 2, title: '출자금 배당 시기 문의', author: '이◯◯', date: '03.25', content: '올해 출자금 배당은 언제 진행되나요?', comments: [] },
  { id: 3, title: '주차장 관련 건의', author: '박◯◯', date: '03.22', content: '지점 주차장이 너무 좁습니다. 개선 부탁드립니다.', comments: [] },
  { id: 4, title: '금리인하 요청 결과 문의', author: '최◯◯', date: '03.20', content: '지난달 금리인하 신청했는데 결과가 안 옵니다.', comments: [{ author: '관리자', body: '10영업일 이내 통보 예정입니다. 확인 후 안내드리겠습니다.', date: '03.21' }] },
];

export default function Board() {
  const { user } = useApp();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Record<number, { author: string; body: string; date: string }[]>>(
    Object.fromEntries(POSTS.map(p => [p.id, [...p.comments]]))
  );

  const selected = POSTS.find(p => p.id === selectedId);

  const handleComment = () => {
    if (!newComment.trim() || !selectedId) return;
    setComments(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), { author: user?.name || '이사장', body: newComment, date: new Date().toLocaleDateString('ko', { month: '2-digit', day: '2-digit' }).replace('. ', '.').replace('.', '') }],
    }));
    setNewComment('');
  };

  return (
    <AppLayout activeNav="조합원 게시판" topbarLeft="조합원 게시판" topbarRight={`${user?.institution}`}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 목록 */}
        <div style={{ width: '320px', borderRight: '1px solid #e5e5e5', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ padding: '16px', fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', borderBottom: '1px solid #e5e5e5' }}>게시글 목록 /</div>
          {POSTS.map(p => (
            <button key={p.id} onClick={() => setSelectedId(p.id)}
              style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', background: selectedId === p.id ? '#f5f5f5' : '#fff', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ fontSize: '13px', fontWeight: selectedId === p.id ? 600 : 400 }}>{p.title}</div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '3px' }}>{p.author} · {p.date} · 댓글 {(comments[p.id] || []).length}</div>
            </button>
          ))}
        </div>

        {/* 상세 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {selected ? (
            <>
              <div style={{ marginBottom: '24px', borderBottom: '1px solid #e5e5e5', paddingBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{selected.title}</h2>
                <div style={{ fontSize: '12px', color: '#aaa' }}>{selected.author} · {selected.date}</div>
              </div>
              <div style={{ fontSize: '14px', color: '#444', lineHeight: 1.8, marginBottom: '32px' }}>{selected.content}</div>

              <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '20px' }}>
                <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>댓글 {(comments[selected.id] || []).length}개 /</div>
                {(comments[selected.id] || []).map((c, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{c.author} <span style={{ color: '#aaa', fontWeight: 400 }}>· {c.date}</span></div>
                    <div style={{ fontSize: '14px', color: '#444' }}>{c.body}</div>
                  </div>
                ))}

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <input value={newComment} onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleComment()}
                    placeholder="댓글을 입력하세요..."
                    style={{ flex: 1, border: 'none', borderBottom: '1px solid #000', padding: '8px 0', fontSize: '13px', outline: 'none', fontFamily: 'inherit', background: 'transparent' }}/>
                  <button onClick={handleComment}
                    style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', borderRadius: '2px' }}>작성</button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ccc', fontSize: '13px' }}>
              게시글을 선택해 주세요
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
