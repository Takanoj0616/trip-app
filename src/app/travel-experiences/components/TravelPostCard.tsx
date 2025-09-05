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
      className="group animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* ガラス調カードコンテナ */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/40 bg-white/20 backdrop-blur-lg hover:bg-white/25 hover:border-white/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
        
        {/* 画像セクション */}
        <div className="relative h-56 w-full overflow-hidden">
          {post.images.length > 0 && !imageError ? (
            <Image
              src={post.images[0]}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              onError={() => setImageError(true)}
              priority={index < 3}
            />
          ) : (
            <div className="h-full w-full bg-orange-200/80 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-orange-600" />
            </div>
          )}
          
          {/* 画像上のグラデーション */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* バッジ群（画像上部） */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            {post.category && (
              <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-orange-500 text-white shadow-xl">
                {post.category}
              </span>
            )}
            {post.region && (
              <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white/95 text-gray-800 shadow-xl flex items-center ml-2">
                <MapPin className="w-3 h-3 mr-1" />{post.region}
              </span>
            )}
          </div>
        </div>

        {/* コンテンツセクション */}
        <div className="p-6 bg-white/25 backdrop-blur-sm border-t border-white/30">
          {/* タイトル */}
          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
            {post.title}
          </h3>
          
          {/* 説明文 */}
          <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-3">
            {truncateText(post.excerpt || post.content, 120)}
          </p>

          {/* タグ */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, tagIndex) => (
                <span 
                  key={tagIndex} 
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800/80 text-white shadow-md flex items-center"
                >
                  <Tag className="w-3 h-3 mr-1" />{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-600 px-2 py-1 font-medium">+{post.tags.length - 3} more</span>
              )}
            </div>
          )}

          {/* メタ情報とアクション */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-white/40">
            <div className="flex items-center space-x-4">
              <div className="flex items-center font-medium">
                <Eye className="w-4 h-4 mr-1 text-gray-500" />
                <span>{post.viewCount}</span>
              </div>
              <div className="flex items-center font-medium">
                <Heart className="w-4 h-4 mr-1 text-red-500" />
                <span>{post.likeCount}</span>
              </div>
            </div>
            <div className="flex items-center font-medium text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {/* 投稿者情報 */}
          <div className="mt-3 pt-3 border-t border-white/30">
            <div className="text-sm text-gray-600">
              by <span className="font-bold text-gray-800">{post.author}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
