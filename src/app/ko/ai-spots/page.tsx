import AISpotsPage from '@/app/ai-spots/page';
import { Metadata } from 'next';
import { BASE_URL as baseUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'AI 추천 명소 | 완벽한 여행 계획 만들기',
  description: 'AI가 추천하는 완벽한 일본 여행 경험. 관심사, 예산, 여행 기간에 따른 개인 맞춤형 명소 추천을 받아보세요.',
  keywords: 'AI 여행 플래너,관광지,일본 여행,개인 맞춤 일정,여행 추천',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/ko/ai-spots`,
    languages: {
      'ja': `${baseUrl}/ai-spots`,
      'en': `${baseUrl}/en/ai-spots`,
      'fr': `${baseUrl}/fr/ai-spots`,
      'ko': `${baseUrl}/ko/ai-spots`,
      'ar': `${baseUrl}/ar/ai-spots`,
    }
  },
  openGraph: {
    title: 'AI 추천 명소 | 완벽한 여행 계획 만들기',
    description: 'AI가 추천하는 완벽한 일본 여행 경험. 관심사, 예산, 여행 기간에 따른 개인 맞춤형 명소 추천을 받아보세요.',
    url: `${baseUrl}/ko/ai-spots`,
    siteName: 'Trip App',
    locale: 'ko',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 추천 명소 | 완벽한 여행 계획 만들기',
    description: 'AI가 추천하는 완벽한 일본 여행 경험. 관심사, 예산, 여행 기간에 따른 개인 맞춤형 명소 추천을 받아보세요.',
  }
};

export default AISpotsPage;
