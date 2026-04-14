import mongoose, { Schema, models, model, type Model } from "mongoose";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type ProductVariantDoc = {
  label: string;
  mrp: number;
  price: number;
  isDefault: boolean;
  stock: StockStatus;
};

export type ProductDoc = {
  name: string;
  brand: string;
  category: string;
  image: string;
  description: string;
  usage: string;
  variants: ProductVariantDoc[];
  isFeatured: boolean;
  isActive: boolean;
};

const ProductVariantSchema = new Schema<ProductVariantDoc>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock"],
      default: "in_stock",
    },
  },
  { _id: false }
);

const ProductSchema = new Schema<ProductDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    usage: {
      type: String,
      trim: true,
      default: "",
    },
    variants: {
      type: [ProductVariantSchema],
      required: true,
      validate: {
        validator(value: ProductVariantDoc[]) {
          if (!Array.isArray(value) || value.length === 0) {
            return false;
          }

          const defaultCount = value.filter((variant) => variant.isDefault).length;

          return defaultCount <= 1;
        },
        message:
          "At least one product variant is required and only one default variant is allowed",
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product: Model<ProductDoc> =
  (models.Product as Model<ProductDoc>) ||
  model<ProductDoc>("Product", ProductSchema);

export default Product;