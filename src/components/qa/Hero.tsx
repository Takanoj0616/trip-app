'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const { currentLanguage } = useLanguage();
  const i18n = {
    ja: {
      title: 'Q&A掲示板',
      desc1: '日本旅行に関する疑問や質問を投稿して、経験豊富な旅行者からアドバイスをもらいましょう。',
      desc2: 'あなたの知識も他の旅行者の役に立ちます。',
      ask: '質問する',
      askAria: '新しい質問を投稿する',
    },
    en: {
      title: 'Q&A Board',
      desc1: 'Post your Japan travel questions and get advice from experienced travelers.',
      desc2: 'Your knowledge can also help other travelers.',
      ask: 'Ask a Question',
      askAria: 'Post a new question',
    },
    ko: {
      title: 'Q&A 게시판',
      desc1: '일본 여행에 관한 궁금증을 올리고, 경험 많은 여행자에게 조언을 받아보세요.',
      desc2: '당신의 지식도 다른 여행자에게 큰 도움이 됩니다.',
      ask: '질문하기',
      askAria: '새로운 질문을 게시',
    },
    fr: {
      title: 'Forum Questions/Réponses',
      desc1: 'Posez vos questions sur le voyage au Japon et recevez des conseils de voyageurs expérimentés.',
      desc2: 'Vos connaissances peuvent aussi aider les autres voyageurs.',
      ask: 'Poser une question',
      askAria: 'Publier une nouvelle question',
    },
  } as const;
  const tr = (i18n as any)[currentLanguage] || (i18n as any).ja;
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
            background: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {tr.title}
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium mb-8" style={{color:'rgba(255,255,255,0.92)'}}>
          {tr.desc1}<br />
          {tr.desc2}
        </p>
        
        <button 
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          aria-label={tr.askAria}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {tr.ask}
        </button>
      </div>
    </div>
  );
}
