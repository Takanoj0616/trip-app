'use client';

interface EmptyStateProps {
  searchQuery?: string;
  category?: string;
}

export default function EmptyState({ searchQuery, category }: EmptyStateProps) {
  const getMessage = () => {
    if (searchQuery && category && category !== 'All') {
      return `「${searchQuery}」に関する「${category}」カテゴリの質問が見つかりませんでした`;
    } else if (searchQuery) {
      return `「${searchQuery}」に関する質問が見つかりませんでした`;
    } else if (category && category !== 'All') {
      return `「${category}」カテゴリの質問が見つかりませんでした`;
    } else {
      return '質問がまだありません';
    }
  };

  const getSubMessage = () => {
    if (searchQuery || (category && category !== 'All')) {
      return '検索条件を変更して再度お試しください';
    } else {
      return '最初の質問を投稿してみませんか？';
    }
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
            質問を投稿する
          </button>
        )}
      </div>
    </div>
  );
}