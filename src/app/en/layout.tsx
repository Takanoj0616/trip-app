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
  title: "Japan Travel Guide | Tokyo Tourism | Best Japan Trip Planner 2025",
  description: "Discover Japan with AI-powered travel planning. Complete guide to Tokyo, Yokohama, Saitama & Chiba tourism. Hotels, restaurants, attractions & personalized itineraries for your perfect Japan trip.",
  keywords: [
    "Japan travel", "Japan tourism", "Tokyo travel guide", "Japan trip planner",
    "Tokyo attractions", "Japan hotels", "Japan restaurants", "Yokohama travel",
    "Saitama tourism", "Chiba travel", "Japan itinerary", "Tokyo sightseeing",
    "Japan AI travel", "Tokyo hotels", "Yokohama attractions", "Japan vacation",
    "Tokyo sightseeing tour", "Japan travel tips", "Tokyo food guide"
  ],
  authors: [{ name: "Japan Tourism Guide" }],
  creator: "Japan Tourism Guide",
  publisher: "Japan Tourism Guide",
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
    canonical: `${baseUrl}/en`,
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
    locale: 'en_US',
    alternateLocale: ['ja_JP', 'fr_FR', 'ko_KR', 'ar_SA'],
    url: `${baseUrl}/en`,
    title: "Japan Travel Guide | Tokyo Tourism | Best Japan Trip Planner 2025",
    description: "Discover Japan with AI-powered travel planning. Complete guide to Tokyo, Yokohama, Saitama & Chiba tourism. Hotels, restaurants, attractions & personalized itineraries.",
    siteName: "Japan Travel Guide",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Japan Travel Guide - AI-Powered Japan Trip Planner",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@japantravelguide',
    creator: '@japantravelguide',
    title: "Japan Travel Guide | Tokyo Tourism | Best Japan Trip Planner 2025",
    description: "Discover Japan with AI-powered travel planning. Complete guide to Tokyo, Yokohama, Saitama & Chiba tourism.",
    images: [`${baseUrl}/twitter-image`],
  },
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}