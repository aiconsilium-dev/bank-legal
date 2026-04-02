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
  { id: '1', title: '이중 채권양수도 리스크 해소', category: '채권양도', date: '2026-02-05', status: '완료', description: '이중양도 사실을 사전에 알 수 있는 방법은 제한적 — 계약서에 "이중양도 사실 없음" 확인 조항 삽입 + 별도 담보 제공 권고' },
  { id: '2', title: '기한이익 상실·부활 여부', category: '여신', date: '2026-03-24', status: '완료', description: '2번계좌 연체 해소되어도 1번계좌 기한이익은 자동 부활 안 됨 (약관 §17⑧). 다만 정상거래 계속 시 부활 가능' },
  { id: '3', title: '할부항변권 행사 처리', category: '민원', date: '2026-03-26', status: '완료', description: '할부금융규정 §13에 따라 처리. 거절 사유 확인 → 할부거래법 §16① 해당 여부 → 7영업일 내 서면 통지' },
  { id: '4', title: '사기이용계좌 대출제한 여부', category: '여신', date: '2026-03-26', status: '완료', description: '사기이용계좌 명의인 정보는 참고자료. 합리적 사유 있으면 예외 처리하여 대출 가능' },
  { id: '5', title: '대출제한 대상자 해석', category: '여신', date: '2026-03-25', status: '완료', description: '타행 3개월 이상 연체 → 불건전대출자 해당 (대출규정 §4). "당해 저축은행"은 대출 취급 저축은행 의미' },
  { id: '6', title: '기한이익상실 통지 방법', category: '추심', date: '2026-03-20', status: '완료', description: '3천만원 이상: 내용증명 필수. 3천만원 미만: 등기우편 가능, 도달 확인 불가 시 내용증명 추가' },
  { id: '7', title: '연대보증인 대위변제 후 경매 취하', category: '경매', date: '2026-03-19', status: '완료', description: '변제 완료 시 강제집행 유지 이유 없음. 대위변제자가 승계 의사 없으면 취하 가능' },
  { id: '8', title: '렌탈채권 유동화 — 직접 추심 가능 여부', category: '채권양도', date: '2026-03-23', status: '완료', description: '채권양도계약 §2에 따라, 대항요건 갖추고 차주 동의 있으면 당행이 렌탈계약자에게 직접 추심 가능' },
  { id: '9', title: '근저당권 담보 범위 해석', category: '담보', date: '2026-03-23', status: '완료', description: '종합통장대출거래 문언상 모든 채무 담보로 해석 가능하나, 설정 경위·전산 등록 현황 등 고려 시 특정 사업장만 담보한다고 해석이 합리적' },
  { id: '10', title: '대부업자 NPL채권 매입 불가', category: '채권양도', date: '2026-03-10', status: '완료', description: '저축은행감독규정 §22의4에 따라 대부업자 NPL은 원칙적으로 매입 불가 (합병·전량양수만 예외)' },
];
