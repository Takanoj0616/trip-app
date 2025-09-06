'use client'

import { REGIONS, CATEGORIES } from '@/types/travel'
import { useLanguage } from '@/contexts/LanguageContext'

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
  const { t } = useLanguage()
  const REGION_KEYS: Record<string, string> = {
    '北海道': 'regions.hokkaido',
    '東北': 'regions.tohoku',
    '関東': 'regions.kanto',
    '中部': 'regions.chubu',
    '関西': 'regions.kansai',
    '中国': 'regions.chugoku',
    '四国': 'regions.shikoku',
    '九州・沖縄': 'regions.kyushu_okinawa',
  }
  const CATEGORY_KEYS: Record<string, string> = {
    'グルメ': 'categories.gourmet',
    '歴史・文化': 'categories.history_culture',
    '自然': 'categories.nature',
    'アニメ・聖地': 'categories.anime_pilgrimage',
    'アクティビティ': 'categories.activity',
    'ショッピング': 'categories.shopping',
    '温泉': 'categories.onsen',
    'その他': 'categories.other',
  }
  return (
    <div className="space-y-4">
      {/* 地域フィルター */}
      <div className="text-center">
        <h3 className="text-white font-medium mb-3 text-lg drop-shadow-md">{t('travel.filter.region')}</h3>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => onRegionChange('')}
            className={`filter-pill ${
              selectedRegion === '' ? 'filter-pill-active' : 'filter-pill-inactive'
            }`}
          >
            {t('travel.filter.all')}
          </button>
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => onRegionChange(region === selectedRegion ? '' : region)}
              className={`filter-pill ${
                selectedRegion === region ? 'filter-pill-active' : 'filter-pill-inactive'
              }`}
            >
              {t(REGION_KEYS[region] || region)}
            </button>
          ))}
        </div>
      </div>

      {/* カテゴリフィルター */}
      <div className="text-center">
        <h3 className="text-white font-medium mb-3 text-lg drop-shadow-md">{t('travel.filter.category')}</h3>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`filter-pill ${
              selectedCategory === '' ? 'filter-pill-active' : 'filter-pill-inactive'
            }`}
          >
            {t('travel.filter.all')}
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category === selectedCategory ? '' : category)}
              className={`filter-pill ${
                selectedCategory === category ? 'filter-pill-active' : 'filter-pill-inactive'
              }`}
            >
              {t(CATEGORY_KEYS[category] || category)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
