'use client';

import { useState } from 'react';

interface TravelStory {
  id: string;
  title: string;
  content: string;
  author: string;
  area: string;
  duration: string;
  budget: string;
  images: string[];
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
}

interface StoryCardProps {
  story: TravelStory;
}

export default function StoryCard({ story }: StoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? '0 25px 50px rgba(0, 0, 0, 0.2)' : 'none'
      }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-gray-700">{story.likes}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Badge Row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span 
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600'
            }}
          >
            📍 {story.area}
          </span>
          <span 
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600'
            }}
          >
            🕒 {story.duration}
          </span>
          <span 
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600'
            }}
          >
            💰 {story.budget}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {story.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {story.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {story.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                background: 'rgba(107, 114, 128, 0.1)',
                color: '#374151',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '500'
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author and Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div 
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              {story.author.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{story.author}</div>
              <div className="text-xs text-gray-500">{story.createdAt}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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