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

    address: {
      addressLine1: {
        type: String,
        default: "",
        trim: true,
      },
      addressLine2: {
        type: String,
        default: "",
        trim: true,
      },
      villageOrCity: {
        type: String,
        default: "",
        trim: true,
      },
      district: {
        type: String,
        default: "",
        trim: true,
      },
      state: {
        type: String,
        default: "",
        trim: true,
      },
      pincode: {
        type: String,
        default: "",
        trim: true,
      },
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

    signupCompleted: {
      type: Boolean,
      default: false,
    },

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

    pendingEmail: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
    emailChangeToken: {
      type: String,
      default: null,
    },
    emailChangeExpires: {
      type: Date,
      default: null,
    },

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

    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },

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