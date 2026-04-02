import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { decisionTree, INITIAL_OPTIONS } from '../data/decisionTree';
import { CASES } from '../data/cases';
import type { ChatMessage, ResultCard, DecisionTreeNode } from '../types';

let msgIdCounter = 0;
function newId() { return `msg_${++msgIdCounter}`; }

function getNode(path: string[]): DecisionTreeNode | null {
  if (path.length === 0) return null;
  let node: DecisionTreeNode | null = decisionTree[path[0]] ?? null;
  for (let i = 1; i < path.length; i++) {
    if (!node || !('options' in node)) return null;
    node = (node as any).options[path[i]] ?? null;
  }
  return node;
}

function matchCaseFromText(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('연체') || t.includes('담보')) return '대출 연체 대응';
  if (t.includes('가압류') || t.includes('보전')) return '채권 보전 (가압류·가처분)';
  if (t.includes('추심') || t.includes('압류') || t.includes('집행')) return '추심·압류 신청';
  if (t.includes('경매') || t.includes('낙찰')) return '경매 신청';
  if (t.includes('민원') || t.includes('금감원') || t.includes('불완전')) return '금감원·감독원 민원';
  if (t.includes('제명') || t.includes('탈퇴') || t.includes('이의')) return '조합원 탈퇴·제명 분쟁';
  if (t.includes('출자금') || t.includes('반환')) return '출자금 반환 분쟁';
  return null;
}

type Mode = 'button' | 'chat';

