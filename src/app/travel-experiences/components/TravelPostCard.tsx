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
      className="travel-card animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* 画像エリア */}
      <div className="travel-card-image" style={{
        backgroundImage: post.images.length > 0 && !imageError 
          ? `url(${post.images[0]})` 
          : undefined
      }}>
        {(!post.images.length || imageError) && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <MapPin className="w-12 h-12" />
          </div>
        )}
        
        {/* カテゴリバッジ */}
        {post.category && (
          <div className="travel-card-badge">
            {mapLabel(post.category) || post.category}
          </div>
        )}
        
        {/* 地域バッジ */}
        {post.region && (
          <div className="travel-card-region">
            <MapPin className="w-3 h-3" />
            {mapLabel(post.region) || post.region}
          </div>
        )}
      </div>

      {/* コンテンツエリア */}
      <div className="travel-card-content">
        <h3 className="travel-card-title">
          {localizeTitle(post.title)}
        </h3>
        
        <p className="travel-card-excerpt">
          {localizeExcerpt(post.excerpt || post.content)}
        </p>

        {/* タグ */}
        {post.tags.length > 0 && (
          <div className="travel-card-tags">
            {post.tags.slice(0, 3).map((tag, tagIndex) => (
              <span key={tagIndex} className="travel-card-tag">
                <Tag className="w-3 h-3" />
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
        <div className="travel-card-meta">
          <div className="travel-card-stats">
            <div className="travel-card-stat">
              <Eye className="w-4 h-4" />
              {post.viewCount}
            </div>
            <div className="travel-card-stat">
              <Heart className="w-4 h-4" />
              {post.likeCount}
            </div>
          </div>
          <div className="travel-card-date">
            <Calendar className="w-4 h-4" />
            {formatDate(post.createdAt)}
          </div>
        </div>

        {/* 投稿者 */}
        <div className="travel-card-author">
          by <span>{post.author}</span>
        </div>
      </div>
    </div>
  )
}
