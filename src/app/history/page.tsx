'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckIn } from '@/contexts/CheckInContext';
import { MapPin, Calendar, Camera, Globe, Lock, Filter, Search, Clock, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const { checkIns, removeCheckIn, loading } = useCheckIn();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const filteredCheckIns = useMemo(() => {
    let filtered = checkIns;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(checkIn =>
        checkIn.spotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (checkIn.note && checkIn.note.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by area
    if (selectedArea) {
      filtered = filtered.filter(checkIn => checkIn.spotArea === selectedArea);
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(checkIn => checkIn.spotCategory === selectedCategory);
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(checkIn => checkIn.timestamp >= cutoffDate);
    }

    return filtered;
  }, [checkIns, searchQuery, selectedArea, selectedCategory, dateRange]);

  const handleDeleteCheckIn = async (checkInId: string) => {
    try {
      await removeCheckIn(checkInId);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting check-in:', error);
      alert('チェックインの削除に失敗しました');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAreaName = (area: string) => {
    return t(`areas.${area}`);
  };

  const getCategoryName = (category: string) => {
    return t(`categories.${category}`);
  };

  // Statistics
  const stats = useMemo(() => {
    const uniqueSpots = new Set(checkIns.map(c => c.spotId)).size;
    const areaCount = new Set(checkIns.map(c => c.spotArea)).size;
    const categoryCount = new Set(checkIns.map(c => c.spotCategory)).size;
    
    return {
      totalCheckIns: checkIns.length,
      uniqueSpots,
      areaCount,
      categoryCount
    };
  }, [checkIns]);

  if (!user) {
    return (
      <div className="text-center py-16">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ログインが必要です
        </h1>
        <p className="text-gray-600 mb-8">
          チェックイン履歴を確認するにはログインしてください
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
        <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          チェックイン履歴
        </h1>
        <p className="text-gray-600">
          あなたが訪れたスポットの記録
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {stats.totalCheckIns}
          </div>
          <div className="text-sm text-gray-600">総チェックイン数</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {stats.uniqueSpots}
          </div>
          <div className="text-sm text-gray-600">訪問スポット数</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {stats.areaCount}
          </div>
          <div className="text-sm text-gray-600">訪問エリア数</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {stats.categoryCount}
          </div>
          <div className="text-sm text-gray-600">カテゴリ数</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">フィルター</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="スポットを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Area Filter */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">すべてのエリア</option>
            <option value="tokyo">{t('areas.tokyo')}</option>
            <option value="yokohama">{t('areas.yokohama')}</option>
            <option value="saitama">{t('areas.saitama')}</option>
            <option value="chiba">{t('areas.chiba')}</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">すべてのカテゴリ</option>
            <option value="sightseeing">{t('categories.sightseeing')}</option>
            <option value="restaurants">{t('categories.restaurants')}</option>
            <option value="hotels">{t('categories.hotels')}</option>
            <option value="entertainment">{t('categories.entertainment')}</option>
            <option value="shopping">{t('categories.shopping')}</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">すべての期間</option>
            <option value="week">過去1週間</option>
            <option value="month">過去1ヶ月</option>
            <option value="year">過去1年</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">{t('common.loading')}</p>
        </div>
      ) : filteredCheckIns.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {checkIns.length === 0 ? 'チェックイン履歴がありません' : '検索結果がありません'}
          </h2>
          <p className="text-gray-600 mb-8">
            {checkIns.length === 0 
              ? 'スポットにチェックインして履歴を作成しましょう'
              : '検索条件を変更してもう一度お試しください'
            }
          </p>
          {checkIns.length === 0 && (
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
              {filteredCheckIns.length} 件のチェックイン
            </p>
          </div>

          {/* Check-ins List */}
          <div className="space-y-4">
            {filteredCheckIns.map((checkIn) => (
              <div key={checkIn.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        href={`/spots/${checkIn.spotId}`}
                        className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {checkIn.spotName}
                      </Link>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {getCategoryName(checkIn.spotCategory)}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {getAreaName(checkIn.spotArea)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(checkIn.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {checkIn.isPublic ? (
                          <>
                            <Globe className="w-4 h-4" />
                            <span>公開</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>非公開</span>
                          </>
                        )}
                      </div>
                      {checkIn.photos && checkIn.photos.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Camera className="w-4 h-4" />
                          <span>{checkIn.photos.length}枚の写真</span>
                        </div>
                      )}
                    </div>

                    {checkIn.note && (
                      <p className="text-gray-700 mb-3">
                        {checkIn.note}
                      </p>
                    )}

                    {checkIn.photos && checkIn.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {checkIn.photos.map((photo, index) => (
                          <div key={index} className="aspect-square overflow-hidden rounded-lg">
                            <img
                              src={photo}
                              alt={`Check-in photo ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                              onClick={() => window.open(photo, '_blank')}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteModal(checkIn.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="チェックインを削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              チェックインを削除
            </h3>
            <p className="text-gray-600 mb-6">
              このチェックインを削除してもよろしいですか？この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDeleteCheckIn(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}