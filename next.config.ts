import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Production is served as a static site/CDN where Next's image optimizer route
    // (`/_next/image`) may not be available. Disable optimization to avoid 404 and delays.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Allow any additional CDN/image hosts if used in content
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
  // Disable caching in development
  ...(process.env.NODE_ENV === 'development' && {
    assetPrefix: '',
    generateEtags: false,
  }),
};

export default nextConfig;
