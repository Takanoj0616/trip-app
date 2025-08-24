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
    'common.closed': 'Closed',
    
    // Homepage
    'home.trustedBy': 'Trusted by 10,000+ travelers worldwide',
    'home.heroTitle': 'Free AI Japan Itinerary in 1 Minute',
    'home.heroSubtitle': 'Get personalized itineraries, hidden gems, and authentic experiences tailored just for you. Start planning in under 60 seconds!',
    'home.ctaPrimary': 'FREE AI ITINERARY NOW',
    'home.ctaSecondary': 'DISCOVER JAPAN',
    'home.featuresTitle': 'Our Features',
    'home.experienceTitle': 'Experience Authentic Japan',
    'home.experienceSubtitle': 'Discover hidden temples, traditional streets, and unforgettable moments in the land of the rising sun.',
    'home.popularDestinations': 'Popular Destinations',
    'home.footerCopyright': '© 2025 Japan Tourism Guide. All rights reserved.',
    
    // Main Features
    'features.multilingual.title': 'Multilingual Support',
    'features.multilingual.description': 'Full support for Japanese, English, and Korean languages. Navigate and plan your trip in your preferred language with complete localization.',
    'features.areaGuide.title': 'Area & Category Guide',
    'features.areaGuide.description': 'Comprehensive guides for Tokyo, Yokohama, Saitama, Chiba, and more. Discover local attractions, restaurants, and hidden gems in each region.',
    'features.userExperience.title': 'Enhanced User Experience',
    'features.userExperience.description': 'Save favorites, write reviews, create travel journals, and share your experiences. Build your personalized Japan travel community.',
    'features.aiRecommendation.title': 'AI Recommendation System',
    'features.aiRecommendation.description': 'Get personalized travel plans based on your preferences, budget, and interests. Our AI analyzes your needs for optimal itineraries.',
    'features.realTimeInfo.title': 'Real-time Information',
    'features.realTimeInfo.description': 'Access live data on crowd levels, weather conditions, transportation schedules, and venue availability for better planning.',
    'features.community.title': 'Community Features',
    'features.community.description': 'Join Q&A discussions, share travel experiences, get tips from locals and fellow travelers in our vibrant community platform.',
    
    // Areas
    'areas.tokyo.title': 'Tokyo',
    'areas.tokyo.description': 'Modern metropolis with cutting-edge technology, vibrant nightlife, and world-class shopping districts.',
    'areas.mtFuji.title': 'Mt. Fuji Area',
    'areas.mtFuji.description': 'Iconic sacred mountain with stunning views, hot springs, and traditional Japanese countryside experiences.',
    'areas.kyoto.title': 'Historic Kyoto',
    'areas.kyoto.description': 'Ancient capital filled with temples, traditional architecture, geishas, and preserved cultural heritage sites.',
    'areas.osaka.title': 'Osaka Food Capital',
    'areas.osaka.description': 'Japan\'s kitchen offering incredible street food, takoyaki, okonomiyaki, and the best culinary adventures.',
    
    // Footer
    'footer.explore.title': 'Explore',
    'footer.explore.areaGuide': 'Area Guide',
    'footer.explore.categorySearch': 'Category Search',
    'footer.explore.popularSpots': 'Popular Spots',
    'footer.explore.whatsNew': 'What\'s New',
    'footer.features.title': 'Features',
    'footer.features.aiTravelPlan': 'AI Travel Plan',
    'footer.features.favorites': 'Favorites',
    'footer.features.reviews': 'Reviews',
    'footer.features.offlineFeatures': 'Offline Features',
    'footer.support.title': 'Support',
    'footer.support.helpCenter': 'Help Center',
    'footer.support.contactUs': 'Contact Us',
    'footer.support.emergencyGuide': 'Emergency Guide',
    'footer.support.feedback': 'Feedback',
    'footer.account.title': 'Account',
    'footer.account.login': 'Login',
    'footer.account.signUp': 'Sign Up',
    'footer.account.premium': 'Premium',
    'footer.account.settings': 'Settings'
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
    'common.closed': '定休日',
    
    // Homepage
    'home.trustedBy': '世界中の10,000人以上の旅行者に信頼されています',
    'home.heroTitle': '1分でAI日本旅行プラン作成',
    'home.heroSubtitle': 'あなただけのパーソナライズされた旅程、隠れた名所、本格的な体験を60秒以内でプランニング。今すぐ始めましょう！',
    'home.ctaPrimary': '無料AI旅行プラン作成',
    'home.ctaSecondary': '日本を発見する',
    'home.featuresTitle': '私たちの機能',
    'home.experienceTitle': '本格的な日本を体験',
    'home.experienceSubtitle': '隠れた寺院、伝統的な街並み、そして日出ずる国での忘れられない瞬間を発見してください。',
    'home.popularDestinations': '人気の目的地',
    'home.footerCopyright': '© 2025 日本観光ガイド. All rights reserved.',
    
    // Main Features
    'features.multilingual.title': '多言語サポート',
    'features.multilingual.description': '日本語、英語、韓国語を完全サポート。お好みの言語で完全なローカライゼーションと共に旅行をナビゲート・プランニング。',
    'features.areaGuide.title': 'エリア・カテゴリガイド',
    'features.areaGuide.description': '東京、横浜、埼玉、千葉などの包括的なガイド。各地域の地元アトラクション、レストラン、隠れた名所を発見。',
    'features.userExperience.title': '強化されたユーザー体験',
    'features.userExperience.description': 'お気に入りの保存、レビューの投稿、旅行日記の作成、体験の共有。あなただけの日本旅行コミュニティを構築。',
    'features.aiRecommendation.title': 'AI推薦システム',
    'features.aiRecommendation.description': 'あなたの好み、予算、興味に基づいたパーソナライズされた旅行プラン。AIがあなたのニーズを分析して最適な旅程を提供。',
    'features.realTimeInfo.title': 'リアルタイム情報',
    'features.realTimeInfo.description': '混雑レベル、天候条件、交通スケジュール、施設の利用可能性のライブデータにアクセスしてより良いプランニング。',
    'features.community.title': 'コミュニティ機能',
    'features.community.description': 'Q&Aディスカッションに参加、旅行体験の共有、地元の人々や仲間の旅行者からのヒントを活気あるコミュニティプラットフォームで。',
    
    // Areas
    'areas.tokyo.title': '東京',
    'areas.tokyo.description': '最先端技術、活気あるナイトライフ、世界クラスのショッピング地区を持つ現代的な大都市。',
    'areas.mtFuji.title': '富士山エリア',
    'areas.mtFuji.description': '素晴らしい景色、温泉、伝統的な日本の田園体験を持つ象徴的な聖なる山。',
    'areas.kyoto.title': '歴史的な京都',
    'areas.kyoto.description': '寺院、伝統的な建築、芸者、保存された文化遺産サイトで満たされた古都。',
    'areas.osaka.title': '大阪グルメの都',
    'areas.osaka.description': '素晴らしい屋台料理、たこ焼き、お好み焼き、最高の料理冒険を提供する日本のキッチン。',
    
    // Footer
    'footer.explore.title': '探索',
    'footer.explore.areaGuide': 'エリアガイド',
    'footer.explore.categorySearch': 'カテゴリ検索',
    'footer.explore.popularSpots': '人気スポット',
    'footer.explore.whatsNew': '新着情報',
    'footer.features.title': '機能',
    'footer.features.aiTravelPlan': 'AI旅行プラン',
    'footer.features.favorites': 'お気に入り',
    'footer.features.reviews': 'レビュー',
    'footer.features.offlineFeatures': 'オフライン機能',
    'footer.support.title': 'サポート',
    'footer.support.helpCenter': 'ヘルプセンター',
    'footer.support.contactUs': 'お問い合わせ',
    'footer.support.emergencyGuide': '緊急時ガイド',
    'footer.support.feedback': 'フィードバック',
    'footer.account.title': 'アカウント',
    'footer.account.login': 'ログイン',
    'footer.account.signUp': 'サインアップ',
    'footer.account.premium': 'プレミアム',
    'footer.account.settings': '設定'
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
    'auth.createPlan': 'AI 여행 계획 만들기',
    
    // Homepage
    'home.trustedBy': '전 세계 10,000명 이상의 여행자들이 신뢰합니다',
    'home.heroTitle': '1분 만에 AI 일본 여행 일정',
    'home.heroSubtitle': '당신만을 위한 맞춤형 여행 일정, 숨겨진 명소, 그리고 진정한 경험을 60초 안에 계획하세요. 지금 시작하세요!',
    'home.ctaPrimary': '무료 AI 여행 일정',
    'home.ctaSecondary': '일본 발견하기',
    'home.featuresTitle': '우리의 특징',
    'home.experienceTitle': '진정한 일본을 경험하세요',
    'home.experienceSubtitle': '숨겨진 사원들, 전통 거리들, 그리고 떠오르는 태양의 땅에서의 잊을 수 없는 순간들을 발견하세요.',
    'home.popularDestinations': '인기 목적지',
    'home.footerCopyright': '© 2025 일본 관광 가이드. All rights reserved.',
    
    // Main Features
    'features.multilingual.title': '다국어 지원',
    'features.multilingual.description': '일본어, 영어, 한국어 완전 지원. 완전한 현지화와 함께 선호하는 언어로 여행을 탐색하고 계획하세요.',
    'features.areaGuide.title': '지역 및 카테고리 가이드',
    'features.areaGuide.description': '도쿄, 요코하마, 사이타마, 치바 등을 위한 포괄적인 가이드. 각 지역의 현지 명소, 레스토랑, 숨겨진 보석을 발견하세요.',
    'features.userExperience.title': '향상된 사용자 경험',
    'features.userExperience.description': '즐겨찾기 저장, 리뷰 작성, 여행 일지 작성, 경험 공유. 개인화된 일본 여행 커뮤니티를 구축하세요.',
    'features.aiRecommendation.title': 'AI 추천 시스템',
    'features.aiRecommendation.description': '선호도, 예산, 관심사를 기반으로 한 맞춤형 여행 계획. AI가 최적의 여행 일정을 위해 필요사항을 분석합니다.',
    'features.realTimeInfo.title': '실시간 정보',
    'features.realTimeInfo.description': '더 나은 계획을 위해 혼잡 수준, 날씨 조건, 교통 스케줄, 장소 이용 가능성에 대한 실시간 데이터에 액세스하세요.',
    'features.community.title': '커뮤니티 기능',
    'features.community.description': 'Q&A 토론 참여, 여행 경험 공유, 활발한 커뮤니티 플랫폼에서 현지인과 동료 여행자들로부터 팁을 얻으세요.',
    
    // Areas
    'areas.tokyo.title': '도쿄',
    'areas.tokyo.description': '최첨단 기술, 활기찬 나이트라이프, 세계 수준의 쇼핑 지구를 갖춘 현대적인 대도시.',
    'areas.mtFuji.title': '후지산 지역',
    'areas.mtFuji.description': '멋진 전망, 온천, 전통적인 일본 시골 경험을 제공하는 상징적인 성스러운 산.',
    'areas.kyoto.title': '역사적인 교토',
    'areas.kyoto.description': '사원, 전통 건축, 게이샤, 보존된 문화 유산지로 가득한 고도.',
    'areas.osaka.title': '오사카 음식의 수도',
    'areas.osaka.description': '놀라운 길거리 음식, 타코야키, 오코노미야키, 최고의 요리 모험을 제공하는 일본의 주방.',
    
    // Footer
    'footer.explore.title': '탐색',
    'footer.explore.areaGuide': '지역 가이드',
    'footer.explore.categorySearch': '카테고리 검색',
    'footer.explore.popularSpots': '인기 스팟',
    'footer.explore.whatsNew': '새로운 소식',
    'footer.features.title': '기능',
    'footer.features.aiTravelPlan': 'AI 여행 계획',
    'footer.features.favorites': '즐겨찾기',
    'footer.features.reviews': '리뷰',
    'footer.features.offlineFeatures': '오프라인 기능',
    'footer.support.title': '지원',
    'footer.support.helpCenter': '도움말 센터',
    'footer.support.contactUs': '문의하기',
    'footer.support.emergencyGuide': '응급 가이드',
    'footer.support.feedback': '피드백',
    'footer.account.title': '계정',
    'footer.account.login': '로그인',
    'footer.account.signUp': '회원가입',
    'footer.account.premium': '프리미엄',
    'footer.account.settings': '설정'
  },
  fr: {
    // Navigation
    'nav.areas': 'Régions',
    'nav.courses': 'Cours modèles',
    'nav.ai-spots': 'Recommandations AI',
    'nav.coordinator': 'Coordinateurs',
    'nav.favorites': 'Favoris',
    'nav.realtime': 'Infos temps réel',
    'nav.stories': 'Histoires de voyage',
    
    // Common
    'common.loading': 'Chargement...',
    'common.search': 'Rechercher des spots...',
    'common.allCategories': 'Toutes les catégories',
    'common.sortByRating': 'Trier par note',
    'common.sortByName': 'Trier par nom',
    'common.sortByNewest': 'Trier par récence',
    
    // Categories
    'category.sightseeing': '🏛️ Tourisme',
    'category.restaurants': '🍜 Restaurants',
    'category.hotels': '🏨 Hôtels',
    'category.entertainment': '🎭 Divertissement',
    'category.shopping': '🛍️ Shopping',
    
    // Area page
    'area.spots': 'attractions',
    'area.avgRating': 'Note moyenne',
    'area.categories': 'Catégories',
    'area.budgetSpots': 'Spots petit budget',
    'area.createRoute': 'L\'IA suggérera l\'itinéraire optimal !',
    'area.createRouteDesc': 'Sélectionnez les spots que vous souhaitez visiter et créez automatiquement un itinéraire de visite efficace.\nNous vous guiderons dans l\'ordre optimal en tenant compte du temps de trajet et de la distance.',
    'area.startRouteCreation': 'Commencer mon itinéraire',
    'area.optimalOrder': 'Ordre optimal',
    'area.travelTime': 'Temps de trajet',
    'area.additionalSuggestions': 'Suggestions supplémentaires',
    'area.routeCreation': 'Création d\'itinéraire',
    'area.selectSpotsDesc': 'Veuillez cliquer pour sélectionner les spots que vous souhaitez visiter',
    'area.selectedSpots': 'Sélectionné',
    'area.finish': 'Terminer',
    'area.selectSpots': 'Veuillez sélectionner des spots',
    'area.selectSpotsMinimum': 'Sélectionnez au moins 2 spots et laissez l\'IA suggérer un itinéraire',
    'area.routeReady': 'Prêt ! L\'IA va créer le meilleur itinéraire',
    'area.routeReadyDesc': 'Nous suggérerons un ordre efficace pour visiter les {count} spots sélectionnés,\net présenterons également des spots recommandés supplémentaires.',
    'area.clearAll': 'Tout effacer',
    'area.startAIGeneration': 'Démarrer la génération d\'itinéraire IA !',
    'area.selectedSpotsTitle': 'Spots sélectionnés',
    'area.clickToRemove': 'Cliquer pour supprimer',
    'area.spotsInArea': 'Spots à {area} ({count})',
    'area.noSpotsFound': 'Aucun spot trouvé',
    'area.changeSearchConditions': 'Veuillez modifier vos conditions de recherche et réessayer',
    'area.createTravelPlan': 'Créer un plan de voyage pour {area}',
    'area.createTravelPlanDesc': 'L\'IA suggérera un itinéraire touristique efficace adapté à vos préférences',
    'area.createPlan': 'Créer un plan de voyage',
    
    // Area names
    'area.tokyo': 'Tokyo',
    'area.yokohama': 'Yokohama',
    'area.saitama': 'Saitama',
    'area.chiba': 'Chiba',
    
    // Tokyo specific
    'tokyo.name': 'Tokyo',
    'tokyo.description': 'La capitale dynamique du Japon où la technologie de pointe rencontre les traditions anciennes. Explorez la Tokyo Tower, le temple d\'Asakusa, le Palais Impérial, Harajuku, Ginza et une cuisine de classe mondiale.',
    
    // Authentication
    'auth.login': 'Connexion',
    'auth.signUp': 'S\'inscrire',
    'auth.createPlan': 'CRÉER UN PLAN IA MAINTENANT',
    
    // Common UI
    'common.priceRange': 'Prix',
    'common.unknownHours': 'Horaires inconnus',
    'common.reviews': 'avis',
    'common.viewDetails': 'Voir les détails',
    'common.website': 'Site web',
    'common.addToRoute': 'Ajouter à l\'itinéraire',
    'common.removeFromRoute': 'Supprimer de l\'itinéraire',
    'common.openingHours': 'Heures d\'ouverture',
    'common.address': 'Adresse',
    'common.phone': 'Téléphone',
    'common.overview': 'Aperçu',
    'common.tags': 'Tags',
    'common.basicInfo': 'Informations de base',
    'common.actions': 'Actions',
    'common.map': 'Carte',
    'common.24hours': '24 heures',
    'common.closed': 'Fermé',
    
    // Homepage
    'home.trustedBy': 'Fait confiance par plus de 10 000 voyageurs dans le monde',
    'home.heroTitle': 'Itinéraire gratuit du Japon par IA en 1 minute',
    'home.heroSubtitle': 'Obtenez des itinéraires personnalisés, des joyaux cachés et des expériences authentiques adaptées juste pour vous. Commencez à planifier en moins de 60 secondes !',
    'home.ctaPrimary': 'ITINÉRAIRE IA GRATUIT MAINTENANT',
    'home.ctaSecondary': 'DÉCOUVRIR LE JAPON',
    'home.featuresTitle': 'Nos fonctionnalités',
    'home.experienceTitle': 'Découvrez le Japon authentique',
    'home.experienceSubtitle': 'Découvrez des temples cachés, des rues traditionnelles et des moments inoubliables dans le pays du soleil levant.',
    'home.popularDestinations': 'Destinations populaires',
    'home.footerCopyright': '© 2025 Guide touristique du Japon. Tous droits réservés.',
    
    // Main Features
    'features.multilingual.title': 'Support multilingue',
    'features.multilingual.description': 'Support complet pour les langues japonaise, anglaise et coréenne. Naviguez et planifiez votre voyage dans votre langue préférée avec une localisation complète.',
    'features.areaGuide.title': 'Guide des zones et catégories',
    'features.areaGuide.description': 'Guides complets pour Tokyo, Yokohama, Saitama, Chiba et plus encore. Découvrez les attractions locales, restaurants et joyaux cachés de chaque région.',
    'features.userExperience.title': 'Expérience utilisateur améliorée',
    'features.userExperience.description': 'Sauvegardez les favoris, rédigez des avis, créez des journaux de voyage et partagez vos expériences. Construisez votre communauté de voyage au Japon personnalisée.',
    'features.aiRecommendation.title': 'Système de recommandation IA',
    'features.aiRecommendation.description': 'Obtenez des plans de voyage personnalisés basés sur vos préférences, budget et intérêts. Notre IA analyse vos besoins pour des itinéraires optimaux.',
    'features.realTimeInfo.title': 'Informations en temps réel',
    'features.realTimeInfo.description': 'Accédez aux données en direct sur les niveaux de foule, les conditions météorologiques, les horaires de transport et la disponibilité des lieux pour une meilleure planification.',
    'features.community.title': 'Fonctionnalités communautaires',
    'features.community.description': 'Rejoignez les discussions Q&R, partagez des expériences de voyage, obtenez des conseils des locaux et des autres voyageurs dans notre plateforme communautaire dynamique.',
    
    // Areas
    'areas.tokyo.title': 'Tokyo',
    'areas.tokyo.description': 'Métropole moderne avec une technologie de pointe, une vie nocturne animée et des quartiers commerçants de classe mondiale.',
    'areas.mtFuji.title': 'Zone du Mont Fuji',
    'areas.mtFuji.description': 'Montagne sacrée emblématique avec des vues époustouflantes, des sources chaudes et des expériences de campagne japonaise traditionnelle.',
    'areas.kyoto.title': 'Kyoto historique',
    'areas.kyoto.description': 'Ancienne capitale remplie de temples, d\'architecture traditionnelle, de geishas et de sites patrimoniaux culturels préservés.',
    'areas.osaka.title': 'Osaka capitale gastronomique',
    'areas.osaka.description': 'La cuisine du Japon offrant une incroyable street food, takoyaki, okonomiyaki et les meilleures aventures culinaires.',
    
    // Footer
    'footer.explore.title': 'Explorer',
    'footer.explore.areaGuide': 'Guide des zones',
    'footer.explore.categorySearch': 'Recherche par catégorie',
    'footer.explore.popularSpots': 'Spots populaires',
    'footer.explore.whatsNew': 'Nouveautés',
    'footer.features.title': 'Fonctionnalités',
    'footer.features.aiTravelPlan': 'Plan de voyage IA',
    'footer.features.favorites': 'Favoris',
    'footer.features.reviews': 'Avis',
    'footer.features.offlineFeatures': 'Fonctionnalités hors ligne',
    'footer.support.title': 'Support',
    'footer.support.helpCenter': 'Centre d\'aide',
    'footer.support.contactUs': 'Nous contacter',
    'footer.support.emergencyGuide': 'Guide d\'urgence',
    'footer.support.feedback': 'Commentaires',
    'footer.account.title': 'Compte',
    'footer.account.login': 'Connexion',
    'footer.account.signUp': 'S\'inscrire',
    'footer.account.premium': 'Premium',
    'footer.account.settings': 'Paramètres'
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