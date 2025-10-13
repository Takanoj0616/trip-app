import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Bot対策: 動的レンダリングでSSRを有効化、一般ユーザーは静的生成
  output: 'hybrid',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable optimization for Core Web Vitals
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
    ],
  },
  // Core Web Vitals optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons', 'react-i18next'],
    // If you want CSS inlining, install 'critters' and re-enable below.
    // optimizeCss: true,
    scrollRestoration: true,
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  generateEtags: true,
  reactStrictMode: true,
  // Use Next's default Webpack/Turbopack optimizations (custom splitChunks removed to avoid build issues)
  // Headers for performance and security
  async headers() {
    const isPreview = process.env.VERCEL_ENV === 'preview';
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          ...(isPreview
            ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }]
            : []),
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
