'use client';

import { useState } from 'react';

interface InteractiveButtonProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export default function InteractiveButton({ children, style, className, onClick }: InteractiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const defaultStyle = {
    background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    color: 'white',
    padding: '16px 40px',
    borderRadius: '50px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
    boxShadow: isHovered ? '0 15px 35px rgba(16, 185, 129, 0.4)' : '0 8px 25px rgba(16, 185, 129, 0.3)',
    transform: isHovered ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
    ...style
  };

  return (
    <button
      className={className}
      style={defaultStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}