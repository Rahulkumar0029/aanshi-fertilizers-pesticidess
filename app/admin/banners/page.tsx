"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Banner = {
  _id: string;
  imageUrl: string;
  title?: string;
  link?: string;
  createdAt?: string;
};

type BannerForm = {
  imageUrl: string;
  title: string;
  link: string;
};

const EMPTY_FORM: BannerForm = {
  imageUrl: "",
  title: "",
  link: "",
};

export default function BannersPage() {
  const router = useRouter();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json().catch(() => []);
      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
      setBanners([]);
      toast.error("Failed to load banners");
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchBanners();
      setPageLoading(false);
    };

    init();
  }, []);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading("Uploading banner image...", { id: "banner-upload" });
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.secure_url) {
        throw new Error(data?.details || data?.error || "Upload failed");
      }

      setForm((prev) => ({
        ...prev,
        imageUrl: data.secure_url,
      }));

      toast.success("Banner image uploaded", { id: "banner-upload" });
    } catch (error: any) {
      toast.error(error?.message || "Upload failed", { id: "banner-upload" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.imageUrl.trim()) {
      toast.error("Banner image is required");
      return;
    }

    setSaving(true);
    toast.loading("Saving banner...", { id: "banner-save" });

    try {
      const payload = {
        imageUrl: form.imageUrl.trim(),
        title: form.title.trim(),
        link: form.link.trim(),
      };

      const res = await fetch("/api/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save banner");
      }

      toast.success("Banner added successfully", { id: "banner-save" });
      setForm(EMPTY_FORM);
      await fetchBanners();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save banner", {
        id: "banner-save",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;

    setDeleteId(id);
    toast.loading("Deleting banner...", { id: "banner-delete" });

    try {
      const res = await fetch("/api/banners", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Delete failed");
      }

      toast.success("Banner deleted", { id: "banner-delete" });
      await fetchBanners();
    } catch (error: any) {
      toast.error(error?.message || "Delete failed", {
        id: "banner-delete",
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading banners...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      <Toaster position="top-right" />

      <div className="container-app">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              <ImageIcon className="text-primary" />
              Manage Banners
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              Add and remove homepage banners safely.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to Admin
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-4 text-lg font-semibold text-gray-900">
              Add Banner
            </div>

            <div className="space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-primary/40 bg-white px-4 py-4 text-center text-primary hover:bg-primary hover:text-white">
                <span className="inline-flex items-center gap-2 font-semibold">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload size={16} />}
                  {uploading ? "Uploading..." : "Upload Banner Image"}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {form.imageUrl && (
                <div className="relative h-40 overflow-hidden rounded-xl border">
                  <Image
                    src={form.imageUrl}
                    alt="Banner preview"
                    fill
                    sizes="420px"
                    className="object-cover"
                  />
                </div>
              )}

              <input
                type="text"
                placeholder="Banner Title (optional)"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
              />

              <input
                type="text"
                placeholder="Banner Link (optional)"
                value={form.link}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, link: e.target.value }))
                }
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
              />

              <button
                type="submit"
                disabled={saving || uploading || !form.imageUrl}
                className="w-full rounded-xl bg-primary py-3 font-bold text-white hover:opacity-90 disabled:opacity-70"
              >
                {saving ? "Saving..." : "Add Banner"}
              </button>
            </div>
          </form>

          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 text-lg font-semibold text-gray-900">
              All Banners ({banners.length})
            </div>

            {banners.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                No banners found.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {banners.map((banner) => (
                  <div
                    key={banner._id}
                    className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                  >
                    <div className="relative h-44">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title || "Banner"}
                        fill
                        sizes="400px"
                        className="object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <p className="font-semibold text-gray-900">
                        {banner.title?.trim() || "Untitled Banner"}
                      </p>

                      <p className="mt-1 break-all text-xs text-gray-500">
                        {banner.link?.trim() || "No link attached"}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleDelete(banner._id)}
                        disabled={deleteId === banner._id}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-70"
                      >
                        {deleteId === banner._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}