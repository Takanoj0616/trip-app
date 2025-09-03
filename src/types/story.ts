export interface TravelStory {
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

export type StoryArea = 'All' | '東京' | '京都' | '大阪' | '沖縄' | '北海道';

export type StorySortOption = 'newest' | 'popular' | 'likes';