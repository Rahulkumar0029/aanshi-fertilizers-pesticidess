import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },

    mrp: { type: Number },      // ✅ NEW
    price: { type: Number },    // ✅ UPDATED

    image: { type: String },
    description: { type: String },
    usage: { type: String },
   size: {
  type: String,
  trim: true,
  lowercase: true,
  default: "",
},
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);