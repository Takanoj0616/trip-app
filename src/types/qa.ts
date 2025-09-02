export interface QAItem {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  category: string;
  author: string;
  createdAt: string;
  answersCount: number;
  views: number;
  votes: number;
}

export type Category = 'All' | 'アクセス' | 'グルメ' | 'ホテル' | '文化' | '旅程';

export type SortOption = 'newest' | 'views' | 'votes';