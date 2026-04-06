import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { name, email, phone, password } = await req.json();

        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "customer",
        });

        return NextResponse.json(
            {
                message: "Signup successful",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: "Signup failed", details: error.message },
            { status: 500 }
        );
    }
}