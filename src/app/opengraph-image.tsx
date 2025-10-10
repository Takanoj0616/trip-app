import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function OpengraphImage() {
  const title = '日本旅行ガイド'
  const subtitle = '東京観光スポット・ホテル・レストラン完全ガイド'
  const description = 'AI旅行プランで最適な日本旅行を無料作成'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, #dc2626 0%, #f97316 50%, #fbbf24 100%)`,
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
            opacity: 0.25,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: 60, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: 72, fontWeight: 900, textAlign: 'center', lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 36, fontWeight: 700, opacity: 0.98, textAlign: 'center', lineHeight: 1.3 }}>
            {subtitle}
          </div>
          <div style={{ fontSize: 28, opacity: 0.95, textAlign: 'center', marginTop: 12 }}>
            {description}
          </div>
          <div style={{ marginTop: 24, fontSize: 22, opacity: 0.9, background: 'rgba(0,0,0,0.3)', padding: '12px 32px', borderRadius: 999 }}>
            🗼 浅草 | 渋谷 | 新宿 | 秋葉原
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

