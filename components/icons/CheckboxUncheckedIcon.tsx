
import React from 'react';

export const CheckboxUncheckedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className || "h-8 w-8"}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="2" y="2" width="20" height="20" rx="4" stroke="#9CA3AF" strokeWidth="1.5" />
    </svg>
);
