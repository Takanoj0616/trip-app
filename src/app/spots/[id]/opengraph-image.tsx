import { ImageResponse } from 'next/og'
import { allRestaurantSpots } from '@/data/tokyo-restaurant-spots'
import { hotelSpots } from '@/data/hotel-spots'
import { kanngouSpots } from '@/data/kankou-spots'
import { tokyoSpots } from '@/data/tokyo-spots'
import { allBookstoreSpots } from '@/data/tokyo-bookstore-spots'
import { tokyoSpotsDetailed } from '@/data/tokyo-spots-detailed'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Params = { params: Promise<{ id: string }> }

export default async function SpotOg({ params }: Params) {
  const { id } = await params
  const baseUrl = BASE_URL

  const all = [
    ...allRestaurantSpots,
    ...hotelSpots,
    ...kanngouSpots,
    ...tokyoSpots,
    ...allBookstoreSpots,
  ] as any[]

  let name = 'Japan Travel Guide'
  let image: string | undefined

  const hit = all.find((s) => s.id === id)
  if (hit) {
    name = hit.name
    image = hit.images?.[0]
  } else {
    const d = tokyoSpotsDetailed.find((s) => s.id === id)
    if (d) {
      name = d.name?.ja || d.name?.en || Object.values(d.name || {})[0] || 'Japan Travel Guide'
      image = (d.images?.[0] || d.image) as string | undefined
    }
  }

  const bg = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1500&q=60'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(2,6,23,0.6), rgba(30,58,138,0.5))',
          }}
        />
        <div style={{ position: 'relative', padding: 64, color: '#fff', textAlign: 'center', maxWidth: 1000 }}>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1 }}>{name}</div>
          <div style={{ marginTop: 18, fontSize: 28, opacity: 0.95 }}>Japan Travel Guide · Discover & Plan</div>
          <div style={{ marginTop: 24, fontSize: 22, opacity: 0.9 }}>{baseUrl.replace(/^https?:\/\//, '')}</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
import { BASE_URL } from '@/lib/site'
