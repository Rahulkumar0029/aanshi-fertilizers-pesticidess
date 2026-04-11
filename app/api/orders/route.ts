import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { getUser } from "@/lib/auth";

// ✅ GET ALL ORDERS
export async function GET() {
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        let orders;

        if (user.role === "owner") {
            orders = await Order.find().sort({ createdAt: -1 });
        } else {
            orders = await Order.find({ userId: user.id }).sort({
                createdAt: -1,
            });
        }

        return NextResponse.json(orders);
    } catch (error: any) {
        console.error("GET ORDERS ERROR:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders", details: error.message },
            { status: 500 }
        );
    }
}

// ✅ CREATE ORDER
export async function POST(req: Request) {
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const body = await req.json();

        const {
            productId,
            productName,
            productCategory,
            productSize,
            customerName,
            phone,
            status,
            source,
        } = body;

        if (!productId || !productName || !productCategory) {
            return NextResponse.json(
                { error: "Missing required product fields" },
                { status: 400 }
            );
        }

        if (!phone || typeof phone !== "string") {
    return NextResponse.json(
        { error: "Phone is required" },
        { status: 400 }
    );
}

const order = await Order.create({
    userId: user.id,
    productId,
    productName,
    productCategory,
    productSize: typeof productSize === "string" ? productSize.trim() : "",
    customerName: customerName || user.name,
    phone: phone.trim(),
    status: status || "Pending",
    source: source || "WhatsApp",
});

        return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
        console.error("POST ORDER ERROR:", error);
        return NextResponse.json(
            { error: "Failed to create order", details: error.message },
            { status: 500 }
        );
    }
}