import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app'
  
  // Static pages with SEO-optimized priorities
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/areas`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ai-spots`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/coordinator`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/plan`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Area pages - key tourist destinations with high SEO value
  const areaPages = [
    'tokyo',
    'yokohama', 
    'saitama',
    'chiba'
  ].map(area => ({
    url: `${baseUrl}/areas/${area}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.95, // High priority for main tourist destinations
  }))

  // Course pages - popular tourism routes
  const courseIds = Array.from({ length: 15 }, (_, i) => i + 1)
  const coursePages = courseIds.map(id => ({
    url: `${baseUrl}/courses/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Add dynamic spot pages for better indexing
  const spotPages = [
    'tokyo-tower',
    'asakusa-temple',
    'shibuya-crossing',
    'ginza-district',
    'tokyo-skytree',
    'imperial-palace',
    'meiji-shrine',
    'tsukiji-market',
    'harajuku',
    'roppongi',
    'minato-mirai',
    'yokohama-chinatown',
    'red-brick-warehouse',
    'cosmo-world',
    'kawagoe',
    'chichibu',
    'tokyo-disneyland',
    'narita-san-temple'
  ].map(spot => ({
    url: `${baseUrl}/spots/${spot}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Multi-language versions of main pages for international SEO
  const languagePages = [
    // English (UK) pages
    { url: `${baseUrl}/en`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.95 },
    { url: `${baseUrl}/en/areas`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/en/ai-spots`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${baseUrl}/en/ai-plan`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },

    // French pages
    { url: `${baseUrl}/fr`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.95 },
    { url: `${baseUrl}/fr/areas`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/fr/ai-spots`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${baseUrl}/fr/ai-plan`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },

    // Korean pages
    { url: `${baseUrl}/ko`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/ko/areas`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.85 },
    { url: `${baseUrl}/ko/ai-spots`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/ko/ai-plan`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.75 },

    // Arabic pages
    { url: `${baseUrl}/ar`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/ar/areas`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.75 },
    { url: `${baseUrl}/ar/ai-spots`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/ar/ai-plan`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.65 }
  ]

  // Tokyo area pages for international markets
  const internationalTokyoPages = [
    // English Tokyo pages
    { url: `${baseUrl}/en/spots/tokyo`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },

    // French Tokyo pages
    { url: `${baseUrl}/fr/spots/tokyo`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },

    // Korean Tokyo pages
    { url: `${baseUrl}/ko/spots/tokyo`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },

    // Arabic Tokyo pages
    { url: `${baseUrl}/ar/spots/tokyo`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }
  ]

  // Popular international spot pages for better indexing
  const internationalSpotPages = [
    // Major attractions in multiple languages
    ...['en', 'fr', 'ko', 'ar'].flatMap(lang => [
      { url: `${baseUrl}/${lang}/spots/1`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
      { url: `${baseUrl}/${lang}/spots/2`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
      { url: `${baseUrl}/${lang}/spots/3`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 }
    ])
  ]

  return [...staticPages, ...areaPages, ...coursePages, ...spotPages, ...languagePages, ...internationalTokyoPages, ...internationalSpotPages]
}