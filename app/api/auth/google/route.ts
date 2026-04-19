// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';

export async function GET(request: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'Google client id is missing');
    return NextResponse.redirect(loginUrl);
  }

  const state = request.nextUrl.searchParams.get('state') ?? '';
  const nonce = request.nextUrl.searchParams.get('nonce') ?? '';

  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
    `${request.nextUrl.origin}/login/google-callback`;

  const googleUrl = new URL(GOOGLE_AUTH_ENDPOINT);
  googleUrl.searchParams.set('client_id', clientId);
  googleUrl.searchParams.set('redirect_uri', redirectUri);
  googleUrl.searchParams.set('response_type', 'id_token');
  googleUrl.searchParams.set('scope', 'openid email profile');
  googleUrl.searchParams.set('prompt', 'select_account');

  if (state) {
    googleUrl.searchParams.set('state', state);
  }

  if (nonce) {
    googleUrl.searchParams.set('nonce', nonce);
  }

  return NextResponse.redirect(googleUrl);
}
