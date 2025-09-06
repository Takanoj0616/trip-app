'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, SortAsc, SortDesc, Calendar, Eye, Heart } from 'lucide-react'
import { SortBy, SortOrder } from '@/types/travel'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSortChange: (sortBy: SortBy, order: SortOrder) => void
  currentSort: SortBy
  currentOrder: SortOrder
}

export default function SearchBar({
  value,
  onChange,
  onSortChange,
  currentSort,
  currentOrder
}: SearchBarProps) {
  const [showSortMenu, setShowSortMenu] = useState(false)
  const { t } = useLanguage()

  const sortOptions = [
    { value: 'createdAt', label: t('travel.sort.createdAt'), icon: Calendar },
    { value: 'viewCount', label: t('travel.sort.viewCount'), icon: Eye },
    { value: 'likeCount', label: t('travel.sort.likeCount'), icon: Heart },
  ]

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === currentSort)
    return option?.label || '投稿日時'
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* 検索バー */}
      <div className="relative flex-1">
        <div className="glass-card">
          <div className="flex items-center px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* ソート */}
      <div className="relative">
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="glass-card px-4 py-3 flex items-center space-x-2 text-gray-700 hover:bg-white/40 transition-colors w-full sm:w-auto"
        >
          {currentOrder === 'desc' ? (
            <SortDesc className="w-5 h-5" />
          ) : (
            <SortAsc className="w-5 h-5" />
          )}
          <span className="whitespace-nowrap">{getCurrentSortLabel()}</span>
        </button>

        {/* ソートメニュー */}
        {showSortMenu && (
          <div className="absolute top-full right-0 mt-2 glass-card shadow-lg z-20 min-w-48">
            {sortOptions.map((option) => (
              <div key={option.value} className="border-b border-white/20 last:border-b-0">
                <button
                  onClick={() => {
                    onSortChange(option.value as SortBy, 'desc')
                    setShowSortMenu(false)
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-white/20 transition-colors ${
                    currentSort === option.value && currentOrder === 'desc'
                      ? 'bg-white/30 text-primary-600'
                      : 'text-gray-700'
                  }`}
                >
                  <option.icon className="w-4 h-4 mr-3" />
                  <span className="flex-1">{option.label}</span>
                  <SortDesc className="w-4 h-4 ml-2" />
                </button>
                <button
                  onClick={() => {
                    onSortChange(option.value as SortBy, 'asc')
                    setShowSortMenu(false)
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-white/20 transition-colors ${
                    currentSort === option.value && currentOrder === 'asc'
                      ? 'bg-white/30 text-primary-600'
                      : 'text-gray-700'
                  }`}
                >
                  <option.icon className="w-4 h-4 mr-3" />
                  <span className="flex-1">{option.label}</span>
                  <SortAsc className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
