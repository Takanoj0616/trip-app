'use client';

import { useState, useEffect } from 'react';
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

interface Spot {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  image: string;
  badges: string[];
  info: SpotInfo;
  tags: string[];
  category: 'food' | 'sights' | 'hotels';
}

const sampleData = {
  food: [
    {
      id: 1,
      name: "築地外市場 寿司大",
      rating: 4.8,
      reviews: 2340,
      image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400",
      badges: ["人気", "営業中"],
      info: {
        price: "¥3,000-5,000",
        cuisine: "寿司",
        distance: "500m",
        openHours: "5:00-14:00"
      },
      tags: ["新鮮", "老舗", "早朝営業"],
      category: "food" as const
    },
    {
      id: 2,
      name: "一蘭 渋谷店",
      rating: 4.5,
      reviews: 1876,
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
      badges: ["営業中"],
      info: {
        price: "¥1,000-2,000",
        cuisine: "ラーメン",
        distance: "1.2km",
        openHours: "24時間"
      },
      tags: ["とんこつ", "24時間", "一人席"],
      category: "food" as const
    },
    {
      id: 7,
      name: "すきやばし次郎",
      rating: 4.9,
      reviews: 890,
      image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400",
      badges: ["人気", "高級"],
      info: {
        price: "¥30,000以上",
        cuisine: "寿司",
        distance: "2.1km",
        openHours: "11:30-14:00, 17:00-20:30"
      },
      tags: ["ミシュラン", "高級", "要予約"],
      category: "food" as const
    }
  ],
  sights: [
    {
      id: 3,
      name: "浅草寺",
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
      category: "sights" as const
    },
    {
      id: 4,
      name: "東京スカイツリー",
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
      category: "sights" as const
    },
    {
      id: 8,
      name: "明治神宮",
      rating: 4.7,
      reviews: 8920,
      image: "https://images.unsplash.com/photo-1590253230532-a67f6bc61f14?w=400",
      badges: ["人気", "屋外"],
      info: {
        duration: "1-2時間",
        ticketRequired: "不要",
        bestTime: "午前",
        crowdLevel: "普通"
      },
      tags: ["神社", "自然", "静寂"],
      category: "sights" as const
    }
  ],
  hotels: [
    {
      id: 5,
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
      category: "hotels" as const
    },
    {
      id: 6,
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
      category: "hotels" as const
    },
    {
      id: 9,
      name: "帝国ホテル東京",
      rating: 4.8,
      reviews: 5670,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
      badges: ["5つ星", "空室あり"],
      info: {
        pricePerNight: "¥35,000-60,000",
        stars: 5,
        checkIn: "15:00",
        checkOut: "12:00"
      },
      tags: ["クラシック", "伝統", "皇居近く"],
      category: "hotels" as const
    }
  ]
};

const SkeletonCard = () => (
  <div className="relative bg-white/20 backdrop-blur-lg rounded-2xl overflow-hidden">
    <div className="animate-pulse">
      <div className="h-48 bg-white/10 rounded-t-2xl"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="h-3 bg-white/10 rounded w-1/2"></div>
        <div className="h-3 bg-white/10 rounded w-full"></div>
      </div>
    </div>
  </div>
);

