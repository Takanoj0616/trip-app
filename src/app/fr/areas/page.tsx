import { Metadata } from 'next';
import AreasPage from '@/app/areas/page';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  title: 'Régions du Japon | Guide de Voyage - Tokyo, Yokohama, Saitama, Chiba',
  description: 'Découvrez les meilleures régions du Japon : Tokyo métropolitain, Yokohama, Saitama et Chiba. Guides détaillés, évaluations et recommandations de voyage.',
  keywords: 'régions Japon,zones Tokyo,tourisme Yokohama,voyage Saitama,attractions Chiba,région métropolitaine Tokyo,guide voyage Japon',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/fr/areas`,
    languages: {
      'ja': `${baseUrl}/areas`,
      'en': `${baseUrl}/en/areas`,
      'fr': `${baseUrl}/fr/areas`,
      'ko': `${baseUrl}/ko/areas`,
      'ar': `${baseUrl}/ar/areas`,
    }
  },
  openGraph: {
    title: 'Régions du Japon | Guide de Voyage - Tokyo, Yokohama, Saitama, Chiba',
    description: 'Découvrez les meilleures régions du Japon : Tokyo métropolitain, Yokohama, Saitama et Chiba. Guides détaillés, évaluations et recommandations de voyage.',
    url: `${baseUrl}/fr/areas`,
    siteName: 'Guide de Voyage au Japon',
    locale: 'fr',
    type: 'website',
    images: [{
      url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630',
      width: 1200,
      height: 630,
      alt: 'Régions du Japon - Tokyo, Yokohama, Saitama, Chiba'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Régions du Japon | Guide de Voyage - Tokyo, Yokohama, Saitama, Chiba',
    description: 'Découvrez les meilleures régions du Japon : Tokyo métropolitain, Yokohama, Saitama et Chiba.',
    images: ['https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630']
  }
};

export default AreasPage;