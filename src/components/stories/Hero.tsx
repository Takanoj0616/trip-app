'use client';

export default function StoriesHero() {
  return (
    <div className="relative text-center mb-16 px-4">
      <div 
        className="inline-block max-w-4xl"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '2rem',
          padding: '3rem 4rem',
          margin: '0 1rem'
        }}
      >
        <h1 
          className="text-4xl md:text-5xl font-black mb-6"
          style={{
            background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          旅行記・体験談シェア
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium mb-8" style={{color:'rgba(255,255,255,0.92)'}}>
          あなたの素晴らしい日本旅行の体験を共有し、他の旅行者にインスピレーションを与えましょう。<br />
          思い出に残る瞬間や発見した秘密の場所を教えてください。
        </p>
        
        <button 
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          aria-label="新しい旅行記を投稿する"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新しい旅行記を投稿
        </button>
      </div>
    </div>
  );
}