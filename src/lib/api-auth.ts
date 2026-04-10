import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'trip-app-10370';

  // サービスアカウントキーがある場合はそれを使用
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId,
      });
      return adminApp;
    } catch {
      console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY, falling back to default');
    }
  }

  // デフォルト認証情報（Cloud Run, App Engine等で自動利用可能）
  adminApp = initializeApp({ projectId });
  return adminApp;
}

export interface AuthResult {
  user: DecodedIdToken;
}

/**
 * Authorizationヘッダーからfirebase IDトークンを検証する。
 * 成功時は { user } を返し、失敗時は NextResponse (401) を返す。
 */
export async function verifyAuth(
  request: Request
): Promise<AuthResult | NextResponse> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header with Bearer token is required' },
      { status: 401 }
    );
  }

  const idToken = authHeader.slice(7);

  try {
    const app = getAdminApp();
    const decodedToken = await getAuth(app).verifyIdToken(idToken);
    return { user: decodedToken };
  } catch {
    return NextResponse.json(
      { error: 'Invalid or expired authentication token' },
      { status: 401 }
    );
  }
}

/**
 * 認証結果がエラーレスポンスかどうかを判定するtype guard
 */
export function isAuthError(result: AuthResult | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
