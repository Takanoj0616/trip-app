'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Calendar, Eye, Heart, Tag } from 'lucide-react'
import { TravelPost } from '@/types/travel'
import { useLanguage } from '@/contexts/LanguageContext'

interface TravelPostCardProps {
  post: TravelPost
  index: number
}

export default function TravelPostCard({ post, index }: TravelPostCardProps) {
  const { t, currentLanguage } = useLanguage() as any
  const [imageError, setImageError] = useState(false)
  
  const formatDate = (dateString: string) => {
    const locale = currentLanguage === 'ja' ? 'ja-JP' : currentLanguage === 'ko' ? 'ko-KR' : currentLanguage === 'fr' ? 'fr-FR' : 'en-US'
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // i18n mapping for mock data
  const REGION_KEYS: Record<string, string> = {
    '北海道': 'regions.hokkaido',
    '東北': 'regions.tohoku',
    '関東': 'regions.kanto',
    '中部': 'regions.chubu',
    '関西': 'regions.kansai',
    '中国': 'regions.chugoku',
    '四国': 'regions.shikoku',
    '九州・沖縄': 'regions.kyushu_okinawa',
  }
  const CATEGORY_KEYS: Record<string, string> = {
    'グルメ': 'categories.gourmet',
    '歴史・文化': 'categories.history_culture',
    '自然': 'categories.nature',
    'アニメ・聖地': 'categories.anime_pilgrimage',
    'アクティビティ': 'categories.activity',
    'ショッピング': 'categories.shopping',
    '温泉': 'categories.onsen',
    'その他': 'categories.other',
  }
  const TAG_KEYS: Record<string, string> = {
    '寺社': 'tag.temple',
    '自然': 'tag.nature',
    '買い物': 'tag.shopping',
  }

  const mapLabel = (value?: string | null) => (value ? t((REGION_KEYS[value] || CATEGORY_KEYS[value] || TAG_KEYS[value]) || value) : value)

  const localizeTitle = (title: string) => {
    if (title.includes('広島の平和記念公園')) return t('travel.sample.title.hiroshima')
    if (title.includes('兼六園') || title.includes('近江町市場')) return t('travel.sample.title.kanazawa')
    if (title.includes('聖地巡礼') || title.includes('秩父')) return t('travel.sample.title.anohana')
    return title
  }

  const localizeExcerpt = (text: string) => (text.startsWith('ダミーの旅行記本文です') ? t('travel.sample.excerpt') : text)

  return (
    <div 
      className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* 画像エリア */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
        {post.images.length > 0 && !imageError ? (
          <Image
            src={post.images[0]}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-primary-400">
            <MapPin className="w-12 h-12" />
          </div>
        )}
        
        {/* カテゴリバッジ */}
        {post.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              {mapLabel(post.category) || post.category}
            </span>
          </div>
        )}
        
        {/* 地域バッジ */}
        {post.region && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              <MapPin className="w-3 h-3 mr-1 inline" />
              {mapLabel(post.region) || post.region}
            </span>
          </div>
        )}
      </div>

      {/* コンテンツエリア */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {localizeTitle(post.title)}
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {truncateText(localizeExcerpt(post.excerpt || post.content), 100)}
        </p>

        {/* タグ */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                <Tag className="w-3 h-3 mr-1" />
                {mapLabel(tag) || tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{post.tags.length - 3} {t('common.more')}
              </span>
            )}
          </div>
        )}

        {/* メタ情報 */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {post.viewCount}
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {post.likeCount}
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(post.createdAt)}
          </div>
        </div>

        {/* 投稿者 */}
        <div className="mt-3 text-sm text-gray-600">
          by <span className="font-medium text-primary-600">{post.author}</span>
        </div>
      </div>
    </div>
  )
}
