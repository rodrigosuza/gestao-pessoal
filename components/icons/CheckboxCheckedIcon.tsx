
import React from 'react';

export const CheckboxCheckedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className || "h-8 w-8"}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#3BCE66" />
        <path d="M7 12.5L10.5 16L17.5 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
