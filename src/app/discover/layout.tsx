import { Metadata } from 'next';
import { BASE_URL as baseUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: "AIが案内する日本の旅 | 観光スポット発見ガイド | TravelGuideJapan",
  description: "AIが旅行情報を整理し、わかりやすいパンフレットにまとめます。観光スポットやグルメ情報、移動手段まで、一目で理解できるガイドを自動で生成。エリアごとの魅力を探索し、AI旅行プランに追加して最適なルートを作成しましょう。",
  keywords: [
    "AI旅行ガイド", "日本観光スポット発見", "東京エリアガイド", "AI旅行プランニング",
    "観光スポット詳細", "日本旅行ルート", "AIおすすめ観光地", "東京観光",
    "エリア別観光ガイド", "AI最適ルート", "日本旅行発見", "観光地推薦"
  ],
  openGraph: {
    title: "AIが案内する日本の旅 | 観光スポット発見ガイド | TravelGuideJapan",
    description: "AIが旅行情報を整理し、わかりやすいパンフレットにまとめます。観光スポットやグルメ情報、移動手段まで、一目で理解できるガイドを自動で生成。",
    url: `${baseUrl}/discover`,
    type: 'website',
    images: [
      {
        url: `${baseUrl}/images/discover/discover-hero.jpg`,
        width: 1200,
        height: 630,
        alt: "AIが案内する日本の旅 - 観光スポット発見ガイド",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AIが案内する日本の旅 | 観光スポット発見ガイド",
    description: "AIが旅行情報を整理し、わかりやすいパンフレットにまとめます。観光スポットやグルメ情報、移動手段まで一目で理解。",
    images: [`${baseUrl}/images/discover/discover-hero.jpg`],
  },
  alternates: {
    canonical: `${baseUrl}/discover`,
    languages: {
      'ja-JP': `${baseUrl}/discover`,
      'en-US': `${baseUrl}/en/discover`,
      'fr-FR': `${baseUrl}/fr/discover`,
      'ko-KR': `${baseUrl}/ko/discover`,
    },
  },
};

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
