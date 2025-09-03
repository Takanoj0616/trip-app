'use client';

import { Category, SortOption } from '@/types/qa';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { currentLanguage } = useLanguage();
  const i18n = {
    ja: {
      searchLabel: '質問を検索',
      placeholder: 'タイトル、内容、タグで検索...',
      searchHelp: '質問のタイトル、内容、タグから検索できます',
      catAll: 'すべてのカテゴリー',
      categoryAria: 'カテゴリーで絞り込み',
      sortAria: '並び替え',
      sort: { newest: '新着順', views: '閲覧数順', votes: '投票順' },
      categories: ['All', 'アクセス', 'グルメ', 'ホテル', '文化', '旅程'] as Category[],
    },
    en: {
      searchLabel: 'Search questions',
      placeholder: 'Search by title, content, or tags...',
      searchHelp: 'You can search by title, content, and tags',
      catAll: 'All categories',
      categoryAria: 'Filter by category',
      sortAria: 'Sort by',
      sort: { newest: 'Newest', views: 'Views', votes: 'Votes' },
      // Underlying values remain Japanese for matching data, display labels are localized
      categories: ['All', 'アクセス', 'グルメ', 'ホテル', '文化', '旅程'] as Category[],
    },
    ko: {
      searchLabel: '질문 검색',
      placeholder: '제목, 내용, 태그로 검색...',
      searchHelp: '제목, 내용, 태그로 검색할 수 있어요',
      catAll: '모든 카테고리',
      categoryAria: '카테고리로 필터링',
      sortAria: '정렬',
      sort: { newest: '최신순', views: '조회수순', votes: '투표순' },
      categories: ['All', 'アクセス', 'グルメ', 'ホテル', '文化', '旅程'] as Category[],
    },
    fr: {
      searchLabel: 'Rechercher des questions',
      placeholder: 'Recherche par titre, contenu ou tags...',
      searchHelp: 'Vous pouvez rechercher par titre, contenu et tags',
      catAll: 'Toutes les catégories',
      categoryAria: 'Filtrer par catégorie',
      sortAria: 'Trier par',
      sort: { newest: 'Plus récent', views: 'Vues', votes: 'Votes' },
      categories: ['All', 'アクセス', 'グルメ', 'ホテル', '文化', '旅程'] as Category[],
    },
  } as const;
  const tr = (i18n as any)[currentLanguage] || (i18n as any).ja;
  const categories: Category[] = tr.categories;
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: tr.sort.newest },
    { value: 'views', label: tr.sort.views },
    { value: 'votes', label: tr.sort.votes }
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
            <label htmlFor="search" className="sr-only">{tr.searchLabel}</label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={tr.placeholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500"
              aria-describedby="search-help"
            />
            <p id="search-help" className="sr-only">
              {tr.searchHelp}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label htmlFor="category" className="sr-only">{tr.categoryAria}</label>
              <select 
                id="category"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value as Category)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                aria-label={tr.categoryAria}
              >
                <option value="All">{tr.catAll}</option>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort" className="sr-only">{tr.sortAria}</label>
              <select 
                id="sort"
                value={selectedSort}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                aria-label={tr.sortAria}
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
