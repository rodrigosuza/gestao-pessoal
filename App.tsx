
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppData, Expense, ModalView, CofreItem } from './types';
import { useAppData } from './hooks/useAppData';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import ExpenseList from './components/ExpenseList';
import Footer from './components/Footer';
import BalanceModal from './components/modals/BalanceModal';
import ExpenseModal from './components/modals/ExpenseModal';
import MonthSelectorModal from './components/modals/MonthSelectorModal';
import DeleteConfirmationModal from './components/modals/DeleteConfirmationModal';
import CofrePage from './components/CofrePage';
import { parseDate } from './utils/formatters';
import { getDefaultData } from './hooks/useAppData';
import CofreModal from './components/modals/CofreModal';
import DeleteCofreConfirmationModal from './components/modals/DeleteCofreConfirmationModal';

const getPropagatedExpenses = (targetDate: Date, allDespesas: { [monthKey: string]: Expense[] }, getMonthKey: (d: Date) => string): Expense[] => {
    // Find the most recent previous month with data to carry over expenses from.
    let precedingMonth = new Date(targetDate);
    let precedingExpenses: Expense[] = [];
    
    // Look back up to 24 months for data.
    for (let i = 0; i < 24; i++) {
        precedingMonth.setMonth(precedingMonth.getMonth() - 1);
        const precedingMonthKey = getMonthKey(precedingMonth);
        if (allDespesas.hasOwnProperty(precedingMonthKey)) {
            precedingExpenses = allDespesas[precedingMonthKey] || [];
            break;
        }
    }

    // Determine which recurring expenses from the preceding month apply to this new month.
    const applicableRecurringExpenses: Expense[] = [];
    precedingExpenses.forEach((exp) => {
       if (exp.fixo) {
        // For fixed expenses, we just carry them over.
        applicableRecurringExpenses.push({ ...exp });
      } else if (exp.parcelado && exp.inicio && exp.fim) {
        try {
          // For installments, we still need to check if the current month is within their date range.
          const startDate = parseDate(exp.inicio);
          const endDate = parseDate(exp.fim);
          if (!startDate || !endDate) return;

          endDate.setHours(23, 59, 59, 999);
          const currentMonthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
          
          if (currentMonthStart >= startDate && currentMonthStart <= endDate) {
            applicableRecurringExpenses.push({ ...exp });
          }
        } catch (error) {
          console.error("Error parsing installment dates:", error);
        }
      }
    });

    return applicableRecurringExpenses;
};


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { appData, setAppData, isDataReady } = useAppData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modal, setModal] = useState<ModalView>({ view: 'none' });
  const [animationState, setAnimationState] = useState({ key: Date.now(), direction: 0 });
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [activeView, setActiveView] = useState<'main' | 'cofre'>('main');

  const isExpenseModalOpen = modal.view === 'add_expense' || modal.view === 'edit_expense';
  const isBalanceModalOpen = modal.view === 'balance';

  useEffect(() => {
    if (isDataReady) {
      const timer = setTimeout(() => setIsLoading(false), 2500); // Simulate loading
      return () => clearTimeout(timer);
    }
  }, [isDataReady]);

  useEffect(() => {
    if (isExpenseModalOpen) {
      setIsExpenseModalVisible(true);
    }
  }, [isExpenseModalOpen]);

  const getMonthKey = useCallback((date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }, []);

  const isPastMonth = useMemo(() => {
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfViewedMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return firstDayOfViewedMonth < firstDayOfCurrentMonth;
  }, [currentDate]);

  const monthStatus = useMemo(() => {
    if (!isPastMonth) return null;

    const monthKey = getMonthKey(currentDate);
    const expenses = appData?.despesas[monthKey] || [];

    if (expenses.length === 0) return null;

    return expenses.every(e => e.pago) ? 'Mês pago' : 'Despesas não pagas';
  }, [isPastMonth, appData, currentDate, getMonthKey]);

  // Automatic expense processing
  useEffect(() => {
    if (!appData || !isDataReady) return;

    const monthKey = getMonthKey(currentDate);

    const propagatedExpenses = getPropagatedExpenses(currentDate, appData.despesas, getMonthKey);
    const currentExpenses = appData.despesas[monthKey] || [];
    const existingIds = new Set(currentExpenses.map(e => e.id));
    const deletedIdsForMonth = new Set(appData.deletedInstances?.[monthKey] || []);
    
    const missingExpenses = propagatedExpenses.filter(
        p => !existingIds.has(p.id) && !deletedIdsForMonth.has(p.id)
    );

    if (missingExpenses.length > 0) {
        const newMonthExpenses = [...currentExpenses, ...missingExpenses];
        setAppData(prev => ({
            ...prev,
            despesas: { ...prev.despesas, [monthKey]: newMonthExpenses },
        }));
    }
  }, [currentDate, appData, isDataReady, getMonthKey, setAppData]);
  
  const { totalExpenses, totalBalance } = useMemo(() => {
    if (!appData) return { totalExpenses: 0, totalBalance: 0 };
    const monthKey = getMonthKey(currentDate);
    const expenses = appData.despesas[monthKey] || [];
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.valor, 0);
    return {
      totalExpenses,
      totalBalance: appData.saldo_conta - totalExpenses,
    };
  }, [appData, currentDate, getMonthKey]);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setAnimationState({ key: Date.now(), direction: direction === 'prev' ? -1 : 1 });
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
      return newDate;
    });
  };

  const handleSelectMonth = (monthIndex: number) => {
    const direction = monthIndex < currentDate.getMonth() ? -1 : 1;
    setAnimationState({ key: Date.now(), direction });
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(monthIndex);
        return newDate;
    });
    setModal({ view: 'none' });
  };

  const handleSaveBalance = (newBalance: number) => {
    if (appData) {
      setAppData({ ...appData, saldo_conta: newBalance });
    }
    setModal({ view: 'none' });
  };
  
  const handleSaveExpense = (expenseToSave: Expense) => {
    setAppData(prevAppData => {
        if (!prevAppData) return getDefaultData();

        const newAppData = { ...prevAppData, despesas: { ...prevAppData.despesas } };
        
        const isEditing = modal.view === 'edit_expense' && modal.expense;

        if (isEditing) {
            const monthKey = getMonthKey(currentDate);
            const expensesForMonth = newAppData.despesas[monthKey] ? [...newAppData.despesas[monthKey]] : [];
            const index = expensesForMonth.findIndex(e => e.id === modal.expense?.id);
            
            if (index > -1) {
                expensesForMonth[index] = expenseToSave;
                newAppData.despesas[monthKey] = expensesForMonth;
            }
        } else {
            // ADDING a new expense.
            let targetMonthKey = getMonthKey(currentDate);

            if (expenseToSave.parcelado && expenseToSave.inicio) {
                const startDate = parseDate(expenseToSave.inicio);
                if (startDate) {
                    targetMonthKey = getMonthKey(startDate);
                }
            }

            let baseExpenses = newAppData.despesas[targetMonthKey];

            if (baseExpenses === undefined) {
                const year = parseInt(targetMonthKey.substring(0, 4));
                const month = parseInt(targetMonthKey.substring(5, 7)) - 1;
                const targetDate = new Date(year, month, 1);
                baseExpenses = getPropagatedExpenses(targetDate, newAppData.despesas, getMonthKey);
            }
            
            const newExpensesForMonth = [...(baseExpenses || []), expenseToSave];
            newAppData.despesas[targetMonthKey] = newExpensesForMonth;
        }

        return newAppData;
    });

    setModal({ view: 'none' });
  };

  const handlePromptDelete = (expense: Expense) => {
    if (isPastMonth) return; // Prevent deleting from past months
    if (expense.fixo || expense.parcelado) {
        setModal({ view: 'delete_confirmation', expense });
    } else {
        handleDeleteThisExpense(expense.id, currentDate);
    }
  };

  const handleDeleteThisExpense = (expenseId: string, date: Date) => {
    setAppData(prevAppData => {
        if (!prevAppData) return getDefaultData();

        const monthKey = getMonthKey(date);
        const newAppData = { ...prevAppData };
        const { despesas, deletedInstances = {} } = newAppData;
        
        const expenseToDelete = (despesas[monthKey] || []).find(e => e.id === expenseId);
        const updatedExpenses = (despesas[monthKey] || []).filter(e => e.id !== expenseId);

        if (updatedExpenses.length > 0) {
            despesas[monthKey] = updatedExpenses;
        } else {
            delete despesas[monthKey];
        }

        if (expenseToDelete && (expenseToDelete.fixo || expenseToDelete.parcelado)) {
            const deletedForMonth = new Set(deletedInstances[monthKey] || []);
            deletedForMonth.add(expenseId);
            deletedInstances[monthKey] = Array.from(deletedForMonth);
        }

        return { ...newAppData, despesas, deletedInstances };
    });
    setModal({ view: 'none' });
  };

  const handleDeleteFutureExpenses = (expenseToDelete: Expense) => {
    setAppData(prevAppData => {
        if (!prevAppData) return getDefaultData();

        const newAppData = { ...prevAppData };
        const { despesas, deletedInstances = {} } = newAppData;

        const currentMonthKey = getMonthKey(currentDate);
        const [currentYear, currentMonth] = currentMonthKey.split('-').map(Number);
        
        const futureMonthKeys = Object.keys(despesas).filter(key => {
            const [year, month] = key.split('-').map(Number);
            return year > currentYear || (year === currentYear && month >= currentMonth);
        });

        futureMonthKeys.forEach(key => {
            const remainingExpenses = (despesas[key] || []).filter(e => e.id !== expenseToDelete.id);
            if (remainingExpenses.length > 0) {
                despesas[key] = remainingExpenses;
            } else {
                delete despesas[key];
            }
            // Also clear any single-deletion records for this expense
            if (deletedInstances[key]) {
                deletedInstances[key] = deletedInstances[key].filter(id => id !== expenseToDelete.id);
                if (deletedInstances[key].length === 0) {
                    delete deletedInstances[key];
                }
            }
        });
        
        return { ...newAppData, despesas, deletedInstances };
    });
    setModal({ view: 'none' });
  };

  const handleTogglePaidStatus = (expenseId: string) => {
    setAppData(prev => {
      if (!prev) return getDefaultData();

      const monthKey = getMonthKey(currentDate);
      const expensesForMonth = prev.despesas[monthKey] ? [...prev.despesas[monthKey]] : [];
      const expenseIndex = expensesForMonth.findIndex(e => e.id === expenseId);

      if (expenseIndex > -1) {
        const updatedExpense = {
          ...expensesForMonth[expenseIndex],
          pago: !expensesForMonth[expenseIndex].pago,
        };
        expensesForMonth[expenseIndex] = updatedExpense;

        return {
          ...prev,
          despesas: {
            ...prev.despesas,
            [monthKey]: expensesForMonth,
          },
        };
      }

      return prev;
    });
  };

  const handleOpenCofre = () => {
    setModal({ view: 'none' });
    setActiveView('cofre');
  };

  const handleNavigateBackToMain = () => {
    setActiveView('main');
  };

  const handleSaveCofreItem = (item: CofreItem) => {
    setAppData(prev => {
        if (!prev) return getDefaultData();

        const itemDate = new Date(item.data + 'T12:00:00');
        const monthKey = getMonthKey(itemDate);
        const newCofreData = { ...(prev.cofre || {}) };
        const cofreItemsForMonth = [...(newCofreData[monthKey] || [])];
        
        const existingIndex = cofreItemsForMonth.findIndex(i => i.id === item.id);
        if (existingIndex > -1) {
            cofreItemsForMonth[existingIndex] = item;
        } else {
            cofreItemsForMonth.push(item);
        }
        newCofreData[monthKey] = cofreItemsForMonth;

        return { ...prev, cofre: newCofreData };
    });
    setModal({ view: 'none' });
  };

  const handleDeleteCofreItem = (itemId: string) => {
    setAppData(prev => {
        if (!prev || !prev.cofre) return prev;
        const newCofreData = { ...prev.cofre };
        let itemDeleted = false;
        
        for (const monthKey in newCofreData) {
            const originalLength = newCofreData[monthKey].length;
            newCofreData[monthKey] = newCofreData[monthKey].filter(i => i.id !== itemId);
            if (newCofreData[monthKey].length < originalLength) {
                itemDeleted = true;
                if (newCofreData[monthKey].length === 0) {
                    delete newCofreData[monthKey];
                }
                break;
            }
        }
        if (itemDeleted) {
            return { ...prev, cofre: newCofreData };
        }
        return prev;
    });
    setModal({ view: 'none' });
  };

  if (isLoading || !appData) {
    return <SplashScreen />;
  }
  
  const handleBalanceModalToggle = () => {
    setModal(prev => prev.view === 'balance' ? { view: 'none' } : { view: 'balance' });
  };

  const handleAddExpense = () => {
    if (isExpenseModalOpen) {
        setModal({ view: 'none' });
    } else {
        setModal({ view: 'add_expense' });
    }
  };
  
  const handleCloseExpenseModal = () => {
      setIsExpenseModalVisible(false);
  }

  if (isBalanceModalOpen) {
      return (
          <BalanceModal
              currentBalance={appData.saldo_conta}
              onClose={handleBalanceModalToggle}
              onSave={handleSaveBalance}
              onOpenCofre={handleOpenCofre}
          />
      );
  }

  return (
    <>
      {activeView === 'main' ? (
        <div className="w-screen h-screen flex flex-col relative overflow-hidden">
          <Header 
              currentDate={currentDate}
              onMonthChange={handleMonthChange}
              onOpenBalanceModal={handleBalanceModalToggle}
              onOpenMonthSelector={() => setModal({ view: 'month_selector' })}
              onAddExpense={handleAddExpense}
              totalBalance={totalBalance}
              monthStatus={monthStatus}
              isMenuOpen={isBalanceModalOpen}
              animationKey={animationState.key}
          />
          
          <main 
              key={animationState.key}
              className="flex-grow flex flex-col overflow-hidden bg-white p-4 animate-content-slide"
              style={{ '--slide-from': `${animationState.direction * 20}px` } as React.CSSProperties}
          >
              <ExpenseList 
                  expenses={appData.despesas[getMonthKey(currentDate)] || []}
                  currentDate={currentDate}
                  onEdit={(expense) => setModal({ view: 'edit_expense', expense, isPastMonth })}
                  onDelete={handlePromptDelete}
                  onTogglePaidStatus={handleTogglePaidStatus}
                  isPastMonth={isPastMonth}
              />
          </main>
          
          <Footer 
              accountBalance={appData.saldo_conta}
              totalExpenses={totalExpenses}
              finalBalance={totalBalance}
          />
        </div>
      ) : (
        <CofrePage 
            appData={appData}
            currentDate={currentDate}
            onNavigateBack={handleNavigateBackToMain}
            getMonthKey={getMonthKey}
            onAddItem={() => setModal({ view: 'add_cofre_item' })}
            onEditItem={(item) => setModal({ view: 'edit_cofre_item', item })}
            onDeleteItem={(item) => setModal({ view: 'delete_cofre_confirmation', item })}
        />
      )}

      {/* Shared Modals */}
      {isExpenseModalVisible && (
          <ExpenseModal
              isOpen={isExpenseModalOpen}
              expense={modal.view === 'edit_expense' ? modal.expense : undefined}
              onClose={handleCloseExpenseModal}
              onRequestClose={() => setModal({ view: 'none' })}
              onSave={handleSaveExpense}
          />
      )}
      
      {modal.view === 'month_selector' && (
          <MonthSelectorModal
              currentMonth={currentDate.getMonth()}
              onClose={() => setModal({ view: 'none' })}
              onSelectMonth={handleSelectMonth}
          />
      )}

      {modal.view === 'delete_confirmation' && (
          <DeleteConfirmationModal
              expense={modal.expense}
              onClose={() => setModal({ view: 'none' })}
              onConfirmDeleteThis={() => handleDeleteThisExpense(modal.expense.id, currentDate)}
              onConfirmDeleteAll={() => handleDeleteFutureExpenses(modal.expense)}
          />
      )}

      {(modal.view === 'add_cofre_item' || modal.view === 'edit_cofre_item') && (
        <CofreModal
            isOpen={true}
            item={modal.view === 'edit_cofre_item' ? modal.item : undefined}
            onClose={() => setModal({ view: 'none' })}
            onSave={handleSaveCofreItem}
        />
      )}

      {modal.view === 'delete_cofre_confirmation' && (
          <DeleteCofreConfirmationModal
              item={modal.item}
              onClose={() => setModal({ view: 'none' })}
              onConfirm={() => handleDeleteCofreItem(modal.item.id)}
          />
      )}
    </>
  );
};

export default App;