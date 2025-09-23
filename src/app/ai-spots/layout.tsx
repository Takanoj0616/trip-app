import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app';

export const metadata: Metadata = {
  title: "AI観光スポット推薦 | 個人向けおすすめプラン作成 | TravelGuideJapan",
  description: "AIがあなたの興味・予算・滞在日数を分析し、最適な観光スポットを推薦。東京・横浜・埼玉・千葉の個人向けカスタム旅行プランを自動生成。効率的なルートと移動時間を考慮したパーソナライズされた日本旅行体験をお楽しみください。",
  keywords: [
    "AI観光スポット推薦", "個人向け旅行プラン", "AI旅行プランニング", "東京観光AI",
    "カスタム旅行ルート", "AI観光ガイド", "パーソナライズ旅行", "日本旅行AI",
    "最適観光ルート", "AI旅行コンシェルジュ", "観光スポット推奨", "旅行プラン自動生成"
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
    canonical: `${baseUrl}/ai-spots`,
    languages: {
      'x-default': `${baseUrl}/ai-spots`,
      'ja-JP': `${baseUrl}/ai-spots`,
      'en-GB': `${baseUrl}/en/ai-spots`,
      'en-US': `${baseUrl}/en/ai-spots`,
      'fr-FR': `${baseUrl}/fr/ai-spots`,
      'ko-KR': `${baseUrl}/ko/ai-spots`,
      'ar-SA': `${baseUrl}/ar/ai-spots`,
    }
  },
  openGraph: {
    title: "AI観光スポット推薦 | 個人向けおすすめプラン作成 | TravelGuideJapan",
    description: "AIがあなたの興味・予算・滞在日数を分析し、最適な観光スポットを推薦。パーソナライズされた日本旅行体験をお楽しみください。",
    url: `${baseUrl}/ai-spots`,
    siteName: 'TravelGuideJapan',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/images/ai-spots/ai-spots-hero.jpg`,
        width: 1200,
        height: 630,
        alt: "AI観光スポット推薦 - 個人向けおすすめプラン作成",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI観光スポット推薦 | 個人向けおすすめプラン作成",
    description: "AIがあなたの興味・予算・滞在日数を分析し、最適な観光スポットを推薦。パーソナライズされた日本旅行体験。",
    images: [`${baseUrl}/images/ai-spots/ai-spots-hero.jpg`],
  }
};

export default function AISpotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
