'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, Calendar, Camera, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewsListProps {
  reviews: Review[];
  spotId: string;
  onDeleteReview?: (reviewId: string) => Promise<void>;
  onReportReview?: (reviewId: string) => Promise<void>;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  spotId,
  onDeleteReview,
  onReportReview
}) => {
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          まだレビューがありません
        </h3>
        <p className="text-gray-600">
          最初のレビューを投稿してみませんか？
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const isExpanded = expandedReviews.has(review.id);
        const isLongComment = review.comment.length > 200;
        const displayComment = isExpanded || !isLongComment 
          ? review.comment 
          : review.comment.substring(0, 200) + '...';

        return (
          <div key={review.id} className="bg-white border rounded-lg p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {review.userName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{review.userName}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>

              {/* Actions Menu */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === review.id ? null : review.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {dropdownOpen === review.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                    {user?.id === review.userId && onDeleteReview && (
                      <button
                        onClick={() => {
                          onDeleteReview(review.id);
                          setDropdownOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        削除
                      </button>
                    )}
                    {user?.id !== review.userId && onReportReview && (
                      <button
                        onClick={() => {
                          onReportReview(review.id);
                          setDropdownOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Flag className="w-4 h-4 inline mr-2" />
                        報告
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-3">
              {renderStars(review.rating)}
            </div>

            {/* Comment */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {displayComment}
              </p>
              {isLongComment && (
                <button
                  onClick={() => toggleExpanded(review.id)}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {isExpanded ? '折りたたむ' : 'もっと見る'}
                </button>
              )}
            </div>

            {/* Images */}
            {review.images && review.images.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {review.images.length}枚の写真
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {review.images.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onClick={() => {
                          // TODO: Open image lightbox
                          window.open(image, '_blank');
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">役に立った</span>
              </button>
              
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <span className="text-sm">返信</span>
              </button>
            </div>
          </div>
        );
      })}

      {/* Load More Button */}
      {reviews.length >= 10 && (
        <div className="text-center">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            さらに読み込む
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;