export type SortBy = 'createdAt' | 'viewCount' | 'likeCount';
export type SortOrder = 'asc' | 'desc';

export interface TravelPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  region?: string;
  category?: string;
  tags: string[];
  images: string[];
  viewCount: number;
  likeCount: number;
  createdAt: string; // ISO string
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TravelPostsResponse {
  posts: TravelPost[];
  pagination: PaginationInfo;
}

export interface SearchFilters {
  search: string;
  region: string;
  category: string;
  sortBy: SortBy;
  order: SortOrder;
}

// Simple presets; update to your preferred taxonomy anytime
export const REGIONS: string[] = [
  '北海道', '東北', '関東', '東京', '中部', '近畿', '関西', '中国', '四国', '九州', '沖縄'
];

export const CATEGORIES: string[] = [
  '歴史・文化', 'グルメ', '自然・散策', '寺社', '買い物', 'アクティビティ'
];

