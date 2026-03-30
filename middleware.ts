import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js middleware runs on edge, can't access localStorage
// This is a placeholder - actual auth check happens client-side
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
