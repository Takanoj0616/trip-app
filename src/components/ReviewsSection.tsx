'use client';

import React, { useState } from 'react';
import { Star, Plus, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Review } from '@/types';
import ReviewsList from './ReviewsList';
import ReviewForm from './ReviewForm';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewsSectionProps {
  spotId: string;
  reviews: Review[];
  averageRating?: number;
  onAddReview: (review: {
    rating: number;
    comment: string;
    images?: string[];
  }) => Promise<void>;
  onDeleteReview?: (reviewId: string) => Promise<void>;
  onReportReview?: (reviewId: string) => Promise<void>;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  spotId,
  reviews,
  averageRating,
  onAddReview,
  onDeleteReview,
  onReportReview
}) => {
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Check if user has already reviewed this spot
  const userHasReviewed = user ? reviews.some(review => review.userId === user.id) : false;

  const handleSubmitReview = async (reviewData: {
    rating: number;
    comment: string;
    images?: string[];
  }) => {
    setLoading(true);
    try {
      await onAddReview(reviewData);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('レビューの投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // Sort and filter reviews
  const sortedAndFilteredReviews = reviews
    .filter(review => filterRating ? review.rating === filterRating : true)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating_high':
          return b.rating - a.rating;
        case 'rating_low':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="space-y-8">
      {/* Reviews Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          レビュー ({reviews.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating ? averageRating.toFixed(1) : '---'}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    averageRating && star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">
              {reviews.length}件のレビューに基づく
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm font-medium w-4">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      {user && !userHasReviewed && !showReviewForm && (
        <div className="text-center">
          <button
            onClick={() => setShowReviewForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            レビューを投稿
          </button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          spotId={spotId}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowReviewForm(false)}
          loading={loading}
        />
      )}

      {/* Filters and Sorting */}
      {reviews.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">フィルター・並び替え:</span>
            </div>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="rating_high">評価の高い順</option>
              <option value="rating_low">評価の低い順</option>
            </select>

            {/* Rating Filter */}
            <select
              value={filterRating || ''}
              onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">すべての評価</option>
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★☆ (4)</option>
              <option value="3">★★★☆☆ (3)</option>
              <option value="2">★★☆☆☆ (2)</option>
              <option value="1">★☆☆☆☆ (1)</option>
            </select>

            {/* Results Count */}
            <span className="text-sm text-gray-500 ml-auto">
              {sortedAndFilteredReviews.length}件のレビュー
            </span>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <ReviewsList
        reviews={sortedAndFilteredReviews}
        spotId={spotId}
        onDeleteReview={onDeleteReview}
        onReportReview={onReportReview}
      />

      {/* User already reviewed notice */}
      {user && userHasReviewed && !showReviewForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            このスポットにはすでにレビューを投稿されています。
          </p>
        </div>
      )}

      {/* Login prompt for non-users */}
      {!user && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">
            レビューを投稿するにはログインが必要です
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ログイン
          </a>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;