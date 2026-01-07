
import React, { useState, useEffect } from 'react';
import { Expense } from '../../types';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import { formatCurrencyInput, formatDateInput } from '../../utils/formatters';

interface ExpenseModalProps {
  isOpen: boolean;
  expense?: Expense;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  onRequestClose?: () => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, expense, onClose, onSave, onRequestClose }) => {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [isFixo, setIsFixo] = useState(false);
  const [isParcelado, setIsParcelado] = useState(false);
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setIsAnimatingOut(false);
        if (expense) {
            setNome(expense.nome);
            setValor(new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(expense.valor));
            setIsFixo(expense.fixo);
            setIsParcelado(expense.parcelado);
            setInicio(expense.inicio || '');
            setFim(expense.fim || '');
        } else {
            // Reset for 'add' mode
            setNome('');
            setValor('');
            setIsFixo(false);
            setIsParcelado(false);
            setInicio('');
            setFim('');
        }
    } else {
        setIsAnimatingOut(true);
        setTimeout(onClose, 400); // Match animation duration
    }
  }, [isOpen, expense, onClose]);

  const handleSave = () => {
    const numericValue = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    if (nome && !isNaN(numericValue) && numericValue > 0) {
      if(isParcelado && (!inicio || !fim || inicio.length < 10 || fim.length < 10)) {
        alert("Por favor, preencha as datas de início e fim completas (DD/MM/AAAA) para parcelamento.");
        return;
      }

      onSave({
        id: expense?.id || new Date().toISOString() + Math.random(),
        nome,
        valor: numericValue,
        fixo: isFixo,
        parcelado: isParcelado,
        inicio: isParcelado ? inicio : undefined,
        fim: isParcelado ? fim : undefined,
      });
    } else {
        alert("Por favor, preencha o nome e um valor válido.");
    }
  };
  
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValor(formatCurrencyInput(e.target.value));
  };
  
  const handleCloseButton = () => {
      if (onRequestClose) {
          onRequestClose();
      } else {
          // Fallback if no request close handler
          setIsAnimatingOut(true);
          setTimeout(onClose, 400);
      }
  };


  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 transition-opacity duration-300 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}`}>
      <style>{`
        @keyframes slide-and-scale-up {
          from { transform: translate(45vw, -45vh) scale(0); opacity: 0; }
          to { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        .animate-slide-and-scale-up { animation: slide-and-scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

        @keyframes slide-and-scale-down {
          from { transform: translate(0, 0) scale(1); opacity: 1; }
          to { transform: translate(45vw, -45vh) scale(0); opacity: 0; }
        }
        .animate-slide-and-scale-down { animation: slide-and-scale-down 0.4s cubic-bezier(0.7, 0, 0.84, 0); }

        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
      <div className={`bg-gray-100 w-10/12 max-w-xs rounded-lg p-6 relative ${isAnimatingOut ? 'animate-slide-and-scale-down' : 'animate-slide-and-scale-up'}`}>
        <button 
            onClick={handleCloseButton} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            aria-label="Fechar"
        >
            <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{expense ? 'Editar Despesa' : 'Criar Despesa'}</h2>
        
        <div className="space-y-4">
            <div>
                <label className="text-sm text-gray-700">Nome da despesa</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-3 bg-white rounded-lg mt-1 text-gray-900"/>
            </div>
            <div>
                <label className="text-sm text-gray-700">Valor (R$)</label>
                <input 
                    type="text" 
                    value={valor} 
                    onChange={handleValorChange} 
                    className="w-full p-3 bg-white rounded-lg mt-1 text-gray-900" 
                    placeholder="0,00"
                    inputMode="decimal"
                />
            </div>
            
            <div className="pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            checked={isFixo} 
                            onChange={() => setIsFixo(!isFixo)} 
                            className="appearance-none h-5 w-5 rounded border-2 border-gray-300 bg-white checked:bg-[#3BCE66] checked:border-transparent focus:outline-none transition-colors"
                        />
                        {isFixo && <CheckIcon className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />}
                    </div>
                    <span className="text-gray-800">Valor Fixo</span>
                </label>
                 <p className="text-xs text-gray-400 pl-8">*Esse valor será replicado nos próximos meses.</p>
            </div>
             <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            checked={isParcelado} 
                            onChange={() => setIsParcelado(!isParcelado)}
                            className="appearance-none h-5 w-5 rounded border-2 border-gray-300 bg-white checked:bg-[#3BCE66] checked:border-transparent focus:outline-none transition-colors"
                        />
                         {isParcelado && <CheckIcon className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />}
                    </div>
                    <span className="text-gray-800">Parcelamento</span>
                </label>
            </div>

            {isParcelado && (
                <div className="grid grid-cols-2 gap-4 pl-8 animate-fade-in">
                    <div>
                        <label className="text-sm text-gray-700">Início</label>
                        <input 
                            type="text" 
                            value={inicio} 
                            onChange={(e) => setInicio(formatDateInput(e.target.value))} 
                            placeholder="DD/MM/AAAA" 
                            className="w-full p-2 bg-white rounded-lg mt-1 text-sm text-gray-900"
                            inputMode="numeric"
                        />
                    </div>
                     <div>
                        <label className="text-sm text-gray-700">Fim</label>
                        <input 
                            type="text" 
                            value={fim} 
                            onChange={(e) => setFim(formatDateInput(e.target.value))} 
                            placeholder="DD/MM/AAAA" 
                            className="w-full p-2 bg-white rounded-lg mt-1 text-sm text-gray-900"
                            inputMode="numeric"
                        />
                    </div>
                </div>
            )}
        </div>

        <div className="mt-8 flex justify-center">
            <button onClick={handleSave} className="bg-[#3BCE66] text-white font-bold py-3 px-12 rounded-full hover:bg-[#32A955] transition-colors transition-transform hover:scale-105 active:scale-95">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
