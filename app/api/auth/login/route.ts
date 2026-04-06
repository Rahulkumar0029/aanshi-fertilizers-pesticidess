import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });

        response.cookies.set("userId", String(user._id), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: "Login failed", details: error.message },
            { status: 500 }
        );
    }
}