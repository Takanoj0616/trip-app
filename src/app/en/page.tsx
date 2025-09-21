import { Metadata } from 'next';
import Home from '@/app/page';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app';

export const metadata: Metadata = {
  title: 'Japan Travel Guide | Discover Japan',
  description: 'Discover the best places to visit in Japan with our comprehensive guide. AI planning, personalized recommendations, and authentic experiences.',
  keywords: 'Japan travel guide,Japan tourism,travel recommendations,AI planner,Japanese culture',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/en`,
    languages: {
      'x-default': `${baseUrl}`,
      'ja-JP': `${baseUrl}/`,
      'en-GB': `${baseUrl}/en`,
      'en-US': `${baseUrl}/en`,
      'fr-FR': `${baseUrl}/fr`,
      'ko-KR': `${baseUrl}/ko`,
      'ar-SA': `${baseUrl}/ar`,
    }
  },
  openGraph: {
    title: 'Japan Travel Guide | Discover Japan',
    description: 'Discover the best places to visit in Japan with our comprehensive guide. AI planning, personalized recommendations, and authentic experiences.',
    url: `${baseUrl}/en`,
    siteName: 'Trip App',
    locale: 'en',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Japan Travel Guide | Discover Japan',
    description: 'Discover the best places to visit in Japan with our comprehensive guide. AI planning, personalized recommendations, and authentic experiences.',
  }
};

export default Home;
