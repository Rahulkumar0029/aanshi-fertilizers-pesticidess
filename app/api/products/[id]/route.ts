import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { requireOwner } from "@/lib/auth";

type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

type RawVariant = {
  label?: unknown;
  mrp?: unknown;
  price?: unknown;
  isDefault?: unknown;
  stock?: unknown;
};

type NormalizedVariant = {
  label: string;
  mrp: number;
  price: number;
  isDefault: boolean;
  stock: StockStatus;
};

function normalizeVariant(variant: RawVariant): NormalizedVariant {
  const label =
    typeof variant.label === "string" ? variant.label.trim() : "";

  const mrp =
    typeof variant.mrp === "number"
      ? variant.mrp
      : Number(variant.mrp ?? 0);

  const price =
    typeof variant.price === "number"
      ? variant.price
      : Number(variant.price ?? 0);

  const stock: StockStatus =
    typeof variant.stock === "string" &&
    ["in_stock", "low_stock", "out_of_stock"].includes(variant.stock)
      ? (variant.stock as StockStatus)
      : "in_stock";

  return {
    label,
    mrp: Number.isFinite(mrp) ? mrp : 0,
    price: Number.isFinite(price) ? price : 0,
    isDefault: Boolean(variant.isDefault),
    stock,
  };
}

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

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const brand = typeof body.brand === "string" ? body.brand.trim() : "";
    const category =
      typeof body.category === "string" ? body.category.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const usage = typeof body.usage === "string" ? body.usage.trim() : "";
    const image = typeof body.image === "string" ? body.image.trim() : "";

    const rawVariants: RawVariant[] = Array.isArray(body.variants)
      ? (body.variants as RawVariant[])
      : [];

    const variants: NormalizedVariant[] = rawVariants
      .map((variant: RawVariant) => normalizeVariant(variant))
      .filter((variant: NormalizedVariant) => {
        return Boolean(
          variant.label &&
            variant.mrp >= 0 &&
            variant.price >= 0
        );
      });

    if (!name || !category) {
      return NextResponse.json(
        { error: "Product name and category are required" },
        { status: 400 }
      );
    }

    if (variants.length === 0) {
      return NextResponse.json(
        { error: "At least one valid product variant is required" },
        { status: 400 }
      );
    }

    const firstDefaultIndex = variants.findIndex(
      (variant: NormalizedVariant) => variant.isDefault
    );

    const normalizedVariants: NormalizedVariant[] =
      firstDefaultIndex >= 0
        ? variants.map((variant: NormalizedVariant, index: number) => ({
            ...variant,
            isDefault: index === firstDefaultIndex,
          }))
        : variants.map((variant: NormalizedVariant, index: number) => ({
            ...variant,
            isDefault: index === 0,
          }));

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        brand,
        category,
        description,
        usage,
        image,
        variants: normalizedVariants,
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