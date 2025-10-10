import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/Header";
import Script from "next/script";
import SiteFooter from "@/components/SiteFooter";

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
  title: "日本旅行ガイド | 東京観光スポット・ホテル・レストラン完全ガイド 2025",
  description: "東京・横浜・埼玉・千葉の観光スポット、ホテル、レストラン、グルメを完全網羅。AI搭載の旅行プランニングで、あなただけの日本旅行プランを無料作成。浅草、渋谷、新宿、秋葉原など人気エリアの最新情報をお届けします。",
  keywords: [
    "日本旅行", "東京観光", "東京旅行ガイド", "日本観光ガイド",
    "東京観光スポット", "東京ホテル", "東京レストラン", "東京グルメ",
    "横浜観光", "横浜旅行", "埼玉観光", "千葉観光",
    "AI旅行プランナー", "旅行プラン作成", "日本旅行プラン", "東京旅行プラン",
    "浅草観光", "渋谷観光", "新宿観光", "秋葉原観光", "上野観光",
    "東京スカイツリー", "東京タワー", "浅草寺", "明治神宮", "皇居",
    "東京ディズニーランド", "ディズニーシー", "お台場", "六本木", "原宿",
    "温泉旅行", "温泉宿", "旅館予約", "ホテル予約", "民泊",
    "桜の名所", "お花見スポット", "紅葉スポット", "夜景スポット",
    "神社仏閣", "パワースポット", "日本文化体験", "着物レンタル",
    "寿司", "ラーメン", "焼肉", "居酒屋", "日本料理",
    "築地市場", "豊洲市場", "アメ横", "食べ歩き", "スイーツ",
    "富士山", "箱根", "鎌倉", "日光", "伊豆",
    "日本の祭り", "花火大会", "イベント情報", "季節の観光"
  ],
  authors: [{ name: "日本旅行ガイド編集部" }],
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
    title: "日本旅行ガイド | 東京観光スポット・ホテル・レストラン完全ガイド 2025",
    description: "東京・横浜・埼玉・千葉の観光スポット、ホテル、レストラン、グルメを完全網羅。AI搭載の旅行プランニングで、あなただけの日本旅行プランを無料作成。浅草、渋谷、新宿など人気エリアの最新情報をお届けします。",
    siteName: "日本旅行ガイド",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "日本旅行ガイド - 東京観光スポット・ホテル・レストラン完全ガイド",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@japan_travel_jp',
    creator: '@japan_travel_jp',
    title: "日本旅行ガイド | 東京観光スポット完全ガイド 2025",
    description: "東京・横浜・埼玉・千葉の観光スポット、ホテル、グルメを完全網羅。AI旅行プランニングで最適な日本旅行を。",
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
  "alternateName": ["Japan Travel Guide", "日本観光ガイド", "東京観光ガイド"],
  "description": "東京・横浜・埼玉・千葉の観光スポット、ホテル、レストラン、グルメを完全網羅。AI搭載の旅行プランニングで、あなただけの日本旅行プランを無料作成。",
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
    "availableLanguage": ["日本語", "English", "Français", "한국어", "العربية"],
    "areaServed": "JP"
  },
  "areaServed": [
    {
      "@type": "Country",
      "name": "日本",
      "sameAs": "https://ja.wikipedia.org/wiki/日本"
    },
    {
      "@type": "City",
      "name": "東京",
      "containedIn": "日本",
      "sameAs": "https://ja.wikipedia.org/wiki/東京"
    },
    {
      "@type": "City",
      "name": "横浜",
      "containedIn": "神奈川県",
      "sameAs": "https://ja.wikipedia.org/wiki/横浜市"
    }
  ],
  "serviceType": ["旅行プランニング", "観光ガイド", "ホテル予約支援", "レストラン情報"],
  "priceRange": "無料",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "bestRating": "5",
    "worstRating": "1",
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
          "description": "AI技術を活用したオーダーメイド日本旅行プラン作成。東京、横浜、埼玉、千葉を中心に最適な旅行ルートを提案します。",
          "provider": {
            "@type": "Organization",
            "name": "日本旅行ガイド"
          }
        },
        "price": "0",
        "priceCurrency": "JPY"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "東京観光ガイド",
          "description": "東京の完全旅行情報と推薦スポット。浅草、渋谷、新宿、秋葉原、上野など人気エリアの詳細情報。",
          "provider": {
            "@type": "Organization",
            "name": "日本旅行ガイド"
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "ホテル・宿泊施設ガイド",
          "description": "日本旅行に最適な厳選ホテル、旅館、温泉宿の詳細情報と予約支援。",
          "provider": {
            "@type": "Organization",
            "name": "日本旅行ガイド"
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "レストラン・グルメガイド",
          "description": "東京の最高のレストラン、寿司、ラーメン、焼肉、居酒屋などのグルメ情報。",
          "provider": {
            "@type": "Organization",
            "name": "日本旅行ガイド"
          }
        }
      }
    ]
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read locale/dir set by middleware for correct SSR attributes
  const h = await headers();
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
              "inLanguage": "ja",
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${baseUrl}/?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              },
              "alternateName": ["Japan Tourism Guide", "日本旅行ガイド"],
              "alternateNameLanguage": ["en-US", "en-GB", "fr-FR", "ja-JP"],
            })
          }}
        />
        <Script
          id="schema-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TravelGuideJapan",
              "url": baseUrl,
              "logo": `${baseUrl}/icon`,
              "sameAs": [
                "https://twitter.com/japan_travel_jp",
                "https://www.facebook.com/japantravelguide",
                "https://www.instagram.com/japantravelguide"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["Japanese", "English", "French", "Korean"]
              },
              "founder": {
                "@type": "Person",
                "name": "TravelGuideJapan Team"
              },
              "foundingDate": "2024",
              "description": "AI搭載の日本旅行プランニングと観光ガイドサービス"
            })
          }}
        />
        <ClientProviders>
          <Header />
          <main>
            {children}
          </main>
          <SiteFooter />
        </ClientProviders>
      </body>
    </html>
  );
}
