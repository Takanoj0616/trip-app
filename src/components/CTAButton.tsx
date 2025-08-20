'use client';

import { useState } from 'react';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function CTAButton({ href, children }: CTAButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '18px 36px',
        borderRadius: '50px',
        fontWeight: '700',
        fontSize: '16px',
        textDecoration: 'none',
        color: 'white',
        background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
        boxShadow: isHovered ? '0 15px 35px rgba(79, 172, 254, 0.4)' : '0 8px 25px rgba(79, 172, 254, 0.3)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
}