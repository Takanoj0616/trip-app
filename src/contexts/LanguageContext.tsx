'use client';

import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.areas': 'Areas',
    'nav.courses': 'Model Courses',
    'nav.ai-spots': 'AI Recommendations',
    'nav.coordinator': 'Coordinators',
    'nav.favorites': 'Favorites',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search spots...',
    'common.allCategories': 'All Categories',
    'common.sortByRating': 'Sort by Rating',
    'common.sortByName': 'Sort by Name',
    'common.sortByNewest': 'Sort by Newest',
    
    // Categories
    'category.sightseeing': '🏛️ Sightseeing',
    'category.restaurants': '🍜 Restaurants',
    'category.hotels': '🏨 Hotels',
    'category.entertainment': '🎭 Entertainment',
    'category.shopping': '🛍️ Shopping',
    
    // Area page
    'area.spots': 'attractions',
    'area.avgRating': 'Average Rating',
    'area.categories': 'Categories',
    'area.budgetSpots': 'Budget Spots',
    'area.createRoute': 'AI will suggest the optimal route!',
    'area.createRouteDesc': 'Select the spots you want to visit and automatically create an efficient sightseeing route.\nWe will guide you in the optimal order considering travel time and distance.',
    'area.startRouteCreation': 'Start My Route Creation',
    'area.optimalOrder': 'Optimal Order',
    'area.travelTime': 'Travel Time',
    'area.additionalSuggestions': 'Additional Suggestions',
    'area.routeCreation': 'Route Creation',
    'area.selectSpotsDesc': 'Please click to select the spots you want to visit',
    'area.selectedSpots': 'Selected',
    'area.finish': 'Finish',
    'area.selectSpots': 'Please select spots',
    'area.selectSpotsMinimum': 'Select at least 2 spots and let AI suggest a route',
    'area.routeReady': 'Ready! AI will create the best route',
    'area.routeReadyDesc': 'We will suggest an efficient order to visit the selected {count} spots,\nand also introduce additional recommended spots.',
    'area.clearAll': 'Clear All',
    'area.startAIGeneration': 'Start AI Route Generation!',
    'area.selectedSpotsTitle': 'Selected Spots',
    'area.clickToRemove': 'Click to remove',
    'area.spotsInArea': 'Spots in {area} ({count})',
    'area.noSpotsFound': 'No spots found',
    'area.changeSearchConditions': 'Please change your search conditions and try again',
    'area.createTravelPlan': 'Create {area} Travel Plan',
    'area.createTravelPlanDesc': 'AI will suggest an efficient sightseeing route tailored to your preferences',
    'area.createPlan': 'Create Travel Plan',
    
    // Area names
    'area.tokyo': 'Tokyo',
    'area.yokohama': 'Yokohama', 
    'area.saitama': 'Saitama',
    'area.chiba': 'Chiba',
    
    // Tokyo specific
    'tokyo.name': 'Tokyo Travel Guide',
    'tokyo.description': "Japan's vibrant capital where cutting-edge technology meets ancient traditions. Explore Tokyo Tower, Asakusa Temple, Imperial Palace, Harajuku, Ginza and world-class dining.",
    
    // Authentication
    'auth.login': 'Login',
    'auth.signUp': 'Sign Up',
    'auth.createPlan': 'CREATE AI PLAN NOW',
    
    // Common UI
    'common.priceRange': 'Price',
    'common.unknownHours': 'Hours Unknown',
    'common.reviews': 'reviews',
    'common.viewDetails': 'View Details',
    'common.website': 'Website',
    'common.addToRoute': 'Add to Route',
    'common.removeFromRoute': 'Remove from Route',
    'common.openingHours': 'Opening Hours',
    'common.address': 'Address',
    'common.phone': 'Phone',
    'common.overview': 'Overview',
    'common.tags': 'Tags',
    'common.basicInfo': 'Basic Information',
    'common.actions': 'Actions',
    'common.map': 'Map',
    'common.24hours': '24 hours',
    'common.closed': 'Closed'
  },
  ja: {
    // Navigation
    'nav.areas': 'エリア',
    'nav.courses': 'モデルコース',
    'nav.ai-spots': 'AI推薦',
    'nav.coordinator': 'コーディネーター',
    'nav.favorites': 'お気に入り',
    
    // Common
    'common.loading': '読み込み中...',
    'common.search': 'スポットを検索...',
    'common.allCategories': 'すべてのカテゴリ',
    'common.sortByRating': '評価順',
    'common.sortByName': '名前順',
    'common.sortByNewest': '新着順',
    
    // Categories
    'category.sightseeing': '🏛️ 観光・名所',
    'category.restaurants': '🍜 グルメ・レストラン',
    'category.hotels': '🏨 ホテル・宿泊',
    'category.entertainment': '🎭 エンターテインメント',
    'category.shopping': '🛍️ ショッピング',
    
    // Area page
    'area.spots': '観光スポット',
    'area.avgRating': '平均評価',
    'area.categories': 'カテゴリ数',
    'area.budgetSpots': '低予算スポット',
    'area.createRoute': 'AIが最適なルートを提案します！',
    'area.createRouteDesc': '行きたいスポットを選んで、効率的な観光ルートを自動作成。\n移動時間や距離を考慮した最適な順番で案内します。',
    'area.startRouteCreation': 'マイルート作成を始める',
    'area.optimalOrder': '最適な順番',
    'area.travelTime': '移動時間計算',
    'area.additionalSuggestions': '追加スポット提案',
    'area.routeCreation': 'ルート作成中',
    'area.selectSpotsDesc': '行きたいスポットをクリックして選択してください',
    'area.selectedSpots': '選択中',
    'area.finish': '終了',
    'area.selectSpots': 'スポットを選択してください',
    'area.selectSpotsMinimum': '最低2つのスポットを選んで、AIにルートを提案してもらいましょう',
    'area.routeReady': '準備完了！AIがベストルートを作成します',
    'area.routeReadyDesc': '選択した{count}つのスポットを効率的に回る順番を提案し、\n追加のおすすめスポットも一緒にご紹介します。',
    'area.clearAll': '全て解除',
    'area.startAIGeneration': 'AIルート生成スタート！',
    'area.selectedSpotsTitle': '選択中のスポット',
    'area.clickToRemove': 'クリックで削除',
    'area.spotsInArea': '{area}のスポット ({count})',
    'area.noSpotsFound': 'スポットが見つかりませんでした',
    'area.changeSearchConditions': '検索条件を変更してもう一度お試しください',
    'area.createTravelPlan': '{area}の旅行プランを作成',
    'area.createTravelPlanDesc': 'AIがあなたの好みに合わせて効率的な観光ルートを提案します',
    'area.createPlan': '旅行プランを作成',
    
    // Area names
    'area.tokyo': '東京',
    'area.yokohama': '横浜',
    'area.saitama': '埼玉',
    'area.chiba': '千葉',
    
    // Tokyo specific
    'tokyo.name': '東京',
    'tokyo.description': '日本の首都として、伝統と革新が共存する魅力的な都市。皇居、浅草、銀座、原宿、渋谷、新宿など多彩なエリアがあり、世界最高水準のグルメ、ショッピング、エンターテイメント、文化体験など様々な魅力を楽しめます。厳選された100軒以上の本格レストラン、20以上の観光スポット、4軒の厳選ホテル、多様なショッピング・エンターテイメント施設を網羅し、あなたの東京旅行を完璧にサポートします。',
    
    // Authentication
    'auth.login': 'ログイン',
    'auth.signUp': 'サインアップ',
    'auth.createPlan': 'AI旅行プランを作成',
    
    // Common UI
    'common.priceRange': '価格帯',
    'common.unknownHours': '営業時間不明',
    'common.reviews': 'レビュー',
    'common.viewDetails': '詳細を見る',
    'common.website': 'サイト',
    'common.addToRoute': 'ルートに追加',
    'common.removeFromRoute': 'ルートから除外',
    'common.openingHours': '営業時間',
    'common.address': '住所',
    'common.phone': '電話',
    'common.overview': '概要',
    'common.tags': 'タグ',
    'common.basicInfo': '基本情報',
    'common.actions': 'アクション',
    'common.map': '地図',
    'common.24hours': '24時間営業',
    'common.closed': '定休日'
  },
  ko: {
    // Navigation
    'nav.areas': '지역',
    'nav.courses': '모델 코스',
    'nav.ai-spots': 'AI 추천',
    'nav.coordinator': '코디네이터',
    'nav.favorites': '즐겨찾기',
    
    // Common
    'common.loading': '로딩 중...',
    'common.search': '스팟 검색...',
    'common.allCategories': '모든 카테고리',
    'common.sortByRating': '평점순',
    'common.sortByName': '이름순',
    'common.sortByNewest': '최신순',
    
    // Categories
    'category.sightseeing': '🏛️ 관광',
    'category.restaurants': '🍜 레스토랑',
    'category.hotels': '🏨 호텔',
    'category.entertainment': '🎭 엔터테인먼트',
    'category.shopping': '🛍️ 쇼핑',
    
    // Area page
    'area.spots': '관광지',
    'area.avgRating': '평균 평점',
    'area.categories': '카테고리',
    'area.budgetSpots': '저예산 스팟',
    'area.createRoute': 'AI가 최적의 루트를 제안합니다!',
    'area.createRouteDesc': '가고 싶은 스팟을 선택하여 효율적인 관광 루트를 자동 생성합니다.\n이동 시간과 거리를 고려한 최적의 순서로 안내합니다.',
    'area.startRouteCreation': '나만의 루트 만들기 시작',
    'area.optimalOrder': '최적 순서',
    'area.travelTime': '이동 시간',
    'area.additionalSuggestions': '추가 제안',
    'area.routeCreation': '루트 생성 중',
    'area.selectSpotsDesc': '방문하고 싶은 스팟을 클릭하여 선택하세요',
    'area.selectedSpots': '선택됨',
    'area.finish': '완료',
    'area.selectSpots': '스팟을 선택하세요',
    'area.selectSpotsMinimum': '최소 2개의 스팟을 선택하고 AI에게 루트를 제안받으세요',
    'area.routeReady': '준비 완료! AI가 최고의 루트를 만듭니다',
    'area.routeReadyDesc': '선택한 {count}개의 스팟을 효율적으로 돌아보는 순서를 제안하고,\n추가 추천 스팟도 함께 소개합니다.',
    'area.clearAll': '모두 지우기',
    'area.startAIGeneration': 'AI 루트 생성 시작!',
    'area.selectedSpotsTitle': '선택된 스팟',
    'area.clickToRemove': '클릭하여 제거',
    'area.spotsInArea': '{area}의 스팟 ({count})',
    'area.noSpotsFound': '스팟을 찾을 수 없습니다',
    'area.changeSearchConditions': '검색 조건을 변경하고 다시 시도해주세요',
    'area.createTravelPlan': '{area} 여행 계획 만들기',
    'area.createTravelPlanDesc': 'AI가 당신의 취향에 맞춰 효율적인 관광 루트를 제안합니다',
    'area.createPlan': '여행 계획 만들기',
    
    // Area names
    'area.tokyo': '도쿄',
    'area.yokohama': '요코하마',
    'area.saitama': '사이타마',
    'area.chiba': '치바',
    
    // Tokyo specific
    'tokyo.name': '도쿄',
    'tokyo.description': '일본의 수도로서 전통과 혁신이 공존하는 매력적인 도시입니다. 황궁, 아사쿠사, 긴자, 하라주쿠, 시부야, 신주쿠 등 다양한 지역이 있으며, 세계 최고 수준의 음식, 쇼핑, 엔터테인먼트, 문화 체험 등 다양한 매력을 즐길 수 있습니다.',
    
    // Authentication
    'auth.login': '로그인',
    'auth.signUp': '회원가입',
    'auth.createPlan': 'AI 여행 계획 만들기'
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const t = (key: string): string => {
    const translation = translations[currentLanguage as keyof typeof translations];
    return translation?.[key as keyof typeof translation] || key;
  };

  const value = {
    currentLanguage,
    setCurrentLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};