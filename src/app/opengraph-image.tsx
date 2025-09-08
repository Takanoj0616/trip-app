import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function OpengraphImage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://trip-iwlemq2cb-takanoj0616s-projects.vercel.app'
  const title = 'Japan Travel Guide — Plan Your Japan Trip'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, #0ea5e9, #6366f1)`,
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
              'url(https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1500&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 60 }}>
          <div style={{ fontSize: 56, fontWeight: 800, textAlign: 'center', lineHeight: 1.15 }}>{title}</div>
          <div style={{ fontSize: 28, opacity: 0.95, textAlign: 'center' }}>
            AI itineraries, hidden gems and authentic experiences
          </div>
          <div style={{ marginTop: 20, fontSize: 24, opacity: 0.9 }}>{baseUrl.replace(/^https?:\/\//, '')}</div>
        </div>
      </div>
    ),
    { ...size }
  )
}

