import { NextRequest } from 'next/server';

type ApiTweet = {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  createdAt: string;
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
    quotes: number;
    views?: number;
  };
  hashtags: string[];
  mentions: string[];
  urls: string[];
  media?: {
    type: 'photo' | 'video' | 'gif';
    url: string;
    thumbnailUrl?: string;
    alt?: string;
  }[];
  lang?: string;
};

function buildFallbackTweets(count: number): ApiTweet[] {
  const base: ApiTweet[] = [
    {
      id: 'demo-1',
      content: '浅草寺のライトアップが美しい！今夜は人も少なくて快適に散策できます。',
      author: {
        id: 'u1',
        username: 'tokyo_traveler',
        displayName: 'Tokyo Traveler',
        avatar: '',
      },
      createdAt: new Date().toISOString(),
      metrics: { likes: 32, retweets: 5, replies: 1, quotes: 0, views: 1200 },
      hashtags: ['東京', '浅草', '東京観光'],
      mentions: [],
      urls: [],
      media: [
        { type: 'photo', url: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop', thumbnailUrl: undefined, alt: 'Asakusa night' }
      ],
      lang: 'ja',
    },
    {
      id: 'demo-2',
      content: 'Shibuya is vibrant tonight! Great weather and smooth trains. #Tokyo #Shibuya',
      author: {
        id: 'u2',
        username: 'japan_updates',
        displayName: 'Japan Updates',
        avatar: '',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      metrics: { likes: 58, retweets: 11, replies: 4, quotes: 0, views: 2500 },
      hashtags: ['Tokyo', 'Shibuya'],
      mentions: [],
      urls: [],
      media: [],
      lang: 'en',
    },
    {
      id: 'demo-3',
      content: '京都・清水寺の周辺、朝は比較的人が少なく快適に観光できます。#京都 #清水寺',
      author: {
        id: 'u3',
        username: 'kyoto_walk',
        displayName: 'Kyoto Walk',
        avatar: '',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      metrics: { likes: 74, retweets: 8, replies: 3, quotes: 0 },
      hashtags: ['京都', '清水寺'],
      mentions: [],
      urls: [],
      media: [],
      lang: 'ja',
    },
  ];
  // Repeat/truncate to requested count
  const out: ApiTweet[] = [];
  for (let i = 0; i < Math.max(1, count); i++) {
    const t = base[i % base.length];
    out.push({ ...t, id: `${t.id}-${i}` });
  }
  return out;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '#Tokyo OR #東京';
  const count = Math.min(50, Math.max(1, parseInt(searchParams.get('count') || '20', 10)));

  const keys = {
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  };

  let tweets: ApiTweet[] = [];
  let fallback = false;

  // Try to use twitter-api-v2 if available and credentials exist
  if (keys.appKey && keys.appSecret && keys.accessToken && keys.accessSecret) {
    try {
      // Dynamic import so the app still runs without the package installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = await import('twitter-api-v2').catch(() => null as any);
      if (mod) {
        const client = new mod.TwitterApi({
          appKey: keys.appKey,
          appSecret: keys.appSecret,
          accessToken: keys.accessToken,
          accessSecret: keys.accessSecret,
        });

        const v2 = client.readOnly;
        const res = await v2.v2.search(q, {
          max_results: Math.min(100, count),
          'tweet.fields': ['created_at', 'lang', 'public_metrics', 'entities'],
          expansions: ['author_id', 'attachments.media_keys'],
          'user.fields': ['name', 'username', 'profile_image_url'],
          'media.fields': ['preview_image_url', 'url', 'type', 'alt_text'],
        });

        const users = new Map<string, any>((res.includes?.users || []).map((u: any) => [u.id, u]));
        const mediaMap = new Map<string, any>((res.includes?.media || []).map((m: any) => [m.media_key, m]));

        tweets = (res.data || []).map((t: any) => {
          const author = users.get(t.author_id);
          const urls: string[] = (t.entities?.urls || []).map((u: any) => u.expanded_url || u.url).slice(0, 3);
          const hashtags: string[] = (t.entities?.hashtags || []).map((h: any) => h.tag);
          const mentions: string[] = (t.entities?.mentions || []).map((m: any) => m.username);
          const mediaKeys: string[] = t.attachments?.media_keys || [];
          const media = mediaKeys
            .map((k) => mediaMap.get(k))
            .filter(Boolean)
            .slice(0, 4)
            .map((m: any) => ({
              type: (m.type || 'photo') as 'photo' | 'video' | 'gif',
              url: m.url || m.preview_image_url,
              thumbnailUrl: m.preview_image_url || m.url,
              alt: m.alt_text,
            }));

          return {
            id: t.id,
            content: t.text,
            author: {
              id: t.author_id,
              username: author?.username || 'unknown',
              displayName: author?.name || 'User',
              avatar: author?.profile_image_url || '',
            },
            createdAt: t.created_at || new Date().toISOString(),
            metrics: {
              likes: t.public_metrics?.like_count || 0,
              retweets: t.public_metrics?.retweet_count || 0,
              replies: t.public_metrics?.reply_count || 0,
              quotes: t.public_metrics?.quote_count || 0,
            },
            hashtags,
            mentions,
            urls,
            media,
            lang: t.lang || 'und',
          } as ApiTweet;
        });
      } else {
        fallback = true;
        tweets = buildFallbackTweets(count);
      }
    } catch (e) {
      // Any error -> fallback dataset so UI never breaks
      fallback = true;
      tweets = buildFallbackTweets(count);
    }
  } else {
    // Missing credentials -> fallback
    fallback = true;
    tweets = buildFallbackTweets(count);
  }

  return Response.json({ tweets, has_more: false, fallback }, { status: 200 });
}

