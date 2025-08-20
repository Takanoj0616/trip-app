'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  db,
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  doc,
  addDoc,
  deleteDoc
} from '@/lib/firebase';
import { useAuth } from './AuthContext';

export interface CheckIn {
  id: string;
  userId: string;
  spotId: string;
  spotName: string;
  spotCategory: string;
  spotArea: string;
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
  };
  note?: string;
  photos?: string[];
  isPublic: boolean;
}

interface CheckInContextType {
  checkIns: CheckIn[];
  addCheckIn: (checkIn: Omit<CheckIn, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  removeCheckIn: (checkInId: string) => Promise<void>;
  getCheckInsForSpot: (spotId: string) => CheckIn[];
  hasCheckedIn: (spotId: string) => boolean;
  loading: boolean;
}

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);

export const useCheckIn = () => {
  const context = useContext(CheckInContext);
  if (context === undefined) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return context;
};

export const CheckInProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setCheckIns([]);
      return;
    }

    const checkInsRef = collection(db, 'checkIns');
    const q = query(
      checkInsRef,
      where('userId', '==', user.id),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const checkInsData = snapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date()
        } as CheckIn;
      });
      setCheckIns(checkInsData);
    });

    return () => unsubscribe();
  }, [user]);

  const addCheckIn = async (checkInData: Omit<CheckIn, 'id' | 'userId' | 'timestamp'>) => {
    if (!user) throw new Error('User must be logged in to check in');
    
    setLoading(true);
    try {
      const checkInsRef = collection(db, 'checkIns');
      await addDoc(checkInsRef, {
        ...checkInData,
        userId: user.id,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding check-in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeCheckIn = async (checkInId: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'checkIns', checkInId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error removing check-in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCheckInsForSpot = (spotId: string) => {
    return checkIns.filter(checkIn => checkIn.spotId === spotId);
  };

  const hasCheckedIn = (spotId: string) => {
    return checkIns.some(checkIn => checkIn.spotId === spotId);
  };

  const value = {
    checkIns,
    addCheckIn,
    removeCheckIn,
    getCheckInsForSpot,
    hasCheckedIn,
    loading
  };

  return (
    <CheckInContext.Provider value={value}>
      {children}
    </CheckInContext.Provider>
  );
};