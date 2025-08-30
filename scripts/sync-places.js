/*
  Sync Google Places details and photos to local assets and JSON.

  Usage:
    GOOGLE_MAPS_API_KEY=xxxxx node scripts/sync-places.js --places <placeId1,placeId2> --count 6
    GOOGLE_MAPS_API_KEY=xxxxx node scripts/sync-places.js --from-json src/data/tokyo-bookstore-spots.json --count 6

  What it does:
    - Reads place IDs from args or from the JSON file
    - Calls Place Details to get photos, rating, user_ratings_total, opening hours, phone
    - Downloads N photos into public/images/photos/<placeId>/photo_i.jpg
    - Updates the JSON's images array and metadata
*/

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
if (!API_KEY) {
  console.error('Missing GOOGLE_MAPS_API_KEY env var.');
  process.exit(1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { places: [], fromJson: null, count: 6 };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--places') {
      out.places = args[++i].split(',').map(s => s.trim()).filter(Boolean);
    } else if (a === '--from-json') {
      out.fromJson = args[++i];
    } else if (a === '--count') {
      out.count = parseInt(args[++i], 10) || 6;
    }
  }
  return out;
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${url}`);
  return res.json();
}

async function fetchBuffer(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
  return res.arrayBuffer();
}

function mapPriceLevel(level) {
  // 0-4 -> our buckets
  if (level == null) return undefined;
  if (level <= 1) return 'budget';
  if (level === 2) return 'moderate';
  if (level === 3) return 'expensive';
  return 'luxury';
}

function parseOpeningHours(oh) {
  // Prefer weekday_text like "Monday: 10:00 AM – 9:00 PM"
  const result = {};
  const order = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const text = oh?.weekday_text;
  if (Array.isArray(text) && text.length === 7) {
    for (const line of text) {
      const [day, rest] = line.split(':');
      if (!rest) continue;
      const key = day.toLowerCase();
      const normalized = rest.trim();
      if (key.startsWith('mon')) result.monday = normalized;
      else if (key.startsWith('tue')) result.tuesday = normalized;
      else if (key.startsWith('wed')) result.wednesday = normalized;
      else if (key.startsWith('thu')) result.thursday = normalized;
      else if (key.startsWith('fri')) result.friday = normalized;
      else if (key.startsWith('sat')) result.saturday = normalized;
      else if (key.startsWith('sun')) result.sunday = normalized;
    }
  }
  // Fallback: return as-is if empty
  return result;
}

async function syncPlace(placeId, count) {
  const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  detailsUrl.searchParams.set('place_id', placeId);
  detailsUrl.searchParams.set('fields', 'name,photos,rating,user_ratings_total,opening_hours,formatted_phone_number,price_level,geometry,formatted_address');
  detailsUrl.searchParams.set('key', API_KEY);

  const details = await fetchJson(detailsUrl.toString());
  if (details.status !== 'OK') throw new Error(`Place Details error for ${placeId}: ${details.status}`);
  const r = details.result;

  const photos = Array.isArray(r.photos) ? r.photos.slice(0, count) : [];
  const dir = path.join(process.cwd(), 'public', 'images', 'photos', placeId);
  await ensureDir(dir);

  const images = [];
  for (let i = 0; i < photos.length; i++) {
    const ref = photos[i].photo_reference;
    if (!ref) continue;
    const photoUrl = new URL('https://maps.googleapis.com/maps/api/place/photo');
    photoUrl.searchParams.set('maxwidth', '1600');
    photoUrl.searchParams.set('photoreference', ref);
    photoUrl.searchParams.set('key', API_KEY);

    const buf = await fetchBuffer(photoUrl.toString());
    const file = path.join(dir, `photo_${i + 1}.jpg`);
    await fsp.writeFile(file, Buffer.from(buf));
    images.push(`/images/photos/${placeId}/photo_${i + 1}.jpg`);
  }

  return {
    id: placeId,
    name: r.name,
    rating: r.rating,
    reviewCount: r.user_ratings_total,
    openingHours: parseOpeningHours(r.opening_hours),
    phone: r.formatted_phone_number,
    priceRange: mapPriceLevel(r.price_level),
    images,
    location: r.geometry?.location ? { lat: r.geometry.location.lat, lng: r.geometry.location.lng, address: r.formatted_address } : undefined,
  };
}

async function main() {
  const args = parseArgs();
  let placeIds = args.places;

  let jsonPath = args.fromJson || path.join(process.cwd(), 'src', 'data', 'tokyo-bookstore-spots.json');
  let dataset = [];
  try {
    const raw = await fsp.readFile(jsonPath, 'utf8');
    dataset = JSON.parse(raw);
  } catch (_) {}

  if (!placeIds.length && dataset.length) {
    placeIds = dataset.map((s) => s.googlePlaceId || s.id).filter(Boolean);
  }
  if (!placeIds.length) {
    console.error('No place IDs provided or found in JSON.');
    process.exit(1);
  }

  const byId = new Map(dataset.map((s) => [s.googlePlaceId || s.id, s]));

  for (const pid of placeIds) {
    console.log(`Syncing ${pid} ...`);
    try {
      const data = await syncPlace(pid, args.count);
      const target = byId.get(pid);
      if (target) {
        target.images = data.images.length ? data.images : target.images;
        if (data.rating) target.rating = data.rating;
        if (data.reviewCount != null) target.reviewCount = data.reviewCount;
        if (data.openingHours && Object.keys(data.openingHours).length) target.openingHours = data.openingHours;
        if (data.phone) {
          target.contact = target.contact || {};
          target.contact.phone = data.phone;
        }
        if (data.priceRange) target.priceRange = data.priceRange;
        if (data.location) target.location = data.location;
      } else {
        dataset.push({
          id: pid,
          name: data.name || 'Unknown',
          description: 'Imported from Google Places',
          category: 'shopping',
          area: 'tokyo',
          rating: data.rating,
          images: data.images,
          openingHours: data.openingHours,
          contact: { phone: data.phone },
          priceRange: data.priceRange,
          tags: ['book_store', 'point_of_interest', 'establishment'],
          googlePlaceId: pid,
          location: data.location || { lat: 0, lng: 0, address: '' }
        });
      }
    } catch (e) {
      console.error(`Failed to sync ${pid}:`, e.message);
    }
  }

  await fsp.writeFile(jsonPath, JSON.stringify(dataset, null, 2) + '\n');
  console.log('Updated JSON:', jsonPath);
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

