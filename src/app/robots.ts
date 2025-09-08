import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap`,
    ],
    host: baseUrl,
  }
}

