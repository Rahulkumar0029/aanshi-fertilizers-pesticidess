import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";
import { requireOwner } from "@/lib/auth";

const ALLOWED_KEYS = new Set([
  "contactPhone",
  "contactWhatsApp",
  "contactEmail",
  "contactAddress",
]);

export async function GET() {
  try {
    await connectDB();

    const settings = await Settings.find({}).lean();

    const result = settings.reduce((acc, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET SETTINGS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireOwner();
    await connectDB();

    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_KEYS.has(key)) continue;

      await Settings.findOneAndUpdate(
        { key },
        { key, value: typeof value === "string" ? value.trim() : value },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({
      message: "Settings updated successfully",
    });
  } catch (error: any) {
    console.error("POST SETTINGS ERROR:", error);

    if (error.message === "UNAUTHORIZED_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}