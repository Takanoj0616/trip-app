import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/site'
import { allRestaurantSpots } from '@/data/tokyo-restaurant-spots'
import { hotelSpots } from '@/data/hotel-spots'
import { kanngouSpots } from '@/data/kankou-spots'
import { tokyoSpots } from '@/data/tokyo-spots'
import { allBookstoreSpots } from '@/data/tokyo-bookstore-spots'
import { tokyoSpotsDetailed } from '@/data/tokyo-spots-detailed'

const baseUrl = BASE_URL

export async function GET() {
  const now = new Date()

  const urls: { url: string; lastModified: Date; changeFrequency: string; priority: number }[] = []

  // Static
  ;[
    // Home (all locales)
    `${baseUrl}/`,
    `${baseUrl}/en`,
    `${baseUrl}/fr`,
    `${baseUrl}/ko`,
    `${baseUrl}/ar`,
    // Top level sections (ja)
    `${baseUrl}/areas`,
    `${baseUrl}/plan`,
    `${baseUrl}/ai-spots`,
    `${baseUrl}/ai-plan`,
    `${baseUrl}/courses`,
    `${baseUrl}/spots/tokyo`,
    // Top level sections (localized)
    `${baseUrl}/en/areas`,
    `${baseUrl}/en/ai-spots`,
    `${baseUrl}/en/ai-plan`,
    `${baseUrl}/en/courses`,
    `${baseUrl}/fr/areas`,
    `${baseUrl}/fr/ai-spots`,
    `${baseUrl}/fr/ai-plan`,
    `${baseUrl}/fr/courses`,
    `${baseUrl}/ko/areas`,
    `${baseUrl}/ko/ai-spots`,
    `${baseUrl}/ko/ai-plan`,
    `${baseUrl}/ko/courses`,
  ].forEach((url) => urls.push({ url, lastModified: now, changeFrequency: 'weekly', priority: 0.8 }))

  // Areas
  ;['tokyo', 'yokohama', 'saitama', 'chiba'].forEach((area) =>
    urls.push({ url: `${baseUrl}/areas/${area}`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 })
  )

  // Courses
  ;[
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
  ].forEach((id) =>
    urls.push({ url: `${baseUrl}/courses/${id}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 })
  )

  // Spots (ja) and localized
  const langs = ['en', 'fr', 'ko', 'ar']
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

  spotIds.forEach((id) => urls.push({ url: `${baseUrl}/spots/${id}`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 }))
  langs.forEach((l) => urls.push({ url: `${baseUrl}/${l}/spots/tokyo`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 }))
  // Areas (localized)
  ;['tokyo', 'yokohama', 'saitama', 'chiba'].forEach((area) =>
    langs.forEach((l) => urls.push({ url: `${baseUrl}/${l}/areas/${area}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 }))
  )
  langs.forEach((l) =>
    spotIds.forEach((id) => urls.push({ url: `${baseUrl}/${l}/spots/${id}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 }))
  )

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (page) => `
    <url>
      <loc>${page.url}</loc>
      <lastmod>${page.lastModified.toISOString()}</lastmod>
      <changefreq>${page.changeFrequency}</changefreq>
      <priority>${page.priority.toFixed(2)}</priority>
    </url>`
    )
    .join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
