import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/lib/models/Inquiry";
import { getUser } from "@/lib/auth";

// ✅ GET INQUIRIES
export async function GET() {
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        let inquiries;

        if (user.role === "owner") {
            inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
        } else {
            inquiries = await Inquiry.find({ userId: user.id }).sort({ createdAt: -1 });
        }

        return NextResponse.json(inquiries);
    } catch (error: any) {
        console.error("GET ERROR:", error);
        return NextResponse.json(
            { error: "Failed to fetch inquiries", details: error.message },
            { status: 500 }
        );
    }
}

// ✅ CREATE INQUIRY
export async function POST(request: Request) {
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const {
            productId,
            productName,
            productCategory,
            productSize,
            phone,
        } = body;

        if (!productId || !productName || !productCategory) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectDB();

        if (!phone || typeof phone !== "string") {
    return NextResponse.json(
        { error: "Phone is required" },
        { status: 400 }
    );
}

const newInquiry = await Inquiry.create({
    userId: user.id,
    userName: user.name,
    phone: phone.trim(),
    productId,
    productName,
    productCategory,
    productSize: typeof productSize === "string" ? productSize.trim() : "",
    status: "pending",
});

        return NextResponse.json(newInquiry, { status: 201 });
    } catch (error: any) {
        console.error("POST ERROR:", error);
        return NextResponse.json(
            { error: "Failed to create inquiry", details: error.message },
            { status: 500 }
        );
    }
}

// ✅ UPDATE INQUIRY
export async function PUT(request: Request) {
    try {
        const user = await getUser();

        if (!user || user.role !== "owner") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { id, status } = await request.json();

        const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });

        if (!updated) {
            return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("PUT ERROR:", error);
        return NextResponse.json(
            { error: "Failed to update inquiry", details: error.message },
            { status: 500 }
        );
    }
}

// ✅ DELETE INQUIRY
export async function DELETE(request: Request) {
    try {
        const user = await getUser();

        if (!user || user.role !== "owner") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { id } = await request.json();

        const deleted = await Inquiry.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error: any) {
        console.error("DELETE ERROR:", error);
        return NextResponse.json(
            { error: "Failed to delete inquiry", details: error.message },
            { status: 500 }
        );
    }
}