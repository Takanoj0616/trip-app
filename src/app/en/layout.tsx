import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import "../globals.css";
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
  title: "Japan Travel Guide | Tokyo Tourism & Holidays | Best UK Japan Trip Planner 2025",
  description: "Discover Japan with AI-powered travel planning from the UK. Complete guide to Tokyo, Yokohama, Saitama & Chiba holidays. Hotels, restaurants, attractions & personalised itineraries for your perfect Japan holiday from Britain.",
  keywords: [
    "Japan travel UK", "Japan holidays", "Tokyo travel guide UK", "Japan trip planner Britain",
    "Tokyo attractions from UK", "Japan hotels UK travellers", "Japan restaurants UK", "Yokohama travel Britain",
    "Saitama tourism UK", "Chiba travel Britain", "Japan itinerary UK", "Tokyo sightseeing UK",
    "Japan AI travel UK", "Tokyo hotels UK", "Yokohama attractions Britain", "Japan holidays UK",
    "Tokyo sightseeing tours UK", "Japan travel tips UK", "Tokyo food guide Britain", "Japan rail pass UK",
    "Japanese culture UK", "Japan cherry blossom holidays", "Tokyo Disney UK", "Mount Fuji tours UK",
    "Japan ski holidays", "Japanese onsen UK", "Tokyo shopping UK", "Japan package holidays"
  ],
  authors: [{ name: "Japan Tourism Guide UK" }],
  creator: "Japan Tourism Guide UK",
  publisher: "Japan Tourism Guide UK",
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
    canonical: `${baseUrl}/en`,
    languages: {
      'x-default': `${baseUrl}`,
      'ja': `${baseUrl}/`,
      'en-GB': `${baseUrl}/en`,
      'en-US': `${baseUrl}/en`,
      'fr-FR': `${baseUrl}/fr`,
      'ko-KR': `${baseUrl}/ko`,
      'ar-SA': `${baseUrl}/ar`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    alternateLocale: ['ja_JP', 'fr_FR', 'ko_KR', 'ar_SA', 'en_US'],
    url: `${baseUrl}/en`,
    title: "Japan Travel Guide | Tokyo Tourism & Holidays | Best UK Japan Trip Planner 2025",
    description: "Discover Japan with AI-powered travel planning from the UK. Complete guide to Tokyo, Yokohama, Saitama & Chiba holidays. Hotels, restaurants, attractions & personalised itineraries for your perfect Japan holiday from Britain.",
    siteName: "Japan Travel Guide UK",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Japan Travel Guide UK - AI-Powered Japan Holiday Planner for UK Travellers",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@japantravelguideuk',
    creator: '@japantravelguideuk',
    title: "Japan Travel Guide | Tokyo Tourism & Holidays | Best UK Japan Trip Planner 2025",
    description: "Discover Japan with AI-powered travel planning from the UK. Complete guide to Tokyo, Yokohama, Saitama & Chiba holidays.",
    images: [`${baseUrl}/twitter-image`],
  },
  verification: {
    google: 'your-google-verification-code-uk',
    other: {
      'msvalidate.01': 'your-bing-verification-code-uk',
    },
  },
  category: 'travel',
};

const structuredDataEN = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Japan Travel Guide UK",
  "alternateName": ["Japan Tourism Guide", "UK Japan Travel"],
  "description": "AI-powered Japan travel planning for UK travellers. Discover Tokyo, Yokohama, Saitama & Chiba with personalised itineraries, hotel recommendations, and restaurant guides.",
  "url": `${baseUrl}/en`,
  "logo": `${baseUrl}/icon`,
  "image": `${baseUrl}/opengraph-image`,
  "inLanguage": "en-GB",
  "sameAs": [
    "https://twitter.com/japantravelguideuk",
    "https://www.facebook.com/japantravelguideuk",
    "https://www.instagram.com/japantravelguideuk"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["English", "Japanese", "French", "Korean", "Arabic"]
  },
  "areaServed": [
    { "@type": "Country", "name": "United Kingdom" },
    { "@type": "Country", "name": "Japan" },
    { "@type": "Country", "name": "Ireland" },
    { "@type": "Country", "name": "Australia" },
    { "@type": "Country", "name": "New Zealand" }
  ],
  "serviceType": "Travel Planning",
  "priceRange": "Free",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "850"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Japan Travel Services for UK",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Travel Planning",
          "description": "Personalised Japan holiday planning with AI technology for UK travellers"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Tokyo Tourism Guide",
          "description": "Complete Tokyo travel information and recommendations for UK holidaymakers"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Hotel Recommendations",
          "description": "Curated hotel selections for Japan holidays from the UK"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Restaurant Guide",
          "description": "Best restaurants and dining recommendations in Japan for UK visitors"
        }
      }
    ]
  }
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="structured-data-en"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredDataEN),
        }}
      />
      {children}
    </>
  );
}