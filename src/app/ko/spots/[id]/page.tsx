import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import MainContent from '@/app/spots/[id]/MainContent';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import { allRestaurantSpots } from '@/data/tokyo-restaurant-spots';
import { hotelSpots } from '@/data/hotel-spots';
import { kanngouSpots } from '@/data/kankou-spots';
import { tokyoSpots } from '@/data/tokyo-spots';
import { allBookstoreSpots } from '@/data/tokyo-bookstore-spots';
import { convertTokyoSpotsToTouristSpots } from '@/utils/convertTokyoSpots';
import { TouristSpot } from '@/types';
import { shouldUseSSR } from '@/lib/render-utils';

const allSpots: TouristSpot[] = [
  ...allRestaurantSpots,
  ...hotelSpots,
  ...kanngouSpots,
  ...tokyoSpots,
  ...allBookstoreSpots,
  ...convertTokyoSpotsToTouristSpots('ko'),
];

interface Props {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const spot = allSpots.find((s) => s.id === id);

  if (!spot) {
    return {
      title: '스팟을 찾을 수 없습니다 - Trip App',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app';
  const canonical = `${baseUrl}/ko/spots/${id}`;
  return {
    title: `${spot.name} - Trip App`,
    description: spot.description,
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/spots/${id}`,
        'ja-JP': `${baseUrl}/spots/${id}`,
        'en-GB': `${baseUrl}/en/spots/${id}`,
        'en-US': `${baseUrl}/en/spots/${id}`,
        'fr-FR': `${baseUrl}/fr/spots/${id}`,
        'ko-KR': canonical,
        'ar-SA': `${baseUrl}/ar/spots/${id}`,
      },
    },
    openGraph: {
      url: canonical,
      images: [`/spots/${id}/opengraph-image`],
      title: `${spot.name} - Trip App`,
      description: spot.description,
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/spots/${id}/opengraph-image`],
      title: `${spot.name} - Trip App`,
      description: spot.description,
    },
  };
}

export default async function SpotDetailPage({ params }: Props) {
  const { id } = await params;

  // Bot判定によるSSR/SSG切り分け
  const useSSR = await shouldUseSSR();

  // Bot以外で静的生成が無効な場合は動的レンダリングを強制
  if (useSSR) {
    // Bot対策: headers()を呼び出すことで動的レンダリングを強制
    const headersList = await headers();
  }

  const spot = allSpots.find((s) => s.id === id);

  if (!spot) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app';
  const pageUrl = `${baseUrl}/ko/spots/${id}`;
  const attractionSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: spot.name,
    description: spot.description,
    image: spot.images?.[0] ? (spot.images[0].startsWith('http') ? spot.images[0] : `${baseUrl}${spot.images[0]}`) : undefined,
    url: pageUrl,
    address: spot.location?.address ? { '@type': 'PostalAddress', streetAddress: spot.location.address, addressLocality: 'Tokyo', addressCountry: 'JP' } : undefined,
    geo: spot.location?.lat && spot.location?.lng ? { '@type': 'GeoCoordinates', latitude: spot.location.lat, longitude: spot.location.lng } : undefined,
    aggregateRating: typeof spot.rating === 'number' ? { '@type': 'AggregateRating', ratingValue: spot.rating, reviewCount: spot.reviewCount || 10, bestRating: 5, worstRating: 1 } : undefined,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Spots', item: `${baseUrl}/ko/spots/tokyo` },
      { '@type': 'ListItem', position: 3, name: spot.name, item: pageUrl },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: '영업시간은 어떻게 되나요?', acceptedAnswer: { '@type': 'Answer', text: spot.openingHours ? Object.values(spot.openingHours)[0] : '공식 사이트를 확인해 주세요.' } },
      { '@type': 'Question', name: '요금/입장료는 얼마인가요?', acceptedAnswer: { '@type': 'Answer', text: spot.priceText || '시간/구역에 따라 상이합니다.' } },
      { '@type': 'Question', name: '오시는 길은?', acceptedAnswer: { '@type': 'Answer', text: spot.location?.address || '지도 링크를 확인하세요.' } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SuspenseWrapper>
        <MainContent spot={spot} locale="ko" />
      </SuspenseWrapper>
    </>
  );
}

export async function generateStaticParams() {
  // 人気のスポットのみ事前生成（例：最初の20件）
  // 残りはISRでオンデマンド生成
  return allSpots.slice(0, 20).map((spot) => ({
    id: spot.id,
  }));
}
