import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app';

export const metadata: Metadata = {
  title: "東京エリア観光ガイド | 地域別スポット検索 | TravelGuideJapan",
  description: "東京・横浜・埼玉・千葉の地域別観光スポットを詳細ガイド。渋谷、新宿、銀座、浅草など人気エリアの観光名所、グルメ、ショッピング情報を網羅。AI旅行プランに追加して最適なルートを作成できます。",
  keywords: [
    "東京エリア観光", "地域別観光ガイド", "渋谷観光スポット", "新宿観光ガイド",
    "銀座観光情報", "浅草観光名所", "秋葉原観光", "六本木ナイトライフ",
    "お台場観光", "築地グルメ", "横浜観光", "東京観光エリア"
  ],
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
    canonical: `${baseUrl}/areas`,
    languages: {
      'x-default': `${baseUrl}/areas`,
      'ja-JP': `${baseUrl}/areas`,
      'en-GB': `${baseUrl}/en/areas`,
      'en-US': `${baseUrl}/en/areas`,
      'fr-FR': `${baseUrl}/fr/areas`,
      'ko-KR': `${baseUrl}/ko/areas`,
    }
  },
  openGraph: {
    title: "東京エリア観光ガイド | 地域別スポット検索 | TravelGuideJapan",
    description: "東京・横浜・埼玉・千葉の地域別観光スポットを詳細ガイド。渋谷、新宿、銀座、浅草など人気エリアの観光名所を網羅。",
    url: `${baseUrl}/areas`,
    siteName: 'TravelGuideJapan',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/images/areas/areas-hero.jpg`,
        width: 1200,
        height: 630,
        alt: "東京エリア観光ガイド - 地域別スポット検索",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "東京エリア観光ガイド | 地域別スポット検索",
    description: "東京・横浜・埼玉・千葉の地域別観光スポットを詳細ガイド。人気エリアの観光名所を網羅。",
    images: [`${baseUrl}/images/areas/areas-hero.jpg`],
  }
};

export default function AreasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}