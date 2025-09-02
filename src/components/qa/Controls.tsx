'use client';

import { Category, SortOption } from '@/types/qa';

interface ControlsProps {
  searchQuery: string;
  selectedCategory: Category;
  selectedSort: SortOption;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: Category) => void;
  onSortChange: (sort: SortOption) => void;
}

export default function Controls({
  searchQuery,
  selectedCategory,
  selectedSort,
  onSearchChange,
  onCategoryChange,
  onSortChange
}: ControlsProps) {
  const categories: Category[] = ['All', 'アクセス', 'グルメ', 'ホテル', '文化', '旅程'];
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: '新着順' },
    { value: 'views', label: '閲覧数順' },
    { value: 'votes', label: '投票順' }
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
            <label htmlFor="search" className="sr-only">質問を検索</label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="タイトル、内容、タグで検索..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500"
              aria-describedby="search-help"
            />
            <p id="search-help" className="sr-only">
              質問のタイトル、内容、タグから検索できます
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label htmlFor="category" className="sr-only">カテゴリーで絞り込み</label>
              <select 
                id="category"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value as Category)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                aria-label="カテゴリーで絞り込み"
              >
                <option value="All">すべてのカテゴリー</option>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort" className="sr-only">並び替え</label>
              <select 
                id="sort"
                value={selectedSort}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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