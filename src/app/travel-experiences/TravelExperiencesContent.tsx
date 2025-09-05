'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Filter, MapPin, Calendar, Eye, Heart } from 'lucide-react'
import { TravelPost, TravelPostsResponse, SearchFilters, REGIONS, CATEGORIES } from '@/types/travel'
import TravelPostCard from './components/TravelPostCard'
import SearchBar from './components/SearchBar'
import FilterPills from './components/FilterPills'
import CreatePostModal from './components/CreatePostModal'
import Pagination from './components/Pagination'

export default function TravelExperiencesContent() {
  const [posts, setPosts] = useState<TravelPost[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    region: '',
    category: '',
    sortBy: 'createdAt',
    order: 'desc',
  })
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.region) params.set('region', filters.region)
      if (filters.category) params.set('category', filters.category)
      params.set('sortBy', filters.sortBy)
      params.set('order', filters.order)
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())

      const response = await fetch(`/api/travel-posts?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data: TravelPostsResponse = await response.json()
      setPosts(data.posts)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [filters, pagination.page])

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPagination(prev => ({ ...prev, page: 1 })) // フィルター変更時はページを1に戻す
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handlePostCreated = (newPost: TravelPost) => {
    setPosts(prev => [newPost, ...prev])
    setShowCreateModal(false)
    // 新規投稿後はフィルターをリセットして最新順で表示
    setFilters({
      search: '',
      region: '',
      category: '',
      sortBy: 'createdAt',
      order: 'desc',
    })
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-16">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
          旅の記録
        </h1>
        <p className="text-xl text-white/90 mb-8 drop-shadow-md">
          あなたの旅の体験を共有し、新しい発見を見つけよう
        </p>
        
        {/* 投稿ボタン */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-lg px-8 py-3 rounded-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <Plus className="w-6 h-6 mr-2 inline text-white" />
          新しい旅行記を投稿
        </button>
      </div>

      {/* 検索・フィルター */}
      <div className="max-w-4xl mx-auto mb-12">
        <SearchBar
          value={filters.search}
          onChange={(search) => handleFilterChange({ search })}
          onSortChange={(sortBy, order) => handleFilterChange({ sortBy, order })}
          currentSort={filters.sortBy}
          currentOrder={filters.order}
        />
        
        <FilterPills
          selectedRegion={filters.region}
          selectedCategory={filters.category}
          onRegionChange={(region) => handleFilterChange({ region })}
          onCategoryChange={(category) => handleFilterChange({ category })}
        />
      </div>

      {/* 投稿一覧 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card animate-pulse">
              <div className="bg-white/30 h-56 rounded-t-2xl mb-4"></div>
              <div className="p-6">
                <div className="bg-white/30 h-6 rounded mb-3"></div>
                <div className="bg-white/30 h-4 rounded mb-2"></div>
                <div className="bg-white/30 h-4 rounded w-3/4 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="bg-white/30 h-6 w-16 rounded-full"></div>
                  <div className="bg-white/30 h-6 w-20 rounded-full"></div>
                </div>
                <div className="bg-white/30 h-4 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="glass-card p-12 max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              まだ投稿がありません
            </h3>
            <p className="text-gray-600 mb-6">
              最初の旅行記を投稿してみませんか？
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              投稿する
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="posts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
            {posts.map((post, index) => (
              <TravelPostCard
                key={post.id}
                post={post}
                index={index}
              />
            ))}
          </div>
          
          {/* ページネーション */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* 投稿作成モーダル */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  )
}
