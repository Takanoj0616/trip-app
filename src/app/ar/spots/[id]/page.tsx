import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import MainContent from '@/app/spots/[id]/MainContent';
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
  ...convertTokyoSpotsToTouristSpots('ar'),
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
      title: 'لم يتم العثور على المكان - Trip App',
    };
  }

  return {
    title: `${spot.name} - Trip App`,
    description: spot.description,
  };
}

export default async function SpotDetailPage({ params }: Props) {
  const { id } = await params;
  const spot = allSpots.find((s) => s.id === id);

  if (!spot) {
    notFound();
  }

  return <MainContent spot={spot} locale="ar" />;
}

export async function generateStaticParams() {
  return allSpots.map((spot) => ({
    id: spot.id,
  }));
}