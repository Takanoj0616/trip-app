'use client';

import Head from 'next/head';
import { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { tokyoSpotsDetailed, type TokyoSpot, type SpotInfo, type SpotName } from '@/data/tokyo-spots-detailed';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { db, collection, query, getDocs, orderBy, limit } from '@/lib/firebase';
import { TouristSpot } from '@/types';
import { allBookstoreSpots } from '@/data/tokyo-bookstore-spots';
import { allRestaurantSpots } from '@/data/tokyo-restaurant-spots';

interface Review {
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

interface Location {
  address: string;
  nearestStation?: string;
  accessInfo?: {
    train?: string[];
    bus?: string[];
    car?: string;
  };
}

interface Facilities {
  wheelchairAccessible?: boolean;
  strollerFriendly?: boolean;
  restrooms?: boolean;
  restaurant?: boolean;
  souvenirShop?: boolean;
  noSmoking?: boolean;
  photography?: boolean;
  freeWifi?: boolean;
}

interface Spot {
  id: string | number; // Support both string (Firebase) and number (legacy)
  slug?: string; // Firestore document ID
  name: SpotName;
  rating: number;
  reviews?: Review[];
  reviewCount?: number;
  image: string;
  badges: string[];
  info: SpotInfo;
  tags: string[];
  category: 'food' | 'sights' | 'hotels';
  description?: string;
  location?: Location;
  facilities?: Facilities;
  images?: string[];
}

type Category = 'food' | 'sights' | 'hotels';

export default function TokyoSpots() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const FREE_COUNT = 9;
  // State management
  const [currentCategory, setCurrentCategory] = useState<Category>('sights');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteSpots, setFavoriteSpots] = useState<Set<string | number>>(new Set());
  const [currentLanguage, setCurrentLanguage] = useState<'ja' | 'en' | 'ko' | 'fr'>('ja');
  const [firebaseSpots, setFirebaseSpots] = useState<TouristSpot[]>([]);
  const [firestoreLoading, setFirestoreLoading] = useState(true);

  // Listen for language changes from header
  useEffect(() => {
    const checkLanguage = () => {
      const activeLangBtn = document.querySelector('.lang-btn.active');
      if (activeLangBtn) {
        const lang = activeLangBtn.getAttribute('data-lang') as 'ja' | 'en' | 'ko' | 'fr';
        if (lang && lang !== currentLanguage) {
          setCurrentLanguage(lang);
        }
      }
    };

    // Initial check
    checkLanguage();

    // Create observer to watch for class changes on language buttons
    const observer = new MutationObserver(() => {
      checkLanguage();
    });

    // Start observing
    const langSelector = document.querySelector('.lang-selector');
    if (langSelector) {
      observer.observe(langSelector, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }

    // Also listen for click events as backup
    const langButtons = document.querySelectorAll('.lang-btn');
    const handleClick = () => setTimeout(checkLanguage, 100);
    langButtons.forEach(btn => btn.addEventListener('click', handleClick));

    // Cleanup
    return () => {
      observer.disconnect();
      langButtons.forEach(btn => btn.removeEventListener('click', handleClick));
    };
  }, [currentLanguage]);

  // Fetch Firebase spots data with caching
  useEffect(() => {
    let mounted = true;
    
    // Check for cached data first
    const getCachedSpots = () => {
      try {
        const cached = localStorage.getItem('firebase-spots-cache');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          // Cache valid for 5 minutes
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            return data;
          }
        }
      } catch (error) {
        console.warn('Cache read error:', error);
      }
      return null;
    };

    // Load cached data immediately if available
    const cachedSpots = getCachedSpots();
    if (cachedSpots) {
      setFirebaseSpots([...cachedSpots, ...allBookstoreSpots, ...allRestaurantSpots]);
      setFirestoreLoading(false);
      console.log('Loaded cached spots:', cachedSpots.length);
    }

    if (!db) {
      console.warn('Firebase is not initialized');
      if (!cachedSpots) {
        setFirestoreLoading(false);
        setFirebaseSpots(allBookstoreSpots);
      }
      return;
    }

    const fetchSpots = async () => {
      try {
        const spotsCollection = collection(db, 'spots');
        // Optimize query with ordering and limiting if needed
        const spotsQuery = query(spotsCollection, orderBy('rating', 'desc'));
        
        const snapshot = await getDocs(spotsQuery);
        
        if (!mounted) return;
        
        const spots: TouristSpot[] = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          spots.push({
            id: doc.id,
            name: data.name || 'Unknown',
            description: data.description || 'No description available',
            category: data.category || 'shopping',
            area: data.area || 'tokyo',
            location: data.location || { lat: 0, lng: 0, address: 'Unknown location' },
            rating: data.rating || 4.0,
            images: data.images || [],
            reviews: data.reviews || [],
            tags: data.tags || [],
            googlePlaceId: data.googlePlaceId || data.id,
            ...data
          } as TouristSpot);
        });
        
        // Cache the results
        try {
          localStorage.setItem('firebase-spots-cache', JSON.stringify({
            data: spots,
            timestamp: Date.now()
          }));
        } catch (error) {
          console.warn('Cache write error:', error);
        }
        
        setFirebaseSpots([...spots, ...allBookstoreSpots, ...allRestaurantSpots]);
        setFirestoreLoading(false);
        console.log('Firebase spots loaded:', spots.length);
        
      } catch (error) {
        console.error('Error fetching spots:', error);
        if (!cachedSpots) {
          setFirebaseSpots(allBookstoreSpots);
        }
        setFirestoreLoading(false);
      }
    };

    // Only fetch from Firebase if no cache or if cache is old
    if (!cachedSpots) {
      fetchSpots();
    } else {
      // Still fetch fresh data in background but don't block UI
      setTimeout(fetchSpots, 100);
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Multi-language translations for Tokyo spots
  const translations = {
    ja: {
      pageTitle: "Tokyo Spots",
      pageSubtitle: "東京の最高のレストラン、観光地、ホテルを発見しよう",
      categories: {
        food: "飲食",
        sights: "観光スポット", 
        hotels: "ホテル"
      },
      filters: {
        sortBy: "並び替え:",
        budget: "予算:",
        cuisine: "料理:",
        openNow: "営業中",
        crowdLevel: "混雑度:",
        duration: "所要時間:",
        indoor: "屋内",
        outdoor: "屋外",
        pricePerNight: "価格/泊:",
        starRating: "星数:",
        available: "空室あり",
        allBudgets: "すべて",
        allCuisines: "すべて",
        allLevels: "すべて",
        allDurations: "すべて",
        allPrices: "すべて",
        allStars: "すべて",
        budget1: "¥1,000以下",
        budget2: "¥1,000-3,000", 
        budget3: "¥3,000以上",
        japanese: "和食",
        sushi: "寿司",
        ramen: "ラーメン",
        western: "洋食",
        low: "空いている",
        medium: "普通",
        high: "混雑",
        short: "1時間以内",
        medium2: "1-3時間",
        long: "3時間以上"
      },
      sorting: {
        popular: "人気",
        rating: "評価", 
        distance: "距離",
        price: "価格"
      },
      actions: {
        search: "キーワードで検索...",
        detailsBtn: "詳細を見る",
        loadMore: "さらに表示"
      },
      spots: {
        cuisineTypes: {
          "ビュッフェ": "ビュッフェ",
          "ファストフード": "ファストフード", 
          "ベーカリー": "ベーカリー",
          "焼肉": "焼肉",
          "そば・うどん": "そば・うどん",
          "中華": "中華",
          "フレンチ": "フレンチ",
          "和食": "和食",
          "韓国料理": "韓国料理",
          "カフェ": "カフェ"
        },
        badges: {
          "営業中": "営業中",
          "予約不要": "予約不要",
          "駐車場あり": "駐車場あり", 
          "個室あり": "個室あり",
          "高級": "高級",
          "予約必要": "予約必要",
          "テイクアウト可": "テイクアウト可",
          "受賞店": "受賞店",
          "デリバリー可": "デリバリー可",
          "禁煙": "禁煙",
          "高級価格帯": "高級価格帯",
          "フランス修行シェフ": "フランス修行シェフ",
          "昼食専門": "昼食専門"
        },
        tags: {
          "ロマンチック": "ロマンチック",
          "友人との食事": "友人との食事",
          "店内飲食": "店内飲食", 
          "車椅子対応": "車椅子対応",
          "賑やか": "賑やか",
          "ビジネス接待": "ビジネス接待",
          "観光": "観光",
          "一人食事": "一人食事",
          "アットホーム": "アットホーム",
          "モダン": "モダン",
          "アルコール有": "アルコール有",
          "カジュアル": "カジュアル",
          "家族連れ": "家族連れ",
          "伝統的": "伝統的",
          "記念日": "記念日",
          "デート": "デート",
          "フォーマル": "フォーマル",
          "Wi-Fi有": "Wi-Fi有",
          "ファミリー向け": "ファミリー向け"
        },
        reviews: "件"
      }
    },
    en: {
      pageTitle: "Tokyo Spots",
      pageSubtitle: "Discover the best dining, sightseeing, and hotels in Tokyo",
      categories: {
        food: "Dining",
        sights: "Sightseeing",
        hotels: "Hotels"
      },
      filters: {
        sortBy: "Sort by:",
        budget: "Budget:",
        cuisine: "Cuisine:",
        openNow: "Open Now",
        crowdLevel: "Crowd Level:",
        duration: "Duration:",
        indoor: "Indoor",
        outdoor: "Outdoor", 
        pricePerNight: "Price/night:",
        starRating: "Star Rating:",
        available: "Available",
        allBudgets: "All",
        allCuisines: "All",
        allLevels: "All",
        allDurations: "All",
        allPrices: "All",
        allStars: "All",
        budget1: "Under ¥1,000",
        budget2: "¥1,000-3,000",
        budget3: "Over ¥3,000",
        japanese: "Japanese",
        sushi: "Sushi",
        ramen: "Ramen",
        western: "Western",
        low: "Not Crowded",
        medium: "Normal",
        high: "Crowded",
        short: "Under 1 hour",
        medium2: "1-3 hours",
        long: "Over 3 hours"
      },
      sorting: {
        popular: "Popular",
        rating: "Rating",
        distance: "Distance", 
        price: "Price"
      },
      actions: {
        search: "Search by keyword...",
        detailsBtn: "View Details",
        loadMore: "Load More"
      },
      spots: {
        cuisineTypes: {
          "ビュッフェ": "Buffet",
          "ファストフード": "Fast Food", 
          "ベーカリー": "Bakery",
          "焼肉": "BBQ",
          "そば・うどん": "Soba/Udon",
          "中華": "Chinese",
          "フレンチ": "French",
          "和食": "Japanese",
          "韓国料理": "Korean",
          "カフェ": "Cafe"
        },
        badges: {
          "営業中": "Open Now",
          "予約不要": "No Reservation Required",
          "駐車場あり": "Parking Available", 
          "個室あり": "Private Rooms",
          "高級": "Upscale",
          "予約必要": "Reservation Required",
          "テイクアウト可": "Takeout Available",
          "受賞店": "Award-winning",
          "デリバリー可": "Delivery Available",
          "禁煙": "Non-smoking",
          "高級価格帯": "Premium Pricing",
          "フランス修行シェフ": "French-trained Chef",
          "昼食専門": "Lunch Only"
        },
        tags: {
          "ロマンチック": "Romantic",
          "友人との食事": "Dining with Friends",
          "店内飲食": "Dine-in", 
          "車椅子対応": "Wheelchair Accessible",
          "賑やか": "Lively",
          "ビジネス接待": "Business Dining",
          "観光": "Tourist Friendly",
          "一人食事": "Solo Dining",
          "アットホーム": "Cozy",
          "モダン": "Modern",
          "アルコール有": "Alcohol Available",
          "カジュアル": "Casual",
          "家族連れ": "Family Friendly",
          "伝統的": "Traditional",
          "記念日": "Special Occasions",
          "デート": "Date Night",
          "フォーマル": "Formal",
          "Wi-Fi有": "WiFi Available",
          "ファミリー向け": "Family-oriented"
        },
        reviews: "reviews"
      }
    },
    ko: {
      pageTitle: "Tokyo Spots",
      pageSubtitle: "도쿄 최고의 레스토랑, 관광지, 호텔을 발견하세요",
      categories: {
        food: "음식점",
        sights: "관광지",
        hotels: "호텔"
      },
      filters: {
        sortBy: "정렬:",
        budget: "예산:",
        cuisine: "요리:",
        openNow: "영업 중",
        crowdLevel: "혼잡도:",
        duration: "소요시간:",
        indoor: "실내",
        outdoor: "실외",
        pricePerNight: "1박 요금:",
        starRating: "별점:",
        available: "예약 가능",
        allBudgets: "전체",
        allCuisines: "전체",
        allLevels: "전체",
        allDurations: "전체",
        allPrices: "전체",
        allStars: "전체",
        budget1: "¥1,000 이하",
        budget2: "¥1,000-3,000",
        budget3: "¥3,000 이상",
        japanese: "일식",
        sushi: "스시",
        ramen: "라멘",
        western: "양식",
        low: "여유로움",
        medium: "보통",
        high: "혼잡",
        short: "1시간 이내",
        medium2: "1-3시간",
        long: "3시간 이상"
      },
      sorting: {
        popular: "인기",
        rating: "평점",
        distance: "거리",
        price: "가격"
      },
      actions: {
        search: "키워드로 검색...",
        detailsBtn: "상세보기",
        loadMore: "더 보기"
      },
      spots: {
        cuisineTypes: {
          "ビュッフェ": "뷔페",
          "ファストフード": "패스트푸드", 
          "ベーカリー": "베이커리",
          "焼肉": "고기구이",
          "そば・うどん": "소바/우동",
          "中華": "중식",
          "フレンチ": "프렌치",
          "和食": "일식",
          "韓国料理": "한식",
          "カフェ": "카페"
        },
        badges: {
          "営業中": "영업 중",
          "予約不要": "예약 불필요",
          "駐車場あり": "주차 가능", 
          "個室あり": "개인실 있음",
          "高級": "고급",
          "予約必要": "예약 필요",
          "テイクアウト可": "테이크아웃 가능",
          "受賞店": "수상점",
          "デリバリー可": "배달 가능",
          "禁煙": "금연",
          "高級価格帯": "프리미엄 가격",
          "フランス修行シェフ": "프랑스 수업 셰프",
          "昼食専門": "점심 전문"
        },
        tags: {
          "ロマンチック": "로맨틱",
          "友人との食事": "친구와 식사",
          "店内飲食": "매장 식사", 
          "車椅子対応": "휠체어 접근 가능",
          "賑やか": "활기찬",
          "ビジネス接待": "비즈니스 접대",
          "観光": "관광객 친화적",
          "一人食事": "혼자 식사",
          "アットホーム": "아늑한",
          "モダン": "모던",
          "アルコール有": "주류 있음",
          "カジュアル": "캐주얼",
          "家族連れ": "가족 친화적",
          "伝統的": "전통적",
          "記念日": "기념일",
          "デート": "데이트",
          "フォーマル": "포멀",
          "Wi-Fi有": "와이파이 있음",
          "ファミリー向け": "가족 지향"
        },
        reviews: "리뷰"
      }
    },
    fr: {
      pageTitle: "Tokyo Spots",
      pageSubtitle: "Découvrez les meilleurs restaurants, attractions et hôtels de Tokyo",
      categories: {
        food: "Restaurants",
        sights: "Attractions",
        hotels: "Hôtels"
      },
      filters: {
        sortBy: "Trier par:",
        budget: "Budget:",
        cuisine: "Cuisine:",
        openNow: "Ouvert maintenant",
        crowdLevel: "Niveau d'affluence:",
        duration: "Durée:",
        indoor: "Intérieur",
        outdoor: "Extérieur",
        pricePerNight: "Prix/nuit:",
        starRating: "Étoiles:",
        available: "Disponible",
        allBudgets: "Tous",
        allCuisines: "Toutes",
        allLevels: "Tous",
        allDurations: "Toutes",
        allPrices: "Tous",
        allStars: "Toutes",
        budget1: "Moins de ¥1,000",
        budget2: "¥1,000-3,000",
        budget3: "Plus de ¥3,000",
        japanese: "Japonaise",
        sushi: "Sushi",
        ramen: "Ramen",
        western: "Occidentale",
        low: "Peu fréquenté",
        medium: "Normal",
        high: "Très fréquenté",
        short: "Moins d'1 heure",
        medium2: "1-3 heures",
        long: "Plus de 3 heures"
      },
      sorting: {
        popular: "Populaire",
        rating: "Note",
        distance: "Distance",
        price: "Prix"
      },
      actions: {
        search: "Rechercher par mot-clé...",
        detailsBtn: "Voir les détails",
        loadMore: "Charger plus"
      },
      spots: {
        cuisineTypes: {
          "ビュッフェ": "Buffet",
          "ファストフード": "Fast-food",
          "ベーカリー": "Boulangerie",
          "焼肉": "Grillades",
          "そば・うどん": "Soba/Udon",
          "中華": "Chinoise",
          "フレンチ": "Française",
          "和食": "Japonaise",
          "韓国料理": "Coréenne",
          "カフェ": "Café"
        },
        badges: {
          "営業中": "Ouvert",
          "予約不要": "Sans réservation",
          "駐車場あり": "Parking disponible",
          "個室あり": "Salles privées",
          "高級": "Haut de gamme",
          "予約必要": "Réservation requise",
          "テイクアウト可": "À emporter",
          "受賞店": "Primé",
          "デリバリー可": "Livraison",
          "禁煙": "Non-fumeur",
          "高級価格帯": "Prix premium",
          "フランス修行シェフ": "Chef formé en France",
          "昼食専門": "Déjeuner uniquement"
        },
        tags: {
          "ロマンチック": "Romantique",
          "友人との食事": "Entre amis",
          "店内飲食": "Sur place",
          "車椅子対応": "Accessible PMR",
          "賑やか": "Animé",
          "ビジネス接待": "Affaires",
          "観光": "Touristique",
          "一人食事": "Solo",
          "アットホーム": "Convivial",
          "モダン": "Moderne",
          "アルコール有": "Alcool disponible",
          "カジュアル": "Décontracté",
          "家族連れ": "Familial",
          "伝統的": "Traditionnel",
          "記念日": "Occasions spéciales",
          "デート": "Rendez-vous",
          "フォーマル": "Formel",
          "Wi-Fi有": "WiFi disponible",
          "ファミリー向け": "Adapté aux familles"
        },
        reviews: "avis"
      }
    }
  };

  // Get translations for current language
  const tr = translations[currentLanguage as keyof typeof translations] || translations.ja;

  // Helper function to convert TouristSpot to Spot
  const touristSpotToSpot = useCallback((touristSpot: TouristSpot): Spot => {
    // Convert TouristSpot name (string) to SpotName format
    const spotName: SpotName = {
      ja: touristSpot.name,
      en: touristSpot.name,
      ko: touristSpot.name,
      fr: touristSpot.name
    };

    // Convert category
    const categoryMap: Record<TouristSpot['category'], Category> = {
      'sightseeing': 'sights',
      'restaurants': 'food', 
      'hotels': 'hotels',
      'transportation': 'sights',
      'entertainment': 'sights',
      'shopping': 'sights'
    };

    // Create SpotInfo
    const spotInfo: SpotInfo = {
      duration: '1-2時間',
      ticketRequired: touristSpot.priceRange ? '必要' : '不要',
      bestTime: '平日',
      crowdLevel: '普通',
      openHours: touristSpot.openingHours ? Object.values(touristSpot.openingHours)[0] || '営業時間未定' : '営業時間未定',
      price: touristSpot.priceRange === 'expensive' ? '¥3000以上' : 
             touristSpot.priceRange === 'moderate' ? '¥1000-3000' : '¥1000以下'
    };

    return {
      id: touristSpot.id,
      slug: touristSpot.googlePlaceId,
      name: spotName,
      rating: touristSpot.rating || 4.0,
      reviewCount: touristSpot.reviews?.length || 0,
      reviews: touristSpot.reviews || [],
      image: touristSpot.images?.[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      badges: ['営業中', '人気'],
      info: spotInfo,
      tags: touristSpot.tags || ['観光'],
      category: categoryMap[touristSpot.category] || 'sights',
      description: touristSpot.description,
      images: touristSpot.images
    };
  }, []);

  // Helper function to get display name with fallback logic (en → ja → ko → fr)
  const getDisplayName = useCallback((name: SpotName): string => {
    if (currentLanguage === 'ja' && name.ja) return name.ja;
    if (currentLanguage === 'en' && name.en) return name.en;
    if (currentLanguage === 'ko' && name.ko) return name.ko;
    if (currentLanguage === 'fr' && name.fr) return name.fr;
    // Fallback order: en → ja → ko → fr
    return name.en || name.ja || name.ko || name.fr || '';
  }, [currentLanguage]);

  // Data - moved inside useMemo to avoid dependency issues
  const filteredSpots = useMemo(() => {
    // 共有データを現在の型に適合させる
    const sightsData = tokyoSpotsDetailed.map(spot => ({
      ...spot,
      reviews: spot.reviews || []
    }));

    // Convert Firebase spots to legacy Spot format
    const convertedFirebaseSpots = firebaseSpots.map(touristSpotToSpot);
    
    // Filter Firebase spots by category
    const firebaseSightSpots = convertedFirebaseSpots.filter(spot => spot.category === 'sights');
    const firebaseFoodSpots = convertedFirebaseSpots.filter(spot => spot.category === 'food');
    const firebaseHotelSpots = convertedFirebaseSpots.filter(spot => spot.category === 'hotels');

    const sampleData: Record<Category, Spot[]> = {
      food: [
        {
          id: 1,
          name: {
            ja: "鮨麒",
            en: "Sushi Kiri",
            ko: "스시 키리",
            fr: "Sushi Kiri"
          },
          rating: 4.6,
          reviewCount: 1461,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["営業中", "ビュッフェ", "予約不要", "駐車場あり"],
          info: {
            price: "8000-12000円",
            cuisine: "ビュッフェ",
            distance: "0.5km",
            openHours: "8:00 - 20:00"
          },
          tags: ["ロマンチック", "友人との食事", "店内飲食", "車椅子対応"],
          category: "food"
        },
        {
          id: 2,
          name: {
            ja: "ビストロ楽",
            en: "Bistro Raku",
            ko: "비스트로 라쿠",
            fr: "Bistro Raku"
          },
          rating: 3.6,
          reviewCount: 2421,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["ファストフード", "予約不要", "テイクアウト可"],
          info: {
            price: "1000-2000円",
            cuisine: "ファストフード",
            distance: "0.5km",
            openHours: "11:00 - 21:00"
          },
          tags: ["賑やか", "ビジネス接待", "観光", "友人との食事", "一人食事"],
          category: "food"
        },
        {
          id: 3,
          name: {
            ja: "日本料理風",
            en: "Japanese Restaurant Kaze",
            ko: "일본요리 카제",
            fr: "Restaurant Japonais Kaze"
          },
          rating: 3.1,
          reviewCount: 169,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["ベーカリー", "予約必要", "個室あり", "高級"],
          info: {
            price: "5000-8000円",
            cuisine: "ベーカリー",
            distance: "0.5km",
            openHours: "11:30 - 14:30, 18:00 - 22:00"
          },
          tags: ["アットホーム", "観光", "店内飲食", "車椅子対応"],
          category: "food"
        },
        {
          id: 4,
          name: {
            ja: "焼肉花",
            en: "BBQ Hana",
            ko: "야키니쿠 하나",
            fr: "BBQ Hana"
          },
          rating: 4.5,
          reviewCount: 1046,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["焼肉", "予約必要", "テイクアウト可", "受賞店"],
          info: {
            price: "8000-12000円",
            cuisine: "焼肉",
            distance: "0.5km",
            openHours: "11:30 - 14:30, 18:00 - 22:00"
          },
          tags: ["モダン", "一人食事", "駐車場あり", "アルコール有"],
          category: "food"
        },
        {
          id: 5,
          name: {
            ja: "麺屋寿",
            en: "Menya Kotobuki",
            ko: "멘야 코토부키",
            fr: "Menya Kotobuki"
          },
          rating: 3.4,
          reviewCount: 2554,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["そば・うどん", "予約必要", "デリバリー可", "高級"],
          info: {
            price: "20000円以上",
            cuisine: "そば・うどん",
            distance: "0.5km",
            openHours: "11:30 - 14:30, 18:00 - 22:00"
          },
          tags: ["カジュアル", "ビジネス接待", "家族連れ", "一人食事", "観光"],
          category: "food"
        },
        {
          id: 6,
          name: {
            ja: "十鳥",
            en: "Jutori",
            ko: "주토리",
            fr: "Jutori"
          },
          rating: 4.1,
          reviewCount: 342,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["焼肉", "予約必要", "禁煙", "高級価格帯"],
          info: {
            price: "1000-2000円",
            cuisine: "焼肉",
            distance: "0.5km",
            openHours: "11:30 - 14:30, 18:00 - 22:00"
          },
          tags: ["伝統的", "記念日", "家族連れ", "デート", "一人食事"],
          category: "food"
        },
        {
          id: 7,
          name: {
            ja: "炭火焼亀",
            en: "Charcoal Grill Kame",
            ko: "참불구이 카메",
            fr: "Grill au Charbon Kame"
          },
          rating: 3.3,
          reviewCount: 2394,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["焼肉", "予約不要", "テイクアウト可", "フランス修行シェフ"],
          info: {
            price: "1000-2000円",
            cuisine: "焼肉",
            distance: "0.5km",
            openHours: "11:30 - 14:30, 18:00 - 22:00"
          },
          tags: ["カジュアル", "ビジネス接待", "友人との食事", "記念日", "家族連れ"],
          category: "food"
        },
        {
          id: 8,
          name: {
            ja: "寿製麺",
            en: "Kotobuki Seimen",
            ko: "코토부키 세이멘",
            fr: "Kotobuki Seimen"
          },
          rating: 3.5,
          reviewCount: 1041,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["中華", "予約必要", "個室あり", "デリバリー可"],
          info: {
            price: "1000-2000円",
            cuisine: "中華",
            distance: "0.5km",
            openHours: "8:00 - 20:00"
          },
          tags: ["カジュアル", "一人食事", "友人との食事", "駐車場あり"],
          category: "food"
        },
        {
          id: 9,
          name: {
            ja: "イタリアン四",
            en: "Italian Shi",
            ko: "이탈리안 시",
            fr: "Italien Shi"
          },
          rating: 4.3,
          reviewCount: 2692,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["ベーカリー", "予約不要", "個室あり", "テイクアウト可"],
          info: {
            price: "500-1000円",
            cuisine: "ベーカリー",
            distance: "0.5km",
            openHours: "11:30 - 14:30, 18:00 - 22:00"
          },
          tags: ["フォーマル", "ビジネス接待", "車椅子対応", "Wi-Fi有"],
          category: "food"
        },
        {
          id: 10,
          name: {
            ja: "空寿司",
            en: "Sora Sushi",
            ko: "소라 스시",
            fr: "Sora Sushi"
          },
          rating: 3.8,
          reviewCount: 2736,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["そば・うどん", "予約必要", "禁煙", "受賞店"],
          info: {
            price: "500-1000円",
            cuisine: "そば・うどん",
            distance: "0.5km",
            openHours: "8:00 - 20:00"
          },
          tags: ["ファミリー向け", "デート", "記念日", "友人との食事", "家族連れ"],
          category: "food"
        },
        {
          id: 11,
          name: {
            ja: "麺工房高",
            en: "Menkobo Taka",
            ko: "멘코보 타카",
            fr: "Menkobo Taka"
          },
          rating: 3.8,
          reviewCount: 684,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["韓国料理", "予約不要", "デリバリー可", "受賞店"],
          info: {
            price: "1000-2000円",
            cuisine: "韓国料理",
            distance: "0.5km",
            openHours: "8:00 - 20:00"
          },
          tags: ["カジュアル", "デート", "一人食事", "アルコール有"],
          category: "food"
        },
        {
          id: 12,
          name: {
            ja: "麺屋麟",
            en: "Menya Rin",
            ko: "멘야 린",
            fr: "Menya Rin"
          },
          rating: 4.7,
          reviewCount: 615,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["そば・うどん", "予約必要", "禁煙", "昼食専門"],
          info: {
            price: "8000-12000円",
            cuisine: "そば・うどん",
            distance: "0.5km",
            openHours: "11:00 - 21:00"
          },
          tags: ["ファミリー向け", "ビジネス接待", "観光", "一人食事", "家族連れ"],
          category: "food"
        },
        {
          id: 13,
          name: {
            ja: "カフェ清",
            en: "Cafe Sei",
            ko: "카페 세이",
            fr: "Café Sei"
          },
          rating: 3.9,
          reviewCount: 1469,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["カフェ", "予約必要", "個室あり", "高級"],
          info: {
            price: "20000円以上",
            cuisine: "カフェ",
            distance: "0.5km",
            openHours: "8:00 - 20:00"
          },
          tags: ["賑やか", "記念日", "デート", "友人との食事", "一人食事"],
          category: "food"
        },
        {
          id: 14,
          name: {
            ja: "食事処夕",
            en: "Shokujidokoro Yu",
            ko: "쇼쿠지도코로 유",
            fr: "Restaurant Yu"
          },
          rating: 4.4,
          reviewCount: 2935,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["和食", "予約必要", "禁煙", "テイクアウト可"],
          info: {
            price: "1000-2000円",
            cuisine: "和食",
            distance: "0.5km",
            openHours: "11:30 - 14:30, 18:00 - 22:00"
          },
          tags: ["ロマンチック", "一人食事", "ビジネス接待", "駐車場あり"],
          category: "food"
        },
        {
          id: 15,
          name: {
            ja: "レストラン橙",
            en: "Restaurant Dai",
            ko: "레스토랑 다이",
            fr: "Restaurant Dai"
          },
          rating: 4.2,
          reviewCount: 1774,
          reviews: [],
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          badges: ["フレンチ", "予約不要", "高級価格帯", "受賞店"],
          info: {
            price: "5000-8000円",
            cuisine: "フレンチ",
            distance: "0.5km",
            openHours: "17:00 - 24:00"
          },
          tags: ["カジュアル", "ビジネス接待", "家族連れ", "観光", "駐車場あり"],
          category: "food"
        },
        {
          id: 16,
          name: {
            ja: "RESTAURANT PLATINUM FISH マーチエキュート神田万世橋店",
            en: "Restaurant Platinum Fish Manseibashi",
            ko: "레스토랑 플래티넘 피시 만세이바시점",
            fr: "Restaurant Platinum Fish Manseibashi"
          },
          rating: 4.3,
          reviewCount: 892,
          reviews: [],
          image: "/images/spots/RESTAURANT_PLATINUM_FISH_マーチエキュート神田万世橋店_20250714_121132.jpg",
          badges: ["営業中", "洋食", "予約推奨", "駅直結"],
          info: {
            price: "3000-5000円",
            cuisine: "洋食",
            distance: "0.8km",
            openHours: "11:00 - 22:00"
          },
          tags: ["モダン", "デート", "ビジネス接待", "観光", "駅近"],
          category: "food"
        },
        {
          id: 17,
          name: {
            ja: "ブラッスリー・ヴィロン 丸の内店",
            en: "Brasserie Viron Marunouchi",
            ko: "브라세리 비롱 마루노우치점",
            fr: "Brasserie Viron Marunouchi"
          },
          rating: 4.1,
          reviewCount: 1245,
          reviews: [],
          image: "/images/spots/ブラッスリー・ヴィロン_丸の内店_20250714_121211.jpg",
          badges: ["営業中", "フレンチ", "ベーカリー", "テイクアウト可"],
          info: {
            price: "2000-4000円",
            cuisine: "フレンチ",
            distance: "1.2km",
            openHours: "7:00 - 22:00"
          },
          tags: ["パン", "カフェ", "朝食", "フランス", "丸の内"],
          category: "food"
        },
        {
          id: 18,
          name: {
            ja: "中国料理「後楽園飯店」",
            en: "Korakuen Restaurant",
            ko: "코라쿠엔 반점",
            fr: "Restaurant Korakuen"
          },
          rating: 4.0,
          reviewCount: 756,
          reviews: [],
          image: "/images/spots/中国料理「後楽園飯店」（東京ドームホテル直営）_20250715_103157.jpg",
          badges: ["営業中", "中華", "ホテル直営", "個室あり"],
          info: {
            price: "4000-8000円",
            cuisine: "中華",
            distance: "2.1km",
            openHours: "11:30 - 21:30"
          },
          tags: ["高級", "接待", "記念日", "家族連れ", "東京ドーム"],
          category: "food"
        },
        {
          id: 19,
          name: {
            ja: "招福樓 東京店",
            en: "Shofukuro Tokyo",
            ko: "쇼후쿠로 도쿄점",
            fr: "Shofukuro Tokyo"
          },
          rating: 4.2,
          reviewCount: 634,
          reviews: [],
          image: "/images/spots/招福樓_東京店_20250714_121217.jpg",
          badges: ["営業中", "中華", "高級", "予約必要"],
          info: {
            price: "8000-15000円",
            cuisine: "中華",
            distance: "1.5km",
            openHours: "11:30 - 14:30, 17:30 - 21:30"
          },
          tags: ["高級中華", "接待", "記念日", "個室", "銀座"],
          category: "food"
        },
        {
          id: 20,
          name: {
            ja: "名代 宇奈とと 新橋店",
            en: "Nandai Unatoto Shimbashi",
            ko: "나다이 우나토토 신바시점",
            fr: "Nandai Unatoto Shimbashi"
          },
          rating: 3.8,
          reviewCount: 1156,
          reviews: [],
          image: "/images/spots/名代_宇奈とと_新橋店_20250715_103209.jpg",
          badges: ["営業中", "和食", "うなぎ", "リーズナブル"],
          info: {
            price: "1000-2500円",
            cuisine: "和食",
            distance: "1.8km",
            openHours: "11:00 - 23:00"
          },
          tags: ["うなぎ", "カジュアル", "一人食事", "サラリーマン", "新橋"],
          category: "food"
        },
        {
          id: 21,
          name: {
            ja: "AIN SOPH. GINZA",
            en: "AIN SOPH. GINZA",
            ko: "아인 소프 긴자",
            fr: "AIN SOPH. GINZA"
          },
          rating: 4.2,
          reviewCount: 1320,
          reviews: [],
          image: "/images/spots/AIN_SOPH._GINZA_20250714_121213.jpg",
          badges: ["営業中", "ヴィーガン", "スイーツ", "予約推奨"],
          info: {
            price: "2000-4000円",
            cuisine: "スイーツ",
            distance: "2.0km",
            openHours: "11:00 - 21:00"
          },
          tags: ["カフェ", "デザート", "女子会", "ヘルシー"],
          category: "food"
        },
        {
          id: 22,
          name: {
            ja: "AMERICAN",
            en: "AMERICAN",
            ko: "아메리칸",
            fr: "AMERICAN"
          },
          rating: 3.9,
          reviewCount: 980,
          reviews: [],
          image: "/images/spots/AMERICAN_20250714_121216.jpg",
          badges: ["営業中", "サンドイッチ", "テイクアウト可"],
          info: {
            price: "800-1500円",
            cuisine: "カフェ",
            distance: "2.3km",
            openHours: "10:00 - 18:00"
          },
          tags: ["軽食", "カジュアル", "一人食事"],
          category: "food"
        },
        {
          id: 23,
          name: {
            ja: "BAR de ESPAÑA Muy",
            en: "BAR de ESPAÑA Muy",
            ko: "바르 데 에스파냐 무이",
            fr: "BAR de ESPAÑA Muy"
          },
          rating: 4.1,
          reviewCount: 1210,
          reviews: [],
          image: "/images/spots/BAR_de_ESPANA_Muy_20250714_121210.jpg",
          badges: ["営業中", "スペイン料理", "ワイン"],
          info: {
            price: "3000-6000円",
            cuisine: "スペイン",
            distance: "1.4km",
            openHours: "11:00 - 23:00"
          },
          tags: ["バル", "友人との食事", "デート"],
          category: "food"
        },
        {
          id: 24,
          name: {
            ja: "BREEZE OF TOKYO",
            en: "BREEZE OF TOKYO",
            ko: "브리즈 오브 도쿄",
            fr: "BREEZE OF TOKYO"
          },
          rating: 4.3,
          reviewCount: 1560,
          reviews: [],
          image: "/images/spots/BREEZE_OF_TOKYO_20250714_121218.jpg",
          badges: ["夜景", "フレンチ", "高層階"],
          info: {
            price: "6000-12000円",
            cuisine: "フレンチ",
            distance: "1.6km",
            openHours: "17:30 - 23:00"
          },
          tags: ["夜景", "記念日", "デート"],
          category: "food"
        },
        {
          id: 25,
          name: {
            ja: "COVA TOKYO",
            en: "COVA TOKYO",
            ko: "코바 도쿄",
            fr: "COVA TOKYO"
          },
          rating: 4.0,
          reviewCount: 640,
          reviews: [],
          image: "/images/spots/COVA_TOKYO(COVA_JAPAN株式会社）_20250714_121215.jpg",
          badges: ["カフェ", "スイーツ", "エレガント"],
          info: {
            price: "1500-3000円",
            cuisine: "カフェ",
            distance: "1.1km",
            openHours: "10:00 - 20:00"
          },
          tags: ["アフタヌーンティー", "女子会", "静か"],
          category: "food"
        },
        {
          id: 26,
          name: {
            ja: "Fish Bank TOKYO",
            en: "Fish Bank TOKYO",
            ko: "피시 뱅크 도쿄",
            fr: "Fish Bank TOKYO"
          },
          rating: 4.4,
          reviewCount: 1700,
          reviews: [],
          image: "/images/spots/Fish_Bank_TOKYO_20250715_103218.jpg",
          badges: ["シーフード", "夜景", "記念日"],
          info: {
            price: "7000-13000円",
            cuisine: "シーフード",
            distance: "2.5km",
            openHours: "17:30 - 23:00"
          },
          tags: ["高層階", "ワイン", "デート"],
          category: "food"
        },
        {
          id: 27,
          name: {
            ja: "Restaurant Air レストランエール",
            en: "Restaurant Air",
            ko: "레스토랑 에어",
            fr: "Restaurant Air"
          },
          rating: 4.2,
          reviewCount: 520,
          reviews: [],
          image: "/images/spots/Restaurant_Air_レストランエール_20250714_121220.jpg",
          badges: ["フレンチ", "ミシュラン", "予約必須"],
          info: {
            price: "8000-15000円",
            cuisine: "フレンチ",
            distance: "2.2km",
            openHours: "12:00 - 14:00, 18:00 - 22:00"
          },
          tags: ["コース料理", "記念日", "接待"],
          category: "food"
        },
        {
          id: 28,
          name: {
            ja: "VAMPIRE CAFE",
            en: "VAMPIRE CAFE",
            ko: "뱀파이어 카페",
            fr: "VAMPIRE CAFE"
          },
          rating: 3.8,
          reviewCount: 2100,
          reviews: [],
          image: "/images/spots/VAMPIRE_CAFE_20250714_121221.jpg",
          badges: ["コンセプト", "ディナー", "予約推奨"],
          info: {
            price: "3000-6000円",
            cuisine: "洋食",
            distance: "3.1km",
            openHours: "17:00 - 23:00"
          },
          tags: ["エンタメ", "友人との食事", "女子会"],
          category: "food"
        },
        {
          id: 29,
          name: {
            ja: "ブラッスリー オザミ 丸の内",
            en: "Brasserie Aux Amis Marunouchi",
            ko: "브라세리 오자미 마루노우치",
            fr: "Brasserie Aux Amis Marunouchi"
          },
          rating: 4.0,
          reviewCount: 890,
          reviews: [],
          image: "/images/spots/ブラッスリー_オザミ_丸の内_20250714_121208.jpg",
          badges: ["ビストロ", "ワイン", "テラス"],
          info: {
            price: "3000-6000円",
            cuisine: "フレンチ",
            distance: "1.3km",
            openHours: "11:00 - 22:00"
          },
          tags: ["丸の内", "ランチ", "ディナー"],
          category: "food"
        },
        {
          id: 30,
          name: {
            ja: "山形田（銀座そばきりや 山形田）",
            en: "Yamagatada Ginza Soba",
            ko: "야마가타다 긴자 소바",
            fr: "Yamagatada Ginza Soba"
          },
          rating: 4.1,
          reviewCount: 740,
          reviews: [],
          image: "/images/spots/山形田(銀座そばきりや山形田)_20250714_121216.jpg",
          badges: ["和食", "そば", "老舗"],
          info: {
            price: "1000-2500円",
            cuisine: "和食",
            distance: "3.0km",
            openHours: "11:00 - 20:00"
          },
          tags: ["一人食事", "ランチ", "日本酒"],
          category: "food"
        },
        {
          id: 31,
          name: {
            ja: "銀座の金沢",
            en: "Ginza no Kanazawa",
            ko: "긴자의 가나자와",
            fr: "Ginza no Kanazawa"
          },
          rating: 4.2,
          reviewCount: 620,
          reviews: [],
          image: "/images/spots/銀座の金沢_20250714_121149.jpg",
          badges: ["和食", "郷土料理", "物産"],
          info: {
            price: "2000-5000円",
            cuisine: "和食",
            distance: "2.7km",
            openHours: "11:00 - 20:00"
          },
          tags: ["加賀", "ランチ", "甘味"],
          category: "food"
        },
        {
          id: 32,
          name: {
            ja: "千房 有楽町ビックカメラ支店",
            en: "Chibo Yurakucho BicCamera",
            ko: "치보 유라쿠초 빅카메라점",
            fr: "Chibo Yurakucho BicCamera"
          },
          rating: 3.9,
          reviewCount: 540,
          reviews: [],
          image: "/images/spots/千房_有楽町ビックカメラ支店_20250714_121215.jpg",
          badges: ["お好み焼き", "予約不要", "家族連れ"],
          info: {
            price: "1200-2500円",
            cuisine: "お好み焼き",
            distance: "2.0km",
            openHours: "11:00 - 22:00"
          },
          tags: ["カジュアル", "鉄板", "ビール"],
          category: "food"
        },
        {
          id: 33,
          name: {
            ja: "ユイト 浮世小路千疋屋ビル",
            en: "YUITO Annex Sembikiya",
            ko: "유이토 안넥스 센비키야",
            fr: "YUITO Annex Sembikiya"
          },
          rating: 4.0,
          reviewCount: 410,
          reviews: [],
          image: "/images/spots/ユイト_アネックス浮世小路千疋屋ビル_20250714_121203.jpg",
          badges: ["フルーツ", "カフェ", "デザート"],
          info: {
            price: "1500-3000円",
            cuisine: "カフェ",
            distance: "2.2km",
            openHours: "10:00 - 19:00"
          },
          tags: ["パフェ", "女子会", "手土産"],
          category: "food"
        },
        {
          id: 34,
          name: {
            ja: "ブラッスリー オザミ 丸の内（別館）",
            en: "Brasserie Aux Amis Annex",
            ko: "브라세리 오자미 별관",
            fr: "Brasserie Aux Amis Annexe"
          },
          rating: 3.9,
          reviewCount: 380,
          reviews: [],
          image: "/images/spots/ブラッスリー・ヴィロン_丸の内店_20250715_103200.jpg",
          badges: ["ビストロ", "パン", "カフェ"],
          info: {
            price: "1500-3000円",
            cuisine: "フレンチ",
            distance: "1.2km",
            openHours: "8:00 - 21:00"
          },
          tags: ["テラス", "丸の内", "ランチ"],
          category: "food"
        },
        {
          id: 35,
          name: {
            ja: "CALLAS Cafe & BAR",
            en: "CALLAS Cafe & BAR",
            ko: "칼라스 카페 & 바",
            fr: "CALLAS Cafe & BAR"
          },
          rating: 4.0,
          reviewCount: 720,
          reviews: [],
          image: "/images/spots/CALLAS_Cafe&BAR_20250714_121157.jpg",
          badges: ["カフェ", "バー", "夜営業"],
          info: {
            price: "1000-2500円",
            cuisine: "カフェ",
            distance: "1.1km",
            openHours: "11:00 - 23:00"
          },
          tags: ["コーヒー", "デザート", "カクテル"],
          category: "food"
        },
        {
          id: 36,
          name: {
            ja: "山形そば処",
            en: "Yamagata Soba",
            ko: "야마가타 소바",
            fr: "Soba de Yamagata"
          },
          rating: 4.1,
          reviewCount: 360,
          reviews: [],
          image: "/images/spots/山形田(銀座そばきりや山形田)_20250714_121216.jpg",
          badges: ["和食", "そば", "ランチ"],
          info: {
            price: "900-1800円",
            cuisine: "和食",
            distance: "3.2km",
            openHours: "11:00 - 20:00"
          },
          tags: ["一人食事", "日本酒", "早めの夕食"],
          category: "food"
        },
        {
          id: 37,
          name: {
            ja: "グランスタ東京 フードコート",
            en: "GRANSTA Tokyo Food Court",
            ko: "그란스타 도쿄 푸드코트",
            fr: "GRANSTA Tokyo Food Court"
          },
          rating: 4.2,
          reviewCount: 2200,
          reviews: [],
          image: "/images/spots/グランスタ東京_20250714_121201.jpg",
          badges: ["フードコート", "駅ナカ", "テイクアウト可"],
          info: {
            price: "1000-2000円",
            cuisine: "多国籍",
            distance: "0.1km",
            openHours: "8:00 - 22:00"
          },
          tags: ["駅近", "さくっと", "土産"],
          category: "food"
        },
        {
          id: 38,
          name: {
            ja: "サイアムヘリテイジ東京",
            en: "Siam Heritage Tokyo",
            ko: "사이암 헤리티지 도쿄",
            fr: "Siam Heritage Tokyo"
          },
          rating: 4.1,
          reviewCount: 860,
          reviews: [],
          image: "/images/spots/サイアムヘリテイジ東京_20250714_121212.jpg",
          badges: ["タイ料理", "スパイシー", "予約推奨"],
          info: {
            price: "2000-4000円",
            cuisine: "タイ料理",
            distance: "1.9km",
            openHours: "11:00 - 22:00"
          },
          tags: ["エスニック", "女子会", "ランチ"],
          category: "food"
        },
        {
          id: 39,
          name: {
            ja: "COVA TOKYO（カフェ）",
            en: "COVA TOKYO Cafe",
            ko: "코바 도쿄 카페",
            fr: "COVA TOKYO Café"
          },
          rating: 3.9,
          reviewCount: 500,
          reviews: [],
          image: "/images/spots/COVA_TOKYO(COVA_JAPAN株式会社）_20250714_121215.jpg",
          badges: ["カフェ", "ケーキ", "紅茶"],
          info: {
            price: "1500-3000円",
            cuisine: "カフェ",
            distance: "1.1km",
            openHours: "10:00 - 20:00"
          },
          tags: ["スイーツ", "休憩", "デート"],
          category: "food"
        },
        {
          id: 40,
          name: {
            ja: "ワテラス ダイニング",
            en: "WATERRAS Dining",
            ko: "와테라스 다이닝",
            fr: "WATERRAS Dining"
          },
          rating: 3.8,
          reviewCount: 430,
          reviews: [],
          image: "/images/spots/WATERRAS｜ワテラス_20250714_121202.jpg",
          badges: ["複合施設", "多国籍", "家族連れ"],
          info: {
            price: "1000-3000円",
            cuisine: "多国籍",
            distance: "2.8km",
            openHours: "11:00 - 22:00"
          },
          tags: ["カジュアル", "駅近", "テイクアウト可"],
          category: "food"
        },
        ...firebaseFoodSpots // Add Firebase food spots
      ],
    sights: [...sightsData, ...firebaseSightSpots], // Add Firebase sight spots
    hotels: [
        {
          id: 201,
          name: {
            ja: "Imperial Hotel Tokyo",
            en: "Imperial Hotel Tokyo",
            ko: "임페리얼 호텔 도쿄",
            fr: "Imperial Hotel Tokyo"
          },
          rating: 4.5,
          reviewCount: 11890,
          image: "/images/tokyo/ChIJT7wVXe6LGGARpg6sWitWN8Y/photo_2.jpg",
          badges: ["5つ星", "バンケットホール", "結婚式場"],
          info: {
            pricePerNight: "¥35,000-65,000",
            stars: 5,
            checkIn: "15:00",
            checkOut: "12:00"
          },
          tags: ["ラグジュアリー", "内幸町", "高級"],
          category: "hotels"
        },
        {
          id: 202,
          name: {
            ja: "The Prince Park Tower Tokyo",
            en: "The Prince Park Tower Tokyo",
            ko: "더 프린스 파크 타워 도쿄",
            fr: "The Prince Park Tower Tokyo"
          },
          rating: 4.2,
          reviewCount: 6204,
          image: "/images/tokyo/ChIJ9fTLo0TsGGAR9hOYI9J4Bus/photo_1.jpg",
          badges: ["5つ星", "温泉", "結婚式場"],
          info: {
            pricePerNight: "¥25,000-45,000",
            stars: 5,
            checkIn: "15:00",
            checkOut: "12:00"
          },
          tags: ["芝公園", "温泉", "バンケット"],
          category: "hotels"
        },
        {
          id: 203,
          name: {
            ja: "ANA InterContinental Tokyo",
            en: "ANA InterContinental Tokyo",
            ko: "ANA 인터컨티넨탈 도쿄",
            fr: "ANA InterContinental Tokyo"
          },
          rating: 4.3,
          reviewCount: 9241,
          image: "/images/tokyo/ChIJSbSAbIWLGGARr4URtFXRlWk/photo_1.jpg",
          badges: ["5つ星", "結婚式場", "イベント会場"],
          info: {
            pricePerNight: "¥30,000-55,000",
            stars: 5,
            checkIn: "15:00",
            checkOut: "12:00"
          },
          tags: ["赤坂", "国際ホテル", "高級"],
          category: "hotels"
        },
        {
          id: 204,
          name: {
            ja: "APA HOTEL Roppongi Six",
            en: "APA HOTEL Roppongi Six",
            ko: "APA 호텔 롯폰기 식스",
            fr: "APA HOTEL Roppongi Six"
          },
          rating: 3.9,
          reviewCount: 2534,
          image: "/images/tokyo/ChIJMQGioYSLGGAR_IrWM7I3zOI/photo_1.jpg",
          badges: ["3つ星", "ビジネス"],
          info: {
            pricePerNight: "¥8,000-15,000",
            stars: 3,
            checkIn: "15:00",
            checkOut: "11:00"
          },
          tags: ["六本木", "ビジネス", "アクセス良好"],
          category: "hotels"
        },
        {
          id: 205,
          name: {
            ja: "The Okura Tokyo",
            en: "The Okura Tokyo",
            ko: "더 오쿠라 도쿄",
            fr: "The Okura Tokyo"
          },
          rating: 4.4,
          reviewCount: 5290,
          image: "/images/tokyo/ChIJuecmcH2LGGARgmOaAPaK9zA/photo_1.jpg",
          badges: ["5つ星", "高級"],
          info: {
            pricePerNight: "¥40,000-70,000",
            stars: 5,
            checkIn: "15:00",
            checkOut: "12:00"
          },
          tags: ["虎ノ門", "伝統", "日本式"],
          category: "hotels"
        },
        {
          id: 206,
          name: {
            ja: "APA Hotel & Resort Ryogoku Eki Tower",
            en: "APA Hotel & Resort Ryogoku Eki Tower",
            ko: "APA 호텔 & 리조트 료고쿠 에키 타워",
            fr: "APA Hotel & Resort Ryogoku Eki Tower"
          },
          rating: 4.1,
          reviewCount: 3561,
          image: "/images/tokyo/ChIJZSX-tMqOGGARFgXf7I1NhcQ/photo_1.jpg",
          badges: ["4つ星", "駅直結"],
          info: {
            pricePerNight: "¥10,000-18,000",
            stars: 4,
            checkIn: "15:00",
            checkOut: "11:00"
          },
          tags: ["両国", "相撲", "駅近"],
          category: "hotels"
        },
        {
          id: 207,
          name: {
            ja: "Tokyo Dome Hotel",
            en: "Tokyo Dome Hotel",
            ko: "도쿄 돔 호텔",
            fr: "Tokyo Dome Hotel"
          },
          rating: 4.2,
          reviewCount: 8107,
          image: "/images/tokyo/ChIJRZ_bSz-MGGARPMc7IsdsZiY/photo_2.jpg",
          badges: ["4つ星", "24時間営業", "東京ドーム隣接"],
          info: {
            pricePerNight: "¥15,000-28,000",
            stars: 4,
            checkIn: "15:00",
            checkOut: "12:00"
          },
          tags: ["後楽園", "東京ドーム", "イベント"],
          category: "hotels"
        },
        {
          id: 208,
          name: {
            ja: "Hotel Chinzanso Tokyo",
            en: "Hotel Chinzanso Tokyo",
            ko: "호텔 친잔소 도쿄",
            fr: "Hotel Chinzanso Tokyo"
          },
          rating: 4.4,
          reviewCount: 9694,
          image: "/images/tokyo/ChIJNxw8EQSNGGART8GbVls3c4A/photo_1.jpg",
          badges: ["5つ星", "結婚式場", "日本庭園"],
          info: {
            pricePerNight: "¥35,000-80,000",
            stars: 5,
            checkIn: "15:00",
            checkOut: "12:00"
          },
          tags: ["関口", "庭園", "高級"],
          category: "hotels"
        },
        {
          id: 209,
          name: {
            ja: "Palace Hotel Tokyo",
            en: "Palace Hotel Tokyo",
            ko: "팰리스 호텔 도쿄",
            fr: "Palace Hotel Tokyo"
          },
          rating: 4.5,
          reviewCount: 6021,
          image: "/images/tokyo/ChIJq0s44BuMGGARvBtm78mmRRg/photo_1.jpg",
          badges: ["5つ星", "皇居前"],
          info: {
            pricePerNight: "¥45,000-75,000",
            stars: 5,
            checkIn: "15:00",
            checkOut: "12:00"
          },
          tags: ["丸の内", "皇居", "ラグジュアリー"],
          category: "hotels"
        },
        {
          id: 210,
          name: {
            ja: "Grand Hyatt Tokyo",
            en: "Grand Hyatt Tokyo",
            ko: "그랜드 하이엇 도쿄",
            fr: "Grand Hyatt Tokyo"
          },
          rating: 4.4,
          reviewCount: 4775,
          image: "/images/tokyo/ChIJSUuI2buJGGARsWTQED5lKJU/photo_1.jpg",
          badges: ["5つ星", "リゾート", "24時間営業"],
          info: {
            pricePerNight: "¥38,000-65,000",
            stars: 5,
            checkIn: "15:00",
            checkOut: "12:00"
          },
          tags: ["六本木", "ヒルズ", "国際的"],
          category: "hotels"
        },
        {
          id: 211,
          name: {
            ja: "Tokyo Prince Hotel",
            en: "Tokyo Prince Hotel",
            ko: "도쿄 프린스 호텔",
            fr: "Tokyo Prince Hotel"
          },
          rating: 4.1,
          reviewCount: 5218,
          image: "/images/tokyo/ChIJsXO0-76LGGARAOeGIaTQg8g/photo_1.jpg",
          badges: ["4つ星", "東京タワービュー", "バンケットホール"],
          info: {
            pricePerNight: "¥18,000-35,000",
            stars: 4,
            checkIn: "15:00",
            checkOut: "11:00"
          },
          tags: ["芝公園", "東京タワー", "伝統"],
          category: "hotels"
        },
        {
          id: 212,
          name: {
            ja: "Conrad Tokyo",
            en: "Conrad Tokyo",
            ko: "콘래드 도쿄",
            fr: "Conrad Tokyo"
          },
          rating: 4.5,
          reviewCount: 4204,
          image: "/images/tokyo/ChIJlUTqGMOLGGAR4mDGvlHTzgU/photo_1.jpg",
          badges: ["5つ星", "スパ", "結婚式場"],
          info: {
            pricePerNight: "¥42,000-78,000",
            stars: 5,
            checkIn: "15:00",
            checkOut: "12:00"
          },
          tags: ["汐留", "高層階", "ベイエリア"],
          category: "hotels"
        },
        {
          id: 213,
          name: {
            ja: "Hotel Metropolitan Edmont",
            en: "Hotel Metropolitan Edmont",
            ko: "호텔 메트로폴리탄 에드몬트",
            fr: "Hotel Metropolitan Edmont"
          },
          rating: 4.2,
          reviewCount: 6226,
          image: "/images/tokyo/ChIJFbCrF0GMGGAR_Zb1IBySdxo/photo_1.jpg",
          badges: ["4つ星", "24時間営業", "バンケット"],
          info: {
            pricePerNight: "¥12,000-22,000",
            stars: 4,
            checkIn: "15:00",
            checkOut: "11:00"
          },
          tags: ["飯田橋", "ビジネス", "アクセス良好"],
          category: "hotels"
        },
        {
          id: 214,
          name: {
            ja: "Apa Hotel & Resort Roppongi-Eki-Higashi",
            en: "Apa Hotel & Resort Roppongi-Eki-Higashi",
            ko: "APA 호텔 & 리조트 롯폰기역 동쪽",
            fr: "Apa Hotel & Resort Roppongi-Eki-Higashi"
          },
          rating: 4.1,
          reviewCount: 1058,
          image: "/images/tokyo/ChIJ0SWUgomLGGARFmSqytdHAEw/photo_1.jpg",
          badges: ["3つ星", "駅近"],
          info: {
            pricePerNight: "¥9,000-16,000",
            stars: 3,
            checkIn: "15:00",
            checkOut: "11:00"
          },
          tags: ["六本木", "駅東", "便利"],
          category: "hotels"
        },
        {
          id: 215,
          name: {
            ja: "Asakusa View Hotel",
            en: "Asakusa View Hotel",
            ko: "아사쿠사 뷰 호텔",
            fr: "Asakusa View Hotel"
          },
          rating: 4.1,
          reviewCount: 7419,
          image: "/images/tokyo/ChIJq2y6aZWOGGARoNXiLxzHGcw/photo_1.jpg",
          badges: ["4つ星", "24時間営業", "浅草"],
          info: {
            pricePerNight: "¥14,000-25,000",
            stars: 4,
            checkIn: "15:00",
            checkOut: "11:00"
          },
          tags: ["浅草", "西浅草", "観光"],
          category: "hotels"
        },
        {
          id: 216,
          name: {
            ja: "InterContinental Tokyo Bay",
            en: "InterContinental Tokyo Bay",
            ko: "인터컨티넨탈 도쿄 베이",
            fr: "InterContinental Tokyo Bay"
          },
          rating: 4.3,
          reviewCount: 3970,
          image: "/images/tokyo/ChIJxbdFcPdjGGARd9tBq9RKOVc/photo_1.jpg",
          badges: ["5つ星", "ベイビュー", "結婚式場"],
          info: {
            pricePerNight: "¥28,000-50,000",
            stars: 5,
            checkIn: "15:00",
            checkOut: "12:00"
          },
          tags: ["海岸", "湾岸", "国際的"],
          category: "hotels"
        },
        {
          id: 217,
          name: {
            ja: "remm Roppongi",
            en: "remm Roppongi",
            ko: "렘 롯폰기",
            fr: "remm Roppongi"
          },
          rating: 4.3,
          reviewCount: 2276,
          image: "/images/tokyo/ChIJo8i9EniLGGARcMXSaSwzxxo/photo_1.jpg",
          badges: ["4つ星", "24時間営業"],
          info: {
            pricePerNight: "¥15,000-28,000",
            stars: 4,
            checkIn: "15:00",
            checkOut: "11:00"
          },
          tags: ["六本木", "モダン", "デザイン"],
          category: "hotels"
        },
        {
          id: 218,
          name: {
            ja: "Hotel Villa Fontaine Grand Shiodome",
            en: "Hotel Villa Fontaine Grand Shiodome",
            ko: "호텔 빌라 폰테인 그랜드 시오도메",
            fr: "Hotel Villa Fontaine Grand Shiodome"
          },
          rating: 4.2,
          reviewCount: 2837,
          image: "/images/tokyo/ChIJp_uTpMOLGGARuV0qHAQguMU/photo_1.jpg",
          badges: ["4つ星", "24時間営業", "ビュッフェ"],
          info: {
            pricePerNight: "¥12,000-20,000",
            stars: 4,
            checkIn: "15:00",
            checkOut: "11:00"
          },
          tags: ["汐留", "東新橋", "ビジネス"],
          category: "hotels"
        },
        {
          id: 219,
          name: {
            ja: "Royal Park Hotel",
            en: "Royal Park Hotel",
            ko: "로열 파크 호텔",
            fr: "Royal Park Hotel"
          },
          rating: 4.2,
          reviewCount: 4733,
          image: "/images/tokyo/ChIJdSrKTkSJGGARXoPJvUkZUT8/photo_1.jpg",
          badges: ["4つ星", "日本橋"],
          info: {
            pricePerNight: "¥16,000-30,000",
            stars: 4,
            checkIn: "15:00",
            checkOut: "11:00"
          },
          tags: ["日本橋", "中央区", "ビジネス"],
          category: "hotels"
        },
        {
          id: 220,
          name: {
            ja: "KOKO HOTEL Ginza 1-chome",
            en: "KOKO HOTEL Ginza 1-chome",
            ko: "KOKO 호텔 긴자 1초메",
            fr: "KOKO HOTEL Ginza 1-chome"
          },
          rating: 3.7,
          reviewCount: 665,
          image: "/images/tokyo/ChIJlaVM3eOLGGARxiqelk1qzC8/photo_1.jpg",
          badges: ["3つ星", "銀座"],
          info: {
            pricePerNight: "¥10,000-18,000",
            stars: 3,
            checkIn: "15:00",
            checkOut: "11:00"
          },
          tags: ["銀座", "中央区", "アクセス"],
          category: "hotels"
        },
        ...firebaseHotelSpots // Add Firebase hotel spots
      ]
    };

    // Compose current data. For food, show synced Firebase/JSON items first
    let currentData = sampleData[currentCategory] || [];
    if (currentCategory === 'food') {
      const combined = [...firebaseFoodSpots, ...currentData];
      const seen = new Set<string | number>();
      currentData = combined.filter((s) => {
        const key = s.id;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    
    // Debug: データの確認
    console.log('Sample data for sights:', sampleData.sights);
    console.log('Current category:', currentCategory);
    console.log('Current data:', currentData);
    console.log('Firebase spots:', firebaseSpots);
    
    if (!searchTerm.trim()) return currentData;
    
    const filtered = currentData.filter(spot => {
      const displayName = getDisplayName(spot.name);
      return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    
    console.log('Filtered spots:', filtered);
    return filtered;
  }, [currentCategory, searchTerm, getDisplayName, firebaseSpots, touristSpotToSpot]);

  // Initialize from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') as Category;
    if (category && ['food', 'sights', 'hotels'].includes(category)) {
      setCurrentCategory(category);
    }
    
    // Debug: ログ出力を追加
    console.log('Current category:', category);
    console.log('Available spots:', filteredSpots);
  }, [filteredSpots]);

  // Category switching handler
  const handleCategoryChange = useCallback((category: Category) => {
    if (category === currentCategory) return;
    setCurrentCategory(category);
    setIsLoading(true);
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('category', category);
    window.history.pushState({}, '', url);
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 300);
  }, [currentCategory]);

  // Search handler with debouncing
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Favorite toggle handler
  const toggleFavorite = useCallback((spotId: string | number) => {
    setFavoriteSpots(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(spotId)) {
        newFavorites.delete(spotId);
      } else {
        newFavorites.add(spotId);
      }
      return newFavorites;
    });
  }, []);

  // Show details handler
  const showDetails = useCallback((spot: Spot) => {
    // Firestore document ID (slug) があればそれを使用、なければIDを使用
    const spotId = spot.slug || spot.id;
    const url = new URL(window.location.origin + `/spots/${spotId}`);
    // 現在の言語をクエリに付与
    url.searchParams.set('lang', currentLanguage);
    window.open(url.toString(), '_blank');
  }, []);

  // Render spot info based on category
  const renderSpotInfo = useCallback((spot: Spot) => {
    switch (spot.category) {
      case 'food':
        return (
          <>
            <div className="info-item">💰 {spot.info.price}</div>
            <div className="info-item">🍽️ {tr.spots.cuisineTypes[spot.info.cuisine as keyof typeof tr.spots.cuisineTypes] || spot.info.cuisine}</div>
            <div className="info-item">📍 {spot.info.distance}</div>
            <div className="info-item">🕐 {spot.info.openHours}</div>
          </>
        );
      case 'sights':
        return (
          <>
            <div className="info-item">⏱️ {spot.info.duration}</div>
            <div className="info-item">🎫 {spot.info.ticketRequired}</div>
            <div className="info-item">🌅 {spot.info.bestTime}</div>
            <div className="info-item">👥 {spot.info.crowdLevel}</div>
          </>
        );
      case 'hotels':
        return (
          <>
            <div className="info-item">💰 {spot.info.pricePerNight}</div>
            <div className="info-item">⭐ {spot.info.stars}{currentLanguage === 'ko' ? '성급' : currentLanguage === 'en' ? ' stars' : 'つ星'}</div>
            <div className="info-item">🕐 {spot.info.checkIn}-{spot.info.checkOut}</div>
          </>
        );
      default:
        return null;
    }
  }, [tr, currentLanguage]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="loading-skeleton">
      <div className="skeleton-shimmer"></div>
      <div className="skeleton-image"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
      <div className="skeleton-text"></div>
    </div>
  );

  // Spot card component
  const SpotCard = useCallback(({ spot, index }: { spot: Spot; index: number }) => (
    <div 
      className="spot-card fade-in" 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
              <div className="card-image">
          <Image
            src={spot.images?.[0] || spot.image}
            alt={getDisplayName(spot.name)}
            width={400}
            height={200}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            onError={(e) => {
              const fallback = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400';
              const tried = (e.target as HTMLImageElement).getAttribute('data-tried-fallback');
              if (!tried) {
                (e.target as HTMLImageElement).setAttribute('data-tried-fallback', '1');
                (e.target as HTMLImageElement).src = fallback;
              } else {
                console.error('Image load error for:', spot.images?.[0] || spot.image);
              }
            }}
          />
        <div className="card-badges">
          {spot.badges.map((badge, idx) => (
            <span 
              key={idx} 
              className={`badge ${badge === '営業中' ? 'open' : badge === '人気' ? 'popular' : ''}`}
            >
              {tr.spots.badges[badge as keyof typeof tr.spots.badges] || badge}
            </span>
          ))}
        </div>
        <button 
          className={`favorite-btn ${favoriteSpots.has(spot.id) ? 'active' : ''}`}
          onClick={() => toggleFavorite(spot.id)}
        >
          {favoriteSpots.has(spot.id) ? '♥' : '♡'}
        </button>
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3 className="spot-name">{getDisplayName(spot.name)}</h3>
        </div>
        <div className="rating-section">
          <div className="stars">
            {'★'.repeat(Math.floor(spot.rating))}{'☆'.repeat(5 - Math.floor(spot.rating))}
          </div>
          <span className="rating-text">{spot.rating}</span>
          <span className="reviews-count">({spot.reviewCount || 0}{tr.spots.reviews})</span>
        </div>
        <div className="spot-info">
          {renderSpotInfo(spot)}
        </div>
        <div className="spot-tags">
          {spot.tags.map((tag, idx) => (
            <span key={idx} className="tag">
              {tr.spots.tags[tag as keyof typeof tr.spots.tags] || tag}
            </span>
          ))}
        </div>
        <div className="card-actions">
          <button className="details-btn" onClick={() => showDetails(spot)}>
            {tr.actions.detailsBtn}
          </button>
        </div>
      </div>
    </div>
  ), [favoriteSpots, renderSpotInfo, showDetails, toggleFavorite, tr, getDisplayName]);

  // Locked card component for guests beyond FREE_COUNT
  const LockedCard = useCallback(({ index }: { index: number }) => (
    <div className="spot-card locked fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="card-image" style={{ filter: 'blur(6px)' }}>
        <Image
          src={'https://images.unsplash.com/photo-1502882705085-42674b66c07c?w=800&auto=format&fit=crop&q=70'}
          alt="Locked"
          width={400}
          height={200}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
      </div>
      <div className="card-content" style={{ textAlign: 'center' }}>
        <h3 className="spot-name" style={{ marginBottom: '0.5rem' }}>会員限定のコンテンツ</h3>
        <p className="reviews-count" style={{ marginBottom: '1rem' }}>続きは無料登録で閲覧できます</p>
        <div className="card-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/register" className="details-btn" style={{ textDecoration: 'none' }}>
            新規登録して続きを見る
          </Link>
          <Link href="/login" className="details-btn" style={{ textDecoration: 'none', background: '#4b5563' }}>
            ログイン
          </Link>
        </div>
      </div>
    </div>
  ), []);

  return (
    <>
      <Head>
        {/* 背景画像のpreload */}
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1490761668535-35497054764d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2092&q=80"
        />
        <title>Tokyo Spots - Trip On</title>
      </Head>

      {/* ここから下は元HTMLそのまま。Tailwindの影響を避けるために .tripon で囲う */}
      <div className="tripon">
        <div className="hero-background" id="heroBackground"></div>


        <main className="main-content">
          <div className="container">
            <div className="page-header">
              <h1 id="pageTitle">{tr.pageTitle}</h1>
              <p id="pageSubtitle">{tr.pageSubtitle}</p>
              
              {/* CTAボタン群 */}
              <div className="cta-buttons">
                <button className="cta-btn favorite-btn-cta">
                  <span className="btn-icon">♥</span>
                  <span>お気に入りに追加</span>
                </button>
                <button className="cta-btn ai-plan-btn">
                  <span className="btn-icon">🤖</span>
                  <span>AI旅行プランに入れる</span>
                </button>
                <button className="cta-btn ticket-btn">
                  <span className="btn-icon">🎫</span>
                  <span>チケット予約</span>
                </button>
              </div>
            </div>

            <div className="category-tabs">
              <div className="tabs-container">
                <button 
                  className={`tab-button ${currentCategory === 'food' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('food')}
                >
                  <span className="icon">🍜</span>
                  <span>{tr.categories.food}</span>
                </button>
                <button 
                  className={`tab-button ${currentCategory === 'sights' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('sights')}
                >
                  <span className="icon">🏯</span>
                  <span>{tr.categories.sights}</span>
                </button>
                <button 
                  className={`tab-button ${currentCategory === 'hotels' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('hotels')}
                >
                  <span className="icon">🏨</span>
                  <span>{tr.categories.hotels}</span>
                </button>
              </div>
            </div>

            <div className="filters-section">
              <div className="filters-row">
                <div className="search-box">
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder={tr.actions.search}
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">{tr.filters.sortBy}</label>
                  <select className="filter-select" id="sortSelect">
                    <option value="popular">{tr.sorting.popular}</option>
                    <option value="rating">{tr.sorting.rating}</option>
                    <option value="distance">{tr.sorting.distance}</option>
                    <option value="price">{tr.sorting.price}</option>
                  </select>
                </div>
                <div className="view-toggle">
                  <button className="view-btn active" data-view="grid">📋</button>
                  <button className="view-btn" data-view="map">🗺️</button>
                </div>
              </div>

              <div className="filters-row">
                {currentCategory === 'food' && (
                  <>
                    <div className="filter-group category-filter food-filter">
                      <label className="filter-label">{tr.filters.budget}</label>
                      <select className="filter-select">
                        <option value="">{tr.filters.allBudgets}</option>
                        <option value="budget">{tr.filters.budget1}</option>
                        <option value="moderate">{tr.filters.budget2}</option>
                        <option value="expensive">{tr.filters.budget3}</option>
                      </select>
                    </div>
                    <div className="filter-group category-filter food-filter">
                      <label className="filter-label">{tr.filters.cuisine}</label>
                      <select className="filter-select">
                        <option value="">{tr.filters.allCuisines}</option>
                        <option value="japanese">{tr.filters.japanese}</option>
                        <option value="sushi">{tr.filters.sushi}</option>
                        <option value="ramen">{tr.filters.ramen}</option>
                        <option value="western">{tr.filters.western}</option>
                      </select>
                    </div>
                    <div className="toggle-buttons category-filter food-filter">
                      <button className="toggle-btn">{tr.filters.openNow}</button>
                    </div>
                  </>
                )}

                {currentCategory === 'sights' && (
                  <>
                    <div className="filter-group category-filter sights-filter">
                      <label className="filter-label">{tr.filters.crowdLevel}</label>
                      <select className="filter-select">
                        <option value="">{tr.filters.allLevels}</option>
                        <option value="low">{tr.filters.low}</option>
                        <option value="medium">{tr.filters.medium}</option>
                        <option value="high">{tr.filters.high}</option>
                      </select>
                    </div>
                    <div className="filter-group category-filter sights-filter">
                      <label className="filter-label">{tr.filters.duration}</label>
                      <select className="filter-select">
                        <option value="">{tr.filters.allDurations}</option>
                        <option value="short">{tr.filters.short}</option>
                        <option value="medium">{tr.filters.medium2}</option>
                        <option value="long">{tr.filters.long}</option>
                      </select>
                    </div>
                    <div className="toggle-buttons category-filter sights-filter">
                      <button className="toggle-btn">{tr.filters.indoor}</button>
                      <button className="toggle-btn">{tr.filters.outdoor}</button>
                    </div>
                  </>
                )}

                {currentCategory === 'hotels' && (
                  <>
                    <div className="filter-group category-filter hotels-filter">
                      <label className="filter-label">{tr.filters.pricePerNight}</label>
                      <select className="filter-select">
                        <option value="">{tr.filters.allPrices}</option>
                        <option value="budget">{tr.filters.budget1}</option>
                        <option value="moderate">{tr.filters.budget2}</option>
                        <option value="luxury">{tr.filters.budget3}</option>
                      </select>
                    </div>
                    <div className="filter-group category-filter hotels-filter">
                      <label className="filter-label">{tr.filters.starRating}</label>
                      <select className="filter-select">
                        <option value="">{tr.filters.allStars}</option>
                        <option value="3">3{currentLanguage === 'ko' ? '성급' : currentLanguage === 'en' ? ' stars' : 'つ星'}</option>
                        <option value="4">4{currentLanguage === 'ko' ? '성급' : currentLanguage === 'en' ? ' stars' : 'つ星'}</option>
                        <option value="5">5{currentLanguage === 'ko' ? '성급' : currentLanguage === 'en' ? ' stars' : 'つ星'}</option>
                      </select>
                    </div>
                    <div className="toggle-buttons category-filter hotels-filter">
                      <button className="toggle-btn">{tr.filters.available}</button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={`spots-grid category-${currentCategory}`}>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))
              ) : (
                filteredSpots.map((spot, index) => {
                  // 0..FREE_COUNT-1 は常に閲覧可。以降は未ログイン時ロックを表示。
                  if (!isLoggedIn && index >= FREE_COUNT) {
                    return <LockedCard key={`locked-${spot.id}`} index={index} />;
                  }
                  return <SpotCard key={spot.id} spot={spot} index={index} />;
                })
              )}
            </div>

            <div className="load-more-section">
              {isLoggedIn ? (
                <button 
                  className="load-more-btn"
                  onClick={() => {
                    alert(tr.actions.loadMore + (currentLanguage === 'ja' ? '機能は今後実装予定です' : currentLanguage === 'en' ? ' functionality will be implemented in the future' : ' 기능은 향후 구현 예정입니다'));
                  }}
                >
                  {tr.actions.loadMore}
                </button>
              ) : (
                <Link href="/register" className="load-more-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  新規登録してさらに表示
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ===== 元CSSをそのまま。Tailwind干渉回避のため .tripon でスコープ ===== */}
      <style jsx global>{`
        .tripon { position: relative; z-index: 1; }
        .tripon * { margin: 0; padding: 0; box-sizing: border-box; }
        .tripon body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; min-height: 100vh; position: relative; overflow-x: hidden; }
        .tripon .hero-background { position: fixed; top:0; left:0; width:100%; height:100vh; z-index:-10; background: url('https://images.unsplash.com/photo-1490761668535-35497054764d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2092&q=80') center/cover, linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%); background-attachment: fixed; will-change: transform; }
        .tripon .hero-background::before { content:''; position:absolute; inset:0; background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" opacity="0.1"><defs><pattern id="washi" patternUnits="userSpaceOnUse" width="40" height="40"><circle cx="10" cy="10" r="2" fill="%23ffffff"/><circle cx="30" cy="30" r="1.5" fill="%23ffffff"/><circle cx="20" cy="35" r="1" fill="%23ffffff"/></pattern></defs><rect width="200" height="200" fill="url(%23washi)"/></svg>') repeat; opacity:.1; z-index:-9; }
        .tripon .hero-background::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%); z-index:-8; }
        .tripon .main-content { margin-top:120px; padding:4rem 0; min-height:100vh; position: relative; z-index:10; }
        .tripon .container { max-width:1200px; margin:0 auto; padding:0 3rem; position:relative; z-index:15; }
        .tripon .page-header{ text-align:center; margin-bottom:6rem; position:relative; z-index:16; padding:4rem 0; }
        .tripon .page-header h1{ font-size:4rem; color:white; margin-bottom:1rem; text-shadow:2px 2px 8px rgba(0,0,0,.8); font-weight:700; }
        .tripon .page-header p{ font-size:1.4rem; color:rgba(255,255,255,.9); text-shadow:1px 1px 4px rgba(0,0,0,.7); margin-bottom:3rem; }
        .tripon .category-tabs{ background:rgba(255,255,255,.15); backdrop-filter: blur(20px); border-radius:16px; padding:.5rem; margin-bottom:2rem; border:1px solid rgba(255,255,255,.2); position:relative; z-index:17; }
        .tripon .tabs-container{ display:flex; gap:.5rem; }
        .tripon .tab-button{ flex:1; padding:1rem 1.5rem; border:none; background:transparent; color:rgba(255,255,255,.7); border-radius:12px; cursor:pointer; transition:all .3s ease; font-size:1rem; font-weight:600; text-align:center; position:relative; }
        .tripon .tab-button:hover{ color:#fff; background:rgba(255,255,255,.1); }
        .tripon .tab-button.active{ background:rgba(255,255,255,.25); color:#fff; box-shadow:0 4px 12px rgba(0,0,0,.15); }
        .tripon .tab-button .icon{ font-size:1.2rem; margin-bottom:.5rem; display:block; }
        .tripon .filters-section{ background:rgba(255,255,255,.15); backdrop-filter: blur(20px); border-radius:16px; padding:1.5rem; margin-bottom:2rem; border:1px solid rgba(255,255,255,.2); position:relative; z-index:18; }
        .tripon .filters-row{ display:flex; gap:1rem; align-items:center; flex-wrap:wrap; margin-bottom:1rem; }
        .tripon .filters-row:last-child{ margin-bottom:0; }
        .tripon .search-box{ flex:1; min-width:200px; }
        .tripon .search-input{ width:100%; padding:.8rem 1rem; border:1px solid rgba(255,255,255,.3); border-radius:12px; background:rgba(255,255,255,.9); font-size:.9rem; transition:all .3s; }
        .tripon .search-input:focus{ outline:none; border-color:#667eea; box-shadow:0 0 0 3px rgba(102,126,234,.1); }
        .tripon .filter-group{ display:flex; align-items:center; gap:.5rem; }
        .tripon .filter-label{ color:#fff; font-size:.9rem; font-weight:500; text-shadow:1px 1px 2px rgba(0,0,0,.5); }
        .tripon .filter-select{ padding:.6rem .8rem; border:1px solid rgba(255,255,255,.3); border-radius:8px; background:rgba(255,255,255,.9); font-size:.85rem; min-width:120px; }
        .tripon .toggle-buttons{ display:flex; gap:.5rem; }
        .tripon .toggle-btn{ padding:.6rem 1rem; border:1px solid rgba(255,255,255,.4); background:rgba(255,255,255,.1); color:#fff; border-radius:8px; cursor:pointer; transition:all .3s; font-size:.85rem; }
        .tripon .toggle-btn:hover{ background:rgba(255,255,255,.2); }
        .tripon .toggle-btn.active{ background:rgba(255,255,255,.3); border-color:rgba(255,255,255,.6); }
        .tripon .view-toggle{ display:flex; background:rgba(255,255,255,.15); border-radius:8px; padding:.25rem; }
        .tripon .view-btn{ padding:.5rem 1rem; border:none; background:transparent; color:rgba(255,255,255,.7); border-radius:6px; cursor:pointer; transition:all .3s; }
        .tripon .view-btn.active{ background:rgba(255,255,255,.25); color:#fff; }
        .tripon .spots-grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(350px,1fr)); gap:1.5rem; margin-bottom:2rem; position:relative; z-index:20; min-height:400px; }
        .tripon .spot-card{ background:rgba(255,255,255,0.9) !important; border-radius:16px; overflow:visible; transition: all .4s cubic-bezier(.4,0,.2,1); cursor:pointer; backdrop-filter: blur(28px) saturate(120%); -webkit-backdrop-filter: blur(28px) saturate(120%); box-shadow:0 8px 32px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2); border:2px solid rgba(255,255,255,0.8); position:relative; z-index:25; will-change: transform, box-shadow; min-height:400px; display:block !important; visibility:visible !important; opacity:1 !important; }
        .tripon .spot-card:hover{ transform: translateY(-8px) scale(1.02); box-shadow:0 20px 60px rgba(0,0,0,.2), 0 8px 30px rgba(0,0,0,.15); background:rgba(255,255,255,.25); }
        .tripon .card-image{ width:100%; height:200px; background:linear-gradient(135deg,#667eea,#764ba2); position:relative; overflow:hidden; z-index:26; }
        .tripon .card-image img{ width:100%; height:100%; object-fit:cover; transition: transform .4s ease; display:block !important; }
        .tripon .spot-card:hover .card-image img{ transform: scale(1.05); }
        .tripon .card-badges{ position:absolute; top:.75rem; left:.75rem; display:flex; gap:.5rem; flex-wrap:wrap; z-index:27; }
        .tripon .badge{ padding:.25rem .6rem; background:rgba(0,0,0,.7); color:#fff; border-radius:12px; font-size:.75rem; font-weight:500; display:block !important; }
        .tripon .badge.open{ background:#22c55e; } .tripon .badge.popular{ background:#f59e0b; }
        .tripon .favorite-btn{ position:absolute; top:.75rem; right:.75rem; width:36px; height:36px; border:none; background:rgba(255,255,255,.9); border-radius:50%; cursor:pointer; transition:all .3s; display:flex !important; align-items:center; justify-content:center; z-index:27; }
        .tripon .favorite-btn:hover{ background:#fff; transform: scale(1.1); }
        .tripon .favorite-btn.active{ background:#ef4444; color:#fff; }
        .tripon .card-content{ padding:1.25rem; position:relative; z-index:26; }
        .tripon .card-header{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:.75rem; position:relative; z-index:27; }
        .tripon .spot-name{ font-size:1.1rem; font-weight:700; color:#111827; text-shadow:0 1px 2px rgba(255,255,255,.7); line-height:1.3; flex:1; display:block !important; }
        .tripon .rating-section{ display:flex; align-items:center; gap:.5rem; margin-bottom:.75rem; position:relative; z-index:27; }
        .tripon .stars{ color:#fbbf24; font-size:.9rem; display:block !important; }
        .tripon .rating-text{ font-size:.85rem; color:#374151; font-weight:600; display:block !important; }
        .tripon .reviews-count{ font-size:.8rem; color:#6b7280; display:block !important; }
        .tripon .spot-info{ display:flex; flex-wrap:wrap; gap:.75rem; margin-bottom:1rem; font-size:.85rem; position:relative; z-index:27; }
        .tripon .info-item{ display:flex; align-items:center; gap:.25rem; color:#374151; font-weight:500; display:block !important; }
        .tripon .spot-tags{ display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:1rem; position:relative; z-index:27; }
        .tripon .tag{ padding:.25rem .6rem; background:rgba(102,126,234,.1); color:#4f46e5; border-radius:12px; font-size:.75rem; font-weight:500; border:1px solid rgba(102,126,234,.2); display:block !important; }
        .tripon .card-actions{ display:flex; gap:.75rem; align-items:center; position:relative; z-index:27; }
        .tripon .details-btn{ flex:1; padding:.75rem 1rem; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; border:none; border-radius:8px; font-weight:600; font-size:.9rem; cursor:pointer; transition:all .3s; display:block !important; }
        .tripon .details-btn:hover{ transform: translateY(-1px); box-shadow:0 4px 12px rgba(102,126,234,.3); }
        .tripon .loading-skeleton{ background:rgba(255,255,255,.1); border-radius:16px; padding:1rem; position:relative; overflow:hidden; }
        .tripon .skeleton-shimmer{ position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent); animation: shimmer 1.5s infinite; }
        @keyframes shimmer{ 0%{ left:-100%; } 100%{ left:100%; } }
        .tripon .skeleton-image{ width:100%; height:200px; background:rgba(255,255,255,.1); border-radius:8px; margin-bottom:1rem; }
        .tripon .skeleton-text{ height:1rem; background:rgba(255,255,255,.1); border-radius:4px; margin-bottom:.5rem; }
        .tripon .skeleton-text.short{ width:60%; }
        .tripon .load-more-section{ text-align:center; margin:2rem 0; position:relative; z-index:19; }
        .tripon .load-more-btn{ padding:1rem 2rem; background:rgba(255,255,255,.2); color:#fff; border:1px solid rgba(255,255,255,.3); border-radius:12px; font-size:1rem; font-weight:600; cursor:pointer; transition:all .3s; backdrop-filter: blur(10px); }
        .tripon .load-more-btn:hover{ background:rgba(255,255,255,.3); transform: translateY(-2px); }
        .tripon .cta-buttons{ display:flex; align-items:center; justify-content:center; gap:1.5rem; flex-wrap:wrap; margin-top:2rem; }
        .tripon .cta-btn{ display:inline-flex; align-items:center; gap:.75rem; padding:1rem 2rem; border:none; border-radius:50px; font-size:1.1rem; font-weight:700; cursor:pointer; transition:all .3s ease; text-align:center; box-shadow:0 8px 24px rgba(0,0,0,.2); }
        .tripon .favorite-btn-cta{ background:linear-gradient(135deg,#ef4444 0%,#dc2626 50%,#b91c1c 100%); color:#fff; }
        .tripon .ai-plan-btn{ background:rgba(255,255,255,.9); color:#374151; border:2px solid rgba(255,255,255,.3); }
        .tripon .ticket-btn{ background:rgba(255,255,255,.9); color:#374151; border:2px solid rgba(255,255,255,.3); }
        .tripon .cta-btn:hover{ transform:translateY(-2px) scale(1.05); box-shadow:0 12px 32px rgba(0,0,0,.3); }
        .tripon .favorite-btn-cta:hover{ background:linear-gradient(135deg,#dc2626 0%,#b91c1c 50%,#991b1b 100%); }
        .tripon .ai-plan-btn:hover, .tripon .ticket-btn:hover{ background:rgba(255,255,255,1); }
        .tripon .btn-icon{ font-size:1.2rem; display:inline-block; }
        @media (max-width: 768px){
          .tripon .nav{ flex-direction:column; gap:1rem; padding:1rem; }
          .tripon .main-content{ margin-top:140px; padding:1rem 0; }
          .tripon .container{ padding:0 1rem; }
          .tripon .page-header h1{ font-size:2rem; }
          .tripon .tabs-container{ flex-direction:column; gap:.25rem; }
          .tripon .filters-row{ flex-direction:column; align-items:stretch; gap:.75rem; }
          .tripon .filter-group{ justify-content:space-between; }
          .tripon .spots-grid{ grid-template-columns:1fr; gap:1rem; }
          .tripon .spot-card{ margin:0 .5rem; }
          .tripon .cta-buttons{ flex-direction:column; gap:1rem; }
          .tripon .cta-btn{ width:100%; max-width:280px; justify-content:center; }
        }
        @media (min-width: 769px) and (max-width: 1024px){
          .tripon .spots-grid{ grid-template-columns: repeat(2,1fr); }
        }
        @media (min-width: 1025px){
          .tripon .spots-grid{ grid-template-columns: repeat(3,1fr); }
        }
        .tripon .category-food .card-image{ background: linear-gradient(135deg,#f59e0b,#d97706); }
        .tripon .category-sights .card-image{ background: linear-gradient(135deg,#10b981,#059669); }
        .tripon .category-hotels .card-image{ background: linear-gradient(135deg,#8b5cf6,#7c3aed); }
        .tripon .fade-in{ animation: fadeIn .5s ease-out; }
        @keyframes fadeIn{ from{ opacity:0; transform: translateY(20px);} to{ opacity:1; transform:none;} }
        .tripon .hidden{ display:none; }
      `}</style>
    </>
  );
}
