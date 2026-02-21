import { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/site'
import { buildSitemapEntries } from '@/lib/sitemap-data'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries(BASE_URL).map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }))
}
