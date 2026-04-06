import mongoose from "mongoose";

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache:
        | {
              conn: typeof mongoose | null;
              promise: Promise<typeof mongoose> | null;
          }
        | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = {
        conn: null,
        promise: null,
    };
}

export async function connectDB(): Promise<typeof mongoose> {
    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI is missing");
        throw new Error("MongoDB URI not found");
    }

    if (cached?.conn) {
        return cached.conn;
    }

    if (!cached?.promise) {
        cached!.promise = mongoose
            .connect(MONGODB_URI)
            .then((mongooseInstance) => {
                console.log("MongoDB Connected ✅");
                return mongooseInstance;
            })
            .catch((err) => {
                console.error("MongoDB Connection Error ❌", err);
                throw err;
            });
    }

    cached!.conn = await cached!.promise;
    return cached!.conn;
}