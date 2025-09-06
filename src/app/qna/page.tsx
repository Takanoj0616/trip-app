import { Metadata } from 'next';
import { Suspense } from 'react';
import QnaPageClient from './QnaPageClient';
import QnaBodyClassHandler from './QnaBodyClassHandler';

export const metadata: Metadata = {
  title: 'Q&A掲示板 | Japan Travel Guide',
  description: '日本旅行に関する質問と回答を共有できる掲示板。旅行の疑問を解決し、現地の情報を交換しましょう。',
};

export default function QnaPage() {
  return (
    <div id="qna-page-root" className="relative min-h-screen">
      <QnaBodyClassHandler />
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="glass-card p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      }>
        <QnaPageClient />
      </Suspense>
    </div>
  );
}
