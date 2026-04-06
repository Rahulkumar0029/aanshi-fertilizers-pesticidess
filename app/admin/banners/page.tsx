"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Banner = {
    _id: string;
    imageUrl: string;
    title?: string;
    link?: string;
};

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ imageUrl: "", title: "", link: "" });

    // ✅ FETCH
    const fetchBanners = async () => {
        const res = await fetch("/api/banners");
        const data = await res.json();
        setBanners(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    // ✅ UPLOAD
    const handleUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        toast.loading("Uploading...");
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/uploads", { method: "POST", body: formData });
        const data = await res.json();

        setForm({ ...form, imageUrl: data.secure_url });
        toast.dismiss();
        toast.success("Uploaded!");
    };

    // ✅ SUBMIT
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/banners", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            toast.success("Banner Added!");
            setForm({ imageUrl: "", title: "", link: "" });
            fetchBanners();
        }
        setLoading(false);
    };

    // ✅ DELETE
    const handleDelete = async (id: string) => {
        await fetch("/api/banners", {
            method: "DELETE",
            body: JSON.stringify({ id }),
        });
        toast.success("Deleted!");
        fetchBanners();
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Toaster />
            <h1 className="text-3xl font-bold mb-6">Manage Banners</h1>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-8 grid gap-4">
                <input
                    type="file"
                    onChange={handleUpload}
                    className="border p-2 rounded"
                />
                {form.imageUrl && <img src={form.imageUrl} className="h-20 w-auto rounded" />}
                
                <input
                    placeholder="Title (Optional)"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="border p-2 rounded"
                />
                <input
                    placeholder="Link (Optional)"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="border p-2 rounded"
                />
                
                <button
                    disabled={loading || !form.imageUrl}
                    className="bg-blue-600 text-white py-2 rounded font-bold"
                >
                    Add Banner
                </button>
            </form>

            {/* LIST */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((b) => (
                    <div key={b._id} className="bg-white p-4 rounded-xl shadow relative">
                        <img src={b.imageUrl} className="w-full h-40 object-cover rounded mb-2" />
                        <p className="font-bold">{b.title || "Untitled"}</p>
                        <button
                            onClick={() => handleDelete(b._id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
