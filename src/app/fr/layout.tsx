import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import "../globals.css";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/Header";
import Script from "next/script";
import { BASE_URL as baseUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// baseUrl centralized via lib/site

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Guide Voyage Japon | Tourisme Tokyo & Vacances | Planificateur Japon France 2025",
  description: "Découvrez le Japon avec la planification IA depuis la France. Guide complet de Tokyo, Yokohama, Saitama & Chiba. Hôtels, restaurants, attractions et itinéraires personnalisés pour vos vacances parfaites au Japon depuis la France.",
  keywords: [
    "voyage japon france", "vacances japon", "guide tokyo france", "planificateur voyage japon",
    "attractions tokyo france", "hôtels japon français", "restaurants japon france", "voyage yokohama",
    "tourisme saitama france", "voyage chiba", "itinéraire japon france", "visite tokyo",
    "IA voyage japon", "vacances japon france", "séjour tokyo", "voyage organisé japon",
    "culture japonaise france", "cerisiers en fleurs japon", "tokyo disney france", "mont fuji tours",
    "onsen japonais", "shopping tokyo", "gastronomie japonaise", "ryokan japon",
    "JR Pass france", "visa japon france", "voyage de noces japon", "circuit japon",
    "temples japonais", "manga culture japon", "sushi authentique tokyo"
  ],
  authors: [{ name: "Guide Voyage Japon France" }],
  creator: "Guide Voyage Japon France",
  publisher: "Guide Voyage Japon France",
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
    canonical: `${baseUrl}/fr`,
    languages: {
      'x-default': `${baseUrl}`,
      'ja-JP': `${baseUrl}/`,
      'en-GB': `${baseUrl}/en`,
      'en-US': `${baseUrl}/en`,
      'fr-FR': `${baseUrl}/fr`,
      'ko-KR': `${baseUrl}/ko`,
      'ar-SA': `${baseUrl}/ar`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['ja_JP', 'en_GB', 'en_US', 'ko_KR', 'ar_SA'],
    url: `${baseUrl}/fr`,
    title: "Guide Voyage Japon | Tourisme Tokyo & Vacances | Planificateur Japon France 2025",
    description: "Découvrez le Japon avec la planification IA depuis la France. Guide complet de Tokyo, Yokohama, Saitama & Chiba. Hôtels, restaurants, attractions et itinéraires personnalisés pour vos vacances parfaites au Japon.",
    siteName: "Guide Voyage Japon France",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Guide Voyage Japon France - Planificateur IA pour les vacances au Japon",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@voyagejapon_fr',
    creator: '@voyagejapon_fr',
    title: "Guide Voyage Japon | Tourisme Tokyo & Vacances | Planificateur Japon France 2025",
    description: "Découvrez le Japon avec la planification IA depuis la France. Guide complet de Tokyo, Yokohama, Saitama & Chiba.",
    images: [`${baseUrl}/twitter-image`],
  },
  verification: {
    google: 'your-google-verification-code-fr',
    other: {
      'msvalidate.01': 'your-bing-verification-code-fr',
    },
  },
  category: 'voyage',
};

const structuredDataFR = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Guide Voyage Japon France",
  "alternateName": ["Guide Tourisme Japon", "Voyage Japon France"],
  "description": "Planification de voyage au Japon alimentée par l'IA pour les voyageurs français. Découvrez Tokyo, Yokohama, Saitama et Chiba avec des itinéraires personnalisés, recommandations d'hôtels et guides de restaurants.",
  "url": `${baseUrl}/fr`,
  "logo": `${baseUrl}/icon`,
  "image": `${baseUrl}/opengraph-image`,
  "inLanguage": "fr-FR",
  "sameAs": [
    "https://twitter.com/voyagejapon_fr",
    "https://www.facebook.com/guidevoyagejapon",
    "https://www.instagram.com/voyagejapon_france"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "service client",
    "availableLanguage": ["Français", "Japonais", "Anglais", "Coréen", "Arabe"]
  },
  "areaServed": [
    { "@type": "Country", "name": "France" },
    { "@type": "Country", "name": "Japon" },
    { "@type": "Country", "name": "Belgique" },
    { "@type": "Country", "name": "Suisse" },
    { "@type": "Country", "name": "Canada" }
  ],
  "serviceType": "Planification de voyage",
  "priceRange": "Gratuit",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "650"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services Voyage Japon pour la France",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Planification IA de voyage",
          "description": "Planification personnalisée de vacances au Japon avec technologie IA pour les voyageurs français"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Guide Tourisme Tokyo",
          "description": "Informations complètes de voyage à Tokyo et recommandations pour les vacanciers français"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Recommandations d'hôtels",
          "description": "Sélections d'hôtels curées pour les vacances au Japon depuis la France"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Guide restaurants",
          "description": "Meilleurs restaurants et recommandations culinaires au Japon pour les visiteurs français"
        }
      }
    ]
  }
};

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="structured-data-fr"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredDataFR),
        }}
      />
      {children}
    </>
  );
}
