
import React, { useState } from 'react';
import { XIcon } from '../icons/XIcon';
import { FixxLogo } from '../icons/FixxLogo';
import { WhatsappIcon } from '../icons/WhatsappIcon';
import { InstagramIcon } from '../icons/InstagramIcon';
import { formatCurrencyInput } from '../../utils/formatters';

interface BalanceModalProps {
  currentBalance: number;
  onClose: () => void;
  onSave: (newBalance: number) => void;
  onOpenCofre: () => void;
}

const BalanceModal: React.FC<BalanceModalProps> = ({ currentBalance, onClose, onSave, onOpenCofre }) => {
  const [balanceInput, setBalanceInput] = useState(
    new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(currentBalance)
  );
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 400);
  };

  const handleSave = () => {
    const numericValue = parseFloat(balanceInput.replace(/\./g, '').replace(',', '.'));
    if (!isNaN(numericValue)) {
      onSave(numericValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBalanceInput(formatCurrencyInput(e.target.value));
  };

  const handleFocus = () => {
    if (balanceInput === '0,00') {
      setBalanceInput('');
    }
  };

  const handleBlur = () => {
    if (balanceInput === '') {
      setBalanceInput('0,00');
    }
  };

  return (
    <div className={`fixed inset-0 bg-white flex flex-col overflow-hidden z-50 ${isClosing ? 'animate-scale-down' : 'animate-scale-up'}`}>
      <style>{`
        @keyframes menu-scale-up {
          from { transform: translate(-45vw, -45vh) scale(0); opacity: 0; }
          to { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        .animate-scale-up { animation: menu-scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes menu-scale-down {
          from { transform: translate(0, 0) scale(1); opacity: 1; }
          to { transform: translate(-45vw, -45vh) scale(0); opacity: 0; }
        }
        .animate-scale-down { animation: menu-scale-down 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex justify-start items-center p-4 h-[80px] flex-shrink-0">
        <button
          onClick={handleClose}
          className="text-gray-800"
          aria-label="Fechar"
        >
          <XIcon className="w-7 h-7" />
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center text-center w-full px-4 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-sm py-4">
          <FixxLogo />
          <div className="mt-6 w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Saldo da Conta</h2>
            <p className="text-sm text-gray-500 mb-3">Adicione o saldo bancário</p>

            <div className="space-y-2 w-3/4 mx-auto">
              <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-gray-400">R$</span>
                <input
                  type="text"
                  value={balanceInput}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="text-base font-bold bg-gray-100 text-center w-full outline-none p-2 pl-10 rounded-lg text-gray-900"
                  autoFocus
                  inputMode="decimal"
                />
              </div>

              <p className="text-[11px] text-gray-400">*Valor informado acima será salvo para os próximos meses</p>

              <div className="flex justify-center pt-1">
                <button
                  onClick={handleSave}
                  className="bg-[#3BCE66] text-white font-bold py-2 w-full rounded-lg hover:bg-[#32A955] transition-all hover:scale-105 active:scale-95"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 w-3/4 mx-auto">
            <button
              onClick={onOpenCofre}
              className="bg-gray-700 text-white font-bold py-3 w-full rounded-lg hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
            >
              <span>Cofre pessoal</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 py-8">
        <div className="text-center text-xs text-gray-400 mb-2">
          <p>Versão 1.11.1</p>
        </div>
        <div className="text-gray-500 text-sm text-center space-y-1">
          <p>Criado por Rodrigo Souza</p>
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-2 sm:space-y-0 mt-2">
            <div className="flex items-center space-x-1">
              <WhatsappIcon />
              <span>+55 94 99217-0839</span>
            </div>
            <div className="flex items-center space-x-1">
              <InstagramIcon />
              <span>@souza_dsr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceModal;