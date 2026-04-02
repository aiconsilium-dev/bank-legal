export interface User {
  institution: string;
  name: string;
  role?: 'teller' | 'member' | 'chairman';
}

export interface FormData {
  debtorName: string;
  principal: string;
  accountNumber: string;
  [key: string]: string;
}

export interface ClaimCalculation {
  principal: number;
  interest: number;
  delayDamage: number;
  total: number;
}

export interface ConsultHistory {
  id: string;
  caseType: string;
  date: string;
  status: 'completed' | 'in_progress';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  quickOptions?: string[];
  resultCard?: ResultCard;
}

export interface ResultCard {
  caseId: string;
  caseName: string;
  documentCount: number;
  estimatedTime: string;
}

export interface DecisionTreeNode {
  question?: string;
  options?: Record<string, DecisionTreeNode>;
  result?: string;
}
