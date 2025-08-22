'use client';

import Head from 'next/head';
import { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';

interface SpotInfo {
  price?: string;
  cuisine?: string;
  distance?: string;
  openHours?: string;
  duration?: string;
  ticketRequired?: string;
  bestTime?: string;
  crowdLevel?: string;
  pricePerNight?: string;
  stars?: number;
  checkIn?: string;
  checkOut?: string;
}

interface SpotName {
  ja: string;
  en: string;
  ko: string;
}

interface Spot {
  id: number;
  name: SpotName;
  rating: number;
  reviews: number;
  image: string;
  badges: string[];
  info: SpotInfo;
  tags: string[];
  category: 'food' | 'sights' | 'hotels';
}

type Category = 'food' | 'sights' | 'hotels';

export default function TokyoSpots() {
  // State management
  const [currentCategory, setCurrentCategory] = useState<Category>('food');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteSpots, setFavoriteSpots] = useState<Set<number>>(new Set());
  const [currentLanguage, setCurrentLanguage] = useState<'ja' | 'en' | 'ko'>('ja');

  // Listen for language changes from header
  useEffect(() => {
    const checkLanguage = () => {
      const activeLangBtn = document.querySelector('.lang-btn.active');
      if (activeLangBtn) {
        const lang = activeLangBtn.getAttribute('data-lang') as 'ja' | 'en' | 'ko';
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
    }
  };

  // Get translations for current language
  const tr = translations[currentLanguage as keyof typeof translations] || translations.ja;

  // Helper function to get display name with fallback logic (en → ja → ko)
  const getDisplayName = useCallback((name: SpotName): string => {
    if (currentLanguage === 'ja' && name.ja) return name.ja;
    if (currentLanguage === 'en' && name.en) return name.en;
    if (currentLanguage === 'ko' && name.ko) return name.ko;
    // Fallback order: en → ja → ko
    return name.en || name.ja || name.ko || '';
  }, [currentLanguage]);

  // Data - moved inside useMemo to avoid dependency issues
  const filteredSpots = useMemo(() => {
    const sampleData: Record<Category, Spot[]> = {
      food: [
        {
          id: 1,
          name: {
            ja: "鮨麒",
            en: "Sushi Kiri",
            ko: "스시 키리"
          },
          rating: 4.6,
          reviews: 1461,
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
            ko: "비스트로 라쿠"
          },
          rating: 3.6,
          reviews: 2421,
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
            ko: "일본요리 카제"
          },
          rating: 3.1,
          reviews: 169,
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
            ko: "야키니쿠 하나"
          },
          rating: 4.5,
          reviews: 1046,
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
            ko: "멘야 코토부키"
          },
          rating: 3.4,
          reviews: 2554,
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
            ko: "주토리"
          },
          rating: 4.1,
          reviews: 342,
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
            ko: "참불구이 카메"
          },
          rating: 3.3,
          reviews: 2394,
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
            ko: "코토부키 세이멘"
          },
          rating: 3.5,
          reviews: 1041,
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
            ko: "이탈리안 시"
          },
          rating: 4.3,
          reviews: 2692,
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
            ko: "소라 스시"
          },
          rating: 3.8,
          reviews: 2736,
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
            ko: "멘코보 타카"
          },
          rating: 3.8,
          reviews: 684,
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
            ko: "멘야 린"
          },
          rating: 4.7,
          reviews: 615,
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
            ko: "카페 세이"
          },
          rating: 3.9,
          reviews: 1469,
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
            ko: "쇼쿠지도코로 유"
          },
          rating: 4.4,
          reviews: 2935,
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
            ko: "레스토랑 다이"
          },
          rating: 4.2,
          reviews: 1774,
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
        }
      ],
    sights: [
        {
          id: 101,
          name: {
            ja: "浅草寺",
            en: "Senso-ji Temple",
            ko: "센소지"
          },
          rating: 4.6,
          reviews: 15230,
          image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
          badges: ["人気", "屋外"],
          info: {
            duration: "1-2時間",
            ticketRequired: "不要",
            bestTime: "朝",
            crowdLevel: "混雑"
          },
          tags: ["歴史", "寺院", "伝統"],
          category: "sights"
        },
        {
          id: 102,
          name: {
            ja: "東京スカイツリー",
            en: "Tokyo Skytree",
            ko: "도쿠 스카이트리"
          },
          rating: 4.4,
          reviews: 23400,
          image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400",
          badges: ["人気", "屋内"],
          info: {
            duration: "2-3時間",
            ticketRequired: "必要",
            bestTime: "夕方",
            crowdLevel: "普通"
          },
          tags: ["展望台", "モダン", "夜景"],
          category: "sights"
        }
      ],
    hotels: [
        {
          id: 201,
          name: {
            ja: "パークハイアット東京",
            en: "Park Hyatt Tokyo",
            ko: "파크 하이엇 도쿠"
          },
          rating: 4.9,
          reviews: 3420,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
          badges: ["5つ星", "空室あり"],
          info: {
            pricePerNight: "¥45,000-80,000",
            stars: 5,
            checkIn: "15:00",
            checkOut: "12:00"
          },
          tags: ["ラグジュアリー", "シティビュー", "スパ"],
          category: "hotels"
        },
        {
          id: 202,
          name: {
            ja: "東急ステイ新宿",
            en: "Tokyu Stay Shinjuku",
            ko: "도큐 스테이 신주쿠"
          },
          rating: 4.3,
          reviews: 1890,
          image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
          badges: ["4つ星", "空室あり"],
          info: {
            pricePerNight: "¥12,000-18,000",
            stars: 4,
            checkIn: "15:00",
            checkOut: "11:00"
          },
          tags: ["ビジネス", "駅近", "洗濯機付"],
          category: "hotels"
        }
      ]
    };

    const currentData = sampleData[currentCategory] || [];
    if (!searchTerm.trim()) return currentData;
    
    return currentData.filter(spot => {
      const displayName = getDisplayName(spot.name);
      return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [currentCategory, searchTerm, getDisplayName]);

  // Initialize from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') as Category;
    if (category && ['food', 'sights', 'hotels'].includes(category)) {
      setCurrentCategory(category);
    }
  }, []);

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
  const toggleFavorite = useCallback((spotId: number) => {
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
  const showDetails = useCallback((spotId: number) => {
    alert(`スポット ${spotId} の詳細を表示します`);
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
          src={spot.image}
          alt={getDisplayName(spot.name)}
          width={400}
          height={200}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
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
          <span className="reviews-count">({spot.reviews}{tr.spots.reviews})</span>
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
          <button className="details-btn" onClick={() => showDetails(spot.id)}>
            {tr.actions.detailsBtn}
          </button>
        </div>
      </div>
    </div>
  ), [favoriteSpots, renderSpotInfo, showDetails, toggleFavorite, tr, getDisplayName]);

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
                filteredSpots.map((spot, index) => (
                  <SpotCard key={spot.id} spot={spot} index={index} />
                ))
              )}
            </div>

            <div className="load-more-section">
              <button 
                className="load-more-btn"
                onClick={() => {
                  // Load more functionality can be implemented here
                  alert(tr.actions.loadMore + (currentLanguage === 'ja' ? '機能は今後実装予定です' : currentLanguage === 'en' ? ' functionality will be implemented in the future' : ' 기능은 향후 구현 예정입니다'));
                }}
              >
                {tr.actions.loadMore}
              </button>
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
        .tripon .main-content { margin-top:120px; padding:2rem 0; min-height:100vh; position: relative; z-index:10; }
        .tripon .container { max-width:1200px; margin:0 auto; padding:0 2rem; position:relative; z-index:15; }
        .tripon .page-header{ text-align:center; margin-bottom:2rem; position:relative; z-index:16; }
        .tripon .page-header h1{ font-size:2.5rem; color:white; margin-bottom:.5rem; text-shadow:2px 2px 8px rgba(0,0,0,.8); font-weight:700; }
        .tripon .page-header p{ font-size:1.1rem; color:rgba(255,255,255,.9); text-shadow:1px 1px 4px rgba(0,0,0,.7); }
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