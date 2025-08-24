'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

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
  name: SpotName | string;
  rating: number;
  reviews: number;
  image: string;
  badges: string[];
  info: SpotInfo;
  tags: string[];
  category: 'food' | 'sights' | 'hotels';
}

// All spot data from tokyo page and additional spots
const allSpots: Spot[] = [
  // Food spots (IDs 1-20)
  {
    id: 1,
    name: "鮨麒",
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
    name: "ビストロ楽",
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
    id: 16,
    name: "RESTAURANT PLATINUM FISH マーチエキュート神田万世橋店",
    rating: 4.3,
    reviews: 892,
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
    name: "ブラッスリー・ヴィロン 丸の内店",
    rating: 4.1,
    reviews: 1245,
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
    name: "中国料理「後楽園飯店」",
    rating: 4.0,
    reviews: 756,
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
    name: "招福樓 東京店",
    rating: 4.2,
    reviews: 634,
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
    name: "名代 宇奈とと 新橋店",
    rating: 3.8,
    reviews: 1156,
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
  // Tokyo Sights (IDs 101-111)
  {
    id: 101,
    name: {
      ja: "東京タワー",
      en: "Tokyo Tower",
      ko: "도쿄 타워"
    },
    rating: 4.2,
    reviews: 15032,
    image: "/images/spots/東京タワー_20250714_121123.jpg",
    badges: ["人気", "屋内", "営業中"],
    info: {
      duration: "2-3時間",
      ticketRequired: "必要",
      bestTime: "夕方",
      crowdLevel: "普通"
    },
    tags: ["展望台", "夜景", "ランドマーク"],
    category: "sights"
  },
  {
    id: 102,
    name: {
      ja: "東京スカイツリー",
      en: "Tokyo Skytree",
      ko: "도쿄 스카이트리"
    },
    rating: 4.1,
    reviews: 28456,
    image: "/images/spots/東京スカイツリー_20250714_121122.jpg",
    badges: ["人気", "屋内", "営業中"],
    info: {
      duration: "2-3時間",
      ticketRequired: "必要",
      bestTime: "夕方",
      crowdLevel: "普通"
    },
    tags: ["展望台", "モダン", "夜景"],
    category: "sights"
  },
  {
    id: 103,
    name: {
      ja: "浅草寺",
      en: "Senso-ji Temple",
      ko: "센소지"
    },
    rating: 4.3,
    reviews: 94587,
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
    badges: ["人気", "屋外", "営業中"],
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
    id: 104,
    name: {
      ja: "渋谷スクランブル交差点",
      en: "Shibuya Crossing",
      ko: "시부야 스크램블 교차점"
    },
    rating: 4.0,
    reviews: 12843,
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
    badges: ["人気", "屋外", "24時間"],
    info: {
      duration: "30分-1時間",
      ticketRequired: "不要",
      bestTime: "夕方",
      crowdLevel: "混雑"
    },
    tags: ["都市景観", "写真スポット", "モダン"],
    category: "sights"
  },
  {
    id: 105,
    name: {
      ja: "明治神宮",
      en: "Meiji Shrine",
      ko: "메이지 신궁"
    },
    rating: 4.4,
    reviews: 52384,
    image: "/images/spots/明治神宮_20250714_121123.jpg",
    badges: ["人気", "屋外", "営業中"],
    info: {
      duration: "1-2時間",
      ticketRequired: "不要",
      bestTime: "朝",
      crowdLevel: "普通"
    },
    tags: ["神社", "自然", "伝統"],
    category: "sights"
  },
  {
    id: 106,
    name: {
      ja: "新宿御苑",
      en: "Shinjuku Gyoen",
      ko: "신주쿠 교엔"
    },
    rating: 4.3,
    reviews: 23847,
    image: "/images/spots/新宿御苑_20250714_121139.jpg",
    badges: ["人気", "屋外", "営業中"],
    info: {
      duration: "2-4時間",
      ticketRequired: "必要",
      bestTime: "午前",
      crowdLevel: "普通"
    },
    tags: ["庭園", "桜", "自然"],
    category: "sights"
  },
  {
    id: 107,
    name: {
      ja: "築地場外市場",
      en: "Tsukiji Outer Market",
      ko: "츠키지 장외시장"
    },
    rating: 4.1,
    reviews: 15632,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    badges: ["人気", "屋外", "営業中"],
    info: {
      duration: "1-3時間",
      ticketRequired: "不要",
      bestTime: "朝",
      crowdLevel: "混雑"
    },
    tags: ["市場", "グルメ", "文化"],
    category: "sights"
  },
  {
    id: 108,
    name: {
      ja: "六本木ヒルズ",
      en: "Roppongi Hills",
      ko: "롯폰기 힐즈"
    },
    rating: 4.0,
    reviews: 28439,
    image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400",
    badges: ["人気", "屋内", "営業中"],
    info: {
      duration: "2-5時間",
      ticketRequired: "展望台のみ必要",
      bestTime: "夕方",
      crowdLevel: "普通"
    },
    tags: ["ショッピング", "展望台", "モダン"],
    category: "sights"
  },
  {
    id: 109,
    name: {
      ja: "東京国立博物館",
      en: "Tokyo National Museum",
      ko: "도쿄국립박물관"
    },
    rating: 4.3,
    reviews: 19847,
    image: "/images/spots/東京国立博物館_20250714_121129.jpg",
    badges: ["人気", "屋内", "営業中"],
    info: {
      duration: "2-4時間",
      ticketRequired: "必要",
      bestTime: "午前",
      crowdLevel: "普通"
    },
    tags: ["博物館", "歴史", "文化"],
    category: "sights"
  },
  {
    id: 110,
    name: {
      ja: "皇居",
      en: "Imperial Palace",
      ko: "고쿄"
    },
    rating: 4.2,
    reviews: 31245,
    image: "/images/spots/皇居_20250714_121125.jpg",
    badges: ["人気", "屋外", "営業中"],
    info: {
      duration: "1-3時間",
      ticketRequired: "東御苑は不要",
      bestTime: "午前",
      crowdLevel: "普通"
    },
    tags: ["歴史", "庭園", "皇室"],
    category: "sights"
  },
  {
    id: 111,
    name: {
      ja: "皇居東御苑",
      en: "East Gardens of the Imperial Palace",
      ko: "고쿄 히가시교엔"
    },
    rating: 4.4,
    reviews: 18523,
    image: "/images/spots/皇居東御苑_20250714_121142.jpg",
    badges: ["人気", "屋外", "営業中"],
    info: {
      duration: "1-2時間",
      ticketRequired: "不要",
      bestTime: "午前",
      crowdLevel: "普通"
    },
    tags: ["庭園", "歴史", "自然"],
    category: "sights"
  },
  // Hotels (IDs 201-202)
  {
    id: 201,
    name: "パークハイアット東京",
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
    name: "東急ステイ新宿",
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
];

export default function SpotDetail() {
  const params = useParams();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<'ja' | 'en' | 'ko'>('ja');

  // Get display name with fallback logic
  const getDisplayName = (name: SpotName | string): string => {
    if (typeof name === 'string') return name;
    
    if (currentLanguage === 'ja' && name.ja) return name.ja;
    if (currentLanguage === 'en' && name.en) return name.en;
    if (currentLanguage === 'ko' && name.ko) return name.ko;
    // Fallback order: en → ja → ko
    return name.en || name.ja || name.ko || '';
  };

  // Detect language from header
  useEffect(() => {
    const checkLanguage = () => {
      const activeLangBtn = document.querySelector('.lang-btn.active');
      if (activeLangBtn) {
        const lang = activeLangBtn.getAttribute('data-lang') as 'ja' | 'en' | 'ko' | 'fr';
        if (lang && ['ja', 'en', 'ko'].includes(lang) && lang !== currentLanguage) {
          setCurrentLanguage(lang as 'ja' | 'en' | 'ko');
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

    // Cleanup
    return () => observer.disconnect();
  }, [currentLanguage]);

  useEffect(() => {
    if (params?.id) {
      const spotId = parseInt(params.id as string);
      const foundSpot = allSpots.find(s => s.id === spotId);
      setSpot(foundSpot || null);
      setLoading(false);
    }
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">スポットが見つかりません</h1>
          <a href="/spots/tokyo" className="text-blue-300 hover:text-blue-400 underline">
            東京スポット一覧に戻る
          </a>
        </div>
      </div>
    );
  }

  const renderSpotInfo = () => {
    switch(spot.category) {
      case 'food':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <span>💰</span> 
              <span className="text-sm">{spot.info.price}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>🍽️</span> 
              <span className="text-sm">{spot.info.cuisine}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>📍</span> 
              <span className="text-sm">{spot.info.distance}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>🕐</span> 
              <span className="text-sm">{spot.info.openHours}</span>
            </div>
          </div>
        );
      case 'sights':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <span>⏱️</span> 
              <span className="text-sm">{spot.info.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>🎫</span> 
              <span className="text-sm">{spot.info.ticketRequired}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>🌅</span> 
              <span className="text-sm">{spot.info.bestTime}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>👥</span> 
              <span className="text-sm">{spot.info.crowdLevel}</span>
            </div>
          </div>
        );
      case 'hotels':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <span>💰</span> 
              <span className="text-sm">{spot.info.pricePerNight}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>⭐</span> 
              <span className="text-sm">{spot.info.stars}つ星</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span>🕐</span> 
              <span className="text-sm">{spot.info.checkIn} - {spot.info.checkOut}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Header */}
      <div className="relative z-10 p-4">
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6"
        >
          ← 戻る
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl">
          {/* Hero image */}
          <div className="relative h-64 md:h-80 w-full">
            <Image
              src={spot.image}
              alt={getDisplayName(spot.name)}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-2xl"
            />
            <div className="absolute top-4 left-4">
              <div className="flex flex-wrap gap-2">
                {spot.badges.map((badge, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      badge === '営業中' ? 'bg-green-500 text-white' : 
                      badge === '人気' ? 'bg-orange-500 text-white' : 
                      'bg-black/70 text-white'
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title and rating */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getDisplayName(spot.name)}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="font-semibold text-gray-800">{spot.rating}</span>
                </div>
                <span className="text-gray-600">({spot.reviews.toLocaleString()} レビュー)</span>
              </div>
            </div>

            {/* Info */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">基本情報</h2>
              {renderSpotInfo()}
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">特徴</h2>
              <div className="flex flex-wrap gap-2">
                {spot.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                詳細を見る
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors">
                お気に入り
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}