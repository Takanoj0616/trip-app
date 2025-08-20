'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ 
  children, 
  fallback, 
  requireAuth = true 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        color: 'rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '16px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #4FACFE',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          認証状態を確認中...
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (requireAuth && !user) {
    return (
      <>
        {fallback || (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '60px 40px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '40px auto'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '20px'
            }}>
              🔒
            </div>
            <h3 style={{
              color: 'black',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              ログインが必要です
            </h3>
            <p style={{
              color: 'rgba(0, 0, 0, 0.7)',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '30px'
            }}>
              この機能をご利用いただくには、アカウントにログインしてください。<br />
              無料でアカウントを作成できます。
            </p>
            
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <i className="fas fa-sign-in-alt"></i>
                ログイン
              </button>
              
              <button
                onClick={() => {
                  window.history.back();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'black',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '25px',
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <i className="fas fa-arrow-left"></i>
                戻る
              </button>
            </div>

            <div style={{
              marginTop: '30px',
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(79, 172, 254, 0.1)',
              border: '1px solid rgba(79, 172, 254, 0.3)',
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.7)'
            }}>
              <div style={{ marginBottom: '8px', fontWeight: '600' }}>
                ログイン後にご利用いただける機能:
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '4px' }}>• AIおすすめスポット</li>
                <li style={{ marginBottom: '4px' }}>• コーディネーターマッチング</li>
                <li style={{ marginBottom: '4px' }}>• AIプラン作成</li>
                <li>• マイルート作成</li>
              </ul>
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

  return <>{children}</>;
}