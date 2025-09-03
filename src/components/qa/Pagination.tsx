'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

import { useLanguage } from '@/contexts/LanguageContext';

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { currentLanguage } = useLanguage();
  const i18n = {
    ja: { prev: '前へ', next: '次へ', aria: 'ページネーション' },
    en: { prev: 'Prev', next: 'Next', aria: 'Pagination' },
    ko: { prev: '이전', next: '다음', aria: '페이지네이션' },
    fr: { prev: 'Préc.', next: 'Suiv.', aria: 'Pagination' },
  } as const;
  const tr = (i18n as any)[currentLanguage] || (i18n as any).ja;
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center mt-12" aria-label={tr.aria}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={tr.prev}
        >
          {tr.prev}
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                page === currentPage
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              aria-label={`${page}ページ目`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={tr.next}
        >
          {tr.next}
        </button>
      </div>
    </nav>
  );
}
