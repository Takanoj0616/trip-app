import { TouristSpot } from '@/types';

export const tokyoSpots: TouristSpot[] = [
  {
    id: 'tokyo-1',
    name: '東京スカイツリー',
    description: '東京のシンボル的なタワー。高さ634mから関東平野を一望できる',
    category: 'sightseeing',
    area: 'tokyo',
    location: {
      lat: 35.7101,
      lng: 139.8107,
      address: '東京都墨田区押上1-1-2'
    },
    rating: 4.3,
    images: ['https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=500&h=300&fit=crop'],
    priceRange: 'moderate',
    tags: ['タワー', '展望台', '夜景']
  },
  {
    id: 'tokyo-2',
    name: '浅草寺',
    description: '東京最古の寺院。雷門と仲見世通りで有名な観光スポット',
    category: 'sightseeing',
    area: 'tokyo',
    location: {
      lat: 35.7148,
      lng: 139.7967,
      address: '東京都台東区浅草2-3-1'
    },
    rating: 4.2,
    images: ['https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&h=300&fit=crop'],
    priceRange: 'budget',
    tags: ['寺院', '歴史', '文化']
  },
  {
    id: 'tokyo-3',
    name: '銀座',
    description: '高級ブランド店やデパートが立ち並ぶ東京の中心商業地区',
    category: 'shopping',
    area: 'tokyo',
    location: {
      lat: 35.6762,
      lng: 139.7615,
      address: '東京都中央区銀座'
    },
    rating: 4.1,
    images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop'],
    priceRange: 'luxury',
    tags: ['ショッピング', '高級', 'グルメ']
  },
  {
    id: 'tokyo-4',
    name: '渋谷スクランブル交差点',
    description: '世界で最も有名な交差点の一つ。東京の象徴的な風景',
    category: 'sightseeing',
    area: 'tokyo',
    location: {
      lat: 35.6598,
      lng: 139.7006,
      address: '東京都渋谷区道玄坂2-1'
    },
    rating: 4.0,
    images: ['https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=500&h=300&fit=crop'],
    priceRange: 'budget',
    tags: ['交差点', '人混み', '都市景観']
  },
  {
    id: 'tokyo-5',
    name: '明治神宮',
    description: '明治天皇と昭憲皇太后を祀る神社。原宿駅からアクセス良好',
    category: 'sightseeing',
    area: 'tokyo',
    location: {
      lat: 35.6763,
      lng: 139.6993,
      address: '東京都渋谷区代々木神園町1-1'
    },
    rating: 4.3,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'],
    priceRange: 'budget',
    tags: ['神社', '自然', '歴史']
  },
  {
    id: 'tokyo-6',
    name: '上野動物園',
    description: '日本最古の動物園。パンダで有名',
    category: 'entertainment',
    area: 'tokyo',
    location: {
      lat: 35.7156,
      lng: 139.7707,
      address: '東京都台東区上野公園9-83'
    },
    rating: 4.2,
    images: ['https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=500&h=300&fit=crop'],
    priceRange: 'budget',
    tags: ['動物園', 'パンダ', 'ファミリー']
  },
  {
    id: 'tokyo-7',
    name: '新宿御苑',
    description: '四季の花々が楽しめる大規模な庭園。桜の名所としても有名',
    category: 'sightseeing',
    area: 'tokyo',
    location: {
      lat: 35.6851,
      lng: 139.7101,
      address: '東京都新宿区内藤町11'
    },
    rating: 4.3,
    images: ['https://images.unsplash.com/photo-1522093007474-d86e2dacb763?w=500&h=300&fit=crop'],
    priceRange: 'budget',
    tags: ['公園', '桜', '紅葉']
  },
  {
    id: 'tokyo-8',
    name: '東京駅',
    description: '日本の鉄道交通の中心。赤レンガ駅舎が美しい',
    category: 'transportation',
    area: 'tokyo',
    location: {
      lat: 35.6812,
      lng: 139.7671,
      address: '東京都千代田区丸の内1-9-1'
    },
    rating: 4.1,
    images: ['https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=500&h=300&fit=crop'],
    priceRange: 'budget',
    tags: ['駅', '建築', 'ランドマーク']
  },
  {
    id: 'tokyo-9',
    name: '秋葉原',
    description: '電気街として有名。アニメ・ゲーム文化の聖地',
    category: 'entertainment',
    area: 'tokyo',
    location: {
      lat: 35.7022,
      lng: 139.7744,
      address: '東京都千代田区外神田'
    },
    rating: 4.0,
    images: ['https://images.unsplash.com/photo-1563656353898-febc9270a0f4?w=500&h=300&fit=crop'],
    priceRange: 'moderate',
    tags: ['電気街', 'アニメ', 'ゲーム']
  },
  {
    id: 'tokyo-10',
    name: '築地場外市場',
    description: '新鮮な魚介類とグルメの市場。食べ歩きが楽しめる',
    category: 'restaurants',
    area: 'tokyo',
    location: {
      lat: 35.6654,
      lng: 139.7706,
      address: '東京都中央区築地4-16-2'
    },
    rating: 4.3,
    images: ['https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=500&h=300&fit=crop'],
    priceRange: 'moderate',
    tags: ['市場', '海鮮', '食べ歩き']
  },
  {
    id: 'tokyo-11',
    name: '原宿竹下通り',
    description: '若者ファッションの発信地。カラフルなお店が並ぶ',
    category: 'shopping',
    area: 'tokyo',
    location: {
      lat: 35.6702,
      lng: 139.7025,
      address: '東京都渋谷区神宮前1-17'
    },
    rating: 3.9,
    images: ['https://images.unsplash.com/photo-1563207153-f403bf289096?w=500&h=300&fit=crop'],
    priceRange: 'moderate',
    tags: ['ファッション', '若者文化', 'ショッピング']
  },
  {
    id: 'tokyo-12',
    name: 'お台場海浜公園',
    description: '東京湾の人工島。レインボーブリッジの夜景が美しい',
    category: 'sightseeing',
    area: 'tokyo',
    location: {
      lat: 35.6280,
      lng: 139.7710,
      address: '東京都港区台場1-4'
    },
    rating: 4.1,
    images: ['https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=500&h=300&fit=crop'],
    priceRange: 'budget',
    tags: ['海浜', '夜景', 'レインボーブリッジ']
  }
];