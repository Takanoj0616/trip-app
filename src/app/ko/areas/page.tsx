import { Metadata } from 'next';
import AreasPage from '@/app/areas/page';
import { BASE_URL as baseUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '일본 지역 | 여행 가이드 - 도쿄, 요코하마, 사이타마, 치바',
  description: '일본 최고의 지역을 발견하세요: 수도권 도쿄, 요코하마, 사이타마, 치바. 상세한 가이드, 평점 및 여행 추천.',
  keywords: '일본 지역,도쿄 구역,요코하마 관광,사이타마 여행,치바 명소,도쿄 수도권,일본 여행 가이드',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/ko/areas`,
    languages: {
      'ja': `${baseUrl}/areas`,
      'en': `${baseUrl}/en/areas`,
      'fr': `${baseUrl}/fr/areas`,
      'ko': `${baseUrl}/ko/areas`,
      'ar': `${baseUrl}/ar/areas`,
    }
  },
  openGraph: {
    title: '일본 지역 | 여행 가이드 - 도쿄, 요코하마, 사이타마, 치바',
    description: '일본 최고의 지역을 발견하세요: 수도권 도쿄, 요코하마, 사이타마, 치바. 상세한 가이드, 평점 및 여행 추천.',
    url: `${baseUrl}/ko/areas`,
    siteName: '일본 여행 가이드',
    locale: 'ko',
    type: 'website',
    images: [{
      url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630',
      width: 1200,
      height: 630,
      alt: '일본 지역 - 도쿄, 요코하마, 사이타마, 치바'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '일본 지역 | 여행 가이드 - 도쿄, 요코하마, 사이타마, 치바',
    description: '일본 최고의 지역을 발견하세요: 수도권 도쿄, 요코하마, 사이타마, 치바.',
    images: ['https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630']
  }
};

export default AreasPage;
