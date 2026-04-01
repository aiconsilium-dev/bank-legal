export interface DecisionOption {
  id: string;
  label: string;
  next?: string;
  result?: string;
}

export interface DecisionNode {
  id: string;
  question: string;
  options: DecisionOption[];
}

export const INITIAL_OPTIONS: DecisionOption[] = [
  { id: 'consult', label: 'AI 법률 상담', next: 'consult_type' },
  { id: 'document', label: '서류 자동 작성', next: 'doc_type' },
  { id: 'calculator', label: '채권 계산기', next: 'calc_start' },
];

export const decisionTree: Record<string, DecisionNode> = {
  consult_type: {
    id: 'consult_type',
    question: '어떤 분야의 상담이 필요하신가요?',
    options: [
      { id: 'c1', label: '하자보수 관련', result: '하자보수 전문 상담을 연결합니다.' },
      { id: 'c2', label: '임대차 관련', result: '임대차 전문 상담을 연결합니다.' },
      { id: 'c3', label: '대출/채권 관련', result: '채권 전문 상담을 연결합니다.' },
    ],
  },
  doc_type: {
    id: 'doc_type',
    question: '어떤 서류가 필요하신가요?',
    options: [
      { id: 'd1', label: '내용증명', result: '내용증명 작성을 시작합니다.' },
      { id: 'd2', label: '계약서 검토', result: '계약서 검토를 시작합니다.' },
      { id: 'd3', label: '소장 초안', result: '소장 초안 작성을 시작합니다.' },
    ],
  },
  calc_start: {
    id: 'calc_start',
    question: '계산 유형을 선택하세요.',
    options: [
      { id: 'k1', label: '지연이자 계산', result: '지연이자 계산기를 실행합니다.' },
      { id: 'k2', label: '채권 총액 계산', result: '채권 총액 계산기를 실행합니다.' },
    ],
  },
};
