import { Metadata } from 'next';
import RealtimeContent from '@/components/RealtimeContent';
import BodyClassHandler from './BodyClassHandler';

export const metadata: Metadata = {
  title: 'リアルタイム情報 | Japan Travel Guide',
  description: 'Twitter/Xからの最新旅行情報、観光スポットの現在の状況、交通情報などをリアルタイムで確認できます。',
};

export default function RealtimePage() {
  return (
    <div id="realtime-root">
      <BodyClassHandler />
      <RealtimeContent />
    </div>
  );
}
