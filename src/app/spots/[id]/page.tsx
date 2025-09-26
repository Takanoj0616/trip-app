import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import type { Metadata } from 'next';
import { allRestaurantSpots } from '@/data/tokyo-restaurant-spots';
import { hotelSpots } from '@/data/hotel-spots';
import { kanngouSpots } from '@/data/kankou-spots';
import { tokyoSpots } from '@/data/tokyo-spots';
import { allBookstoreSpots } from '@/data/tokyo-bookstore-spots';
import { shouldUseSSR } from '@/lib/render-utils';

import MainContent from './MainContent';

interface SpotPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SpotPage({ params, searchParams }: SpotPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const language = resolvedSearchParams.lang as string;
  const currency = resolvedSearchParams.currency as string;
  const unit = resolvedSearchParams.unit as string;

  // Bot判定によるSSR/SSG切り分け
  const useSSR = await shouldUseSSR();

  // Bot以外で静的生成が無効な場合は動的レンダリングを強制
  if (useSSR) {
    // Bot対策: headers()を呼び出すことで動的レンダリングを強制
    const headersList = await headers();
  }

  // 言語が指定されている場合は適切なパスにリダイレクト
  if (language && language !== 'ja') {
    redirect(`/${language}/spots/${id}`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app'
  const datasets: any[] = [
    ...allRestaurantSpots,
    ...hotelSpots,
    ...kanngouSpots,
    ...tokyoSpots,
    ...allBookstoreSpots,
  ]
  const spot = datasets.find((s) => s.id === id)

  const pageUrl = `${baseUrl}/spots/${id}`
  const attractionSchema = spot
    ? {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: spot.name,
        description: spot.description,
        image: spot.images?.[0]
          ? (spot.images[0].startsWith('http') ? spot.images[0] : `${baseUrl}${spot.images[0]}`)
          : undefined,
        url: pageUrl,
        address: spot.location?.address
          ? { '@type': 'PostalAddress', streetAddress: spot.location.address, addressLocality: '東京', addressCountry: 'JP' }
          : undefined,
        geo: spot.location?.lat && spot.location?.lng
          ? { '@type': 'GeoCoordinates', latitude: spot.location.lat, longitude: spot.location.lng }
          : undefined,
        aggregateRating: typeof spot.rating === 'number'
          ? { '@type': 'AggregateRating', ratingValue: spot.rating, reviewCount: spot.reviewCount || 10, bestRating: 5, worstRating: 1 }
          : undefined,
      }
    : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Spots', item: `${baseUrl}/spots/tokyo` },
      { '@type': 'ListItem', position: 3, name: spot?.name || 'Spot', item: pageUrl },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: '営業時間は？', acceptedAnswer: { '@type': 'Answer', text: spot?.openingHours ? Object.values(spot.openingHours)[0] : '公式サイトをご確認ください。' } },
      { '@type': 'Question', name: '料金はいくら？', acceptedAnswer: { '@type': 'Answer', text: spot?.priceText || '時間帯やエリアにより異なります。' } },
      { '@type': 'Question', name: 'アクセス方法は？', acceptedAnswer: { '@type': 'Answer', text: spot?.location?.address || '地図リンクをご確認ください。' } },
    ],
  }

  return (
    <>
      {attractionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SuspenseWrapper>
        <MainContent
          spotId={id}
          locale={language || 'ja'}
          language={language}
          currency={currency}
          unit={unit}
        />
      </SuspenseWrapper>
    </>
  );
}

// SSG用の静的パス生成（ユーザー向けの事前生成）
export async function generateStaticParams() {
  const allSpots = [
    ...allRestaurantSpots,
    ...hotelSpots,
    ...kanngouSpots,
    ...tokyoSpots,
    ...allBookstoreSpots,
  ];

  // 人気のスポットのみ事前生成（例：最初の20件）
  // 残りはISRでオンデマンド生成
  return allSpots.slice(0, 20).map((spot: any) => ({
    id: spot.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const spot = [
    ...allRestaurantSpots,
    ...hotelSpots,
    ...kanngouSpots,
    ...tokyoSpots,
    ...allBookstoreSpots,
  ].find((s) => s.id === id) as any

  const title = spot?.name ? `${spot.name} | 観光スポット詳細` : '観光スポット詳細'
  const description = spot?.description || '観光スポットの詳細情報。営業時間、料金、アクセス、口コミなど観光に必要な情報をまとめています。'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app'
  const canonical = `${baseUrl}/spots/${id}`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'x-default': canonical,
        'ja-JP': canonical,
        'en-GB': `${baseUrl}/en/spots/${id}`,
        'en-US': `${baseUrl}/en/spots/${id}`,
        'fr-FR': `${baseUrl}/fr/spots/${id}`,
        'ko-KR': `${baseUrl}/ko/spots/${id}`,
        'ar-SA': `${baseUrl}/ar/spots/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [`/spots/${id}/opengraph-image`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/spots/${id}/opengraph-image`],
    },
  }
}
