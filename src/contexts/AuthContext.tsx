'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser
} from 'firebase/auth';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  OAuthProvider,
  signInWithPopup, 
  onAuthStateChanged,
  updateProfile
} from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase auth is not available');
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const userData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            avatar: firebaseUser.photoURL || undefined,
            preferences: {
              language: 'ja',
              favoriteAreas: [],
              favoriteCategories: []
            },
            favorites: [],
            createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString()
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Firebase auth initialization failed:', error);
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase auth is not available');
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth) {
      throw new Error('Firebase auth is not available');
    }
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Update user profile with name
    if (result.user && name) {
      await updateProfile(result.user, {
        displayName: name
      });
    }
    try {
      const w: any = typeof window !== 'undefined' ? (window as any) : undefined;
      if (w && w.gtag) {
        w.gtag('event', 'sign_up', { method: 'email' });
      } else {
        console.log('GA4 Event: sign_up', { method: 'email' });
      }
    } catch {}
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase auth is not available');
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      // Fire sign_up only if this looks like the first sign-in (new account)
      const u = result?.user as any;
      const isNew = u?.metadata?.creationTime && u?.metadata?.lastSignInTime && (u.metadata.creationTime === u.metadata.lastSignInTime);
      if (isNew) {
        const w: any = typeof window !== 'undefined' ? (window as any) : undefined;
        if (w && w.gtag) {
          w.gtag('event', 'sign_up', { method: 'google' });
        } else {
          console.log('GA4 Event: sign_up', { method: 'google' });
        }
      }
    } catch {}
  };

  const signInWithApple = async () => {
    if (!auth) {
      throw new Error('Firebase auth is not available');
    }
    try {
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      try {
        const u = result?.user as any;
        const isNew = u?.metadata?.creationTime && u?.metadata?.lastSignInTime && (u.metadata.creationTime === u.metadata.lastSignInTime);
        if (isNew) {
          const w: any = typeof window !== 'undefined' ? (window as any) : undefined;
          if (w && w.gtag) {
            w.gtag('event', 'sign_up', { method: 'apple' });
          } else {
            console.log('GA4 Event: sign_up', { method: 'apple' });
          }
        }
      } catch {}
    } catch (e: any) {
      const msg = e?.message || 'Apple sign-in is not configured';
      throw new Error(msg);
    }
  };

  const logout = async () => {
    if (!auth) {
      throw new Error('Firebase auth is not available');
    }
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
