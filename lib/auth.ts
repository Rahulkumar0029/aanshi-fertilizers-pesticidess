"use server";

import { cookies } from "next/headers";

const AUTH_COOKIE = "auth_token";
const ROLE_COOKIE = "auth_role";

export async function login(role: "user" | "owner" = "user") {
  const cookieStore = await cookies();
  
  // Set auth token
  cookieStore.set(AUTH_COOKIE, "mock-session-id", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  // Set role
  cookieStore.set(ROLE_COOKIE, role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(ROLE_COOKIE);
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has(AUTH_COOKIE);
}

export async function getRole() {
  const cookieStore = await cookies();
  const hasAuth = cookieStore.has(AUTH_COOKIE);
  if (!hasAuth) return null;
  return cookieStore.get(ROLE_COOKIE)?.value || "user";
}

export async function getUser() {
  const role = await getRole();
  if (!role) return null;
  return {
    id: role === "owner" ? "owner-1" : "user-1",
    name: role === "owner" ? "Shop Owner" : "Valued Customer",
    role: role
  };
}

export async function isOwner() {
  const role = await getRole();
  return role === "owner";
}
