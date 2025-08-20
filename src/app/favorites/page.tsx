'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Heart, Filter, Search, Grid, List } from 'lucide-react';
import Link from 'next/link';
import SpotCard from '@/components/SpotCard';
import { TouristSpot } from '@/types';

// Sample data for demonstration
const sampleSpots: TouristSpot[] = [
  {
    id: '1',
    name: '東京タワー',
    description: '東京の象徴的なタワーで、美しい夜景を楽しめます',
    category: 'sightseeing',
    area: 'tokyo',
    location: {
      lat: 35.6586,
      lng: 139.7454,
      address: '東京都港区芝公園4-2-8'
    },
    rating: 4.2,
    images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop'],
    openingHours: {
      monday: '9:00-23:00',
      tuesday: '9:00-23:00',
      wednesday: '9:00-23:00',
      thursday: '9:00-23:00',
      friday: '9:00-23:00',
      saturday: '9:00-23:00',
      sunday: '9:00-23:00'
    },
    priceRange: 'moderate',
    tags: ['夜景', '観光', '展望台'],
    reviews: [
      {
        id: '1',
        userId: '1',
        userName: '田中太郎',
        rating: 4,
        comment: '素晴らしい景色でした！',
        date: '2024-01-15'
      }
    ]
  },
  {
    id: '2',
    name: '浅草寺',
    description: '東京最古の寺院として知られる歴史ある場所',
    category: 'sightseeing',
    area: 'tokyo',
    location: {
      lat: 35.7148,
      lng: 139.7967,
      address: '東京都台東区浅草2-3-1'
    },
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1570611043142-e94640cdc5e5?w=500&h=300&fit=crop'],
    openingHours: {
      monday: '6:00-17:00',
      tuesday: '6:00-17:00',
      wednesday: '6:00-17:00',
      thursday: '6:00-17:00',
      friday: '6:00-17:00',
      saturday: '6:00-17:00',
      sunday: '6:00-17:00'
    },
    priceRange: 'budget',
    tags: ['歴史', '寺院', '文化'],
    reviews: []
  }
];

export default function FavoritesPage() {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const { favorites, loading } = useFavorites();
  const [favoriteSpots, setFavoriteSpots] = useState<TouristSpot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // In a real app, you would fetch the actual spots from Firebase/API
    // For demo purposes, we'll filter sample spots by favorites
    const filteredSpots = sampleSpots.filter(spot => favorites.includes(spot.id));
    setFavoriteSpots(filteredSpots);
  }, [favorites]);

  const filteredSpots = favoriteSpots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spot.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || spot.category === selectedCategory;
    const matchesArea = !selectedArea || spot.area === selectedArea;
    
    return matchesSearch && matchesCategory && matchesArea;
  });

  if (!user) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ログインが必要です
        </h1>
        <p className="text-gray-600 mb-8">
          お気に入りを管理するにはログインしてください
        </p>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          ログイン
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('navigation.favorites')}
        </h1>
        <p className="text-gray-600">
          あなたがお気に入りに追加したスポットを管理
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="スポットを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">すべてのカテゴリ</option>
            <option value="sightseeing">{t('categories.sightseeing')}</option>
            <option value="restaurants">{t('categories.restaurants')}</option>
            <option value="hotels">{t('categories.hotels')}</option>
            <option value="entertainment">{t('categories.entertainment')}</option>
            <option value="shopping">{t('categories.shopping')}</option>
          </select>

          {/* Area Filter */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">すべてのエリア</option>
            <option value="tokyo">{t('areas.tokyo')}</option>
            <option value="yokohama">{t('areas.yokohama')}</option>
            <option value="saitama">{t('areas.saitama')}</option>
            <option value="chiba">{t('areas.chiba')}</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">{t('common.loading')}</p>
        </div>
      ) : filteredSpots.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {favorites.length === 0 ? 'お気に入りがありません' : '検索結果がありません'}
          </h2>
          <p className="text-gray-600 mb-8">
            {favorites.length === 0 
              ? 'スポットを探してお気に入りに追加してみましょう'
              : '検索条件を変更してもう一度お試しください'
            }
          </p>
          {favorites.length === 0 && (
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              スポットを探す
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredSpots.length} 件のお気に入りスポット
            </p>
          </div>

          {/* Spots Grid/List */}
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                showArea={true}
                className={viewMode === 'list' ? 'flex-row' : ''}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}