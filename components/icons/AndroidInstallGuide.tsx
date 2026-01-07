
import React from 'react';

export const AndroidInstallGuide: React.FC = () => (
    <svg width="100%" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg" className="bg-gray-50 rounded-lg border border-gray-200">
        <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15"/>
            </filter>
        </defs>

        {/* Browser Top Bar */}
        <rect x="5" y="5" width="290" height="30" rx="4" fill="#E5E7EB"/>
        <circle cx="18" cy="20" r="4" fill="#F87171"/>
        <circle cx="32" cy="20" r="4" fill="#FBBF24"/>
        <circle cx="46" cy="20" r="4" fill="#34D399"/>
        
        {/* Three dots menu icon */}
        <g fill="#4B5563">
            <circle cx="280" cy="14" r="2"/>
            <circle cx="280" cy="20" r="2"/>
            <circle cx="280" cy="26" r="2"/>
        </g>
        
        {/* Animated Arrow */}
        <path d="M 280 35 Q 260 50, 240 60" stroke="#EF4444" strokeWidth="2" fill="none" strokeDasharray="5 3">
            <animate attributeName="stroke-dashoffset" from="8" to="0" dur="0.5s" repeatCount="indefinite" />
        </path>
        <path d="M 235 55 L 240 60 L 235 65" stroke="#EF4444" strokeWidth="2" fill="none"/>

        {/* Dropdown Menu */}
        <rect x="140" y="40" width="150" height="95" rx="5" fill="white" filter="url(#shadow)"/>
        <text x="150" y="60" fontFamily="sans-serif" fontSize="10" fill="#374151">Nova guia</text>
        <text x="150" y="78" fontFamily="sans-serif" fontSize="10" fill="#374151">Histórico</text>
        <text x="150" y="96" fontFamily="sans-serif" fontSize="10" fill="#374151">Downloads</text>

        {/* Highlighted install option */}
        <rect x="145" y="105" width="140" height="20" rx="3" fill="#ECFDF5"/>
        <path d="M150 115 l2.5 2.5 l5-5" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" />
        <text x="162" y="119" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#059669">Instalar aplicativo</text>

        <line x1="145" y1="100" x2="285" y2="100" stroke="#E5E7EB" strokeWidth="1"/>
    </svg>
);
