
import React from 'react';

export const IosInstallGuide: React.FC = () => (
    <svg width="100%" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" className="bg-gray-50 rounded-lg border border-gray-200">
        <defs>
            <filter id="shadow-ios" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.1"/>
            </filter>
        </defs>

        {/* Browser bottom bar */}
        <rect x="5" y="5" width="290" height="40" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1"/>
        
        {/* Share Icon */}
        <rect x="135" y="10" width="30" height="30" rx="4" fill="#E0F2FE"/>
        <g stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M150 16 v12" />
            <path d="M146 20 l4 -4 l4 4" />
            <path d="M142 22 h16" />
        </g>
        
        {/* Animated Arrow */}
        <path d="M 150 45 Q 150 65, 150 85" stroke="#EF4444" strokeWidth="2" fill="none" strokeDasharray="5 3">
            <animate attributeName="stroke-dashoffset" from="8" to="0" dur="0.5s" repeatCount="indefinite" />
        </path>
        <path d="M 145 80 L 150 85 L 155 80" stroke="#EF4444" strokeWidth="2" fill="none"/>

        {/* Share Sheet */}
        <rect x="20" y="90" width="260" height="120" rx="10" fill="white" filter="url(#shadow-ios)"/>
        <text x="35" y="110" fontFamily="sans-serif" fontSize="10" fill="#6B7280">Copiar</text>
        <text x="35" y="130" fontFamily="sans-serif" fontSize="10" fill="#6B7280">Imprimir</text>
        <line x1="30" y1="140" x2="270" y2="140" stroke="#E5E7EB" strokeWidth="1"/>

        {/* Highlighted Add to Home Screen option */}
        <rect x="30" y="150" width="240" height="25" rx="5" fill="#ECFDF5"/>
        <rect x="37" y="155" width="15" height="15" rx="3" fill="#34D399"/>
        <path d="M41.5 158 v6 M38.5 161 h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <text x="60" y="165" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#059669">Adicionar à Tela de Início</text>
        
        <text x="35" y="190" fontFamily="sans-serif" fontSize="10" fill="#6B7280">Editar Ações...</text>
    </svg>
);
