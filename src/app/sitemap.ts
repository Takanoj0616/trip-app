import { MetadataRoute } from 'next'
import { allRestaurantSpots } from '@/data/tokyo-restaurant-spots'
import { hotelSpots } from '@/data/hotel-spots'
import { kanngouSpots } from '@/data/kankou-spots'
import { tokyoSpots } from '@/data/tokyo-spots'
import { allBookstoreSpots } from '@/data/tokyo-bookstore-spots'
import { tokyoSpotsDetailed } from '@/data/tokyo-spots-detailed'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app'

  const now = new Date()

  // Static top-level pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/areas`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/ai-spots`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/plan`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  // Area pages
  const areaPages: MetadataRoute.Sitemap = ['tokyo', 'yokohama', 'saitama', 'chiba'].map((area) => ({
    url: `${baseUrl}/areas/${area}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // Course IDs (mirrors course detail page data)
  const courseIds = [
    'akihabara-anime',
    'asakusa-traditional',
    'shibuya-modern',
    'tsukiji-gourmet',
    'ueno-museum',
    'harajuku-kawaii',
    'shinjuku-nightlife',
    'odaiba-future',
    'kichijoji-local',
    'roppongi-art',
    'sumida-traditional',
    'daikanyama-sophisticated',
    'imperial-nature',
    'yokohama-port',
    'kamakura-zen',
  ]
  const coursePages: MetadataRoute.Sitemap = courseIds.map((id) => ({
    url: `${baseUrl}/courses/${id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Collect all known spot IDs from datasets
  const spotIdSet = new Set<string>()
  ;[
    ...allRestaurantSpots,
    ...hotelSpots,
    ...kanngouSpots,
    ...tokyoSpots,
    ...allBookstoreSpots,
  ].forEach((s: any) => s?.id && spotIdSet.add(s.id))
  tokyoSpotsDetailed.forEach((s: any) => s?.id && spotIdSet.add(s.id))
  const spotIds = Array.from(spotIdSet)

  // Default (ja) spot pages
  const spotPages: MetadataRoute.Sitemap = spotIds.map((id) => ({
    url: `${baseUrl}/spots/${id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  // Multi-language roots and main lists
  const langs = ['en', 'fr', 'ko', 'ar'] as const
  const languagePages: MetadataRoute.Sitemap = [
    ...langs.map((l) => ({ url: `${baseUrl}/${l}`, lastModified: now, changeFrequency: 'daily', priority: 0.9 })),
    ...langs.map((l) => ({ url: `${baseUrl}/${l}/areas`, lastModified: now, changeFrequency: 'daily', priority: 0.85 })),
    ...langs.map((l) => ({ url: `${baseUrl}/${l}/ai-spots`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 })),
    ...langs.map((l) => ({ url: `${baseUrl}/${l}/ai-plan`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 })),
    ...langs.map((l) => ({ url: `${baseUrl}/${l}/spots/tokyo`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 })),
  ]

  // Localized spot pages
  const internationalSpotPages: MetadataRoute.Sitemap = langs.flatMap((l) =>
    spotIds.map((id) => ({
      url: `${baseUrl}/${l}/spots/${id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  )

  return [
    ...staticPages,
    ...areaPages,
    ...coursePages,
    ...spotPages,
    ...languagePages,
    ...internationalSpotPages,
  ]
}
