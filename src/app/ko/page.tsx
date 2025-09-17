import { Metadata } from 'next';
import Home from '@/app/page';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  title: '일본 여행 가이드 | 일본 탐험',
  description: '포괄적인 가이드로 일본에서 방문할 최고의 장소를 발견하세요. AI 플래닝, 맞춤형 추천, 진정한 경험.',
  keywords: '일본 여행 가이드,일본 관광,여행 추천,AI 플래너,일본 문화',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/ko`,
    languages: {
      'ja': `${baseUrl}/`,
      'en': `${baseUrl}/en`,
      'fr': `${baseUrl}/fr`,
      'ko': `${baseUrl}/ko`,
      'ar': `${baseUrl}/ar`,
    }
  },
  openGraph: {
    title: '일본 여행 가이드 | 일본 탐험',
    description: '포괄적인 가이드로 일본에서 방문할 최고의 장소를 발견하세요. AI 플래닝, 맞춤형 추천, 진정한 경험.',
    url: `${baseUrl}/ko`,
    siteName: 'Trip App',
    locale: 'ko',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '일본 여행 가이드 | 일본 탐험',
    description: '포괄적인 가이드로 일본에서 방문할 최고의 장소를 발견하세요. AI 플래닝, 맞춤형 추천, 진정한 경험.',
  }
};

export default Home;