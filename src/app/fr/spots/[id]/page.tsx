import { notFound } from 'next/navigation';
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

const allSpots: TouristSpot[] = [
  ...allRestaurantSpots,
  ...hotelSpots,
  ...kanngouSpots,
  ...tokyoSpots,
  ...allBookstoreSpots,
  ...convertTokyoSpotsToTouristSpots('fr'),
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
      title: 'Lieu non trouvé - Trip App',
    };
  }

  return {
    title: `${spot.name} - Trip App`,
    description: spot.description,
    openGraph: {
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
  const spot = allSpots.find((s) => s.id === id);

  if (!spot) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app';
  const pageUrl = `${baseUrl}/fr/spots/${id}`;
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
      { '@type': 'ListItem', position: 2, name: 'Spots', item: `${baseUrl}/fr/spots/tokyo` },
      { '@type': 'ListItem', position: 3, name: spot.name, item: pageUrl },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Quels sont les horaires ?', acceptedAnswer: { '@type': 'Answer', text: spot.openingHours ? Object.values(spot.openingHours)[0] : 'Veuillez consulter le site officiel.' } },
      { '@type': 'Question', name: 'Quel est le tarif ?', acceptedAnswer: { '@type': 'Answer', text: spot.priceText || 'Variable selon l’horaire/la zone.' } },
      { '@type': 'Question', name: 'Comment y accéder ?', acceptedAnswer: { '@type': 'Answer', text: spot.location?.address || 'Voir le lien cartographique.' } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SuspenseWrapper>
        <MainContent spot={spot} locale="fr" />
      </SuspenseWrapper>
    </>
  );
}

export async function generateStaticParams() {
  return allSpots.map((spot) => ({
    id: spot.id,
  }));
}
