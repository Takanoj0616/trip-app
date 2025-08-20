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

  return [...staticPages, ...areaPages, ...coursePages, ...spotPages]
}