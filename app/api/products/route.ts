import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { requireOwner } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireOwner();
    await connectDB();

    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const category =
      typeof body.category === "string" ? body.category.trim() : "";
    const size = typeof body.size === "string" ? body.size.trim() : "";
    const usage = typeof body.usage === "string" ? body.usage.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const image = typeof body.image === "string" ? body.image.trim() : "";

    if (!name || !category) {
      return NextResponse.json(
        { error: "Product name and category are required" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      ...body,
      name,
      category,
      size,
      usage,
      description,
      image,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("POST PRODUCT ERROR:", error);

    if (error.message === "UNAUTHORIZED_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to add product", details: error.message },
      { status: 500 }
    );
  }
}