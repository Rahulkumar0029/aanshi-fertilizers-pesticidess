import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Banner from "@/lib/models/Banner";
import { requireOwner } from "@/lib/auth";

function normalizeLink(link?: string) {
  const value = typeof link === "string" ? link.trim() : "";
  if (!value) return "";

  const isHttp = value.startsWith("http://") || value.startsWith("https://");
  const isRelative = value.startsWith("/");

  if (!isHttp && !isRelative) {
    throw new Error("Invalid banner link");
  }

  return value;
}

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(banners);
  } catch (error: any) {
    console.error("GET BANNERS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireOwner();
    await connectDB();

    const body = await request.json();
    const imageUrl =
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const link = normalizeLink(body.link);

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const newBanner = await Banner.create({
      imageUrl,
      title,
      link,
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error: any) {
    console.error("POST BANNER ERROR:", error);

    if (error.message === "UNAUTHORIZED_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to create banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireOwner();
    await connectDB();

    const body = await request.json();
    const id = typeof body.id === "string" ? body.id.trim() : "";

    if (!id) {
      return NextResponse.json(
        { error: "Banner ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Banner.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("DELETE BANNER ERROR:", error);

    if (error.message === "UNAUTHORIZED_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to delete banner" },
      { status: 500 }
    );
  }
}