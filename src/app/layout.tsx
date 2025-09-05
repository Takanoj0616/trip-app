import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/Header";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Japan Travel Guide | Tokyo Tourism | Best Japan Trip Planner 2025",
  description: "Discover Japan with AI-powered travel planning. Complete guide to Tokyo, Yokohama, Saitama & Chiba tourism. Hotels, restaurants, attractions & personalized itineraries for your perfect Japan trip.",
  keywords: [
    "Japan travel", "Japan tourism", "Tokyo travel guide", "Japan trip planner", 
    "Tokyo attractions", "Japan hotels", "Japan restaurants", "Yokohama travel", 
    "Saitama tourism", "Chiba travel", "Japan itinerary", "Tokyo sightseeing",
    "Japan AI travel", "Tokyo hotels", "Yokohama attractions", "Japan vacation",
    "Tokyo sightseeing tour", "Japan travel tips", "Tokyo food guide"
  ],
  authors: [{ name: "Japan Tourism Guide" }],
  creator: "Japan Tourism Guide",
  publisher: "Japan Tourism Guide",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': `${baseUrl}/en`,
      'ja-JP': `${baseUrl}/ja`,
      'ko-KR': `${baseUrl}/ko`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: "Japan Travel Guide | Tokyo Tourism | Best Japan Trip Planner 2025",
    description: "Discover Japan with AI-powered travel planning. Complete guide to Tokyo, Yokohama, Saitama & Chiba tourism. Hotels, restaurants, attractions & personalized itineraries.",
    siteName: "Japan Travel Guide",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Japan Travel Guide - AI-Powered Japan Trip Planner",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@japantravelguide',
    creator: '@japantravelguide',
    title: "Japan Travel Guide | Tokyo Tourism | Best Japan Trip Planner 2025",
    description: "Discover Japan with AI-powered travel planning. Complete guide to Tokyo, Yokohama, Saitama & Chiba tourism.",
    images: [`${baseUrl}/twitter-image`],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/manifest.json',
  category: 'travel',
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Japan Travel Guide",
  "alternateName": "Japan Tourism Guide",
  "description": "AI-powered Japan travel planning and tourism guide. Discover Tokyo, Yokohama, Saitama & Chiba with personalized itineraries, hotel recommendations, and restaurant guides.",
  "url": baseUrl,
  "logo": `${baseUrl}/icon`,
  "image": `${baseUrl}/opengraph-image`,
  "sameAs": [
    "https://twitter.com/japantravelguide",
    "https://www.facebook.com/japantravelguide",
    "https://www.instagram.com/japantravelguide"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["English", "Japanese", "Korean"]
  },
  "areaServed": [
    { "@type": "Country", "name": "Japan" },
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "South Korea" },
    { "@type": "Country", "name": "Australia" }
  ],
  "serviceType": "Travel Planning",
  "priceRange": "Free",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Japan Travel Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Travel Planning",
          "description": "Personalized Japan itinerary creation with AI technology"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Tokyo Tourism Guide",
          "description": "Complete Tokyo travel information and recommendations"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Hotel Recommendations",
          "description": "Curated hotel selections for Japan travel"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Restaurant Guide",
          "description": "Best restaurants and dining recommendations in Japan"
        }
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E5ZZN1NNE9"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E5ZZN1NNE9', {
                page_title: document.title,
                page_location: window.location.href
              });
            `,
          }}
        />
        <Script
          id="schema-breadcrumb"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": baseUrl
                }
              ]
            })
          }}
        />
        <ClientProviders>
          <Header />
          <main>
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}


