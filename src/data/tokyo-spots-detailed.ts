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
    description: "東京タワーは1958年に開業した高さ333mの自立式総合電波塔。150mのメインデッキと、専用ツアーで訪れる250mのトップデッキの2層構成で、東京の街並みを360度一望できます。メインデッキは三層構造で、足元が透けるガラス床やカフェ、ギフトショップがあり滞在型の楽しみが充実。夜間は『インフィニティ・ダイヤモンドヴェール』など季節やイベントに合わせたライティングが行われ、昼夜で異なる表情を見せます。フットタウン（複合施設）にはレストランや土産店、イベントスペースが揃い、雨天でも過ごしやすいのが魅力。最寄りは赤羽橋・神谷町・御成門など。混雑を避けるなら平日午前や夜遅めの時間帯、または日時指定チケットの事前購入がおすすめ。晴天時は富士山を望めることもあります。",
    description_en: "Tokyo Tower, opened in 1958, is a 333‑meter self‑supporting broadcasting tower. It has two observation levels: the 150 m Main Deck and the 250 m Top Deck (tour only), offering a 360° panorama of the city. The Main Deck spans three floors with a thrilling glass floor, cafe and gift shops—great for lingering. At night, seasonal/event illuminations such as the Infinity Diamond Veil create a different ambience from daytime. The FootTown complex at the base includes restaurants, souvenir stores and event space, making it enjoyable even on rainy days. Nearby stations include Akabanebashi, Kamiyacho and Onarimon. To avoid crowds, visit on weekday mornings or later at night, or pre‑book timed tickets. On clear days you may even glimpse Mt. Fuji.",
    description_ko: "1958년에 개장한 도쿄 타워는 높이 333m의 자립식 종합 전파탑입니다. 150m의 메인 데크와 투어 전용 250m 톱 데크, 두 층의 전망 시설에서 도쿄 전경을 360도로 감상할 수 있습니다. 메인 데크는 3개 층으로 구성되어 유리 바닥, 카페, 기념품 숍 등이 갖춰져 있어 머물며 즐기기 좋습니다. 야간에는 ‘인피니티·다이아몬드 베일’ 등 계절·이벤트에 맞춘 라이트업으로 낮과는 다른 분위기를 선사합니다. 기단부의 ‘풋타운’에는 레스토랑과 상점, 이벤트 공간이 있어 우천 시에도 편리합니다. 가까운 역은 아카바네바시·가미야초·오나리몬 등. 혼잡을 피하려면 평일 아침이나 늦은 밤, 또는 시간 지정권의 사전 예매를 추천합니다. 맑은 날에는 후지산이 보이는 경우도 있습니다.",
    description_fr: "Inaugurée en 1958, la Tokyo Tower est une tour de diffusion autoportante de 333 m. Elle comporte deux niveaux d’observation : le Main Deck à 150 m et le Top Deck à 250 m (visite guidée), offrant un panorama à 360° sur la ville. Le Main Deck, réparti sur trois étages, propose un sol en verre vertigineux, un café et des boutiques—propice à une visite prolongée. Le soir, des illuminations saisonnières/événementielles (comme l’Infinity Diamond Veil) donnent une atmosphère différente du jour. Au pied, le complexe FootTown réunit restaurants, boutiques et espaces d’événements, pratique même par temps de pluie. Stations proches : Akabanebashi, Kamiyachō, Onarimon. Pour éviter l’affluence, privilégiez les matinées en semaine ou la fin de soirée, ou réservez un billet horodaté. Par temps clair, on peut parfois apercevoir le mont Fuji.",
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
    category: "sights",
    description: "東京スカイツリーは高さ634mの自立式電波塔。展望施設は350mの『天望デッキ』と、透明感のある回廊が続く450mの『天望回廊』の二段構成です。天望デッキは三層構造で、東京の街並みを360度一望できるほか、足元が透けるガラス床やカフェ、ギフトショップなど滞在型の施設も充実。夜は『粋』『雅』などテーマの異なるライティングが行われ、季節やイベントごとに表情が変わります。ふもとの大型商業施設『東京ソラマチ』には約300のショップ＆レストラン、すみだ水族館やプラネタリウムがあり、天候に左右されず一日楽しめます。混雑を避けるなら朝いちや夜遅め、または日時指定券の事前購入がおすすめ。浅草・隅田公園・すみだ北斎美術館など周辺観光との組み合わせも人気です。",
    description_en: "Tokyo Skytree is a 634‑meter self‑supporting broadcasting tower with two observation facilities: the 350 m Tembo Deck and the 450 m Tembo Galleria with a light‑filled glass corridor. The Tembo Deck spans three floors, offering a 360° panorama, a glass‑floor experience, cafes and gift shops. At night, themed illuminations such as ‘Iki’ and ‘Miyabi’ change with the seasons and events. At the base, Tokyo Solamachi hosts around 300 shops and restaurants, plus Sumida Aquarium and a planetarium—great for all‑weather, full‑day visits. To avoid crowds, aim for early morning or late evening, or pre‑book timed tickets. Combine with nearby Asakusa, Sumida Park and the Sumida Hokusai Museum.",
    description_ko: "도쿄 스카이트리는 높이 634m의 자립식 전파탑으로, 350m ‘덴보 데크’와 450m ‘덴보 회랑’ 두 곳의 전망 시설을 갖추고 있습니다. 덴보 데크는 3개 층으로 구성되어 360도 전망, 유리 바닥 체험, 카페와 기념품 숍 등 체류형 즐길 거리가 풍부합니다. 야간에는 ‘이키’ ‘미야비’ 등 주제의 라이트업이 계절·이벤트에 따라 변주됩니다. 기단부의 ‘도쿄 소라마치’에는 약 300개의 상점과 레스토랑, 스미다 수족관과 플라네타리움이 있어 날씨에 구애받지 않고 하루 종일 즐길 수 있습니다. 혼잡을 피하려면 이른 아침이나 늦은 저녁, 혹은 시간 지정권 사전 예매를 추천합니다. 아사쿠사·스미다 공원·스미다 호쿠사이 미술관과의 연계 관광도 인기입니다.",
    description_fr: "La Tokyo Skytree est une tour autoportante de 634 m. Elle propose deux espaces d’observation : le Tembo Deck à 350 m et le Tembo Galleria à 450 m, relié par une galerie vitrée baignée de lumière. Le Tembo Deck, sur trois niveaux, offre un panorama à 360°, un sol en verre, des cafés et des boutiques. Le soir, des illuminations thématiques (‘Iki’, ‘Miyabi’) varient selon les saisons et événements. Au pied, le complexe Tokyo Solamachi réunit près de 300 boutiques et restaurants, ainsi que l’Aquarium de Sumida et un planétarium—idéal par tous les temps. Pour éviter l’affluence, privilégiez tôt le matin ou la soirée, ou réservez un billet horodaté. Combinez avec Asakusa, le parc de Sumida et le musée Sumida Hokusai."
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
    description: "明治天皇と昭憲皇太后をお祀りする神社。原宿・代々木に広がる広大な社叢（杜）は人工林でありながら深い静けさに包まれ、玉砂利の参道、巨大な鳥居、荘厳な拝殿が連なります。早朝の清澄な空気の中での参拝や、季節の花が彩る明治神宮御苑（有料）も見どころ。初詣や七五三、結婚式など日本の伝統文化に触れられる機会も多く、都会の喧騒から離れて心を整える場所として人気です。表参道・原宿のショッピングエリアや代々木公園とも近く、散策の拠点にも最適。",
    description_en: "Meiji Jingu enshrines Emperor Meiji and Empress Shoken. The vast forested precinct in Harajuku/Yoyogi—carefully planted yet deeply tranquil—features gravel approaches, towering torii gates and a dignified main shrine. Visit early in the morning for serenity, and don’t miss the Meiji Jingu Inner Garden (paid) with seasonal flowers. New Year’s visits, Shichi‑Go‑San and traditional weddings offer glimpses of Japanese culture. It’s a beloved refuge from the city buzz, with Omotesando/Harajuku shopping streets and Yoyogi Park nearby for a combined stroll.",
    description_ko: "메이지 천황과 쇼켄 황태후를 모신 신사로, 하라주쿠/요요기의 광대한 수림은 인공림이지만 깊은 고요함을 느낄 수 있습니다. 자갈길 참배로와 거대한 도리이, 장엄한 배전이 이어지며, 이른 아침의 청명한 공기 속 참배가 특히 추천됩니다. 계절 꽃이 아름다운 메이지진구 어원(유료)도 볼거리입니다. 정월 참배, 시치고산, 전통 결혼식 등 일본 문화를 접할 기회가 많고, 도심 속에서 마음을 가다듬기 좋은 휴식처로 사랑받습니다. 오모테산도·하라주쿠 쇼핑 거리, 요요기 공원과도 가까워 산책 코스로도 좋습니다.",
    description_fr: "Le sanctuaire Meiji, dédié à l’empereur Meiji et à l’impératrice Shoken, s’étend dans un vaste bois à Harajuku/Yoyogi—planté mais d’une grande quiétude—avec ses allées de gravier, ses immenses torii et un pavillon principal solennel. Privilégiez le matin pour une visite sereine; le jardin intérieur (payant) vaut également le détour selon les saisons. Les premières visites de l’année, les cérémonies Shichi‑Go‑San et les mariages traditionnels offrent un bel aperçu de la culture japonaise. Tout proche d’Omotesando/Harajuku et du parc Yoyogi, c’est un havre de paix en pleine ville.",
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
    description: "皇居東御苑は、江戸城本丸・二の丸・三の丸の一部を整備した公開庭園です。二の丸庭園の池泉回遊式庭園や、往時の天守台跡、重厚な石垣・百人番所・大手門など、江戸城の歴史遺構と四季の植栽が調和した景観が魅力。入園は無料（入園票の受け取り・返却制）で、静かな散策に最適です。梅・桜・ツツジ・菖蒲・紅葉と季節の見どころが豊富で、都心にいながら深い緑を感じられます。開園日は火〜木/土日、月金休園（行事等で変更あり）。混雑を避けるなら午前の早い時間がおすすめです。",
    description_en: "The Imperial Palace East Gardens occupy part of Edo Castle’s former Honmaru, Ninomaru and Sannomaru areas. Highlights include the strolling garden of Ninomaru, the massive Tenshudai (castle keep foundation), imposing stone walls, Hyakunin‑bansho guardhouse and the Ote‑mon Gate—history and seasonal planting in harmony. Admission is free (entry ticket issued/returned at the gate), making it ideal for a quiet urban walk. Plum, cherry, azalea, iris and autumn foliage provide interest year‑round. Open Tue–Thu/Sat–Sun; closed Mon/Fri (subject to events). Visit in the early morning to avoid crowds.",
    description_ko: "황거 동원은 에도성의 혼마루·니노마루·산노마루 일부를 정비한 공개 정원입니다. 니노마루 정원의 지천회유식 경관, 천수대 터, 견고한 석벽과 백인반소, 오테몬 등 역사 유적과 사계절 식재가 조화를 이룹니다. 입장은 무료(입장표 수령·반납제)로, 도심 속 조용한 산책에 적합합니다. 매화·벚꽃·철쭉·붓꽃·단풍 등 계절별 볼거리가 풍부하며, 화요일~목요일/토·일 개원, 월·금 휴원(행사로 변동 가능). 혼잡을 피하려면 오전 이른 시간대를 추천합니다.",
    description_fr: "Les Jardins de l’Est du Palais impérial occupent une partie des anciens quartiers du château d’Édo (Honmaru, Ninomaru, Sannomaru). On y découvre le jardin de promenade du Ninomaru, l’imposant soubassement du donjon (Tenshudai), de hautes murailles, le corps de garde Hyakunin‑bansho et la porte Ōte—un ensemble où patrimoine et floraisons saisonnières se répondent. L’accès est gratuit (billet d’entrée à retirer/rendre), idéal pour une promenade paisible en plein centre‑ville. Prunier, cerisier, azalée, iris, érables… le site se visite toute l’année. Ouvert mar‑jeu/sam‑dim, fermé lun/ven (sous réserve d’événements). Privilégiez le matin pour éviter l’affluence.",
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
    description: "新宿御苑はフランス式整形庭園・イギリス風景式庭園・日本庭園が同居する都心の大庭園。春は早咲きから遅咲きまで多彩な桜、初夏のバラ、秋の紅葉、温室の熱帯植物など見どころが豊富です。広い芝生と並木道、池や茶室が点在し、ゆったり散策やピクニックに最適。入園は有料で、混雑時は入場制限がかかる場合もあるためオンラインチケットの事前購入が便利です。園内はアルコール不可・ボール遊び制限あり等のルールが明確で、静かな自然を保っています。おすすめは開園直後または平日。",
    description_en: "Shinjuku Gyoen is a large urban park that blends French formal, English landscape and Japanese garden styles. Seasonal highlights include abundant cherry blossoms (early to late varieties), roses in early summer, brilliant autumn foliage and tropical collections in the greenhouse. Expansive lawns, avenues, ponds and teahouses invite leisurely walks and picnics. Admission is paid, and timed/online tickets help during busy periods. Rules (no alcohol, limited ball games, etc.) preserve a tranquil atmosphere. Visit at opening time or on weekdays for a calmer experience.",
    description_ko: "신주쿠 교엔은 프랑스식 정형, 영국 풍경식, 일본 정원이 공존하는 대형 도심 공원입니다. 봄 벚꽃(조생~만개), 초여름 장미, 가을 단풍, 온실의 열대 식물 등 볼거리가 다양합니다. 넓은 잔디와 가로수, 연못과 다실이 있어 산책과 피크닉에 좋습니다. 유료 입장이며 혼잡 시 입장 제한이 있을 수 있어 온라인 티켓 사전 구매가 편리합니다. 음주 금지, 공놀이 제한 등 규정으로 고요한 환경을 유지하며, 개장 직후나 평일 방문을 추천합니다.",
    description_fr: "Le parc Shinjuku Gyoen associe jardins à la française, paysagers anglais et jardin japonais. Cerisiers (du plus précoce au plus tardif) au printemps, rosiers au début de l’été, feuillages flamboyants en automne et serre tropicale composent un riche calendrier. Pelouses, allées, plans d’eau et pavillons de thé se prêtent à la flânerie et au pique‑nique. Entrée payante; les billets en ligne/horodatés sont utiles lors des fortes affluences. Des règles (pas d’alcool, jeux de balles limités…) préservent le calme. Privilégiez l’ouverture ou les jours de semaine.",
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
    description: "浜離宮恩賜庭園は、東京湾の海水を引き入れる『潮入の池』と二重の防潮堤を備えた江戸時代の大名庭園。中島の御茶屋からは池越しに高層ビル群を望み、歴史庭園と都市景観の対比が楽しめます。早春の菜の花、初夏の花菖蒲、秋の紅葉など四季の彩りも豊か。水上バスの発着所が近く、浅草・お台場方面との周遊にも便利です。園内には復元茶屋や鴨場跡、樹齢を重ねた黒松など見どころ多数。静かな水辺散策を楽しみたい方におすすめで、午前の光が写真映えします。",
    description_en: "Hama‑rikyu Gardens is an Edo‑period feudal garden distinguished by a seawater tidal pond and double tide‑gates. From the Nakajima Teahouse you can view the pond with Tokyo’s skyline beyond—an elegant contrast of history and modernity. Seasonal color includes rapeseed blossoms in early spring, irises in early summer and vivid autumn foliage. A nearby water‑bus pier makes it convenient to combine with Asakusa or Odaiba. Restored teahouses, former duck‑hunting sites and venerable black pines add interest. For photography, morning light over the water is especially beautiful.",
    description_ko: "하마리큐 정원은 바닷물을 끌어들이는 ‘시오이리’ 연못과 이중 방조제를 갖춘 에도 시대의 다이묘 정원입니다. 나카지마 다실에서는 연못 너머 도심 스카이라인을 바라볼 수 있어 역사 정원과 현대 도시의 대비를 즐길 수 있습니다. 초봄 유채꽃, 초여름 붓꽃, 가을 단풍 등 사계의 색채가 풍부하며, 인근 수상버스 선착장과 연결되어 아사쿠사·오다이바와의 연계 관광도 편리합니다. 복원 다실, 옛 오리사냥터, 노송 등 볼거리가 많고, 물가 풍경은 오전 햇살에 특히 아름답습니다.",
    description_fr: "Les jardins Hama‑rikyu, jardins de daimyo de l’époque d’Edo, sont célèbres pour leur étang à marée alimenté en eau de mer et leurs doubles vannes. Depuis la maison de thé Nakajima, on admire l’étang avec la skyline de Tokyo en arrière‑plan—un dialogue entre histoire et modernité. Colza au début du printemps, iris au début de l’été, érables en automne… les saisons s’y succèdent en couleurs. Un embarcadère tout proche facilite une boucle avec Asakusa ou Odaiba. Pavillons de thé restaurés, anciens parcs à canards et pins noirs centenaires complètent la visite; la lumière du matin y est particulièrement photogénique.",
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
