// Fetch Place IDs via Text Search and then fetch detailed fields for each.
// Usage:
//   GOOGLE_MAPS_API_KEY=xxxx node scripts/fetch-place-details.js --queries "Meiji Jingu,Tokyo|Imperial Palace East Gardens,Tokyo|Shinjuku Gyoen National Garden,Tokyo|Hama-rikyu Gardens,Tokyo|Tokyo National Museum,Tokyo|Daiba Park,Tokyo"

const fetch = global.fetch || require('node-fetch');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error('Missing GOOGLE_MAPS_API_KEY / NEXT_PUBLIC_GOOGLE_MAPS_API_KEY / GOOGLE_PLACES_API_KEY');
  process.exit(1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { queries: [], simple: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--queries') {
      out.queries = args[++i].split('|').map(s => s.trim()).filter(Boolean);
    } else if (args[i] === '--simple') {
      out.simple = true;
    }
  }
  return out;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function searchPlace(query) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('region', 'jp');
  url.searchParams.set('key', API_KEY);
  const data = await fetchJson(url.toString());
  if (!data.results || !data.results.length) return null;
  return data.results[0];
}

async function fetchDetails(placeId, simple) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  const fields = simple
    ? 'name,formatted_address,geometry,opening_hours,formatted_phone_number,website,rating,user_ratings_total,price_level,types'
    : 'name,formatted_address,geometry,opening_hours,international_phone_number,formatted_phone_number,website,rating,user_ratings_total,price_level,types,photos';
  url.searchParams.set('fields', fields);
  url.searchParams.set('key', API_KEY);
  const data = await fetchJson(url.toString());
  return data.result;
}

async function main() {
  const { queries, simple } = parseArgs();
  if (!queries.length) {
    console.error('Provide --queries "q1|q2|..."');
    process.exit(1);
  }

  const results = [];
  for (const q of queries) {
    try {
      const s = await searchPlace(q);
      if (!s) {
        results.push({ query: q, error: 'not_found' });
        continue;
      }
      const d = await fetchDetails(s.place_id, simple);
      results.push({ query: q, place_id: s.place_id, details: d });
    } catch (e) {
      results.push({ query: q, error: e.message });
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
