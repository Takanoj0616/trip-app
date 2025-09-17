import { Metadata } from 'next';
import AreasPage from '@/app/areas/page';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  title: 'Japan Regions | Travel Guide - Tokyo, Yokohama, Saitama, Chiba',
  description: 'Discover the best regions of Japan: Metropolitan Tokyo, Yokohama, Saitama, and Chiba. Detailed guides, ratings, and travel recommendations.',
  keywords: 'Japan regions,Tokyo areas,Yokohama tourism,Saitama travel,Chiba attractions,Tokyo metropolitan area,Japan travel guide',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/en/areas`,
    languages: {
      'ja': `${baseUrl}/areas`,
      'en': `${baseUrl}/en/areas`,
      'fr': `${baseUrl}/fr/areas`,
      'ko': `${baseUrl}/ko/areas`,
      'ar': `${baseUrl}/ar/areas`,
    }
  },
  openGraph: {
    title: 'Japan Regions | Travel Guide - Tokyo, Yokohama, Saitama, Chiba',
    description: 'Discover the best regions of Japan: Metropolitan Tokyo, Yokohama, Saitama, and Chiba. Detailed guides, ratings, and travel recommendations.',
    url: `${baseUrl}/en/areas`,
    siteName: 'Japan Travel Guide',
    locale: 'en',
    type: 'website',
    images: [{
      url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630',
      width: 1200,
      height: 630,
      alt: 'Japan Regions - Tokyo, Yokohama, Saitama, Chiba'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Japan Regions | Travel Guide - Tokyo, Yokohama, Saitama, Chiba',
    description: 'Discover the best regions of Japan: Metropolitan Tokyo, Yokohama, Saitama, and Chiba.',
    images: ['https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630']
  }
};

export default AreasPage;