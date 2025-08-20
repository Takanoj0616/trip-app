'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

interface AuthRequiredLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}

export default function AuthRequiredLink({ 
  href, 
  children, 
  className = '', 
  style = {},
  onClick,
  ...props 
}: AuthRequiredLinkProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setShowAuthModal(true);
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <>
      {user ? (
        <Link
          href={href}
          className={className}
          style={style}
          onClick={onClick}
          {...props}
        >
          {children}
        </Link>
      ) : (
        <div
          className={className}
          style={{
            ...style,
            cursor: 'pointer',
            position: 'relative'
          }}
          onClick={handleClick}
          {...props}
        >
          {children}
          {/* Lock icon overlay */}
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px'
          }}>
            🔒
          </div>
        </div>
      )}
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}