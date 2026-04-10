'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { db, doc, getDoc } from '@/lib/firebase';
import { TouristSpot } from '@/types';
import { allBookstoreSpots } from '@/data/tokyo-bookstore-spots';
import { allRestaurantSpots } from '@/data/tokyo-restaurant-spots';
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
  Lock,
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
  Share2,
  Bookmark,
  Eye,
  Mountain,
  Sunrise,
  Sunset,
  Cloud,
  Sun,
  Train,
  Car,
  Navigation,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Globe,
  Phone,
  Mail,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRoute } from '@/contexts/RouteContext';
import { useAuth } from '@/contexts/AuthContext';
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
  spotId?: string;
  spot?: TouristSpot;
  locale?: string;
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
  spot,
  locale,
  language: _language = 'ja',
  currency = 'jpy',
  unit: _unit = 'metric',
}: MainContentProps) {
  const { user, loading: authLoading, signInWithGoogle, signInWithApple } = useAuth();
  const isLoggedIn = !!user;
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [spotData, setSpotData] = useState<SpotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [snsExpanded, setSnsExpanded] = useState(false);
  // Secondary tabs (legacy). We keep for internal sections but do not show in UI now.
  const [activeTab, setActiveTab] = useState<'reviews' | 'details' | 'tickets' | 'sns' | 'faq' | 'nearby'>('details');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);

  // Main top-level tabs requested: 基本情報 / 見どころ / AIプラン / レビュー
  const [mainTab, setMainTab] = useState<'basic' | 'highlights' | 'ai' | 'reviews'>('basic');
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Simple local poll + UGC
  const [pollChoice, setPollChoice] = useState<'morning' | 'night' | null>(null);
  const [pollStats, setPollStats] = useState<{ morning: number; night: number }>({ morning: 12, night: 18 });
  const [visited, setVisited] = useState<boolean>(false);
  const [visitedCount, setVisitedCount] = useState<number>(128);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ text: string; ts: number }[]>([]);

  // Currency conversion helper
  const convertPrice = (jpyPrice: number) => {
    const rates = { usd: 0.0067, eur: 0.0061, gbp: 0.0053 };
    if (currency === 'usd') return `≈ $${Math.round(jpyPrice * rates.usd)}`;
    if (currency === 'eur') return `≈ €${Math.round(jpyPrice * rates.eur)}`;
    if (currency === 'gbp') return `≈ £${Math.round(jpyPrice * rates.gbp)}`;
    return '';
  };
  // AI旅行プラン用: 選択スポットを保存
  let addSpot: (arg: any) => void = (_: any) => { };
  let selectedSpotsFromCtx: any[] = [];
  try {
    // Hooks must be called unconditionally during render
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ({ addSpot, selectedSpots: selectedSpotsFromCtx } = useRoute() as any);
  } catch { }

  // i18n labels（propsのlocaleを優先、それでもなければデフォルト）
  const { currentLanguage: ctxLanguage } = useLanguage();
  const [currentLang, setCurrentLang] = useState<string>(locale || ctxLanguage || _language || 'ja');
  const lang = currentLang as 'ja' | 'en' | 'ko' | 'fr' | 'ar';
  const localePrefix = lang === 'ja' ? '' : `/${lang}`;
  const aiPlanPath = `${localePrefix}/ai-plan`;

  // localeプロパティが変更された時に言語状態を更新
  useEffect(() => {
    if (locale && locale !== currentLang) {
      setCurrentLang(locale);
    } else if (!locale && ctxLanguage && ctxLanguage !== currentLang) {
      setCurrentLang(ctxLanguage);
    }
  }, [locale, ctxLanguage, currentLang]);

  const handleLanguageChange = (newLang: string) => {
    setCurrentLang(newLang);
  };

  // 言語設定はpropsから取得（SSG対応）
  const dicts = {
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
      mainPhoto: 'メイン写真',
      clickToEnlarge: 'クリックで拡大',
      heroSubtitle: 'スポット詳細',
      addToFavoritesBtn: 'お気に入りに追加',
      addToAIPlanBtn: 'AI旅行プランに入れる',
      ticketsBtn: 'チケット予約',
      fallbackDescription: '人気のスポットです。見どころや歴史、周辺情報をチェックして計画に役立てましょう。',
      reviewsTitle: '口コミ・レビュー',
      bookTickets: 'チケット予約',
      addToPlan: 'プランに追加',
      save: '保存',
      share: '共有',
      quickSummary: '3秒要約',
      ticketInfo: 'チケット情報',
      accessInfo: 'アクセス情報',
      bestTime: 'おすすめ時間',
      weatherInsight: '天気・視界',
      crowdForecast: '混雑予報',
      reviewSummary: 'レビュー要約',
      snsRealtime: 'SNSリアルタイム',
      facilities: '設備・注意事項',
      faq: 'よくある質問',
      quickFacts: '要点まとめ',
      officialSite: '公式サイト',
      nearbyAttractions: '近隣の観光スポット',
      fromLabel: 'から',
      openInGoogleMaps: 'Googleマップで開く',
      weatherVisibilityTitle: '本日の視界',
      weatherVisibilityExcellent: 'とても良い',
      weatherBestTimeTitle: 'ベストな時間帯',
      weatherMorningRecommended: '午前がおすすめ',
      highlightsSub: {
        observatory: '360°の眺望',
        night_view: '日没後がベスト',
        mt_fuji_view: '晴れた朝',
        landmark: '東京の象徴',
        photo_spot: '映える写真',
        shopping: 'フットタウンなど'
      },
      fromShinjuku: '新宿から',
      fromShibuya: '渋谷から',
      fromHaneda: '羽田から',
      positivePointsTitle: '高評価ポイント',
      improvementPointsTitle: '改善ポイント',
      positiveBullets: [
        '360°の絶景が楽しめる',
        '夜景とイルミネーションが美しい',
        'アクセスが良く移動がしやすい'
      ],
      improvementBullets: [
        'ピーク時間は混雑しやすい',
        '他の展望施設に比べ料金がやや高め'
      ],
      nearbyStations: '最寄り駅',
      accessByCar: '車でのアクセス',
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
      mainPhoto: 'Main Photo',
      clickToEnlarge: 'Click to enlarge',
      heroSubtitle: 'Attraction Details',
      addToFavoritesBtn: 'Add to Favorites',
      addToAIPlanBtn: 'Add to AI Plan',
      ticketsBtn: 'Book Tickets',
      fallbackDescription: 'A popular attraction. Check highlights and info to plan your visit.',
      reviewsTitle: 'Reviews',
      bookTickets: 'Book Tickets',
      addToPlan: 'Add to Plan',
      save: 'Save',
      share: 'Share',
      quickSummary: '3-Second Summary',
      ticketInfo: 'Ticket Information',
      accessInfo: 'Access Information',
      bestTime: 'Best Time to Visit',
      weatherInsight: 'Weather & Visibility',
      crowdForecast: 'Crowd Forecast',
      reviewSummary: 'Review Summary',
      snsRealtime: 'Social Media Updates',
      facilities: 'Facilities & Important Notes',
      faq: 'Frequently Asked Questions',
      quickFacts: 'Quick Facts',
      officialSite: 'Official Site',
      nearbyAttractions: 'Nearby Attractions',
      fromLabel: 'From',
      openInGoogleMaps: 'Open in Google Maps',
      weatherVisibilityTitle: "Today's Visibility",
      weatherVisibilityExcellent: 'Excellent',
      weatherBestTimeTitle: 'Best Time',
      weatherMorningRecommended: 'Morning recommended',
      highlightsSub: {
        observatory: '360° city views',
        night_view: 'Best after sunset',
        mt_fuji_view: 'Clear mornings',
        landmark: 'Tokyo symbol',
        photo_spot: 'Instagram worthy',
        shopping: 'FootTown mall'
      },
      fromShinjuku: 'From Shinjuku',
      fromShibuya: 'From Shibuya',
      fromHaneda: 'From Haneda',
      positivePointsTitle: 'Top Positive Points',
      improvementPointsTitle: 'Areas for Improvement',
      positiveBullets: [
        'Amazing panoramic views',
        'Great night illumination and city lights',
        'Convenient location and easy access'
      ],
      improvementBullets: [
        'Can get very crowded during peak times',
        'Higher prices compared to other observation decks'
      ],
      nearbyStations: 'Nearby Stations',
      accessByCar: 'Access by Car',
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
      mainPhoto: '메인 사진',
      clickToEnlarge: '클릭하여 확대',
      heroSubtitle: '스팟 상세',
      addToFavoritesBtn: '즐겨찾기에 추가',
      addToAIPlanBtn: 'AI 여행 일정에 추가',
      ticketsBtn: '티켓 예약',
      fallbackDescription: '인기 있는 장소입니다. 볼거리와 정보를 확인해 일정을 계획해 보세요.',
      reviewsTitle: '리뷰',
      bookTickets: '티켓 예약',
      addToPlan: '일정에 추가',
      save: '저장',
      share: '공유',
      quickSummary: '3초 요약',
      ticketInfo: '티켓 정보',
      accessInfo: '교통 정보',
      bestTime: '추천 시간',
      weatherInsight: '날씨・시야',
      crowdForecast: '혼잡 예보',
      reviewSummary: '리뷰 요약',
      snsRealtime: 'SNS 실시간',
      facilities: '시설・주의사항',
      faq: '자주 묻는 질문',
      quickFacts: '요점 정리',
      officialSite: '공식 사이트',
      nearbyAttractions: '주변 관광 명소',
      fromLabel: '부터',
      openInGoogleMaps: 'Google 지도에서 열기',
      weatherVisibilityTitle: '오늘의 가시성',
      weatherVisibilityExcellent: '매우 좋음',
      weatherBestTimeTitle: '최적 시간',
      weatherMorningRecommended: '오전 추천',
      highlightsSub: {
        observatory: '360° 전망',
        night_view: '해진 후가 베스트',
        mt_fuji_view: '맑은 아침',
        landmark: '도쿄의 상징',
        photo_spot: '인생샷 명소',
        shopping: '푸트타운 등'
      },
      fromShinjuku: '신주쿠에서',
      fromShibuya: '시부야에서',
      fromHaneda: '하네다에서',
      positivePointsTitle: '장점',
      improvementPointsTitle: '개선점',
      positiveBullets: [
        '탁 트인 파노라마 전망',
        '야경과 조명이 아름다움',
        '교통이 편리하고 접근성 좋음'
      ],
      improvementBullets: [
        '피크 시간대에는 매우 혼잡',
        '다른 전망대에 비해 요금이 다소 높음'
      ],
      nearbyStations: '가까운 역',
      accessByCar: '자동차 이용',
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
      mainPhoto: 'Photo principale',
      clickToEnlarge: 'Cliquer pour agrandir',
      heroSubtitle: 'Détails du lieu',
      addToFavoritesBtn: 'Ajouter aux favoris',
      addToAIPlanBtn: "Ajouter au plan IA",
      ticketsBtn: 'Réserver des billets',
      fallbackDescription: "Lieu populaire. Consultez les points forts et les infos pour planifier votre visite.",
      reviewsTitle: 'Avis',
      bookTickets: 'Réserver des billets',
      addToPlan: 'Ajouter au plan',
      save: 'Sauvegarder',
      share: 'Partager',
      quickSummary: 'Résumé en 3 secondes',
      ticketInfo: 'Informations sur les billets',
      accessInfo: 'Informations d\'accès',
      bestTime: 'Meilleur moment pour visiter',
      weatherInsight: 'Météo et visibilité',
      crowdForecast: 'Prévision d\'affluence',
      reviewSummary: 'Résumé des avis',
      snsRealtime: 'Mises à jour des réseaux sociaux',
      facilities: 'Installations et notes importantes',
      faq: 'Questions fréquemment posées',
      quickFacts: 'À retenir',
      officialSite: 'Site officiel',
      nearbyAttractions: 'Attractions à proximité',
      fromLabel: 'À partir de',
      openInGoogleMaps: 'Ouvrir dans Google Maps',
      weatherVisibilityTitle: "Visibilité du jour",
      weatherVisibilityExcellent: 'Excellente',
      weatherBestTimeTitle: 'Meilleur moment',
      weatherMorningRecommended: 'Matin recommandé',
      highlightsSub: {
        observatory: 'Vue panoramique 360°',
        night_view: 'Idéal après le coucher du soleil',
        mt_fuji_view: 'Matins dégagés',
        landmark: 'Symbole de Tokyo',
        photo_spot: 'Spot photo',
        shopping: 'FootTown, etc.'
      },
      fromShinjuku: 'Depuis Shinjuku',
      fromShibuya: 'Depuis Shibuya',
      fromHaneda: 'Depuis Haneda',
      positivePointsTitle: 'Points positifs',
      improvementPointsTitle: 'Points à améliorer',
      positiveBullets: [
        'Vues panoramiques impressionnantes',
        'Belles illuminations nocturnes',
        'Situation pratique et accès facile'
      ],
      improvementBullets: [
        "Peut être très fréquenté aux heures de pointe",
        'Tarifs plus élevés que d’autres observatoires'
      ],
      nearbyStations: 'Gares proches',
      accessByCar: 'Accès en voiture',
    },
  } as const;
  const i18n = dicts[lang] || dicts.en;


  // クライアントサイドであることを確認
  useEffect(() => {
    setIsClient(true);
    setIsMounted(true);
  }, []);

  // Restore simple local UGC state per spot
  useEffect(() => {
    const keyBase = spotId || (spotData?.googlePlaceId as string) || (spotData?.name || 'spot');
    try {
      const poll = localStorage.getItem(`poll-${keyBase}`);
      if (poll) {
        const { choice, stats } = JSON.parse(poll);
        if (choice) setPollChoice(choice);
        if (stats) setPollStats(stats);
      }
      const v = localStorage.getItem(`visited-${keyBase}`);
      if (v) {
        const { visited: vv, count } = JSON.parse(v);
        if (typeof vv === 'boolean') setVisited(vv);
        if (typeof count === 'number') setVisitedCount(count);
      }
      const c = localStorage.getItem(`comments-${keyBase}`);
      if (c) setComments(JSON.parse(c));
    } catch {}
  }, [spotId, spotData?.googlePlaceId, spotData?.name]);

  useEffect(() => {
    const fetchSpotData = async () => {
      // If spot is directly provided, use it
      if (spot) {
        const convertedSpot: SpotData = {
          name: spot.name,
          description: spot.description || i18n.fallbackDescription,
          location: spot.location,
          price: spot.priceRange === 'expensive' ? '¥3,000以上' :
            spot.priceRange === 'moderate' ? '¥1,000-3,000' : '¥1,000以下',
          hours: spot.openingHours ? Object.values(spot.openingHours)[0] : '営業時間未定',
          rating: spot.rating || 4.0,
          images: spot.images || [],
          contact: spot.contact,
          tags: spot.tags || [],
          googlePlaceId: spot.googlePlaceId,
          openingHours: spot.openingHours,
          priceRange: spot.priceRange,
          reviewCount: spot.reviewCount,
          crowdLevel: (spot as any).crowdLevel,
          averageStayMinutes: spot.averageStayMinutes,
          stayRange: spot.stayRange
        };
        setSpotData(convertedSpot);
        setLoading(false);
        return;
      }

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

      // Then check local restaurant data
      if (!localSpot) {
        const restaurantSpot = allRestaurantSpots.find(spot =>
          spot.id === spotId || spot.googlePlaceId === spotId
        );
        if (restaurantSpot) {
          const convertedSpot: SpotData = {
            name: restaurantSpot.name,
            description: restaurantSpot.description || '人気のスポットです',
            location: restaurantSpot.location,
            price: (restaurantSpot as any).priceText || (restaurantSpot.priceRange === 'expensive' ? '¥3,000以上' :
              restaurantSpot.priceRange === 'moderate' ? '¥1,000-3,000' : restaurantSpot.priceRange === 'luxury' ? '¥20,000以上' : '¥1,000以下'),
            hours: restaurantSpot.openingHours ? (Object.values(restaurantSpot.openingHours)[0] as any) : '営業時間未定',
            rating: restaurantSpot.rating || 4.0,
            images: restaurantSpot.images || [],
            contact: restaurantSpot.contact,
            tags: restaurantSpot.tags || [],
            googlePlaceId: restaurantSpot.googlePlaceId,
            openingHours: restaurantSpot.openingHours,
            priceRange: restaurantSpot.priceRange,
            reviewCount: (restaurantSpot as any).reviewCount,
            crowdLevel: (restaurantSpot as any).crowdLevel,
            averageStayMinutes: (restaurantSpot as any).averageStayMinutes,
            stayRange: (restaurantSpot as any).stayRange
          };
          setSpotData(convertedSpot);
          setLoading(false);
          return;
        }
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
  }, [spotId, spot, lang]);

  // Contextual hero subtitle based on spot type/name/tags
  const getHeroSubtitleText = () => {
    const n = (spotData?.name || '').toLowerCase();
    const tags = (spotData?.tags || []).map(t => t.toLowerCase());
    const has = (k: string) => n.includes(k) || tags.includes(k);
    // Restaurants
    if (has('ramen') || /ラーメン/.test(spotData?.name || '')) {
      return lang === 'en' ? 'Popular ramen with rich broth and handcrafted noodles' :
        lang === 'ko' ? '진한 육수와 수제 면의 인기 라멘' :
          lang === 'fr' ? 'Ramen populaire au bouillon riche et aux nouilles artisanales' :
            '濃厚スープと自家製麺が人気のラーメン店';
    }
    if (has('sushi') || /寿司|鮨/.test(spotData?.name || '')) {
      return lang === 'en' ? 'Top-rated sushi crafted with seasonal seafood' :
        lang === 'ko' ? '제철 해산물로 빚는 인기 스시' :
          lang === 'fr' ? 'Sushi réputé élaboré avec des produits de saison' :
            '旬の海鮮で握る評判の寿司店';
    }
    if (has('beef') || /牛かつ|焼肉|牛肉/.test(spotData?.name || '')) {
      return lang === 'en' ? 'Local favorite for premium beef dishes' :
        lang === 'ko' ? '프리미엄 소고기 요리로 유명한 맛집' :
          lang === 'fr' ? 'Adresse prisée pour ses plats de bœuf' :
            '上質な牛肉料理で人気の名店';
    }
    // Sights defaults
    if (/tower|タワー|スカイツリー/i.test(n) || /東京タワー|スカイツリー/.test(spotData?.name || '')) {
      return lang === 'en' ? 'Iconic tower with breathtaking city views' :
        lang === 'ko' ? '숨막히는 도시 전망을 자랑하는 상징적인 타워' :
          lang === 'fr' ? 'Tour emblématique avec des vues imprenables' :
            '息をのむ都市の景色が広がる象徴的なタワー';
    }
    // Generic fallback
    return lang === 'en' ? 'Highlights, tips and access info at a glance' :
      lang === 'ko' ? '볼거리, 팁, 교통 정보를 한눈에' :
        lang === 'fr' ? 'Points forts, conseils et accès en un coup d’œil' :
          '見どころ・コツ・アクセス情報をまとめてチェック';
  };

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
    setToastMsg(message);
    try {
      clearTimeout((window as unknown as Record<string, ReturnType<typeof setTimeout>>).__toastTimer);
      (window as unknown as Record<string, ReturnType<typeof setTimeout>>).__toastTimer = setTimeout(() => setToastMsg(null), 2600);
    } catch { }
  };

  const addToFavorites = () => {
    showNotification('お気に入りに追加しました！', 'success');
  };

  const addToAITravelPlan = () => {
    if (!isLoggedIn) {
      const loginMessage = lang === 'en' ? 'Please log in to use AI travel planning. Redirecting to login...' :
        lang === 'ko' ? 'AI 여행 계획을 사용하려면 로그인해 주세요. 로그인 페이지로 이동 중...' :
          lang === 'fr' ? 'Veuillez vous connecter pour utiliser la planification de voyage IA. Redirection vers la connexion...' :
            'AI旅行プランを使用するにはログインしてください。ログインページに移動中...';

      showNotification(loginMessage);

      // ログイン後にAI旅行プラン画面に戻れるように、現在のスポットIDを保存
      try {
        sessionStorage.setItem('pending-spot-add', spotId);
        sessionStorage.setItem('return-to-ai-plan', '1');
      } catch (error) {
        console.error('Error saving pending spot:', error);
      }

      // 2秒後にログインページに移動
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    if (!spotData) {
      showNotification(
        lang === 'en' ? 'Spot information is not loaded yet' :
          lang === 'ko' ? '스팟 정보가 아직 로드되지 않았습니다' :
            lang === 'fr' ? 'Les informations sur le lieu ne sont pas encore chargées' :
              'スポット情報が読み込めていません',
        'info'
      );
      return;
    }
    const spotForPlan = {
      id: spotId,
      name: spotData.name,
      description: spotData.description || '',
      category: 'sightseeing',
      area: 'tokyo',
      location: {
        lat: spotData.location?.lat || 35.68,
        lng: spotData.location?.lng || 139.76,
        address: spotData.location?.address || ''
      },
      rating: spotData.rating,
      images: spotData.images || [],
      openingHours: spotData.openingHours,
      priceRange: spotData.priceRange as any,
      tags: spotData.tags || [],
      googlePlaceId: spotData.googlePlaceId,
      reviews: []
    } as any;
    // コンテキストに追加
    try {
      addSpot(spotForPlan);
      console.log('✅ Added spot to context:', spotForPlan.name);
    } catch (error) {
      console.error('❌ Error adding spot to context:', error);
    }

    // localStorageに保存（ページ遷移直後の読み込み対策）
    try {
        const raw = localStorage.getItem('selected-spots');
        const arr = raw ? JSON.parse(raw) : [];
        const exists = Array.isArray(arr) && arr.some((s: any) => s.id === spotForPlan.id);
        if (!exists) {
          const next = Array.isArray(arr) ? [...arr, spotForPlan] : [spotForPlan];
          localStorage.setItem('selected-spots', JSON.stringify(next));
          console.log('✅ Saved to localStorage. Total spots:', next.length);
        } else {
          console.log('ℹ️ Spot already exists in localStorage');
        }
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }

    // セッションストレージにフラグを設定
    try {
      sessionStorage.setItem('ai-plan-added', '1');
      sessionStorage.setItem('last-added-spot', spotId);
      console.log('✅ Set session storage flags');
    } catch (error) {
      console.error('❌ Error setting session storage:', error);
    }
    const total = (selectedSpotsFromCtx?.length || 0) + 1;

    // 成功メッセージを表示
    const successMessage = lang === 'en' ? `✅ Added to AI travel plan! Redirecting...` :
      lang === 'ko' ? `✅ AI 여행 계획에 추가되었습니다! 이동 중...` :
        lang === 'fr' ? `✅ Ajouté au plan de voyage IA ! Redirection...` :
          `✅ AI旅行プランに追加しました！移動中...`;

    showNotification(successMessage, 'success');
    console.log('🚀 Showing success notification and preparing to navigate');

    // 1.5秒後にAI旅行プラン画面に移動（より確実に）
    setTimeout(() => {
      try {
        console.log('Navigating to AI plan page...');
        window.location.href = aiPlanPath;
      } catch (error) {
        console.error('Error navigating to AI plan:', error);
        // フォールバック
        window.open(aiPlanPath, '_self');
      }
    }, 1500);
  };


  // Multilingual tag translator for Highlights (with Tokyo Tower specifics)
  const tagToLabel = (tag: string) => {
    const normalize = (s: string) => {
      if (/展望台|observatory/i.test(s)) return 'observatory';
      if (/夜景|night/i.test(s)) return 'night_view';
      if (/ランドマーク|landmark/i.test(s)) return 'landmark';
      if (/333m|電波塔|broadcast/i.test(s)) return 'broadcast_tower_333m';
      if (/東京.*シンボル|symbol.*tokyo/i.test(s)) return 'symbol_of_tokyo';
      if (/メインデッキ|main\s*deck/i.test(s)) return 'main_deck';
      if (/トップデッキ|top\s*deck/i.test(s)) return 'top_deck';
      if (/富士山|fuji/i.test(s)) return 'mt_fuji_view';
      // generic types
      if (/book_store|書店/i.test(s)) return 'book_store';
      if (/museum|博物館/i.test(s)) return 'museum';
      if (/art|美術館/i.test(s)) return 'art_gallery';
      if (/park|公園/i.test(s)) return 'park';
      if (/temple|寺/i.test(s)) return 'temple';
      if (/shrine|神社/i.test(s)) return 'shrine';
      if (/nature|自然/i.test(s)) return 'nature';
      if (/culture|文化/i.test(s)) return 'culture';
      if (/cafe|カフェ/i.test(s)) return 'cafe';
      if (/food|グルメ/i.test(s)) return 'food';
      if (/shopping|ショッピング/i.test(s)) return 'shopping';
      if (/store|店舗/i.test(s)) return 'store';
      if (/観光|interest/i.test(s)) return 'point_of_interest';
      return s;
    };

    const key = normalize(tag);
    const dict: Record<string, Record<string, string>> = {
      ja: {
        observatory: '展望台',
        night_view: '夜景',
        landmark: 'ランドマーク',
        broadcast_tower_333m: '333m電波塔',
        symbol_of_tokyo: '東京シンボル',
        main_deck: 'メインデッキ',
        top_deck: 'トップデッキ',
        mt_fuji_view: '富士山眺望',
        book_store: '書店', museum: '博物館', art_gallery: '美術館', park: '公園', temple: '寺院', shrine: '神社', nature: '自然', culture: '文化', cafe: 'カフェ', food: 'グルメ', shopping: 'ショッピング', store: '店舗', point_of_interest: '観光',
      },
      en: {
        observatory: 'Observatory',
        night_view: 'Night View',
        landmark: 'Landmark',
        broadcast_tower_333m: '333m Broadcast Tower',
        symbol_of_tokyo: 'Tokyo Symbol',
        main_deck: 'Main Deck',
        top_deck: 'Top Deck',
        mt_fuji_view: 'Mt. Fuji View',
        book_store: 'Bookstore', museum: 'Museum', art_gallery: 'Art Gallery', park: 'Park', temple: 'Temple', shrine: 'Shrine', nature: 'Nature', culture: 'Culture', cafe: 'Cafe', food: 'Gourmet', shopping: 'Shopping', store: 'Store', point_of_interest: 'Attraction',
      },
      ko: {
        observatory: '전망대',
        night_view: '야경',
        landmark: '랜드마크',
        broadcast_tower_333m: '333m 방송탑',
        symbol_of_tokyo: '도쿄의 상징',
        main_deck: '메인 데크',
        top_deck: '톱 데크',
        mt_fuji_view: '후지산 전망',
        book_store: '서점', museum: '박물관', art_gallery: '미술관', park: '공원', temple: '사찰', shrine: '신사', nature: '자연', culture: '문화', cafe: '카페', food: '미식', shopping: '쇼핑', store: '상점', point_of_interest: '관광',
      },
      fr: {
        observatory: 'Plateforme d’observation',
        night_view: 'Vue nocturne',
        landmark: 'Monument',
        broadcast_tower_333m: 'Tour de diffusion 333 m',
        symbol_of_tokyo: 'Symbole de Tokyo',
        main_deck: 'Main Deck',
        top_deck: 'Top Deck',
        mt_fuji_view: 'Vue sur le mont Fuji',
        book_store: 'Librairie', museum: 'Musée', art_gallery: 'Galerie d’art', park: 'Parc', temple: 'Temple', shrine: 'Sanctuaire', nature: 'Nature', culture: 'Culture', cafe: 'Café', food: 'Gastronomie', shopping: 'Shopping', store: 'Boutique', point_of_interest: 'Attraction',
      }
    };

    const table = dict[lang] || dict.ja;
    return table[key] || tag;
  };

  // 現在の営業時間を計算 - memoized
  const getBusinessHours = useMemo(() => {
    const prefix = lang === 'en' ? 'Today: ' : lang === 'ko' ? '오늘: ' : lang === 'fr' ? "Aujourd'hui: " : '本日: ';
    if (spotData?.openingHours) {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
      const key = days[new Date().getDay()];
      const today = (spotData.openingHours as Record<string, string | undefined>)[key];
      if (today) return `${prefix}${today}`;
    }
    if (spotData?.hours) return `${prefix}${spotData.hours}`;
    return lang === 'en' ? 'Today: Hours unavailable' : lang === 'ko' ? '오늘: 영업시간 미정' : lang === 'fr' ? "Aujourd'hui: Horaires indisponibles" : '本日: 営業時間未定';
  }, [spotData?.openingHours, spotData?.hours, lang]);

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

  // 混雑状況（簡易推定）- memoized
  const getCrowd = useMemo(() => {
    if (spotData?.crowdLevel) {
      const base = spotData.crowdLevel;
      const score = base === '混雑' ? 4 : base === '普通' ? 3 : 2;
      const label = score >= 4 ? i18n.crowdLabels.busy : score >= 3 ? i18n.crowdLabels.normal : i18n.crowdLabels.empty;
      return { label, score };
    }
    const rating = spotData?.rating ?? 4.0;
    let score = rating >= 4.4 ? 3 : rating >= 4.1 ? 2 : 1;

    // 時間ベースの計算（クライアントサイドでのみ実行）
    const d = new Date();
    const day = d.getDay();
    const h = d.getHours();
    if (day === 0 || day === 6) score += 1;
    if ((h >= 11 && h <= 13) || (h >= 16 && h <= 20)) score += 1;

    score = Math.max(1, Math.min(5, score));
    const label = score >= 4 ? i18n.crowdLabels.busy : score >= 3 ? i18n.crowdLabels.normal : i18n.crowdLabels.empty;
    return { label, score };
  }, [spotData?.crowdLevel, spotData?.rating, i18n.crowdLabels]);

  const getReviewCountDisplay = () => {
    const count: number | undefined = typeof spotData?.reviewCount === 'number'
      ? spotData.reviewCount
      : undefined;
    if (!count && count !== 0) return '';
    const n = count.toLocaleString();
    const suffix = lang === 'en' ? 'reviews' : lang === 'ko' ? '리뷰' : lang === 'fr' ? 'avis' : '件';
    return `(${n} ${suffix})`;
  };

  // スポットタイプに応じたメイン写真の背景グラデーション
  const getSpotMainPhotoGradient = (spotName: string) => {
    const name = spotName.toLowerCase();
    if (name.includes('タワー') || name.includes('tower')) {
      return 'linear-gradient(135deg, #ff6b6b, #ee5a24, #ff9ff3)';
    }
    if (name.includes('スカイツリー') || name.includes('skytree')) {
      return 'linear-gradient(135deg, #3742fa, #2f3542, #70a1ff)';
    }
    if (name.includes('寺') || name.includes('temple') || name.includes('神社') || name.includes('shrine')) {
      return 'linear-gradient(135deg, #2ed573, #1e3799, #ffa726)';
    }
    if (name.includes('公園') || name.includes('park')) {
      return 'linear-gradient(135deg, #26de81, #20bf6b, #0abde3)';
    }
    if (name.includes('美術館') || name.includes('博物館') || name.includes('museum')) {
      return 'linear-gradient(135deg, #a55eea, #8854d0, #4834d4)';
    }
    return 'linear-gradient(135deg, #ff6b6b, #ee5a24, #ff9ff3)'; // デフォルト（東京タワー）
  };

  // スポットタイプに応じたアイコン
  const getSpotIcon = (spotName: string) => {
    const name = spotName.toLowerCase();
    if (name.includes('タワー') || name.includes('tower')) {
      return '🗼';
    }
    if (name.includes('スカイツリー') || name.includes('skytree')) {
      return '🗼';
    }
    if (name.includes('寺') || name.includes('temple')) {
      return '🏯';
    }
    if (name.includes('神社') || name.includes('shrine')) {
      return '⛩️';
    }
    if (name.includes('公園') || name.includes('park')) {
      return '🌳';
    }
    if (name.includes('美術館') || name.includes('museum')) {
      return '🏛️';
    }
    if (name.includes('博物館')) {
      return '🏛️';
    }
    if (name.includes('城') || name.includes('castle')) {
      return '🏰';
    }
    return '🗼'; // デフォルト
  };

  // スポットタイプに応じた写真カテゴリを生成
  const generateSpotPhotos = (spotName: string) => {
    const name = spotName.toLowerCase();

    if (name.includes('タワー') || name.includes('tower')) {
      return [
        { id: 'exterior', label: '外観', icon: '🏢', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' },
        { id: 'observatory', label: '展望台', icon: '👁️', gradient: 'linear-gradient(135deg, #0abde3, #006ba6)' },
        { id: 'night', label: '夜景', icon: '🌃', gradient: 'linear-gradient(135deg, #2c2c54, #40407a)' },
        { id: 'interior', label: '内部', icon: '🚪', gradient: 'linear-gradient(135deg, #ffa726, #ff6f00)' },
        { id: 'illumination', label: 'ライトアップ', icon: '✨', gradient: 'linear-gradient(135deg, #e056fd, #a943e8)' },
        { id: 'view', label: '眺望', icon: '🏙️', gradient: 'linear-gradient(135deg, #26de81, #20bf6b)' },
      ];
    }

    if (name.includes('スカイツリー') || name.includes('skytree')) {
      return [
        { id: 'exterior', label: '外観', icon: '🗼', gradient: 'linear-gradient(135deg, #3742fa, #2f3542)' },
        { id: 'deck350', label: '展望デッキ350', icon: '🔭', gradient: 'linear-gradient(135deg, #0abde3, #006ba6)' },
        { id: 'deck450', label: '展望回廊450', icon: '👁️', gradient: 'linear-gradient(135deg, #70a1ff, #3742fa)' },
        { id: 'night', label: '夜景', icon: '🌃', gradient: 'linear-gradient(135deg, #2c2c54, #40407a)' },
        { id: 'solamachi', label: 'ソラマチ', icon: '🛍️', gradient: 'linear-gradient(135deg, #ffa726, #ff6f00)' },
        { id: 'illumination', label: 'ライトアップ', icon: '🌈', gradient: 'linear-gradient(135deg, #e056fd, #a943e8)' },
      ];
    }

    if (name.includes('寺') || name.includes('temple')) {
      return [
        { id: 'main_hall', label: '本堂', icon: '🏯', gradient: 'linear-gradient(135deg, #2ed573, #1e3799)' },
        { id: 'garden', label: '庭園', icon: '🌸', gradient: 'linear-gradient(135deg, #26de81, #20bf6b)' },
        { id: 'gate', label: '山門', icon: '⛩️', gradient: 'linear-gradient(135deg, #ffa726, #ff6f00)' },
        { id: 'statue', label: '仏像', icon: '🧘', gradient: 'linear-gradient(135deg, #a55eea, #8854d0)' },
        { id: 'autumn', label: '紅葉', icon: '🍁', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' },
        { id: 'night', label: '夜間ライトアップ', icon: '🏮', gradient: 'linear-gradient(135deg, #2c2c54, #40407a)' },
      ];
    }

    if (name.includes('神社') || name.includes('shrine')) {
      return [
        { id: 'torii', label: '鳥居', icon: '⛩️', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' },
        { id: 'main_shrine', label: '本殿', icon: '🏛️', gradient: 'linear-gradient(135deg, #2ed573, #1e3799)' },
        { id: 'garden', label: '境内', icon: '🌳', gradient: 'linear-gradient(135deg, #26de81, #20bf6b)' },
        { id: 'festival', label: '祭り', icon: '🎊', gradient: 'linear-gradient(135deg, #ffa726, #ff6f00)' },
        { id: 'omamori', label: 'お守り', icon: '🧿', gradient: 'linear-gradient(135deg, #a55eea, #8854d0)' },
        { id: 'night', label: '夜の参拝', icon: '🏮', gradient: 'linear-gradient(135deg, #2c2c54, #40407a)' },
      ];
    }

    if (name.includes('公園') || name.includes('park')) {
      return [
        { id: 'landscape', label: '風景', icon: '🌳', gradient: 'linear-gradient(135deg, #26de81, #20bf6b)' },
        { id: 'cherry', label: '桜', icon: '🌸', gradient: 'linear-gradient(135deg, #ff9ff3, #f368e0)' },
        { id: 'pond', label: '池', icon: '🦆', gradient: 'linear-gradient(135deg, #0abde3, #006ba6)' },
        { id: 'playground', label: '遊具', icon: '🛝', gradient: 'linear-gradient(135deg, #ffa726, #ff6f00)' },
        { id: 'autumn', label: '紅葉', icon: '🍁', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' },
        { id: 'walking', label: '散歩道', icon: '🚶', gradient: 'linear-gradient(135deg, #a55eea, #8854d0)' },
      ];
    }

    if (name.includes('美術館') || name.includes('博物館') || name.includes('museum')) {
      return [
        { id: 'exterior', label: '外観', icon: '🏛️', gradient: 'linear-gradient(135deg, #a55eea, #8854d0)' },
        { id: 'exhibition', label: '展示室', icon: '🖼️', gradient: 'linear-gradient(135deg, #4834d4, #2c2c54)' },
        { id: 'artwork', label: '作品', icon: '🎨', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' },
        { id: 'lobby', label: 'ロビー', icon: '🏢', gradient: 'linear-gradient(135deg, #0abde3, #006ba6)' },
        { id: 'shop', label: 'ミュージアムショップ', icon: '🛍️', gradient: 'linear-gradient(135deg, #ffa726, #ff6f00)' },
        { id: 'cafe', label: 'カフェ', icon: '☕', gradient: 'linear-gradient(135deg, #26de81, #20bf6b)' },
      ];
    }

    // デフォルト（東京タワー）
    return [
      { id: 'exterior', label: '外観', icon: '🏢', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' },
      { id: 'observatory', label: '展望台', icon: '👁️', gradient: 'linear-gradient(135deg, #0abde3, #006ba6)' },
      { id: 'night', label: '夜景', icon: '🌃', gradient: 'linear-gradient(135deg, #2c2c54, #40407a)' },
      { id: 'interior', label: '内部', icon: '🚪', gradient: 'linear-gradient(135deg, #ffa726, #ff6f00)' },
      { id: 'illumination', label: 'ライトアップ', icon: '✨', gradient: 'linear-gradient(135deg, #e056fd, #a943e8)' },
      { id: 'view', label: '眺望', icon: '🏙️', gradient: 'linear-gradient(135deg, #26de81, #20bf6b)' },
    ];
  };

  // モーダル用のヘルパー関数
  const getModalPhotoBackground = (modalId: string, spotName: string) => {
    const photos = generateSpotPhotos(spotName);
    const photo = photos.find(p => p.id === modalId);
    if (photo) return photo.gradient;

    // 個別のモーダル用
    if (modalId === 'main') return getSpotMainPhotoGradient(spotName);
    return 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
  };

  const getModalPhotoIcon = (modalId: string, spotName: string) => {
    const photos = generateSpotPhotos(spotName);
    const photo = photos.find(p => p.id === modalId);
    if (photo) return photo.icon;

    if (modalId === 'main') return getSpotIcon(spotName);
    return '📸';
  };

  const getModalPhotoLabel = (modalId: string, spotName: string) => {
    const photos = generateSpotPhotos(spotName);
    const photo = photos.find(p => p.id === modalId);
    if (photo) return photo.label;

    if (modalId === 'main') return i18n.mainPhoto;
    return '写真';
  };

  // ヒーローで使用する背景画像（スポット画像があれば最大3枚、なければ空のダミー3枚）
  const fallbackSky = [
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1600&auto=format&fit=crop&q=70',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&auto=format&fit=crop&q=70',
    'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1600&auto=format&fit=crop&q=70',
  ];
  let heroImages = Array.isArray(spotData?.images) && spotData!.images!.length > 0
    ? spotData!.images!.slice(0, 3)
    : [] as string[];
  // /images/spots/ のローカル参照は未配備の可能性があるため、外部のダミーに差し替える
  const toValidSrc = (src: string, i: number) => {
    if (!src || src.startsWith('/images/spots/')) return fallbackSky[i % fallbackSky.length];
    return src;
  };
  let heroImagesDisplay = heroImages.map((s, i) => toValidSrc(s, i));
  let galleryImages = (spotData?.images || []).map((s, i) => toValidSrc(s, i));
  // 3枚に満たない場合はダミーで埋める
  for (let i = 0; heroImagesDisplay.length < 3 && i < fallbackSky.length; i++) {
    heroImagesDisplay.push(fallbackSky[i]);
  }

  // Special background override for Tokyo Tower
  const isTokyoTower = spotId === '101' || /東京タワー|Tokyo\s*Tower/i.test(spotData?.name || '');
  if (isTokyoTower) {
    heroImagesDisplay = [
      '/images/tokyo_toewr/tokyo_toewr1.jpeg',
      '/images/tokyo_toewr/tokyo_toewr2.jpg',
      '/images/tokyo_toewr/tokyo_toewr3.jpg',
    ];
    galleryImages = [
      '/images/tokyo_toewr/tokyo_toewr1.jpeg',
      '/images/tokyo_toewr/tokyo_toewr2.jpg',
      '/images/tokyo_toewr/tokyo_toewr3.jpg',
    ];
  }

  // Dynamic import により SSR は無効化されているため、条件分岐不要

  return (
    <main className="min-h-screen pt-32 sm:pt-36 md:pt-40">
      {/* 上部固定CTAバーはUX簡素化のため削除（右下フローティングに集約） */}

      {/* ヒーローセクション - より魅力的なデザイン */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        {/* 背景（スライドショー） */}
        <div className="absolute inset-0">
          {heroImagesDisplay.map((src, i) => (
            <div key={`${src}-${i}`} className="hero-slide">
              <Image
                src={src}
                alt={`背景写真${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
          {/* 可読性向上のためのグラデーションオーバーレイ */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-8">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-16 bg-white/20 rounded mb-6"></div>
              <div className="h-8 bg-white/20 rounded mb-12"></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
                  {spotData?.name || 'Tokyo Tower'}
                </h1>
                <p className="text-xl md:text-2xl text-white/95 font-light tracking-wide drop-shadow-2xl">
                  {getHeroSubtitleText()}
                </p>
              </div>

              <div className="bg-white/95 text-gray-900 rounded-3xl px-6 md:px-10 py-7 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold">
                    {lang === 'en' ? 'Your personalized 1‑day sample itinerary' :
                     lang === 'ko' ? '당신만의 1일 모델 코스 (샘플)' :
                     lang === 'fr' ? 'Aperçu de votre itinéraire 1 jour (exemple)' :
                     lang === 'ar' ? 'نموذج مسار يومي مخصص لك' :
                     'あなた専用の1日モデルコース（サンプル）'}
                  </div>
                  <div className="text-xs text-gray-700/70">
                    {lang === 'en' ? 'Partial preview before login' :
                     lang === 'ko' ? '로그인 전 일부 미리보기' :
                     lang === 'fr' ? 'Aperçu partiel avant connexion' :
                     lang === 'ar' ? 'معاينة جزئية قبل تسجيل الدخول' :
                     'ログイン前の一部プレビュー'}
                  </div>
                </div>
                <ol className="space-y-3 text-left">
                  <li className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white grid place-items-center font-bold">1</div>
                    <div>
                      <div className="font-semibold">
                        {lang === 'en' ? `Morning: Start at ${spotData?.name || 'this spot'}` :
                         lang === 'ko' ? `아침: ${spotData?.name || '스팟'}에서 시작` :
                         lang === 'fr' ? `Matin : Départ à ${spotData?.name || 'ce lieu'}` :
                         lang === 'ar' ? `صباحاً: ابدأ في ${spotData?.name || 'هذا الموقع'}` :
                         `朝: ${spotData?.name || 'スポット'} をスタート`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {lang === 'en' ? '9:00–10:30 / Beat the crowds for a smooth visit' :
                         lang === 'ko' ? '9:00–10:30 / 혼잡을 피해 쾌적하게 관람' :
                         lang === 'fr' ? '9:00–10:30 / Évitez la foule pour une visite agréable' :
                         lang === 'ar' ? '9:00–10:30 / تجنّب الازدحام لزيارة مريحة' :
                         '9:00 - 10:30 / 混雑を避けて気持ちよく観光'}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 blur-sm select-none">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white grid place-items-center font-bold">2</div>
                    <div>
                      <div className="font-semibold">
                        {lang === 'en' ? 'Noon: Lunch & nearby walk' :
                         lang === 'ko' ? '점심: 런치 & 주변 산책' :
                         lang === 'fr' ? 'Midi : Déjeuner & balade à proximité' :
                         lang === 'ar' ? 'الظهيرة: غداء وجولة قريبة' :
                         '昼: ランチ & 周辺散策'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {lang === 'en' ? '11:30–13:30 / Local lunch suggestions' :
                         lang === 'ko' ? '11:30–13:30 / 현지 런치 추천' :
                         lang === 'fr' ? '11:30–13:30 / Suggestions de déjeuner local' :
                         lang === 'ar' ? '11:30–13:30 / اقتراحات غداء محلي' :
                         '11:30 - 13:30 / ご当地グルメを提案'}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 blur-sm select-none">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white grid place-items-center font-bold">3</div>
                    <div>
                      <div className="font-semibold">
                        {lang === 'en' ? 'Evening: Move to a viewpoint' :
                         lang === 'ko' ? '저녁: 절경 스팟으로 이동' :
                         lang === 'fr' ? 'Soir : Rejoindre un point de vue' :
                         lang === 'ar' ? 'مساءً: الانتقال إلى نقطة المشاهدة' :
                         '夕方: 絶景スポットへ移動'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {lang === 'en' ? '16:30–18:00 / Best for sunset' :
                         lang === 'ko' ? '16:30–18:00 / 노을 명소' :
                         lang === 'fr' ? '16:30–18:00 / Idéal pour le coucher du soleil' :
                         lang === 'ar' ? '16:30–18:00 / مثالي لغروب الشمس' :
                         '16:30 - 18:00 / サンセットの名所'}
                      </div>
                    </div>
                  </li>
                </ol>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => signInWithGoogle().catch(() => {})}
                    className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    {lang === 'en' ? 'Try a free plan in 60s' :
                     lang === 'ko' ? '60초 만에 무료 플랜 체험' :
                     lang === 'fr' ? 'Essayer un plan gratuit en 60 s' :
                     lang === 'ar' ? 'جرّب خطة مجانية خلال 60 ثانية' :
                     '60秒で無料プランを体験'}
                  </button>
                  <a href={aiPlanPath} className="text-sky-700 font-semibold underline">
                    {lang === 'en' ? 'How it works' : lang === 'ko' ? '사용 방법' : lang === 'fr' ? 'Voir le guide' : lang === 'ar' ? 'طريقة العمل' : '説明ページへ'}
                  </a>
                </div>
                <div className="mt-1 text-sm text-gray-700">
                  {lang === 'en' ? 'No email required — free preview' :
                   lang === 'ko' ? '이메일 없이 — 무료 미리보기' :
                   lang === 'fr' ? 'Aucun e‑mail requis — aperçu gratuit' :
                   lang === 'ar' ? 'بدون بريد إلكتروني — معاينة مجانية' :
                   'メール登録不要 — 無料プレビュー'}
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center font-bold">A</div>
                    <div className="text-sm text-gray-800">
                      <div className="flex items-center gap-1 text-yellow-500 mb-1">{'★★★★★'}</div>
                      {lang === 'en' ? 'Perfect day plan in seconds!' :
                       lang === 'ko' ? '몇 초 만에 완벽한 일정!' :
                       lang === 'fr' ? 'Itinéraire parfait en quelques secondes !' :
                       lang === 'ar' ? 'خطة يوم مثالية خلال ثوانٍ!' :
                       '数秒で理想の1日プランができました！'}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 grid place-items-center font-bold">S</div>
                    <div className="text-sm text-gray-800">
                      <div className="flex items-center gap-1 text-yellow-500 mb-1">{'★★★★★'}</div>
                      {lang === 'en' ? 'Loved the local lunch picks.' :
                       lang === 'ko' ? '현지 런치 추천이 좋았어요.' :
                       lang === 'fr' ? 'Super sélections pour le déjeuner.' :
                       lang === 'ar' ? 'اقتراحات الغداء كانت رائعة.' :
                       'ランチのローカル提案が最高でした。'}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 grid place-items-center font-bold">M</div>
                    <div className="text-sm text-gray-800">
                      <div className="flex items-center gap-1 text-yellow-500 mb-1">{'★★★★☆'}</div>
                      {lang === 'en' ? 'Easy and fast. Highly recommend.' :
                       lang === 'ko' ? '쉽고 빠릅니다. 추천합니다.' :
                       lang === 'fr' ? 'Simple et rapide. Je recommande.' :
                       lang === 'ar' ? 'سهل وسريع. أنصح به.' :
                       '簡単・高速。とてもおすすめです。'}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* トースト通知 */}
      {toastMsg && (
        <div className="fixed right-6 z-[60] top-60 sm:top-64 md:top-68 lg:top-72">
          <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 transform animate-slide-in-right">
            <CheckCircle size={24} className="text-emerald-200" />
            <span className="font-semibold">{toastMsg}</span>
            <button
              onClick={() => {
                window.location.href = aiPlanPath;
              }}
              className="ml-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-all duration-200 backdrop-blur-sm border border-white/30 flex items-center gap-2"
            >
              <Eye size={16} />
              {lang === 'en' ? 'View AI Plan' :
                lang === 'ko' ? 'AI 플랜 보기' :
                  lang === 'fr' ? 'Voir le plan IA' :
                    'AIプランを見る'}
            </button>
          </div>
        </div>
      )}

      {/* 背景スライドのアニメーション（3枚・各5秒） */}
      <style jsx>{`
        @keyframes fadeSlide {
          0% { opacity: 0 }
          5% { opacity: 1 }
          30% { opacity: 1 }
          35% { opacity: 0 }
          100% { opacity: 0 }
        }
        @keyframes slideInRight {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .hero-slide { position: absolute; inset: 0; opacity: 0; animation: fadeSlide 15s infinite ease-in-out; }
        .hero-slide:nth-child(1) { animation-delay: 0s }
        .hero-slide:nth-child(2) { animation-delay: 5s }
        .hero-slide:nth-child(3) { animation-delay: 10s }
        .animate-slide-in-right { animation: slideInRight 0.5s ease-out; }
        .large-spacing { margin-bottom: 5rem !important; }
      `}</style>

      <div className="container mx-auto px-6">
        {/* JSON-LD: TouristAttraction / Breadcrumbs / FAQ */}
        {/* JSON-LD moved to server page component to avoid hydration mismatches */}
        {/* 概要（上部固定カード） */}
        <div className="sticky top-24 z-30 mb-8">
          <div className="backdrop-blur-xl bg-white/80 border border-white/60 shadow-xl rounded-2xl px-5 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">{spotData?.name || 'Attraction'}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="inline-flex items-center gap-1"><Clock size={16} className="text-blue-600" />{i18n.hours}: {spotData?.hours || (lang === 'en' ? 'Unknown' : lang === 'ko' ? '미정' : lang === 'fr' ? 'Inconnu' : '営業時間未定')}</span>
                {typeof spotData?.rating !== 'undefined' && (
                  <span className="inline-flex items-center gap-1"><Star size={16} className="text-yellow-500" />{spotData.rating?.toFixed?.(1) || spotData.rating}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="#tickets" className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold shadow hover:opacity-95">{i18n.bookTickets}</a>
              <button onClick={addToAITravelPlan} className="px-4 py-2 rounded-lg bg-white text-sky-700 border border-sky-200 font-semibold hover:bg-sky-50">
                {i18n.addToAIPlanBtn}
              </button>
            </div>
          </div>
        </div>

        {/* メインタブ切替（基本情報 / 見どころ / AIプラン / レビュー） */}
        <div className="mb-8">
          <div className="inline-flex rounded-full border border-white/50 bg-white/70 backdrop-blur px-2 py-1 shadow-md">
            {([
              { key: 'basic', label: lang === 'en' ? 'Basic' : lang === 'ko' ? '기본정보' : lang === 'fr' ? 'Infos' : '基本情報' },
              { key: 'highlights', label: lang === 'en' ? 'Highlights' : lang === 'ko' ? '볼거리' : lang === 'fr' ? 'À voir' : '見どころ' },
              { key: 'ai', label: 'AIプラン' },
              { key: 'reviews', label: lang === 'en' ? 'Reviews' : lang === 'ko' ? '리뷰' : lang === 'fr' ? 'Avis' : 'レビュー' },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setMainTab(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${mainTab === tab.key ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white' : 'text-gray-700 hover:bg-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* 3秒要約（基本情報タブのみ） */}
        {mainTab === 'basic' && (
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-800 mb-4">
              <Info className="text-blue-600" size={24} />
              {i18n.quickFacts}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Clock className="text-blue-600 mt-1" size={20} />
                <div>
                  <div className="text-sm text-gray-500">{i18n.hours}</div>
                  <div className="font-semibold text-gray-800">{spotData?.hours || (lang === 'en' ? 'Unknown' : lang === 'ko' ? '미정' : lang === 'fr' ? 'Inconnu' : '営業時間未定')}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <DollarSign className="text-green-600 mt-1" size={20} />
                <div>
                  <div className="text-sm text-gray-500">{i18n.price}</div>
                  <div className="font-semibold text-gray-800">{spotData?.price || (lang === 'en' ? 'Varies' : lang === 'ko' ? '변동' : lang === 'fr' ? 'Variable' : '変動')}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Navigation className="text-emerald-600 mt-1" size={20} />
                <div>
                  <div className="text-sm text-gray-500">{i18n.accessMap}</div>
                  {spotData?.location?.address ? (
                    <a
                      className="font-semibold text-blue-700 underline"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((spotData?.name || '') + ' ' + (spotData?.location?.address || ''))}`}
                      target="_blank" rel="noopener noreferrer"
                    >
                      {i18n.openInGoogleMaps}
                    </a>
                  ) : (
                    <div className="font-semibold text-gray-800">—</div>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <ExternalLink className="text-indigo-600 mt-1" size={20} />
                <div>
                  <div className="text-sm text-gray-500">{i18n.officialSite}</div>
                  {spotData?.contact?.website ? (
                    <a className="font-semibold text-blue-700 underline" href={spotData?.contact?.website} target="_blank" rel="noopener noreferrer">
                      {spotData?.contact?.website?.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <div className="font-semibold text-gray-800">—</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        )}
        {mainTab === 'basic' && (
        <section className="relative -mt-32 z-10 large-spacing">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-800 mb-4">
              <Eye className="text-blue-600" size={24} />
              {i18n.quickSummary}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {lang === 'en'
                ? "Tokyo's iconic 333m tower offering panoramic city views from two observation decks. Best visited during clear weather for Mt. Fuji views. Peak times: weekends 11:00-13:00 & 18:00-20:00."
                : "東京のシンボル333mタワー。2つの展望台から都市の絶景を楽しめます。晴天時は富士山も見えます。混雑ピーク：週末11:00-13:00、18:00-20:00。"
              }
            </p>
          </div>
        </section>
        )}

        {/* AI旅行プランCTA（AIタブのみ） */}
        {mainTab === 'ai' && (
        <section
          id="ai-plan"
          className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-3xl p-12 text-center text-gray-900 relative overflow-hidden large-spacing"
        >
          {/* 背景パターン */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='white' stroke-width='2'/%3E%3Ccircle cx='50' cy='50' r='15' fill='white'/%3E%3C/svg%3E")`,
                backgroundSize: '80px 80px',
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="flex items-center justify-center gap-4 mb-4">
              <Bot size={32} />
              {lang === 'en' ? 'AI Travel Plan' :
                lang === 'ko' ? 'AI 여행 계획' :
                lang === 'fr' ? 'Plan de voyage IA' :
                lang === 'ar' ? 'خطة السفر بالذكاء الاصطناعي' :
                'AI旅行プラン'}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {lang === 'en' ? 'Add this spot to your personalized AI travel plan and get smart recommendations!' :
                lang === 'ko' ? '이 장소를 개인화된 AI 여행 계획에 추가하고 스마트한 추천을 받아보세요!' :
                lang === 'fr' ? 'Ajoutez ce lieu à votre plan de voyage IA personnalisé et obtenez des recommandations intelligentes !' :
                lang === 'ar' ? 'أضِف هذا الموقع إلى خطة السفر بالذكاء الاصطناعي لتحصل على توصيات ذكية!' :
                'このスポットを個人化されたAI旅行プランに追加して、スマートな推薦を受け取りましょう！'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={addToAITravelPlan}
                className="px-8 py-4 bg-white/90 text-sky-700 rounded-xl font-semibold backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Bot size={20} />
                {lang === 'en' ? 'Add to AI Plan' :
                  lang === 'ko' ? 'AI 플랜에 추가' :
                    lang === 'fr' ? 'Ajouter au plan IA' :
                      'AI旅行プランに追加'}
              </button>
              <button
                onClick={() => {
                window.location.href = aiPlanPath;
              }}
                className="px-8 py-4 bg-white/90 text-sky-700 rounded-xl font-semibold backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Eye size={20} />
                {lang === 'en' ? 'View My AI Plan' :
                  lang === 'ko' ? '내 AI 플랜 보기' :
                  lang === 'fr' ? 'Voir mon plan IA' :
                  lang === 'ar' ? 'عرض خطتي' :
                  '私のAIプランを見る'}
              </button>
            </div>
            {!isLoggedIn && (
              <>
                <p className="text-gray-700 text-sm mt-4">
                  {lang === 'en' ? 'The rest of the sample itinerary appears after sign‑in' :
                    lang === 'ko' ? '나머지 모델 코스는 로그인 후 표시됩니다' :
                    lang === 'fr' ? "La suite de l'itinéraire s'affiche après connexion" :
                    lang === 'ar' ? 'ستظهر بقية المسار بعد تسجيل الدخول' :
                    '続きのモデルコースは登録後に表示されます'}
                </p>

                {/* サンプルプランのチラ見せ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-left">
                  <div className="bg-white/95 text-gray-900 rounded-2xl p-5 border border-white/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold">
                        {lang === 'en' ? 'Your personalized 1‑day sample itinerary' :
                         lang === 'ko' ? '당신만의 1일 모델 코스 (샘플)' :
                         lang === 'fr' ? 'Aperçu de votre itinéraire 1 jour (exemple)' :
                         lang === 'ar' ? 'نموذج مسار يومي مخصص لك' :
                         'あなた専用の1日モデルコース（サンプル）'}
                      </div>
                      <div className="text-xs text-gray-700/70">
                        {lang === 'en' ? 'Partial preview before login' :
                         lang === 'ko' ? '로그인 전 일부 미리보기' :
                         lang === 'fr' ? 'Aperçu partiel avant connexion' :
                         lang === 'ar' ? 'معاينة جزئية قبل تسجيل الدخول' :
                         'ログイン前の一部プレビュー'}
                      </div>
                    </div>
                    <ol className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white grid place-items-center font-bold">1</div>
                        <div>
                          <div className="font-semibold">
                            {lang === 'en' ? `Morning: Start at ${spotData?.name || 'this spot'}` :
                             lang === 'ko' ? `아침: ${spotData?.name || '스팟'}에서 시작` :
                             lang === 'fr' ? `Matin : Départ à ${spotData?.name || 'ce lieu'}` :
                             lang === 'ar' ? `صباحاً: ابدأ في ${spotData?.name || 'هذا الموقع'}` :
                             `朝: ${spotData?.name || 'スポット'} をスタート`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {lang === 'en' ? '9:00–10:30 / Beat the crowds for a smooth visit' :
                             lang === 'ko' ? '9:00–10:30 / 혼잡을 피해 쾌적하게 관람' :
                             lang === 'fr' ? '9:00–10:30 / Évitez la foule pour une visite agréable' :
                             lang === 'ar' ? '9:00–10:30 / تجنّب الازدحام لزيارة مريحة' :
                             '9:00 - 10:30 / 混雑を避けて気持ちよく観光'}
                          </div>
                        </div>
                      </li>
                      <li className="flex items-center gap-3 blur-sm select-none">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white grid place-items-center font-bold">2</div>
                        <div>
                          <div className="font-semibold">
                            {lang === 'en' ? 'Noon: Lunch & nearby walk' :
                             lang === 'ko' ? '점심: 런치 & 주변 산책' :
                             lang === 'fr' ? 'Midi : Déjeuner & balade à proximité' :
                             lang === 'ar' ? 'الظهيرة: غداء وجولة قريبة' :
                             '昼: ランチ & 周辺散策'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {lang === 'en' ? '11:30–13:30 / Local lunch suggestions' :
                             lang === 'ko' ? '11:30–13:30 / 현지 런치 추천' :
                             lang === 'fr' ? '11:30–13:30 / Suggestions de déjeuner local' :
                             lang === 'ar' ? '11:30–13:30 / اقتراحات غداء محلي' :
                             '11:30 - 13:30 / ご当地グルメを提案'}
                          </div>
                        </div>
                      </li>
                      <li className="flex items-center gap-3 blur-sm select-none">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white grid place-items-center font-bold">3</div>
                        <div>
                          <div className="font-semibold">
                            {lang === 'en' ? 'Evening: Move to a viewpoint' :
                             lang === 'ko' ? '저녁: 절경 스팟으로 이동' :
                             lang === 'fr' ? 'Soir : Rejoindre un point de vue' :
                             lang === 'ar' ? 'مساءً: الانتقال إلى نقطة المشاهدة' :
                             '夕方: 絶景スポットへ移動'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {lang === 'en' ? '16:30–18:00 / Best for sunset' :
                             lang === 'ko' ? '16:30–18:00 / 노을 명소' :
                             lang === 'fr' ? '16:30–18:00 / Idéal pour le coucher du soleil' :
                             lang === 'ar' ? '16:30–18:00 / مثالي لغروب الشمس' :
                             '16:30 - 18:00 / サンセットの名所'}
                          </div>
                        </div>
                      </li>
                    </ol>
                    <div className="mt-3 text-xs text-gray-600">
                      {lang === 'en' ? 'Sign in to view the full itinerary' :
                       lang === 'ko' ? '전체 일정은 로그인 후 확인' :
                       lang === 'fr' ? "Connectez‑vous pour voir l'itinéraire complet" :
                       lang === 'ar' ? 'سجّل الدخول لعرض المسار الكامل' :
                       '続きのモデルコースは登録後に表示されます'}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-3">
                    <button
                      onClick={() => signInWithGoogle().catch(() => {})}
                      className="w-full px-5 py-4 bg-white text-sky-700 rounded-xl font-bold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all"
                    >
                      {lang === 'en' ? 'Create my plan for free (30s)' :
                       lang === 'ko' ? '무료로 나만의 플랜 만들기 (30초)' :
                       lang === 'fr' ? 'Créer mon plan gratuitement (30s)' :
                       lang === 'ar' ? 'أنشئ خطتي مجاناً (30 ثانية)' :
                       '無料で自分専用プランを作る（30秒）'}
                    </button>
                    <div className="grid gap-2">
                      <button
                        onClick={() => signInWithGoogle()}
                        className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg font-semibold border border-white/40 flex items-center justify-center gap-2"
                      >
                        <span className="inline-block">G</span>
                        <span>{lang === 'en' ? 'Continue with Google' : lang === 'ko' ? 'Google로 계속' : lang === 'fr' ? 'Continuer avec Google' : lang === 'ar' ? 'المتابعة باستخدام Google' : 'Googleで続行'}</span>
                      </button>
                      <button
                        onClick={() => signInWithApple().catch(() => alert('Appleログインはサーバー設定後に有効化されます'))}
                        className="w-full px-4 py-3 bg-black text-white rounded-lg font-semibold border border-white/20 flex items-center justify-center gap-2"
                      >
                        <span className="text-lg"></span>
                        <span>{lang === 'en' ? 'Continue with Apple' : lang === 'ko' ? 'Apple로 계속' : lang === 'fr' ? 'Continuer avec Apple' : lang === 'ar' ? 'المتابعة باستخدام Apple' : 'Appleで続行'}</span>
                      </button>
                    </div>
                    <div className="text-center text-sm text-white/90">
                      {(lang === 'en' ? 'or' : lang === 'ko' ? '또는' : lang === 'fr' ? 'ou' : lang === 'ar' ? 'أو' : 'または')}
                      {' '}<a href="/register" className="underline font-semibold">{lang === 'en' ? 'Sign up with email' : lang === 'ko' ? '이메일로 가입' : lang === 'fr' ? "S'inscrire avec e‑mail" : lang === 'ar' ? 'التسجيل بالبريد الإلكتروني' : 'メールアドレスで登録'}</a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        )}

        {/* チケット情報（基本情報タブ内） */}
        {mainTab === 'basic' && (
        <section id="tickets" className="large-spacing">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-6">
            <Ticket className="text-blue-600" size={28} />
            {i18n.ticketInfo}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Adult Ticket */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Adult</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Main Deck</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ¥1,200
                <span className="text-sm text-gray-500 ml-2">{convertPrice(1200)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">150m observation deck</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Book Now
              </button>
            </div>

            {/* Child Ticket */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Child</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">4-12 years</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ¥700
                <span className="text-sm text-gray-500 ml-2">{convertPrice(700)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Main Deck access</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Book Now
              </button>
            </div>

            {/* Top Deck Tour */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                Premium
              </div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Top Deck Tour</h3>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">250m</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ¥4,000
                <span className="text-sm text-gray-500 ml-2">{convertPrice(4000)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Guided tour + Main Deck</p>
              <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Book Tour
              </button>
            </div>

            {/* Same Day Ticket */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Same Day</h3>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Limited</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ¥1,400
                <span className="text-sm text-gray-500 ml-2">{convertPrice(1400)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Walk-in availability</p>
              <button className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed">
                Subject to availability
              </button>
            </div>
          </div>

          {/* Ticket Info Footer */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={16} />
                <span>Free cancellation up to 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="text-orange-500" size={16} />
                <span>Peak times: Weekends 11:00-13:00</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="text-blue-500" size={16} />
                <span>Skip-the-line access included</span>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* 基本情報: 地図・アクセス（ルート例） */}
        {mainTab === 'basic' && (
        <section id="access" className="mb-12">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-6">
            <Navigation className="text-blue-600" size={28} />
            {i18n.accessInfo}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* From Shinjuku */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Train className="text-blue-600" size={24} />
                <h3 className="font-semibold text-gray-800">{i18n.fromShinjuku}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>25 min</strong> • 1 transfer</p>
                <p>JR Yamanote → Shimbashi → Toei Oedo → Akabanebashi</p>
                <p className="text-blue-600 font-medium">¥200 {convertPrice(200)}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-xs hover:bg-blue-200 transition-colors flex items-center justify-center gap-1">
                  <ExternalLink size={14} />
                  {lang === 'ja' ? 'Googleマップ' : lang === 'ko' ? 'Google 지도' : 'Google Maps'}
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs hover:bg-gray-200 transition-colors">
                  Apple Maps
                </button>
              </div>
            </div>

            {/* From Shibuya */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Train className="text-green-600" size={24} />
                <h3 className="font-semibold text-gray-800">{i18n.fromShibuya}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>20 min</strong> • 1 transfer</p>
                <p>JR Yamanote → Shimbashi → Toei Oedo → Akabanebashi</p>
                <p className="text-blue-600 font-medium">¥200 {convertPrice(200)}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-xs hover:bg-blue-200 transition-colors flex items-center justify-center gap-1">
                  <ExternalLink size={14} />
                  {lang === 'ja' ? 'Googleマップ' : lang === 'ko' ? 'Google 지도' : 'Google Maps'}
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs hover:bg-gray-200 transition-colors">
                  Apple Maps
                </button>
              </div>
            </div>

            {/* From Haneda Airport */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Car className="text-cyan-600" size={24} />
                <h3 className="font-semibold text-gray-800">{i18n.fromHaneda}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>45 min</strong> • Direct</p>
                <p>Tokyo Monorail → Shimbashi → Toei Oedo</p>
                <p className="text-blue-600 font-medium">¥470 {convertPrice(470)}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-xs hover:bg-blue-200 transition-colors flex items-center justify-center gap-1">
                  <ExternalLink size={14} />
                  {lang === 'ja' ? 'Googleマップ' : lang === 'ko' ? 'Google 지도' : 'Google Maps'}
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs hover:bg-gray-200 transition-colors">
                  Citymapper
                </button>
              </div>
            </div>
          </div>
          {/* 現在のスポットをGoogle Mapsで開く */}
          <div className="mt-6">
            <a
              href={spotData?.location?.lat && spotData?.location?.lng ? `https://www.google.com/maps/search/?api=1&query=${spotData.location.lat},${spotData.location.lng}` : `https://www.google.com/maps/search/${encodeURIComponent(spotData?.name || 'Tokyo Tower')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700"
            >
              <ExternalLink size={16} /> {i18n.openInGoogleMaps}
            </a>
          </div>
        </section>
        )}

        {/* ハイライト（アイコン化） - 基本情報タブ */}
        {mainTab === 'basic' && (
        <section className="mb-12">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-6">
            <Star className="text-yellow-500" size={28} />
            {i18n.highlights}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-shadow">
              <Eye className="mx-auto text-blue-600 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{tagToLabel('observatory')}</h3>
              <p className="text-xs text-gray-600">{i18n.highlightsSub.observatory}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto text-purple-600 mb-2 text-2xl">🌃</div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{tagToLabel('night_view')}</h3>
              <p className="text-xs text-gray-600">{i18n.highlightsSub.night_view}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-shadow relative">
              <Mountain className="mx-auto text-green-600 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{tagToLabel('mt_fuji_view')}</h3>
              <p className="text-xs text-gray-600">{i18n.highlightsSub.mt_fuji_view}</p>
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
                AM
              </span>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto text-red-600 mb-2 text-2xl">🗼</div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{tagToLabel('landmark')}</h3>
              <p className="text-xs text-gray-600">{i18n.highlightsSub.landmark}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-shadow">
              <Camera className="mx-auto text-orange-600 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{lang === 'fr' ? 'Spot photo' : lang === 'ko' ? '포토 스팟' : lang === 'en' ? 'Photo Spot' : '写真スポット'}</h3>
              <p className="text-xs text-gray-600">{i18n.highlightsSub.photo_spot}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-shadow">
              <Store className="mx-auto text-pink-600 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{lang === 'fr' ? 'Shopping' : lang === 'ko' ? '쇼핑' : lang === 'en' ? 'Shopping' : 'ショッピング'}</h3>
              <p className="text-xs text-gray-600">{i18n.highlightsSub.shopping}</p>
            </div>
          </div>
        </section>
        )}

        {/* 天気・視界インサイト */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-200">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-800 mb-4">
              <Sun className="text-yellow-500" size={24} />
              {i18n.weatherInsight}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full p-3">
                  <Sun className="text-yellow-500" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{i18n.weatherVisibilityTitle}</h3>
                  <p className="text-gray-600">{lang === 'en' ? 'High chance of Mt. Fuji view' : lang === 'ko' ? '후지산 조망 확률 높음' : lang === 'fr' ? 'Forte chance de voir le mont Fuji' : '富士山が見える可能性高め'}</p>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">{i18n.weatherVisibilityExcellent}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full p-3">
                  <Sunrise className="text-orange-500" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{i18n.weatherBestTimeTitle}</h3>
                  <p className="text-gray-600">{lang === 'en' ? 'Clear skies until 15:00' : lang === 'ko' ? '15시까지 맑음' : lang === 'fr' ? 'Ciel dégagé jusqu’à 15:00' : '15時頃まで快晴'}</p>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{i18n.weatherMorningRecommended}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* クイック情報（2列レイアウト） */}
        <section className="relative z-10 mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-border-light p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <div className="text-center p-6 border border-border-light rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <Clock className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-secondary mb-2">{i18n.hours}</h3>
                <p className="text-lg font-semibold mb-1" suppressHydrationWarning>{getBusinessHours}</p>
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
                <p className="text-lg font-semibold mb-2">{getCrowd.label}</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-6 h-1.5 rounded-full ${i <= getCrowd.score ? 'bg-warning' : 'bg-border'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* タブ: 詳細（詳細説明 + 地図アクセス + 設備） */}
        {activeTab === 'details' && (
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="w-full flex items-center justify-between gap-4 text-secondary border-b border-border-light pb-4 mb-6"
          >
            <span className="inline-flex items-center gap-3"><Info className="text-primary" size={24} />{i18n.details}</span>
            <span className={`transition-transform ${detailsOpen ? 'rotate-180' : ''}`}>⌄</span>
          </button>

          {detailsOpen && (
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
          )}
        </section>
        )}

        {/* 詳細マップ - 基本情報タブ */}
        {mainTab === 'basic' && (
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
                {i18n.nearbyStations}
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
                {i18n.accessByCar}
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
        )}

        {/* 見どころ: 写真ギャラリー + 追加メディア */}
        {mainTab === 'highlights' && (
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Images className="text-primary" size={24} />
            {i18n.gallery}
          </h2>

          {galleryImages && galleryImages.length > 0 ? (
            <>
              {/* メイン写真 */}
              <div className="mb-8">
                <div
                  className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group shadow-xl bg-slate-100"
                  onClick={() => { setSelectedImage(galleryImages[0]); openModal('image'); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedImage(galleryImages[0]);
                      openModal('image');
                    }
                  }}
                >
                  <Image
                    src={galleryImages[0]}
                    alt={`${spotData?.name || 'スポット'} - ${i18n.mainPhoto}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-lg font-semibold">{i18n.mainPhoto}</p>
                    <p className="text-sm opacity-90">{i18n.clickToEnlarge}</p>
                  </div>
                </div>
              </div>

              {/* サムネイル写真 */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {galleryImages.slice(1, 13).map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className="relative h-24 md:h-32 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg bg-slate-100 group"
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
                    <Image
                      src={src}
                      alt={`${spotData?.name || 'スポット'}の写真 ${idx + 2}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>

              {(galleryImages.length || 0) > 13 && (
                <div className="text-center mt-6">
                  <button
                    className="px-6 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                    onClick={() => openModal('allPhotos')}
                  >
                    すべての写真を見る ({galleryImages.length || 0}枚)
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* ダミー写真ギャラリー - スポットタイプに応じて動的に生成 */}
              <div className="mb-8">
                <div
                  className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group shadow-xl"
                  style={{
                    background: getSpotMainPhotoGradient(spotData?.name || ''),
                  }}
                  onClick={() => openModal('main')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      openModal('main');
                    }
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">{getSpotIcon(spotData?.name || '')}</div>
                      <h3 className="text-2xl font-bold mb-2">{spotData?.name || '東京タワー'}</h3>
                      <p className="text-lg opacity-90">{i18n.mainPhoto}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {generateSpotPhotos(spotData?.name || '').map((photo, idx) => (
                  <div
                    key={`${photo.id}-${idx}`}
                    className="relative h-24 md:h-32 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg group"
                    style={{ background: photo.gradient }}
                    onClick={() => openModal(photo.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        openModal(photo.id);
                      }
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-2xl mb-1">{photo.icon}</div>
                        <p className="text-xs font-medium">{photo.label}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </>
          )}
          {/* 追加メディア: カルーセル / 360 / 動画 */}
          <div className="mt-10">
            <h3 className="text-lg font-bold text-secondary mb-4">
              {lang === 'en' ? `See ${spotData?.name || 'this spot'} in photos` : '写真で見る' + (spotData?.name || '')}
            </h3>
            <div className="relative">
              <div id="photoCarousel" className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
                {['/images/tokyo_toewr/tokyo_toewr1.jpeg','/images/tokyo_toewr/tokyo_toewr2.jpg','/images/tokyo_toewr/tokyo_toewr3.jpg','/images/spots/東京タワー_20250714_121123.jpg'].map((src, i) => (
                  <div key={i} className="snap-start shrink-0 w-[260px] h-[170px] md:w-[360px] md:h-[220px] rounded-xl overflow-hidden">
                    <Image src={src} alt={`carousel-${i}`} width={720} height={440} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 hidden md:block">
                <button className="w-10 h-10 rounded-full bg-white/90 border shadow hover:bg-white" onClick={() => { const el = document.getElementById('photoCarousel'); if (el) el.scrollBy({ left: -380, behavior: 'smooth' }); }}>‹</button>
              </div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 hidden md:block">
                <button className="w-10 h-10 rounded-full bg-white/90 border shadow hover:bg-white" onClick={() => { const el = document.getElementById('photoCarousel'); if (el) el.scrollBy({ left: 380, behavior: 'smooth' }); }}>›</button>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-bold text-secondary mb-3">360°ビュー</h3>
            <div
              id="pano360"
              className="w-full h-64 md:h-80 rounded-2xl border bg-[#111]"
              style={{ backgroundImage: 'url(/images/tokyo_toewr/tokyo_toewr2.jpg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: '50% 50%' }}
              onMouseMove={(e) => { const el = e.currentTarget as HTMLDivElement; const rect = el.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width; el.style.backgroundPosition = `${(x * 100).toFixed(1)}% 50%`; }}
              onTouchMove={(e) => { const el = e.currentTarget as HTMLDivElement; const rect = el.getBoundingClientRect(); const t = e.touches[0]; const x = (t.clientX - rect.left) / rect.width; el.style.backgroundPosition = `${(x * 100).toFixed(1)}% 50%`; }}
            />
            <p className="text-xs text-gray-500 mt-2">ドラッグ / スワイプで視点を動かせます</p>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-bold text-secondary mb-3">ショート動画</h3>
            <video controls muted playsInline preload="none" className="w-full rounded-2xl shadow" poster="/images/spots/東京タワー_20250714_121123.jpg">
              <source src="/douga.mp4" type="video/mp4" />
            </video>
          </div>

        </section>
        )}

        {/* レビュー（専用タブ） */}
        {mainTab === 'reviews' && (
        <section id="reviews" className="mb-12">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-6">
            <MessageSquare className="text-blue-600" size={28} />
            {i18n.reviewSummary}
          </h2>

          {/* 参加型ミニウィジェット */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* 投票 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="font-semibold mb-3">東京タワーに行くなら？</div>
              <div className="flex gap-2 mb-3">
                <button
                  className={`flex-1 px-3 py-2 rounded-lg border ${pollChoice==='morning' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
                  onClick={() => {
                    if (pollChoice) return; // 1回のみ
                    const next = { morning: pollStats.morning + 1, night: pollStats.night };
                    setPollChoice('morning'); setPollStats(next);
                    try { localStorage.setItem(`poll-${spotId || spotData?.name || 'spot'}`, JSON.stringify({ choice: 'morning', stats: next })); } catch {}
                  }}
                >朝派</button>
                <button
                  className={`flex-1 px-3 py-2 rounded-lg border ${pollChoice==='night' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
                  onClick={() => {
                    if (pollChoice) return;
                    const next = { morning: pollStats.morning, night: pollStats.night + 1 };
                    setPollChoice('night'); setPollStats(next);
                    try { localStorage.setItem(`poll-${spotId || spotData?.name || 'spot'}`, JSON.stringify({ choice: 'night', stats: next })); } catch {}
                  }}
                >夜派</button>
              </div>
              <div className="text-sm text-gray-600">朝 {Math.round(100*pollStats.morning/(pollStats.morning+pollStats.night))}% ・ 夜 {Math.round(100*pollStats.night/(pollStats.morning+pollStats.night))}%</div>
            </div>

            {/* 行った！ */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="font-semibold mb-3">行った！</div>
              <div className="flex items-center gap-3">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold ${visited ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  onClick={() => {
                    const nextVisited = !visited; setVisited(nextVisited);
                    const nextCount = visitedCount + (nextVisited ? 1 : -1); setVisitedCount(Math.max(0, nextCount));
                    try { localStorage.setItem(`visited-${spotId || spotData?.name || 'spot'}`, JSON.stringify({ visited: nextVisited, count: Math.max(0, nextCount) })); } catch {}
                  }}
                >{visited ? '行った！済み' : '行った！'}</button>
                <div className="text-sm text-gray-600">{visitedCount.toLocaleString()}人が行きました</div>
              </div>
            </div>

            {/* コメント */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="font-semibold mb-3">コメント</div>
              <div className="flex gap-2">
                <input value={commentText} onChange={(e)=>setCommentText(e.target.value)} placeholder="感想を一言..." className="flex-1 px-3 py-2 border rounded-lg" />
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50"
                  disabled={!commentText.trim()}
                  onClick={() => {
                    const timestamp = Date.now();
                    const item = { text: commentText.trim(), ts: timestamp };
                    const next = [item, ...comments].slice(0, 10);
                    setComments(next); setCommentText('');
                    try { localStorage.setItem(`comments-${spotId || spotData?.name || 'spot'}`, JSON.stringify(next)); } catch {}
                  }}
                >投稿</button>
              </div>
              {comments.length > 0 && (
                <ul className="mt-3 space-y-2 max-h-40 overflow-auto text-sm">
                  {comments.map((c,i)=> (
                    <li key={i} className="border rounded-lg p-2 bg-gray-50">
                      <div className="text-gray-800">{c.text}</div>
                      <div className="text-[11px] text-gray-500">{new Date(c.ts).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* 要約カード */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* 高評価ポイント（ブランドカラー） */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="flex items-center gap-2 font-semibold text-blue-800 mb-4">
                <CheckCircle className="text-blue-600" size={20} />
                {i18n.positivePointsTitle}
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                {i18n.positiveBullets.map((txt: string, idx: number) => (
                  <li key={`pb-${idx}`} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {txt}
                  </li>
                ))}
              </ul>
            </div>

            {/* 改善ポイント（アクセント1色） */}
            <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-6">
              <h3 className="flex items-center gap-2 font-semibold text-cyan-800 mb-4">
                <AlertCircle className="text-cyan-600" size={20} />
                {i18n.improvementPointsTitle}
              </h3>
              <ul className="space-y-2 text-sm text-cyan-700">
                {i18n.improvementBullets.map((txt: string, idx: number) => (
                  <li key={`ib-${idx}`} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    {txt}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 平均スコア + 星分布 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-gray-900">{(spotData?.rating || 4.4).toFixed(1)}</div>
                <div>
                  <div className="text-yellow-400 text-xl leading-none">{'★'.repeat(Math.round(spotData?.rating || 4.4))}{'☆'.repeat(5 - Math.round(spotData?.rating || 4.4))}</div>
                  <div className="text-sm text-gray-500">{(spotData?.reviewCount || 15032).toLocaleString()} reviews</div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-2">
                {[
                  { label: '★5', pct: 62, color: 'bg-green-500' },
                  { label: '★4', pct: 26, color: 'bg-blue-500' },
                  { label: '★3', pct: 8, color: 'bg-yellow-500' },
                  { label: '★2', pct: 3, color: 'bg-orange-500' },
                  { label: '★1', pct: 1, color: 'bg-red-500' },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 text-sm text-gray-600">{row.label}</div>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`${row.color} h-full`} style={{ width: `${row.pct}%` }} />
                    </div>
                    <div className="w-12 text-right text-sm text-gray-600">{row.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 代表レビュー */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {lang === 'ja' ? '外国人レビュー' : lang === 'ko' ? '외국인 리뷰' : lang === 'fr' ? 'Avis internationaux' : 'International Reviews'}
            </h3>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇺🇸</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">Sarah M.</span>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 days ago • English</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mt-3 leading-relaxed">
                "Absolutely breathtaking views of Tokyo! Went during sunset and the city transformation from day to night was magical. The Top Deck tour was worth the extra cost. Pro tip: book in advance to avoid disappointment!"
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇩🇪</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">Klaus H.</span>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(4)}{'☆'.repeat(1)}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">1 week ago • German</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mt-3 leading-relaxed">
                "Great experience overall. The views are stunning, especially on a clear day when you can see Mt. Fuji. It was quite busy when we visited on Saturday afternoon, so I'd recommend going early morning or late evening."
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇰🇷</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">Min-jun K.</span>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">3 days ago • Korean</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mt-3 leading-relaxed">
                "Perfect spot for photography! The glass floor on the main deck was thrilling. Staff were very helpful and spoke multiple languages. The souvenir shop has unique Tokyo Tower merchandise."
              </p>
            </div>
          </div>
          {/* 日本語レビュー */}
          <div className="space-y-4 mt-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {lang === 'ja' ? '日本語レビュー' : lang === 'ko' ? '일본어 리뷰' : lang === 'fr' ? 'Avis en japonais' : 'Japanese Reviews'}
            </h3>
            {[
              {
                name: '田中太郎',
                rating: 5,
                date: '2024/08/20',
                comment:
                  '夜景が本当に美しかったです！特にトップデッキからの眺めは圧巻でした。少し混雑していましたが、スタッフの対応も良く満足できました。',
              },
              {
                name: '山田花子',
                rating: 4,
                date: '2024/08/15',
                comment:
                  '家族で訪問しました。子供たちも大興奮でした。フットタウンにもたくさんの楽しい施設があり、一日中楽しめます。',
              },
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{review.name}</span>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="text-yellow-400 mb-2">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* タブ: SNSリアルタイム */}
        {activeTab === 'sns' && (
        <section className="mb-12">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setSnsExpanded(!snsExpanded)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="flex items-center gap-3 text-xl font-bold text-gray-800">
                <Twitter className="text-blue-500" size={24} />
                {i18n.snsRealtime}
              </h2>
              {snsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {snsExpanded && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      T
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">@TokyoTowerOfficial</span>
                        <span className="text-sm text-gray-500">2h ago</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        🌅 Beautiful sunrise view this morning! Mt. Fuji is clearly visible today. Perfect weather for sightseeing! #TokyoTower #MtFuji
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      I
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">@travel_enthusiast_jp</span>
                        <span className="text-sm text-gray-500">4h ago</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        Just visited Tokyo Tower - the night view is absolutely stunning! 🌃✨ #TokyoNight #TravelJapan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">@photography_tokyo</span>
                        <span className="text-sm text-gray-500">6h ago</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        Pro tip: Visit Tokyo Tower during blue hour (just after sunset) for the best photography lighting! 📸 #PhotoTips
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        )}

        

        {/* 口コミ・レビュー（重複セクションは削除: 上部タブのレビューに統合） */}
        {/* チケット予約 CTA（基本情報タブに表示） */}
        {mainTab === 'basic' && (
        <section
          id="tickets"
          className="bg-gradient-to-br from-sky-500 to-cyan-500 rounded-3xl p-12 text-center text-white mb-12 relative overflow-hidden"
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
              {lang === 'en' ? 'Book Tickets' :
                lang === 'ko' ? '티켓 예약' :
                  lang === 'fr' ? 'Réserver des billets' :
                    'チケット予約'}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {lang === 'en' ? 'Book in advance for smooth entry! Special rates available.' :
                lang === 'ko' ? '사전 예약으로 원활한 입장! 특별 요금도 준비되어 있습니다.' :
                  lang === 'fr' ? 'Réservez à l\'avance pour une entrée fluide ! Tarifs spéciaux disponibles.' :
                    '事前予約でスムーズに入場！特別料金もご用意しています。'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-cyan-700 transition-all duration-300">
                {lang === 'en' ? 'Book on Official Site' :
                  lang === 'ko' ? '공식 사이트에서 예약' :
                    lang === 'fr' ? 'Réserver sur le site officiel' :
                      '公式サイトで予約'}
              </button>
              <button className="px-8 py-4 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-cyan-700 transition-all duration-300">
                {lang === 'en' ? 'Ticket Booking Site' :
                  lang === 'ko' ? '티켓 예약 사이트' :
                    lang === 'fr' ? 'Site de réservation de billets' :
                      'チケット予約サイト'}
              </button>
            </div>
          </div>
        </section>
        )}

        {/* 設備・注意事項（基本情報タブ） */}
        {mainTab === 'basic' && (
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <button
            onClick={() => setFacilitiesOpen(!facilitiesOpen)}
            className="w-full flex items-center justify-between gap-4 text-secondary border-b border-border-light pb-4 mb-6"
          >
            <span className="inline-flex items-center gap-3"><Info className="text-primary" size={24} />
              {lang === 'en' ? 'Facilities & Important Notes' :
                lang === 'ko' ? '시설・주의사항' :
                  lang === 'fr' ? 'Installations et notes importantes' :
                    '設備・注意事項'}
            </span>
            <span className={`transition-transform ${facilitiesOpen ? 'rotate-180' : ''}`}>⌄</span>
          </button>

          {facilitiesOpen && (<>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: Baby,
                text: lang === 'en' ? 'Stroller Friendly' :
                  lang === 'ko' ? '유모차 이용 가능' :
                    lang === 'fr' ? 'Accessible aux poussettes' :
                      'ベビーカー利用可',
                available: true
              },
              {
                icon: Accessibility,
                text: lang === 'en' ? 'Barrier-Free Access' :
                  lang === 'ko' ? '배리어프리 대응' :
                    lang === 'fr' ? 'Accès sans barrières' :
                      'バリアフリー対応',
                available: true
              },
              {
                icon: Bath,
                text: lang === 'en' ? 'Multi-Purpose Restrooms' :
                  lang === 'ko' ? '다목적 화장실 있음' :
                    lang === 'fr' ? 'Toilettes polyvalentes' :
                      '多目的トイレあり',
                available: true
              },
              {
                icon: Camera,
                text: lang === 'en' ? 'Photography OK' :
                  lang === 'ko' ? '촬영 OK' :
                    lang === 'fr' ? 'Photographie autorisée' :
                      '撮影OK',
                available: true
              },
              {
                icon: Ban,
                text: lang === 'en' ? 'Non-Smoking Facility' :
                  lang === 'ko' ? '전관 금연' :
                    lang === 'fr' ? 'Établissement non-fumeur' :
                      '全館禁煙',
                available: false
              },
              {
                icon: Wifi,
                text: lang === 'en' ? 'Free Wi-Fi' :
                  lang === 'ko' ? '무료 Wi-Fi' :
                    lang === 'fr' ? 'Wi-Fi gratuit' :
                      '無料Wi-Fi',
                available: true
              },
              {
                icon: Store,
                text: lang === 'en' ? 'Souvenir Shop' :
                  lang === 'ko' ? '기념품 가게' :
                    lang === 'fr' ? 'Boutique de souvenirs' :
                      'お土産ショップ',
                available: true
              },
              {
                icon: Utensils,
                text: lang === 'en' ? 'Restaurant & Café' :
                  lang === 'ko' ? '레스토랑・카페' :
                    lang === 'fr' ? 'Restaurant et café' :
                      'レストラン・カフェ',
                available: true
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-transform hover:scale-105 ${item.available
                    ? 'border-success/20 text-success bg-green-50'
                    : 'border-danger/20 text-danger bg-red-50'
                  }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-secondary mb-4">
            {lang === 'en' ? 'Important Notes' :
              lang === 'ko' ? '주의사항' :
                lang === 'fr' ? 'Notes importantes' :
                  '注意事項'}
          </h3>
          <ul className="list-disc list-inside space-y-2 text-text-muted">
            <li>
              {lang === 'en' ? 'Observation decks may be closed during bad weather' :
                lang === 'ko' ? '악천후 시 전망대가 폐쇄될 수 있습니다' :
                  lang === 'fr' ? 'Les ponts d\'observation peuvent être fermés par mauvais temps' :
                    '悪天候時は展望台が閉鎖される場合があります'}
            </li>
            <li>
              {lang === 'en' ? 'Large luggage must be stored in paid lockers' :
                lang === 'ko' ? '큰 짐은 유료 보관함을 이용해 주세요' :
                  lang === 'fr' ? 'Les gros bagages doivent être stockés dans des casiers payants' :
                    '大きな荷物は有料ロッカーをご利用ください'}
            </li>
            <li>
              {lang === 'en' ? 'Pets are not allowed (except guide dogs)' :
                lang === 'ko' ? '애완동물 동반 불가 (안내견 등 제외)' :
                  lang === 'fr' ? 'Les animaux ne sont pas autorisés (sauf chiens-guides)' :
                    'ペットの同伴はできません（盲導犬等は除く）'}
            </li>
            <li>
              {lang === 'en' ? 'Tripod photography is prohibited' :
                lang === 'ko' ? '삼각대를 사용한 촬영은 금지되어 있습니다' :
                  lang === 'fr' ? 'La photographie avec trépied est interdite' :
                    '三脚を使用した撮影は禁止されています'}
            </li>
            <li>
              {lang === 'en' ? 'Entry restrictions may apply during busy periods' :
                lang === 'ko' ? '혼잡 시 입장 제한을 실시할 수 있습니다' :
                  lang === 'fr' ? 'Des restrictions d\'entrée peuvent s\'appliquer pendant les périodes d\'affluence' :
                    '混雑時は入場制限を行う場合があります'}
            </li>
          </ul>
          </>)}
        </section>
        )}

        {/* タブ: FAQ */}
        {activeTab === 'faq' && (
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <HelpCircle className="text-primary" size={24} />
            {lang === 'en' ? 'Frequently Asked Questions' :
              lang === 'ko' ? '자주 묻는 질문' :
                lang === 'fr' ? 'Questions fréquemment posées' :
                  'よくある質問'}
          </h2>

          <div className="space-y-4">
            {[
              {
                question: lang === 'en' ? 'What are the operating hours?' :
                  lang === 'ko' ? '운영시간을 알려주세요' :
                    lang === 'fr' ? 'Quels sont les horaires d\'ouverture ?' :
                      '営業時間を教えてください',
                answer: lang === 'en' ?
                  'Main Deck: 9:00-23:00 (Last entry 22:30)\nTop Deck: 9:00-22:45 (Last entry 22:00-22:15)\nFootTown: 10:00-21:00 (varies by store)' :
                  lang === 'ko' ?
                    '메인 데크: 9:00~23:00 (마지막 입장 22:30)\n톱 데크: 9:00~22:45 (마지막 입장 22:00~22:15)\n풋타운: 10:00~21:00 (매장별로 다름)' :
                    lang === 'fr' ?
                      'Main Deck : 9h00-23h00 (Dernière entrée 22h30)\nTop Deck : 9h00-22h45 (Dernière entrée 22h00-22h15)\nFootTown : 10h00-21h00 (varie selon les magasins)' :
                      'メインデッキ：9:00～23:00（最終入場 22:30）\nトップデッキ：9:00～22:45（最終入場 22:00～22:15）\nフットタウン：10:00～21:00（店舗により異なります）',
              },
              {
                question: lang === 'en' ? 'How much does it cost?' :
                  lang === 'ko' ? '요금은 얼마인가요?' :
                    lang === 'fr' ? 'Combien cela coûte-t-il ?' :
                      '料金はいくらですか？',
                answer: lang === 'en' ?
                  'Main Deck: Adult ¥1,200, High School ¥1,000, Elementary/Junior High ¥700, Child (4+) ¥500\nTop Deck: +¥2,800 (13+), +¥1,800 (Elementary), +¥1,200 (Child)' :
                  lang === 'ko' ?
                    '메인 데크: 성인 1,200엔, 고등학생 1,000엔, 초중학생 700엔, 유아(4세 이상) 500엔\n톱 데크: +2,800엔(13세 이상), +1,800엔(초등학생), +1,200엔(유아)' :
                    lang === 'fr' ?
                      'Main Deck : Adulte 1 200¥, Lycéen 1 000¥, Collégien/Élémentaire 700¥, Enfant (4+) 500¥\nTop Deck : +2 800¥ (13+), +1 800¥ (Élémentaire), +1 200¥ (Enfant)' :
                      'メインデッキ：大人 1,200円、高校生 1,000円、小中学生 700円、幼児（4歳以上） 500円\nトップデッキ：+2,800円（13歳以上）、+1,800円（小学生）、+1,200円（幼児）',
              },
              {
                question: lang === 'en' ? 'Do I need a reservation?' :
                  lang === 'ko' ? '예약이 필요한가요?' :
                    lang === 'fr' ? 'Ai-je besoin d\'une réservation ?' :
                      '予約は必要ですか？',
                answer: lang === 'en' ?
                  'Main Deck requires no reservation, but Top Deck requires advance booking. We recommend booking in advance, especially for weekends and evening hours.' :
                  lang === 'ko' ?
                    '메인 데크는 예약이 불필요하지만, 톱 데크는 사전 예약이 필요합니다. 특히 주말과 야경 시간대는 혼잡하므로 사전 예약을 권장합니다.' :
                    lang === 'fr' ?
                      'Le Main Deck ne nécessite pas de réservation, mais le Top Deck nécessite une réservation à l\'avance. Nous recommandons de réserver à l\'avance, surtout pour les week-ends et les heures de soirée.' :
                      'メインデッキは予約不要ですが、トップデッキは事前予約が必要です。特に土日祝日や夜景の時間帯は混雑するため、事前予約をおすすめします。',
              },
              {
                question: lang === 'en' ? 'Is it wheelchair accessible?' :
                  lang === 'ko' ? '휠체어로도 이용할 수 있나요?' :
                    lang === 'fr' ? 'Est-ce accessible en fauteuil roulant ?' :
                      '車椅子でも利用できますか？',
                answer: lang === 'en' ?
                  'Yes, it is barrier-free and wheelchair accessible. Elevators and multi-purpose restrooms are available.' :
                  lang === 'ko' ?
                    '네, 배리어프리 대응으로 휠체어로도 이용하실 수 있습니다. 엘리베이터와 다목적 화장실도 완비되어 있습니다.' :
                    lang === 'fr' ?
                      'Oui, c\'est sans barrières et accessible en fauteuil roulant. Des ascenseurs et des toilettes polyvalentes sont disponibles.' :
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
                    className={`w-5 h-5 text-primary transition-transform ${activeFAQ === index ? 'rotate-180' : ''
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
        )}

        {/* タブ: 近隣スポット */}
        {activeTab === 'nearby' && (
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Map className="text-primary" size={24} />
            {lang === 'en' ? 'Nearby Attractions' :
              lang === 'ko' ? '주변 관광 명소' :
                lang === 'fr' ? 'Attractions à proximité' :
                  '近隣の観光スポット'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: lang === 'en' ? 'Zojoji Temple' : '増上寺',
                distance: lang === 'en' ? '3 min walk' :
                  lang === 'ko' ? '도보 3분' :
                    lang === 'fr' ? '3 min à pied' :
                      '徒歩3分',
                category: lang === 'en' ? 'Historic Temple' :
                  lang === 'ko' ? '역사적인 사원' :
                    lang === 'fr' ? 'Temple historique' :
                      '歴史ある寺院',
                description: lang === 'en' ?
                  'Beautiful temple with Tokyo Tower as backdrop. Famous as the Tokugawa family temple.' :
                  lang === 'ko' ?
                    '도쿄타워를 배경으로 한 아름다운 사원. 도쿠가와 가문의 보리사로 유명합니다.' :
                    lang === 'fr' ?
                      'Magnifique temple avec la Tokyo Tower en arrière-plan. Célèbre comme temple familial des Tokugawa.' :
                      '東京タワーを背景にした美しい寺院。徳川家の菩提寺として有名です。',
                color: 'from-green-400 to-green-600',
                image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop&q=70',
              },
              {
                name: lang === 'en' ? 'Shiba Park' : '芝公園',
                distance: lang === 'en' ? '1 min walk' :
                  lang === 'ko' ? '도보 1분' :
                    lang === 'fr' ? '1 min à pied' :
                      '徒歩1分',
                category: lang === 'en' ? 'Urban Park' :
                  lang === 'ko' ? '도시 공원' :
                    lang === 'fr' ? 'Parc urbain' :
                      '都市公園',
                description: lang === 'en' ?
                  'Lush green park at the foot of Tokyo Tower. Perfect for walks and picnics.' :
                  lang === 'ko' ?
                    '도쿄타워 기슭에 펼쳐진 푸른 공원. 산책과 피크닉에 추천합니다.' :
                    lang === 'fr' ?
                      'Parc verdoyant au pied de la Tokyo Tower. Parfait pour les promenades et les pique-niques.' :
                      '東京タワーの足元に広がる緑豊かな公園。散歩やピクニックにおすすめです。',
                color: 'from-emerald-400 to-emerald-600',
                image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=70',
              },
              {
                name: lang === 'en' ? 'Atago Shrine' : '愛宕神社',
                distance: lang === 'en' ? '8 min walk' :
                  lang === 'ko' ? '도보 8분' :
                    lang === 'fr' ? '8 min à pied' :
                      '徒歩8分',
                category: lang === 'en' ? 'Shrine' :
                  lang === 'ko' ? '신사' :
                    lang === 'fr' ? 'Sanctuaire' :
                      '神社',
                description: lang === 'en' ?
                  'Famous shrine with the "Success Steps". Located on the highest natural hill in Tokyo\'s 23 wards.' :
                  lang === 'ko' ?
                    '출세의 돌계단으로 유명한 신사. 도쿄 23구에서 가장 높은 자연 산에 있습니다.' :
                    lang === 'fr' ?
                      'Sanctuaire célèbre pour ses "Marches du Succès". Situé sur la plus haute colline naturelle des 23 arrondissements de Tokyo.' :
                      '出世の石段で有名な神社。東京23区で最も高い自然の山にあります。',
                color: 'from-blue-400 to-blue-600',
                image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&auto=format&fit=crop&q=70',
              },
            ].map((spot, index) => (
              <div
                key={index}
                className="border border-border-light rounded-2xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white"
              >
                <div className="relative h-48">
                  <Image
                    src={spot.image}
                    alt={spot.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      // フォールバック：画像が見つからない場合はグラデーション背景を表示
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.className = `h-48 bg-gradient-to-br ${spot.color}`;
                      }
                    }}
                  />
                </div>
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
        )}

        {/* 関連スポット・内部リンク強化セクション */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg border border-blue-100 p-8 mb-12">
          <h2 className="flex items-center gap-4 text-2xl font-bold text-gray-800 mb-8 border-b border-blue-200 pb-4">
            <MapPin className="text-blue-600" size={28} />
            {lang === 'en' ? 'Related Spots & Travel Plans' :
              lang === 'ko' ? '관련 스팟 & 여행 계획' :
                lang === 'fr' ? 'Spots connexes et plans de voyage' :
                  '関連スポット・旅行プラン'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI旅行プラン作成 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Bot className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {lang === 'en' ? 'Create AI Travel Plan' :
                      lang === 'ko' ? 'AI 여행 계획 만들기' :
                        lang === 'fr' ? 'Créer un plan de voyage IA' :
                          'AI旅行プラン作成'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {lang === 'en' ? 'Add this spot to your personalized itinerary' :
                      lang === 'ko' ? '이 스팟을 맞춤 여행일정에 추가' :
                        lang === 'fr' ? 'Ajoutez ce lieu à votre itinéraire personnalisé' :
                          'このスポットを個人向け旅行プランに追加'}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {lang === 'en' ? 'AI will create the optimal route considering travel time and costs between spots.' :
                  lang === 'ko' ? 'AI가 스팟 간 이동 시간과 비용을 고려한 최적 루트를 생성합니다.' :
                    lang === 'fr' ? 'L\'IA créera l\'itinéraire optimal en tenant compte du temps de trajet et des coûts entre les lieux.' :
                      'AIがスポット間の移動時間や料金を考慮した最適なルートを生成します。'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={addToAITravelPlan}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-colors"
                >
                  {lang === 'en' ? 'Add to Plan' :
                    lang === 'ko' ? '플랜에 추가' :
                      lang === 'fr' ? 'Ajouter au plan' :
                        'プランに追加'}
                </button>
                <a
                  href="/ai-spots"
                  className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                >
                  {lang === 'en' ? 'AI Spots' :
                    lang === 'ko' ? 'AI 스팟' :
                      lang === 'fr' ? 'Spots IA' :
                        'AIスポット'}
                </a>
              </div>
            </div>

            {/* 関連エリア・スポット */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Map className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {lang === 'en' ? 'Explore More Areas' :
                      lang === 'ko' ? '더 많은 지역 탐험' :
                        lang === 'fr' ? 'Explorer plus de régions' :
                          'もっとエリアを探索'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {lang === 'en' ? 'Discover other attractions in Tokyo' :
                      lang === 'ko' ? '도쿄의 다른 명소 발견' :
                        lang === 'fr' ? 'Découvrez d\'autres attractions de Tokyo' :
                          '東京の他の観光名所を発見'}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {lang === 'en' ? 'Browse spots by area to find the perfect combination for your Tokyo adventure.' :
                  lang === 'ko' ? '지역별로 스팟을 찾아보고 완벽한 도쿄 모험 조합을 찾아보세요.' :
                    lang === 'fr' ? 'Parcourez les lieux par région pour trouver la combinaison parfaite pour votre aventure à Tokyo.' :
                      'エリア別にスポットを閲覧して、東京での完璧な組み合わせを見つけましょう。'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/areas"
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors text-center"
                >
                  {lang === 'en' ? 'All Areas' :
                    lang === 'ko' ? '모든 지역' :
                      lang === 'fr' ? 'Toutes les régions' :
                        '全エリア'}
                </a>
                <a
                  href="/discover"
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors text-center"
                >
                  {lang === 'en' ? 'Discover' :
                    lang === 'ko' ? '발견' :
                      lang === 'fr' ? 'Découvrir' :
                        '発見'}
                </a>
              </div>
            </div>
          </div>

          {/* 人気のスポット組み合わせ */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
              <Star className="text-yellow-500" size={20} />
              {lang === 'en' ? 'Popular Spot Combinations' :
                lang === 'ko' ? '인기 스팟 조합' :
                  lang === 'fr' ? 'Combinaisons de lieux populaires' :
                    '人気のスポット組み合わせ'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: lang === 'en' ? 'Tokyo Tower → Tsukiji → Ginza' :
                    lang === 'ko' ? '도쿄타워 → 츠키지 → 긴자' :
                      lang === 'fr' ? 'Tokyo Tower → Tsukiji → Ginza' :
                        '東京タワー → 築地 → 銀座',
                  time: lang === 'en' ? 'Half day' :
                    lang === 'ko' ? '반나절' :
                      lang === 'fr' ? 'Demi-journée' :
                        '半日',
                  description: lang === 'en' ? 'Tower views, fresh sushi, luxury shopping' :
                    lang === 'ko' ? '타워 전망, 신선한 스시, 럭셔리 쇼핑' :
                      lang === 'fr' ? 'Vues de la tour, sushi frais, shopping de luxe' :
                        'タワーの眺望、新鮮な寿司、高級ショッピング'
                },
                {
                  title: lang === 'en' ? 'Tokyo Tower → Shibuya → Harajuku' :
                    lang === 'ko' ? '도쿄타워 → 시부야 → 하라주쿠' :
                      lang === 'fr' ? 'Tokyo Tower → Shibuya → Harajuku' :
                        '東京タワー → 渋谷 → 原宿',
                  time: lang === 'en' ? 'Full day' :
                    lang === 'ko' ? '하루' :
                      lang === 'fr' ? 'Journée complète' :
                        '1日',
                  description: lang === 'en' ? 'Classic Tokyo sights and youth culture' :
                    lang === 'ko' ? '클래식 도쿄 명소와 청년 문화' :
                      lang === 'fr' ? 'Sites classiques de Tokyo et culture jeune' :
                        '東京の定番スポットと若者文化'
                },
                {
                  title: lang === 'en' ? 'Tokyo Tower → Asakusa → Ueno' :
                    lang === 'ko' ? '도쿄타워 → 아사쿠사 → 우에노' :
                      lang === 'fr' ? 'Tokyo Tower → Asakusa → Ueno' :
                        '東京タワー → 浅草 → 上野',
                  time: lang === 'en' ? 'Full day' :
                    lang === 'ko' ? '하루' :
                      lang === 'fr' ? 'Journée complète' :
                        '1日',
                  description: lang === 'en' ? 'Modern and traditional Tokyo contrast' :
                    lang === 'ko' ? '현대와 전통 도쿄의 대비' :
                      lang === 'fr' ? 'Contraste entre Tokyo moderne et traditionnel' :
                        'モダンと伝統の東京対比'
                }
              ].map((combo, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800 text-sm">{combo.title}</h4>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{combo.time}</span>
                  </div>
                  <p className="text-xs text-gray-600">{combo.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* フローティングCTA（右下固定） */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2">
        <button
          onClick={addToAITravelPlan}
          className="px-5 py-3 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold hover:opacity-95"
        >
          {lang === 'en' ? 'Add to AI Plan' : 'AIプランに追加'}
        </button>
        <a
          href="#tickets"
          className="px-5 py-3 rounded-full shadow-lg bg-white text-sky-700 border border-sky-200 font-semibold hover:bg-sky-50 text-center"
        >
          {lang === 'en' ? 'Book Tickets' : 'チケット予約'}
        </a>
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
              <div
                className="w-full h-72 md:h-80 flex items-center justify-center"
                style={{
                  background: activeModal ? getModalPhotoBackground(activeModal, spotData?.name || '') : 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
                }}
              >
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">{getModalPhotoIcon(activeModal || '', spotData?.name || '')}</div>
                  <span className="text-2xl font-semibold">
                    {getModalPhotoLabel(activeModal || '', spotData?.name || '')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
