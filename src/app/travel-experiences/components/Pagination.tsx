'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* 前のページボタン */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`glass-card p-2 transition-all duration-200 ${
          currentPage === 1 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-white/40 hover:shadow-lg'
        }`}
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* ページ番号 */}
      <div className="flex space-x-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={index} className="px-3 py-2 text-gray-500">
                ...
              </span>
            )
          }

          const pageNumber = page as number
          const isActive = pageNumber === currentPage

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'glass-card text-gray-700 hover:bg-white/40 hover:shadow-lg'
              }`}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>

      {/* 次のページボタン */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`glass-card p-2 transition-all duration-200 ${
          currentPage === totalPages 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-white/40 hover:shadow-lg'
        }`}
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  )
}