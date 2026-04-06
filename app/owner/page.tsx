"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, Loader2, Package, Search } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import toast from "react-hot-toast";

interface Product {
  _id: string; // ✅ Standardized
  name: string;
  category: string;
  size: string;
  price: string;
  usage: string;
  image: string;
}

const CATEGORIES = ["Fertilizers", "Pesticides", "Seeds", "Plant Growth", "Organic", "Fungicides"];

export default function OwnerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: CATEGORIES[0],
    size: "",
    price: "Contact for Pricing",
    description: "",
    usage: "",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsAdding(false);
        setFormData({
          name: "",
          category: CATEGORIES[0],
          size: "",
          price: "Contact for Pricing",
          description: "",
          usage: "",
          image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        });
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to add product", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setFormLoading(true);
    try {
      const res = await fetch(`/api/products/${editingProduct._id}`, { // ✅ Use _id
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to update product", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading("Uploading image...");
    setImageLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          image: data.secure_url,
        }));
        toast.dismiss();
        toast.success("Image uploaded ✅");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.dismiss();
      toast.error("Upload failed ❌");
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => { // ✅ string type
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const startEditing = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      size: product.size,
      price: product.price,
      description: (product as any).description || "",
      usage: product.usage,
      image: product.image,
    });
    setIsAdding(false);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8faf8] pt-10 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="text-primary" /> Owner Dashboard
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Manage your agricultural product catalog.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsAdding(true);
                setEditingProduct(null);
                setFormData({
                    name: "",
                    category: CATEGORIES[0],
                    size: "",
                    price: "Contact for Pricing",
                    description: "",
                    usage: "",
                    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
                });
              }}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              <Plus size={20} /> Add New Product
            </button>
            <button
              onClick={handleLogout}
              className="bg-white text-gray-600 border border-gray-200 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-10 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search your products..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Product List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 font-medium italic">Loading your products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={product._id} // ✅ Use _id
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/20">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-500"><span className="font-semibold">Size:</span> {product.size}</p>
                      <p className="text-sm text-gray-500 line-clamp-2"><span className="font-semibold">Usage:</span> {product.usage}</p>
                    </div>
                    <div className="mt-auto flex gap-3 pt-4 border-t border-gray-50">
                      <button
                        onClick={() => startEditing(product)}
                        className="flex-1 bg-accent text-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all"
                      >
                        <Pencil size={18} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)} // ✅ Use _id
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 italic text-xl">No products found. Start by adding one!</p>
          </div>
        )}
      </div>

      {/* Form Overlay */}
      <AnimatePresence>
        {(isAdding || editingProduct) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAdding(false); setEditingProduct(null); }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isAdding ? "Add New Product" : "Edit Product"}
                </h2>
                <button
                  onClick={() => { setIsAdding(false); setEditingProduct(null); }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={isAdding ? handleAddProduct : handleUpdateProduct} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Product Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="e.g. Premium Urea"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Category</label>
                    <select
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Available Sizes</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="e.g. 1kg, 5kg"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Price (Optional)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="e.g. 500 or Contact"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Product Image</label>
                    <div className="flex items-center gap-4">
                        <label className="flex-1 flex flex-col items-center justify-center px-4 py-2 bg-white text-primary rounded-xl border border-primary border-dashed cursor-pointer hover:bg-primary hover:text-white transition-all">
                            <span className="text-sm font-bold">{imageLoading ? "Uploading..." : "Upload Image"}</span>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={imageLoading}
                            />
                        </label>
                        {formData.image && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                                <Image src={formData.image} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                    </div>
                    <input
                      type="text"
                      className="w-full mt-2 px-4 py-2 text-xs rounded-xl border border-gray-100 bg-gray-50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Or paste Image URL"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Short Description</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    placeholder="Brief overview of the product..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Usage Guidelines</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    placeholder="How to apply this product..."
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => { setIsAdding(false); setEditingProduct(null); }}
                    className="flex-1 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all border border-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-70"
                  >
                    {formLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {isAdding ? "Save Product" : "Update Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
