export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  category: 'sightseeing' | 'restaurants' | 'hotels' | 'transportation' | 'entertainment' | 'shopping';
  area: 'tokyo' | 'yokohama' | 'saitama' | 'chiba';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  rating?: number;
  reviews?: Review[];
  images?: string[];
  openingHours?: OpeningHours;
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  priceRange?: 'budget' | 'moderate' | 'expensive' | 'luxury';
  tags?: string[];
  googlePlaceId?: string;
  // Optional UI/analytics helpers
  reviewCount?: number;
  crowdLevel?: '空いている' | '普通' | '混雑';
  averageStayMinutes?: number; // e.g., 45
  stayRange?: string; // e.g., "30 - 60分"
  priceText?: string; // e.g., "¥1,000-3,000"
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  isOpen24Hours?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: {
    language: 'ja' | 'en' | 'ko';
    favoriteAreas: string[];
    favoriteCategories: string[];
  };
  favorites: string[];
  createdAt: string;
}

export interface TravelPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  spots: TouristSpot[];
  duration: number; // in days
  budget?: number;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface SearchFilters {
  area?: string;
  category?: string;
  priceRange?: string;
  rating?: number;
  openNow?: boolean;
  tags?: string[];
}

// Homepage component interfaces
export interface NavigationItem {
  href: string;
  label: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface AreaItem {
  emoji: string;
  title: string;
  description: string;
}

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}
