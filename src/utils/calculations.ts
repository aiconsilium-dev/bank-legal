export function calculateClaim(principal: number, rate: number, days: number) {
  return { principal, interest: Math.round(principal * (rate / 100) * (days / 365)), total: Math.round(principal * (1 + (rate / 100) * (days / 365))) };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export function formatCurrencyInput(value: string): string {
  const num = value.replace(/[^0-9]/g, '');
  return num ? new Intl.NumberFormat('ko-KR').format(Number(num)) : '';
}

export function parseCurrencyInput(value: string): number {
  return Number(value.replace(/[^0-9]/g, '')) || 0;
}
