import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Migration route is disabled in production" },
    { status: 403 }
  );
}