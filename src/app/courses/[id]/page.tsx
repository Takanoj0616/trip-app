'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Clock, Users, Star, Calendar, Navigation, ArrowLeft, Camera, Info } from 'lucide-react';
import SakuraBackground from '@/components/SakuraBackground';
import { useLanguage } from '@/contexts/LanguageContext';


interface CourseStop {
  time: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  image?: string;
  duration?: string;
}

interface ModelCourse {
  id: string;
  title: string;
  subtitle: string;
  area: string;
  theme: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  totalTime: string;
  image: string;
  stops: CourseStop[];
  tips?: string[];
  bestSeason?: string;
  recommendedFor?: string[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const searchParams = useSearchParams();
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();

  // Sync URL ?lang with context and react to header language changes
  useEffect(() => {
    const urlLang = searchParams?.get('lang');
    if (urlLang && urlLang !== currentLanguage) {
      setCurrentLanguage(urlLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (currentLanguage) {
      url.searchParams.set('lang', currentLanguage);
      window.history.replaceState({}, '', url.toString());
    }
  }, [currentLanguage]);

  useEffect(() => {
    // Inject Google Fonts and FontAwesome
    const fontLinks = document.createElement('link');
    fontLinks.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
    fontLinks.rel = 'stylesheet';
    document.head.appendChild(fontLinks);

    const fontAwesome = document.createElement('link');
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    fontAwesome.rel = 'stylesheet';
    document.head.appendChild(fontAwesome);

    return () => {
      try {
        if (fontLinks && document.contains(fontLinks)) {
          fontLinks.remove();
        }
        if (fontAwesome && document.contains(fontAwesome)) {
          fontAwesome.remove();
        }
      } catch (error) {
        // Silent fail - cleanup is non-critical
      }
    };
  }, []);

  // Local i18n for labels used only on this page
  const i18n = {
    ja: {
      notFound: 'コースが見つかりません',
      backToList: 'コース一覧に戻る',
      timeline: 'タイムライン',
      stayDuration: '滞在時間',
      tips: 'コツ・注意点',
      recommendInfo: 'おすすめ情報',
      bestSeason: 'ベストシーズン',
      recommendedFor: 'こんな方におすすめ',
    },
    en: {
      notFound: 'Course not found',
      backToList: 'Back to Courses',
      timeline: 'Timeline',
      stayDuration: 'Stay Duration',
      tips: 'Tips & Notes',
      recommendInfo: 'Recommended Info',
      bestSeason: 'Best Season',
      recommendedFor: 'Recommended For',
    },
    ko: {
      notFound: '코스를 찾을 수 없습니다',
      backToList: '코스 목록으로 돌아가기',
      timeline: '타임라인',
      stayDuration: '체류 시간',
      tips: '팁 및 유의사항',
      recommendInfo: '추천 정보',
      bestSeason: '최적의 시즌',
      recommendedFor: '이런 분께 추천',
    },
    fr: {
      notFound: 'Cours introuvable',
      backToList: 'Retour à la liste',
      timeline: 'Chronologie',
      stayDuration: 'Durée de séjour',
      tips: 'Conseils & Remarques',
      recommendInfo: 'Infos recommandées',
      bestSeason: 'Meilleure saison',
      recommendedFor: 'Recommandé pour',
    },
  } as const;
  const L = (i18n as any)[currentLanguage] || (i18n as any).ja;

  const modelCourses: ModelCourse[] = [
    {
      id: 'akihabara-anime',
      title: '秋葉原 アニメ・ゲーム満喫コース',
      subtitle: '電気街から隠れた名店まで、秋葉原の魅力を1日で満喫する王道プランです。',
      area: '東京',
      theme: 'アニメ・ゲーム',
      duration: '1日',
      difficulty: 'beginner',
      tags: ['アニメ', 'ゲーム', '電気街', 'メイドカフェ'],
      totalTime: '約6時間',
      image: '/images/courses/akihabara.jpg',
      stops: [
        {
          time: '10:00',
          name: '秋葉原電気街',
          description: 'まずはここからスタート。最新ガジェットやアニメグッズが揃います。',
          location: { lat: 35.7022, lng: 139.7741 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
        {
          time: '12:00',
          name: 'お気に入りのメイドカフェでランチ',
          description: '秋葉原ならではの文化体験。非日常的な空間でランチを楽しみましょう。',
          location: { lat: 35.7015, lng: 139.7725 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '14:00',
          name: 'ガチャポン会館',
          description: '数百台のガチャガチャがずらり。思わぬお宝が見つかるかも？',
          location: { lat: 35.7009, lng: 139.7718 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '16:00',
          name: '東京アニメセンター',
          description: 'アニメの企画展やイベントが楽しめる情報発信拠点。',
          location: { lat: 35.6986, lng: 139.7742 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '平日の方が混雑を避けられます',
        'メイドカフェでは写真撮影のマナーを守りましょう',
        '小銭を多めに持参するとガチャポンを楽しめます'
      ],
      bestSeason: '通年',
      recommendedFor: ['アニメ好き', 'ゲーム好き', '初めての秋葉原']
    },
    {
      id: 'asakusa-traditional',
      title: '浅草 伝統文化体験コース',
      subtitle: '下町情緒あふれる浅草で、日本の伝統文化を肌で感じる特別な一日。',
      area: '東京',
      theme: '歴史・文化',
      duration: '1日',
      difficulty: 'beginner',
      tags: ['寺院', '伝統工芸', '下町', '着物'],
      totalTime: '約7時間',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=400&fit=crop',
      stops: [
        {
          time: '09:00',
          name: '浅草寺',
          description: '東京最古の寺院。雷門から仲見世通りを歩いて参拝しましょう。',
          location: { lat: 35.7148, lng: 139.7967 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1570611043142-e94640cdc5e5?w=400&h=300&fit=crop'
        },
        {
          time: '11:00',
          name: '着物レンタル・散策',
          description: '着物を着て浅草の街を散策。写真映えスポットもたくさん！',
          location: { lat: 35.7130, lng: 139.7950 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '13:00',
          name: '老舗天ぷら店でランチ',
          description: '創業100年を超える老舗で本格江戸前天ぷらを堪能。',
          location: { lat: 35.7140, lng: 139.7960 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        },
        {
          time: '15:00',
          name: '伝統工芸体験（江戸切子）',
          description: '職人さんから直接学ぶ江戸切子の世界。オリジナル作品が作れます。',
          location: { lat: 35.7120, lng: 139.7980 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '朝早めのスタートがおすすめ（混雑回避）',
        '着物レンタルは事前予約がお得です',
        '伝統工芸体験は完全予約制のため必ず事前予約を'
      ],
      bestSeason: '春・秋',
      recommendedFor: ['文化好き', '写真好き', '外国人観光客']
    },
    {
      id: 'shibuya-modern',
      title: '渋谷 最新トレンド体感コース',
      subtitle: '若者文化の発信地・渋谷で最新のトレンドとグルメを満喫するコース。',
      area: '東京',
      theme: 'トレンド・ファッション',
      duration: '半日',
      difficulty: 'intermediate',
      tags: ['ファッション', 'トレンド', 'グルメ', '夜景'],
      totalTime: '約5時間',
      image: '/images/courses/sibuya.jpg',
      stops: [
        {
          time: '14:00',
          name: '渋谷スカイ',
          description: '360度パノラマビューで渋谷の街を一望。絶好の撮影スポット。',
          location: { lat: 35.6580, lng: 139.7016 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
        },
        {
          time: '15:30',
          name: 'センター街・竹下通り散策',
          description: '最新トレンドをチェック。若者文化の聖地を歩きます。',
          location: { lat: 35.6698, lng: 139.7036 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
        {
          time: '17:00',
          name: '話題のカフェでスイーツタイム',
          description: 'SNSで話題のフォトジェニックなスイーツでひと休み。',
          location: { lat: 35.6590, lng: 139.7005 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '19:00',
          name: '渋谷の夜景ディナー',
          description: '高層階レストランで夜景を楽しみながらのディナー。',
          location: { lat: 35.6595, lng: 139.7020 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '土日は非常に混雑するため平日がおすすめ',
        '渋谷スカイは事前予約推奨',
        '夕方からのスタートで夜景まで楽しめます'
      ],
      bestSeason: '通年',
      recommendedFor: ['若者', 'SNS好き', 'デートコース']
    },
    {
      id: 'tsukiji-gourmet',
      title: '築地 グルメ満喫コース',
      subtitle: '世界最大級の魚市場で新鮮な海の幸と伝統の味を堪能する美食の旅。',
      area: '東京',
      theme: 'グルメ',
      duration: '半日',
      difficulty: 'beginner',
      tags: ['寿司', '海鮮', '市場', '早朝'],
      totalTime: '約4時間',
      image: '/images/courses/tsukiji.jpg',
      stops: [
        {
          time: '05:30',
          name: '築地場外市場',
          description: '活気あふれる市場で新鮮な魚介類を見学。マグロの解体ショーは必見！',
          location: { lat: 35.6654, lng: 139.7707 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        },
        {
          time: '07:00',
          name: '有名寿司店で朝食',
          description: '築地ならではの新鮮なネタで握られた絶品寿司を朝から堪能。',
          location: { lat: 35.6645, lng: 139.7712 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        },
        {
          time: '08:30',
          name: '築地本願寺',
          description: '珍しいインド仏教風の建築が印象的な寺院で心を清める。',
          location: { lat: 35.6685, lng: 139.7721 },
          duration: '30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '09:30',
          name: '浜離宮恩賜庭園',
          description: '海水を取り入れた珍しい日本庭園で都心のオアシスを満喫。',
          location: { lat: 35.6597, lng: 139.7634 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '早朝5時スタートがおすすめ（市場の活気を体験）',
        '歩きやすい靴と汚れても良い服装で',
        '現金を多めに持参（市場では現金決済が多い）'
      ],
      bestSeason: '通年',
      recommendedFor: ['グルメ好き', '早起きが得意', '市場体験したい人']
    },
    {
      id: 'ueno-museum',
      title: '上野 ミュージアム巡りコース',
      subtitle: '日本最大の文化エリアで芸術と歴史に触れる知的な一日。',
      area: '東京',
      theme: 'アート・美術館',
      duration: '1日',
      difficulty: 'intermediate',
      tags: ['美術館', '博物館', '文化', 'パンダ'],
      totalTime: '約8時間',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      stops: [
        {
          time: '09:00',
          name: '東京国立博物館',
          description: '日本最古の博物館で国宝・重要文化財を含む貴重なコレクションを鑑賞。',
          location: { lat: 35.7188, lng: 139.7767 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '11:30',
          name: '国立西洋美術館',
          description: 'ル・コルビュジエ設計の建物で西洋美術の名作を堪能。',
          location: { lat: 35.7156, lng: 139.7759 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '13:00',
          name: 'パークサイドカフェでランチ',
          description: '美術館併設のおしゃれなカフェで芸術談義。',
          location: { lat: 35.7150, lng: 139.7765 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '14:30',
          name: '上野動物園',
          description: '日本最古の動物園でパンダをはじめ様々な動物に会える。',
          location: { lat: 35.7167, lng: 139.7714 },
          duration: '2時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '17:00',
          name: '上野公園散策',
          description: '桜の名所としても有名な公園でゆったりと夕暮れを楽しむ。',
          location: { lat: 35.7140, lng: 139.7744 },
          duration: '30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '博物館・美術館は月曜日休館が多いので注意',
        '学生証があれば割引料金で入場可能',
        '各施設の特別展情報を事前にチェック'
      ],
      bestSeason: '通年（春は桜も楽しめる）',
      recommendedFor: ['アート好き', '文化好き', 'ファミリー']
    },
    {
      id: 'harajuku-kawaii',
      title: '原宿 カワイイ文化体験コース',
      subtitle: '日本のポップカルチャーの発信地でカワイイの最先端を体感。',
      area: '東京',
      theme: 'ファッション・サブカル',
      duration: '半日',
      difficulty: 'beginner',
      tags: ['ファッション', 'カワイイ', 'ポップカルチャー', 'コスプレ'],
      totalTime: '約5時間',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
      stops: [
        {
          time: '11:00',
          name: '竹下通り',
          description: 'カワイイ文化の聖地。ユニークなファッションアイテムが勢ぞろい。',
          location: { lat: 35.6702, lng: 139.7066 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
        {
          time: '12:30',
          name: 'カワイイモンスターカフェ',
          description: '奇想天外な世界観のテーマカフェでランチ体験。',
          location: { lat: 35.6698, lng: 139.7036 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '14:30',
          name: 'ラフォーレ原宿',
          description: '若者ファッションの最前線。個性的なブランドが集結。',
          location: { lat: 35.6693, lng: 139.7055 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
        {
          time: '16:00',
          name: '表参道ヒルズ',
          description: 'ハイエンドブランドとカルチャーが融合するショッピング空間。',
          location: { lat: 35.6654, lng: 139.7105 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '週末は非常に混雑するため平日がおすすめ',
        'コスプレイヤーとの写真撮影は許可を得てから',
        '個性的なファッションで街歩きを楽しんで'
      ],
      bestSeason: '通年',
      recommendedFor: ['ファッション好き', '若者', 'SNS映え重視']
    },
    {
      id: 'shinjuku-nightlife',
      title: '新宿 ナイトライフ満喫コース',
      subtitle: '眠らない街・新宿で大人の夜を楽しむエンターテイメントコース。',
      area: '東京',
      theme: 'ナイトライフ',
      duration: '夜',
      difficulty: 'intermediate',
      tags: ['居酒屋', 'バー', '夜景', '歓楽街'],
      totalTime: '約6時間',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop',
      stops: [
        {
          time: '18:00',
          name: '新宿南口 思い出横丁',
          description: '昭和レトロな雰囲気の小さな飲み屋街で乾杯！',
          location: { lat: 35.6896, lng: 139.7006 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
        },
        {
          time: '20:00',
          name: '歌舞伎町散策',
          description: '日本最大の歓楽街の雰囲気を味わいながら街歩き。',
          location: { lat: 35.6945, lng: 139.7021 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
        },
        {
          time: '21:30',
          name: '新宿パークハイアット バー',
          description: '高層階から新宿の夜景を眺めながら上質なカクテルタイム。',
          location: { lat: 35.6851, lng: 139.6966 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
        },
        {
          time: '24:00',
          name: 'ゴールデン街',
          description: '文人や芸能人が愛した小さなバーが軒を連ねる大人の社交場。',
          location: { lat: 35.6934, lng: 139.7046 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '20歳未満は入場できない施設があります',
        'ゴールデン街はチャージ料金を事前確認',
        '終電時間を考慮してプランを調整'
      ],
      bestSeason: '通年',
      recommendedFor: ['大人', 'お酒好き', '夜景好き']
    },
    {
      id: 'odaiba-future',
      title: 'お台場 未来体験コース',
      subtitle: '臨海エリアで最新テクノロジーとエンターテイメントを満喫。',
      area: '東京',
      theme: 'テクノロジー・エンタメ',
      duration: '1日',
      difficulty: 'beginner',
      tags: ['科学館', 'テクノロジー', '温泉', '夜景'],
      totalTime: '約8時間',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      stops: [
        {
          time: '10:00',
          name: '日本科学未来館',
          description: '最先端の科学技術を体験できるインタラクティブな展示が魅力。',
          location: { lat: 35.6197, lng: 139.7768 },
          duration: '2時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '13:00',
          name: 'アクアシティお台場でランチ',
          description: '海を眺めながら様々なグルメを楽しめるフードコート。',
          location: { lat: 35.6242, lng: 139.7744 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '14:30',
          name: 'チームラボボーダレス',
          description: 'デジタルアートの世界に没入する革新的なミュージアム体験。',
          location: { lat: 35.6256, lng: 139.7840 },
          duration: '2時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '17:30',
          name: '大江戸温泉物語',
          description: '江戸情緒あふれる温泉テーマパークで一日の疲れを癒す。',
          location: { lat: 35.6198, lng: 139.7856 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        'チームラボは事前予約必須',
        '歩きやすい服装（科学館は体験展示が多い）',
        '温泉用のタオルは有料レンタルまたは持参'
      ],
      bestSeason: '通年',
      recommendedFor: ['ファミリー', 'テクノロジー好き', 'アート好き']
    },
    {
      id: 'kichijoji-local',
      title: '吉祥寺 ローカル満喫コース',
      subtitle: '住みたい街ランキング上位の吉祥寺で地元の魅力を発見。',
      area: '東京',
      theme: 'ローカル・住宅街',
      duration: '半日',
      difficulty: 'beginner',
      tags: ['公園', 'ショッピング', 'カフェ', 'ローカル'],
      totalTime: '約5時間',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      stops: [
        {
          time: '10:00',
          name: '井の頭恩賜公園',
          description: '四季を通じて美しい自然を楽しめる都市公園の名所。',
          location: { lat: 35.6989, lng: 139.5804 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '12:00',
          name: 'ハモニカ横丁',
          description: '戦後から続く小さな飲み屋街で昼から地元の雰囲気を体験。',
          location: { lat: 35.7043, lng: 139.5798 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
        },
        {
          time: '14:00',
          name: '吉祥寺サンロード商店街',
          description: '地元の人々に愛される商店街でお買い物とカフェ巡り。',
          location: { lat: 35.7045, lng: 139.5793 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
        {
          time: '15:30',
          name: 'ジブリ美術館',
          description: 'スタジオジブリの世界観を体験できる夢いっぱいの美術館。',
          location: { lat: 35.6962, lng: 139.5704 },
          duration: '30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        'ジブリ美術館は完全予約制（日時指定券）',
        '井の頭公園は桜の季節（3-4月）が特におすすめ',
        'ハモニカ横丁は夕方からの時間帯がより雰囲気Good'
      ],
      bestSeason: '春・秋',
      recommendedFor: ['ジブリ好き', '自然好き', '地元文化体験']
    },
    {
      id: 'roppongi-art',
      title: '六本木 アートトライアングル',
      subtitle: '国際的なアート地区で現代美術とナイトライフを満喫。',
      area: '東京',
      theme: 'アート・ナイトライフ',
      duration: '1日',
      difficulty: 'advanced',
      tags: ['現代アート', '美術館', 'バー', '国際的'],
      totalTime: '約9時間',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      stops: [
        {
          time: '10:00',
          name: '森美術館',
          description: '現代アートの最前線を紹介する高層階にある美術館。',
          location: { lat: 35.6606, lng: 139.7298 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '12:30',
          name: 'サントリー美術館',
          description: '日本の美意識を現代に伝える「生活の中の美」をテーマとした美術館。',
          location: { lat: 35.6693, lng: 139.7316 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '14:30',
          name: '国立新美術館',
          description: '建築美も楽しめる日本最大級の展示スペースを持つ美術館。',
          location: { lat: 35.6652, lng: 139.7265 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '17:00',
          name: '毛利庭園散策',
          description: '六本木ヒルズに隣接する日本庭園で都心のオアシスを体験。',
          location: { lat: 35.6594, lng: 139.7297 },
          duration: '30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '19:00',
          name: '六本木の高級バー',
          description: '国際的な雰囲気の中で上質なカクテルと夜景を楽しむ。',
          location: { lat: 35.6627, lng: 139.7312 },
          duration: '3時間',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '美術館は月曜休館が多いので事前確認',
        '六本木は夜遅くまで営業している店が多い',
        '各美術館の特別展情報をチェック'
      ],
      bestSeason: '通年',
      recommendedFor: ['アート好き', '大人', '国際的な雰囲気好き']
    },
    {
      id: 'sumida-traditional',
      title: '墨田 下町伝統コース',
      subtitle: '東京スカイツリーと江戸情緒が共存する下町エリアを満喫。',
      area: '東京',
      theme: '伝統・下町',
      duration: '1日',
      difficulty: 'beginner',
      tags: ['スカイツリー', '下町', '伝統工芸', '相撲'],
      totalTime: '約7時間',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      stops: [
        {
          time: '09:00',
          name: '東京スカイツリー',
          description: '世界第2位の高さを誇る電波塔から東京の絶景を一望。',
          location: { lat: 35.7101, lng: 139.8107 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '11:30',
          name: 'すみだ水族館',
          description: 'スカイツリータウン内にある都市型水族館で癒しのひととき。',
          location: { lat: 35.7100, lng: 139.8108 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '13:30',
          name: '向島・長命寺桜もち',
          description: '江戸時代から続く老舗で本物の桜餅を味わう。',
          location: { lat: 35.7189, lng: 139.8075 },
          duration: '45分',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        },
        {
          time: '15:00',
          name: '両国国技館周辺散策',
          description: '相撲の聖地で大相撲の歴史と文化に触れる。',
          location: { lat: 35.6966, lng: 139.7928 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '16:30',
          name: '江戸東京博物館',
          description: '江戸から東京への歴史の変遷を体験型展示で学ぶ。',
          location: { lat: 35.6966, lng: 139.7935 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        'スカイツリーは事前予約で待ち時間短縮',
        '桜餅は売り切れ次第終了のため早めの訪問を',
        '両国では相撲部屋の朝稽古見学も可能（要事前確認）'
      ],
      bestSeason: '通年',
      recommendedFor: ['ファミリー', '日本文化好き', '絶景好き']
    },
    {
      id: 'daikanyama-sophisticated',
      title: '代官山 洗練された大人コース',
      subtitle: 'おしゃれなセレクトショップとカフェが集まる洗練された街を散策。',
      area: '東京',
      theme: 'ファッション・ライフスタイル',
      duration: '半日',
      difficulty: 'intermediate',
      tags: ['セレクトショップ', 'カフェ', '雑貨', '大人'],
      totalTime: '約4時間',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
      stops: [
        {
          time: '11:00',
          name: '代官山T-SITE',
          description: 'ライフスタイル提案型の複合施設で本とカルチャーに浸る。',
          location: { lat: 35.6499, lng: 139.6979 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
        {
          time: '13:00',
          name: '八雲茶寮でランチ',
          description: '和モダンな空間で旬の食材を使った創作料理を堪能。',
          location: { lat: 35.6485, lng: 139.6962 },
          duration: '1時間15分',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        },
        {
          time: '14:30',
          name: 'ヒルサイドテラス',
          description: '建築美も楽しめる複合施設でセレクトショップ巡り。',
          location: { lat: 35.6507, lng: 139.6966 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
        {
          time: '15:30',
          name: '猿楽町の隠れ家カフェ',
          description: '住宅街の中にある知る人ぞ知るスペシャリティコーヒー店。',
          location: { lat: 35.6515, lng: 139.6951 },
          duration: '15分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '平日の午前中は比較的空いています',
        '代官山は坂道が多いので歩きやすい靴で',
        '小さな路地にも素敵な店が隠れています'
      ],
      bestSeason: '通年',
      recommendedFor: ['大人女性', 'ライフスタイル重視', 'センスの良いもの好き']
    },
    {
      id: 'imperial-nature',
      title: '皇居 自然散策コース',
      subtitle: '都心の真ん中で豊かな自然と日本の歴史を感じる特別な体験。',
      area: '東京',
      theme: '自然・歴史',
      duration: '半日',
      difficulty: 'beginner',
      tags: ['皇居', '自然', '歴史', 'ジョギング'],
      totalTime: '約4時間',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      stops: [
        {
          time: '09:00',
          name: '皇居東御苑',
          description: '江戸城の遺構を見学しながら四季折々の自然を楽しむ。',
          location: { lat: 35.6852, lng: 139.7544 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '11:00',
          name: '皇居外苑・二重橋',
          description: '皇居の代表的な景観を楽しみながら記念撮影。',
          location: { lat: 35.6796, lng: 139.7544 },
          duration: '30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '12:00',
          name: '皇居周辺ランニングコース体験',
          description: '市民ランナーに人気の皇居周辺5kmコースをゆっくり散歩。',
          location: { lat: 35.6838, lng: 139.7530 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '13:30',
          name: '日比谷公園',
          description: '日本初の洋式公園で都市緑化の歴史を感じる。',
          location: { lat: 35.6742, lng: 139.7595 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '皇居東御苑は月・金曜日休園',
        '歩きやすい靴と服装で（結構歩きます）',
        '桜・紅葉の季節は特に美しいです'
      ],
      bestSeason: '春・秋',
      recommendedFor: ['自然好き', '歴史好き', '健康志向']
    },
    {
      id: 'yokohama-port',
      title: '横浜 港町ロマンチックコース',
      subtitle: '異国情緒あふれる港町横浜で歴史とロマンを感じる一日。',
      area: '神奈川',
      theme: '港町・異国情緒',
      duration: '1日',
      difficulty: 'beginner',
      tags: ['港', '中華街', '夜景', '異国情緒'],
      totalTime: '約8時間',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      stops: [
        {
          time: '10:00',
          name: '横浜中華街',
          description: '日本最大規模の中華街で本場の中華料理を堪能。',
          location: { lat: 35.4428, lng: 139.6458 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        },
        {
          time: '12:30',
          name: '山下公園',
          description: '海を眺めながらのんびり散歩。氷川丸も見学できます。',
          location: { lat: 35.4434, lng: 139.6503 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '14:00',
          name: '赤レンガ倉庫',
          description: '明治・大正時代の面影を残すレトロな倉庫群でショッピング。',
          location: { lat: 35.4526, lng: 139.6425 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '16:00',
          name: 'コスモワールド',
          description: 'みなとみらいのシンボル・コスモクロック21で空中散歩。',
          location: { lat: 35.4555, lng: 139.6380 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '17:30',
          name: 'ランドマークタワー展望フロア',
          description: '高さ273mから横浜港の夜景を一望する絶景スポット。',
          location: { lat: 35.4548, lng: 139.6317 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
        },
        {
          time: '19:00',
          name: 'クイーンズスクエア横浜でディナー',
          description: '港を眺めながら横浜グルメでディナータイム。',
          location: { lat: 35.4548, lng: 139.6317 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        'みなとみらい線の1日券がお得',
        '夕方からの時間帯で夜景も楽しめます',
        '中華街は食べ歩きグルメも豊富'
      ],
      bestSeason: '通年',
      recommendedFor: ['カップル', 'ファミリー', 'グルメ好き']
    },
    {
      id: 'kamakura-zen',
      title: '鎌倉 禅と自然体験コース',
      subtitle: '古都鎌倉で日本の精神文化と豊かな自然に心を委ねる癒しの旅。',
      area: '神奈川',
      theme: '禅・スピリチュアル',
      duration: '1日',
      difficulty: 'intermediate',
      tags: ['寺院', '禅', '大仏', '自然'],
      totalTime: '約7時間',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      stops: [
        {
          time: '09:00',
          name: '鶴岡八幡宮',
          description: '鎌倉のシンボル的存在の神社で心を清めてスタート。',
          location: { lat: 35.3258, lng: 139.5563 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '10:30',
          name: '建長寺',
          description: '鎌倉五山第一位の格式高い禅寺で座禅体験。',
          location: { lat: 35.3373, lng: 139.5482 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '12:30',
          name: '精進料理でランチ',
          description: 'お寺での精進料理体験で心と体を浄化。',
          location: { lat: 35.3350, lng: 139.5450 },
          duration: '1時間15分',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        },
        {
          time: '14:00',
          name: '高徳院・鎌倉大仏',
          description: '日本を代表する大仏様の前で静寂のひとときを。',
          location: { lat: 35.3167, lng: 139.5358 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '15:30',
          name: '長谷寺',
          description: '四季の花々と十一面観世音菩薩で知られる花の寺。',
          location: { lat: 35.3126, lng: 139.5337 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '17:00',
          name: '由比ヶ浜海岸',
          description: '夕陽を眺めながら一日の振り返りと感謝の時間。',
          location: { lat: 35.3063, lng: 139.5318 },
          duration: '1時間15分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '座禅体験は事前予約推奨',
        '歩きやすい靴必須（石段が多い）',
        '精進料理は予算に応じて選択可能'
      ],
      bestSeason: '春・秋',
      recommendedFor: ['精神的成長を求める人', '日本文化好き', '自然好き']
    }
  ];


  const course = modelCourses.find(c => c.id === courseId);

  // Per-course content translations for timeline/tips (fallback to JA data)
  const contentTranslations: Record<string, any> = {
    en: {
      'akihabara-anime': {
        stops: [
          { name: 'Akihabara Electric Town', description: 'Start here. Find the latest gadgets and anime goods.', duration: '2h' },
          { name: 'Lunch at a Maid Cafe', description: 'A unique cultural experience unique to Akihabara. Enjoy a whimsical lunch.', duration: '1h 30m' },
          { name: 'Gachapon Hall', description: 'Hundreds of capsule toy machines. You might find a hidden gem!', duration: '1h' },
          { name: 'Tokyo Anime Center', description: 'An information hub with special anime exhibits and events.', duration: '1h 30m' },
        ],
        tips: [
          'Weekdays are less crowded',
          'Follow photo etiquette at maid cafes',
          'Bring plenty of coins for gachapon',
        ],
        bestSeason: 'All year',
        recommendedFor: ['Anime fans', 'Game lovers', 'First-time visitors to Akihabara'],
      },
      'asakusa-traditional': {
        stops: [
          { name: 'Senso-ji Temple', description: "Tokyo's oldest temple. Walk from Kaminarimon Gate through Nakamise Street to the main hall.", duration: '1h 30m' },
          { name: 'Kimono Rental & Stroll', description: 'Wear a kimono and stroll around Asakusa. Plenty of photo-worthy spots!', duration: '2h' },
          { name: 'Tempura Lunch at a Historic Restaurant', description: 'Enjoy authentic Edo-style tempura at a century-old establishment.', duration: '1h' },
          { name: 'Traditional Craft Experience (Edo Kiriko)', description: 'Learn Edo Kiriko glass cutting directly from artisans and create your own piece.', duration: '2h' },
        ],
        tips: [
          'Start early to avoid crowds',
          'Kimono rentals are cheaper with reservations',
          'The craft experience requires advance reservation',
        ],
        bestSeason: 'Spring & Autumn',
        recommendedFor: ['Culture lovers', 'Photography lovers', 'International visitors'],
      },
      'shibuya-modern': {
        stops: [
          { name: 'Shibuya Sky', description: 'Enjoy a 360° panoramic view of Shibuya. A perfect photo spot.', duration: '1h' },
          { name: 'Center-Gai & Takeshita Street Walk', description: 'Check out the latest trends while exploring hubs of youth culture.', duration: '1h 30m' },
          { name: 'Trendy Cafe Sweets Time', description: 'Take a break with photogenic sweets trending on social media.', duration: '1h' },
          { name: 'Shibuya Night View Dinner', description: 'Enjoy dinner with stunning night views at a high-floor restaurant.', duration: '1h 30m' },
        ],
        tips: [
          'Avoid weekends due to heavy crowds',
          'Reserve Shibuya Sky in advance',
          'Start in the evening to enjoy the night views',
        ],
        bestSeason: 'All year',
        recommendedFor: ['Young travelers', 'SNS lovers', 'Date course'],
      },
      'tsukiji-gourmet': {
        stops: [
          { name: 'Tsukiji Outer Market', description: 'Lively market with fresh seafood. Tuna cutting shows are a must‑see!', duration: '1h 30m' },
          { name: 'Breakfast at a Famous Sushi Restaurant', description: 'Enjoy superb sushi with ultra-fresh toppings unique to Tsukiji.', duration: '1h' },
          { name: 'Ginza Stroll & Department Store Food Floor', description: 'Explore regional specialties in the basement food halls.', duration: '2h' },
          { name: 'Hamarikyu Gardens', description: 'A rare seawater-fed Japanese garden—an oasis in the city.', duration: '1h' },
        ],
        tips: [
          'Start at 5 AM to experience the market’s energy',
          'Wear comfortable shoes and clothes you don’t mind getting dirty',
          'Bring cash (many vendors are cash-only)',
        ],
        bestSeason: 'All year',
        recommendedFor: ['Gourmands', 'Early risers', 'Market explorers'],
      },
      'ueno-museum': {
        stops: [
          { name: 'Tokyo National Museum', description: "Japan's oldest museum with invaluable collections including National Treasures and Important Cultural Properties.", duration: '2h' },
          { name: 'The National Museum of Western Art', description: 'Enjoy masterpieces of Western art in a building designed by Le Corbusier.', duration: '1h 30m' },
          { name: 'Lunch at Parkside Cafe', description: 'A stylish cafe next to the museum—perfect for an art chat.', duration: '1h' },
          { name: 'Ueno Zoo', description: 'Japan’s oldest zoo—meet pandas and many other animals.', duration: '2h 30m' },
          { name: 'Ueno Park Stroll', description: 'Relax in the famous park known for cherry blossoms in spring.', duration: '30m' },
        ],
        tips: [
          'Many museums are closed on Mondays',
          'Student discounts available with ID',
          'Check special exhibition info in advance',
        ],
        bestSeason: 'All year (cherry blossoms in spring)',
        recommendedFor: ['Art lovers', 'Culture lovers', 'Families'],
      },
      'kichijoji-local': {
        stops: [
          { name: 'Inokashira Park', description: 'A beloved urban park with beautiful nature in all seasons.', duration: '1h 30m' },
          { name: 'Harmonica Yokocho', description: 'Atmospheric retro alleys with tiny bars—feel the local vibe.', duration: '1h 30m' },
          { name: 'Kichijoji Sunroad Shopping Street', description: 'Local shopping street with unique shops and cozy cafes.', duration: '1h 30m' },
          { name: 'Ghibli Museum', description: 'A dreamy museum where you can experience Studio Ghibli’s world.', duration: '30m' },
        ],
        tips: [
          'Ghibli Museum requires advance reservation (date/time ticket)',
          'Inokashira Park is especially beautiful during cherry blossom season (Mar–Apr)',
          'Harmonica Yokocho has the best atmosphere in the evening',
        ],
        bestSeason: 'Spring & Autumn',
        recommendedFor: ['Ghibli fans', 'Nature lovers', 'Local culture seekers'],
      },
      'roppongi-art': {
        stops: [
          { name: 'Mori Art Museum', description: 'A leading contemporary art museum on upper floors with great views.', duration: '2h' },
          { name: 'Suntory Museum of Art', description: 'A museum themed on “Beauty in Everyday Life” conveying Japanese aesthetics.', duration: '1h 30m' },
          { name: 'The National Art Center, Tokyo', description: 'One of Japan’s largest exhibition spaces with stunning architecture.', duration: '2h' },
          { name: 'Mohri Garden Stroll', description: 'A Japanese garden next to Roppongi Hills—an oasis in the city.', duration: '30m' },
          { name: 'High‑end Bar in Roppongi', description: 'Enjoy quality cocktails and night views in an international atmosphere.', duration: '3h' },
        ],
        tips: [
          'Many museums are closed on Mondays—check in advance',
          'Roppongi has many late‑night venues',
          'Check special exhibition schedules for each museum',
        ],
        bestSeason: 'All year',
        recommendedFor: ['Art lovers', 'Adults', 'Fans of international vibes'],
      },
      'odaiba-future': {
        stops: [
          { name: 'Miraikan (National Museum of Emerging Science)', description: 'Hands‑on exhibits to experience cutting‑edge science and technology.', duration: '2h 30m' },
          { name: 'Lunch at Aqua City Odaiba', description: 'Food court with various cuisines while enjoying ocean views.', duration: '1h' },
          { name: 'teamLab Borderless', description: 'An immersive and innovative digital art museum experience.', duration: '2h 30m' },
          { name: 'Oedo Onsen Monogatari', description: 'Relax in an Edo‑themed hot spring park after a full day.', duration: '1h 30m' },
        ],
        tips: [
          'Advance reservation required for teamLab',
          'Wear comfortable clothes (many hands‑on exhibits at the science museum)',
          'Bring or rent towels for the onsen',
        ],
        bestSeason: 'All year',
        recommendedFor: ['Families', 'Tech lovers', 'Art lovers'],
      },
      'sumida-traditional': {
        stops: [
          { name: 'Tokyo Skytree', description: 'Enjoy panoramic city views from one of the tallest towers in the world.', duration: '2h' },
          { name: 'Sumida Aquarium', description: 'A soothing urban aquarium inside Tokyo Skytree Town.', duration: '1h 30m' },
          { name: 'Mukojima Chomeiji Sakura Mochi', description: 'Taste authentic sakura mochi at a long‑established shop since the Edo period.', duration: '45m' },
          { name: 'Ryogoku Kokugikan Area Stroll', description: 'Experience the history and culture of sumo at its spiritual home.', duration: '1h' },
          { name: 'Edo‑Tokyo Museum', description: 'Learn the transition from Edo to Tokyo through interactive exhibits.', duration: '1h 30m' },
        ],
        tips: [
          'Reserve Skytree tickets in advance to shorten wait time',
          'Sakura mochi may sell out—visit earlier in the day',
          'Morning sumo training visits may be possible in Ryogoku (check in advance)',
        ],
        bestSeason: 'All year',
        recommendedFor: ['Families', 'Japanese culture lovers', 'View seekers'],
      },
      'harajuku-kawaii': {
        stops: [
          { name: 'Takeshita Street', description: 'The holy ground of Kawaii culture with unique fashion items lined up.', duration: '1h 30m' },
          { name: 'KAWAII MONSTER CAFE', description: 'A whimsical theme cafe experience with an out‑of‑this‑world vibe.', duration: '1h 30m' },
          { name: 'Laforet Harajuku', description: 'At the forefront of youth fashion with distinctive brands.', duration: '1h' },
          { name: 'Omotesando Hills', description: 'Shopping space where high‑end brands meet culture.', duration: '1h' },
        ],
        tips: [
          'Avoid weekends due to heavy crowds',
          'Ask for permission before taking photos with cosplayers',
          'Enjoy walking around in your own unique fashion',
        ],
        bestSeason: 'All year',
        recommendedFor: ['Fashion lovers', 'Young travelers', 'SNS photo seekers'],
      },
      'daikanyama-sophisticated': {
        stops: [
          { name: 'DAIKANYAMA T‑SITE', description: 'Lifestyle complex where you can immerse yourself in books and culture.', duration: '1h 30m' },
          { name: 'Lunch at Yakumo Saryo', description: 'Seasonal creative cuisine in a refined Japanese‑modern space.', duration: '1h 15m' },
          { name: 'Hillside Terrace', description: 'Select‑shop hopping in a complex also known for its architecture.', duration: '1h' },
          { name: 'Hidden Cafe in Sarugakucho', description: 'Specialty coffee in a quiet residential alley.', duration: '15m' },
        ],
        tips: [
          'Weekday mornings are relatively quiet',
          'Wear comfortable shoes—Daikanyama has many slopes',
          'Lovely small shops hide in narrow alleys—explore a bit',
        ],
        bestSeason: 'All year',
        recommendedFor: ['Adult women', 'Lifestyle‑focused', 'People with an eye for design'],
      },
      'imperial-nature': {
        stops: [
          { name: 'Imperial Palace East Gardens', description: 'Enjoy seasonal nature while exploring the remains of Edo Castle.', duration: '1h 30m' },
          { name: 'Outer Gardens & Nijubashi', description: 'Take commemorative photos with the Imperial Palace’s iconic scenery.', duration: '30m' },
          { name: 'Jogging Course Around the Palace', description: 'Leisurely walk a popular 5 km loop beloved by local runners.', duration: '1h' },
          { name: 'Hibiya Park', description: 'Japan’s first Western‑style park—feel the history of urban greenery.', duration: '1h' },
        ],
        tips: [
          'East Gardens closed on Mon and Fri',
          'Wear comfortable shoes and clothes (you will walk a lot)',
          'Best during cherry blossoms and autumn foliage',
        ],
        bestSeason: 'Spring & Autumn',
        recommendedFor: ['Nature lovers', 'History buffs', 'Health‑conscious travelers'],
      },
      'yokohama-port': {
        stops: [
          { name: 'Yokohama Chinatown', description: 'Japan’s largest Chinatown—enjoy authentic Chinese cuisine.', duration: '2h' },
          { name: 'Yamashita Park', description: 'Relaxing seaside stroll with a view of the Hikawa Maru.', duration: '1h' },
          { name: 'Red Brick Warehouse', description: 'Retro warehouses from the Meiji/Taisho eras—great for shopping.', duration: '1h 30m' },
          { name: 'Cosmo World', description: 'Soar on the Cosmo Clock 21 Ferris wheel, a Minato Mirai icon.', duration: '1h' },
          { name: 'Landmark Tower Observation Deck', description: 'Marvel at Yokohama’s night views from 273 m high.', duration: '1h' },
          { name: 'Dinner at Queen’s Square Yokohama', description: 'Dine with harbor views and savor Yokohama’s cuisine.', duration: '1h 30m' },
        ],
        tips: [
          'Minatomirai Line 1‑day pass is a good deal',
          'Evening start lets you enjoy night views too',
          'Chinatown is perfect for street‑food hopping',
        ],
        bestSeason: 'All year',
        recommendedFor: ['Couples', 'Families', 'Foodies'],
      },
      'kamakura-zen': {
        stops: [
          { name: 'Tsurugaoka Hachimangu Shrine', description: 'Cleanse your mind at Kamakura’s iconic shrine to start the day.', duration: '1h' },
          { name: 'Kencho‑ji Temple', description: 'Prestigious Zen temple—try seated meditation (zazen).', duration: '1h 30m' },
          { name: 'Shojin Ryori Lunch', description: 'Purify body and mind with Buddhist vegetarian cuisine.', duration: '1h 15m' },
          { name: 'Kotoku‑in Great Buddha', description: 'A quiet moment before Japan’s famous Great Buddha.', duration: '1h' },
          { name: 'Hasedera Temple', description: 'Temple of flowers known for the Eleven‑Faced Kannon.', duration: '1h' },
          { name: 'Yuigahama Beach', description: 'Reflect on the day while watching the sunset.', duration: '1h 15m' },
        ],
        tips: [
          'Reserve zazen sessions in advance',
          'Wear comfortable shoes (many stone steps)',
          'Shojin cuisine budgets vary—choose what suits you',
        ],
        bestSeason: 'Spring & Autumn',
        recommendedFor: ['Seeking spiritual growth', 'Japanese culture lovers', 'Nature lovers'],
      },
    },
    ko: {
      'akihabara-anime': {
        stops: [
          { name: '아키하바라 전자상가', description: '여기서 출발. 최신 가전과 애니 굿즈가 가득해요.', duration: '2시간' },
          { name: '메이드 카페에서 점심', description: '아키하바라만의 독특한 문화 체험. 색다른 분위기에서 점심 식사.', duration: '1시간 30분' },
          { name: '가챠폰 회관', description: '수백 대의 캡슐토이 기계. 뜻밖의 보물을 찾을지도!', duration: '1시간' },
          { name: '도쿄 애니메이션 센터', description: '애니 기획전과 이벤트를 즐길 수 있는 정보 발신 거점.', duration: '1시간 30분' },
        ],
        tips: [
          '평일 방문을 추천 (혼잡 회피)',
          '메이드 카페는 사진 촬영 매너를 지켜 주세요',
          '가챠폰을 위해 동전을 넉넉히 준비',
        ],
        bestSeason: '연중',
        recommendedFor: ['애니 팬', '게임 좋아하는 분', '아키하바라 첫 방문'],
      },
      'asakusa-traditional': {
        stops: [
          { name: '센소지', description: '도쿄에서 가장 오래된 사찰. 가미나리문에서 나카미세 거리를 걸어 본당까지 참배하세요.', duration: '1시간 30분' },
          { name: '기모노 대여 · 산책', description: '기모노를 입고 아사쿠사를 산책해 보세요. 사진 스팟이 아주 많아요!', duration: '2시간' },
          { name: '노포 텐푸라 점심', description: '100년 넘은 노포에서 정통 에도식 텐푸라를 만끽하세요.', duration: '1시간' },
          { name: '전통 공예 체험(에도키리코)', description: '장인에게 직접 배우는 에도키리코 유리 공예. 나만의 작품을 만들 수 있어요.', duration: '2시간' },
        ],
        tips: [
          '혼잡을 피하려면 이른 아침 출발 추천',
          '기모노 대여는 사전 예약이 유리해요',
          '전통 공예 체험은 완전 예약제로 반드시 사전 예약',
        ],
        bestSeason: '봄/가을',
        recommendedFor: ['문화 애호가', '사진 좋아하는 분', '해외 방문객'],
      },
      'shibuya-modern': {
        stops: [
          { name: '시부야 스카이', description: '시부야를 360° 파노라마로 조망. 최고의 사진 명소.', duration: '1시간' },
          { name: '센터가이 · 다케시타도리 산책', description: '최신 트렌드를 체크하며 청년 문화의 성지를 거닐기.', duration: '1시간 30분' },
          { name: '화제의 카페 스위트 타임', description: 'SNS에서 화제인 포토제닉한 디저트로 잠시 휴식.', duration: '1시간' },
          { name: '시부야 야경 디너', description: '고층 레스토랑에서 야경을 보며 즐기는 디너.', duration: '1시간 30분' },
        ],
        tips: [
          '주말은 매우 혼잡하므로 평일 추천',
          '시부야 스카이는 사전 예약 권장',
          '저녁부터 시작하면 야경까지 즐길 수 있어요',
        ],
        bestSeason: '연중',
        recommendedFor: ['젊은 여행자', 'SNS 좋아하는 분', '데이트 코스'],
      },
      'tsukiji-gourmet': {
        stops: [
          { name: '츠키지 장외시장', description: '활기가 넘치는 시장에서 신선한 해산물 관람. 참치 해체쇼는 필견!', duration: '1시간 30분' },
          { name: '유명 스시집 아침식사', description: '츠키지에서만 맛볼 수 있는 초신선한 재료의 일품 스시.', duration: '1시간' },
          { name: '긴자 산책 · 백화점 푸드홀', description: '전국 명산품이 모인 지하 식품 매장을 둘러보기.', duration: '2시간' },
          { name: '하마리큐 은사 정원', description: '바닷물을 끌어들인 드문 일본 정원. 도심 속 오아시스.', duration: '1시간' },
        ],
        tips: [
          '시장 분위기를 느끼려면 새벽 5시 시작 추천',
          '편한 신발과 더러워져도 괜찮은 복장',
          '현금 지참 (현금 결제가 많은 편)',
        ],
        bestSeason: '연중',
        recommendedFor: ['미식가', '아침형 인간', '시장 체험 원하는 분'],
      },
      'ueno-museum': {
        stops: [
          { name: '도쿄국립박물관', description: '일본에서 가장 오래된 박물관. 국보와 중요문화재 등 귀중한 컬렉션을 감상.', duration: '2시간' },
          { name: '국립서양미술관', description: '르 코르뷔지에가 설계한 건물에서 서양미술의 명작을 즐기기.', duration: '1시간 30분' },
          { name: '파크사이드 카페 점심', description: '미술관 옆 세련된 카페에서 예술 이야기.', duration: '1시간' },
          { name: '우에노 동물원', description: '일본에서 가장 오래된 동물원. 판다 등 다양한 동물을 만날 수 있어요.', duration: '2시간 30분' },
          { name: '우에노 공원 산책', description: '벚꽃 명소로 유명한 공원에서 여유로운 저녁 시간.', duration: '30분' },
        ],
        tips: [
          '박물관·미술관은 월요일 휴관이 많은 편',
          '학생증 지참 시 할인 가능',
          '특별전 정보를 미리 확인',
        ],
        bestSeason: '연중 (봄에는 벚꽃도 즐길 수 있어요)',
        recommendedFor: ['아트 좋아하는 분', '문화 애호가', '패밀리'],
      },
      'kichijoji-local': {
        stops: [
          { name: '이노카시라 공원', description: '사계절 내내 아름다운 자연을 즐길 수 있는 도시 공원 명소.', duration: '1시간 30분' },
          { name: '하모니카 요코초', description: '전후부터 이어진 작은 골목. 레트로한 분위기를 낮에도 체험.', duration: '1시간 30분' },
          { name: '키치조지 선로드 상점가', description: '지역민에게 사랑받는 상점가. 개성 있는 가게와 카페.', duration: '1시간 30분' },
          { name: '지브리 미술관', description: '스튜디오 지브리의 세계관을 체험할 수 있는 꿈 가득한 미술관.', duration: '30분' },
        ],
        tips: [
          '지브리 미술관은 완전 예약제 (일시 지정권)',
          '이노카시라 공원은 벚꽃 시즌(3–4월)이 특히 아름다워요',
          '하모니카 요코초는 저녁 시간대가 더 분위기 있어요',
        ],
        bestSeason: '봄/가을',
        recommendedFor: ['지브리 팬', '자연 좋아하는 분', '지역 문화 체험'],
      },
      'roppongi-art': {
        stops: [
          { name: '모리 미술관', description: '현대미술의 최전선을 소개하는 고층에 위치한 미술관.', duration: '2시간' },
          { name: '산토리 미술관', description: '일본의 미의식을 전하는 “생활 속의 미”를 주제로 한 미술관.', duration: '1시간 30분' },
          { name: '국립신미술관', description: '건축미도 즐길 수 있는 일본 최대급 전시 공간.', duration: '2시간' },
          { name: '모우리 정원 산책', description: '롯폰기 힐즈 옆 일본식 정원에서 도심 속 오아시스 체험.', duration: '30분' },
          { name: '롯폰기 고급 바', description: '국제적인 분위기 속에서 칵테일과 야경을 만끽.', duration: '3시간' },
        ],
        tips: [
          '미술관은 월요일 휴관인 곳이 많아요',
          '롯폰기는 늦은 밤까지 영업하는 가게가 많아요',
          '각 미술관의 특별전 정보를 체크',
        ],
        bestSeason: '연중',
        recommendedFor: ['아트 좋아하는 분', '어른', '국제적 분위기 선호'],
      },
      'odaiba-future': {
        stops: [
          { name: '일본과학미래관(미라이칸)', description: '최신 과학기술을 체험할 수 있는 인터랙티브 전시가 매력.', duration: '2시간 30분' },
          { name: '아쿠아시티 오다이바 점심', description: '바다를 바라보며 다양한 그루메를 즐길 수 있는 푸드코트.', duration: '1시간' },
          { name: '팀랩 보더리스', description: '디지털 아트 세계에 몰입하는 혁신적인 미술관 체험.', duration: '2시간 30분' },
          { name: '오에도 온센 모노가타리', description: '에도 정서가 물씬 나는 온천 테마파크에서 피로를 풀기.', duration: '1시간 30분' },
        ],
        tips: [
          '팀랩은 사전 예약 필수',
          '편한 복장 권장(과학관은 체험 전시가 많음)',
          '온천용 타월은 유료 대여 또는 지참',
        ],
        bestSeason: '연중',
        recommendedFor: ['패밀리', '테크 좋아하는 분', '아트 좋아하는 분'],
      },
      'sumida-traditional': {
        stops: [
          { name: '도쿄 스카이트리', description: '세계 최고 수준의 전파탑에서 도쿄 절경을 한눈에.', duration: '2시간' },
          { name: '스미다 수족관', description: '스카이트리 타운 내 도심형 수족관에서 힐링 시간.', duration: '1시간 30분' },
          { name: '무코지마 · 초메이지 사쿠라모치', description: '에도 시대부터 이어진 노포에서 진짜 사쿠라모치를 맛보기.', duration: '45분' },
          { name: '료고쿠 국기관 주변 산책', description: '스모의 성지에서 오오즈모 역사와 문화를 느끼기.', duration: '1시간' },
          { name: '에도도쿄 박물관', description: '에도에서 도쿄로의 변천사를 체험형 전시로 학습.', duration: '1시간 30분' },
        ],
        tips: [
          '스카이트리는 사전 예약으로 대기 시간 단축',
          '사쿠라모치는 조기 매진될 수 있어 이른 방문 추천',
          '료고쿠에서는 스모부의 아침 연습 견학 가능(사전 확인)',
        ],
        bestSeason: '연중',
        recommendedFor: ['패밀리', '일본문화 애호가', '야경·전망 좋아하는 분'],
      },
      'harajuku-kawaii': {
        stops: [
          { name: '다케시타도리', description: '카와이 문화의 성지. 개성 넘치는 패션 아이템이 가득.', duration: '1시간 30분' },
          { name: '카와이 몬스터 카페', description: '기상천외한 세계관의 테마 카페에서 특별한 점심 체험.', duration: '1시간 30분' },
          { name: '라포레 하라주쿠', description: '청년 패션의 최전선. 개성적인 브랜드가 모여 있어요.', duration: '1시간' },
          { name: '오모테산도 힐스', description: '하이엔드 브랜드와 문화가 어우러진 쇼핑 공간.', duration: '1시간' },
        ],
        tips: [
          '주말은 매우 혼잡하므로 평일 추천',
          '코스플레이어와의 사진은 허가를 받고 촬영',
          '나만의 개성 있는 패션으로 거리를 즐겨보세요',
        ],
        bestSeason: '연중',
        recommendedFor: ['패션 좋아하는 분', '젊은 여행자', 'SNS 사진 중시'],
      },
      'daikanyama-sophisticated': {
        stops: [
          { name: '다이칸야마 T‑SITE', description: '책과 문화에 흠뻑 빠질 수 있는 라이프스타일 복합 공간.', duration: '1시간 30분' },
          { name: '야쿠모 사료 점심', description: '와 모던 공간에서 제철 식재료의 창작 요리를 만끽.', duration: '1시간 15분' },
          { name: '힐사이드 테라스', description: '건축미도 즐길 수 있는 복합 시설에서 셀렉트숍 투어.', duration: '1시간' },
          { name: '사루가쿠초의 히든 카페', description: '주택가 골목에 숨은 스페셜티 커피집.', duration: '15분' },
        ],
        tips: [
          '평일 오전은 비교적 한산',
          '경사길이 많아 편한 신발 추천',
          '작은 골목에도 멋진 가게가 숨어 있어요',
        ],
        bestSeason: '연중',
        recommendedFor: ['성인 여성', '라이프스타일 중시', '감각 좋은 물건을 좋아하는 분'],
      },
      'imperial-nature': {
        stops: [
          { name: '고쿄 히가시교엔', description: '에도성 유적을 보며 사계절 자연을 즐기기.', duration: '1시간 30분' },
          { name: '고쿄 외원 · 니주바시', description: '고쿄를 대표하는 경관을 배경으로 기념 촬영.', duration: '30분' },
          { name: '고쿄 주변 러닝 코스', description: '시민 러너에게 인기인 5km 코스를 천천히 산책.', duration: '1시간' },
          { name: '히비야 공원', description: '일본 최초의 서양식 공원에서 도시 녹지의 역사를 느끼기.', duration: '1시간' },
        ],
        tips: [
          '히가시교엔은 월/금 휴원',
          '꽤 많이 걷으니 편한 신발과 복장 권장',
          '벚꽃과 단풍 시즌이 특히 아름다워요',
        ],
        bestSeason: '봄/가을',
        recommendedFor: ['자연 좋아하는 분', '역사 애호가', '건강 지향'],
      },
      'yokohama-port': {
        stops: [
          { name: '요코하마 차이나타운', description: '일본 최대 규모 차이나타운에서 본고장 중화를 만끽.', duration: '2시간' },
          { name: '야마시타 공원', description: '바다를 보며 여유로운 산책. 히카와마루도 관람 가능.', duration: '1시간' },
          { name: '붉은 벽돌 창고', description: '메이지·다이쇼 시대의 정취가 남아 있는 레트로 창고 쇼핑.', duration: '1시간 30분' },
          { name: '코스모 월드', description: '미나토미라이의 상징 코스모 클락 21 대관람차.', duration: '1시간' },
          { name: '랜드마크 타워 전망대', description: '해발 273m에서 요코하마 항의 야경을 일망무제.', duration: '1시간' },
          { name: '퀸즈 스퀘어 요코하마 디너', description: '항구를 바라보며 요코하마 그루메로 디너.', duration: '1시간 30분' },
        ],
        tips: [
          '미나토미라이선 1일권이 경제적',
          '저녁 시간대에 야경도 함께 즐기기',
          '차이나타운은 먹거리 투어가 풍부',
        ],
        bestSeason: '연중',
        recommendedFor: ['커플', '패밀리', '미식가'],
      },
      'kamakura-zen': {
        stops: [
          { name: '쓰루가오카 하치만구', description: '가마쿠라의 상징 신사에서 마음을 정화하며 시작.', duration: '1시간' },
          { name: '겐초지', description: '가마쿠라 고산 제1위의 격식 높은 선사에서 좌선 체험.', duration: '1시간 30분' },
          { name: '정진요리 점심', description: '사찰에서의 정진요리 체험으로 몸과 마음을 정화.', duration: '1시간 15분' },
          { name: '고토쿠인 대불', description: '일본을 대표하는 대불 앞에서의 고요한 시간.', duration: '1시간' },
          { name: '하세데라', description: '사계절 꽃과 십일면 관세음보살로 유명한 꽃의 절.', duration: '1시간' },
          { name: '유이가하마 해변', description: '석양을 보며 하루를 돌아보는 감사의 시간.', duration: '1시간 15분' },
        ],
        tips: [
          '좌선 체험은 사전 예약 추천',
          '돌계단이 많아 편한 신발 필수',
          '정진요리는 예산에 맞게 선택 가능',
        ],
        bestSeason: '봄/가을',
        recommendedFor: ['정신적 성장을 원하는 분', '일본문화 애호가', '자연 좋아하는 분'],
      },
    },
    fr: {
      'akihabara-anime': {
        stops: [
          { name: 'Quartier électronique d’Akihabara', description: 'Commencez ici. Derniers gadgets et articles d’anime.', duration: '2 h' },
          { name: 'Déjeuner au maid café', description: 'Expérience culturelle unique propre à Akihabara. Déjeuner hors du quotidien.', duration: '1 h 30' },
          { name: 'Gachapon Hall', description: 'Des centaines de machines à capsules. Un trésor inattendu vous attend peut‑être !', duration: '1 h' },
          { name: 'Tokyo Anime Center', description: 'Pôle d’information avec expositions et événements dédiés à l’anime.', duration: '1 h 30' },
        ],
        tips: [
          'En semaine pour éviter la foule',
          'Respectez les règles photo dans les maid cafés',
          'Prévoyez des pièces pour les gachapon',
        ],
        bestSeason: 'Toute l’année',
        recommendedFor: ['Fans d’anime', 'Amateurs de jeux', 'Première visite à Akihabara'],
      },
      'asakusa-traditional': {
        stops: [
          { name: 'Temple Sensō-ji', description: "Le plus ancien temple de Tokyo. Marchez de la porte Kaminarimon jusqu'à la rue Nakamise pour rejoindre le pavillon principal.", duration: '1 h 30' },
          { name: 'Location de kimono · Promenade', description: 'Portez un kimono et promenez‑vous à Asakusa. De nombreux spots photogéniques !', duration: '2 h' },
          { name: 'Déjeuner tempura chez un établissement historique', description: 'Dégustez une authentique tempura de style Edo dans une maison centenaire.', duration: '1 h' },
          { name: "Atelier d’artisanat (Edo Kiriko)", description: "Apprenez la gravure sur verre Edo Kiriko auprès d'artisans et créez votre propre pièce.", duration: '2 h' },
        ],
        tips: [
          'Commencez tôt pour éviter la foule',
          'La location de kimono est plus avantageuse avec réservation',
          "L’atelier d’artisanat nécessite une réservation préalable",
        ],
        bestSeason: 'Printemps/Automne',
        recommendedFor: ['Amateurs de culture', 'Amateurs de photo', 'Visiteurs étrangers'],
      },
      'shibuya-modern': {
        stops: [
          { name: 'Shibuya Sky', description: 'Vue panoramique à 360° sur Shibuya. Spot photo parfait.', duration: '1 h' },
          { name: 'Promenade Center‑Gai & Takeshita‑dori', description: 'Découvrez les dernières tendances dans les hauts lieux de la culture jeune.', duration: '1 h 30' },
          { name: 'Pause sucrée dans un café tendance', description: 'Faites une pause avec des desserts photogéniques populaires sur les réseaux.', duration: '1 h' },
          { name: 'Dîner avec vue nocturne à Shibuya', description: 'Dégustez un dîner avec une superbe vue de nuit depuis un restaurant en étage élevé.', duration: '1 h 30' },
        ],
        tips: [
          'Évitez le week‑end à cause de la forte affluence',
          'Réservez Shibuya Sky à l’avance',
          'Commencez en fin d’après‑midi pour profiter de la vue nocturne',
        ],
        bestSeason: 'Toute l’année',
        recommendedFor: ['Jeunes voyageurs', 'Amateurs de réseaux sociaux', 'Sorties en couple'],
      },
      'tsukiji-gourmet': {
        stops: [
          { name: 'Marché extérieur de Tsukiji', description: 'Marché animé de produits de la mer. La découpe de thon est incontournable !', duration: '1 h 30' },
          { name: 'Petit‑déjeuner sushi renommé', description: 'Savourez des sushis d’exception aux ingrédients ultra‑frais.', duration: '1 h' },
          { name: 'Balade à Ginza & food courts', description: 'Découvrez des spécialités régionales dans les sous‑sols des grands magasins.', duration: '2 h' },
          { name: 'Jardins Hama‑rikyū', description: 'Rare jardin japonais alimenté par l’eau de mer, oasis en plein centre.', duration: '1 h' },
        ],
        tips: [
          'Commencez à 5 h pour l’ambiance du marché',
          'Portez des chaussures confortables et des vêtements qui peuvent se salir',
          'Prévoyez des espèces (beaucoup de stands n’acceptent que le cash)',
        ],
        bestSeason: 'Toute l’année',
        recommendedFor: ['Gourmets', 'Levé tôt', 'Explorateurs de marchés'],
      },
      'ueno-museum': {
        stops: [
          { name: 'Musée national de Tokyo', description: 'Le plus ancien musée du Japon avec des collections inestimables, dont des Trésors nationaux.', duration: '2 h' },
          { name: "Musée national d'art occidental", description: 'Appréciez des chefs‑d’œuvre de l’art occidental dans un bâtiment de Le Corbusier.', duration: '1 h 30' },
          { name: 'Déjeuner au Parkside Cafe', description: 'Café élégant attenant au musée — parfait pour discuter art.', duration: '1 h' },
          { name: 'Zoo d’Ueno', description: 'Le plus ancien zoo du Japon — pandas et bien d’autres animaux.', duration: '2 h 30' },
          { name: 'Promenade au parc d’Ueno', description: 'Détente dans un parc célèbre pour ses cerisiers au printemps.', duration: '30 min' },
        ],
        tips: [
          'Beaucoup de musées sont fermés le lundi',
          "Réductions étudiantes avec carte d'étudiant",
          'Consultez les expos temporaires à l’avance',
        ],
        bestSeason: 'Toute l’année (cerisiers au printemps)',
        recommendedFor: ['Amateurs d’art', 'Amateurs de culture', 'Familles'],
      },
      'kichijoji-local': {
        stops: [
          { name: 'Parc Inokashira', description: 'Parc urbain apprécié, magnifique en toute saison.', duration: '1 h 30' },
          { name: 'Harmonica Yokocho', description: 'Petites allées rétro pour sentir l’atmosphère locale.', duration: '1 h 30' },
          { name: 'Rue commerçante Sunroad', description: 'Artère locale avec boutiques uniques et cafés.', duration: '1 h 30' },
          { name: 'Musée Ghibli', description: 'Musée onirique pour vivre l’univers de Studio Ghibli.', duration: '30 min' },
        ],
        tips: [
          'Le musée Ghibli est uniquement sur réservation (billet daté)',
          'Le parc Inokashira est superbe en saison des cerisiers (mars–avril)',
          "Harmonica Yokocho a une meilleure ambiance en soirée",
        ],
        bestSeason: 'Printemps/Automne',
        recommendedFor: ['Fans de Ghibli', 'Amoureux de nature', 'À la recherche de culture locale'],
      },
      'roppongi-art': {
        stops: [
          { name: 'Musée d’art Mori', description: 'Musée d’art contemporain de premier plan en étage élevé, avec belle vue.', duration: '2 h' },
          { name: 'Musée Suntory d’art', description: 'Musée dédié à la “beauté du quotidien” transmise par l’esthétique japonaise.', duration: '1 h 30' },
          { name: 'Centre national des Arts de Tokyo', description: 'L’un des plus grands espaces d’exposition du Japon, à l’architecture remarquable.', duration: '2 h' },
          { name: 'Promenade au jardin Mohri', description: 'Jardin japonais attenant à Roppongi Hills — oasis urbaine.', duration: '30 min' },
          { name: 'Bar haut de gamme à Roppongi', description: 'Savourez d’excellents cocktails avec vue nocturne dans une ambiance internationale.', duration: '3 h' },
        ],
        tips: [
          'De nombreux musées sont fermés le lundi — vérifiez à l’avance',
          'Beaucoup d’endroits à Roppongi sont ouverts tard',
          'Consultez le programme des expos temporaires',
        ],
        bestSeason: 'Toute l’année',
        recommendedFor: ['Amateurs d’art', 'Adultes', 'Amateurs d’ambiance internationale'],
      },
      'odaiba-future': {
        stops: [
          { name: 'Miraikan (Musée national des sciences émergentes)', description: 'Expositions interactives pour découvrir les technologies de pointe.', duration: '2 h 30' },
          { name: 'Déjeuner à Aqua City Odaiba', description: 'Aires de restauration variées avec vue sur la mer.', duration: '1 h' },
          { name: 'teamLab Borderless', description: 'Expérience immersive et innovante de musée d’art numérique.', duration: '2 h 30' },
          { name: 'Oedo Onsen Monogatari', description: 'Détente dans un parc thermal à thème Edo en fin de journée.', duration: '1 h 30' },
        ],
        tips: [
          'Réservation obligatoire pour teamLab',
          'Tenue confortable conseillée (beaucoup d’expos interactives)',
          'Apportez ou louez des serviettes pour l’onsen',
        ],
        bestSeason: 'Toute l’année',
        recommendedFor: ['Familles', 'Amateurs de techno', 'Amateurs d’art'],
      },
      'sumida-traditional': {
        stops: [
          { name: 'Tokyo Skytree', description: 'Vue panoramique sur la ville depuis l’une des plus hautes tours.', duration: '2 h' },
          { name: 'Aquarium Sumida', description: 'Aquarium urbain apaisant dans le complexe Tokyo Skytree Town.', duration: '1 h 30' },
          { name: 'Sakura Mochi de Chomeiji (Mukojima)', description: 'Savourez le véritable sakura mochi dans une maison historique depuis l’époque Edo.', duration: '45 min' },
          { name: 'Promenade autour du Ryogoku Kokugikan', description: 'Plongez dans l’histoire et la culture du sumo, sur ses terres.', duration: '1 h' },
          { name: 'Musée Edo‑Tokyo', description: 'Découvrez la transition d’Edo à Tokyo grâce à des expositions interactives.', duration: '1 h 30' },
        ],
        tips: [
          'Réservez Skytree à l’avance pour réduire l’attente',
          'Les sakura mochi peuvent être en rupture — venez plus tôt',
          'Possibilité d’observer l’entraînement matinal des écuries de sumo (vérification préalable)',
        ],
        bestSeason: 'Toute l’année',
        recommendedFor: ['Familles', 'Amateurs de culture japonaise', 'Amateurs de beaux points de vue'],
      },
      'harajuku-kawaii': {
        stops: [
          { name: 'Rue Takeshita', description: 'Terre sainte de la culture Kawaii, avec des articles de mode uniques.', duration: '1 h 30' },
          { name: 'KAWAII MONSTER CAFE', description: 'Expérience de café à thème au monde fantasque et déjanté.', duration: '1 h 30' },
          { name: 'Laforet Harajuku', description: 'À l’avant‑garde de la mode jeune avec des marques originales.', duration: '1 h' },
          { name: 'Omotesandō Hills', description: 'Espace shopping où se mêlent marques haut de gamme et culture.', duration: '1 h' },
        ],
        tips: [
          'Évitez le week‑end à cause de la foule',
          'Demandez l’autorisation avant de photographier les cosplayers',
          'Profitez de la balade dans une tenue qui vous ressemble',
        ],
        bestSeason: 'Toute l’année',
        recommendedFor: ['Amateurs de mode', 'Jeunes voyageurs', 'Chasseurs de photos SNS'],
      },
      'daikanyama-sophisticated': {
        stops: [
          { name: 'DAIKANYAMA T‑SITE', description: 'Complexe lifestyle pour s’immerger dans les livres et la culture.', duration: '1 h 30' },
          { name: 'Déjeuner à Yakumo Saryo', description: 'Cuisine créative de saison dans un élégant cadre japonisant.', duration: '1 h 15' },
          { name: 'Hillside Terrace', description: 'Parcours de select‑shops dans un ensemble à l’architecture soignée.', duration: '1 h' },
          { name: 'Café caché à Sarugakuchō', description: 'Spécialité café dans une ruelle résidentielle au calme.', duration: '15 min' },
        ],
        tips: [
          'Les matinées de semaine sont plus calmes',
          'Chaussures confortables — beaucoup de pentes',
          'De charmantes boutiques se cachent aussi dans les petites ruelles',
        ],
        bestSeason: 'Toute l’année',
        recommendedFor: ['Femmes adultes', 'Amateurs de lifestyle', 'Œil pour le design'],
      },
      'imperial-nature': {
        stops: [
          { name: 'Jardins de l’Est du Palais impérial', description: 'Appréciez la nature au fil des saisons et les vestiges du château d’Edo.', duration: '1 h 30' },
          { name: 'Jardins extérieurs & Nijūbashi', description: 'Photos souvenirs devant le panorama emblématique du Palais.', duration: '30 min' },
          { name: 'Boucle autour du Palais', description: 'Parcours prisé des coureurs (5 km) — promenade tranquille.', duration: '1 h' },
          { name: 'Parc Hibiya', description: 'Premier parc de style occidental du Japon — histoire du verdissement urbain.', duration: '1 h' },
        ],
        tips: [
          'Les Jardins de l’Est sont fermés lun./ven.',
          'Prévoyez des chaussures/tenue confortables (on marche pas mal)',
          'Saisons idéales: cerisiers et érables',
        ],
        bestSeason: 'Printemps/Automne',
        recommendedFor: ['Amoureux de nature', 'Passionnés d’histoire', 'Sensibles au bien‑être'],
      },
      'yokohama-port': {
        stops: [
          { name: 'Chinatown de Yokohama', description: 'Plus grand Chinatown du Japon — cuisine chinoise authentique.', duration: '2 h' },
          { name: 'Parc Yamashita', description: 'Promenade au bord de mer avec vue sur le Hikawa Maru.', duration: '1 h' },
          { name: 'Entrepôts de briques rouges', description: 'Anciens entrepôts rétro des ères Meiji/Taishō — shopping.', duration: '1 h 30' },
          { name: 'Cosmo World', description: 'Grande roue Cosmo Clock 21, icône de Minato Mirai.', duration: '1 h' },
          { name: 'Observatoire de la Landmark Tower', description: 'Superbe vue nocturne sur le port depuis 273 m.', duration: '1 h' },
          { name: 'Dîner à Queen’s Square Yokohama', description: 'Dîner avec vue sur le port et spécialités locales.', duration: '1 h 30' },
        ],
        tips: [
          'Le pass 1 jour de la ligne Minatomirai est avantageux',
          'Commencez en fin de journée pour profiter des vues nocturnes',
          'Chinatown est idéal pour grignoter en marchant',
        ],
        bestSeason: 'Toute l’année',
        recommendedFor: ['Couples', 'Familles', 'Gourmets'],
      },
      'kamakura-zen': {
        stops: [
          { name: 'Sanctuaire Tsurugaoka Hachimangū', description: 'Commencez par vous purifier dans le sanctuaire emblématique de Kamakura.', duration: '1 h' },
          { name: 'Temple Kenchō‑ji', description: 'Temple zen prestigieux — initiation au zazen.', duration: '1 h 30' },
          { name: 'Déjeuner shōjin ryōri', description: 'Cuisine végétarienne bouddhiste pour purifier corps et esprit.', duration: '1 h 15' },
          { name: 'Grand Bouddha de Kōtoku‑in', description: 'Moment de quiétude devant le célèbre Grand Bouddha.', duration: '1 h' },
          { name: 'Temple Hasedera', description: 'Temple des fleurs, réputé pour la Kannon à onze visages.', duration: '1 h' },
          { name: 'Plage de Yuigahama', description: 'Regard sur le coucher de soleil pour conclure la journée.', duration: '1 h 15' },
        ],
        tips: [
          'Réservez la séance de zazen à l’avance',
          'Nombreuses marches en pierre — chaussures confortables',
          'Le shōjin ryōri existe pour différents budgets',
        ],
        bestSeason: 'Printemps/Automne',
        recommendedFor: ['Quête de croissance spirituelle', 'Amateurs de culture japonaise', 'Amoureux de nature'],
      },
    },
  };

  const displayCourse = React.useMemo(() => {
    if (!course) return undefined;
    const langPack = (contentTranslations as any)[currentLanguage]?.[course.id];
    if (!langPack) return course;
    return {
      ...course,
      stops: course.stops.map((s, i) => ({
        ...s,
        ...(langPack.stops?.[i] || {}),
      })),
      tips: langPack.tips || course.tips,
      bestSeason: langPack.bestSeason || course.bestSeason,
      recommendedFor: langPack.recommendedFor || course.recommendedFor,
    } as ModelCourse;
  }, [course, currentLanguage]);

  if (!course || !displayCourse) {
    return (
      <>
        <div className="course-detail-bg"></div>
        <SakuraBackground />
        <section className="hero min-h-screen flex items-center justify-center">
          <div className="text-center" style={{ color: 'black' }}>
            <h2 className="text-2xl font-bold mb-4">{L.notFound}</h2>
            <button
              onClick={() => router.push('/courses')}
              className="btn btn-primary"
            >
              <ArrowLeft className="mr-2" size={16} />
              {L.backToList}
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="course-detail-bg"></div>
      <SakuraBackground />
      
      <section className="hero min-h-screen">
        <div className="container">
          <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '40px' }}>
            
            {/* Back button */}
            <button
              onClick={() => router.push('/courses')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px 20px',
                color: 'black',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '30px',
                transition: 'all 0.3s ease'
              }}
            >
              <ArrowLeft size={16} />
              {L.backToList}
            </button>

            {/* コースヘッダー */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '40px',
              marginBottom: '40px'
            }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h1 style={{
                    color: 'black',
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '12px'
                  }}>
                    {t(`course.${course.id.split('-')[0]}.title`) || course.title}
                  </h1>
                  
                  <p style={{
                    color: 'rgba(0, 0, 0, 0.8)',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}>
                    {t(`course.${course.id.split('-')[0]}.subtitle`) || course.subtitle}
                  </p>

                  {/* メタ情報 */}
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} style={{ color: '#FF6B9D' }} />
                      <span style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                        {course.area}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} style={{ color: '#4FACFE' }} />
                      <span style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                        {course.totalTime}
                      </span>
                    </div>
                    <div style={{
                      background: getDifficultyColor(course.difficulty),
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '15px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {t(`courses.difficulty.${course.difficulty}`)}
                    </div>
                  </div>

                  {/* タグ */}
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          background: 'rgba(79, 172, 254, 0.2)',
                          color: 'black',
                          padding: '6px 16px',
                          borderRadius: '15px',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* コース画像 */}
                <div>
                  <img
                    src={course.image}
                    alt={course.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '16px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '40px',
              marginBottom: '40px'
            }}>
              <h2 style={{
                color: 'black',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Navigation size={24} style={{ color: '#4FACFE' }} />
                {L.timeline}
              </h2>

              <div className="space-y-6">
                {displayCourse.stops.map((stop, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '25px',
                    position: 'relative'
                  }}>
                    {/* 時間表示 */}
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '25px',
                      background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                      fontWeight: '700',
                      border: '3px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      {stop.time}
                    </div>

                    <div className="ml-8 mt-4">
                      <div className="flex items-start gap-6">
                        <div className="flex-1">
                          <h3 style={{
                            color: 'black',
                            fontSize: '20px',
                            fontWeight: '700',
                            marginBottom: '8px'
                          }}>
                            {stop.name}
                          </h3>
                          
                          <p style={{
                            color: 'rgba(0, 0, 0, 0.8)',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            marginBottom: '15px'
                          }}>
                            {stop.description}
                          </p>

                          {/* 詳細情報 */}
                          <div className="flex items-center gap-4">
                            {stop.duration && (
                              <div style={{
                                background: 'rgba(255, 107, 157, 0.2)',
                                color: 'black',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {L.stayDuration}: {stop.duration}
                              </div>
                            )}
                            <div style={{
                              color: 'rgba(0, 0, 0, 0.6)',
                              fontSize: '12px'
                            }}>
                              📍 {stop.location.lat}, {stop.location.lng}
                            </div>
                          </div>
                        </div>

                        {/* スポット画像 */}
                        {stop.image && (
                          <div style={{ width: '120px', height: '80px', flexShrink: 0 }}>
                            <img
                              src={stop.image}
                              alt={stop.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '12px'
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* 次のスポットへの矢印 */}
                      {index < displayCourse.stops.length - 1 && (
                        <div style={{
                          textAlign: 'center',
                          marginTop: '20px',
                          color: 'rgba(0, 0, 0, 0.4)',
                          fontSize: '24px'
                        }}>
                          ↓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course tips / info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* コツ・注意点 */}
              {displayCourse.tips && displayCourse.tips.length > 0 && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '30px'
                }}>
                  <h3 style={{
                    color: 'black',
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Info size={18} style={{ color: '#FF8C42' }} />
                    {L.tips}
                  </h3>
                  <ul style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '14px', lineHeight: '1.6' }}>
                    {displayCourse.tips!.map((tip, index) => (
                      <li key={index} style={{ marginBottom: '8px', paddingLeft: '16px' }}>
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* おすすめ情報 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '30px'
              }}>
                <h3 style={{
                  color: 'black',
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Star size={18} style={{ color: '#7BC950' }} />
                  {L.recommendInfo}
                </h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ color: 'black', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                    🌸 {L.bestSeason}
                  </div>
                  <div style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '14px' }}>
                    {displayCourse.bestSeason}
                  </div>
                </div>

                {displayCourse.recommendedFor && displayCourse.recommendedFor.length > 0 && (
                  <div>
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      👥 {L.recommendedFor}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {displayCourse.recommendedFor!.map((rec, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(123, 201, 80, 0.2)',
                            color: 'black',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner': return '#7BC950';
    case 'intermediate': return '#FF8C42';
    case 'advanced': return '#FF6B9D';
    default: return '#4FACFE';
  }
}

function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'beginner': return '初級';
    case 'intermediate': return '中級';
    case 'advanced': return '上級';
    default: return '初級';
  }
}
