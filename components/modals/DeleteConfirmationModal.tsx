
import React, { useState } from 'react';
import { Expense } from '../../types';

interface DeleteConfirmationModalProps {
  expense: Expense;
  onClose: () => void;
  onConfirmDeleteThis: () => void;
  onConfirmDeleteAll: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ expense, onClose, onConfirmDeleteThis, onConfirmDeleteAll }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleConfirmThis = () => {
    setIsClosing(true);
    setTimeout(onConfirmDeleteThis, 300);
  };

  const handleConfirmAll = () => {
    setIsClosing(true);
    setTimeout(onConfirmDeleteAll, 300);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
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
      <div className={`bg-white w-11/12 max-w-xs rounded-xl p-6 shadow-lg border border-gray-200 ${isClosing ? 'animate-scale-down' : 'animate-scale-up'}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Apagar Despesa</h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Deseja apagar a despesa <span className="font-bold text-gray-700">"{expense.nome}"</span>?
        </p>
        <div className="space-y-3">
          <button onClick={handleConfirmThis} className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 active:scale-95">
            Apagar apenas esta
          </button>
          <button onClick={handleConfirmAll} className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 active:scale-95">
            Apagar esta e as próximas
          </button>
          <button onClick={handleClose} className="w-full bg-gray-100 text-gray-600 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 active:scale-95">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;