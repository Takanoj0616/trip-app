import { Metadata } from 'next';
import Home from '@/app/page';
import { BASE_URL as baseUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'دليل السفر لليابان | اكتشف اليابان',
  description: 'اكتشف أفضل الأماكن لزيارتها في اليابان مع دليلنا الشامل. تخطيط بالذكاء الاصطناعي، توصيات مخصصة، وتجارب أصيلة.',
  keywords: 'دليل السفر اليابان,سياحة اليابان,توصيات السفر,مخطط ذكي,الثقافة اليابانية',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/ar`,
    languages: {
      'ja': `${baseUrl}/`,
      'en': `${baseUrl}/en`,
      'fr': `${baseUrl}/fr`,
      'ko': `${baseUrl}/ko`,
      'ar': `${baseUrl}/ar`,
    }
  },
  openGraph: {
    title: 'دليل السفر لليابان | اكتشف اليابان',
    description: 'اكتشف أفضل الأماكن لزيارتها في اليابان مع دليلنا الشامل. تخطيط بالذكاء الاصطناعي، توصيات مخصصة، وتجارب أصيلة.',
    url: `${baseUrl}/ar`,
    siteName: 'Trip App',
    locale: 'ar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دليل السفر لليابان | اكتشف اليابان',
    description: 'اكتشف أفضل الأماكن لزيارتها في اليابان مع دليلنا الشامل. تخطيط بالذكاء الاصطناعي، توصيات مخصصة، وتجارب أصيلة.',
  }
};

export default Home;
