'use client';

interface EmptyStateProps {
  searchQuery?: string;
  category?: string;
}

import { useLanguage } from '@/contexts/LanguageContext';

export default function EmptyState({ searchQuery, category }: EmptyStateProps) {
  const { currentLanguage } = useLanguage();
  const i18n = {
    ja: {
      notFound: (q?: string, c?: string) => q && c && c !== 'All' ? `「${q}」に関する「${c}」カテゴリの質問が見つかりませんでした` : q ? `「${q}」に関する質問が見つかりませんでした` : c && c !== 'All' ? `「${c}」カテゴリの質問が見つかりませんでした` : '質問がまだありません',
      suggestion: (hasFilter: boolean) => hasFilter ? '検索条件を変更して再度お試しください' : '最初の質問を投稿してみませんか？',
      post: '質問を投稿する',
    },
    en: {
      notFound: (q?: string, c?: string) => q && c && c !== 'All' ? `No questions found for “${q}” in category “${c}”.` : q ? `No questions found for “${q}”.` : c && c !== 'All' ? `No questions found in category “${c}”.` : 'No questions yet.',
      suggestion: (hasFilter: boolean) => hasFilter ? 'Try changing your search filters and try again.' : 'Be the first to ask a question!',
      post: 'Post a Question',
    },
    ko: {
      notFound: (q?: string, c?: string) => q && c && c !== 'All' ? `"${q}" 관련 "${c}" 카테고리의 질문을 찾을 수 없어요.` : q ? `"${q}" 관련 질문을 찾을 수 없어요.` : c && c !== 'All' ? `"${c}" 카테고리의 질문을 찾을 수 없어요.` : '아직 질문이 없습니다.',
      suggestion: (hasFilter: boolean) => hasFilter ? '검색 조건을 바꿔 다시 시도해 보세요.' : '첫 번째로 질문해 보세요!',
      post: '질문 올리기',
    },
    fr: {
      notFound: (q?: string, c?: string) => q && c && c !== 'All' ? `Aucune question trouvée pour « ${q} » dans la catégorie « ${c} ».` : q ? `Aucune question trouvée pour « ${q} ».` : c && c !== 'All' ? `Aucune question trouvée dans la catégorie « ${c} ».` : 'Pas encore de questions.',
      suggestion: (hasFilter: boolean) => hasFilter ? 'Modifiez vos filtres de recherche et réessayez.' : 'Soyez le premier à poser une question !',
      post: 'Publier une question',
    },
  } as const;
  const tr = (i18n as any)[currentLanguage] || (i18n as any).ja;
  const getMessage = () => {
    return tr.notFound(searchQuery, category);
  };

  const getSubMessage = () => {
    const hasFilter = Boolean(searchQuery || (category && category !== 'All'));
    return tr.suggestion(hasFilter);
  };

  return (
    <div className="text-center py-16 px-4">
      <div 
        className="inline-block rounded-2xl p-12 max-w-md mx-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <div className="mb-6">
          <svg 
            className="w-16 h-16 mx-auto text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" 
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {getMessage()}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {getSubMessage()}
        </p>

        {(!searchQuery && (!category || category === 'All')) && (
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            onClick={() => console.log('GA4 Event: qa_ask_click', { source: 'empty_state' })}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {tr.post}
          </button>
        )}
      </div>
    </div>
  );
}
