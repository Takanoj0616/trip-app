'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Star, Clock, Phone, Globe, ArrowLeft, Heart, Plus, Check } from 'lucide-react';
import Link from 'next/link';
import { TouristSpot } from '@/types';
import { tokyoSpots } from '@/data/tokyo-spots';
import { kanngouSpots } from '@/data/kankou-spots';
import { hotelSpots } from '@/data/hotel-spots';
import FavoriteButton from '@/components/FavoriteButton';
import { useRoute } from '@/contexts/RouteContext';
import { useLanguage } from '@/contexts/LanguageContext';

import SakuraBackground from '@/components/SakuraBackground';

// すべてのスポットデータを統合（将来的には他のエリアも追加可能）
const allSpots: Record<string, TouristSpot[]> = {
  tokyo: [...tokyoSpots, ...kanngouSpots, ...hotelSpots],
  // 他のエリアも追加可能
};

const getAllSpots = (): TouristSpot[] => {
  return Object.values(allSpots).flat();
};


export default function SpotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const spotId = params.id as string;
  const { isSpotSelected, toggleSpot, selectedSpots } = useRoute();
  const { currentLanguage, t } = useLanguage();

  const [spot, setSpot] = useState<TouristSpot | null>(null);
  const [loading, setLoading] = useState(true);

  // すべてのuseEffectを最初に配置
  useEffect(() => {
    // 全スポットからIDで検索
    const allSpotsArray = getAllSpots();
    const foundSpot = allSpotsArray.find(s => s.id === spotId);
    
    setSpot(foundSpot || null);
    setLoading(false);
  }, [spotId]);

  useEffect(() => {
    // Inject Google Fonts and FontAwesome
    const fontLinks = document.createElement('link');
    fontLinks.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
    fontLinks.rel = 'stylesheet';
    document.head.appendChild(fontLinks);

    const fontAwesome = document.createElement('link');
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    fontAwesome.rel = 'stylesheet';
    document.head.appendChild(fontAwesome);

    // Font injection handled by SakuraBackground component

    return () => {
      try {
        if (fontLinks && document.head && document.head.contains(fontLinks)) {
          document.head.removeChild(fontLinks);
        }
      } catch (error) {
        // Font cleanup failed (non-critical)
      }

      try {
        if (fontAwesome && document.head && document.head.contains(fontAwesome)) {
          document.head.removeChild(fontAwesome);
        }
      } catch (error) {
        // Font cleanup failed (non-critical)
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗾</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">スポットが見つかりません</h1>
          <p className="text-gray-600 mb-6">お探しのスポットは存在しないか、削除された可能性があります。</p>
          <Link
            href="/areas"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            エリア一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const formatOpeningHours = (openingHours?: Record<string, string>) => {
    if (!openingHours) return null;
    
    const today = new Date().getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const todayKey = days[today] as keyof typeof openingHours;
    
    return {
      today: openingHours[todayKey] || '営業時間不明',
      todayName: dayNames[today]
    };
  };

  const getAreaName = (area: string) => {
    const areaNames: Record<string, string> = {
      tokyo: '東京',
      yokohama: '横浜',
      saitama: '埼玉',
      chiba: '千葉'
    };
    return areaNames[area] || area;
  };

  const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
      sightseeing: '観光・名所',
      restaurants: 'グルメ・レストラン',
      hotels: 'ホテル・宿泊',
      entertainment: 'エンターテイメント',
      shopping: 'ショッピング',
      transportation: '交通'
    };
    return categoryNames[category] || category;
  };

  const openingHours = formatOpeningHours(spot.openingHours);
  const isSelected = isSpotSelected(spot.id);
  
  // Debug: log the current state (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Current selected spots:', selectedSpots);
    console.log('Is this spot selected?', isSelected, 'Spot ID:', spot.id);
  }

  return (
    <>
      <div className="animated-bg"></div>
      <SakuraBackground />
      
      <div className="min-h-screen">
        {/* Spacer for global header */}
        <div style={{ height: '140px' }}></div>
        
        {/* Custom Navigation Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          margin: '0 20px 20px 20px',
          borderRadius: '20px',
          position: 'sticky',
          top: '100px',
          zIndex: 5
        }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => router.back()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'black',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '25px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </button>
              
              <div className="flex items-center space-x-4">
                <FavoriteButton spotId={spot.id} />
                <button
                  onClick={() => {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('Button clicked! Toggling spot:', spot.id);
                      console.log('Current selection state:', isSelected);
                    }
                    toggleSpot(spot);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: isSelected 
                      ? 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
                      : 'rgba(255, 255, 255, 0.2)',
                    color: isSelected ? 'white' : 'black',
                    backdropFilter: 'blur(10px)',
                    boxShadow: isSelected ? '0 8px 25px rgba(79, 172, 254, 0.3)' : '0 4px 15px rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    if (isSelected) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(79, 172, 254, 0.4)';
                    } else {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (isSelected) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.3)';
                    } else {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      ルートに追加済み
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      ルートに追加
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 lg:h-96" style={{ 
          margin: '0 20px 20px 20px',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
        {spot.images && spot.images.length > 0 ? (
          <img
            src={spot.images[0]}
            alt={spot.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Floating Info Card */}
        <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8">
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{
                    background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {getCategoryName(spot.category)}
                  </span>
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'black',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {getAreaName(spot.area)}
                  </span>
                </div>
                <h1 style={{
                  fontSize: 'clamp(24px, 5vw, 36px)',
                  fontWeight: '800',
                  color: 'black',
                  marginBottom: '12px',
                  textShadow: '0 2px 4px rgba(255, 255, 255, 0.3)'
                }}>
                  {spot.name}
                </h1>
                {spot.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium text-lg">{spot.rating}</span>
                    </div>
                    {spot.reviews && spot.reviews.length > 0 && (
                      <span className="text-gray-600">
                        ({spot.reviews.length} レビュー)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8" style={{ margin: '0 20px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: 'black', 
                marginBottom: '20px' 
              }}>概要</h2>
              <p style={{ 
                color: 'black', 
                fontSize: '16px', 
                lineHeight: '1.7',
                opacity: 0.8
              }}>
                {spot.description}
              </p>
            </div>

            {/* Tags */}
            {spot.tags && spot.tags.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '30px'
              }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: 'black', 
                  marginBottom: '20px' 
                }}>タグ</h2>
                <div className="flex flex-wrap gap-3">
                  {spot.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'black',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {spot.reviews && spot.reviews.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '30px'
              }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: 'black', 
                  marginBottom: '20px' 
                }}>レビュー</h2>
                <div className="space-y-4">
                  {spot.reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{review.userName}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: 'black', 
                marginBottom: '20px' 
              }}>基本情報</h3>
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 font-medium">住所</p>
                    <p className="text-gray-600 text-sm">{spot.location.address}</p>
                  </div>
                </div>

                {/* Opening Hours */}
                {openingHours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 font-medium">営業時間</p>
                      <p className="text-gray-600 text-sm">
                        今日({openingHours.todayName}): {openingHours.today}
                      </p>
                    </div>
                  </div>
                )}

                {/* Price Range */}
                {spot.priceRange && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                      <span className="text-gray-400">¥</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">価格帯</p>
                      <p className="text-gray-600 text-sm">
                        {spot.priceRange === 'budget' && '¥ (リーズナブル)'}
                        {spot.priceRange === 'moderate' && '¥¥ (普通)'}
                        {spot.priceRange === 'expensive' && '¥¥¥ (高め)'}
                        {spot.priceRange === 'luxury' && '¥¥¥¥ (高級)'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contact */}
                {spot.contact && (
                  <>
                    {spot.contact.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-900 font-medium">電話</p>
                          <a 
                            href={`tel:${spot.contact.phone}`}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            {spot.contact.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {spot.contact.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-900 font-medium">ウェブサイト</p>
                          <a 
                            href={spot.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline"
                          >
                            公式サイト
                          </a>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Map Placeholder */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: 'black', 
                marginBottom: '20px' 
              }}>地図</h3>
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">地図を読み込み中...</p>
                  <p className="text-xs text-gray-400 mt-1">
                    緯度: {spot.location.lat}<br />
                    経度: {spot.location.lng}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: 'black', 
                marginBottom: '20px' 
              }}>アクション</h3>
              <div className="space-y-4">
                <button
                  onClick={() => toggleSpot(spot)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px 20px',
                    borderRadius: '15px',
                    fontWeight: '700',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: isSelected 
                      ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                      : 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                    color: 'white',
                    boxShadow: isSelected 
                      ? '0 8px 25px rgba(67, 233, 123, 0.3)' 
                      : '0 8px 25px rgba(79, 172, 254, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = isSelected 
                      ? '0 12px 35px rgba(67, 233, 123, 0.4)' 
                      : '0 12px 35px rgba(79, 172, 254, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isSelected 
                      ? '0 8px 25px rgba(67, 233, 123, 0.3)' 
                      : '0 8px 25px rgba(79, 172, 254, 0.3)';
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      ルートに追加済み
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      ルートに追加
                    </>
                  )}
                </button>
                
                <Link
                  href={`/areas/${spot.area}`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px 20px',
                    borderRadius: '15px',
                    fontWeight: '600',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'black',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {getAreaName(spot.area)}の他のスポット
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}