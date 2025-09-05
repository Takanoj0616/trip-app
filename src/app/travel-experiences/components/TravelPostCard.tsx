'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Calendar, Eye, Heart, Tag } from 'lucide-react'
import { TravelPost } from '@/types/travel'

interface TravelPostCardProps {
  post: TravelPost
  index: number
}

export default function TravelPostCard({ post, index }: TravelPostCardProps) {
  const [imageError, setImageError] = useState(false)
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div 
      className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* 画像エリア */}
      <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
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
              {post.category}
            </span>
          </div>
        )}
        
        {/* 地域バッジ */}
        {post.region && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              <MapPin className="w-3 h-3 mr-1 inline" />
              {post.region}
            </span>
          </div>
        )}
      </div>

      {/* コンテンツエリア */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {truncateText(post.excerpt || post.content, 100)}
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
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{post.tags.length - 3} more
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
