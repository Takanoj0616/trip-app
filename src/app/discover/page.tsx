'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DiscoverJapanPage() {
    const { t, currentLanguage } = useLanguage();

    // 多言語対応のコンテンツデータ
    const getPageContent = () => ({
        hero: {
            title: currentLanguage === 'en' ? 'AI-Guided Journey Through Japan' :
                currentLanguage === 'ko' ? 'AI가 안내하는 일본 여행' :
                    currentLanguage === 'fr' ? 'Voyage au Japon guidé par l\'IA' :
                        'AIが案内する日本の旅',
            subtitle: currentLanguage === 'en' ? 'AI organizes travel information and creates easy-to-understand brochures. From tourist spots and gourmet information to transportation, we automatically generate guides that can be understood at a glance.' :
                currentLanguage === 'ko' ? 'AI가 여행 정보를 정리하고 이해하기 쉬운 브로셔를 만듭니다. 관광 명소와 맛집 정보, 교통수단까지 한눈에 이해할 수 있는 가이드를 자동으로 생성합니다.' :
                    currentLanguage === 'fr' ? 'L\'IA organise les informations de voyage et crée des brochures faciles à comprendre. Des sites touristiques aux informations gastronomiques en passant par les moyens de transport, nous générons automatiquement des guides compréhensibles en un coup d\'œil.' :
                        'AIが旅行情報を整理し、わかりやすいパンフレットにまとめます。観光スポットやグルメ情報、移動手段まで、一目で理解できるガイドを自動で生成します。'
        },
        sections: [
            {
                id: 'culture',
                title: currentLanguage === 'en' ? 'Explore Area Attractions' :
                    currentLanguage === 'ko' ? '지역별 매력 탐색' :
                        currentLanguage === 'fr' ? 'Explorer les attractions par région' :
                            'エリアごとの魅力を探索',
                description: currentLanguage === 'en' ? 'Let\'s explore the charm of each area. First, select Tokyo from "Areas" and check out tourist spots on the detail page!' :
                    currentLanguage === 'ko' ? '지역별 매력을 탐험해봅시다. 먼저 "지역"에서 도쿄를 선택하고 상세 페이지에서 관광 명소를 확인해보세요!' :
                        currentLanguage === 'fr' ? 'Explorons le charme de chaque région. Commencez par sélectionner Tokyo dans "Régions" et découvrez les sites touristiques sur la page de détail !' :
                            'エリアごとの魅力を探してみましょう。まずは「エリア」から東京を選んで、詳細ページで観光スポットをチェック！',
                image: '/images/discover/1.png',
                features: [
                    currentLanguage === 'en' ? 'Tokyo Area Guide' :
                        currentLanguage === 'ko' ? '도쿄 지역 가이드' :
                            currentLanguage === 'fr' ? 'Guide de la région de Tokyo' :
                                '東京エリアガイド',

                    currentLanguage === 'en' ? 'Tourist Spot Details' :
                        currentLanguage === 'ko' ? '관광 명소 상세 정보' :
                            currentLanguage === 'fr' ? 'Détails des sites touristiques' :
                                '観光スポット詳細',

                    currentLanguage === 'en' ? 'Easy Navigation' :
                        currentLanguage === 'ko' ? '쉬운 내비게이션' :
                            currentLanguage === 'fr' ? 'Navigation facile' :
                                '簡単ナビゲーション'
                ]
            },
            {
                id: 'nature',
                title: currentLanguage === 'en' ? 'Add to AI Travel Plan' :
                    currentLanguage === 'ko' ? 'AI 여행 플랜에 추가' :
                        currentLanguage === 'fr' ? 'Ajouter au plan de voyage IA' :
                            'AI旅行プランに追加',
                description: currentLanguage === 'en' ? 'Select a spot from "Areas" and open its detail page. Tap "Add to AI Travel Plan" to automatically add it to your custom itinerary.' :
                    currentLanguage === 'ko' ? '"지역"에서 장소를 선택해 상세 페이지로 이동하세요. 페이지에서 "AI 여행 플랜에 추가"를 누르면 나만의 여행 플랜에 자동으로 반영됩니다.' :
                        currentLanguage === 'fr' ? 'Sélectionnez un lieu depuis « Régions » puis ouvrez sa page détaillée. Appuyez sur « Ajouter au plan de voyage IA » pour l’ajouter automatiquement à votre itinéraire personnalisé.' :
                            '「エリア」からスポットを選んで詳細ページへ進みましょう。ページ内の「AI旅行プランに追加」を押せば、オリジナルの旅行プランに自動で反映されます。',
                image: '/images/discover/2.png',
                features: [
                    currentLanguage === 'en' ? 'Choose from Areas' :
                        currentLanguage === 'ko' ? '지역에서 선택' :
                            currentLanguage === 'fr' ? 'Choisir depuis Régions' :
                                '「エリア」から選ぶ',

                    currentLanguage === 'en' ? 'Open detail page' :
                        currentLanguage === 'ko' ? '상세 페이지 열기' :
                            currentLanguage === 'fr' ? 'Ouvrir la page détaillée' :
                                '詳細ページを開く',

                    currentLanguage === 'en' ? 'Add to AI Travel Plan' :
                        currentLanguage === 'ko' ? 'AI 여행 플랜에 추가' :
                            currentLanguage === 'fr' ? 'Ajouter au plan IA' :
                                'AI旅行プランに追加'
                ]
            },
            {
                id: 'cuisine',
                title: currentLanguage === 'en' ? 'Select Spots to Build AI Plan' :
                    currentLanguage === 'ko' ? '스팟을 선택해 AI 플랜 생성' :
                        currentLanguage === 'fr' ? 'Sélectionnez des lieux et créez un plan IA' :
                            'スポットを選んでAI旅行プラン作成',
                description: currentLanguage === 'en' ? 'When you select two or more spots, the AI Trip Plan screen opens and automatically builds a personalized itinerary that considers travel time and cost. You can add spots from the detail page using “Add to AI Travel Plan”.' :
                    currentLanguage === 'ko' ? '가고 싶은 스팟을 2곳 이상 선택하면 AI 여행 플랜 화면이 열리고, 이동 시간과 요금을 고려한 맞춤형 플랜이 자동으로 생성됩니다. 상세 페이지의 “AI 여행 플랜에 추가”에서 스팟을 추가할 수 있습니다.' :
                        currentLanguage === 'fr' ? 'Lorsque vous sélectionnez deux lieux ou plus, l’écran de plan IA s’ouvre et crée automatiquement un itinéraire personnalisé en tenant compte du temps de trajet et des coûts. Ajoutez des lieux depuis la page de détail via « Ajouter au plan de voyage IA ».' :
                            '行きたいスポットを2つ以上選ぶと、AI旅行プラン作成画面が開きます。移動時間や料金を考慮したあなただけのプランを自動で作成します。詳細ページの「AI旅行プランに追加」からスポットを追加できます。',
                image: '/images/discover/3.png',
                features: [
                    currentLanguage === 'en' ? 'Select 2+ spots' :
                        currentLanguage === 'ko' ? '스팟 2개 이상 선택' :
                            currentLanguage === 'fr' ? 'Sélectionnez 2 lieux ou plus' :
                                'スポットを2つ以上選択',

                    currentLanguage === 'en' ? 'Open AI Plan Builder' :
                        currentLanguage === 'ko' ? 'AI 여행 플랜 화면 열림' :
                            currentLanguage === 'fr' ? 'Ouvrir l\'éditeur de plan IA' :
                                'AI旅行プラン作成画面が開く',

                    currentLanguage === 'en' ? 'Auto-optimizes time & cost' :
                        currentLanguage === 'ko' ? '이동 시간·요금 자동 최적화' :
                            currentLanguage === 'fr' ? 'Optimisation automatique temps et coûts' :
                                '移動時間・料金を自動最適化'
                ]
            },
            {
                id: 'modern',
                title: currentLanguage === 'en' ? 'AI Routes & Transit Tips' :
                    currentLanguage === 'ko' ? 'AI 경로와 교통 팁' :
                        currentLanguage === 'fr' ? 'Itinéraires IA et conseils transport' :
                            'AI最適ルートと交通アドバイス',
                description: currentLanguage === 'en' ? 'Check AI-selected optimal routes and transit advice. Press the button to get tips that make your trip smoother — see recommended routes, transfers, time and fare estimates at a glance.' :
                    currentLanguage === 'ko' ? 'AI가 선정한 최적 경로와 교통 조언을 확인하세요. 버튼을 누르면 여행을 더 편하게 해주는 팁을 받을 수 있습니다 — 추천 경로, 환승, 소요 시간과 요금까지 한눈에 확인.' :
                        currentLanguage === 'fr' ? 'Consultez les itinéraires optimaux choisis par l’IA et ses conseils transport. Appuyez sur le bouton pour obtenir des astuces qui rendent le voyage plus fluide — itinéraires, correspondances, temps et coûts en un coup d’œil.' :
                            'AIが選んだ最適ルートと交通アドバイスをチェック！ボタンを押せば、旅をもっと快適に楽しむヒントが手に入ります。おすすめルート、乗換、所要時間や料金の目安もまとめて確認できます。',
                image: '/images/discover/4.png',
                features: [
                    currentLanguage === 'en' ? 'AI optimal route' :
                        currentLanguage === 'ko' ? 'AI 최적 경로' :
                            currentLanguage === 'fr' ? 'Itinéraire optimal IA' :
                                'AI最適ルート',

                    currentLanguage === 'en' ? 'Transit & transfer advice' :
                        currentLanguage === 'ko' ? '교통 · 환승 조언' :
                            currentLanguage === 'fr' ? 'Conseils transport et correspondances' :
                                '交通・乗換アドバイス',

                    currentLanguage === 'en' ? 'One-tap travel tips' :
                        currentLanguage === 'ko' ? '원탭 여행 팁' :
                            currentLanguage === 'fr' ? 'Astuces de voyage en un clic' :
                                'ワンタップで旅のヒント'
                ]
            }
        ]
    });

    const content = getPageContent();

    return (
        <div className="min-h-screen" style={{
            background: `
        linear-gradient(135deg, rgba(255, 182, 193, 0.3) 0%, rgba(255, 218, 185, 0.2) 25%, rgba(255, 240, 245, 0.3) 50%, rgba(255, 228, 225, 0.2) 75%, rgba(255, 245, 238, 0.3) 100%),
        url("https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80")
      `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            minHeight: "100vh"
        }}>
            {/* Hero Section */}
            <section style={{
                height: '70vh',
                background: `
          linear-gradient(rgba(255, 182, 193, 0.2), rgba(255, 218, 185, 0.3)),
          linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)),
          url("https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")
        `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                paddingTop: '120px'
            }}>
                <div style={{
                    maxWidth: '800px',
                    padding: '0 2rem',
                    animation: 'fadeInUp 1.2s ease-out'
                }}>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        fontWeight: 'bold',
                        marginBottom: '1.5rem',
                        color: '#ffffff',
                        textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
                        lineHeight: 1.2
                    }}>
                        {content.hero.title}
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                        opacity: 0.95,
                        color: '#f1f5f9',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                        lineHeight: 1.6,
                        marginBottom: '2rem'
                    }}>
                        {content.hero.subtitle}
                    </p>

                    {/* Breadcrumb */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem',
                        opacity: 0.8
                    }}>
                        <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                            {currentLanguage === 'en' ? 'Home' :
                                currentLanguage === 'ko' ? '홈' :
                                    currentLanguage === 'fr' ? 'Accueil' :
                                        'ホーム'}
                        </Link>
                        <span style={{ color: '#64748b' }}>→</span>
                        <span style={{ color: '#ffffff' }}>{content.hero.title}</span>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '4rem 2rem'
            }}>
                {content.sections.map((section, index) => (
                    <section
                        key={section.id}
                        style={{
                            marginBottom: '6rem',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                            animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
                        }}
                    >
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: index % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
                            minHeight: '500px'
                        }}>
                            {/* Image */}
                            <div style={{
                                order: index % 2 === 0 ? 1 : 2,
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <Image
                                    src={section.image}
                                    alt={section.title}
                                    fill
                                    style={{
                                        objectFit: section.id === 'cuisine' ? 'contain' : 'cover',
                                        objectPosition: 'center',
                                        backgroundColor: section.id === 'cuisine' ? '#f3f4f6' : undefined,
                                        transition: 'transform 0.5s ease'
                                    }}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                />
                            </div>

                            {/* Content */}
                            <div style={{
                                order: index % 2 === 0 ? 2 : 1,
                                padding: '3rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <h2 style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    marginBottom: '1.5rem',
                                    color: '#1e293b',
                                    lineHeight: 1.2
                                }}>
                                    {section.title}
                                </h2>

                                <p style={{
                                    fontSize: '1.1rem',
                                    lineHeight: 1.7,
                                    color: '#475569',
                                    marginBottom: '2rem'
                                }}>
                                    {section.description}
                                </p>

                                {/* Features */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}>
                                    {section.features.map((feature, featureIndex) => (
                                        <div
                                            key={featureIndex}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem 1rem',
                                                background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                                                borderRadius: '12px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'linear-gradient(135deg, #ddd6fe, #c7d2fe)';
                                                e.currentTarget.style.transform = 'translateX(8px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'linear-gradient(135deg, #f1f5f9, #e2e8f0)';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                background: '#3b82f6',
                                                borderRadius: '50%'
                                            }}></div>
                                            <span style={{
                                                fontSize: '1rem',
                                                fontWeight: '500',
                                                color: '#374151'
                                            }}>
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                ))}

                {/* Call to Action */}
                <section style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    background: `
            linear-gradient(135deg, rgba(255, 182, 193, 0.2), rgba(255, 218, 185, 0.2)),
            linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))
          `,
                    borderRadius: '24px',
                    marginTop: '4rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 182, 193, 0.3)'
                }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}>
                        {currentLanguage === 'en' ? 'Ready to Start Your Journey?' :
                            currentLanguage === 'ko' ? '여행을 시작할 준비가 되셨나요?' :
                                currentLanguage === 'fr' ? 'Prêt à commencer votre voyage ?' :
                                    '旅を始める準備はできましたか？'}
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#e2e8f0',
                        marginBottom: '2rem',
                        opacity: 0.9
                    }}>
                        {currentLanguage === 'en' ? 'Explore our curated destinations and create unforgettable memories' :
                            currentLanguage === 'ko' ? '엄선된 목적지를 탐험하고 잊을 수 없는 추억을 만드세요' :
                                currentLanguage === 'fr' ? 'Explorez nos destinations sélectionnées et créez des souvenirs inoubliables' :
                                    '厳選された目的地を探索し、忘れられない思い出を作りましょう'}
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link
                            href="/areas"
                            style={{
                                padding: '1rem 2.5rem',
                                fontSize: '1.1rem',
                                borderRadius: '50px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                color: 'white',
                                border: 'none',
                                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                                display: 'inline-block'
                            }}
                            onMouseEnter={(e) => {
                                const target = e.currentTarget as HTMLAnchorElement;
                                target.style.transform = 'translateY(-3px) scale(1.05)';
                                target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                const target = e.currentTarget as HTMLAnchorElement;
                                target.style.transform = 'translateY(0) scale(1)';
                                target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                            }}
                        >
                            {currentLanguage === 'en' ? '🗾 Explore Areas' :
                                currentLanguage === 'ko' ? '🗾 지역 탐험' :
                                    currentLanguage === 'fr' ? '🗾 Explorer les régions' :
                                        '🗾 エリアを探索'}
                        </Link>

                        <Link
                            href="/ai-plan"
                            style={{
                                padding: '1rem 2.5rem',
                                fontSize: '1.1rem',
                                borderRadius: '50px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                                color: 'white',
                                border: '2px solid rgba(255, 255, 255, 0.5)',
                                backdropFilter: 'blur(15px)',
                                display: 'inline-block'
                            }}
                            onMouseEnter={(e) => {
                                const target = e.currentTarget as HTMLAnchorElement;
                                target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))';
                                target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                                target.style.transform = 'translateY(-3px) scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                const target = e.currentTarget as HTMLAnchorElement;
                                target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
                                target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                                target.style.transform = 'translateY(0) scale(1)';
                            }}
                        >
                            {currentLanguage === 'en' ? '🤖 AI Travel Plan' :
                                currentLanguage === 'ko' ? '🤖 AI 여행 계획' :
                                    currentLanguage === 'fr' ? '🤖 Plan de voyage IA' :
                                        '🤖 AI旅行プラン'}
                        </Link>
                    </div>
                </section>
            </div>



            {/* Animation Styles */}
            <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        

        
        @media (max-width: 768px) {
          section > div {
            grid-template-columns: 1fr !important;
          }
          
          section > div > div:first-child {
            order: 1 !important;
            height: 300px;
          }
          
          section > div > div:last-child {
            order: 2 !important;
            padding: 2rem !important;
          }
        }
      `}</style>
        </div>
    );
}
