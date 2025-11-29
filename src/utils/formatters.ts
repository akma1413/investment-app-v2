
import { TEXT } from '../constants/text';

/**
 * Formats a number as currency based on magnitude or explicit type.
 * Large numbers (>1000) default to KRW format, others to USD format.
 */
export const formatCurrency = (value: number | undefined, currency?: 'KRW' | 'USD'): string => {
  if (value === undefined) return '-';
  
  // Explicit currency logic or heuristic
  const isKRW = currency === 'KRW' || (currency === undefined && value > 1000);

  if (isKRW) {
    return value.toLocaleString('ko-KR') + TEXT.COMMON.CURRENCY_KRW;
  }
  return TEXT.COMMON.CURRENCY_USD + value.toLocaleString();
};

/**
 * Formats a rate with sign and percentage symbol.
 */
export const formatRate = (rate: number | undefined): string => {
  if (rate === undefined) return '0%';
  const sign = rate > 0 ? '+' : '';
  return `${sign}${rate}${TEXT.COMMON.PERCENT}`;
};

/**
 * Returns Tailwind text color class based on value positivity.
 */
export const getRateColorClass = (rate: number | undefined): string => {
  if (rate === undefined || rate === 0) return 'text-zinc-500';
  return rate > 0 ? 'text-app-positive' : 'text-app-negative';
};
