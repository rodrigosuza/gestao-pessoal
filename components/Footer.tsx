
import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface FooterProps {
  accountBalance: number;
  totalExpenses: number;
  finalBalance: number;
}

const Footer: React.FC<FooterProps> = ({ accountBalance, totalExpenses, finalBalance }) => {
  return (
    <footer className="bg-[#3BCE66] text-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] min-h-[120px] flex-shrink-0 z-10 transition-all duration-300">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Saldo em conta</span>
          <span className="font-bold">{formatCurrency(accountBalance)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Despesas</span>
          <span className="font-bold">{formatCurrency(totalExpenses)}</span>
        </div>
        <div className="flex justify-between items-center font-bold text-base pt-1">
          <span>Total em conta</span>
          <span>{formatCurrency(finalBalance)}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
