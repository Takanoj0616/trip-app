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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Guide de voyage au Japon | Tourisme Tokyo | Meilleur planificateur 2025",
  description: "Découvrez le Japon avec une planification alimentée par l'IA. Guide complet de Tokyo, Yokohama, Saitama & Chiba. Hôtels, restaurants, attractions & itinéraires personnalisés.",
  keywords: [
    "voyage japon", "tourisme japon", "guide tokyo", "planificateur voyage japon",
    "attractions tokyo", "hotels japon", "restaurants japon", "voyage yokohama",
    "tourisme saitama", "voyage chiba", "itinéraire japon", "visite tokyo",
    "IA voyage japon", "vacances japon"
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
    title: "Guide de voyage au Japon | Tourisme Tokyo | Meilleur planificateur 2025",
    description: "Découvrez le Japon avec une planification alimentée par l'IA. Guide complet et itinéraires personnalisés.",
    siteName: "Guide Voyage Japon",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Guide de voyage au Japon - Planificateur IA",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Guide de voyage au Japon | Tourisme Tokyo | Meilleur planificateur 2025",
    description: "Découvrez le Japon avec une planification alimentée par l'IA.",
    images: [`${baseUrl}/twitter-image`],
  },
};

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

