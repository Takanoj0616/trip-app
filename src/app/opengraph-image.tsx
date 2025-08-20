import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Japan Travel Guide - AI-Powered Japan Trip Planner'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255, 142, 83, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(253, 121, 168, 0.3) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: '80px',
              marginBottom: '20px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            }}
          >
            🗾
          </div>
          
          {/* Title */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 20px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              lineHeight: 1.2,
            }}
          >
            Japan Travel Guide
          </h1>
          
          {/* Subtitle */}
          <p
            style={{
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 30px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              maxWidth: '800px',
            }}
          >
            AI-Powered Japan Trip Planner
          </p>
          
          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'white',
                fontSize: '24px',
              }}
            >
              <span>🤖</span>
              <span>AI Planning</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'white',
                fontSize: '24px',
              }}
            >
              <span>🗺️</span>
              <span>Tokyo Guide</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'white',
                fontSize: '24px',
              }}
            >
              <span>⭐</span>
              <span>Free</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Text */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '40px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '20px',
            fontWeight: '500',
          }}
        >
          travelguidejapan.net
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
