export interface TravelPost {
  id: string
  title: string
  content: string
  excerpt?: string | null
  author: string
  images: string[]
  tags: string[]
  region?: string | null
  category?: string | null
  viewCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TravelPostsResponse {
  posts: TravelPost[]
  pagination: PaginationInfo
}

export type SortBy = 'createdAt' | 'viewCount' | 'likeCount'
export type SortOrder = 'asc' | 'desc'

export interface SearchFilters {
  search: string
  region: string
  category: string
  sortBy: SortBy
  order: SortOrder
}

export const REGIONS = [
  '北海道', '東北', '関東', '中部', '関西', '中国', '四国', '九州・沖縄'
]

export const CATEGORIES = [
  'グルメ', '歴史・文化', '自然', 'アニメ・聖地', 'アクティビティ', 'ショッピング', '温泉', 'その他'
]