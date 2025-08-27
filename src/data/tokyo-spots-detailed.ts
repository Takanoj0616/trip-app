// 東京スポット詳細データ
export interface SpotInfo {
  price?: string;
  cuisine?: string;
  distance?: string;
  openHours?: string;
  duration?: string;
  ticketRequired?: string;
  bestTime?: string;
  crowdLevel?: string;
  pricePerNight?: string;
  stars?: number;
  checkIn?: string;
  checkOut?: string;
}

export interface SpotName {
  ja: string;
  en: string;
  ko: string;
  fr: string;
  [key: string]: string;
}

export interface Review {
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Location {
  address: string;
  nearestStation?: string;
  accessInfo?: {
    train?: string[];
    bus?: string[];
    car?: string;
  };
}

export interface Facilities {
  wheelchairAccessible?: boolean;
  strollerFriendly?: boolean;
  restrooms?: boolean;
  restaurant?: boolean;
  souvenirShop?: boolean;
  noSmoking?: boolean;
  photography?: boolean;
  freeWifi?: boolean;
}

export interface TokyoSpot {
  id: string;
  name: SpotName;
  rating: number;
  reviews?: Review[];
  reviewCount?: number;
  image: string;
  badges: string[];
  info: SpotInfo;
  tags: string[];
  category: 'food' | 'sights' | 'hotels';
  description?: string;
  location?: Location;
  facilities?: Facilities;
  images?: string[];
}

// 東京スポットデータ
export const tokyoSpotsDetailed: TokyoSpot[] = [
  // 観光地
  {
    id: "101",
    name: {
      ja: "東京タワー",
      en: "Tokyo Tower",
      ko: "도쿄 타워",
      fr: "Tour de Tokyo"
    },
    rating: 4.2,
    reviewCount: 15032,
    image: "/images/spots/東京タワー_20250714_121123.jpg",
    badges: ["人気", "屋内", "営業中"],
    info: {
      duration: "2-3時間",
      ticketRequired: "必要",
      bestTime: "夕方",
      crowdLevel: "普通",
      openHours: "9:00-22:30",
      price: "¥1,200"
    },
    tags: ["展望台", "夜景", "ランドマーク", "333m電波塔", "東京シンボル", "メインデッキ", "トップデッキ", "富士山眺望"],
    category: "sights",
    description: "東京タワーは1958年に開業した高さ333mの総合電波塔です。東京のシンボルとして多くの人に愛され続けています。メインデッキ（150m）とトップデッキツアー（250m）の2つの展望台があり、東京の街並みを360度楽しむことができます。晴れた日には富士山も望むことができる絶景スポットです。タワー内にはレストランやお土産ショップ、水族館なども併設されており、一日中楽しめる観光施設となっています。",
    location: {
      address: "〒105-0011 東京都港区芝公園4-2-8",
      nearestStation: "都営大江戸線 赤羽橋駅 徒歩5分",
      accessInfo: {
        train: ["都営大江戸線 赤羽橋駅 徒歩5分", "東京メトロ日比谷線 神谷町駅 徒歩7分"],
        bus: ["東京タワー前バス停"],
        car: "駐車場あり（有料）"
      }
    },
    facilities: {
      wheelchairAccessible: true,
      strollerFriendly: true,
      restrooms: true,
      restaurant: true,
      souvenirShop: true,
      noSmoking: true,
      photography: true,
      freeWifi: true
    },
    images: [
      "/images/spots/東京タワー_20250714_121123.jpg",
      "/images/spots/tokyo-tower-night.jpg",
      "/images/spots/tokyo-tower-view.jpg",
      "/images/spots/tokyo-tower-interior.jpg"
    ],
    reviews: [
      {
        userName: "田中さん",
        rating: 5,
        date: "2024-08-15",
        comment: "夜景が本当に美しくて感動しました。平日の夕方に行ったので比較的空いていて、ゆっくり楽しめました。お土産も種類豊富で良かったです。"
      },
      {
        userName: "山田さん",
        rating: 4,
        date: "2024-07-22",
        comment: "定番の観光スポットですが、やはり一度は訪れる価値があります。展望台からの景色は圧巻でした。"
      }
    ]
  },
  {
    id: "102",
    name: {
      ja: "東京スカイツリー",
      en: "Tokyo Skytree",
      ko: "도쿄 스카이트리",
      fr: "Tokyo Skytree"
    },
    rating: 4.1,
    reviewCount: 28456,
    image: "/images/spots/東京スカイツリー_20250714_121122.jpg",
    badges: ["人気", "屋内", "営業中"],
    info: {
      duration: "2-3時間",
      ticketRequired: "必要",
      bestTime: "夕方",
      crowdLevel: "普通"
    },
    tags: ["展望台", "モダン", "夜景"],
    category: "sights"
  }
];