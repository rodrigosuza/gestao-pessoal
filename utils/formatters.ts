
import { Expense } from '../types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const getMonthName = (date: Date, type: 'long' | 'short' = 'long'): string => {
    const name = date.toLocaleDateString('pt-BR', { month: type });
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export const formatCurrencyInput = (value: string): string => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');

  if (digits === '') return '';

  const numberValue = parseInt(digits, 10) / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export const formatDateInput = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';

    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    if (digits.length <= 2) {
        return day;
    } else if (digits.length <= 4) {
        return `${day}/${month}`;
    } else {
        return `${day}/${month}/${year}`;
    }
};

export const parseDate = (dateStr: string): Date | null => {
  if (!dateStr || dateStr.length !== 10) return null;
  try {
    const [day, month, year] = dateStr.split('/').map(Number);
    if (day && month && year && year > 1900 && day <= 31 && month <= 12) {
      return new Date(year, month - 1, day);
    }
    return null;
  } catch (e) {
    console.error("Failed to parse date string:", dateStr, e);
    return null;
  }
};

export const calculateInstallmentInfo = (expense: Expense, currentDate: Date) => {
    if (!expense.parcelado || !expense.inicio || !expense.fim) {
        return null;
    }

    const startDate = parseDate(expense.inicio);
    const endDate = parseDate(expense.fim);

    if (!startDate || !endDate) {
        return null;
    }

    const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
    
    const currentMonths = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth()) + 1;

    if (currentMonths > 0 && currentMonths <= totalMonths) {
        return { current: currentMonths, total: totalMonths };
    }
    
    return null;
};

// FIX: Add getOS function to detect the user's operating system to fix import error in InstallHelpModal.tsx.
export const getOS = (): 'ios' | 'android' | 'unknown' => {
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;

  if (/android/i.test(userAgent)) {
    return 'android';
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios';
  }

  return 'unknown';
};
