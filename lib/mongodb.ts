import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI is missing");
        throw new Error("MongoDB URI not found");
    }

    // ✅ Use cached connection
    if (cached.conn) return cached.conn;

    // ✅ Create new connection
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            console.log("MongoDB Connected ✅");
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}