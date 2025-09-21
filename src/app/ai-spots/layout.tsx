import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app';

export const metadata: Metadata = {
  title: 'AIおすすめスポット | あなたにぴったりの観光プランを作成',
  description: 'AIがあなたの好みに合わせて最適な観光スポットをご提案。予算、興味、滞在期間に基づいた個人向けプランで、忘れられない日本旅行を。',
  keywords: 'AI旅行プラン,観光スポット,日本旅行,個人向けプラン,おすすめスポット',
  robots: 'index, follow',
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
    title: 'AIおすすめスポット | あなたにぴったりの観光プランを作成',
    description: 'AIがあなたの好みに合わせて最適な観光スポットをご提案。予算、興味、滞在期間に基づいた個人向けプランで、忘れられない日本旅行を。',
    url: `${baseUrl}/ai-spots`,
    siteName: 'Trip App',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIおすすめスポット | あなたにぴったりの観光プランを作成',
    description: 'AIがあなたの好みに合わせて最適な観光スポットをご提案。予算、興味、滞在期間に基づいた個人向けプランで、忘れられない日本旅行を。',
  }
};

export default function AISpotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
