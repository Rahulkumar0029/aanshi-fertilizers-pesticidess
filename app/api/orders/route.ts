import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { getUser } from "@/lib/auth";

const ALLOWED_ORDER_STATUSES = new Set([
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
]);

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

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

    const orders =
      user.role === "owner"
        ? await Order.find({}).sort({ createdAt: -1 }).lean()
        : await Order.find({ userId: user.id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET ORDERS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    );
  }
}

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

    const productId = cleanString(body.productId);
    const productName = cleanString(body.productName);
    const productCategory = cleanString(body.productCategory);
    const productSize = cleanString(body.productSize);
    const customerName = cleanString(body.customerName) || user.name;
    const phone = cleanString(body.phone);
    const source = cleanString(body.source) || "WhatsApp";

    let status = cleanString(body.status) || "Pending";
    if (!ALLOWED_ORDER_STATUSES.has(status)) {
      status = "Pending";
    }

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

    const order = await Order.create({
      userId: user.id,
      productId,
      productName,
      productCategory,
      productSize,
      customerName,
      phone,
      status,
      source,
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