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
import { shouldUseSSR } from '@/lib/render-utils';
import { TouristSpot } from '@/types';

const allSpots: TouristSpot[] = [
  ...allRestaurantSpots,
  ...hotelSpots,
  ...kanngouSpots,
  ...tokyoSpots,
  ...allBookstoreSpots,
  ...convertTokyoSpotsToTouristSpots('en'),
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
      title: 'Spot Not Found - Trip App',
    };
  }

  const baseUrl = BASE_URL;
  const canonical = `${baseUrl}/en/spots/${id}`;
  return {
    title: `${spot.name} - Trip App`,
    description: spot.description,
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/spots/${id}`,
        'ja-JP': `${baseUrl}/spots/${id}`,
        'en-GB': canonical,
        'en-US': canonical,
        'fr-FR': `${baseUrl}/fr/spots/${id}`,
        'ko-KR': `${baseUrl}/ko/spots/${id}`,
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

  const baseUrl = BASE_URL;
  const pageUrl = `${baseUrl}/en/spots/${id}`;
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
      { '@type': 'ListItem', position: 2, name: 'Spots', item: `${baseUrl}/en/spots/tokyo` },
      { '@type': 'ListItem', position: 3, name: spot.name, item: pageUrl },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What are the opening hours?', acceptedAnswer: { '@type': 'Answer', text: spot.openingHours ? Object.values(spot.openingHours)[0] : 'Please check the official site.' } },
      { '@type': 'Question', name: 'How much is the ticket/price?', acceptedAnswer: { '@type': 'Answer', text: spot.priceText || 'Varies by time/area.' } },
      { '@type': 'Question', name: 'How to access?', acceptedAnswer: { '@type': 'Answer', text: spot.location?.address || 'See the map link.' } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SuspenseWrapper>
        <MainContent spot={spot} locale="en" />
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
import { BASE_URL } from '@/lib/site';
