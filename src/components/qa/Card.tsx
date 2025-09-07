'use client';

import { QAItem } from '@/types/qa';
import { useLanguage } from '@/contexts/LanguageContext';

interface CardProps {
  item: QAItem;
}

export default function Card({ item }: CardProps) {
  const { currentLanguage } = useLanguage();
  const i18n = {
    ja: { answers: '件の回答', views: '回閲覧', votes: '票' },
    en: { answers: ' answers', views: ' views', votes: ' votes' },
    ko: { answers: '개의 답변', views: '회 조회', votes: '표' },
    fr: { answers: ' réponses', views: ' vues', votes: ' votes' },
  } as const;
  const tr = (i18n as any)[currentLanguage] || (i18n as any).ja;
  const handleClick = () => {
    console.log('GA4 Event: qa_card_click', { id: item.id, title: item.title });
  };

  return (
    <div 
      className="group cursor-pointer transition-all duration-500 hover:-translate-y-2"
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
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Hover overlay effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(234, 116, 33, 0.05) 0%, rgba(255, 99, 71, 0.05) 100%)',
          borderRadius: '20px'
        }}
      />

      {/* Card header with category badge */}
      <div className="relative z-10 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div 
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: 'linear-gradient(135deg, #ea7421 0%, #f59e0b 100%)',
              color: 'white',
              boxShadow: '0 2px 8px rgba(234, 116, 33, 0.3)'
            }}
          >
            Q&A
          </div>
          <div className="text-xs text-gray-400 font-medium">
            {item.createdAt}
          </div>
        </div>
        
        <h3 
          className="text-xl font-bold mb-3 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors duration-300"
          style={{ color: '#1f2937' }}
        >
          {item.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
          {item.summary}
        </p>
      </div>

      {/* Tags section */}
      <div className="relative z-10 mb-6">
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#1d4ed8',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              #{tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span 
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(107, 114, 128, 0.1)',
                color: '#6b7280',
                border: '1px solid rgba(107, 114, 128, 0.2)'
              }}
            >
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Stats and author section */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300"
            title="Answers"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              color: '#059669'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-semibold text-sm" aria-label={`${item.answersCount}${tr.answers}`}>
              {item.answersCount}
            </span>
          </div>
          
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300"
            title="Views"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#2563eb'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="font-semibold text-sm" aria-label={`${item.views}${tr.views}`}>
              {item.views}
            </span>
          </div>

          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300"
            title="Votes"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="font-semibold text-sm" aria-label={`${item.votes}${tr.votes}`}>
              {item.votes}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div 
            className="text-sm font-semibold px-3 py-1 rounded-lg"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              color: '#4f46e5'
            }}
          >
            {item.author}
          </div>
        </div>
      </div>
    </div>
  );
}
