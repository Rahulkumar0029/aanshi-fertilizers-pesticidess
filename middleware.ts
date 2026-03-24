import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token");
  const authRole = request.cookies.get("auth_role")?.value;
  const { pathname } = request.nextUrl;

  // Paths that don't require authentication
  const publicPaths = ["/login", "/api/products", "/products"]; 
  const isPublicPath = publicPaths.includes(pathname) || pathname === "/";

  // Allow access to static assets
  const isStaticAsset = 
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") || 
    pathname.includes("favicon.ico") ||
    pathname.includes(".png") ||
    pathname.includes(".jpg");

  if (isStaticAsset) {
    return NextResponse.next();
  }

  // Protect owner routes
  if (pathname.startsWith("/owner")) {
    if (!authToken || authRole !== "owner") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (!authToken && !isPublicPath) {
    // Redirect to login if not authenticated and trying to access a private path
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (authToken && pathname === "/login") {
    // Redirect to home if already authenticated and trying to access login page
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
