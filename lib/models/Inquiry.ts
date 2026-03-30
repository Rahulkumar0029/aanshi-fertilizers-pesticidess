import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        productId: { type: String },
        productName: { type: String, required: true },
        productCategory: { type: String, required: true },
        status: {
            type: String,
            default: "pending",
        },
        timestamp: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Inquiry ||
    mongoose.model("Inquiry", InquirySchema);