export default function Consult() {
  const { user, setCurrentCaseId } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('button');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [path, setPath] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const initMessages = (m: Mode) => {
    setMessages([{
      id: newId(),
      role: 'ai',
      content: m === 'button'
        ? `${user?.name ?? '담당자'}님, 어떤 상황이신가요? 해당하는 항목을 선택해주세요.`
        : `${user?.name ?? '담당자'}님, 어떤 상황인지 자유롭게 입력해주세요.\n예: "채무자가 3개월째 연체 중인데 담보가 있어요"`,
      timestamp: new Date(),
      quickOptions: m === 'button' ? INITIAL_OPTIONS : undefined,
    }]);
    setPath([]);
    setDone(false);
    setChatInput('');
  };

  useEffect(() => { setTimeout(() => initMessages('button'), 300); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setCurrentCaseId(null);
    setTimeout(() => initMessages(m), 100);
  };

  const handleOption = (option: string) => {
    if (done) return;
    const newPath = path.length === 0 ? [option] : [...path, option];
    const userMsg: ChatMessage = { id: newId(), role: 'user', content: option, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const node = getNode(newPath);
    if (!node) return;
    setTimeout(() => {
      if ('result' in node && typeof (node as any).result === 'string') {
        // result가 텍스트면 바로 표시
        setMessages(prev => [...prev, { id: newId(), role: 'ai', content: (node as any).result, timestamp: new Date() }]);
        setDone(true);
      } else if ('question' in node && 'options' in node) {
        setMessages(prev => [...prev, { id: newId(), role: 'ai', content: (node as any).question, timestamp: new Date(), quickOptions: Object.keys((node as any).options) }]);
        setPath(newPath);
      }
    }, 400);
  };

  const handleChatSend = async () => {
    const text = chatInput.trim();
    if (!text || done) return;
    setChatInput('');
    const userMsg: ChatMessage = { id: newId(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 900));
    setTyping(false);
    const matched = matchCaseFromText(text);
    if (matched) {
      const node = decisionTree[matched];
      if (node && 'result' in node && typeof (node as any).result === 'string') {
        setMessages(prev => [...prev, { id: newId(), role: 'ai', content: (node as any).result, timestamp: new Date() }]);
        setDone(true);
        return;
      }
      if (node && 'question' in node) {
        setMessages(prev => [...prev, {
          id: newId(), role: 'ai',
          content: `"${matched}" 관련 상황으로 파악했습니다.\n\n${(node as any).question}`,
          timestamp: new Date(),
          quickOptions: Object.keys((node as any).options),
        }]);
        setPath([matched]);
        return;
      }
    }
    setMessages(prev => [...prev, {
      id: newId(), role: 'ai',
      content: '말씀하신 상황을 파악했습니다. 아래 항목 중 가장 가까운 것을 선택해 주시면 더 정확하게 안내드릴 수 있습니다.',
      timestamp: new Date(),
      quickOptions: INITIAL_OPTIONS,
    }]);
  };

  const handleViewDocuments = () => navigate('/consult/documents');
  const handleRestart = () => { setCurrentCaseId(null); initMessages(mode); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{ borderBottom: '1px solid #e5e5e5', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/')} style={{ fontSize: '18px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#000' }}>AI 법률 상담</div>
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>{user?.institution}</div>
          </div>
        </div>
        <button onClick={handleRestart} style={{ fontSize: '12px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>다시 시작</button>
      </div>

      {/* 모드 토글 — 헤더 바로 아래 */}
      <div style={{ borderBottom: '1px solid #e5e5e5', padding: '10px 24px', flexShrink: 0, background: '#fafafa' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', border: '1px solid #e5e5e5', borderRadius: '2px', overflow: 'hidden' }}>
            {(['button', 'chat'] as Mode[]).map(m => (
              <button key={m} onClick={() => switchMode(m)}
                style={{ padding: '6px 14px', fontSize: '12px', fontWeight: 500, background: mode === m ? '#000' : '#fff', color: mode === m ? '#fff' : '#aaa', border: 'none', cursor: 'pointer', fontFamily: 'inherit', borderRight: m === 'button' ? '1px solid #e5e5e5' : 'none', transition: 'all 0.1s' }}>
                {m === 'button' ? '버튼 선택' : '채팅 입력'}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '12px', color: '#ccc' }}>입력 방식을 선택하세요</span>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              {msg.role === 'ai' && (
                <div style={{ width: '32px', height: '32px', background: '#000', flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#fff', fontWeight: 700 }}>AI</span>
                </div>
              )}
              <div style={{ maxWidth: '480px' }}>
                <div style={{
                  padding: '12px 16px',
                  background: msg.role === 'user' ? '#000' : '#f7f7f7',
                  color: msg.role === 'user' ? '#fff' : '#000',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  borderRadius: '2px',
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: '10px', color: '#ccc', marginTop: '4px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {msg.quickOptions && msg.role === 'ai' && !done && (
              <div style={{ marginTop: '10px', marginLeft: '34px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {msg.quickOptions.map(opt => (
                  <button key={opt} onClick={() => handleOption(opt)}
                    style={{ padding: '9px 18px', fontSize: '14px', fontWeight: 500, background: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', borderRadius: '2px', fontFamily: 'inherit', transition: 'all 0.1s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#000'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#000'; }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {msg.resultCard && (
              <div style={{ marginTop: '10px', marginLeft: '34px' }}>
                <div style={{ border: '1px solid #000', padding: '16px 20px', maxWidth: '360px', borderRadius: '2px' }}>
                  <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>추천 절차 /</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#000', marginBottom: '10px' }}>{msg.resultCard.caseName}</div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#888', marginBottom: '14px' }}>
                    <span>서류 {msg.resultCard.documentCount}건</span>
                    <span>약 {msg.resultCard.estimatedTime}</span>
                  </div>
                  <button onClick={handleViewDocuments}
                    style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', borderRadius: '2px' }}>
                    서류 안내 보기 →
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '32px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', color: '#fff', fontWeight: 700 }}>AI</span>
            </div>
            <div style={{ padding: '12px 16px', background: '#f7f7f7', borderRadius: '2px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: '6px', height: '6px', background: '#ccc', borderRadius: '50%', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }}/>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* 하단 입력 바 — 채팅 모드일 때만 */}
      {mode === 'chat' && !done && (
        <div style={{ borderTop: '1px solid #e5e5e5', padding: '12px 24px', flexShrink: 0, background: '#fff' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', gap: '8px' }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend(); } }}
              placeholder="상황을 자유롭게 입력하세요... (Enter로 전송)"
              style={{ flex: 1, border: 'none', borderBottom: '1px solid #000', padding: '8px 0', fontSize: '15px', outline: 'none', fontFamily: 'inherit', background: 'transparent' }}
            />
            <button onClick={handleChatSend}
              style={{ padding: '8px 18px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, fontFamily: 'inherit', borderRadius: '2px' }}>
              전송
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
