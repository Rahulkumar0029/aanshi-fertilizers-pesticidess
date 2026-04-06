import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import mongoose from "mongoose";

// ✅ UPDATE order
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid order ID" },
                { status: 400 }
            );
        }

        await connectDB();

        const body = await req.json();

        const updatedOrder = await Order.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedOrder) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedOrder);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to update order", details: error.message },
            { status: 500 }
        );
    }
}