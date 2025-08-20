'use client';

import React, { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface ReviewFormProps {
  spotId: string;
  onSubmit: (review: {
    rating: number;
    comment: string;
    images?: string[];
  }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  spotId,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploadingImages(true);
    try {
      // In a real app, you would upload to Firebase Storage or another service
      // For demo purposes, we'll use placeholder URLs
      const newImages = Array.from(files).map((file, index) => 
        `https://via.placeholder.com/300x200?text=Review+Image+${images.length + index + 1}`
      );
      setImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('評価を選択してください');
      return;
    }

    if (comment.trim().length < 10) {
      alert('レビューは10文字以上で入力してください');
      return;
    }

    await onSubmit({
      rating,
      comment: comment.trim(),
      images: images.length > 0 ? images : undefined
    });
  };

  if (!user) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">レビューを投稿するにはログインが必要です</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">レビューを投稿</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          評価 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-colors"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {rating === 1 && '悪い'}
              {rating === 2 && 'まあまあ'}
              {rating === 3 && '普通'}
              {rating === 4 && '良い'}
              {rating === 5 && '最高'}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          レビュー <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="この場所の体験について詳しく教えてください（10文字以上）"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          maxLength={1000}
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>最小10文字</span>
          <span>{comment.length}/1000</span>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          写真を追加（任意）
        </label>
        
        {/* Upload Button */}
        <div className="mb-4">
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">写真を選択</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImages}
            />
          </label>
          {uploadingImages && (
            <span className="ml-2 text-sm text-gray-500">アップロード中...</span>
          )}
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {user.name?.charAt(0) || user.email.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">{user.name || 'ユーザー'}</p>
          <p className="text-sm text-gray-500">としてレビューを投稿</p>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading || rating === 0 || comment.trim().length < 10}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '投稿中...' : 'レビューを投稿'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;