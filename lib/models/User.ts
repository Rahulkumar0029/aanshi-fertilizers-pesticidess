import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "owner"],
      default: "user",
    },

    // Owner OTP 2FA
    ownerOtpCodeHash: {
      type: String,
      default: null,
    },
    ownerOtpExpiresAt: {
      type: Date,
      default: null,
    },
    ownerOtpAttempts: {
      type: Number,
      default: 0,
    },
    ownerOtpLastSentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);