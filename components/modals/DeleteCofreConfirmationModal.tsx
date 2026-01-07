import React, { useState } from 'react';
import { CofreItem } from '../../types';

interface DeleteCofreConfirmationModalProps {
  item: CofreItem;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteCofreConfirmationModal: React.FC<DeleteCofreConfirmationModalProps> = ({ item, onClose, onConfirm }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(onConfirm, 300);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <style>{`
        @keyframes scale-up-conf {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up-conf { animation: scale-up-conf 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

        @keyframes scale-down-conf {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.9); opacity: 0; }
        }
        .animate-scale-down-conf { animation: scale-down-conf 0.3s ease-out; }
      `}</style>
      <div className={`bg-white w-11/12 max-w-xs rounded-xl p-6 shadow-lg ${isClosing ? 'animate-scale-down-conf' : 'animate-scale-up-conf'}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Apagar Item</h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Deseja apagar o item <span className="font-bold text-gray-700">"{item.descricao}"</span>?
        </p>
        <div className="flex justify-center space-x-4">
          <button onClick={handleClose} className="w-full bg-gray-100 text-gray-600 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-all">
            Cancelar
          </button>
          <button onClick={handleConfirm} className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 transition-all">
            Apagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCofreConfirmationModal;