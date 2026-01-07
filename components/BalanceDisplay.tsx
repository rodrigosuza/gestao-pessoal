
import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface BalanceDisplayProps {
  totalBalance: number;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ totalBalance }) => {
  return (
    <div className="text-center pt-2 pb-8 flex-shrink-0">
      <p className="text-white text-base opacity-90">Saldo Total</p>
      <h2 className="text-4xl md:text-5xl font-bold text-white">
        {formatCurrency(totalBalance)}
      </h2>
    </div>
  );
};

export default BalanceDisplay;