
import React from 'react';
import { getMonthName } from '../utils/formatters';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { AnimatedMenuIcon } from './icons/AnimatedMenuIcon';
import { PlusIcon } from './icons/PlusIcon';
import BalanceDisplay from './BalanceDisplay';

interface HeaderProps {
    currentDate: Date;
    onMonthChange: (direction: 'prev' | 'next') => void;
    onOpenBalanceModal: () => void;
    onOpenMonthSelector: () => void;
    onAddExpense: () => void;
    totalBalance: number;
    monthStatus: string | null;
    isMenuOpen: boolean;
    animationKey: number;
}

const Header: React.FC<HeaderProps> = ({
    currentDate,
    onMonthChange,
    onOpenBalanceModal,
    onOpenMonthSelector,
    onAddExpense,
    totalBalance,
    monthStatus,
    isMenuOpen,
    animationKey
}) => {
    const currentMonthName = getMonthName(currentDate);

    return (
        <header className="bg-[#3BCE66] flex-shrink-0 shadow-sm z-20 pt-[env(safe-area-inset-top)]">
            <div className="grid grid-cols-3 items-center p-4 h-[80px]">
                <div className="flex justify-start">
                    <AnimatedMenuIcon
                        isOpen={isMenuOpen}
                        onClick={onOpenBalanceModal}
                        className="w-8 h-8 text-white"
                    />
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => onMonthChange('prev')}
                        className="p-1 text-white hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                        aria-label="Mês anterior"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>

                    <button
                        onClick={onOpenMonthSelector}
                        className="flex flex-col items-center justify-center min-w-[80px] px-2 py-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <div key={animationKey} className="animate-subtle-fade-up text-center">
                            <h1 className="text-xl font-bold text-white whitespace-nowrap leading-none">{currentMonthName}</h1>
                            {monthStatus && (
                                <span className="text-[10px] text-white opacity-90 font-medium block mt-1 whitespace-nowrap leading-none tracking-wide">{monthStatus}</span>
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => onMonthChange('next')}
                        className="p-1 text-white hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                        aria-label="Próximo mês"
                    >
                        <ChevronRightIcon />
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onAddExpense}
                        className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Adicionar Despesa"
                    >
                        <PlusIcon />
                    </button>
                </div>
            </div>
            <div key={animationKey} className="animate-subtle-fade-up">
                <BalanceDisplay totalBalance={totalBalance} />
            </div>
        </header>
    );
};

export default Header;