import { allRestaurantSpots } from '@/data/tokyo-restaurant-spots';
import { hotelSpots } from '@/data/hotel-spots';
import { kanngouSpots } from '@/data/kankou-spots';
import { tokyoSpots } from '@/data/tokyo-spots';
import { allBookstoreSpots } from '@/data/tokyo-bookstore-spots';
import { tokyoSpotsDetailed } from '@/data/tokyo-spots-detailed';

type ChangeFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'always' | 'hourly' | 'never';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

const LOCALIZED_LOCALES = ['en', 'fr', 'ko', 'ar'] as const;

const JA_STATIC_PATHS = [
  '/',
  '/about',
  '/areas',
  '/ai-spots',
  '/ai-plan',
  '/courses',
  '/discover',
  '/qna',
  '/realtime',
  '/stories',
  '/travel-experiences',
  '/spots/tokyo',
] as const;

const LOCALIZED_STATIC_PATHS = [
  '/',
  '/areas',
  '/ai-spots',
  '/ai-plan',
  '/spots/tokyo',
] as const;

function readSpotId(item: unknown): string | null {
  if (typeof item !== 'object' || item === null || !('id' in item)) return null;
  const id = (item as { id?: unknown }).id;
  if (typeof id !== 'string') return null;
  const trimmed = id.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function collectSpotIds(): string[] {
  const spotIdSet = new Set<string>();
  const datasets: unknown[] = [
    ...allRestaurantSpots,
    ...hotelSpots,
    ...kanngouSpots,
    ...tokyoSpots,
    ...allBookstoreSpots,
    ...tokyoSpotsDetailed,
  ];

  for (const item of datasets) {
    const id = readSpotId(item);
    if (id) spotIdSet.add(id);
  }

  return Array.from(spotIdSet).sort();
}

export function buildSitemapEntries(baseUrl: string): SitemapEntry[] {
  const now = new Date();
  const entries: SitemapEntry[] = [];
  const add = (path: string, changeFrequency: ChangeFrequency, priority: number) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    entries.push({
      url: `${baseUrl}${normalizedPath === '/' ? '' : normalizedPath}`,
      lastModified: now,
      changeFrequency,
      priority,
    });
  };

  for (const path of JA_STATIC_PATHS) {
    const changeFrequency: ChangeFrequency = path === '/' || path === '/areas' ? 'daily' : 'weekly';
    const priority = path === '/' ? 1 : path === '/areas' ? 0.95 : 0.85;
    add(path, changeFrequency, priority);
  }

  for (const locale of LOCALIZED_LOCALES) {
    for (const path of LOCALIZED_STATIC_PATHS) {
      const localizedPath = path === '/' ? `/${locale}` : `/${locale}${path}`;
      const changeFrequency: ChangeFrequency = path === '/' || path === '/areas' ? 'daily' : 'weekly';
      const priority = path === '/' ? 0.9 : path === '/areas' ? 0.85 : 0.8;
      add(localizedPath, changeFrequency, priority);
    }
  }

  const spotIds = collectSpotIds();
  for (const id of spotIds) {
    add(`/spots/${id}`, 'monthly', 0.75);
    for (const locale of LOCALIZED_LOCALES) {
      add(`/${locale}/spots/${id}`, 'monthly', 0.7);
    }
  }

  const uniqueByUrl = new Map<string, SitemapEntry>();
  for (const entry of entries) uniqueByUrl.set(entry.url, entry);
  return Array.from(uniqueByUrl.values());
}
