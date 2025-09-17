import { Metadata } from 'next';
import AreasPage from '@/app/areas/page';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  title: 'مناطق اليابان | دليل السفر - طوكيو، يوكوهاما، سايتاما، تشيبا',
  description: 'اكتشف أفضل مناطق اليابان: طوكيو الحضرية، يوكوهاما، سايتاما، وتشيبا. أدلة مفصلة وتقييمات وتوصيات سفر.',
  keywords: 'مناطق اليابان,مناطق طوكيو,سياحة يوكوهاما,سفر سايتاما,معالم تشيبا,منطقة طوكيو الحضرية,دليل سفر اليابان',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/ar/areas`,
    languages: {
      'ja': `${baseUrl}/areas`,
      'en': `${baseUrl}/en/areas`,
      'fr': `${baseUrl}/fr/areas`,
      'ko': `${baseUrl}/ko/areas`,
      'ar': `${baseUrl}/ar/areas`,
    }
  },
  openGraph: {
    title: 'مناطق اليابان | دليل السفر - طوكيو، يوكوهاما، سايتاما، تشيبا',
    description: 'اكتشف أفضل مناطق اليابان: طوكيو الحضرية، يوكوهاما، سايتاما، وتشيبا. أدلة مفصلة وتقييمات وتوصيات سفر.',
    url: `${baseUrl}/ar/areas`,
    siteName: 'دليل السفر لليابان',
    locale: 'ar',
    type: 'website',
    images: [{
      url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630',
      width: 1200,
      height: 630,
      alt: 'مناطق اليابان - طوكيو، يوكوهاما، سايتاما، تشيبا'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مناطق اليابان | دليل السفر - طوكيو، يوكوهاما، سايتاما، تشيبا',
    description: 'اكتشف أفضل مناطق اليابان: طوكيو الحضرية، يوكوهاما، سايتاما، وتشيبا.',
    images: ['https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630']
  }
};

export default AreasPage;