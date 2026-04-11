import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

// ✅ GET ALL PRODUCTS
export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error: any) {
        console.error("GET ERROR:", error);
        return NextResponse.json(
            { error: "Failed to fetch products", details: error.message },
            { status: 500 }
        );
    }
}

// ✅ ADD PRODUCT
export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // Standardize: ensure _id is handled by Mongo, and we don't use 'id'
        const { id, size, ...rest } = body;

        const newProduct = await Product.create({
            ...rest,
            size: typeof size === "string" ? size.trim() : "",
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        console.error("POST ERROR:", error);
        return NextResponse.json(
            { error: "Failed to add product", details: error.message },
            { status: 500 }
        );
    }
}