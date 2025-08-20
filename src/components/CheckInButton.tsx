'use client';

import React, { useState } from 'react';
import { MapPin, Camera, Globe, Lock, Check } from 'lucide-react';
import { useCheckIn } from '@/contexts/CheckInContext';
import { useAuth } from '@/contexts/AuthContext';
import { TouristSpot } from '@/types';

interface CheckInButtonProps {
  spot: TouristSpot;
  className?: string;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({ spot, className = '' }) => {
  const { user } = useAuth();
  const { addCheckIn, hasCheckedIn, loading } = useCheckIn();
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const alreadyCheckedIn = hasCheckedIn(spot.id);

  const handleCheckIn = async () => {
    if (!user) {
      alert('ログインが必要です');
      return;
    }

    if (alreadyCheckedIn) {
      alert('このスポットには既にチェックインしています');
      return;
    }

    setShowModal(true);
  };

  const handleSubmitCheckIn = async () => {
    if (!user) return;

    setSubmitting(true);
    try {
      // Get current location (optional)
      const getCurrentLocation = (): Promise<{lat: number, lng: number} | undefined> => {
        return new Promise((resolve) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                });
              },
              () => resolve(undefined),
              { timeout: 5000 }
            );
          } else {
            resolve(undefined);
          }
        });
      };

      const location = await getCurrentLocation();

      await addCheckIn({
        spotId: spot.id,
        spotName: spot.name,
        spotCategory: spot.category,
        spotArea: spot.area,
        location,
        note: note.trim() || undefined,
        photos: photos.length > 0 ? photos : undefined,
        isPublic
      });

      setShowModal(false);
      setNote('');
      setPhotos([]);
    } catch (error) {
      console.error('Error checking in:', error);
      alert('チェックインに失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // In a real app, you would upload to Firebase Storage
    // For demo purposes, we'll use placeholder URLs
    const newPhotos = Array.from(files).map((file, index) => 
      `https://via.placeholder.com/300x200?text=CheckIn+Photo+${photos.length + index + 1}`
    );
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  return (
    <>
      <button
        onClick={handleCheckIn}
        disabled={loading || alreadyCheckedIn}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${alreadyCheckedIn
            ? 'bg-green-100 text-green-700 cursor-default'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        title={alreadyCheckedIn ? 'チェックイン済み' : 'このスポットにチェックイン'}
      >
        {alreadyCheckedIn ? (
          <>
            <Check className="w-5 h-5" />
            <span>チェックイン済み</span>
          </>
        ) : (
          <>
            <MapPin className="w-5 h-5" />
            <span>チェックイン</span>
          </>
        )}
      </button>

      {/* Check-in Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {spot.name} にチェックイン
            </h3>

            {/* Note */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メモ（任意）
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="このスポットでの体験を共有しましょう..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={200}
              />
              <div className="text-xs text-gray-500 mt-1">
                {note.length}/200
              </div>
            </div>

            {/* Photo Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                写真を追加（任意）
              </label>
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4" />
                <span className="text-sm">写真を選択</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              
              {photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Setting */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公開設定
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="privacy"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Globe className="w-4 h-4 text-green-600" />
                  <span className="text-sm">公開（他のユーザーに表示される）</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Lock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">非公開（自分のみ）</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmitCheckIn}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'チェックイン中...' : 'チェックイン'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckInButton;