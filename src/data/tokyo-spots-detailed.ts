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
  description_en?: string;
  description_ko?: string;
  description_fr?: string;
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
  ,
  // 追加: 明治神宮
  {
    id: "s201",
    name: {
      ja: "明治神宮",
      en: "Meiji Jingu",
      ko: "메이지 신궁",
      fr: "Sanctuaire Meiji"
    },
    rating: 4.6,
    reviewCount: 44684,
    image: "/images/spots/明治神宮_20250714_121123.jpg",
    badges: ["人気", "屋外", "営業中"],
    info: {
      duration: "45-60分",
      ticketRequired: "不要",
      bestTime: "朝",
      crowdLevel: "混雑",
      openHours: "日の出〜日の入り"
    },
    tags: ["神社", "自然", "文化"],
    category: "sights",
    description: "原宿・代々木に広がる杜に鎮座する神社。参道や社殿の荘厳な雰囲気で人気の観光スポット。",
    description_en: "A Shinto shrine nestled in a vast forest in Harajuku/Yoyogi, famous for its serene approach and dignified shrine buildings.",
    description_ko: "하라주쿠/요요기의 울창한 숲에 자리한 신사로, 고요한 참배길과 장엄한 본전 분위기로 사랑받는 명소입니다.",
    description_fr: "Un sanctuaire shinto niché dans une vaste forêt à Harajuku/Yoyogi, réputé pour son allée sereine et ses bâtiments solennels.",
    location: { address: "1-1 Yoyogikamizonochō, Shibuya, Tokyo 151-8557, Japan" }
  },
  // 追加: 皇居東御苑
  {
    id: "s202",
    name: {
      ja: "皇居東御苑",
      en: "Imperial Palace East Gardens",
      ko: "고쿄 히가시교엔",
      fr: "Jardins de l'Est du Palais Impérial"
    },
    rating: 4.4,
    reviewCount: 18000,
    image: "/images/spots/皇居東御苑_20250714_121142.jpg",
    badges: ["屋外", "営業中"],
    info: {
      duration: "60-90分",
      ticketRequired: "不要",
      bestTime: "昼間",
      crowdLevel: "普通",
      openHours: "火〜木/土日 9:00-16:00、月・金休園"
    },
    tags: ["庭園", "歴史", "散策"],
    category: "sights",
    description: "江戸城跡に整備された皇居内の庭園。石垣や芝生、季節の花々が楽しめる静かな散策スポット。",
    description_en: "Tranquil gardens inside the Imperial Palace on the former Edo Castle grounds, with stone walls, lawns and seasonal flowers.",
    description_ko: "에도성 터에 조성된 황거 동쪽 정원. 석벽과 잔디, 계절 꽃을 즐길 수 있는 고요한 산책 명소입니다.",
    description_fr: "Jardins paisibles au sein du Palais impérial sur l'ancien site du château d'Édo, avec murailles, pelouses et fleurs de saison.",
    location: { address: "1-1 Chiyoda, Chiyoda City, Tokyo 100-8111, Japan" }
  },
  // 追加: 新宿御苑
  {
    id: "s203",
    name: {
      ja: "新宿御苑",
      en: "Shinjuku Gyoen National Garden",
      ko: "신주쿠 교엔",
      fr: "Jardin National Shinjuku Gyoen"
    },
    rating: 4.6,
    reviewCount: 41774,
    image: "/images/spots/新宿御苑_20250714_121139.jpg",
    badges: ["人気", "屋外", "営業中"],
    info: {
      duration: "90-120分",
      ticketRequired: "必要",
      bestTime: "春/秋",
      crowdLevel: "混雑",
      openHours: "火〜日 9:00-17:30、月曜休園（季節変動あり）"
    },
    tags: ["庭園", "桜", "紅葉"],
    category: "sights",
    description: "フランス式・イギリス風景式・日本庭園が融合した都心の大庭園。四季の花々と広い芝生で人気。",
    description_en: "A vast city garden combining French formal, English landscape and Japanese styles, famous for seasonal flowers and lawns.",
    description_ko: "프랑스식, 영국 풍경식, 일본 정원이 어우러진 대형 도심 정원으로, 사계절 꽃과 넓은 잔디로 유명합니다.",
    description_fr: "Un vaste jardin urbain mêlant jardins à la française, paysagers anglais et style japonais, apprécié pour ses fleurs saisonnières et ses pelouses.",
    location: { address: "11 Naitōmachi, Shinjuku City, Tokyo 160-0014, Japan" }
  },
  // 追加: 浜離宮恩賜庭園
  {
    id: "s204",
    name: {
      ja: "浜離宮恩賜庭園",
      en: "Hama-rikyu Gardens",
      ko: "하마리큐 정원",
      fr: "Jardins Hama-rikyu"
    },
    rating: 4.4,
    reviewCount: 11356,
    image: "/images/spots/浜離宮恩賜庭園_20250714_121138.jpg",
    badges: ["屋外", "営業中"],
    info: {
      duration: "60-90分",
      ticketRequired: "必要",
      bestTime: "午後",
      crowdLevel: "普通",
      openHours: "9:00-17:00"
    },
    tags: ["庭園", "池", "景観"],
    category: "sights",
    description: "海水を引き入れた潮入の池が特徴の大名庭園。都心ながら静けさと水辺の景観を楽しめる。",
    description_en: "A feudal lord's garden featuring a tidal seawater pond; a quiet waterside landscape in the heart of Tokyo.",
    description_ko: "바닷물을 끌어들인 ‘시오이리’ 연못이 특징인 다이묘 정원으로, 도심 속에서도 물가 풍경과 고요함을 즐길 수 있습니다.",
    description_fr: "Un jardin de daimyo doté d'un étang à marée alimenté en eau de mer, offrant un paysage paisible en plein cœur de Tokyo.",
    location: { address: "1-1 Hamarikyūteien, Chuo City, Tokyo 104-0046, Japan" }
  },
  // 追加: 東京国立博物館
  {
    id: "s205",
    name: {
      ja: "東京国立博物館",
      en: "Tokyo National Museum",
      ko: "도쿄 국립 박물관",
      fr: "Musée National de Tokyo"
    },
    rating: 4.5,
    reviewCount: 27978,
    image: "/images/spots/東京国立博物館_20250714_121129.jpg",
    badges: ["人気", "屋内", "営業中"],
    info: {
      duration: "120-180分",
      ticketRequired: "必要",
      bestTime: "午前",
      crowdLevel: "混雑",
      openHours: "火〜木/日 9:30-17:00、金土 9:30-20:00、月曜休"
    },
    tags: ["博物館", "文化", "歴史"],
    category: "sights",
    description: "日本最古の総合博物館。国宝・重要文化財を含む膨大なコレクションを有し、企画展も充実。",
    description_en: "Japan’s oldest comprehensive museum with vast collections including National Treasures and Important Cultural Properties; notable special exhibitions.",
    description_ko: "일본에서 가장 오래된 종합 박물관으로, 국보·중요문화재를 포함한 방대한 소장품과 풍부한 기획전이 특징입니다.",
    description_fr: "Le plus ancien musée du Japon, possédant d’immenses collections dont des Trésors nationaux et Biens culturels importants; expositions temporaires de qualité.",
    location: { address: "13-9 Uenokōen, Taito City, Tokyo 110-8712, Japan" }
  },
  // 追加: 台場公園
  {
    id: "s206",
    name: {
      ja: "台場公園",
      en: "Daiba Park",
      ko: "다이바 공원",
      fr: "Parc Daiba"
    },
    rating: 4.2,
    reviewCount: 991,
    image: "/images/spots/台場公園_20250714_121146.jpg",
    badges: ["屋外", "営業中"],
    info: {
      duration: "45-90分",
      ticketRequired: "不要",
      bestTime: "夕方",
      crowdLevel: "普通",
      openHours: "24時間"
    },
    tags: ["公園", "海辺", "散策"],
    category: "sights",
    description: "お台場の砲台跡に整備された海辺の公園。レインボーブリッジや東京湾の眺望が楽しめる。",
    description_en: "A seaside park developed on the former Odaiba battery site, offering views of Rainbow Bridge and Tokyo Bay.",
    description_ko: "오다이바 포대 유적지에 조성된 해변 공원으로, 레인보우 브리지와 도쿄만 전경을 감상할 수 있습니다.",
    description_fr: "Un parc en bord de mer aménagé sur l’ancien site des batteries d’Odaiba, avec vue sur le Rainbow Bridge et la baie de Tokyo.",
    location: { address: "1-chōme-10-1 Daiba, Minato City, Tokyo 135-0091, Japan" }
  }
];
