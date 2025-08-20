'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  db,
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  onSnapshot 
} from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { TouristSpot } from '@/types';

interface FavoritesContextType {
  favorites: string[];
  favoriteSpots: TouristSpot[];
  addToFavorites: (spotId: string) => Promise<void>;
  removeFromFavorites: (spotId: string) => Promise<void>;
  isFavorite: (spotId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteSpots, setFavoriteSpots] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setFavoriteSpots([]);
      return;
    }

    const userDocRef = doc(db, 'users', user.id);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setFavorites(userData.favorites || []);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const addToFavorites = async (spotId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        favorites: arrayUnion(spotId)
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (spotId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        favorites: arrayRemove(spotId)
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (spotId: string) => {
    return favorites.includes(spotId);
  };

  const value = {
    favorites,
    favoriteSpots,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loading
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};