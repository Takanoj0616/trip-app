import { NextRequest, NextResponse } from 'next/server';

// サンプルデータ（Twitter APIが利用不可の場合のフォールバック）
const sampleTweets = [
  {
    id: '1',
    content: '【運行情報】JR山手線は現在、新宿駅での人身事故の影響により、内回り・外回りともに10分程度の遅延が発生しています。復旧まで今しばらくお待ちください。 #東京 #JR山手線 #遅延情報',
    author: {
      id: 'tokyo_traffic_jp',
      username: 'tokyo_traffic_jp',
      displayName: '東京交通情報',
      avatar: '🚇',
    },
    createdAt: new Date().toISOString(),
    metrics: {
      likes: 45,
      retweets: 123,
      replies: 8,
      quotes: 5,
    },
    hashtags: ['東京', 'JR山手線', '遅延情報'],
    mentions: [],
    urls: [],
    contextAnnotations: [],
  },
  {
    id: '2',
    content: '上野公園の桜が5分咲きになりました！今週末がお花見のベストタイミングです。平日の午前中がおすすめです。写真は今朝撮影したものです。 #東京 #東京観光 #桜 #上野公園',
    author: {
      id: 'sakura_tokyo',
      username: 'sakura_tokyo',
      displayName: '東京桜開花情報',
      avatar: '🌸',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分前
    metrics: {
      likes: 287,
      retweets: 156,
      replies: 24,
      quotes: 12,
    },
    hashtags: ['東京', '東京観光', '桜', '上野公園'],
    mentions: [],
    urls: [],
    contextAnnotations: [],
  },
  {
    id: '3',
    content: 'みなとみらいの夜景が今日は特に美しいです！コスモワールドの観覧車と横浜ランドマークタワーのライトアップが最高です。カップルにおすすめスポット！ #横浜 #横浜観光 #みなとみらい #夜景',
    author: {
      id: 'yokohama_night',
      username: 'yokohama_night',
      displayName: '横浜夜景情報',
      avatar: '🌃',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45分前
    metrics: {
      likes: 189,
      retweets: 94,
      replies: 16,
      quotes: 8,
    },
    hashtags: ['横浜', '横浜観光', 'みなとみらい', '夜景'],
    mentions: [],
    urls: [],
    contextAnnotations: [],
  },
  {
    id: '4',
    content: '築地の大和寿司、今日は比較的空いています！平日限定のマグロ定食が絶品です。観光客の皆さん、チャンスですよ！ #東京 #東京グルメ #築地 #寿司',
    author: {
      id: 'tsukiji_gourmet',
      username: 'tsukiji_gourmet',
      displayName: '築地グルメ情報',
      avatar: '🍣',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5時間前
    metrics: {
      likes: 156,
      retweets: 89,
      replies: 18,
      quotes: 7,
    },
    hashtags: ['東京', '東京グルメ', '築地', '寿司'],
    mentions: [],
    urls: [],
    contextAnnotations: [],
  },
  {
    id: '5',
    content: '横浜中華街の春節祭、今年も盛大に開催中！獅子舞や太鼓の演奏が迫力満点です。本格的な中華料理も楽しめます。 #横浜 #横浜中華街 #春節祭 #中華料理',
    author: {
      id: 'chinatown_yokohama',
      username: 'chinatown_yokohama',
      displayName: '横浜中華街情報',
      avatar: '🐉',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1時間前
    metrics: {
      likes: 234,
      retweets: 189,
      replies: 31,
      quotes: 15,
    },
    hashtags: ['横浜', '横浜中華街', '春節祭', '中華料理'],
    mentions: [],
    urls: [],
    contextAnnotations: [],
  },
  {
    id: '6',
    content: '浅草寺の今日の参拝者数は例年より少なめです。ゆっくりお参りできるチャンスです。仲見世通りの人形焼きも並ばずに買えます！ #東京 #東京観光 #浅草寺 #仲見世通り',
    author: {
      id: 'asakusa_info',
      username: 'asakusa_info',
      displayName: '浅草観光案内',
      avatar: '⛩️',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2時間前
    metrics: {
      likes: 67,
      retweets: 34,
      replies: 9,
      quotes: 2,
    },
    hashtags: ['東京', '東京観光', '浅草寺', '仲見世通り'],
    mentions: [],
    urls: [],
    contextAnnotations: [],
  },
  {
    id: '7',
    content: '横浜赤レンガ倉庫でアートイベント開催中！現代アートの展示とワークショップが楽しめます。入場無料なのでぜひお立ち寄りください。 #横浜 #横浜旅行 #赤レンガ倉庫 #アート',
    author: {
      id: 'redbrick_yokohama',
      username: 'redbrick_yokohama',
      displayName: '横浜赤レンガ情報',
      avatar: '🧱',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(), // 2.5時間前
    metrics: {
      likes: 98,
      retweets: 52,
      replies: 14,
      quotes: 6,
    },
    hashtags: ['横浜', '横浜旅行', '赤レンガ倉庫', 'アート'],
    mentions: [],
    urls: [],
    contextAnnotations: [],
  },
  {
    id: '8',
    content: '東京スカイツリーで今夜限定のイルミネーションイベント開催！19:00〜21:00まで特別ライトアップが楽しめます。入場無料です。 #東京 #Tokyo #スカイツリー #イルミネーション',
    author: {
      id: 'skytree_official',
      username: 'skytree_official',
      displayName: '東京スカイツリー公式',
      avatar: '🗼',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3時間前
    metrics: {
      likes: 345,
      retweets: 278,
      replies: 42,
      quotes: 23,
    },
    hashtags: ['東京', 'Tokyo', 'スカイツリー', 'イルミネーション'],
    mentions: [],
    urls: [],
    contextAnnotations: [],
  }
];

export async function GET(request: NextRequest) {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      console.log('Twitter Bearer Token not configured, using sample data');
      return NextResponse.json({
        tweets: sampleTweets,
        meta: { result_count: sampleTweets.length },
        fallback: true
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '#東京 OR #横浜 OR #Tokyo OR #Yokohama OR #東京観光 OR #横浜観光';
    const count = Math.min(parseInt(searchParams.get('count') || '10'), 10); // 制限を10に

    // Twitter API v2を使用してツイートを検索
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${count}&tweet.fields=author_id,created_at,public_metrics,context_annotations,entities&expansions=author_id&user.fields=name,username,profile_image_url`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Twitter API Error:', errorData);
      
      // レート制限や他のAPIエラーの場合、サンプルデータを返す
      if (response.status === 429 || response.status >= 400) {
        console.log('Twitter API error, falling back to sample data');
        return NextResponse.json({
          tweets: sampleTweets,
          meta: { result_count: sampleTweets.length },
          fallback: true,
          error: 'Using sample data due to API limitations'
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch tweets', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // データを整形
    const tweets = data.data?.map((tweet: any) => {
      const author = data.includes?.users?.find((user: any) => user.id === tweet.author_id);
      
      return {
        id: tweet.id,
        content: tweet.text,
        author: {
          id: tweet.author_id,
          username: author?.username || 'unknown',
          displayName: author?.name || 'Unknown User',
          avatar: author?.profile_image_url || '',
        },
        createdAt: tweet.created_at,
        metrics: {
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0,
          quotes: tweet.public_metrics?.quote_count || 0,
        },
        hashtags: tweet.entities?.hashtags?.map((tag: any) => tag.tag) || [],
        mentions: tweet.entities?.mentions?.map((mention: any) => mention.username) || [],
        urls: tweet.entities?.urls?.map((url: any) => url.expanded_url) || [],
        contextAnnotations: tweet.context_annotations || [],
      };
    }) || [];

    return NextResponse.json({
      tweets,
      meta: data.meta || {},
      fallback: false
    });

  } catch (error) {
    console.error('Error fetching tweets:', error);
    
    // エラーが発生した場合もサンプルデータを返す
    console.log('Unexpected error, falling back to sample data');
    return NextResponse.json({
      tweets: sampleTweets,
      meta: { result_count: sampleTweets.length },
      fallback: true,
      error: 'Using sample data due to unexpected error'
    });
  }
}