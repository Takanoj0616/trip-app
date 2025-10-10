import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function TwitterImage() {
  const title = '日本旅行ガイド'
  const subtitle = '東京観光スポット完全ガイド 2025'
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #dc2626, #f97316)',
          color: '#fff',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'url(https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1500&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 60, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: 68, fontWeight: 900, textAlign: 'center', lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 32, fontWeight: 700, opacity: 0.98, textAlign: 'center' }}>
            {subtitle}
          </div>
          <div style={{ fontSize: 26, opacity: 0.95, textAlign: 'center', marginTop: 12 }}>
            AI旅行プランで最適な日本旅行を
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

