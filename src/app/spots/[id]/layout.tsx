import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import ClientProviders from "@/components/ClientProviders";
import "./spots-detail.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "観光スポット詳細 | 日本観光スポット",
  description: "観光スポットの詳細情報。営業時間、料金、アクセス、口コミなど観光に必要な情報をまとめています。",
  keywords: ["観光", "日本", "スポット", "詳細", "情報"],
  authors: [{ name: "Japan Spots" }],
  openGraph: {
    title: "観光スポット詳細",
    description: "観光スポットの詳細情報",
    type: "website",
    locale: "ja_JP",
    alternateLocale: ["en_US", "ko_KR"],
  },
  twitter: {
    card: "summary_large_image",
    title: "観光スポット詳細",
    description: "観光スポットの詳細情報",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function SpotLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} ${notoSansJP.variable} ${geistMono.variable} antialiased min-h-screen bg-white`}>
      <ClientProviders>
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </ClientProviders>
    </div>
  );
}
