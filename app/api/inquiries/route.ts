import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/lib/models/Inquiry";
import { getUser } from "@/lib/auth";

const ALLOWED_STATUSES = new Set(["pending", "contacted", "done"]);

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const inquiries =
      user.role === "owner"
        ? await Inquiry.find({}).sort({ createdAt: -1 }).lean()
        : await Inquiry.find({ userId: user.id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(inquiries);
  } catch (error: any) {
    console.error("GET INQUIRIES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const productId = cleanString(body.productId);
    const productName = cleanString(body.productName);
    const productCategory = cleanString(body.productCategory);
    const selectedSize = cleanString(body.selectedSize || body.productSize);
    const selectedPrice = cleanNumber(body.selectedPrice || body.price);
    const selectedMrp = cleanNumber(body.selectedMrp || body.mrp);
    const brand = cleanString(body.brand);
    const phone = cleanString(body.phone);

    if (!productId || !productName || !productCategory) {
      return NextResponse.json(
        { error: "Missing required product fields" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Phone is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const newInquiry = await Inquiry.create({
      userId: user.id,
      userName: user.name,
      phone,
      productId,
      productName,
      productCategory,
      selectedSize,
      selectedPrice,
      selectedMrp,
      brand,
      status: "pending",
    });

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error: any) {
    console.error("POST INQUIRY ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create inquiry", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUser();

    if (!user || user.role !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = cleanString(body.id);
    const status = cleanString(body.status).toLowerCase();

    if (!id) {
      return NextResponse.json(
        { error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json(
        { error: "Invalid inquiry status" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT INQUIRY ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUser();

    if (!user || user.role !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = cleanString(body.id);

    if (!id) {
      return NextResponse.json(
        { error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted = await Inquiry.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Inquiry deleted successfully" });
  } catch (error: any) {
    console.error("DELETE INQUIRY ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry", details: error.message },
      { status: 500 }
    );
  }
}