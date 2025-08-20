'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp, signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      onClose();
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Googleログインでエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '400px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.6)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'black',
            marginBottom: '8px'
          }}>
            {mode === 'login' ? 'ログイン' : '新規登録'}
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(0, 0, 0, 0.7)'
          }}>
            {mode === 'login' 
              ? 'アカウントにログインしてください' 
              : '新しいアカウントを作成してください'
            }
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid rgba(0, 0, 0, 0.1)',
            background: 'white',
            color: 'black',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'white';
            }
          }}
        >
          <span style={{ fontSize: '18px' }}>🔍</span>
          Googleでログイン
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '20px 0',
          color: 'rgba(0, 0, 0, 0.5)',
          fontSize: '14px'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(0, 0, 0, 0.1)'
          }}></div>
          <span style={{ padding: '0 16px' }}>または</span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(0, 0, 0, 0.1)'
          }}></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'black'
              }}>
                お名前
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === 'register'}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(0, 0, 0, 0.1)',
                  background: 'white',
                  fontSize: '16px',
                  color: 'black'
                }}
                placeholder="山田 太郎"
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'black'
            }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '2px solid rgba(0, 0, 0, 0.1)',
                background: 'white',
                fontSize: '16px',
                color: 'black'
              }}
              placeholder="example@email.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'black'
            }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '2px solid rgba(0, 0, 0, 0.1)',
                background: 'white',
                fontSize: '16px',
                color: 'black'
              }}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: '#d63384',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <span>処理中...</span>
            ) : (
              mode === 'login' ? 'ログイン' : '新規登録'
            )}
          </button>
        </form>

        {/* Switch mode */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '14px' }}>
            {mode === 'login' ? 'アカウントをお持ちでない方は' : '既にアカウントをお持ちの方は'}
          </span>
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#4FACFE',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: '4px',
              textDecoration: 'underline'
            }}
          >
            {mode === 'login' ? '新規登録' : 'ログイン'}
          </button>
        </div>

        {/* Demo notice */}
        <div style={{
          marginTop: '20px',
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(79, 172, 254, 0.1)',
          border: '1px solid rgba(79, 172, 254, 0.3)',
          fontSize: '12px',
          color: 'rgba(0, 0, 0, 0.7)',
          textAlign: 'center'
        }}>
          💡 これはデモ環境です。実際のFirebaseアカウントは作成されません。
        </div>
      </div>
    </div>
  );
}