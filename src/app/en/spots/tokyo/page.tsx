import { Metadata } from 'next';
import TokyoSpotsPage from '@/app/spots/tokyo/page';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app';

export const metadata: Metadata = {
  title: 'Tokyo Spots | Travel Guide - Attractions, Restaurants and Hotels',
  description: 'Discover the best Tokyo spots: tourist attractions, authentic restaurants, luxury hotels and unique experiences. Complete guide with ratings and recommendations.',
  keywords: 'Tokyo spots,Tokyo attractions,Tokyo restaurants,Tokyo hotels,Tokyo travel guide,Tokyo tourism,things to do Tokyo,Tokyo places,Tokyo experiences',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/en/spots/tokyo`,
    languages: {
      'x-default': `${baseUrl}/spots/tokyo`,
      'ja-JP': `${baseUrl}/spots/tokyo`,
      'en-GB': `${baseUrl}/en/spots/tokyo`,
      'en-US': `${baseUrl}/en/spots/tokyo`,
      'fr-FR': `${baseUrl}/fr/spots/tokyo`,
      'ko-KR': `${baseUrl}/ko/spots/tokyo`,
      'ar-SA': `${baseUrl}/ar/spots/tokyo`,
    }
  },
  openGraph: {
    title: 'Tokyo Spots | Travel Guide - Attractions, Restaurants and Hotels',
    description: 'Discover the best Tokyo spots: tourist attractions, authentic restaurants, luxury hotels and unique experiences. Complete guide with ratings.',
    url: `${baseUrl}/en/spots/tokyo`,
    siteName: 'Japan Travel Guide',
    locale: 'en_GB',
    type: 'website',
    images: [{
      url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630',
      width: 1200,
      height: 630,
      alt: 'Tokyo Spots - Attractions and Experiences'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tokyo Spots | Travel Guide - Attractions, Restaurants and Hotels',
    description: 'Discover the best Tokyo spots: tourist attractions, authentic restaurants, luxury hotels and unique experiences.',
    images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630']
  }
};

export default TokyoSpotsPage;
