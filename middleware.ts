import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and auth routes
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/onboarding') ||
    pathname.startsWith('/api/user') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/test-onboarding') ||
    pathname.startsWith('/debug-flow') ||
    // Allow static files (images, icons, etc.)
    /\.(svg|png|jpg|jpeg|gif|ico|webp|avif)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Allow access to the home page and login page without redirection
  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next();
  }

  // Get session cookie
  const sessionCookie = getSessionCookie(request);

  // If no session, redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For all other routes, let the pages handle their own logic
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};