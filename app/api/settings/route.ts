import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";

// ✅ GET SETTINGS
export async function GET() {
    try {
        await connectDB();
        const settings = await Settings.find({});
        const result = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as any);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("GET ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

// ✅ UPDATE SETTINGS
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectDB();

        for (const [key, value] of Object.entries(body)) {
            await Settings.findOneAndUpdate({ key }, { value }, { upsert: true });
        }

        return NextResponse.json({ message: "Settings updated successfully" });
    } catch (error: any) {
        console.error("POST ERROR:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
