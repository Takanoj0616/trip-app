'use client';

import { useState } from 'react';

interface Answer {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  isBestAnswer?: boolean;
}

interface QAItem {
  id: string;
  question: string;
  answer?: string;
  author: string;
  category: string;
  createdAt: string;
  answers: Answer[];
  views: number;
  status: 'open' | 'answered' | 'closed';
}

interface QACardProps {
  item: QAItem;
}

export default function QACard({ item }: QACardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'answered':
        return '回答済み';
      case 'open':
        return '募集中';
      case 'closed':
        return '終了';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Question Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                {getStatusText(item.status)}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {item.category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {item.question}
            </h3>
            {item.answer && !isExpanded && (
              <p className="text-gray-600 mb-3 line-clamp-2">
                {item.answer}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <span>投稿者: {item.author}</span>
            <span>{item.createdAt}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{item.answers.length} 回答</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{item.views} 閲覧</span>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        {item.answers.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            suppressHydrationWarning
          >
            <span>{isExpanded ? '回答を隠す' : `${item.answers.length}件の回答を見る`}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Answers Section */}
      {isExpanded && item.answers.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">回答一覧</h4>
            <div className="space-y-4">
              {item.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={`p-4 rounded-lg ${
                    answer.isBestAnswer 
                      ? 'bg-green-50 border-2 border-green-200' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {answer.isBestAnswer && (
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-green-700 font-semibold text-sm">ベストアンサー</span>
                    </div>
                  )}
                  
                  <p className="text-gray-800 mb-3 leading-relaxed">{answer.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold"
                      >
                        {answer.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{answer.author}</div>
                        <div className="text-xs text-gray-500">{answer.createdAt}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span>{answer.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Answer Form */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <h5 className="text-md font-semibold text-gray-900 mb-3">この質問に回答する</h5>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="回答を入力してください..."
                suppressHydrationWarning
              />
              <div className="flex justify-end mt-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors" suppressHydrationWarning>
                  回答を投稿
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
