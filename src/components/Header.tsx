'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // フランス語ボタンを常に表示するため、isLocalhostの判定を削除
  const isLocalhost = true;

  // パスベース言語切り替え関数
  const handleLanguageChange = (newLang: string) => {
    const currentLang = getCurrentLanguageFromPath(pathname);
    let newPath = pathname;

    if (currentLang === 'ja') {
      // 日本語（デフォルト）から他の言語へ
      if (newLang !== 'ja') {
        newPath = `/${newLang}${pathname}`;
      }
    } else {
      // 他の言語から
      if (newLang === 'ja') {
        // 日本語（デフォルト）へ - プレフィックスを削除
        newPath = pathname.replace(`/${currentLang}`, '') || '/';
      } else {
        // 他の言語へ - プレフィックスを置換
        newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
      }
    }

    // ナビゲーションとコンテキスト更新
    setCurrentLanguage(newLang);
    router.push(newPath);
  };

  // パスから現在の言語を取得
  const getCurrentLanguageFromPath = (path: string): string => {
    const segments = path.split('/').filter(Boolean);
    const locales = ['en', 'ko', 'fr', 'ar'];

    if (segments.length > 0 && locales.includes(segments[0])) {
      return segments[0];
    }
    return 'ja'; // デフォルト
  };

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
    <header className="header--dark-text">
      <div className="header-content">
        <Link href="/" className="logo">
          <span>🗾</span>
          <span>Japan Guide</span>
        </Link>

        {/* Mobile hamburger */}
        <button
          className="hamburger-btn"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        
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
          {/* ai-spots は5回まで無料体験を許可するため、認証必須リンクを解除 */}
          <Link href="/ai-spots" className="nav-link">
            <i className="fas fa-brain"></i>
            <span data-translate="nav.ai-spots">{t('nav.ai-spots')}</span>
          </Link>
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
          <Link href="/travel-experiences" className="nav-link">
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
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {loading ? (
              <div className="btn-ghost small-text">
{t('common.loading')}
              </div>
            ) : user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* User Info */}
                <div className="user-pill">
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
                  <span className="small-text" style={{ color: '#111' }}>
                    {user.name || 'User'}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button onClick={logout} className="btn-ghost">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => openAuthModal('login')} className="btn-ghost">
                  <i className="fas fa-sign-in-alt"></i>
                  {t('auth.login')}
                </button>
                <button onClick={() => openAuthModal('register')} className="btn-solid">
                  <i className="fas fa-user-plus"></i>
                  {t('auth.signUp')}
                </button>
              </div>
            )}

            <div className="lang-selector">
              <button
                onClick={() => handleLanguageChange('ja')}
                className={`lang-btn ${currentLanguage === 'ja' ? 'active' : ''}`}
                data-lang="ja"
                suppressHydrationWarning
              >
                日本語
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
                data-lang="en"
                suppressHydrationWarning
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('ko')}
                className={`lang-btn ${currentLanguage === 'ko' ? 'active' : ''}`}
                data-lang="ko"
                suppressHydrationWarning
              >
                한국어
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`lang-btn ${currentLanguage === 'ar' ? 'active' : ''}`}
                data-lang="ar"
                suppressHydrationWarning
              >
                العربية
              </button>
              {isLocalhost && (
                <button
                  onClick={() => handleLanguageChange('fr')}
                  className={`lang-btn ${currentLanguage === 'fr' ? 'active' : ''}`}
                  data-lang="fr"
                  suppressHydrationWarning
                >
                  Français
                </button>
              )}
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="mobile-drawer" role="dialog" aria-modal="true">
            <div className="mobile-drawer__backdrop" onClick={() => setMobileOpen(false)} />
            <div className="mobile-drawer__panel">
              <div className="mobile-drawer__header">
                <Link href="/" className="logo" onClick={() => setMobileOpen(false)}>
                  <span>🗾</span>
                  <span>Japan Guide</span>
                </Link>
                <button className="mobile-drawer__close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>×</button>
              </div>

              <nav className="mobile-drawer__nav">
                <Link href="/areas" onClick={() => setMobileOpen(false)} className="mobile-link">{t('nav.areas')}</Link>
                <Link href="/courses" onClick={() => setMobileOpen(false)} className="mobile-link">{t('nav.courses')}</Link>
                {/* 5回まで無料体験のため、こちらも通常リンクに変更 */}
                <Link href="/ai-spots" onClick={() => setMobileOpen(false)} className="mobile-link">AI</Link>
                <AuthRequiredLink href="/coordinator" onClick={() => setMobileOpen(false)} className="mobile-link">Coordinator</AuthRequiredLink>
                <Link href="/qna" onClick={() => setMobileOpen(false)} className="mobile-link">Q&A</Link>
                <Link href="/realtime" onClick={() => setMobileOpen(false)} className="mobile-link">{t('nav.realtime')}</Link>
                <Link href="/travel-experiences" onClick={() => setMobileOpen(false)} className="mobile-link">{t('nav.stories')}</Link>
                <Link href="/favorites" onClick={() => setMobileOpen(false)} className="mobile-link">{t('nav.favorites')}</Link>
              </nav>

              <div className="mobile-drawer__languages">
                <button onClick={() => { handleLanguageChange('ja'); setMobileOpen(false); }} className={`lang-btn ${currentLanguage === 'ja' ? 'active' : ''}`}>日本語</button>
                <button onClick={() => { handleLanguageChange('en'); setMobileOpen(false); }} className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}>English</button>
                <button onClick={() => { handleLanguageChange('ko'); setMobileOpen(false); }} className={`lang-btn ${currentLanguage === 'ko' ? 'active' : ''}`}>한국어</button>
                <button onClick={() => { handleLanguageChange('ar'); setMobileOpen(false); }} className={`lang-btn ${currentLanguage === 'ar' ? 'active' : ''}`}>العربية</button>
                {isLocalhost && (
                  <button onClick={() => { handleLanguageChange('fr'); setMobileOpen(false); }} className={`lang-btn ${currentLanguage === 'fr' ? 'active' : ''}`}>Français</button>
                )}
              </div>

              <div className="mobile-drawer__auth">
                {loading ? (
                  <div className="btn-ghost small-text">{t('common.loading')}</div>
                ) : user ? (
                  <>
                    <div className="user-pill" style={{ marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: user.avatar ? `url(${user.avatar})` : 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <span className="small-text" style={{ color: 'white' }}>{user.name || 'User'}</span>
                    </div>
                    <button className="btn-ghost" onClick={() => { logout(); setMobileOpen(false); }}>Logout</button>
                  </>
                ) : (
                  <>
                    <button className="btn-ghost" onClick={() => { setMobileOpen(false); openAuthModal('login'); }}>{t('auth.login')}</button>
                    <button className="btn-solid" onClick={() => { setMobileOpen(false); openAuthModal('register'); }}>{t('auth.signUp')}</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
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
