import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Inquiry from "@/lib/models/Inquiry";
import fs from "fs/promises";
import path from "path";

export async function GET() {
    try {
        console.log("Migration started...");
        await connectDB();
        console.log("MongoDB Connected...");

        // 1. Migrate Products
        const productsPath = path.join(process.cwd(), "lib/data/products.json");
        let productsAdded = 0;
        try {
            const productsRaw = await fs.readFile(productsPath, "utf-8");
            const productsData = JSON.parse(productsRaw);

            for (const p of productsData) {
                const { id, ...rest } = p;
                const exists = await Product.findOne({ name: rest.name });
                if (!exists) {
                    await Product.create(rest);
                    productsAdded++;
                }
            }
        } catch (e) {
            console.warn("Products file not found or already migrated");
        }

        // 2. Migrate Inquiries
        const inquiriesPath = path.join(process.cwd(), "lib/data/inquiries.json");
        let inquiriesAdded = 0;
        try {
            const inquiriesRaw = await fs.readFile(inquiriesPath, "utf-8");
            const inquiriesData = JSON.parse(inquiriesRaw);

            for (const i of inquiriesData) {
                const { id, ...rest } = i;
                const exists = await Inquiry.findOne({ userName: rest.userName, timestamp: rest.timestamp });
                if (!exists) {
                    await Inquiry.create(rest);
                    inquiriesAdded++;
                }
            }
        } catch (e) {
            console.warn("Inquiries file not found or already migrated");
        }

        return NextResponse.json({ 
            message: "Migration completed successfully ✅",
            productsAdded,
            inquiriesAdded
        });
    } catch (error: any) {
        console.error("Migration Error:", error);
        return NextResponse.json({ 
            error: "Migration failed", 
            details: error.message,
        }, { status: 500 });
    }
}
