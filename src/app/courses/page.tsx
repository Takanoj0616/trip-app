'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Users, Star, Calendar, Navigation } from 'lucide-react';
import Link from 'next/link';
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

export default function ModelCoursesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedTheme, setSelectedTheme] = useState<string>('all');

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

    // Create sakura particles
    function createSakura() {
      const sakuraContainer = document.getElementById('sakuraContainer');
      if (!sakuraContainer) return;
      
      const sakura = document.createElement('div');
      sakura.className = 'sakura';
      
      const startX = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      const size = Math.random() * 8 + 8;
      
      sakura.style.left = startX + '%';
      sakura.style.animationDuration = duration + 's';
      sakura.style.animationDelay = delay + 's';
      sakura.style.width = size + 'px';
      sakura.style.height = size + 'px';
      
      sakuraContainer.appendChild(sakura);
      
      setTimeout(() => {
        try {
          if (sakura && sakura.parentNode && sakura.parentNode.contains(sakura)) {
            sakura.parentNode.removeChild(sakura);
          }
        } catch (error) {
          // Silent fail
        }
      }, (duration + delay) * 1000);
    }

    const sakuraInterval = setInterval(createSakura, 800);

    // Initialize animations
    setTimeout(() => {
      document.querySelectorAll('.loading').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('visible');
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
        }, index * 150);
      });
    }, 500);

    return () => {
      clearInterval(sakuraInterval);
      try {
        if (fontLinks && fontLinks.parentNode && fontLinks.parentNode.contains(fontLinks)) {
          fontLinks.parentNode.removeChild(fontLinks);
        }
        if (fontAwesome && fontAwesome.parentNode && fontAwesome.parentNode.contains(fontAwesome)) {
          fontAwesome.parentNode.removeChild(fontAwesome);
        }
      } catch (error) {
        // Silent fail
      }

      const sakuraContainer = document.getElementById('sakuraContainer');
      if (sakuraContainer) {
        try {
          // Safe cleanup using innerHTML
          sakuraContainer.innerHTML = '';
        } catch (error) {
          try {
            // Fallback: Safe iteration with null checks
            const particles = Array.from(sakuraContainer.children);
            particles.forEach(particle => {
              try {
                if (particle && particle.parentNode && particle.parentNode === sakuraContainer) {
                  sakuraContainer.removeChild(particle);
                }
              } catch (particleError) {
                // Continue with other particles
              }
            });
          } catch (fallbackError) {
            // Silent fail - non-critical
          }
        }
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
      image: '/images/courses/akihabara.jpg',
      stops: [
        {
          time: '10:00',
          name: '秋葉原電気街',
          description: 'まずはここからスタート。最新ガジェットやアニメグッズが揃います。',
          location: { lat: 35.7022, lng: 139.7741 },
          duration: '2時間'
        },
        {
          time: '12:00',
          name: 'お気に入りのメイドカフェでランチ',
          description: '秋葉原ならではの文化体験。非日常的な空間でランチを楽しみましょう。',
          location: { lat: 35.7015, lng: 139.7725 },
          duration: '1時間30分'
        },
        {
          time: '14:00',
          name: 'ガチャポン会館',
          description: '数百台のガチャガチャがずらり。思わぬお宝が見つかるかも？',
          location: { lat: 35.7009, lng: 139.7718 },
          duration: '1時間'
        },
        {
          time: '16:00',
          name: '東京アニメセンター',
          description: 'アニメの企画展やイベントが楽しめる情報発信拠点。',
          location: { lat: 35.6986, lng: 139.7742 },
          duration: '1時間30分'
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
      image: '/images/asakusa-temple.jpg',
      stops: [
        {
          time: '09:00',
          name: '浅草寺',
          description: '東京最古の寺院。雷門から仲見世通りを歩いて参拝しましょう。',
          location: { lat: 35.7148, lng: 139.7967 },
          duration: '1時間30分'
        },
        {
          time: '11:00',
          name: '着物レンタル・散策',
          description: '着物を着て浅草の街を散策。写真映えスポットもたくさん！',
          location: { lat: 35.7130, lng: 139.7950 },
          duration: '2時間'
        },
        {
          time: '13:00',
          name: '老舗天ぷら店でランチ',
          description: '創業100年を超える老舗で本格江戸前天ぷらを堪能。',
          location: { lat: 35.7140, lng: 139.7960 },
          duration: '1時間'
        },
        {
          time: '15:00',
          name: '伝統工芸体験（江戸切子）',
          description: '職人さんから直接学ぶ江戸切子の世界。オリジナル作品が作れます。',
          location: { lat: 35.7120, lng: 139.7980 },
          duration: '2時間'
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
          duration: '1時間'
        },
        {
          time: '15:30',
          name: 'センター街・竹下通り散策',
          description: '最新トレンドをチェック。若者文化の聖地を歩きます。',
          location: { lat: 35.6698, lng: 139.7036 },
          duration: '1時間30分'
        },
        {
          time: '17:00',
          name: '話題のカフェでスイーツタイム',
          description: 'SNSで話題のフォトジェニックなスイーツでひと休み。',
          location: { lat: 35.6590, lng: 139.7005 },
          duration: '1時間'
        },
        {
          time: '19:00',
          name: '渋谷の夜景ディナー',
          description: '高層階レストランで夜景を楽しみながらのディナー。',
          location: { lat: 35.6595, lng: 139.7020 },
          duration: '1時間30分'
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
      title: '築地・豊洲 グルメ巡りコース',
      subtitle: '朝の市場から高級寿司まで、東京の「食」を堪能する贅沢な一日。',
      area: '東京',
      theme: 'グルメ',
      duration: '1日',
      difficulty: 'intermediate',
      tags: ['市場', '寿司', '海鮮', 'グルメ'],
      totalTime: '約8時間',
      image: '/images/courses/tsukiji.jpg',
      stops: [
        {
          time: '05:00',
          name: '豊洲市場見学',
          description: '世界最大級の魚市場。マグロの競りを見学できます（要予約）。',
          location: { lat: 35.6654, lng: 139.7706 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        },
        {
          time: '07:30',
          name: '築地場外市場で朝食',
          description: '新鮮な海鮮丼や玉子焼きなど、市場ならではの朝食を。',
          location: { lat: 35.6654, lng: 139.7706 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        },
        {
          time: '10:00',
          name: '銀座散策・デパ地下巡り',
          description: '老舗デパートの地下食品街で全国の名産品をチェック。',
          location: { lat: 35.6719, lng: 139.7648 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
        },
        {
          time: '18:00',
          name: '老舗寿司店でディナー',
          description: '銀座の名店で職人の技を堪能する特別なディナータイム。',
          location: { lat: 35.6719, lng: 139.7648 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '豊洲市場の見学は事前予約が必須です',
        '朝が早いので前日は早めに就寝を',
        '築地では食べ歩きのマナーを守りましょう'
      ],
      bestSeason: '通年',
      recommendedFor: ['グルメ好き', '早起き得意', '市場体験希望者']
    },
    {
      id: 'ueno-museum',
      title: '上野 芸術・文化満喫コース',
      subtitle: '美術館・博物館が集まる文化の街で、日本と世界の芸術に触れる知的な一日。',
      area: '東京',
      theme: '歴史・文化',
      duration: '1日',
      difficulty: 'beginner',
      tags: ['美術館', '博物館', '公園', '芸術'],
      totalTime: '約7時間',
      image: '/images/courses/ueno.jpg',
      stops: [
        {
          time: '10:00',
          name: '東京国立博物館',
          description: '日本最古の博物館で国宝や重要文化財を鑑賞。',
          location: { lat: 35.7188, lng: 139.7766 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
        },
        {
          time: '13:00',
          name: '上野公園でランチ',
          description: '桜並木で有名な公園でお弁当ランチ。季節の花も楽しめます。',
          location: { lat: 35.7148, lng: 139.7753 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop'
        },
        {
          time: '14:30',
          name: '国立西洋美術館',
          description: 'ロダンの彫刻や印象派の名画など、西洋美術の傑作を堪能。',
          location: { lat: 35.7156, lng: 139.7756 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
        },
        {
          time: '17:00',
          name: 'アメ横散策',
          description: '戦後の闇市から発展した活気ある商店街でお土産探し。',
          location: { lat: 35.7119, lng: 139.7736 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '美術館は月曜休館が多いので事前確認を',
        '上野公園は桜の季節（3-4月）が特におすすめ',
        'ミュージアムパスの購入で複数館をお得に回れます'
      ],
      bestSeason: '通年（春は桜が美しい）',
      recommendedFor: ['アート好き', '歴史好き', '文化体験希望者']
    },
    {
      id: 'harajuku-kawaii',
      title: '原宿 カワイイ文化体験コース',
      subtitle: '世界に発信する日本の「カワイイ」文化を体感する、ポップでカラフルな一日。',
      area: '東京',
      theme: 'トレンド・ファッション',
      duration: '半日',
      difficulty: 'beginner',
      tags: ['ファッション', 'カワイイ', 'ポップカルチャー', 'スイーツ'],
      totalTime: '約5時間',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
      stops: [
        {
          time: '11:00',
          name: '竹下通り散策',
          description: 'カワイイの聖地で最新トレンドをチェック。個性的なショップが軒を連ねます。',
          location: { lat: 35.6698, lng: 139.7036 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
        {
          time: '13:00',
          name: 'カワイイモンスターカフェ',
          description: 'カラフルで奇想天外な世界観のテーマカフェでランチ。',
          location: { lat: 35.6695, lng: 139.7030 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '15:00',
          name: 'プリクラ・コスプレ体験',
          description: '最新のプリクラ機でアーティスティックな写真撮影。',
          location: { lat: 35.6700, lng: 139.7025 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '16:30',
          name: 'レインボー綿あめ作り',
          description: 'SNS映え抜群のカラフル綿あめ作り体験。',
          location: { lat: 35.6690, lng: 139.7040 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '週末は大変混雑するので平日がおすすめ',
        'カラフルな服装で来ると雰囲気に溶け込めます',
        'プリクラは現金のみの場合が多いので小銭を準備'
      ],
      bestSeason: '通年',
      recommendedFor: ['10-20代', 'SNS好き', 'カワイイ文化に興味がある人']
    },
    {
      id: 'shinjuku-night',
      title: '新宿 ナイトライフ満喫コース',
      subtitle: '眠らない街・新宿で大人の夜を満喫する、エネルギッシュなナイトコース。',
      area: '東京',
      theme: 'トレンド・ファッション',
      duration: '夜間',
      difficulty: 'advanced',
      tags: ['ナイトライフ', 'バー', '居酒屋', '夜景'],
      totalTime: '約6時間',
      image: '/images/courses/shinjuku.jpg',
      stops: [
        {
          time: '18:00',
          name: '都庁展望台で夜景',
          description: '無料で楽しめる絶景スポット。東京の夕暮れから夜景への変化を堪能。',
          location: { lat: 35.6896, lng: 139.6917 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
        },
        {
          time: '19:30',
          name: '思い出横丁で串焼き',
          description: '戦後の闇市の面影を残す横丁で昭和レトロな雰囲気を味わう。',
          location: { lat: 35.6938, lng: 139.7006 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '21:30',
          name: 'ゴールデン街バー巡り',
          description: '文豪や映画人も愛した伝説の飲み屋街で大人の時間を。',
          location: { lat: 35.6945, lng: 139.7020 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '00:00',
          name: '深夜ラーメンで〆',
          description: '新宿の深夜ラーメン店で一日の最後を締めくくり。',
          location: { lat: 35.6950, lng: 139.7030 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '20歳未満の方は参加できません',
        'ゴールデン街は1軒あたり4-5席の小さなバーが多いです',
        '深夜の帰宅手段を事前に確認しておきましょう'
      ],
      bestSeason: '通年',
      recommendedFor: ['大人', 'お酒好き', '夜遊び好き']
    },
    {
      id: 'odaiba-future',
      title: 'お台場 未来体験コース',
      subtitle: '最新テクノロジーとエンターテイメントが融合する未来都市を体験する一日。',
      area: '東京',
      theme: 'トレンド・ファッション',
      duration: '1日',
      difficulty: 'beginner',
      tags: ['科学館', 'テクノロジー', '未来', 'エンターテイメント'],
      totalTime: '約8時間',
      image: '/images/courses/odaiba.jpg',
      stops: [
        {
          time: '10:00',
          name: '日本科学未来館',
          description: '最先端の科学技術を体験できる国立の科学館。ロボットや宇宙の展示が人気。',
          location: { lat: 35.6193, lng: 139.7762 },
          duration: '2時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '13:00',
          name: 'アクアシティでランチ',
          description: '海を見ながら食事ができるレストランフロアでゆっくりランチ。',
          location: { lat: 35.6297, lng: 139.7744 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '14:30',
          name: 'チームラボボーダレス',
          description: 'デジタルアートの世界に没入する革新的な美術館体験。',
          location: { lat: 35.6256, lng: 139.7947 },
          duration: '3時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '18:00',
          name: 'パレットタウン大観覧車',
          description: 'レインボーブリッジと東京湾の絶景を楽しむ夕暮れタイム。',
          location: { lat: 35.6256, lng: 139.7816 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        'チームラボは事前予約必須です',
        '動きやすい服装と靴がおすすめ',
        '夕方の観覧車は夜景も楽しめて特におすすめ'
      ],
      bestSeason: '通年',
      recommendedFor: ['ファミリー', 'カップル', 'テクノロジー好き']
    },
    {
      id: 'kichijoji-local',
      title: '吉祥寺 ローカル散歩コース',
      subtitle: '住みたい街ランキング常連の吉祥寺で、地元の魅力を発見する穏やかな一日。',
      area: '東京',
      theme: '自然・散策',
      duration: '半日',
      difficulty: 'beginner',
      tags: ['公園', 'カフェ', '散歩', 'ローカル'],
      totalTime: '約5時間',
      image: '/images/courses/kichijoji.jpg',
      stops: [
        {
          time: '10:00',
          name: '井の頭恩賜公園',
          description: '四季折々の自然が美しい都市公園。ボート遊びや散策が楽しめます。',
          location: { lat: 35.6998, lng: 139.5703 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop'
        },
        {
          time: '12:00',
          name: 'サンロード商店街',
          description: '地元に愛される商店街。個性的なお店やグルメを発見できます。',
          location: { lat: 35.7036, lng: 139.5794 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '13:30',
          name: '隠れ家カフェでひと休み',
          description: '地元で人気の小さなカフェで自家焙煎コーヒーとスイーツを。',
          location: { lat: 35.7030, lng: 139.5800 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '15:30',
          name: 'ハモニカ横丁探索',
          description: '戦後の闇市から続く小さな横丁で昭和の雰囲気を感じる。',
          location: { lat: 35.7041, lng: 139.5799 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '井の頭公園は桜の季節が特に美しいです',
        '商店街では現金のみのお店も多いので準備を',
        'カフェは午後になると混雑することが多いです'
      ],
      bestSeason: '春・秋',
      recommendedFor: ['のんびり派', 'カフェ好き', '散歩好き']
    },
    {
      id: 'roppongi-art',
      title: '六本木 アート・夜景コース',
      subtitle: 'アートと国際性が交差する六本木で、洗練された大人の時間を過ごす特別な一日。',
      area: '東京',
      theme: '歴史・文化',
      duration: '1日',
      difficulty: 'intermediate',
      tags: ['アート', '美術館', '夜景', '国際的'],
      totalTime: '約8時間',
      image: '/images/courses/roppongi.jpg',
      stops: [
        {
          time: '11:00',
          name: '森美術館',
          description: '52階の高層階にある美術館。現代アートと東京の絶景を同時に楽しめます。',
          location: { lat: 35.6604, lng: 139.7294 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
        },
        {
          time: '14:00',
          name: '東京ミッドタウン散策',
          description: '洗練された商業施設とアートインスタレーションを楽しみながら散策。',
          location: { lat: 35.6676, lng: 139.7306 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
        },
        {
          time: '16:00',
          name: 'サントリー美術館',
          description: '日本の伝統工芸と現代デザインが融合した美しい美術館。',
          location: { lat: 35.6676, lng: 139.7306 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
        },
        {
          time: '18:30',
          name: '六本木ヒルズ展望台',
          description: '東京タワーとスカイツリーを一望できる絶景スポットで夜景を堪能。',
          location: { lat: 35.6604, lng: 139.7294 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
        },
        {
          time: '20:30',
          name: '高級レストランでディナー',
          description: '国際的なグルメが集まる六本木で特別なディナータイム。',
          location: { lat: 35.6627, lng: 139.7314 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '美術館は企画展により料金が変動します',
        '夜景は19時頃からが最も美しいです',
        'レストランは事前予約がおすすめ'
      ],
      bestSeason: '通年',
      recommendedFor: ['アート好き', '大人のデート', '国際的な雰囲気が好きな人']
    },
    {
      id: 'sumida-traditional',
      title: '墨田区 下町情緒コース',
      subtitle: '東京スカイツリーのお膝元で江戸下町の伝統と文化を感じる心温まる一日。',
      area: '東京',
      theme: '歴史・文化',
      duration: '1日',
      difficulty: 'beginner',
      tags: ['下町', '伝統工芸', 'スカイツリー', '職人'],
      totalTime: '約7時間',
      image: '/images/courses/sumida.jpg',
      stops: [
        {
          time: '10:00',
          name: '東京スカイツリー',
          description: '世界一高い自立式電波塔。展望デッキから関東平野を一望。',
          location: { lat: 35.7101, lng: 139.8107 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=400&h=300&fit=crop'
        },
        {
          time: '13:00',
          name: '江戸切子工房見学・体験',
          description: '江戸時代から続く伝統工芸の職人技を間近で見学し、体験もできます。',
          location: { lat: 35.7090, lng: 139.8050 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '15:30',
          name: 'すみだ水族館',
          description: '東京スカイツリータウン内にある都市型水族館。ペンギンやクラゲが人気。',
          location: { lat: 35.7101, lng: 139.8107 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '17:30',
          name: '向島百花園散策',
          description: '江戸時代の庭園で四季の花と俳句の世界を楽しむ癒しの時間。',
          location: { lat: 35.7229, lng: 139.8122 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        'スカイツリーは事前予約で待ち時間を短縮できます',
        '江戸切子体験は完全予約制です',
        '向島百花園は梅の季節（2-3月）が特におすすめ'
      ],
      bestSeason: '春・冬',
      recommendedFor: ['伝統文化好き', 'ファミリー', '職人技に興味がある人']
    },
    {
      id: 'daikanyama-sophisticated',
      title: '代官山 洗練散歩コース',
      subtitle: 'おしゃれな大人が集う代官山で、洗練されたライフスタイルを体験する優雅な半日。',
      area: '東京',
      theme: 'トレンド・ファッション',
      duration: '半日',
      difficulty: 'intermediate',
      tags: ['おしゃれ', 'セレクトショップ', 'カフェ', '大人'],
      totalTime: '約4時間',
      image: '/images/courses/daikanyama.jpg',
      stops: [
        {
          time: '11:00',
          name: '蔦屋書店代官山店',
          description: '本とライフスタイルが融合した文化的な空間。カフェも併設されています。',
          location: { lat: 35.6499, lng: 139.6959 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
        },
        {
          time: '12:30',
          name: 'セレクトショップ巡り',
          description: '代官山ならではの個性的なセレクトショップでお気に入りを探索。',
          location: { lat: 35.6510, lng: 139.6970 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
        },
        {
          time: '14:30',
          name: 'アートなカフェでひと休み',
          description: '代官山の隠れ家的カフェで自家焙煎コーヒーとアートを楽しむ。',
          location: { lat: 35.6505, lng: 139.6965 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '16:00',
          name: 'ログロード代官山散策',
          description: '個性的なショップが集まる複合施設で最後のショッピング。',
          location: { lat: 35.6490, lng: 139.6945 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '平日の午前中が比較的空いています',
        'おしゃれな服装で行くと雰囲気に合います',
        '小さなお店が多いので現金も持参を'
      ],
      bestSeason: '通年',
      recommendedFor: ['おしゃれ好き', '30代以上', 'センスを磨きたい人']
    },
    {
      id: 'imperial-palace',
      title: '皇居周辺 歴史・自然コース',
      subtitle: '東京の中心で日本の歴史と四季の自然を感じる、格式高く美しい一日。',
      area: '東京',
      theme: '自然・散策',
      duration: '半日',
      difficulty: 'beginner',
      tags: ['皇居', '歴史', '自然', 'ランニング'],
      totalTime: '約4時間',
      image: '/images/courses/imperial.jpg',
      stops: [
        {
          time: '09:00',
          name: '皇居東御苑',
          description: '旧江戸城の遺構が残る美しい庭園。四季の花と歴史を同時に楽しめます。',
          location: { lat: 35.6838, lng: 139.7531 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop'
        },
        {
          time: '11:00',
          name: '皇居外苑・二重橋',
          description: '皇居の象徴的な風景。写真撮影スポットとしても人気です。',
          location: { lat: 35.6796, lng: 139.7544 },
          duration: '30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '12:00',
          name: '皇居ランニングコース体験',
          description: '多くの市民ランナーに愛される皇居周回コース（約5km）を散歩。',
          location: { lat: 35.6812, lng: 139.7545 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
        },
        {
          time: '14:00',
          name: '和田倉噴水公園',
          description: '皇居のお濠と噴水が美しい公園で休憩。ベンチでゆっくり過ごせます。',
          location: { lat: 35.6868, lng: 139.7621 },
          duration: '30分',
          image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '皇居東御苑は月・金曜日は休園です',
        '歩きやすい靴と服装がおすすめ',
        '桜の季節（3-4月）は特に美しいです'
      ],
      bestSeason: '春・秋',
      recommendedFor: ['歴史好き', '自然好き', '運動好き']
    },
    {
      id: 'yokohama-port',
      title: '横浜 港町散歩コース',
      subtitle: '開港の歴史が息づく港町横浜で、異国情緒と現代の融合を楽しむロマンチックな一日。',
      area: '横浜',
      theme: '歴史・文化',
      duration: '1日',
      difficulty: 'beginner',
      tags: ['港', '異国情緒', '夜景', '中華街'],
      totalTime: '約8時間',
      image: '/images/courses/yokohama.jpg',
      stops: [
        {
          time: '10:00',
          name: '赤レンガ倉庫',
          description: '明治・大正時代の歴史的建造物。ショップやカフェ、イベントが楽しめます。',
          location: { lat: 35.4524, lng: 139.6425 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '12:00',
          name: '横浜中華街でランチ',
          description: '日本最大の中華街で本格的な中華料理を堪能。食べ歩きも楽しめます。',
          location: { lat: 35.4433, lng: 139.6458 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        },
        {
          time: '14:00',
          name: '山下公園・氷川丸',
          description: '横浜港を望む美しい公園と歴史ある客船の見学。海風が心地よい散歩道。',
          location: { lat: 35.4437, lng: 139.6503 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '16:00',
          name: 'みなとみらい21散策',
          description: '近未来的な街並みと商業施設。ショッピングやカフェタイムを楽しめます。',
          location: { lat: 35.4563, lng: 139.6380 },
          duration: '2時間',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          time: '18:30',
          name: '横浜ランドマークタワー展望台',
          description: '地上273mからの絶景で横浜の夜景を堪能。ロマンチックな締めくくり。',
          location: { lat: 35.4547, lng: 139.6317 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '中華街は平日ランチがお得です',
        'みなとみらいは夕方からの夜景が特に美しい',
        '歩く距離が多いので歩きやすい靴がおすすめ'
      ],
      bestSeason: '通年',
      recommendedFor: ['カップル', 'ファミリー', '異国情緒が好きな人']
    },
    {
      id: 'kamakura-zen',
      title: '鎌倉 禅と歴史体験コース',
      subtitle: '古都鎌倉で日本の禅文化と武家の歴史を感じる、心静かな精神修行の一日。',
      area: '神奈川',
      theme: '歴史・文化',
      duration: '1日',
      difficulty: 'intermediate',
      tags: ['禅', '寺院', '大仏', '歴史'],
      totalTime: '約7時間',
      image: '/images/courses/kamakura.jpg',
      stops: [
        {
          time: '09:00',
          name: '建長寺で坐禅体験',
          description: '鎌倉五山第一位の禅宗寺院で本格的な坐禅体験。心を静めて一日をスタート。',
          location: { lat: 35.3370, lng: 139.5580 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1570611043142-e94640cdc5e5?w=400&h=300&fit=crop'
        },
        {
          time: '11:00',
          name: '鎌倉大仏（高徳院）',
          description: '高さ13.35mの青銅製大仏坐像。鎌倉のシンボルでもある国宝を拝観。',
          location: { lat: 35.3166, lng: 139.5363 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1570611043142-e94640cdc5e5?w=400&h=300&fit=crop'
        },
        {
          time: '13:00',
          name: '精進料理ランチ',
          description: '鎌倉の寺院で供される精進料理で心身を清める昼食。',
          location: { lat: 35.3190, lng: 139.5470 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
        },
        {
          time: '15:00',
          name: '円覚寺で写経体験',
          description: '臨済宗の古刹で心を込めて写経。古い文字に集中する瞑想的な時間。',
          location: { lat: 35.3372, lng: 139.5525 },
          duration: '1時間30分',
          image: 'https://images.unsplash.com/photo-1570611043142-e94640cdc5e5?w=400&h=300&fit=crop'
        },
        {
          time: '17:00',
          name: '竹林の小径散策',
          description: '報国寺の美しい竹林で自然の中を静かに歩く。抹茶も楽しめます。',
          location: { lat: 35.3125, lng: 139.5738 },
          duration: '1時間',
          image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop'
        }
      ],
      tips: [
        '坐禅・写経体験は事前予約が必要な場合があります',
        '動きやすく、落ち着いた服装がおすすめ',
        '精進料理は量が控えめなので軽食を持参しても'
      ],
      bestSeason: '通年（秋は紅葉が美しい）',
      recommendedFor: ['精神修行に興味がある人', '歴史好き', '静寂を求める人']
    }
  ];

  const themes = [
    { id: 'all', label: t('courses.theme.all'), color: '#4FACFE' },
    { id: 'アニメ・ゲーム', label: t('courses.theme.anime'), color: '#FF6B9D' },
    { id: '歴史・文化', label: t('courses.theme.history'), color: '#C77DFF' },
    { id: 'トレンド・ファッション', label: t('courses.theme.trends'), color: '#4ECDC4' },
    { id: 'グルメ', label: t('courses.theme.gourmet'), color: '#FF8C42' },
    { id: '自然・散策', label: t('courses.theme.nature'), color: '#7BC950' }
  ];

  const filteredCourses = selectedTheme === 'all' 
    ? modelCourses 
    : modelCourses.filter(course => course.theme === selectedTheme);

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 25%, #1e1b4b 50%, #0f172a 75%, #020617 100%)",
      minHeight: "100vh"
    }}>
      <div className="animated-bg"></div>
      <div className="sakura-container" id="sakuraContainer"></div>
      
      <section className="hero min-h-screen" style={{
        background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("https://images.unsplash.com/photo-1554797589-7241bb691973?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        paddingTop: '140px'
      }}>
        <div className="container">
          <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px' }}>
            
            {/* ヘッダー */}
            <div className="text-center mb-12">
              <h1 className="section-title" style={{ color: 'black', marginBottom: '20px' }}>
                <i className="fas fa-calendar-alt" style={{ 
                  marginRight: '15px', 
                  background: 'var(--accent-gradient)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}></i>
                {t('courses.title')}
              </h1>
              <p className="section-subtitle" style={{ color: 'black', marginBottom: '60px' }}>
                {t('courses.subtitle')}
              </p>
            </div>

            {/* テーマフィルター */}
            <div className="fade-in loading" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '30px',
              marginBottom: '40px'
            }}>
              <h2 style={{
                color: 'black',
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {t('courses.filterTitle')}
              </h2>
              
              <div className="flex flex-wrap justify-center gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    style={{
                      background: selectedTheme === theme.id 
                        ? `linear-gradient(135deg, ${theme.color}20, ${theme.color}10)`
                        : 'rgba(255, 255, 255, 0.1)',
                      border: selectedTheme === theme.id
                        ? `2px solid ${theme.color}`
                        : '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '25px',
                      padding: '12px 24px',
                      color: 'black',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* コース一覧 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredCourses.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="fade-in loading"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '30px',
                    display: 'block',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    animationDelay: `${index * 0.15}s`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* コース画像 */}
                  <div style={{
                    height: '200px',
                    borderRadius: '16px',
                    backgroundImage: `url(${course.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    marginBottom: '20px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {t('courses.totalTime')} {course.totalTime}
                    </div>
                  </div>

                  {/* コース情報 */}
                  <div>
                    <h3 style={{
                      color: 'black',
                      fontSize: '22px',
                      fontWeight: '700',
                      marginBottom: '8px'
                    }}>
                      {t(`course.${course.id.split('-')[0]}.title`)}
                    </h3>
                    
                    <p style={{
                      color: 'rgba(0, 0, 0, 0.8)',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      marginBottom: '15px'
                    }}>
                      {t(`course.${course.id.split('-')[0]}.subtitle`)}
                    </p>

                    {/* メタ情報 */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-map-marker-alt" style={{ color: '#FF6B9D' }}></i>
                        <span style={{ color: 'black', fontSize: '14px' }}>
                          {t(`courses.area.${course.area.toLowerCase()}`)}
                        </span>
                      </div>
                                          <div className="flex items-center gap-2">
                      <i className="fas fa-clock" style={{ color: '#4FACFE' }}></i>
                      <span style={{ color: 'black', fontSize: '14px' }}>
                        {t('courses.duration')}: {course.duration}
                      </span>
                    </div>
                                          <div style={{
                      background: getDifficultyColor(course.difficulty),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {t(`courses.difficulty.${course.difficulty}`)}
                    </div>
                    </div>

                    {/* タグ */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(79, 172, 254, 0.2)',
                            color: 'black',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* スポット数 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'rgba(0, 0, 0, 0.7)',
                      fontSize: '14px'
                    }}>
                      <i className="fas fa-route"></i>
                      <span>{course.stops.length} {t('courses.spotsCount')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px',
                color: 'rgba(0, 0, 0, 0.6)'
              }}>
                <p>{t('courses.noCoursesFound')}</p>
                <p>{t('courses.selectOtherTheme')}</p>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
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
