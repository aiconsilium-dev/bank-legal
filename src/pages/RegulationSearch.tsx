import { useState } from 'react';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/AppLayout';

const RECENT_REGULATIONS = [
  { date: '2026.02.09', title: '새마을금고 감독기준 일부개정', source: '행정안전부 고시 제2026-10호', category: '새마을금고' },
  { date: '2026.01.01', title: '새마을금고 감독기준 전부개정 시행', source: '행정안전부 고시 제2025-64호', category: '새마을금고' },
  { date: '2025.12.15', title: '신협 건전성 감독 규정 개정', source: '금융위원회 고시', category: '신협' },
  { date: '2025.11.20', title: '채권추심법 시행령 일부개정', source: '대통령령 제35XXX호', category: '공통' },
  { date: '2025.09.01', title: '금융소비자보호법 감독규정 개정', source: '금융위원회 고시', category: '공통' },
];

const LEGAL_REFERENCES = [
  { title: '소송촉진법 제3조 (법정이율)', desc: '지연손해금 연 12% (2019.6.1. 시행)', link: 'https://www.law.go.kr' },
  { title: '민법 제379조 (법정이율)', desc: '연 5%', link: 'https://www.law.go.kr' },
  { title: '신용협동조합법', desc: '신협 설립·운영·감독 근거법', link: 'https://www.law.go.kr' },
  { title: '새마을금고법', desc: '새마을금고 설립·운영 근거법', link: 'https://www.law.go.kr' },
  { title: '채권의 공정한 추심에 관한 법률', desc: '채권추심 행위 규제', link: 'https://www.law.go.kr' },
  { title: '금융소비자 보호에 관한 법률', desc: '금융상품 판매·자문 규제', link: 'https://www.law.go.kr' },
];

export default function RegulationSearch() {
  const { user } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => { if (query.trim()) setSearched(true); };

  const filteredRegs = searched
    ? RECENT_REGULATIONS.filter(r => r.title.includes(query) || r.category.includes(query) || r.source.includes(query))
    : RECENT_REGULATIONS;

  return (
    <AppLayout activeNav="AI 법령·지침 검색" topbarLeft="AI 법령·지침 검색" topbarRight={`${user?.institution}`}>
      <div style={{ padding: '48px 40px', maxWidth: '800px' }}>
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '10px' }}>법령·지침 검색 /</div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '16px' }}>공공기관 법령 및 지침 검색</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input value={query} onChange={e => { setQuery(e.target.value); setSearched(false); }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="법령명, 키워드로 검색 (예: 새마을금고, 채권추심, 지연손해금)"
              style={{ flex: 1, border: 'none', borderBottom: '1px solid #000', padding: '10px 0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: 'transparent' }}/>
            <button onClick={handleSearch}
              style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', borderRadius: '2px' }}>
              검색
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>
            {searched ? `"${query}" 검색 결과 /` : '최근 지침·고시 /'}
          </div>
          <div style={{ borderTop: '1px solid #000' }}>
            {filteredRegs.length === 0 ? (
              <div style={{ padding: '24px 0', fontSize: '13px', color: '#aaa' }}>검색 결과가 없습니다.</div>
            ) : filteredRegs.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f0f0f0', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>{r.title}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{r.source}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>{r.date}</div>
                  <div style={{ fontSize: '10px', color: '#bbb', marginTop: '2px', border: '1px solid #e5e5e5', padding: '1px 6px', borderRadius: '2px', display: 'inline-block' }}>{r.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '16px' }}>주요 법률 레퍼런스 /</div>
          <div style={{ borderTop: '1px solid #e5e5e5' }}>
            {LEGAL_REFERENCES.map((ref, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{ref.title}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{ref.desc}</div>
                </div>
                <a href={ref.link} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '11px', color: '#aaa', textDecoration: 'none', flexShrink: 0 }}>법령정보 →</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
