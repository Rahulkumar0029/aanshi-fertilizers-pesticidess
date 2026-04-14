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
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
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

    // Account activation state
    signupCompleted: {
      type: Boolean,
      default: false,
    },

    // Email verification
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    // Phone verification
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    pendingPhone: {
      type: String,
      default: null,
      trim: true,
    },
    phoneOtpCodeHash: {
      type: String,
      default: null,
    },
    phoneOtpExpiresAt: {
      type: Date,
      default: null,
    },
    phoneOtpAttempts: {
      type: Number,
      default: 0,
    },
    phoneOtpLastSentAt: {
      type: Date,
      default: null,
    },

    // Login OTP for normal users
    loginOtpCodeHash: {
      type: String,
      default: null,
    },
    loginOtpExpiresAt: {
      type: Date,
      default: null,
    },
    loginOtpChannel: {
      type: String,
      enum: ["email", "phone", null],
      default: null,
    },

    // Password reset
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
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