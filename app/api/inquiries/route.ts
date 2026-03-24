import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getUser } from "@/lib/auth";

const DATA_PATH = path.join(process.cwd(), "lib/data/inquiries.json");

async function getInquiries() {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveInquiries(inquiries: any[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(inquiries, null, 4));
}

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const queries = await getInquiries();
  
  if (user.role === "owner") {
    return NextResponse.json(queries);
  } else {
    // Return only inquiries for this specific user
    return NextResponse.json(queries.filter((q: any) => q.userId === user.id));
  }
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, productName, productCategory } = await request.json();
    const inquiries = await getInquiries();
    
    const newInquiry = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      productId,
      productName,
      productCategory,
      timestamp: new Date().toISOString(),
      status: "pending"
    };
    
    inquiries.push(newInquiry);
    await saveInquiries(inquiries);
    
    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 });
  }
}
