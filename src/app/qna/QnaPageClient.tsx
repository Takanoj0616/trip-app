'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Hero from '@/components/qa/Hero';
import Controls from '@/components/qa/Controls';
import Card from '@/components/qa/Card';
import Pagination from '@/components/qa/Pagination';
import EmptyState from '@/components/qa/EmptyState';
import Footer from '@/components/qa/Footer';
import { qaData } from '@/data/qaData';
import { Category, SortOption } from '@/types/qa';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QnaPageClient() {
  const searchParams = useSearchParams();
  const { currentLanguage, setCurrentLanguage } = useLanguage();

  // 1) On mount, read ?lang and sync context
  useEffect(() => {
    const urlLang = searchParams?.get('lang');
    if (urlLang && urlLang !== currentLanguage) {
      setCurrentLanguage(urlLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) When language changes (via header), update URL ?lang
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (currentLanguage) {
      url.searchParams.set('lang', currentLanguage);
      window.history.replaceState({}, '', url.toString());
    }
  }, [currentLanguage]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedSort, setSelectedSort] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Display translations for Q&A content (title/summary/tags/author)
  const qaTranslations: Record<string, Record<string, Partial<{
    title: string;
    summary: string;
    tags: string[];
    author: string;
  }>>> = {
    en: {
      '1': { title: 'Best way from Tokyo Station to Senso-ji?', summary: 'Take the JR Yamanote Line to Ueno, then transfer to the Tokyo Metro Ginza Line to Asakusa. Total time is about 30 minutes.', tags: ['Transport', 'Asakusa', 'Tokyo Station'], author: 'Travel Lover A' },
      '2': { title: 'Best cherry blossom spots in Tokyo', summary: 'Tell me more about famous sakura spots in Tokyo such as Ueno Park, Shinjuku Gyoen, and Chidorigafuchi.', tags: ['Sakura', 'Sightseeing', 'Tokyo'], author: 'Hanami Beginner' },
      '3': { title: 'Late-night travel from Haneda to city center', summary: 'How can I get to central Tokyo late at night from a red-eye arrival, and how much does it cost?', tags: ['Airport', 'Late night', 'Transport'], author: 'Late-night Arrival' },
      '4': { title: 'Best breakfast near Tsukiji Market', summary: 'Looking for breakfast spots in Tsukiji serving fresh seafood in the morning.', tags: ['Tsukiji', 'Breakfast', 'Seafood'], author: 'Gourmet Explorer' },
      '5': { title: 'Best hotel types for solo travelers', summary: 'First-time solo trip to Tokyo. Tips for safe, cost-effective hotel choices?', tags: ['Solo trip', 'Accommodation', 'Tokyo'], author: 'Solo Traveler' },
      '6': { title: 'Onsen etiquette basics', summary: 'What are the basic rules and manners when foreign visitors use Japanese hot springs?', tags: ['Onsen', 'Manners', 'Culture'], author: 'Onsen Beginner' },
      '7': { title: 'Efficient route at Fushimi Inari Taisha', summary: 'How long does it take to walk through all Senbon Torii and what route do you recommend?', tags: ['Kyoto', 'Fushimi Inari', 'Shrine'], author: 'Kyoto Enthusiast' },
      '8': { title: 'Must-visit kushikatsu in Osaka', summary: 'Recommend classic local restaurants to enjoy Osaka’s famous kushikatsu.', tags: ['Osaka', 'Kushikatsu', 'Gourmet'], author: 'Kansai Gourmet' },
      '9': { title: 'Access to Mt. Fuji 5th Station and time needed', summary: 'How to get from Tokyo to the 5th Station and what to watch out for on site?', tags: ['Mt. Fuji', '5th Station', 'Transport'], author: 'Mountain Lover' },
      '10': { title: 'Recommended ryokan near Kenrokuen in Kanazawa', summary: 'Looking for traditional Japanese inns within walking distance of Kenrokuen Garden.', tags: ['Kanazawa', 'Kenrokuen', 'Ryokan'], author: 'Ryokan Fan' },
    },
    ko: {
      '1': { title: '도쿄역에서 센소지로 가는 최적 경로?', summary: 'JR 야마노테선으로 우에노까지 이동 후, 도쿄메트로 긴자선으로 아사쿠사역으로 환승. 소요 약 30분.', tags: ['교통', '아사쿠사', '도쿄역'], author: '여행좋아A' },
      '2': { title: '벚꽃 시즌 도쿄 추천 명소', summary: '우에노공원, 신주쿠교엔, 치도리가후치 등 도내 벚꽃 명소를 자세히 알고 싶어요.', tags: ['벚꽃', '관광', '도쿄'], author: '꽃놀이 초보' },
      '3': { title: '하네다 공항 심야 도심 이동', summary: '심야 도착 시 도심으로 가는 방법과 요금을 알고 싶습니다.', tags: ['공항', '심야', '교통'], author: '심야 도착자' },
      '4': { title: '츠키지 시장 주변 아침식사 추천', summary: '신선한 해산물 아침식사를 즐길 수 있는 츠키지 일대의 가게 추천 부탁합니다.', tags: ['츠키지', '아침식사', '해산물'], author: '미식 탐험가' },
      '5': { title: '혼자 여행 시 추천 호텔 타입', summary: '첫 도쿄 1인 여행입니다. 가성비 좋고 안전한 호텔 선택 팁 알려주세요.', tags: ['혼자 여행', '숙박', '도쿄'], author: '솔로 트래블러' },
      '6': { title: '온천 이용 매너', summary: '외국인 방문객으로 온천 이용 시 기본적인 매너와 규칙은 무엇인가요?', tags: ['온천', '매너', '문화'], author: '온천 초보' },
      '7': { title: '후시미 이나리 효율적으로 도는 법', summary: '센본토리이를 전부 도는 데 걸리는 시간과 추천 동선을 알려주세요.', tags: ['교토', '후시미이나리', '신사'], author: '교토 애호가' },
      '8': { title: '오사카 쿠시카츠 맛집', summary: '오사카 명물 쿠시카츠를 즐길 수 있는 현지 노포 추천 부탁해요.', tags: ['오사카', '쿠시카츠', '미식'], author: '간사이 미식가' },
      '9': { title: '후지산 5합목 교통과 소요시간', summary: '도쿄에서 5합목까지 가는 방법과 현지 주의점을 알고 싶습니다.', tags: ['후지산', '5합목', '교통'], author: '산 애호가' },
      '10': { title: '가나자와 겐로쿠엔 근처 추천 료칸', summary: '겐로쿠엔 도보권 내 전통 료칸 분위기를 즐길 수 있는 숙소를 찾습니다.', tags: ['가나자와', '겐로쿠엔', '료칸'], author: '와후 료칸 애호가' },
    },
    fr: {
      '1': { title: 'Meilleur trajet de Tokyo Station à Sensō‑ji ?', summary: 'Prenez la JR Yamanote jusqu’à Ueno puis le métro Ginza jusqu’à Asakusa. Environ 30 minutes.', tags: ['Transport', 'Asakusa', 'Gare de Tokyo'], author: 'Amateur de voyage A' },
      '2': { title: 'Spots de sakura recommandés à Tokyo', summary: 'Détails sur Ueno, Shinjuku Gyoen, Chidorigafuchi et autres sites célèbres de cerisiers à Tokyo.', tags: ['Sakura', 'Tourisme', 'Tokyo'], author: 'Débutant Hanami' },
      '3': { title: 'Transfert de nuit depuis Haneda vers le centre', summary: 'Comment rejoindre le centre de Tokyo tard la nuit et à quel prix ?', tags: ['Aéroport', 'Nuit', 'Transport'], author: 'Arrivée nocturne' },
      '4': { title: 'Petit‑déjeuner près du marché de Tsukiji', summary: 'Des adresses pour un petit‑déjeuner de fruits de mer ultra‑frais à Tsukiji.', tags: ['Tsukiji', 'Petit‑déjeuner', 'Fruits de mer'], author: 'Explorateur gourmand' },
      '5': { title: 'Type d’hôtel conseillé pour un solo trip', summary: 'Première visite en solo à Tokyo. Conseils pour un hôtel sûr et économique ?', tags: ['Voyage solo', 'Hôtel', 'Tokyo'], author: 'Voyageur solo' },
      '6': { title: 'Les bases du savoir‑vivre à l’onsen', summary: 'Règles et usages essentiels pour les visiteurs étrangers aux bains chauds.', tags: ['Onsen', 'Étiquette', 'Culture'], author: 'Débutant onsen' },
      '7': { title: 'Itinéraire efficace à Fushimi Inari Taisha', summary: 'Temps pour parcourir les mille torii et recommandations d’itinéraire.', tags: ['Kyoto', 'Fushimi Inari', 'Sanctuaire'], author: 'Passionné de Kyoto' },
      '8': { title: 'Kushikatsu incontournables à Osaka', summary: 'Vieilles maisons recommandées par les locaux pour goûter les kushikatsu.', tags: ['Osaka', 'Kushikatsu', 'Gourmand'], author: 'Gourmet du Kansai' },
      '9': { title: 'Accès au 5e niveau du Mont Fuji', summary: 'Comment y aller depuis Tokyo et que faut‑il prévoir sur place ?', tags: ['Mont Fuji', '5e station', 'Transport'], author: 'Amateur de montagne' },
      '10': { title: 'Ryokan près de Kenrokuen (Kanazawa)', summary: 'Cherche un ryokan traditionnel à distance de marche du jardin Kenrokuen.', tags: ['Kanazawa', 'Kenrokuen', 'Ryokan'], author: 'Fan de ryokan' },
    },
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = qaData;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
      );
      console.log('GA4 Event: qa_search', { query: searchQuery, results: filtered.length });
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
      console.log('GA4 Event: qa_filter_change', { category: selectedCategory, results: filtered.length });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case 'views':
          return b.views - a.views;
        case 'votes':
          return b.votes - a.votes;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [searchQuery, selectedCategory, selectedSort]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  // Localize displayed items
  const displayPaginatedData = useMemo(() => {
    const pack = qaTranslations[currentLanguage as keyof typeof qaTranslations] || {};
    return paginatedData.map(item => ({
      ...item,
      ...(pack[item.id] || {}),
    }));
  }, [paginatedData, currentLanguage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page when filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Sushi Experience themed background */}
      <div
        aria-hidden="true"
        className="fixed inset-0"
        style={{
          zIndex: -1,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 20% 30%, rgba(220, 38, 127, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 165, 0, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.10) 0%, transparent 50%),
            linear-gradient(135deg,
              #1a1a2e 0%,
              #16213e 25%,
              #0f3460 50%,
              #533483 75%,
              #e94560 100%
            ),
            url("https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundBlendMode: 'overlay'
        }}
      />
      
      {/* Sushi elements overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0"
        style={{
          zIndex: -2,
          pointerEvents: 'none',
          background: `
            radial-gradient(200px 200px at 15% 25%, rgba(255, 99, 71, 0.2) 0%, transparent 70%),
            radial-gradient(150px 150px at 85% 75%, rgba(255, 215, 0, 0.15) 0%, transparent 70%),
            radial-gradient(180px 180px at 50% 50%, rgba(0, 128, 0, 0.1) 0%, transparent 70%)
          `,
          animation: 'sushiFloat 15s ease-in-out infinite alternate'
        }}
      />

      <style jsx>{`
        @keyframes sushiFloat {
          0% { 
            transform: translateX(-1%) translateY(-0.5%);
            opacity: 0.7;
          }
          100% { 
            transform: translateX(1%) translateY(0.5%);
            opacity: 0.9;
          }
        }
      `}</style>
      
      <div className="min-h-screen relative z-10" style={{ paddingTop: '120px' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ padding: '40px 20px' }}>
            <Hero />
                
            <Controls 
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedSort={selectedSort}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
            />

            {/* Q&A Grid */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
              {displayPaginatedData.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {displayPaginatedData.map((item) => (
                      <Card key={item.id} item={item} />
                    ))}
                  </div>
                  
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <EmptyState 
                  searchQuery={searchQuery}
                  category={selectedCategory}
                />
              )}
            </div>
            
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
