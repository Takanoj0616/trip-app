'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, ExternalLink } from 'lucide-react';
import { TouristSpot } from '@/types';
import FavoriteButton from './FavoriteButton';
import { useLanguage } from '@/contexts/LanguageContext';

interface SpotCardProps {
  spot: TouristSpot;
  showArea?: boolean;
  className?: string;
  style?: React.CSSProperties;
  isSelectable?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (spot: TouristSpot) => void;
}

const SpotCard: React.FC<SpotCardProps> = ({ 
  spot, 
  showArea = true, 
  className = '',
  style = {},
  isSelectable = false,
  isSelected = false,
  onToggleSelection 
}) => {
  const { currentLanguage, t } = useLanguage();

  const getAreaName = (area: string) => {
    const areaNames = {
      ja: { tokyo: '東京', yokohama: '横浜', saitama: '埼玉', chiba: '千葉' },
      en: { tokyo: 'Tokyo', yokohama: 'Yokohama', saitama: 'Saitama', chiba: 'Chiba' },
      ko: { tokyo: '도쿄', yokohama: '요코하마', saitama: '사이타마', chiba: '치바' }
    };
    return areaNames[currentLanguage]?.[area] || area;
  };

  const getCategoryName = (category: string) => {
    const categoryNames = {
      ja: {
        sightseeing: '観光・名所',
        restaurants: 'グルメ・レストラン', 
        hotels: 'ホテル・宿泊',
        entertainment: 'エンターテイメント',
        shopping: 'ショッピング'
      },
      en: {
        sightseeing: 'Sightseeing',
        restaurants: 'Restaurants',
        hotels: 'Hotels', 
        entertainment: 'Entertainment',
        shopping: 'Shopping'
      },
      ko: {
        sightseeing: '관광',
        restaurants: '레스토랑',
        hotels: '호텔',
        entertainment: '엔터테인먼트', 
        shopping: '쇼핑'
      }
    };
    return categoryNames[currentLanguage]?.[category] || category;
  };

  const formatOpeningHours = (openingHours?: any) => {
    if (!openingHours) return null;
    
    const today = new Date().getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = days[today] as keyof typeof openingHours;
    
    const unknownHours = {
      ja: '営業時間不明',
      en: 'Hours Unknown',
      ko: '영업시간 불명'
    };
    
    return openingHours[todayKey] || unknownHours[currentLanguage] || unknownHours.en;
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group ${className} ${isSelected ? 'ring-2 ring-blue-500 shadow-blue-100' : ''}`}
      style={style}
    >
      <Link href={`/spots/${spot.id}`}>
        <div className="relative">
          {/* Image */}
          <div className="aspect-video bg-gray-200 overflow-hidden">
            {spot.images && spot.images.length > 0 ? (
              <img
                src={spot.images[0]}
                alt={spot.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            {isSelectable && onToggleSelection && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleSelection(spot);
                }}
                className={`p-2 rounded-full shadow-sm transition-all ${
                  isSelected 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white bg-opacity-90 text-gray-600 hover:bg-opacity-100'
                }`}
                title={isSelected 
                  ? (currentLanguage === 'en' ? 'Remove from Route' : currentLanguage === 'ko' ? '루트에서 제외' : 'ルートから除外')
                  : (currentLanguage === 'en' ? 'Add to Route' : currentLanguage === 'ko' ? '루트에 추가' : 'ルートに追加')
                }
              >
                {isSelected ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </button>
            )}
            <FavoriteButton 
              spotId={spot.id} 
              className="bg-white bg-opacity-90 p-2 rounded-full shadow-sm hover:bg-opacity-100"
            />
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {getCategoryName(spot.category)}
            </span>
          </div>

          {/* Area Badge (if enabled) */}
          {showArea && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {getAreaName(spot.area)}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <Link href={`/spots/${spot.id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {spot.name}
          </h3>
        </Link>

        {/* Rating */}
        {spot.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1">{spot.rating}</span>
            </div>
            {spot.reviews && (
              <span className="text-sm text-gray-500">
                ({spot.reviews.length} {currentLanguage === 'en' ? 'reviews' : currentLanguage === 'ko' ? '리뷰' : 'レビュー'})
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {spot.description}
        </p>

        {/* Location */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-1">
            {spot.location.address}
          </span>
        </div>

        {/* Opening Hours */}
        {spot.openingHours && (
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {formatOpeningHours(spot.openingHours)}
            </span>
          </div>
        )}

        {/* Price Range */}
        {spot.priceRange && (
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700">
              {currentLanguage === 'en' ? 'Price: ' : currentLanguage === 'ko' ? '가격: ' : '価格帯: '}
              {spot.priceRange === 'budget' && '¥'}
              {spot.priceRange === 'moderate' && '¥¥'}
              {spot.priceRange === 'expensive' && '¥¥¥'}
              {spot.priceRange === 'luxury' && '¥¥¥¥'}
            </span>
          </div>
        )}

        {/* Tags */}
        {spot.tags && spot.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {spot.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
            {spot.tags.length > 3 && (
              <span className="text-gray-400 text-xs">
                +{spot.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={`/spots/${spot.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            {currentLanguage === 'en' ? 'View Details' : currentLanguage === 'ko' ? '자세히 보기' : '詳細を見る'}
          </Link>
          
          {spot.contact?.website && (
            <a
              href={spot.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
              {currentLanguage === 'en' ? 'Website' : currentLanguage === 'ko' ? '웹사이트' : 'サイト'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotCard;