import { NextRequest, NextResponse } from 'next/server'

type SortBy = 'createdAt' | 'viewCount' | 'likeCount'
type SortOrder = 'asc' | 'desc'

interface TravelPost {
  id: string
  title: string
  content: string
  excerpt?: string
  author: string
  region?: string
  category?: string
  tags: string[]
  images: string[]
  viewCount: number
  likeCount: number
  createdAt: string
}

// In-memory mock data (recreated per server start)
const seed: TravelPost[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `mock-${i + 1}`,
  title: i % 3 === 0 ? '広島の平和記念公園と宮島を巡る歴史の旅' : i % 3 === 1 ? '金沢の兼六園と近江町市場で冬の味覚を堪能' : 'あの花の聖地巡礼 - 埼玉県秩父市',
  content:
    'ダミーの旅行記本文です。食・文化・自然など様々なテーマで日本各地を巡る旅のサンプルデータ。',
  excerpt: 'ダミーの旅行記本文です。日本各地を巡る旅のサンプル...',
  author: 'Japan Guide User',
  region: i % 3 === 0 ? '中国' : i % 3 === 1 ? '中部' : '関東',
  category: i % 3 === 0 ? '歴史・文化' : i % 3 === 1 ? 'グルメ' : 'アニメ・聖地',
  tags: ['寺社', '自然', '買い物'].slice(0, (i % 3) + 1),
  images: [
    i % 3 === 0
      ? 'https://images.unsplash.com/photo-1549880181-56a44cf4a9a7?w=1200&h=800&fit=crop'
      : i % 3 === 1
      ? 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1200&h=800&fit=crop'
      : 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&h=800&fit=crop',
  ],
  viewCount: 100 + i * 11,
  likeCount: 20 + i * 3,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}))

function applyFilters(items: TravelPost[], params: URLSearchParams) {
  let list = [...items]
  const search = params.get('search')?.toLowerCase() || ''
  const region = params.get('region') || ''
  const category = params.get('category') || ''
  const sortBy = (params.get('sortBy') as SortBy) || 'createdAt'
  const order = (params.get('order') as SortOrder) || 'desc'

  if (search) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.content.toLowerCase().includes(search) ||
        p.tags.some((t) => t.toLowerCase().includes(search))
    )
  }
  if (region) list = list.filter((p) => p.region === region)
  if (category) list = list.filter((p) => p.category === category)

  list.sort((a, b) => {
    const dir = order === 'asc' ? 1 : -1
    if (sortBy === 'createdAt') return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
    if (sortBy === 'viewCount') return (a.viewCount - b.viewCount) * dir
    if (sortBy === 'likeCount') return (a.likeCount - b.likeCount) * dir
    return 0
  })

  return list
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(24, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)))

  const filtered = applyFilters(seed, searchParams)
  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const posts = filtered.slice(start, start + limit)

  return NextResponse.json({
    posts,
    pagination: { page, limit, total, totalPages },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || !body.title || !body.content || !body.author) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
  }

  const newPost: TravelPost = {
    id: `created-${Date.now()}`,
    title: body.title,
    content: body.content,
    excerpt: body.excerpt || body.content?.slice(0, 200),
    author: body.author,
    region: body.region || '',
    category: body.category || '',
    tags: Array.isArray(body.tags) ? body.tags : [],
    images: Array.isArray(body.images) ? body.images : [],
    viewCount: 0,
    likeCount: 0,
    createdAt: new Date().toISOString(),
  }
  // In-memory only (would push to DB in real app)
  seed.unshift(newPost)
  return NextResponse.json(newPost, { status: 201 })
}

