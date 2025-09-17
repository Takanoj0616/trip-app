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
  title: "Guide de Voyage au Japon | Tourisme Tokyo | Meilleur Planificateur de Voyage Japon 2025",
  description: "Découvrez le Japon avec une planification de voyage alimentée par l'IA. Guide complet du tourisme à Tokyo, Yokohama, Saitama et Chiba. Hôtels, restaurants, attractions et itinéraires personnalisés.",
  keywords: [
    "voyage Japon", "tourisme Japon", "guide voyage Tokyo", "planificateur voyage Japon",
    "attractions Tokyo", "hôtels Japon", "restaurants Japon", "voyage Yokohama",
    "tourisme Saitama", "voyage Chiba", "itinéraire Japon", "visite Tokyo",
    "voyage IA Japon", "hôtels Tokyo", "attractions Yokohama", "vacances Japon",
    "tour visite Tokyo", "conseils voyage Japon", "guide gastronomique Tokyo"
  ],
  authors: [{ name: "Guide Touristique Japon" }],
  creator: "Guide Touristique Japon",
  publisher: "Guide Touristique Japon",
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
      'ja': `${baseUrl}/`,
      'en': `${baseUrl}/en`,
      'fr': `${baseUrl}/fr`,
      'ko': `${baseUrl}/ko`,
      'ar': `${baseUrl}/ar`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['ja_JP', 'en_US', 'ko_KR', 'ar_SA'],
    url: `${baseUrl}/fr`,
    title: "Guide de Voyage au Japon | Tourisme Tokyo | Meilleur Planificateur de Voyage Japon 2025",
    description: "Découvrez le Japon avec une planification de voyage alimentée par l'IA. Guide complet du tourisme à Tokyo, Yokohama, Saitama et Chiba.",
    siteName: "Guide de Voyage au Japon",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Guide de Voyage au Japon - Planificateur de Voyage Japon avec IA",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@japantravelguide',
    creator: '@japantravelguide',
    title: "Guide de Voyage au Japon | Tourisme Tokyo | Meilleur Planificateur de Voyage Japon 2025",
    description: "Découvrez le Japon avec une planification de voyage alimentée par l'IA. Guide complet du tourisme à Tokyo, Yokohama, Saitama et Chiba.",
    images: [`${baseUrl}/twitter-image`],
  },
};

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
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