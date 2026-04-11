import { NextRequest, NextResponse } from "next/server";

const OWNER_PATHS = ["/owner", "/admin"];
const USER_PATHS = ["/my-orders"];

function matchesProtectedPath(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const userId = request.cookies.get("userId")?.value;
  const isLoggedIn = !!userId;

  const isOwnerRoute = matchesProtectedPath(pathname, OWNER_PATHS);
  const isUserRoute = matchesProtectedPath(pathname, USER_PATHS);
  const isLoginRoute = pathname === "/login";

  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname === "/about" ||
    pathname === "/wholesale" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password/");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn && (isOwnerRoute || isUserRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginRoute) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Logged-in user role verification for owner-only routes
  if (isOwnerRoute) {
    try {
      const meUrl = new URL("/api/auth/me", request.url);
      const meResponse = await fetch(meUrl, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store",
      });

      if (!meResponse.ok) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
      }

      const me = await meResponse.json();

      if (me?.role !== "owner") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/forgot-password",
    "/reset-password/:path*",
    "/owner/:path*",
    "/admin/:path*",
    "/my-orders/:path*",
    "/about",
    "/wholesale",
    "/products/:path*",
  ],
};