import React, { useState, useEffect } from 'react';
import { CofreItem } from '../../types';
import { formatCurrencyInput } from '../../utils/formatters';

interface CofreModalProps {
    isOpen: boolean;
    item?: CofreItem;
    onClose: () => void;
    onSave: (item: CofreItem) => void;
}

const CofreModal: React.FC<CofreModalProps> = ({ isOpen, item, onClose, onSave }) => {
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            setIsAnimatingOut(false);
            if (item) {
                setDescricao(item.descricao);
                setValor(new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(item.valor));
            } else {
                setDescricao('');
                setValor('');
            }
        }
    }, [isOpen, item]);
    
    const handleClose = () => {
        setIsAnimatingOut(true);
        setTimeout(() => {
            onClose();
            setIsAnimatingOut(false);
        }, 300);
    }
    
    const handleSave = () => {
        const numericValue = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
        if (descricao && !isNaN(numericValue) && numericValue > 0) {
            onSave({
                id: item?.id || new Date().toISOString() + Math.random(),
                valor: numericValue,
                descricao,
                data: item?.data || new Date().toISOString().split('T')[0] // Preserve original date on edit
            });
            handleClose();
        } else {
            alert("Por favor, preencha a descrição e um valor válido.");
        }
    };
    
    if (!isOpen && !isAnimatingOut) return null;
    
    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose}>
            <div className={`bg-gray-100 w-10/12 max-w-xs rounded-lg p-6 transition-all duration-300 ${isAnimatingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`} onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{item ? 'Editar Item' : 'Guardar Dinheiro'}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-700">Descrição</label>
                        <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full p-3 bg-white rounded-lg mt-1 text-gray-900" placeholder="Ex: Férias, Reserva" autoFocus/>
                    </div>
                    <div>
                        <label className="text-sm text-gray-700">Valor (R$)</label>
                        <input 
                            type="text" 
                            value={valor} 
                            onChange={e => setValor(formatCurrencyInput(e.target.value))} 
                            className="w-full p-3 bg-white rounded-lg mt-1 text-gray-900" 
                            placeholder="0,00"
                            inputMode="decimal"
                        />
                    </div>
                </div>
                <div className="mt-8 flex justify-around items-center">
                    <button onClick={handleClose} className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="bg-[#3BCE66] text-white font-bold py-3 px-10 rounded-full hover:bg-[#32A955] transition-colors">Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default CofreModal;