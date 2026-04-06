import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, default: "customer" },
    },
    { timestamps: true }
);

export default mongoose.models.User ||
    mongoose.model("User", UserSchema);