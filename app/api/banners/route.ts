import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Banner from "@/lib/models/Banner";

// ✅ GET BANNERS
export async function GET() {
    try {
        await connectDB();
        const banners = await Banner.find({}).sort({ createdAt: -1 });
        return NextResponse.json(banners);
    } catch (error: any) {
        console.error("GET ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
    }
}

// ✅ ADD BANNER
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { imageUrl, title, link } = body;

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        await connectDB();
        const newBanner = await Banner.create({ imageUrl, title, link });

        return NextResponse.json(newBanner, { status: 201 });
    } catch (error: any) {
        console.error("POST ERROR:", error);
        return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
    }
}

// ✅ DELETE BANNER
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await connectDB();
        await Banner.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error: any) {
        console.error("DELETE ERROR:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
