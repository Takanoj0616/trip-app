'use client';

import { QAItem } from '@/types/qa';

interface CardProps {
  item: QAItem;
}

export default function Card({ item }: CardProps) {
  const handleClick = () => {
    console.log('GA4 Event: qa_card_click', { id: item.id, title: item.title });
  };

  return (
    <div 
      className="group cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`質問: ${item.title}`}
    >
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {item.summary}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1" title="回答数">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span aria-label={`${item.answersCount}件の回答`}>{item.answersCount}</span>
          </div>
          
          <div className="flex items-center gap-1" title="閲覧数">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span aria-label={`${item.views}回閲覧`}>{item.views}</span>
          </div>

          <div className="flex items-center gap-1" title="投票数">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span aria-label={`${item.votes}票`}>{item.votes}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-400">{item.createdAt}</div>
          <div className="text-xs font-medium">{item.author}</div>
        </div>
      </div>
    </div>
  );
}