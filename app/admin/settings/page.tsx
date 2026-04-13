"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Loader2, Save, Settings as SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type SiteSettings = {
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  contactAddress: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  contactPhone: "+91 70146 39562",
  contactWhatsApp: "917014639562",
  contactEmail: "aanshifarms@gmail.com",
  contactAddress: "30 Ps-A, Raisinghnagar, Sri Ganganagar, Rajasthan 335021",
};

export default function SettingsPage() {
  const router = useRouter();

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data && typeof data === "object") {
          setSettings((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setPageLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (
    key: keyof SiteSettings,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!settings.contactPhone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (!settings.contactWhatsApp.trim()) {
      toast.error("WhatsApp number is required");
      return;
    }

    if (!settings.contactEmail.trim()) {
      toast.error("Support email is required");
      return;
    }

    if (!settings.contactAddress.trim()) {
      toast.error("Office address is required");
      return;
    }

    setSaving(true);
    toast.loading("Saving settings...", { id: "settings-save" });

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          contactPhone: settings.contactPhone.trim(),
          contactWhatsApp: settings.contactWhatsApp.trim(),
          contactEmail: settings.contactEmail.trim(),
          contactAddress: settings.contactAddress.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save settings");
      }

      toast.success("Settings saved successfully", { id: "settings-save" });
    } catch (error: any) {
      toast.error(error?.message || "Failed to save settings", {
        id: "settings-save",
      });
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading settings...
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
              <SettingsIcon className="text-primary" />
              Site Settings
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              Manage business contact details used across the website.
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

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                placeholder="+91 70146 39562"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.contactWhatsApp}
                onChange={(e) => handleChange("contactWhatsApp", e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                placeholder="917014639562"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Support Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                placeholder="aanshifarms@gmail.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Office Address
              </label>
              <textarea
                value={settings.contactAddress}
                onChange={(e) => handleChange("contactAddress", e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-primary"
                rows={3}
                placeholder="30 Ps-A, Raisinghnagar, Sri Ganganagar, Rajasthan 335021"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />}
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}