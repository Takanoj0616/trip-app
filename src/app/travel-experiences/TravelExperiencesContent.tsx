'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Filter, MapPin, Calendar, Eye, Heart } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { TravelPost, TravelPostsResponse, SearchFilters, REGIONS, CATEGORIES } from '@/types/travel'
import TravelPostCard from './components/TravelPostCard'
import SearchBar from './components/SearchBar'
import FilterPills from './components/FilterPills'
import CreatePostModal from './components/CreatePostModal'
import Pagination from './components/Pagination'

export default function TravelExperiencesContent() {
  const { t } = useLanguage()
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
    <div className="container mx-auto px-4 py-8" style={{ paddingTop: '200px' }}>
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
          {t('travel.title')}
        </h1>
        <p className="text-xl text-white/90 mb-8 drop-shadow-md">
          {t('travel.subtitle')}
        </p>
        
        {/* 投稿ボタン */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-6 h-6 mr-2" />
          {t('travel.postNew')}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="bg-white/30 h-48 rounded-lg mb-4"></div>
              <div className="bg-white/30 h-4 rounded mb-2"></div>
              <div className="bg-white/30 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="glass-card p-12 max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {t('travel.empty.title')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('travel.empty.desc')}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('travel.empty.cta')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="travel-cards-grid max-w-7xl mx-auto mb-12">
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
