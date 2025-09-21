import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import { headers } from "next/headers";
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
  title: "日本旅行ガイド | 東京観光 | AI旅行プランナー 2025年版",
  description: "AI搭載の旅行プランニングで日本を発見しよう。東京・横浜・埼玉・千葉の完全観光ガイド。ホテル・レストラン・観光スポット・オーダーメイド旅行プランで完璧な日本旅行を。",
  keywords: [
    "日本旅行", "日本観光", "東京旅行ガイド", "日本旅行プランナー",
    "東京観光スポット", "日本ホテル", "日本レストラン", "横浜旅行",
    "埼玉観光", "千葉旅行", "日本旅行プラン", "東京観光",
    "AI旅行プランニング", "東京ホテル", "横浜観光スポット", "日本旅行",
    "東京観光ツアー", "日本旅行のコツ", "東京グルメガイド", "温泉旅行",
    "桜の名所", "紅葉スポット", "神社仏閣", "日本文化体験",
    "東京ディズニーランド", "富士山ツアー", "スキー場", "日本の祭り",
    "着物レンタル", "寿司体験", "日本料理", "旅館予約"
  ],
  authors: [{ name: "日本旅行ガイド" }],
  creator: "日本旅行ガイド",
  publisher: "日本旅行ガイド",
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
    locale: 'ja_JP',
    alternateLocale: ['en_GB', 'en_US', 'fr_FR', 'ko_KR', 'ar_SA'],
    url: baseUrl,
    title: "日本旅行ガイド | 東京観光 | AI旅行プランナー 2025年版",
    description: "AI搭載の旅行プランニングで日本を発見しよう。東京・横浜・埼玉・千葉の完全観光ガイド。ホテル・レストラン・観光スポット・オーダーメイド旅行プランで完璧な日本旅行を。",
    siteName: "日本旅行ガイド",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "日本旅行ガイド - AI搭載日本旅行プランナー",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@japan_travel_jp',
    creator: '@japan_travel_jp',
    title: "日本旅行ガイド | 東京観光 | AI旅行プランナー 2025年版",
    description: "AI搭載の旅行プランニングで日本を発見しよう。東京・横浜・埼玉・千葉の完全観光ガイド。",
    images: [`${baseUrl}/twitter-image`],
  },
  verification: {
    google: 'your-google-verification-code-jp',
    yahoo: 'your-yahoo-verification-code-jp',
    other: {
      'msvalidate.01': 'your-bing-verification-code-jp',
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
  "name": "日本旅行ガイド",
  "alternateName": ["Japan Travel Guide", "日本観光ガイド"],
  "description": "AI搭載の日本旅行プランニングと観光ガイド。東京・横浜・埼玉・千葉のオーダーメイド旅行プラン、ホテル推薦、レストランガイドで日本を発見しよう。",
  "url": baseUrl,
  "logo": `${baseUrl}/icon`,
  "image": `${baseUrl}/opengraph-image`,
  "inLanguage": "ja",
  "sameAs": [
    "https://twitter.com/japan_travel_jp",
    "https://www.facebook.com/japantravelguide",
    "https://www.instagram.com/japantravelguide"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "カスタマーサービス",
    "availableLanguage": ["日本語", "English", "Français", "한국어", "العربية"]
  },
  "areaServed": [
    { "@type": "Country", "name": "日本" },
    { "@type": "Country", "name": "アメリカ" },
    { "@type": "Country", "name": "イギリス" },
    { "@type": "Country", "name": "フランス" },
    { "@type": "Country", "name": "韓国" },
    { "@type": "Country", "name": "オーストラリア" }
  ],
  "serviceType": "旅行プランニング",
  "priceRange": "無料",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "日本旅行サービス",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI旅行プランニング",
          "description": "AI技術を活用したオーダーメイド日本旅行プラン作成"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "東京観光ガイド",
          "description": "東京の完全旅行情報と推薦スポット"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "ホテル推薦",
          "description": "日本旅行に最適な厳選ホテル情報"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "レストランガイド",
          "description": "日本の最高のレストランとグルメ推薦"
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
  // Read locale/dir set by middleware for correct SSR attributes
  const h = headers();
  const ssrDir = h.get('x-dir') || 'ltr';
  const ssrLang = h.get('x-locale') || 'ja-JP';

  return (
    <html lang={ssrLang} dir={ssrDir} data-scroll-behavior="smooth" suppressHydrationWarning>
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
        <Script
          id="schema-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Japan Travel Guide",
              "url": baseUrl,
              "inLanguage": "en",
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${baseUrl}/?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              },
              "alternateName": ["Japan Tourism Guide"],
              "alternateNameLanguage": ["en-US", "en-GB", "fr-FR"],
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
