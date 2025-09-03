'use client';

interface EmptyStateProps {
  searchQuery?: string;
  area?: string;
}

export default function StoriesEmptyState({ searchQuery, area }: EmptyStateProps) {
  const getMessage = () => {
    if (searchQuery && area && area !== 'All') {
      return `「${searchQuery}」に関する「${area}」の旅行記が見つかりませんでした`;
    } else if (searchQuery) {
      return `「${searchQuery}」に関する旅行記が見つかりませんでした`;
    } else if (area && area !== 'All') {
      return `「${area}」の旅行記が見つかりませんでした`;
    } else {
      return '旅行記がまだありません';
    }
  };

  const getSubMessage = () => {
    if (searchQuery || (area && area !== 'All')) {
      return '検索条件を変更して再度お試しください';
    } else {
      return '最初の旅行記を投稿してみませんか？';
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {getMessage()}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {getSubMessage()}
        </p>

        {(!searchQuery && (!area || area === 'All')) && (
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl transition-colors"
            onClick={() => console.log('GA4 Event: story_post_click', { source: 'empty_state' })}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            旅行記を投稿する
          </button>
        )}
      </div>
    </div>
  );
}