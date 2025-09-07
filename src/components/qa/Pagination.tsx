'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [timeAtBottom, setTimeAtBottom] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if user has scrolled to bottom (with some tolerance)
      const isAtBottom = scrollTop + windowHeight >= documentHeight - 50;
      
      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
        setTimeAtBottom(Date.now());
      } else if (!isAtBottom && hasScrolledToBottom) {
        setHasScrolledToBottom(false);
        setTimeAtBottom(null);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolledToBottom]);

  // Auto advance when user reaches bottom and stays there for 3 seconds
  useEffect(() => {
    if (hasScrolledToBottom && timeAtBottom && isAutoAdvancing && totalPages > 1) {
      scrollTimeoutRef.current = setTimeout(() => {
        onPageChange((prevPage) => {
          if (prevPage >= totalPages) {
            return 1; // Reset to first page
          }
          return prevPage + 1;
        });
        // Reset scroll state for next page
        setHasScrolledToBottom(false);
        setTimeAtBottom(null);
        // Scroll to top of new page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3000); // Wait 3 seconds at bottom before advancing
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hasScrolledToBottom, timeAtBottom, isAutoAdvancing, totalPages, onPageChange]);

  // Pause auto advance when user interacts
  const pauseAutoAdvance = () => {
    setIsAutoAdvancing(false);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    setHasScrolledToBottom(false);
    setTimeAtBottom(null);
    // Resume after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoAdvancing(true);
    }, 10000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    pauseAutoAdvance();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const deltaX = startX - endX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentPage < totalPages) {
        // Swipe left - next page
        onPageChange(currentPage + 1);
      } else if (deltaX < 0 && currentPage > 1) {
        // Swipe right - previous page
        onPageChange(currentPage - 1);
      }
    }
    
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
    pauseAutoAdvance();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const endX = e.clientX;
    const deltaX = startX - endX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentPage < totalPages) {
        // Swipe left - next page
        onPageChange(currentPage + 1);
      } else if (deltaX < 0 && currentPage > 1) {
        // Swipe right - previous page
        onPageChange(currentPage - 1);
      }
    }
    
    setIsDragging(false);
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center mt-12" aria-label={tr.aria}>
      <div 
        ref={containerRef}
        className="flex items-center gap-2 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        <button
          onClick={() => {
            onPageChange(currentPage - 1);
            pauseAutoAdvance();
          }}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: currentPage === 1 
              ? 'rgba(107, 114, 128, 0.1)' 
              : 'rgba(59, 130, 246, 0.1)',
            color: currentPage === 1 ? '#6b7280' : '#2563eb',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: currentPage === 1 
              ? 'rgba(107, 114, 128, 0.2)' 
              : 'rgba(59, 130, 246, 0.2)'
          }}
          aria-label={tr.prev}
        >
          ← {tr.prev}
        </button>

        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => {
                onPageChange(page);
                pauseAutoAdvance();
              }}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-all duration-300 ${
                page === currentPage
                  ? 'transform scale-110'
                  : 'hover:scale-105'
              }`}
              style={{
                background: page === currentPage 
                  ? 'linear-gradient(135deg, #ea7421 0%, #f59e0b 100%)' 
                  : 'transparent',
                color: page === currentPage ? 'white' : '#374151',
                boxShadow: page === currentPage 
                  ? '0 2px 8px rgba(234, 116, 33, 0.3)' 
                  : 'none',
                border: page === currentPage 
                  ? 'none' 
                  : '1px solid rgba(107, 114, 128, 0.2)'
              }}
              aria-label={`${page}ページ目`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            onPageChange(currentPage + 1);
            pauseAutoAdvance();
          }}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: currentPage === totalPages 
              ? 'rgba(107, 114, 128, 0.1)' 
              : 'rgba(59, 130, 246, 0.1)',
            color: currentPage === totalPages ? '#6b7280' : '#2563eb',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: currentPage === totalPages 
              ? 'rgba(107, 114, 128, 0.2)' 
              : 'rgba(59, 130, 246, 0.2)'
          }}
          aria-label={tr.next}
        >
          {tr.next} →
        </button>
      </div>

      {/* Auto-advance indicator and swipe hint */}
      <div className="text-center mt-3 space-y-2">
        <div className="flex justify-center items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index + 1 === currentPage ? 'w-6' : 'w-1.5'
                }`}
                style={{
                  backgroundColor: index + 1 === currentPage 
                    ? 'rgba(234, 116, 33, 0.8)' 
                    : 'rgba(255, 255, 255, 0.3)'
                }}
              />
            ))}
          </div>
          {isAutoAdvancing && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e' }}></div>
              <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>自動</span>
            </div>
          )}
        </div>
        <p className="text-xs opacity-70" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          ← スワイプでページ切り替え → {isAutoAdvancing && hasScrolledToBottom ? '(3秒後に自動切り替え)' : isAutoAdvancing ? '(ページ下部で3秒待機後自動切り替え)' : ''}
        </p>
      </div>
    </nav>
  );
}
