import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productCategory: { type: String, required: true },

    // new selected variant fields
    selectedSize: { type: String, default: "" },
    selectedPrice: { type: Number, default: 0 },
    selectedMrp: { type: Number, default: 0 },
    brand: { type: String, default: "" },

    // backward compatibility if any old code still sends it
    productSize: { type: String, default: "" },

    customerName: { type: String, required: true },
    phone: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered"],
      default: "Pending",
    },

    source: {
      type: String,
      default: "WhatsApp",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);