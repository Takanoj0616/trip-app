import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    // Placeholder translation: echo back text to keep UI stable
    // You can integrate a real translation API here later.
    return Response.json({ translatedText: text }, { status: 200 });
  } catch (e) {
    return Response.json({ translatedText: null, error: 'invalid_request' }, { status: 400 });
  }
}

