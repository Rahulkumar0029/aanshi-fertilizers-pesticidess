import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { requireOwner } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireOwner();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...body,
        name: typeof body.name === "string" ? body.name.trim() : body.name,
        category:
          typeof body.category === "string"
            ? body.category.trim()
            : body.category,
        size: typeof body.size === "string" ? body.size.trim() : "",
        description:
          typeof body.description === "string" ? body.description.trim() : "",
        usage: typeof body.usage === "string" ? body.usage.trim() : "",
        image: typeof body.image === "string" ? body.image.trim() : body.image,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("PUT PRODUCT ERROR:", error);

    if (error.message === "UNAUTHORIZED_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireOwner();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedProduct = await Product.findByIdAndDelete(id).lean();

    if (!deletedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE PRODUCT ERROR:", error);

    if (error.message === "UNAUTHORIZED_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}