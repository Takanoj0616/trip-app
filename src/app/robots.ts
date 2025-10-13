import { MetadataRoute } from 'next'
import { BASE_URL, IS_PREVIEW } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  if (IS_PREVIEW) {
    // Prevent preview deployments from being indexed
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/register'],
      },
    ],
    sitemap: [`${BASE_URL}/sitemap.xml`],
    host: BASE_URL,
  }
}
