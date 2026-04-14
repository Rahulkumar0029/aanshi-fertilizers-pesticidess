import { NextRequest, NextResponse } from "next/server";

const OWNER_PATHS = ["/owner"];
const ADMIN_PATHS = ["/admin"];
const USER_PATHS = ["/my-orders"];

function matchesProtectedPath(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

async function getUserRole(request: NextRequest) {
  const cookieRole = request.cookies.get("role")?.value;
  if (cookieRole) return cookieRole;

  try {
    const meUrl = new URL("/api/auth/me", request.url);
    const meResponse = await fetch(meUrl, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    if (!meResponse.ok) return null;

    const me = await meResponse.json();
    return me?.role || null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const userId = request.cookies.get("userId")?.value;
  const isLoggedIn = !!userId;

  const isOwnerRoute = matchesProtectedPath(pathname, OWNER_PATHS);
  const isAdminRoute = matchesProtectedPath(pathname, ADMIN_PATHS);
  const isUserRoute = matchesProtectedPath(pathname, USER_PATHS);

  const isLoginRoute = pathname === "/login";
  const isRegisterRoute = pathname === "/register";

  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname === "/about" ||
    pathname === "/wholesale" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password/") ||
    pathname.startsWith("/verify-email/");

  if (isPublicRoute) {
    if ((isLoginRoute || isRegisterRoute) && isLoggedIn) {
      const role = await getUserRole(request);

      if (role === "owner") {
        return NextResponse.redirect(new URL("/owner", request.url));
      }

      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (!isLoggedIn && (isOwnerRoute || isAdminRoute || isUserRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const role = await getUserRole(request);

  if (isOwnerRoute) {
    if (role !== "owner") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isAdminRoute) {
    if (role !== "admin" && role !== "owner") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password/:path*",
    "/verify-email/:path*",
    "/owner/:path*",
    "/admin/:path*",
    "/my-orders/:path*",
    "/about",
    "/wholesale",
    "/products/:path*",
  ],
};