
import React, { useState, useMemo, useRef, MouseEvent, TouchEvent } from 'react';
import { AppData, CofreItem } from '../types';
import { formatCurrency, getMonthName } from '../utils/formatters';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PlusIcon } from './icons/PlusIcon';

interface CofrePageProps {
  appData: AppData;
  currentDate: Date;
  onNavigateBack: () => void;
  getMonthKey: (date: Date) => string;
  onAddItem: () => void;
  onEditItem: (item: CofreItem) => void;
  onDeleteItem: (item: CofreItem) => void;
}

interface CofreItemComponentProps {
    item: CofreItem;
    onEdit: () => void;
    onDelete: () => void;
    index: number;
}

const CofreItemComponent: React.FC<CofreItemComponentProps> = ({ item, onEdit, onDelete, index }) => {
    const [translateX, setTranslateX] = useState(0);
    const dragStartX = useRef(0);
    const isDragging = useRef(false);
    const itemRef = useRef<HTMLDivElement>(null);
    const SWIPE_THRESHOLD = 50;
    const MAX_TRANSLATE = 115;

    const getTranslateX = (element: HTMLElement): number => {
        const style = window.getComputedStyle(element);
        const transform = style.transform;
        
        if (transform === 'none' || !transform) return 0;

        if (typeof DOMMatrix !== 'undefined') {
            try {
                return new DOMMatrix(transform).m41;
            } catch (e) {
                // Ignore
            }
        }

        if (typeof (window as any).WebKitCSSMatrix !== 'undefined') {
            try {
                return new (window as any).WebKitCSSMatrix(transform).m41;
            } catch (e) {
                // Ignore
            }
        }

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

    const handleEditClick = () => resetPosition(() => onEdit());
    const handleDeleteClick = () => resetPosition(() => onDelete());

    const handleDragStart = (clientX: number) => {
        isDragging.current = true;
        dragStartX.current = clientX;
        if (itemRef.current) itemRef.current.style.transition = 'none';
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging.current || !itemRef.current) return;
        const diff = clientX - dragStartX.current;
        itemRef.current.style.transform = `translateX(${translateX + diff}px)`;
    };

    const handleDragEnd = (clientX: number) => {
        if (!isDragging.current || !itemRef.current) return;
        isDragging.current = false;
        
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
    };
    
    const onMouseDown = (e: MouseEvent<HTMLDivElement>) => handleDragStart(e.clientX);
    const onMouseMove = (e: MouseEvent<HTMLDivElement>) => handleDragMove(e.clientX);
    const onMouseUp = (e: MouseEvent<HTMLDivElement>) => handleDragEnd(e.clientX);
    const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => { if (isDragging.current) handleDragEnd(e.clientX); }
    const onTouchStart = (e: TouchEvent<HTMLDivElement>) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent<HTMLDivElement>) => handleDragMove(e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => handleDragEnd(e.changedTouches[0].clientX);

    return (
        <div 
            className="relative h-[60px] my-2 bg-white rounded-lg overflow-hidden animate-list-item"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="absolute inset-0 flex justify-between items-center">
                <button onClick={handleEditClick} className="bg-[#4CD964] text-white font-bold h-full w-[115px] flex items-center justify-center" aria-label="Editar">Editar</button>
                <button onClick={handleDeleteClick} className="bg-[#FF3B30] text-white font-bold h-full w-[115px] flex items-center justify-center" aria-label="Apagar">Apagar</button>
            </div>
            <div
                ref={itemRef}
                className="absolute inset-0 p-4 flex items-center justify-between cursor-pointer touch-pan-y z-10 bg-white shadow-sm"
                onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
            >
                <span className="text-gray-800">{item.descricao}</span>
                <span className="font-bold text-gray-900">{formatCurrency(item.valor)}</span>
            </div>
        </div>
    );
};


const CofrePage: React.FC<CofrePageProps> = ({ appData, currentDate, onNavigateBack, getMonthKey, onAddItem, onEditItem, onDeleteItem }) => {
    
    const monthKey = getMonthKey(currentDate);
    const cofreItems = appData.cofre?.[monthKey] || [];
    
    const totalSaved = useMemo(() => {
        const grandTotal = Object.values(appData.cofre || {}).flat().reduce((sum: number, item: CofreItem) => sum + item.valor, 0);
        return { grandTotal };
    }, [appData.cofre]);
    
    const chartData = useMemo(() => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setMonth(currentDate.getMonth() - i);
            const key = getMonthKey(date);
            const monthName = getMonthName(date, 'short');
            const total = (appData.cofre?.[key] || []).reduce((sum: number, item: CofreItem) => sum + item.valor, 0);
            data.push({ name: monthName, total });
        }
        return data;
    }, [appData.cofre, currentDate, getMonthKey]);

    const maxChartValue = Math.max(...chartData.map(d => d.total), 1);


    return (
        <div className="w-screen h-screen flex flex-col relative bg-gray-50">
            <header className="bg-[#3BCE66] text-white p-4 h-[80px] flex-shrink-0 flex items-center shadow-md">
                <button onClick={onNavigateBack} className="p-2 -ml-2">
                    <ArrowLeftIcon className="w-7 h-7" />
                </button>
                <h1 className="text-xl font-bold text-center flex-grow">Cofre Pessoal</h1>
                <div className="w-8"></div>
            </header>
            
            <main className="flex-grow flex flex-col overflow-y-auto p-4 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow text-center animate-subtle-fade-up">
                    <p className="text-gray-500">Total Guardado</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">{formatCurrency(totalSaved.grandTotal)}</h2>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow animate-subtle-fade-up" style={{ animationDelay: '100ms' }}>
                    <h3 className="font-bold text-gray-700 mb-4">Economias Mensais</h3>
                    <div className="flex justify-around items-end h-32 space-x-2">
                        {chartData.map((data) => (
                            <div key={data.name} className="flex flex-col items-center flex-1 h-full justify-end">
                                <div 
                                    className="w-full bg-[#3BCE66] bg-opacity-70 rounded-t-md hover:bg-opacity-100 transition-all" 
                                    style={{ height: `${(data.total / maxChartValue) * 100}%` }}
                                    title={`${data.name}: ${formatCurrency(data.total)}`}
                                ></div>
                                <span className="text-xs text-gray-500 mt-1">{data.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="animate-subtle-fade-up" style={{ animationDelay: '200ms' }}>
                     <h3 className="font-bold text-gray-700 mb-2 px-1">Depósitos em {getMonthName(currentDate)}</h3>
                     <div className="space-y-1">
                        {cofreItems.length > 0 ? cofreItems.map((item, index) => (
                           <CofreItemComponent
                                key={item.id}
                                item={item}
                                onEdit={() => onEditItem(item)}
                                onDelete={() => onDeleteItem(item)}
                                index={index}
                           />
                        )) : (
                            <div className="text-center text-gray-400 p-8 bg-white rounded-lg shadow-sm">
                                <p>Nenhum valor guardado este mês.</p>
                            </div>
                        )}
                     </div>
                </div>
            </main>

            <div className="absolute bottom-6 right-6 z-50 animate-fab-in" onClick={onAddItem}>
                <button className="bg-[#3BCE66] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform hover:scale-110 active:scale-95 transition-transform">
                    <PlusIcon />
                </button>
            </div>
        </div>
    );
};

export default CofrePage;