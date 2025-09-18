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
  title: "دليل السفر لليابان | سياحة طوكيو | أفضل مخطط سفر لليابان 2025",
  description: "اكتشف اليابان مع تخطيط السفر المدعوم بالذكاء الاصطناعي. دليل شامل لسياحة طوكيو ويوكوهاما وسايتاما وتشيبا. فنادق ومطاعم ومعالم مع برامج سفر مخصصة.",
  keywords: [
    "سفر اليابان", "سياحة اليابان", "دليل سفر طوكيو", "مخطط سفر اليابان",
    "معالم طوكيو", "فنادق اليابان", "مطاعم اليابان", "سفر يوكوهاما",
    "سياحة سايتاما", "سفر تشيبا", "برنامج اليابان", "جولة طوكيو",
    "سفر ذكي اليابان", "فنادق طوكيو", "معالم يوكوهاما", "عطلة اليابان",
    "جولة طوكيو السياحية", "نصائح سفر اليابان", "دليل طعام طوكيو"
  ],
  authors: [{ name: "دليل السياحة اليابانية" }],
  creator: "دليل السياحة اليابانية",
  publisher: "دليل السياحة اليابانية",
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
    canonical: `${baseUrl}/ar`,
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
    locale: 'ar_SA',
    alternateLocale: ['ja_JP', 'en_US', 'fr_FR', 'ko_KR'],
    url: `${baseUrl}/ar`,
    title: "دليل السفر لليابان | سياحة طوكيو | أفضل مخطط سفر لليابان 2025",
    description: "اكتشف اليابان مع تخطيط السفر المدعوم بالذكاء الاصطناعي. دليل شامل لسياحة طوكيو ويوكوهاما وسايتاما وتشيبا.",
    siteName: "دليل السفر لليابان",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "دليل السفر لليابان - مخطط سفر اليابان بالذكاء الاصطناعي",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@japantravelguide',
    creator: '@japantravelguide',
    title: "دليل السفر لليابان | سياحة طوكيو | أفضل مخطط سفر لليابان 2025",
    description: "اكتشف اليابان مع تخطيط السفر المدعوم بالذكاء الاصطناعي. دليل شامل لسياحة طوكيو ويوكوهاما وسايتاما وتشيبا.",
    images: [`${baseUrl}/twitter-image`],
  },
};

export default function ArabicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}