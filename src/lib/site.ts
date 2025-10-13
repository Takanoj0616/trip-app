// No server/client directive: shared constants module

// Centralized site configuration for URLs and analytics.

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.travelguidejapan.net';

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Vercel environment flags
export const IS_VERCEL = !!process.env.VERCEL;
export const VERCEL_ENV = (process.env.VERCEL_ENV || '').toLowerCase();
export const IS_PREVIEW = VERCEL_ENV === 'preview';
export const IS_PRODUCTION = VERCEL_ENV === 'production' || (!IS_PREVIEW && process.env.NODE_ENV === 'production');
