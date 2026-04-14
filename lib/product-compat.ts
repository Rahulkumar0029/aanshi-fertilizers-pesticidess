export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type ProductVariant = {
  label: string;
  mrp?: number;
  price?: number;
  isDefault?: boolean;
  stock?: StockStatus;
};

export type LegacyProductShape = {
  size?: string;
  mrp?: number;
  price?: number;
};

export function getCompatibleVariants(
  product: { variants?: ProductVariant[] } & LegacyProductShape
): ProductVariant[] {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants;
  }

  if (
    product.size ||
    typeof product.mrp === "number" ||
    typeof product.price === "number"
  ) {
    return [
      {
        label: product.size || "Default",
        mrp: product.mrp || 0,
        price: product.price || 0,
        isDefault: true,
        stock: "in_stock",
      },
    ];
  }

  return [];
}

export function getDefaultCompatibleVariant(
  product: { variants?: ProductVariant[] } & LegacyProductShape
): ProductVariant | null {
  const variants = getCompatibleVariants(product);
  if (!variants.length) return null;

  return variants.find((variant) => variant.isDefault) || variants[0];
}