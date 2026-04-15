"use client";

import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  brands: string[];
  sizes: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  selectedSize: string;
  setSelectedSize: (value: string) => void;
  availability: string;
  setAvailability: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
};

export default function ProductFiltersSidebar({
  isOpen,
  onClose,
  categories,
  brands,
  sizes,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedSize,
  setSelectedSize,
  availability,
  setAvailability,
  sort,
  setSort,
  clearFilters,
  applyFilters,
}: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-primary"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-primary"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Size
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-primary"
            >
              <option value="">All Sizes</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Availability
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-primary"
            >
              <option value="">All</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-primary"
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="border-t bg-white px-5 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={applyFilters}
              className="flex-1 rounded-xl bg-primary py-3 font-semibold text-white transition hover:opacity-90"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}