
import React, { useState } from 'react';

interface MonthSelectorModalProps {
  currentMonth: number;
  onClose: () => void;
  onSelectMonth: (monthIndex: number) => void;
}

const MonthSelectorModal: React.FC<MonthSelectorModalProps> = ({ currentMonth, onClose, onSelectMonth }) => {
  const [isClosing, setIsClosing] = useState(false);
  
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };
  
  const handleSelect = (index: number) => {
    setIsClosing(true);
    setTimeout(() => onSelectMonth(index), 300);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose}>
       <style>{`
        @keyframes scale-up {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

        @keyframes scale-down {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.9); opacity: 0; }
        }
        .animate-scale-down { animation: scale-down 0.3s ease-out; }
      `}</style>
      <div className={`bg-white rounded-lg shadow-xl w-11/12 max-w-xs p-4 ${isClosing ? 'animate-scale-down' : 'animate-scale-up'}`} onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-center text-lg mb-4">Selecionar Mês</h3>
        <div className="grid grid-cols-1 gap-2">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => handleSelect(index)}
              className={`w-full text-left p-3 rounded-md transition-all duration-200 ${
                index === currentMonth
                  ? 'bg-[#3BCE66] text-white font-bold'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthSelectorModal;