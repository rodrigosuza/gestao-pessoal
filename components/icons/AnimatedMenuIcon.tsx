
import React from 'react';

interface AnimatedMenuIconProps {
  isOpen: boolean;
  onClick?: () => void;
  color?: 'white' | 'black';
  className?: string;
}

export const AnimatedMenuIcon: React.FC<AnimatedMenuIconProps> = ({ 
  isOpen, 
  onClick, 
  color = 'white', 
  className = '' 
}) => {
  const strokeColor = color === 'black' ? '#000000' : '#FFFFFF';

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center focus:outline-none ${className}`}
      aria-label="Toggle menu"
    >
      <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
        {/* Top bar -> top part of X */}
        <path
          d="M8 10H24"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          className="origin-center transition-all duration-300"
          style={{
            transform: isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none',
          }}
        />
        {/* Middle bar -> disappears */}
        <path
          d="M8 16H24"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-300"
          style={{
            opacity: isOpen ? 0 : 1,
          }}
        />
        {/* Bottom bar -> bottom part of X */}
        <path
          d="M8 22H24"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          className="origin-center transition-all duration-300"
          style={{
            transform: isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none',
          }}
        />
      </svg>
    </button>
  );
};
