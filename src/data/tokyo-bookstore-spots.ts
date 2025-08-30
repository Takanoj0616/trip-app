import { TouristSpot } from '@/types';
import spotsJson from './tokyo-bookstore-spots.json';

// Prefer JSON as the single source of truth so sync scripts can update it.
const newTokyoBookstoreSpots = spotsJson as unknown as TouristSpot[];

export const allBookstoreSpots = newTokyoBookstoreSpots;
