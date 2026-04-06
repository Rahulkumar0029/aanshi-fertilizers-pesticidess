import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        phone: { type: String, required: true },

        productId: { type: String, required: true },
        productName: { type: String, required: true },
        productCategory: { type: String, required: true },

        status: {
            type: String,
            enum: ["pending", "contacted", "done"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Inquiry ||
    mongoose.model("Inquiry", InquirySchema);