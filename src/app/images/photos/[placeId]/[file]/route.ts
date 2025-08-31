import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for image buffers during runtime
const memoryCache = new Map<string, { buf: ArrayBuffer; contentType: string; ts: number }>();

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function parseIndex(file: string): number {
  // Supports formats like "photo_1.jpg" or "1.jpg"
  const m = file.match(/(?:photo_)?(\d+)\.(?:jpg|jpeg|png|webp|gif)$/i);
  if (!m) return 0;
  const idx = parseInt(m[1], 10);
  return isNaN(idx) ? 0 : Math.max(1, idx);
}


async function fetchPhotoFromGoogle(placeId: string, index: number, apiKey: string): Promise<NextResponse> {
  const cacheKey = `${placeId}-${index}`;
  const cached = memoryCache.get(cacheKey);
  if (cached) {
    return new NextResponse(cached.buf, {
      headers: {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  }

  // 1) Get photo_reference list from Place Details
  const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  detailsUrl.searchParams.set('place_id', placeId);
  detailsUrl.searchParams.set('fields', 'photos');
  detailsUrl.searchParams.set('key', apiKey);

  const detailsRes = await fetch(detailsUrl.toString(), { cache: 'no-store' });
  if (!detailsRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch place details' }, { status: 502 });
  }
  const details = await detailsRes.json();
  const photos: any[] | undefined = details?.result?.photos;
  if (!photos || photos.length === 0) {
    return NextResponse.json({ error: 'No photos available' }, { status: 404 });
  }
  const idx = Math.min(Math.max(index - 1, 0), photos.length - 1);
  const ref = photos[idx]?.photo_reference || photos[idx]?.photoReference;
  if (!ref) {
    return NextResponse.json({ error: 'Photo reference not found' }, { status: 404 });
  }

  // 2) Fetch the actual photo
  const photoUrl = new URL('https://maps.googleapis.com/maps/api/place/photo');
  photoUrl.searchParams.set('maxwidth', '1600');
  photoUrl.searchParams.set('photoreference', ref);
  photoUrl.searchParams.set('key', apiKey);

  const photoRes = await fetch(photoUrl.toString(), { redirect: 'follow' });
  if (!photoRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 502 });
  }
  const buf = await photoRes.arrayBuffer();
  const contentType = photoRes.headers.get('content-type') || 'image/jpeg';

  memoryCache.set(cacheKey, { buf, contentType, ts: Date.now() });

  return new NextResponse(buf, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

export async function GET(_req: NextRequest, context: { params: { placeId: string; file: string } }) {
  const { placeId, file } = context.params;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

  // If no API key, return 404 to avoid invalid image response
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 404 });
  }

  const index = parseIndex(file) || 1;
  try {
    return await fetchPhotoFromGoogle(placeId, index, apiKey);
  } catch (e) {
    console.error('Photo proxy error', e);
    return NextResponse.json({ error: 'Photo proxy failed' }, { status: 500 });
  }
}

