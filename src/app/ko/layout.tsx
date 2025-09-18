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
  title: "일본 여행 가이드 | 도쿄 관광 | 최고의 일본 여행 플래너 2025",
  description: "AI 기반 여행 계획으로 일본을 발견하세요. 도쿄, 요코하마, 사이타마, 치바 관광의 완전한 가이드. 호텔, 레스토랑, 명소와 맞춤형 여행 일정.",
  keywords: [
    "일본 여행", "일본 관광", "도쿄 여행 가이드", "일본 여행 플래너",
    "도쿄 명소", "일본 호텔", "일본 레스토랑", "요코하마 여행",
    "사이타마 관광", "치바 여행", "일본 일정", "도쿄 관광",
    "일본 AI 여행", "도쿄 호텔", "요코하마 명소", "일본 휴가",
    "도쿄 관광 투어", "일본 여행 팁", "도쿄 음식 가이드"
  ],
  authors: [{ name: "일본 관광 가이드" }],
  creator: "일본 관광 가이드",
  publisher: "일본 관광 가이드",
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
    canonical: `${baseUrl}/ko`,
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
    locale: 'ko_KR',
    alternateLocale: ['ja_JP', 'en_US', 'fr_FR', 'ar_SA'],
    url: `${baseUrl}/ko`,
    title: "일본 여행 가이드 | 도쿄 관광 | 최고의 일본 여행 플래너 2025",
    description: "AI 기반 여행 계획으로 일본을 발견하세요. 도쿄, 요코하마, 사이타마, 치바 관광의 완전한 가이드.",
    siteName: "일본 여행 가이드",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "일본 여행 가이드 - AI 기반 일본 여행 플래너",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@japantravelguide',
    creator: '@japantravelguide',
    title: "일본 여행 가이드 | 도쿄 관광 | 최고의 일본 여행 플래너 2025",
    description: "AI 기반 여행 계획으로 일본을 발견하세요. 도쿄, 요코하마, 사이타마, 치바 관광의 완전한 가이드.",
    images: [`${baseUrl}/twitter-image`],
  },
};

export default function KoreanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}