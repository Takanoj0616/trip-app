import AISpotsPage from '@/app/ai-spots/page';
import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app';

export const metadata: Metadata = {
  title: 'AI Spot Recommendations | Create Your Perfect Travel Plan',
  description: 'AI-powered recommendations for your perfect Japan travel experience. Get personalized spot recommendations based on your interests, budget, and travel duration.',
  keywords: 'AI travel planner,tourist spots,Japan travel,personalized itinerary,travel recommendations',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/en/ai-spots`,
    languages: {
      'x-default': `${baseUrl}/ai-spots`,
      'ja-JP': `${baseUrl}/ai-spots`,
      'en-GB': `${baseUrl}/en/ai-spots`,
      'en-US': `${baseUrl}/en/ai-spots`,
      'fr-FR': `${baseUrl}/fr/ai-spots`,
      'ko-KR': `${baseUrl}/ko/ai-spots`,
      'ar-SA': `${baseUrl}/ar/ai-spots`,
    }
  },
  openGraph: {
    title: 'AI Spot Recommendations | Create Your Perfect Travel Plan',
    description: 'AI-powered recommendations for your perfect Japan travel experience. Get personalized spot recommendations based on your interests, budget, and travel duration.',
    url: `${baseUrl}/en/ai-spots`,
    siteName: 'Trip App',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spot Recommendations | Create Your Perfect Travel Plan',
    description: 'AI-powered recommendations for your perfect Japan travel experience. Get personalized spot recommendations based on your interests, budget, and travel duration.',
  }
};

export default AISpotsPage;
