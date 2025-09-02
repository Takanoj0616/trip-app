'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthRequiredLink from './AuthRequiredLink';

const Header: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const { user, loading, logout, signIn, signUp, signInWithGoogle } = useAuth();
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();

  // フランス語ボタンを常に表示するため、isLocalhostの判定を削除
  const isLocalhost = true;

  const resetAuthForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setAuthError('');
    setAuthLoading(false);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    resetAuthForm();
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    resetAuthForm();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login' && (!email || !password)) {
      setAuthError('Please enter email and password.');
      return;
    }
    if (authMode === 'register' && (!email || !password || !name)) {
      setAuthError('Please fill in all fields.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      closeAuthModal();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed.';
      setAuthError(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    setAuthError('');

    try {
      await signInWithGoogle();
      closeAuthModal();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed.';
      setAuthError(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <header>
      <div className="header-content">
        <Link href="/" className="logo">
          <span>🗾</span>
          <span>Japan Guide</span>
        </Link>
        
        {/* Navigation Menu */}
        <nav className="nav-menu">
          <Link href="/areas" className="nav-link">
            <i className="fas fa-map-marked-alt"></i>
            <span data-translate="nav.areas">{t('nav.areas')}</span>
          </Link>
          <Link href="/courses" className="nav-link">
            <i className="fas fa-route"></i>
            <span data-translate="nav.courses">{t('nav.courses')}</span>
          </Link>
          <AuthRequiredLink href="/ai-spots" className="nav-link">
            <i className="fas fa-brain"></i>
            <span data-translate="nav.ai-spots">{t('nav.ai-spots')}</span>
          </AuthRequiredLink>
          <AuthRequiredLink href="/coordinator" className="nav-link">
            <i className="fas fa-users"></i>
            <span data-translate="nav.coordinator">{t('nav.coordinator')}</span>
          </AuthRequiredLink>
          <Link href="/qna" className="nav-link">
            <i className="fas fa-question-circle"></i>
            <span>Q&A</span>
          </Link>
          <Link href="/realtime" className="nav-link">
            <i className="fas fa-satellite-dish"></i>
            <span data-translate="nav.realtime">{t('nav.realtime')}</span>
          </Link>
          <Link href="/stories" className="nav-link">
            <i className="fas fa-book"></i>
            <span data-translate="nav.stories">{t('nav.stories')}</span>
          </Link>
          <Link href="/favorites" className="nav-link">
            <i className="fas fa-heart"></i>
            <span data-translate="nav.favorites">{t('nav.favorites')}</span>
          </Link>
        </nav>

        {/* AI Features */}
        <div className="ai-header-section">
          <AuthRequiredLink href="/plan" className="btn btn-primary ai-cta-header">
            <i className="fas fa-magic"></i>
            <span data-translate="ai.cta">{t('auth.createPlan')}</span>
          </AuthRequiredLink>
        </div>

          {/* User Authentication Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {loading ? (
              <div style={{ 
                padding: '8px 16px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px'
              }}>
{t('common.loading')}
              </div>
            ) : user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* User Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: user.avatar 
                      ? `url(${user.avatar})` 
                      : 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {!user.avatar && (user.name ? user.name.charAt(0) : user.email.charAt(0))}
                  </div>
                  <span style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {user.name || 'User'}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => openAuthModal('login')}
                  style={{
                    background: 'transparent',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  {t('auth.login')}
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  style={{
                    background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                  <i className="fas fa-user-plus"></i>
                  {t('auth.signUp')}
                </button>
              </div>
            )}

            <div className="lang-selector">
              <button 
                onClick={() => setCurrentLanguage('ja')}
                className={`lang-btn ${currentLanguage === 'ja' ? 'active' : ''}`}
                data-lang="ja"
                suppressHydrationWarning
              >
                日本語
              </button>
              <button 
                onClick={() => setCurrentLanguage('en')}
                className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
                data-lang="en"
                suppressHydrationWarning
              >
                English
              </button>
              <button 
                onClick={() => setCurrentLanguage('ko')}
                className={`lang-btn ${currentLanguage === 'ko' ? 'active' : ''}`}
                data-lang="ko"
                suppressHydrationWarning
              >
                한국어
              </button>
              {isLocalhost && (
                <button 
                  onClick={() => setCurrentLanguage('fr')}
                  className={`lang-btn ${currentLanguage === 'fr' ? 'active' : ''}`}
                  data-lang="fr"
                  suppressHydrationWarning
                >
                  Français
                </button>
              )}
            </div>
          </div>
        </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={closeAuthModal}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              transform: 'translateY(0)',
              margin: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#1f2937', 
                margin: '0 0 8px 0' 
              }}>
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </h2>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '14px', 
                margin: 0 
              }}>
                {authMode === 'login' 
                  ? 'Please login to your account' 
                  : 'Please create a new account'
                }
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} style={{ marginBottom: '24px' }}>
              {authError && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '16px'
                }}>
                  {authError}
                </div>
              )}

              {authMode === 'register' && (
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    required
                  />
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: authLoading ? 'not-allowed' : 'pointer',
                  opacity: authLoading ? 0.7 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {authLoading 
                  ? (authMode === 'login' ? 'Logging in...' : 'Signing up...') 
                  : (authMode === 'login' ? 'Login' : 'Sign Up')
                }
              </button>
            </form>

            {/* Google Auth */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                margin: '16px 0',
                gap: '16px'
              }}>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={authLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: authLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  opacity: authLoading ? 0.7 : 1
                }}
                onMouseEnter={(e) => !authLoading && (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => !authLoading && (e.currentTarget.style.background = 'white')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34a853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fbbc05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
{authMode === 'login' ? 'Login' : 'Sign up'} with Google
              </button>
            </div>

            {/* Switch Mode */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {authMode === 'login' 
                  ? "Don't have an account? Sign up here" 
                  : 'Already have an account? Login here'
                }
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                color: '#6b7280',
                cursor: 'pointer',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s',
                lineHeight: 1
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
