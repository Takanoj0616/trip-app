import { Metadata } from 'next';
import { Suspense } from 'react';
import QnaPageClient from './QnaPageClient';

export const metadata: Metadata = {
  title: 'Q&A掲示板 | Japan Travel Guide',
  description: '日本旅行に関する質問と回答を共有できる掲示板。旅行の疑問を解決し、現地の情報を交換しましょう。',
};

export default function QnaPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QnaPageClient />
    </Suspense>
  );
}
