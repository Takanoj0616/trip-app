'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Clock, Users, Star, Calendar, Navigation, ArrowLeft, Camera, Info } from 'lucide-react';
import SakuraBackground from '@/components/SakuraBackground';


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
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1570611043142-e94640cdc5e5?w=800&h=400&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=400&fit=crop',
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

  if (!course) {
    return (
      <>
        <div className="animated-bg"></div>
        <SakuraBackground />
        <section className="hero min-h-screen flex items-center justify-center">
          <div className="text-center" style={{ color: 'black' }}>
            <h2 className="text-2xl font-bold mb-4">コースが見つかりません</h2>
            <button
              onClick={() => router.push('/courses')}
              className="btn btn-primary"
            >
              <ArrowLeft className="mr-2" size={16} />
              コース一覧に戻る
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="animated-bg"></div>
      <SakuraBackground />
      
      <section className="hero min-h-screen">
        <div className="container">
          <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '40px' }}>
            
            {/* 戻るボタン */}
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
              コース一覧に戻る
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
                    {course.title}
                  </h1>
                  
                  <p style={{
                    color: 'rgba(0, 0, 0, 0.8)',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}>
                    {course.subtitle}
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
                      {getDifficultyLabel(course.difficulty)}
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

            {/* タイムライン */}
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
                タイムライン
              </h2>

              <div className="space-y-6">
                {course.stops.map((stop, index) => (
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
                                滞在時間: {stop.duration}
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
                      {index < course.stops.length - 1 && (
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

            {/* コースのコツ・情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* コツ・注意点 */}
              {course.tips && course.tips.length > 0 && (
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
                    コツ・注意点
                  </h3>
                  <ul style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '14px', lineHeight: '1.6' }}>
                    {course.tips.map((tip, index) => (
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
                  おすすめ情報
                </h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ color: 'black', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                    🌸 ベストシーズン
                  </div>
                  <div style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '14px' }}>
                    {course.bestSeason}
                  </div>
                </div>

                {course.recommendedFor && course.recommendedFor.length > 0 && (
                  <div>
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      👥 こんな方におすすめ
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {course.recommendedFor.map((rec, index) => (
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