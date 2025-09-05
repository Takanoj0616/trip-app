'use client'

import { REGIONS, CATEGORIES } from '@/types/travel'

interface FilterPillsProps {
  selectedRegion: string
  selectedCategory: string
  onRegionChange: (region: string) => void
  onCategoryChange: (category: string) => void
}

export default function FilterPills({
  selectedRegion,
  selectedCategory,
  onRegionChange,
  onCategoryChange
}: FilterPillsProps) {
  return (
    <div className="space-y-4">
      {/* 地域フィルター */}
      <div className="text-center">
        <h3 className="text-white font-medium mb-3 text-lg drop-shadow-md">地域で絞り込み</h3>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => onRegionChange('')}
            className={`filter-pill ${
              selectedRegion === '' ? 'filter-pill-active' : 'filter-pill-inactive'
            }`}
          >
            すべて
          </button>
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => onRegionChange(region === selectedRegion ? '' : region)}
              className={`filter-pill ${
                selectedRegion === region ? 'filter-pill-active' : 'filter-pill-inactive'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* カテゴリフィルター */}
      <div className="text-center">
        <h3 className="text-white font-medium mb-3 text-lg drop-shadow-md">テーマで絞り込み</h3>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`filter-pill ${
              selectedCategory === '' ? 'filter-pill-active' : 'filter-pill-inactive'
            }`}
          >
            すべて
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category === selectedCategory ? '' : category)}
              className={`filter-pill ${
                selectedCategory === category ? 'filter-pill-active' : 'filter-pill-inactive'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}