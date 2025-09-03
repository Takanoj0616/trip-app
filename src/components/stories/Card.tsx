'use client';

import { TravelStory } from '@/types/story';

interface CardProps {
  story: TravelStory;
}

export default function StoryCard({ story }: CardProps) {
  const handleClick = () => {
    console.log('GA4 Event: story_card_click', { id: story.id, title: story.title });
  };

  return (
    <div 
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
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
      aria-label={`旅行記: ${story.title}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={story.images[0]}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Floating Stats */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div 
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
            style={{
              background: 'rgba(239, 68, 68, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
            title={`${story.likes}いいね`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>{story.likes}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Badge Row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span 
            className="px-3 py-1 text-xs font-semibold text-white rounded-full"
            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)' }}
          >
            📍 {story.area}
          </span>
          <span 
            className="px-3 py-1 text-xs font-semibold text-white rounded-full"
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)' }}
          >
            🕒 {story.duration}
          </span>
          <span 
            className="px-3 py-1 text-xs font-semibold text-white rounded-full"
            style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
          >
            💰 {story.budget}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-cyan-600 transition-colors">
          {story.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {story.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {story.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700"
            >
              #{tag}
            </span>
          ))}
          {story.tags.length > 4 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{story.tags.length - 4}
            </span>
          )}
        </div>

        {/* Author and Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' }}
            >
              {story.author.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{story.author}</div>
              <div className="text-xs text-gray-500">{story.createdAt}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1" title={`${story.comments}コメント`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{story.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}