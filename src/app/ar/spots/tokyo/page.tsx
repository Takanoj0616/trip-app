import { Metadata } from 'next';
import TokyoSpotsPage from '@/app/spots/tokyo/page';
import { BASE_URL as baseUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'أماكن طوكيو | دليل السفر - المعالم والمطاعم والفنادق',
  description: 'اكتشف أفضل أماكن طوكيو: المعالم السياحية والمطاعم الأصيلة والفنادق الفاخرة والتجارب الفريدة. دليل شامل مع التقييمات والتوصيات.',
  keywords: 'أماكن طوكيو,معالم طوكيو,مطاعم طوكيو,فنادق طوكيو,دليل سفر طوكيو,سياحة طوكيو,أنشطة طوكيو,أماكن طوكيو,تجارب طوكيو',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/ar/spots/tokyo`,
    languages: {
      'ja': `${baseUrl}/spots/tokyo`,
      'en': `${baseUrl}/en/spots/tokyo`,
      'fr': `${baseUrl}/fr/spots/tokyo`,
      'ko': `${baseUrl}/ko/spots/tokyo`,
      'ar': `${baseUrl}/ar/spots/tokyo`,
    }
  },
  openGraph: {
    title: 'أماكن طوكيو | دليل السفر - المعالم والمطاعم والفنادق',
    description: 'اكتشف أفضل أماكن طوكيو: المعالم السياحية والمطاعم الأصيلة والفنادق الفاخرة والتجارب الفريدة. دليل شامل مع التقييمات.',
    url: `${baseUrl}/ar/spots/tokyo`,
    siteName: 'دليل السفر لليابان',
    locale: 'ar',
    type: 'website',
    images: [{
      url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630',
      width: 1200,
      height: 630,
      alt: 'أماكن طوكيو - المعالم والتجارب'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أماكن طوكيو | دليل السفر - المعالم والمطاعم والفنادق',
    description: 'اكتشف أفضل أماكن طوكيو: المعالم السياحية والمطاعم الأصيلة والفنادق الفاخرة والتجارب الفريدة.',
    images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630']
  }
};

export default TokyoSpotsPage;
