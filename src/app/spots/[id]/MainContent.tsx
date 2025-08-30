'use client';

import { useState, useEffect, useRef } from 'react';
import { db, doc, getDoc } from '@/lib/firebase';
import { TouristSpot } from '@/types';
import { allBookstoreSpots } from '@/data/tokyo-bookstore-spots';
import { tokyoSpotsDetailed, TokyoSpot } from '@/data/tokyo-spots-detailed';
import Image from 'next/image';
import {
  Clock,
  DollarSign,
  Hourglass,
  Star,
  Users,
  MapPin,
  Heart,
  Bot,
  Ticket,
  Images,
  Info,
  MessageSquare,
  Twitter,
  Accessibility,
  Baby,
  Bath,
  Camera,
  Ban,
  Wifi,
  Store,
  Utensils,
  HelpCircle,
  Map,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

// Map component を動的インポート（SSRを無効化）
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
      <p>地図を読み込み中...</p>
    </div>
  ),
});

interface MainContentProps {
  spotId: string;
  language?: string;
  currency?: string;
  unit?: string;
}

interface SpotData {
  name: string;
  description: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  price?: string;
  hours?: string;
  rating?: number;
  images?: string[];
  contact?: {
    phone?: string;
    website?: string;
  };
  tags?: string[];
  googlePlaceId?: string;
  openingHours?: any;
  priceRange?: string;
  reviewCount?: number;
  crowdLevel?: '空いている' | '普通' | '混雑';
  averageStayMinutes?: number;
  stayRange?: string;
}

