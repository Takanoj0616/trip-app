import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function TwitterImage() {
  const title = 'Japan Travel Guide — Personalized AI Trip Planner'
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #14b8a6, #2563eb)',
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
            opacity: 0.22,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: 60 }}>
          <div style={{ fontSize: 54, fontWeight: 800, textAlign: 'center', lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 26, opacity: 0.95, textAlign: 'center' }}>
            Optimized for US, UK and France audiences
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

