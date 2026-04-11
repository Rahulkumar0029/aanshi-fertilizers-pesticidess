module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectDB",
    ()=>connectDB
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI;
let cached = global.mongooseCache;
if (!cached) {
    cached = global.mongooseCache = {
        conn: null,
        promise: null
    };
}
async function connectDB() {
    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI is missing");
        throw new Error("MongoDB URI not found");
    }
    if (cached?.conn) {
        return cached.conn;
    }
    if (!cached?.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI).then((mongooseInstance)=>{
            console.log("MongoDB Connected ✅");
            return mongooseInstance;
        }).catch((err)=>{
            console.error("MongoDB Connection Error ❌", err);
            throw err;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
}),
"[project]/lib/models/User.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            "user",
            "owner"
        ],
        default: "user"
    },
    // Owner OTP 2FA
    ownerOtpCodeHash: {
        type: String,
        default: null
    },
    ownerOtpExpiresAt: {
        type: Date,
        default: null
    },
    ownerOtpAttempts: {
        type: Number,
        default: 0
    },
    ownerOtpLastSentAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("User", UserSchema);
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/lib/resend.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getResend",
    ()=>getResend
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/resend/dist/index.mjs [app-route] (ecmascript)");
;
let resendInstance = null;
function getResend() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error("Missing RESEND_API_KEY");
    }
    if (!resendInstance) {
        resendInstance = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Resend"](apiKey);
    }
    return resendInstance;
}
}),
"[project]/app/api/auth/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$resend$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/resend.ts [app-route] (ecmascript)");
;
;
;
;
;
;
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function hashValue(value) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(value).digest("hex");
}
async function POST(req) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
        const body = await req.json();
        const rawEmail = body.email;
        const password = body.password;
        const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
        if (!email || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Email and password are required"
            }, {
                status: 400
            });
        }
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            email: {
                $regex: `^${escapeRegex(email)}$`,
                $options: "i"
            }
        });
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid credentials"
            }, {
                status: 401
            });
        }
        const storedPassword = typeof user.password === "string" ? user.password : "";
        const looksHashed = storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$");
        if (!looksHashed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Account password is not configured correctly"
            }, {
                status: 500
            });
        }
        const isMatch = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, storedPassword);
        if (!isMatch) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid credentials"
            }, {
                status: 401
            });
        }
        // Normal user = direct login
        if (user.role === "user") {
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Login successful",
                user: {
                    _id: String(user._id),
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            });
            response.cookies.set("userId", String(user._id), {
                httpOnly: true,
                sameSite: "lax",
                secure: ("TURBOPACK compile-time value", "development") === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7
            });
            return response;
        }
        // Owner = OTP required
        const now = new Date();
        const lastSentAt = user.ownerOtpLastSentAt ? new Date(user.ownerOtpLastSentAt) : null;
        if (lastSentAt && now.getTime() - lastSentAt.getTime() < 60 * 1000) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Please wait before requesting another OTP"
            }, {
                status: 429
            });
        }
        const otp = generateOtp();
        const otpHash = hashValue(otp);
        const otpExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);
        user.ownerOtpCodeHash = otpHash;
        user.ownerOtpExpiresAt = otpExpiresAt;
        user.ownerOtpAttempts = 0;
        user.ownerOtpLastSentAt = now;
        await user.save();
        const resend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$resend$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getResend"])();
        const fromEmail = process.env.RESEND_FROM_EMAIL;
        if (!fromEmail) {
            throw new Error("Missing RESEND_FROM_EMAIL");
        }
        await resend.emails.send({
            from: fromEmail,
            to: [
                user.email
            ],
            subject: "Your Aanshi owner login OTP",
            html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>Owner Login Verification</h2>
          <p>Hello ${user.name},</p>
          <p>Your OTP for owner login is:</p>
          <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
          <p>This OTP expires in 5 minutes.</p>
          <p>If you did not try to log in, please reset your password immediately.</p>
        </div>
      `,
            text: `Your Aanshi owner login OTP is ${otp}. It expires in 5 minutes.`
        });
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "OTP sent to owner email",
            requiresOtp: true,
            email: user.email,
            role: user.role
        });
        response.cookies.set("ownerPending2FA", String(user._id), {
            httpOnly: true,
            sameSite: "lax",
            secure: ("TURBOPACK compile-time value", "development") === "production",
            path: "/",
            maxAge: 60 * 10
        });
        return response;
    } catch (error) {
        console.error("LOGIN FAILED:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Login failed",
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9da87632._.js.map