export default function MainContent({
  spotId,
  language: _language = 'ja',
  currency = 'jpy',
  unit: _unit = 'metric',
}: MainContentProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [spotData, setSpotData] = useState<SpotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // i18n labels（URLの ?lang が優先、なければ props → ja）
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { currentLanguage: ctxLang, setCurrentLanguage } = useLanguage();
  const langParam = searchParams?.get('lang');
  const lang = (langParam || _language || (ctxLang as string) || 'ja') as 'ja' | 'en' | 'ko' | 'fr';

  // Sync rule:
  // - If URL has ?lang, treat it as source of truth and update context to it.
  // - If URL doesn't have ?lang, reflect context to URL.
  const didInitLangSync = useRef(false);
  useEffect(() => {
    const urlLang = searchParams?.get('lang');
    // 1) 初回だけ: URLにlangがあればコンテキストへ反映
    if (!didInitLangSync.current) {
      didInitLangSync.current = true;
      if (urlLang && urlLang !== ctxLang) {
        setCurrentLanguage(urlLang);
      } else if (!urlLang && ctxLang) {
        // URLに無ければ現在の言語をURLへ反映
        const sp = new URLSearchParams(searchParams?.toString());
        sp.set('lang', ctxLang as string);
        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
      }
      return;
    }
    // 2) 以降: ヘッダーの切替（ctxLang）が発生したらURLを更新
    if (ctxLang && urlLang !== ctxLang) {
      const sp = new URLSearchParams(searchParams?.toString());
      sp.set('lang', ctxLang as string);
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    }
  }, [ctxLang, langParam]);
  const i18n = {
    ja: {
      gallery: '写真ギャラリー',
      details: '詳細説明',
      address: '住所',
      accessMap: 'アクセス・地図',
      hours: '営業時間',
      hoursHint: '店舗情報に基づく目安',
      price: '料金',
      priceHint: '表示は目安',
      stay: '滞在時間',
      stayAvg: '平均的な滞在時間',
      rating: '評価',
      crowd: '混雑状況',
      crowdLabels: { busy: '混雑', normal: '普通', empty: '空いている' },
      free: '無料', paid: '有料',
      highlights: '見どころ',
      heroSubtitle: 'スポット詳細',
      addToFavoritesBtn: 'お気に入りに追加',
      addToAIPlanBtn: 'AI旅行プランに入れる',
      ticketsBtn: 'チケット予約',
      fallbackDescription: '人気のスポットです。見どころや歴史、周辺情報をチェックして計画に役立てましょう。',
      reviewsTitle: '口コミ・レビュー',
    },
    en: {
      gallery: 'Photo Gallery',
      details: 'Details',
      address: 'Address',
      accessMap: 'Access & Map',
      hours: 'Hours',
      hoursHint: 'Approx. based on venue info',
      price: 'Price',
      priceHint: 'Approximate',
      stay: 'Stay Time',
      stayAvg: 'Average stay time',
      rating: 'Rating',
      crowd: 'Crowd Level',
      crowdLabels: { busy: 'Busy', normal: 'Moderate', empty: 'Light' },
      free: 'Free', paid: 'Paid',
      highlights: 'Highlights',
      heroSubtitle: 'Spot Details',
      addToFavoritesBtn: 'Add to Favorites',
      addToAIPlanBtn: 'Add to AI Plan',
      ticketsBtn: 'Book Tickets',
      fallbackDescription: 'A popular spot. Check highlights and info to plan your visit.',
      reviewsTitle: 'Reviews',
    },
    ko: {
      gallery: '사진 갤러리',
      details: '상세 설명',
      address: '주소',
      accessMap: '오시는 길 · 지도',
      hours: '영업시간',
      hoursHint: '시설 정보 기준(대략)',
      price: '요금',
      priceHint: '대략',
      stay: '체류 시간',
      stayAvg: '평균 체류 시간',
      rating: '평점',
      crowd: '혼잡도',
      crowdLabels: { busy: '혼잡', normal: '보통', empty: '여유' },
      free: '무료', paid: '유료',
      highlights: '볼거리',
      heroSubtitle: '스팟 상세',
      addToFavoritesBtn: '즐겨찾기에 추가',
      addToAIPlanBtn: 'AI 여행 일정에 추가',
      ticketsBtn: '티켓 예약',
      fallbackDescription: '인기 있는 장소입니다. 볼거리와 정보를 확인해 일정을 계획해 보세요.',
      reviewsTitle: '리뷰',
    },
    fr: {
      gallery: 'Galerie Photo',
      details: 'Description',
      address: 'Adresse',
      accessMap: 'Accès & Carte',
      hours: 'Horaires',
      hoursHint: 'Indication basée sur le lieu',
      price: 'Tarifs',
      priceHint: 'Indication',
      stay: 'Durée de la visite',
      stayAvg: 'Durée moyenne',
      rating: 'Note',
      crowd: 'Affluence',
      crowdLabels: { busy: 'Affluence', normal: 'Modérée', empty: 'Faible' },
      free: 'Gratuit', paid: 'Payant',
      highlights: 'Points forts',
      heroSubtitle: 'Détails du lieu',
      addToFavoritesBtn: 'Ajouter aux favoris',
      addToAIPlanBtn: "Ajouter au plan IA",
      ticketsBtn: 'Réserver des billets',
      fallbackDescription: "Lieu populaire. Consultez les points forts et les infos pour planifier votre visite.",
      reviewsTitle: 'Avis',
    },
  }[lang];

  useEffect(() => {
    const fetchSpotData = async () => {
      // 0) Check local Tokyo detailed spots (sights list)
      const detailed = tokyoSpotsDetailed.find((s: TokyoSpot) => s.id === spotId);
      if (detailed) {
        const name = detailed.name?.[lang] || detailed.name?.ja || detailed.name?.en || detailed.name?.fr || detailed.name?.ko || Object.values(detailed.name || {})[0] || 'スポット';
        const images = detailed.images?.length ? detailed.images : (detailed.image ? [detailed.image] : []);
        const priceTextFromTicket = detailed.info?.ticketRequired === '不要' ? i18n.free : detailed.info?.ticketRequired === '必要' ? i18n.paid : undefined;
        const convertedFromDetailed: SpotData = {
          name,
          description: (detailed as any)[`description_${lang}`] || detailed.description || i18n.fallbackDescription,
          location: detailed.location ? { lat: 35.676, lng: 139.65, address: detailed.location.address } : undefined,
          price: priceTextFromTicket,
          hours: detailed.info?.openHours || '営業時間未定',
          rating: detailed.rating,
          images,
          contact: undefined,
          tags: detailed.tags || [],
          googlePlaceId: undefined,
          openingHours: undefined,
          priceRange: undefined,
          reviewCount: detailed.reviewCount,
          crowdLevel: (detailed.info?.crowdLevel as any) || undefined,
          averageStayMinutes: undefined,
          stayRange: detailed.info?.duration
        };
        setSpotData(convertedFromDetailed);
        setLoading(false);
        return;
      }

      // First check local bookstore data
      const localSpot = allBookstoreSpots.find(spot => 
        spot.id === spotId || spot.googlePlaceId === spotId
      );

      if (localSpot) {
        const convertedSpot: SpotData = {
          name: localSpot.name,
          description: localSpot.description || '人気のスポットです',
          location: localSpot.location,
          price: (localSpot as any).priceText || (localSpot.priceRange === 'expensive' ? '¥3,000以上' : 
                 localSpot.priceRange === 'moderate' ? '¥1,000-3,000' : '¥1,000以下'),
          hours: localSpot.openingHours ? Object.values(localSpot.openingHours)[0] : '営業時間未定',
          rating: localSpot.rating || 4.0,
          images: localSpot.images || [],
          contact: localSpot.contact,
          tags: localSpot.tags || [],
          googlePlaceId: localSpot.googlePlaceId,
          openingHours: localSpot.openingHours,
          priceRange: localSpot.priceRange,
          reviewCount: (localSpot as any).reviewCount,
          crowdLevel: (localSpot as any).crowdLevel,
          averageStayMinutes: (localSpot as any).averageStayMinutes,
          stayRange: (localSpot as any).stayRange
        };
        setSpotData(convertedSpot);
        setLoading(false);
        return;
      }

      if (!db) {
        // Firebaseが設定されていない場合はデフォルトデータを使用
        setSpotData({
          name: '東京タワー',
          description: '東京のシンボル、333mの展望タワー',
          location: { lat: 35.6586, lng: 139.7454, address: '東京都港区芝公園4-2-8' },
          price: '¥1,200 - ¥3,000',
          hours: '9:00 - 23:00',
          rating: 4.2
        });
        setLoading(false);
        return;
      }

      try {
        // Try tourist_spots collection first
        const touristSpotRef = doc(db, 'tourist_spots', spotId);
        const touristSpotSnap = await getDoc(touristSpotRef);

        if (touristSpotSnap.exists()) {
          const data = touristSpotSnap.data() as TouristSpot;
          const convertedData: SpotData = {
            name: data.name,
            description: data.description || '人気のスポットです',
            location: data.location,
            price: (data as any).priceText || (data.priceRange === 'expensive' ? '¥3,000以上' : 
                   data.priceRange === 'moderate' ? '¥1,000-3,000' : '¥1,000以下'),
            hours: data.openingHours ? Object.values(data.openingHours)[0] : '営業時間未定',
            rating: data.rating || 4.0,
            images: data.images || [],
            contact: data.contact,
            tags: data.tags || [],
            googlePlaceId: data.googlePlaceId,
            openingHours: data.openingHours,
            priceRange: data.priceRange,
            reviewCount: (data as any).reviewCount,
            crowdLevel: (data as any).crowdLevel,
            averageStayMinutes: (data as any).averageStayMinutes,
            stayRange: (data as any).stayRange
          };
          setSpotData(convertedData);
          setLoading(false);
          return;
        }

        // Fallback to legacy spots collection
        const docRef = doc(db, 'spots', spotId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as SpotData;
          setSpotData(data);
        } else {
          // ドキュメントが見つからない場合はデフォルトデータを使用
          setSpotData({
            name: '東京タワー',
            description: '東京のシンボル、333mの展望タワー',
            location: { lat: 35.6586, lng: 139.7454 },
            price: '¥1,200 - ¥3,000',
            hours: '9:00 - 23:00',
            rating: 4.2
          });
        }
      } catch (error) {
        console.error('Error fetching spot data:', error);
        // エラーの場合もデフォルトデータを使用
        setSpotData({
          name: '東京タワー',
          description: '東京のシンボル、333mの展望タワー',
          location: { lat: 35.6586, lng: 139.7454 },
          price: '¥1,200 - ¥3,000',
          hours: '9:00 - 23:00',
          rating: 4.2
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSpotData();
  }, [spotId]);

  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedImage(null);
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const showNotification = (message: string, _type: 'success' | 'info' = 'info') => {
    // 通知表示のロジック（実装を簡略化）
    alert(message);
  };

  const addToFavorites = () => {
    showNotification('お気に入りに追加しました！', 'success');
  };

  const addToAITravelPlan = () => {
    showNotification('AI旅行プランに追加しました！', 'success');
  };

  const tagToLabel = (tag: string) => {
    const map: Record<string, string> = {
      book_store: '書店',
      shopping: 'ショッピング',
      entertainment: 'エンタメ',
      museum: '博物館',
      art_gallery: '美術館',
      park: '公園',
      temple: '寺院',
      shrine: '神社',
      nature: '自然',
      culture: '文化',
      cafe: 'カフェ',
      food: 'グルメ',
      store: '店舗',
      point_of_interest: '観光',
    };
    return map[tag] || tag;
  };

  // 現在の営業時間を計算
  const getBusinessHours = () => {
    const prefix = lang === 'en' ? 'Today: ' : lang === 'ko' ? '오늘: ' : lang === 'fr' ? "Aujourd'hui: " : '本日: ';
    if (spotData?.openingHours) {
      const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'] as const;
      const key = days[new Date().getDay()];
      const today = (spotData.openingHours as Record<string, string | undefined>)[key];
      if (today) return `${prefix}${today}`;
    }
    if (spotData?.hours) return `${prefix}${spotData.hours}`;
    return lang === 'en' ? 'Today: Hours unavailable' : lang === 'ko' ? '오늘: 영업시간 미정' : lang === 'fr' ? "Aujourd'hui: Horaires indisponibles" : '本日: 営業時間未定';
  };

  // 料金表示
  const getPriceDisplay = () => {
    if (spotData?.price) {
      return spotData.price;
    }
    if (currency === 'jpy') {
      return '¥1,200 - ¥3,000';
    }
    return '$8 - $20';
  };

  // 滞在時間（データ優先 → タグから推定）
  const getStayDisplay = () => {
    if (spotData?.stayRange) return spotData.stayRange;
    if (spotData?.averageStayMinutes) {
      const m = spotData.averageStayMinutes;
      const min = Math.max(15, Math.round((m * 0.7) / 5) * 5);
      const max = Math.round((m * 1.3) / 5) * 5;
      return `${min} - ${max}分`;
    }
    const tags = spotData?.tags || [];
    const has = (t: string) => tags.includes(t);
    let min = 60, max = 90;
    if (has('book_store') || has('shopping') || has('store')) { min = 30; max = 60; }
    else if (has('art_gallery') || has('museum')) { min = 60; max = 120; }
    return `${min} - ${max}分`;
  };

  // 混雑状況（簡易推定）
  const getCrowd = () => {
    if (spotData?.crowdLevel) {
      const base = spotData.crowdLevel;
      const score = base === '混雑' ? 4 : base === '普通' ? 3 : 2;
      const label = score >= 4 ? i18n.crowdLabels.busy : score >= 3 ? i18n.crowdLabels.normal : i18n.crowdLabels.empty;
      return { label, score };
    }
    const rating = spotData?.rating ?? 4.0;
    const d = new Date();
    let score = rating >= 4.4 ? 3 : rating >= 4.1 ? 2 : 1;
    const day = d.getDay();
    const h = d.getHours();
    if (day === 0 || day === 6) score += 1;
    if ((h >= 11 && h <= 13) || (h >= 16 && h <= 20)) score += 1;
    score = Math.max(1, Math.min(5, score));
    const label = score >= 4 ? i18n.crowdLabels.busy : score >= 3 ? i18n.crowdLabels.normal : i18n.crowdLabels.empty;
    return { label, score };
  };

  const getReviewCountDisplay = () => {
    if (typeof spotData?.reviewCount === 'number') return `(${spotData.reviewCount.toLocaleString()}件)`;
    const anySpot: any = spotData as any;
    if (anySpot?.reviews && Array.isArray(anySpot.reviews)) return `(${anySpot.reviews.length}件)`;
    return '';
  };

  return (
    <main className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-primary/80 to-primary-light/60 flex items-center justify-center text-white overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-45 from-primary/10 to-primary-light/10 backdrop-blur-sm" />
          {/* SVGで東京タワーのシルエットを作成 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg
              width="400"
              height="600"
              viewBox="0 0 400 600"
              className="text-white"
            >
              <polygon
                fill="currentColor"
                points="200,50 250,200 150,200"
              />
              <rect fill="currentColor" x="175" y="200" width="50" height="300" />
              <circle fill="currentColor" cx="200" cy="100" r="20" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-8">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-16 bg-white/20 rounded mb-6"></div>
              <div className="h-8 bg-white/20 rounded mb-12"></div>
            </div>
          ) : (
            <>
              <h1 className="mb-6 text-shadow-lg bg-gradient-to-br from-white to-slate-100 bg-clip-text text-transparent">
                {spotData?.name || 'Tokyo'}
                <br />
                <span className="text-3xl opacity-90">{i18n.heroSubtitle}</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-95 mb-12 text-shadow">
                {spotData?.description || i18n.fallbackDescription}
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={addToFavorites}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:scale-105 transform transition-all duration-300 shadow-xl"
            >
              <Heart size={20} />
              {i18n.addToFavoritesBtn}
            </button>
            <button
              onClick={addToAITravelPlan}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/90 text-secondary font-semibold backdrop-blur-sm hover:bg-white hover:scale-105 transform transition-all duration-300 shadow-xl"
            >
              <Bot size={20} />
              {i18n.addToAIPlanBtn}
            </button>
            <a
              href="#tickets"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold backdrop-blur-sm hover:bg-white/10 hover:border-white/50 hover:scale-105 transform transition-all duration-300"
            >
              <Ticket size={20} />
              {i18n.ticketsBtn}
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6">
        {/* クイック情報 */}
        <section className="relative -mt-20 z-10 mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-border-light p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="text-center p-6 border border-border-light rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <Clock className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-secondary mb-2">{i18n.hours}</h3>
                <p className="text-lg font-semibold mb-1">{getBusinessHours()}</p>
                <small className="text-text-light">{i18n.hoursHint}</small>
              </div>

              <div className="text-center p-6 border border-border-light rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <DollarSign className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-secondary mb-2">{i18n.price}</h3>
                <p className="text-lg font-semibold mb-1">{getPriceDisplay()}</p>
                <small className="text-text-light">{i18n.priceHint}</small>
              </div>

              <div className="text-center p-6 border border-border-light rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <Hourglass className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-secondary mb-2">{i18n.stay}</h3>
                <p className="text-lg font-semibold mb-1">{getStayDisplay()}</p>
                <small className="text-text-light">{i18n.stayAvg}</small>
              </div>

              <div className="text-center p-6 border border-border-light rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <Star className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-secondary mb-2">{i18n.rating}</h3>
                <div className="flex justify-center items-center gap-2 mb-1">
                  <span className="text-yellow-400 text-xl">
                    {'★'.repeat(Math.floor(spotData?.rating || 4.2))}{'☆'.repeat(5 - Math.floor(spotData?.rating || 4.2))}
                  </span>
                  <span className="font-semibold">{spotData?.rating || 4.2}</span>
                </div>
                <small className="text-text-light">{getReviewCountDisplay()}</small>
              </div>

              <div className="text-center p-6 border border-border-light rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <Users className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-secondary mb-2">{i18n.crowd}</h3>
                <p className="text-lg font-semibold mb-2">{getCrowd().label}</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-6 h-1.5 rounded-full ${
                        i <= getCrowd().score ? 'bg-warning' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 地図・アクセス */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <MapPin className="text-primary" size={24} />
            {i18n.accessMap}
          </h2>

          <MapComponent 
            location={spotData?.location || { lat: 35.6586, lng: 139.7454 }}
            name={spotData?.name || '東京タワー'}
          />

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 border border-border-light rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
              <h3 className="flex items-center gap-3 text-secondary mb-6">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                最寄り駅
              </h3>
              <ul className="space-y-3">
                <li className="border-b border-border-light pb-3">
                  <strong className="text-secondary">赤羽橋駅</strong>
                  <span className="text-text-muted"> (都営大江戸線) - 徒歩5分</span>
                </li>
                <li className="border-b border-border-light pb-3">
                  <strong className="text-secondary">神谷町駅</strong>
                  <span className="text-text-muted">
                    {' '}
                    (東京メトロ日比谷線) - 徒歩7分
                  </span>
                </li>
                <li>
                  <strong className="text-secondary">御成門駅</strong>
                  <span className="text-text-muted"> (都営三田線) - 徒歩6分</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border border-border-light rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
              <h3 className="flex items-center gap-3 text-secondary mb-6">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                車でのアクセス
              </h3>
              <p className="text-text-muted mb-3">
                首都高速都心環状線「芝公園」出口より約10分
              </p>
              <p className="text-text-muted mb-2">
                <strong className="text-secondary">駐車場:</strong> タワーパーキング（150台）
              </p>
              <p className="text-text-muted">
                平日: ¥600/h、土日祝: ¥800/h
              </p>
            </div>
          </div>
        </section>

        {/* 写真ギャラリー */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Images className="text-primary" size={24} />
            {i18n.gallery}
          </h2>

          {spotData?.images && spotData.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {spotData.images.slice(0, 8).map((src, idx) => (
                <div
                  key={`${src}-${idx}`}
                  className="relative h-40 md:h-48 lg:h-52 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg bg-slate-100"
                  onClick={() => { setSelectedImage(src); openModal('image'); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedImage(src);
                      openModal('image');
                    }
                  }}
                >
                  <Image src={src} alt={`${spotData?.name || 'スポット'}の写真`} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'exterior', label: '外観' },
                { id: 'observatory', label: '展望台' },
                { id: 'night', label: '夜景' },
                { id: 'interior', label: '内部' },
              ].map((item) => (
                <div
                  key={item.id}
                  className="h-40 md:h-48 lg:h-52 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
                  onClick={() => openModal(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      openModal(item.id);
                    }
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 詳細説明 */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Info className="text-primary" size={24} />
            {i18n.details}
          </h2>

          <div className="prose max-w-none">
            <p className="text-text-muted mb-6">
              {spotData?.description || '人気のスポットです。見どころや歴史、周辺情報をチェックして計画に役立てましょう。'}
            </p>

            {spotData?.location?.address && (
              <p className="text-text-muted mb-6">
                <strong className="text-secondary">{i18n.address}:</strong> {spotData.location.address}
              </p>
            )}

            {spotData?.tags && spotData.tags.length > 0 && (
              <>
                <h3 className="text-secondary">{i18n.highlights}</h3>
                <ul className="list-disc list-inside space-y-2 text-text-muted mb-6">
                  {spotData.tags.slice(0, 8).map((t, i) => (
                    <li key={`${t}-${i}`}>{tagToLabel(t)}</li>
                  ))}
                </ul>
              </>
            )}

            {(!spotData?.description && !spotData?.tags?.length) && (
              <>
                <h3 className="text-secondary">{i18n.highlights}</h3>
                <ul className="list-disc list-inside space-y-2 text-text-muted mb-6">
                  <li>{lang === 'en' ? 'Panoramic views and seasonal events' : lang === 'ko' ? '전망과 계절별 행사' : lang === 'fr' ? 'Vues panoramiques et événements saisonniers' : '360度の眺望や季節ごとのイベント'}</li>
                  <li>{lang === 'en' ? 'Plenty of shopping and dining nearby' : lang === 'ko' ? '주변 쇼핑과 식당도 풍부' : lang === 'fr' ? 'Nombreux commerces et restaurants à proximité' : '周辺のショッピングやグルメも充実'}</li>
                </ul>
              </>
            )}
          </div>
        </section>

        {/* 口コミ・レビュー */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <MessageSquare className="text-primary" size={24} />
            {i18n.reviewsTitle}
          </h2>

          <div className="space-y-6">
            {[
              {
                name: '田中太郎',
                rating: 5,
                date: '2024/08/20',
                comment:
                  '夜景が本当に美しかったです！特にトップデッキからの眺めは圧巻でした。少し混雑していましたが、スタッフの対応も良く満足できました。',
              },
              {
                name: 'Sarah Johnson',
                rating: 4,
                date: '2024/08/18',
                comment:
                  'Amazing views of Tokyo! The elevator ride was smooth and the observation decks were well-maintained. A bit pricey but worth the experience for first-time visitors.',
              },
              {
                name: '山田花子',
                rating: 4,
                date: '2024/08/15',
                comment:
                  '家族で訪問しました。子供たちも大興奮でした。フットタウンにもたくさんの楽しい施設があり、一日中楽しめます。',
              },
            ].map((review, index) => (
              <div
                key={index}
                className="border-b border-border-light pb-6 hover:bg-slate-50/50 -mx-4 px-4 py-4 rounded-xl transition-colors"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-secondary">
                    {review.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="text-text-light text-sm">{review.date}</span>
                  </div>
                </div>
                <p className="text-text-muted leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SNSリアルタイム情報 */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Twitter className="text-primary" size={24} />
            SNS・リアルタイム情報
          </h2>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 text-center">
            <Twitter className="mx-auto mb-4 text-blue-400" size={48} />
            <div className="text-lg font-semibold mb-2">
              #東京タワー #TokyoTower のリアルタイム投稿
            </div>
            <p className="text-text-muted mb-6">
              最新の投稿や混雑状況をチェックできます
            </p>
            <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
              最新情報を読み込み
            </button>
          </div>
        </section>

        {/* チケット・予約CTA */}
        <section
          id="tickets"
          className="bg-gradient-to-br from-primary to-primary-light rounded-3xl p-12 text-center text-white mb-12 relative overflow-hidden"
        >
          {/* 背景パターン */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='2' fill='white'/%3E%3C/svg%3E")`,
                backgroundSize: '50px 50px',
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="flex items-center justify-center gap-4 mb-4">
              <Ticket size={32} />
              チケット・予約
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              事前予約でスムーズに入場！特別料金もご用意しています。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white/90 text-secondary rounded-xl font-semibold backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300">
                公式サイトで予約
              </button>
              <button className="px-8 py-4 bg-white/90 text-secondary rounded-xl font-semibold backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300">
                チケット予約サイト
              </button>
            </div>
          </div>
        </section>

        {/* 設備・注意事項 */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Info className="text-primary" size={24} />
            設備・注意事項
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Baby, text: 'ベビーカー利用可', available: true },
              { icon: Accessibility, text: 'バリアフリー対応', available: true },
              { icon: Bath, text: '多目的トイレあり', available: true },
              { icon: Camera, text: '撮影OK', available: true },
              { icon: Ban, text: '全館禁煙', available: false },
              { icon: Wifi, text: '無料Wi-Fi', available: true },
              { icon: Store, text: 'お土産ショップ', available: true },
              { icon: Utensils, text: 'レストラン・カフェ', available: true },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-transform hover:scale-105 ${
                  item.available
                    ? 'border-success/20 text-success bg-green-50'
                    : 'border-danger/20 text-danger bg-red-50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-secondary mb-4">注意事項</h3>
          <ul className="list-disc list-inside space-y-2 text-text-muted">
            <li>悪天候時は展望台が閉鎖される場合があります</li>
            <li>大きな荷物は有料ロッカーをご利用ください</li>
            <li>ペットの同伴はできません（盲導犬等は除く）</li>
            <li>三脚を使用した撮影は禁止されています</li>
            <li>混雑時は入場制限を行う場合があります</li>
          </ul>
        </section>

        {/* よくある質問 */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <HelpCircle className="text-primary" size={24} />
            よくある質問
          </h2>

          <div className="space-y-4">
            {[
              {
                question: '営業時間を教えてください',
                answer:
                  'メインデッキ：9:00～23:00（最終入場 22:30）\nトップデッキ：9:00～22:45（最終入場 22:00～22:15）\nフットタウン：10:00～21:00（店舗により異なります）',
              },
              {
                question: '料金はいくらですか？',
                answer:
                  'メインデッキ：大人 1,200円、高校生 1,000円、小中学生 700円、幼児（4歳以上） 500円\nトップデッキ：+2,800円（13歳以上）、+1,800円（小学生）、+1,200円（幼児）',
              },
              {
                question: '予約は必要ですか？',
                answer:
                  'メインデッキは予約不要ですが、トップデッキは事前予約が必要です。特に土日祝日や夜景の時間帯は混雑するため、事前予約をおすすめします。',
              },
              {
                question: '車椅子でも利用できますか？',
                answer:
                  'はい、バリアフリー対応しており、車椅子でもご利用いただけます。エレベーターや多目的トイレも完備しています。',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border border-border-light rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 flex justify-between items-center transition-colors"
                >
                  <span className="font-semibold text-secondary">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-primary transition-transform ${
                      activeFAQ === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeFAQ === index && (
                  <div className="p-6 bg-white">
                    <p className="text-text-muted whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 近隣スポット */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Map className="text-primary" size={24} />
            近隣の観光スポット
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: '増上寺',
                distance: '徒歩3分',
                category: '歴史ある寺院',
                description:
                  '東京タワーを背景にした美しい寺院。徳川家の菩提寺として有名です。',
                color: 'from-green-400 to-green-600',
              },
              {
                name: '芝公園',
                distance: '徒歩1分',
                category: '都市公園',
                description:
                  '東京タワーの足元に広がる緑豊かな公園。散歩やピクニックにおすすめです。',
                color: 'from-emerald-400 to-emerald-600',
              },
              {
                name: '愛宕神社',
                distance: '徒歩8分',
                category: '神社',
                description:
                  '出世の石段で有名な神社。東京23区で最も高い自然の山にあります。',
                color: 'from-blue-400 to-blue-600',
              },
            ].map((spot, index) => (
              <div
                key={index}
                className="border border-border-light rounded-2xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white"
              >
                <div className={`h-48 bg-gradient-to-br ${spot.color}`} />
                <div className="p-6">
                  <h3 className="font-semibold text-secondary mb-2">{spot.name}</h3>
                  <p className="text-primary text-sm font-medium mb-3">
                    {spot.distance} • {spot.category}
                  </p>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {spot.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* モーダル */}
      {(activeModal || selectedImage) && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              ×
            </button>
            {selectedImage ? (
              <div className="relative w-[90vw] max-w-4xl h-[70vh]">
                <Image src={selectedImage} alt={`${spotData?.name || 'スポット'}の写真`} fill className="object-contain bg-slate-50" sizes="90vw" />
              </div>
            ) : (
              <div className="w-full h-72 md:h-80 bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
                <span className="text-2xl font-semibold">
                  {activeModal === 'exterior' && '外観'}
                  {activeModal === 'observatory' && '展望台'}
                  {activeModal === 'night' && '夜景'}
                  {activeModal === 'interior' && '内部'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
