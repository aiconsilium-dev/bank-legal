export interface CaseItem {
  id: string;
  title: string;
  category: string;
  date: string;
  status: string;
  amount?: string;
  description?: string;
}

export const CASES: CaseItem[] = [
  { id: '1', title: '아파트 하자보수 청구', category: '건설', date: '2026-01-15', status: '진행중', amount: '5,000만원', description: '공동주택 하자보수에 갈음하는 손해배상' },
  { id: '2', title: '임대차 보증금 반환', category: '부동산', date: '2026-02-20', status: '완료', amount: '3,000만원', description: '임대차보증금 반환 청구' },
  { id: '3', title: '대여금 반환 청구', category: '민사', date: '2026-03-05', status: '진행중', amount: '1,500만원', description: '대여금 반환 청구소송' },
  { id: '4', title: '부당이득 반환', category: '민사', date: '2025-12-10', status: '완료', amount: '2,000만원', description: '부당이득금 반환 청구' },
  { id: '5', title: '손해배상(기)청구', category: '민사', date: '2026-01-28', status: '대기', amount: '8,000만원', description: '불법행위로 인한 손해배상' },
];