const SpotCard = ({ spot }: { spot: Spot }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const renderSpotInfo = () => {
    switch(spot.category) {
      case 'food':
        return (
          <>
            <div className="flex items-center gap-1 text-gray-700 text-xs">💰 {spot.info.price}</div>
            <div className="flex items-center gap-1 text-gray-700 text-xs">🍽️ {spot.info.cuisine}</div>
            <div className="flex items-center gap-1 text-gray-700 text-xs">📍 {spot.info.distance}</div>
            <div className="flex items-center gap-1 text-gray-700 text-xs">🕐 {spot.info.openHours}</div>
          </>
        );
      case 'sights':
        return (
          <>
            <div className="flex items-center gap-1 text-gray-700 text-xs">⏱️ {spot.info.duration}</div>
            <div className="flex items-center gap-1 text-gray-700 text-xs">🎫 {spot.info.ticketRequired}</div>
            <div className="flex items-center gap-1 text-gray-700 text-xs">🌅 {spot.info.bestTime}</div>
            <div className="flex items-center gap-1 text-gray-700 text-xs">👥 {spot.info.crowdLevel}</div>
          </>
        );
      case 'hotels':
        return (
          <>
            <div className="flex items-center gap-1 text-gray-700 text-xs">💰 {spot.info.pricePerNight}</div>
            <div className="flex items-center gap-1 text-gray-700 text-xs">⭐ {spot.info.stars}つ星</div>
            <div className="flex items-center gap-1 text-gray-700 text-xs">🕐 {spot.info.checkIn}-{spot.info.checkOut}</div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group relative bg-white/20 backdrop-blur-lg rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 hover:scale-105 hover:bg-white/30 cursor-pointer border border-white/30">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={spot.image}
          alt={spot.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {spot.badges.map((badge, index) => (
            <span 
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                badge === '営業中' ? 'bg-green-500 text-white' :
                badge === '人気' ? 'bg-orange-500 text-white' :
                'bg-black/70 text-white'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white'
          }`}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{spot.name}</h3>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="text-yellow-500 text-sm">
            {'★'.repeat(Math.floor(spot.rating))}{'☆'.repeat(5-Math.floor(spot.rating))}
          </div>
          <span className="text-sm font-semibold text-gray-700">{spot.rating}</span>
          <span className="text-xs text-gray-600">({spot.reviews}件)</span>
        </div>
        
        <div className="grid grid-cols-1 gap-1 mb-4">
          {renderSpotInfo()}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {spot.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
          詳細を見る
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [currentCategory, setCurrentCategory] = useState<'food' | 'sights' | 'hotels'>('food');
  const [currentData, setCurrentData] = useState<Spot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ja');

  useEffect(() => {
    loadData(currentCategory);
  }, [currentCategory]);

  const loadData = (category: 'food' | 'sights' | 'hotels') => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentData(sampleData[category] || []);
      setIsLoading(false);
    }, 800);
  };

  const switchCategory = (category: 'food' | 'sights' | 'hotels') => {
    setCurrentCategory(category);
  };

  const filteredData = currentData.filter(spot => 
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Hero Background */}
      <div 
        className="fixed top-0 left-0 w-full h-screen z-[-2] bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490761668535-35497054764d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2092&q=80'), linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50"></div>
      </div>

      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg">
        <nav className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <div className="text-2xl font-bold text-blue-600">Trip On</div>
          <ul className="hidden md:flex space-x-8">
            <li><a href="#home" className="text-gray-700 hover:text-blue-600 font-medium">Home</a></li>
            <li><a href="#areas" className="text-gray-700 hover:text-blue-600 font-medium">Areas</a></li>
            <li><a href="#itinerary" className="text-gray-700 hover:text-blue-600 font-medium">AI Itinerary</a></li>
            <li><a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About</a></li>
          </ul>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentLanguage(currentLanguage === 'ja' ? 'en' : 'ja')}
              className="px-4 py-2 border border-gray-300 rounded-full bg-white hover:bg-gray-50"
            >
              {currentLanguage === 'ja' ? 'EN / 日本語' : 'JP / English'}
            </button>
            <div className="text-gray-700">Login</div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Tokyo Spots</h1>
            <p className="text-lg text-white/90 drop-shadow">Discover the best dining, sightseeing, and hotels in Tokyo</p>
          </div>

          {/* Category Tabs */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-2 mb-6 border border-white/20">
            <div className="flex gap-2">
              <button
                onClick={() => switchCategory('food')}
                className={`flex-1 p-4 rounded-xl transition-all ${
                  currentCategory === 'food' 
                    ? 'bg-white/25 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="block text-xl mb-1">🍜</span>
                <span className="font-semibold">飲食</span>
              </button>
              <button
                onClick={() => switchCategory('sights')}
                className={`flex-1 p-4 rounded-xl transition-all ${
                  currentCategory === 'sights' 
                    ? 'bg-white/25 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="block text-xl mb-1">🏯</span>
                <span className="font-semibold">観光スポット</span>
              </button>
              <button
                onClick={() => switchCategory('hotels')}
                className={`flex-1 p-4 rounded-xl transition-all ${
                  currentCategory === 'hotels' 
                    ? 'bg-white/25 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="block text-xl mb-1">🏨</span>
                <span className="font-semibold">ホテル</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="キーワードで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/90 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <select className="p-3 rounded-xl bg-white/90 border border-white/30 min-w-32">
                  <option>人気</option>
                  <option>評価</option>
                  <option>距離</option>
                  <option>価格</option>
                </select>
                <div className="flex bg-white/15 rounded-lg p-1">
                  <button className="p-2 bg-white/25 rounded text-white">📋</button>
                  <button className="p-2 text-white/70">🗺️</button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              filteredData.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))
            )}
          </div>

          {/* Load More */}
          <div className="text-center">
            <button className="px-8 py-3 bg-white/20 text-white border border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-colors backdrop-blur-lg">
              さらに表示
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
