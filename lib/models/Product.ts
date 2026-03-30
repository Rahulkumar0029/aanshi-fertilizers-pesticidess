import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, default: "Contact for Pricing" },
    image: { type: String },
    description: { type: String },
    usage: { type: String },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);