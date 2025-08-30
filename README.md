This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# trip-app

## Places Photos: Sync and Runtime Proxy

There are two ways to provide place photos:

- Build-time/Manual sync (low cost): use `scripts/sync-places.js` to fetch Place Details/Photos, download images into `public/images/photos/<placeId>/photo_N.jpg` and update `src/data/tokyo-bookstore-spots.json`. The app reads from this JSON via `src/data/tokyo-bookstore-spots.ts`.
- Runtime proxy: requests to `/images/photos/:placeId/photo_N.jpg` are served by an API route that fetches the corresponding Google Place photo on demand and caches it.

Setup
- Add `GOOGLE_MAPS_API_KEY` (or `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) to your environment.

Manual sync examples
```
# Sync specific place IDs (comma-separated), fetch top 6 photos
GOOGLE_MAPS_API_KEY=xxxx node scripts/sync-places.js --places ChIJm3WItR2MGGAR05t5cpt7U4w,ChIJ2TZSCfmLGGAR26O97vWyYcE --count 6

# Sync all places present in the JSON
GOOGLE_MAPS_API_KEY=xxxx node scripts/sync-places.js --from-json src/data/tokyo-bookstore-spots.json --count 6
```

Runtime proxy
- Route handler: `src/app/images/photos/[placeId]/[file]/route.ts`
- Accepts `photo_1.jpg` (or `1.jpg`) and uses Place Details → Photos endpoint to stream the image.
- Falls back to local files in `public/images/photos/<placeId>/` and `public/images/tokyo/<placeId>/` if present.

Notes
- `src/data/tokyo-bookstore-spots.ts` imports the JSON as the single source of truth, so syncing JSON is enough.
- If you use external image URLs in data, ensure the domain is allowed in `next.config.ts`.
