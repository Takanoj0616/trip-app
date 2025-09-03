'use client';

import { StoryArea, StorySortOption } from '@/types/story';

interface ControlsProps {
  searchQuery: string;
  selectedArea: StoryArea;
  selectedSort: StorySortOption;
  onSearchChange: (query: string) => void;
  onAreaChange: (area: StoryArea) => void;
  onSortChange: (sort: StorySortOption) => void;
}

export default function StoriesControls({
  searchQuery,
  selectedArea,
  selectedSort,
  onSearchChange,
  onAreaChange,
  onSortChange
}: ControlsProps) {
  const areas: StoryArea[] = ['All', '東京', '京都', '大阪', '沖縄', '北海道'];
  const sortOptions: { value: StorySortOption; label: string }[] = [
    { value: 'newest', label: '新着順' },
    { value: 'popular', label: '人気順' },
    { value: 'likes', label: 'いいね数順' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <div 
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">旅行記を検索</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="タイトル、地域、タグで検索..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                aria-describedby="search-help"
              />
              <p id="search-help" className="sr-only">
                旅行記のタイトル、地域、タグから検索できます
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label htmlFor="area" className="sr-only">地域で絞り込み</label>
              <select 
                id="area"
                value={selectedArea}
                onChange={(e) => onAreaChange(e.target.value as StoryArea)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                aria-label="地域で絞り込み"
              >
                <option value="All">すべての地域</option>
                {areas.slice(1).map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort" className="sr-only">並び替え</label>
              <select 
                id="sort"
                value={selectedSort}
                onChange={(e) => onSortChange(e.target.value as StorySortOption)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                aria-label="並び替え"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}