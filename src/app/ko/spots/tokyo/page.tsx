import { Metadata } from 'next';
import TokyoSpotsPage from '@/app/spots/tokyo/page';
import { BASE_URL as baseUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '도쿄 스팟 | 여행 가이드 - 명소, 레스토랑, 호텔',
  description: '최고의 도쿄 스팟을 발견하세요: 관광 명소, 정통 레스토랑, 럭셔리 호텔 및 독특한 경험. 평점과 추천이 포함된 완전한 가이드.',
  keywords: '도쿄 스팟,도쿄 명소,도쿄 레스토랑,도쿄 호텔,도쿄 여행 가이드,도쿄 관광,도쿄 할 일,도쿄 장소,도쿄 경험',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/ko/spots/tokyo`,
    languages: {
      'ja': `${baseUrl}/spots/tokyo`,
      'en': `${baseUrl}/en/spots/tokyo`,
      'fr': `${baseUrl}/fr/spots/tokyo`,
      'ko': `${baseUrl}/ko/spots/tokyo`,
      'ar': `${baseUrl}/ar/spots/tokyo`,
    }
  },
  openGraph: {
    title: '도쿄 스팟 | 여행 가이드 - 명소, 레스토랑, 호텔',
    description: '최고의 도쿄 스팟을 발견하세요: 관광 명소, 정통 레스토랑, 럭셔리 호텔 및 독특한 경험. 평점과 추천이 포함된 완전한 가이드.',
    url: `${baseUrl}/ko/spots/tokyo`,
    siteName: '일본 여행 가이드',
    locale: 'ko',
    type: 'website',
    images: [{
      url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630',
      width: 1200,
      height: 630,
      alt: '도쿄 스팟 - 명소와 경험'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '도쿄 스팟 | 여행 가이드 - 명소, 레스토랑, 호텔',
    description: '최고의 도쿄 스팟을 발견하세요: 관광 명소, 정통 레스토랑, 럭셔리 호텔 및 독특한 경험.',
    images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=630']
  }
};

export default TokyoSpotsPage;
