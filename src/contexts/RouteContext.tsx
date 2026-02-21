'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TouristSpot } from '@/types';

interface RouteContextType {
  selectedSpots: TouristSpot[];
  addSpot: (spot: TouristSpot) => void;
  removeSpot: (spotId: string) => void;
  clearSpots: () => void;
  isSpotSelected: (spotId: string) => boolean;
  toggleSpot: (spot: TouristSpot) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};

interface RouteProviderProps {
  children: React.ReactNode;
}

const dedupeSpotsById = (spots: TouristSpot[]): TouristSpot[] => {
  const seen = new Set<string>();
  const deduped: TouristSpot[] = [];

  for (const spot of spots) {
    const id = typeof spot?.id === 'string' ? spot.id.trim() : '';
    if (!id || seen.has(id)) continue;
    seen.add(id);
    deduped.push({ ...spot, id });
  }

  return deduped;
};

export const RouteProvider: React.FC<RouteProviderProps> = ({ children }) => {
  const [selectedSpots, setSelectedSpots] = useState<TouristSpot[]>([]);

  // Restore from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('selected-spots');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSelectedSpots(dedupeSpotsById(parsed as TouristSpot[]));
        }
      }
    } catch {}
  }, []);

  const addSpot = useCallback((spot: TouristSpot) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('addSpot called for:', spot.id, spot.name);
    }
    setSelectedSpots(prev => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Previous selectedSpots:', prev);
      }
      if (prev.some(s => s.id === spot.id)) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Spot already exists, not adding');
        }
        return prev;
      }
      const newSpots = [...prev, spot];
      if (process.env.NODE_ENV === 'development') {
        console.log('New selectedSpots after adding:', newSpots);
      }
      return newSpots;
    });
  }, []);

  const removeSpot = useCallback((spotId: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('removeSpot called for:', spotId);
    }
    setSelectedSpots(prev => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Previous selectedSpots before removal:', prev);
      }
      const newSpots = prev.filter(spot => spot.id !== spotId);
      if (process.env.NODE_ENV === 'development') {
        console.log('New selectedSpots after removal:', newSpots);
      }
      return newSpots;
    });
  }, []);

  const clearSpots = useCallback(() => {
    setSelectedSpots([]);
  }, []);

  const isSpotSelected = useCallback((spotId: string) => {
    return selectedSpots.some(spot => spot.id === spotId);
  }, [selectedSpots]);

  const toggleSpot = useCallback((spot: TouristSpot) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('toggleSpot called for:', spot.id);
    }
    
    setSelectedSpots(prev => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Current selectedSpots:', prev);
      }
      const currentlySelected = prev.some(s => s.id === spot.id);
      if (process.env.NODE_ENV === 'development') {
        console.log('Is currently selected?', currentlySelected);
      }
      
      if (currentlySelected) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Removing spot from route');
        }
        const newSpots = prev.filter(s => s.id !== spot.id);
        if (process.env.NODE_ENV === 'development') {
          console.log('New selectedSpots after removal:', newSpots);
        }
        return newSpots;
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('Adding spot to route');
        }
        const newSpots = [...prev, spot];
        if (process.env.NODE_ENV === 'development') {
          console.log('New selectedSpots after adding:', newSpots);
        }
        return newSpots;
      }
    });
  }, []);

  // Persist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('selected-spots', JSON.stringify(dedupeSpotsById(selectedSpots)));
    } catch {}
  }, [selectedSpots]);

  const value = {
    selectedSpots,
    addSpot,
    removeSpot,
    clearSpots,
    isSpotSelected,
    toggleSpot,
  };

  return (
    <RouteContext.Provider value={value}>
      {children}
    </RouteContext.Provider>
  );
};
