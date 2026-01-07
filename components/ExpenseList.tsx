
import React, { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { Expense } from '../types';
import { formatCurrency, calculateInstallmentInfo } from '../utils/formatters';
import { CheckboxCheckedIcon } from './icons/CheckboxCheckedIcon';
import { CheckboxUncheckedIcon } from './icons/CheckboxUncheckedIcon';

interface ExpenseItemProps {
  expense: Expense;
  currentDate: Date;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onTogglePaidStatus: (expenseId: string) => void;
  isPastMonth: boolean;
  index: number;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, currentDate, onEdit, onDelete, onTogglePaidStatus, isPastMonth, index }) => {
    const [translateX, setTranslateX] = useState(0);
    const dragStartX = useRef(0);
    const isDragging = useRef(false);
    const itemRef = useRef<HTMLDivElement>(null);
    const SWIPE_THRESHOLD = 80;
    const MAX_TRANSLATE = 115;

    const installmentInfo = calculateInstallmentInfo(expense, currentDate);

    const getTranslateX = (element: HTMLElement): number => {
        const style = window.getComputedStyle(element);
        const transform = style.transform;
        
        if (transform === 'none' || !transform) return 0;

        // Try standard DOMMatrix
        if (typeof DOMMatrix !== 'undefined') {
            try {
                return new DOMMatrix(transform).m41;
            } catch (e) {
                // Ignore error and try next method
            }
        }

        // Try WebKitCSSMatrix (Safari/Chrome legacy) - safely cast window to any
        if (typeof (window as any).WebKitCSSMatrix !== 'undefined') {
            try {
                return new (window as any).WebKitCSSMatrix(transform).m41;
            } catch (e) {
                // Ignore error
            }
        }

        // Fallback: Parse string manually "matrix(1, 0, 0, 1, 100, 0)"
        const match = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([^,]+)/);
        if (match && match[1]) {
            return parseFloat(match[1]);
        }

        return 0;
    };

    const resetPosition = (callback?: () => void) => {
        if (itemRef.current) {
            itemRef.current.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            itemRef.current.style.transform = 'translateX(0px)';
        }
        setTranslateX(0);
        if (callback) {
            setTimeout(callback, 300); 
        }
    };

    const handleEditClick = () => {
        resetPosition(() => onEdit(expense));
    };

    const handleDeleteClick = () => {
        resetPosition(() => onDelete(expense));
    };

    const handleDragStart = (clientX: number) => {
        if (isPastMonth) return;
        isDragging.current = true;
        dragStartX.current = clientX;
        if (itemRef.current) {
            itemRef.current.style.transition = 'none';
        }
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging.current || !itemRef.current) return;
        const diff = clientX - dragStartX.current;
        itemRef.current.style.transform = `translateX(${translateX + diff}px)`;
    };

    const handleDragEnd = (clientX: number) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        
        if (itemRef.current) {
            itemRef.current.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            
            const currentTranslateX = getTranslateX(itemRef.current);

            if (Math.abs(currentTranslateX) > SWIPE_THRESHOLD) {
                const finalTranslate = currentTranslateX > 0 ? MAX_TRANSLATE : -MAX_TRANSLATE;
                itemRef.current.style.transform = `translateX(${finalTranslate}px)`;
                setTranslateX(finalTranslate);
            } else {
                itemRef.current.style.transform = 'translateX(0px)';
                setTranslateX(0);
            }
        }
    };
    
    const onMouseDown = (e: MouseEvent<HTMLDivElement>) => handleDragStart(e.clientX);
    const onMouseMove = (e: MouseEvent<HTMLDivElement>) => handleDragMove(e.clientX);
    const onMouseUp = (e: MouseEvent<HTMLDivElement>) => handleDragEnd(e.clientX);
    const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
        if (isDragging.current) handleDragEnd(e.clientX);
    }
    
    const onTouchStart = (e: TouchEvent<HTMLDivElement>) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent<HTMLDivElement>) => handleDragMove(e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => handleDragEnd(e.changedTouches[0].clientX);

    const handleTogglePaid = () => {
        if (isPastMonth) return;
        onTogglePaidStatus(expense.id);
    };

    return (
        <div 
            className="relative h-[70px] my-2 bg-white border border-gray-200 rounded-lg overflow-hidden animate-list-item"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Action Buttons Container */}
            <div className="absolute inset-0 flex justify-between items-center">
                <button 
                    onClick={handleEditClick} 
                    className="bg-[#4CD964] text-white font-bold h-full w-[115px] flex items-center justify-center"
                    aria-label="Editar"
                >
                    Editar
                </button>
                <button 
                    onClick={handleDeleteClick} 
                    className="bg-[#FF3B30] text-white font-bold h-full w-[115px] flex items-center justify-center"
                    aria-label="Apagar"
                >
                    Apagar
                </button>
            </div>

            {/* Draggable Content Layer */}
            <div
                ref={itemRef}
                className={`absolute inset-0 p-4 flex items-center justify-between cursor-pointer touch-pan-y z-10 bg-white`}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                 <div
                    className={`relative flex-shrink-0 mr-4 w-8 h-8 ${isPastMonth ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    onClick={handleTogglePaid}
                >
                    <CheckboxUncheckedIcon className={`transition-opacity duration-300 ${expense.pago ? 'opacity-0' : 'opacity-100'}`} />
                    <CheckboxCheckedIcon className={`absolute top-0 left-0 transition-all duration-300 ${expense.pago ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
                </div>

                <div className="flex-grow flex flex-col justify-center items-start min-w-0">
                    <span className={`font-bold text-gray-900 truncate w-full`}>{expense.nome}</span>
                    <div className="flex items-center gap-2 mt-1">
                        {expense.fixo && <span className="text-xs font-bold bg-[#3BCE66] text-white px-2 py-0.5 rounded-full">Fixo</span>}
                        {expense.parcelado && (
                            <span className="text-xs font-bold bg-orange-400 text-white px-2 py-0.5 rounded-full">
                                {installmentInfo ? `Parcelado ${installmentInfo.current}/${installmentInfo.total}` : 'Parcelado'}
                            </span>
                        )}
                    </div>
                </div>
                <span className="font-bold text-gray-800 ml-4 flex-shrink-0">{formatCurrency(expense.valor)}</span>
            </div>
        </div>
    );
};

interface ExpenseListProps {
  expenses: Expense[];
  currentDate: Date;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onTogglePaidStatus: (expenseId: string) => void;
  isPastMonth: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, currentDate, onEdit, onDelete, onTogglePaidStatus, isPastMonth }) => {
  if (expenses.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center text-gray-400 p-4">
        Nenhuma Despesa
      </div>
    );
  }

  return (
    <>
        <style>{`
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
        <div className="flex-grow overflow-y-auto px-2 pb-2 no-scrollbar">
            {expenses.map((expense, index) => (
                <ExpenseItem 
                    key={expense.id} 
                    expense={expense} 
                    currentDate={currentDate} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                    onTogglePaidStatus={onTogglePaidStatus} 
                    isPastMonth={isPastMonth} 
                    index={index}
                />
            ))}
        </div>
    </>
  );
};

export default ExpenseList;