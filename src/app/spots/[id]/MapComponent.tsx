'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Leaflet CSSのスタイル問題を解決
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapComponent() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // 地図初期化
    const map = L.map(mapContainerRef.current).setView([35.6586, 139.7454], 16);
    mapRef.current = map;

    // タイルレイヤー追加
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // 東京タワーのマーカー
    const marker = L.marker([35.6586, 139.7454]).addTo(map);
    marker.bindPopup(`
      <div class="text-center">
        <h3 class="font-semibold text-lg mb-2">東京タワー</h3>
        <p class="text-sm text-gray-600">Tokyo Tower</p>
        <p class="text-sm text-gray-600 mt-1">333m 電波塔・展望台</p>
      </div>
    `).openPopup();

    // カスタムスタイルでポップアップを調整
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-popup-content-wrapper {
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
      }
      .leaflet-popup-tip {
        box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
      }
    `;
    document.head.appendChild(style);

    // 周辺の主要スポット（参考用）
    const nearbySpots = [
      { name: '増上寺', coords: [35.6567, 139.7456] },
      { name: '芝公園', coords: [35.6577, 139.7469] },
      { name: '赤羽橋駅', coords: [35.6548, 139.7434] },
    ];

    nearbySpots.forEach(spot => {
      const spotIcon = L.divIcon({
        html: `<div class="bg-primary-light text-white text-xs px-2 py-1 rounded-full font-semibold">${spot.name}</div>`,
        className: 'custom-marker',
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });

      L.marker(spot.coords as [number, number], { icon: spotIcon }).addTo(map);
    });

    // クリーンアップ
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="h-96 rounded-2xl border border-border-light shadow-lg"
      style={{ 
        minHeight: '400px',
        backgroundColor: '#f8fafc'
      }}
    />
  );
}