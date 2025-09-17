import { Metadata } from 'next';
import TokyoSpotsPage from '@/app/spots/tokyo/page';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  title: 'Spots de Tokyo | Guide de Voyage - Attractions, Restaurants et Hotels',
  description: 'Découvrez les meilleurs spots de Tokyo : attractions touristiques, restaurants authentiques, hôtels de luxe et expériences uniques. Guide complet avec évaluations et recommandations.',
  keywords: 'spots Tokyo,attractions Tokyo,restaurants Tokyo,hôtels Tokyo,guide voyage Tokyo,tourisme Tokyo,que faire Tokyo,lieux Tokyo,expériences Tokyo',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/fr/spots/tokyo`,
    languages: {
      'ja': `${baseUrl}/spots/tokyo`,
      'en': `${baseUrl}/en/spots/tokyo`,
      'fr': `${baseUrl}/fr/spots/tokyo`,
      'ko': `${baseUrl}/ko/spots/tokyo`,
      'ar': `${baseUrl}/ar/spots/tokyo`,
    }
  },
  openGraph: {
    title: 'Spots de Tokyo | Guide de Voyage - Attractions, Restaurants et Hotels',
    description: 'Découvrez les meilleurs spots de Tokyo : attractions touristiques, restaurants authentiques, hôtels de luxe et expériences uniques. Guide complet avec évaluations.',
    url: `${baseUrl}/fr/spots/tokyo`,
    siteName: 'Guide de Voyage au Japon',
    locale: 'fr',
    type: 'website',
    images: [{
      url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630',
      width: 1200,
      height: 630,
      alt: 'Spots de Tokyo - Attractions et Expériences'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spots de Tokyo | Guide de Voyage - Attractions, Restaurants et Hotels',
    description: 'Découvrez les meilleurs spots de Tokyo : attractions touristiques, restaurants authentiques, hôtels de luxe et expériences uniques.',
    images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630']
  }
};

export default TokyoSpotsPage;