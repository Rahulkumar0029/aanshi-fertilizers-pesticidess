"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>({
        contactPhone: "+91 70146 39562",
        contactWhatsApp: "917014639562",
        contactEmail: "info@aanshifertilizers.com",
        contactAddress: "Rajasthan, India",
    });
    const [loading, setLoading] = useState(false);

    // ✅ FETCH
    useEffect(() => {
        const fetchSettings = async () => {
            const res = await fetch("/api/settings");
            const data = await res.json();
            if (Object.keys(data).length > 0) {
                setSettings((prev: any) => ({ ...prev, ...data }));
            }
        };
        fetchSettings();
    }, []);

    // ✅ UPDATE
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings),
        });

        if (res.ok) {
            toast.success("Settings Saved!");
        }
        setLoading(false);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Toaster />
            <h1 className="text-3xl font-bold mb-6">Site Settings</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-2xl grid gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                        value={settings.contactPhone}
                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number (e.g. 919876543210)</label>
                    <input
                        value={settings.contactWhatsApp}
                        onChange={(e) => setSettings({ ...settings, contactWhatsApp: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Support Email</label>
                    <input
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Office Address</label>
                    <textarea
                        value={settings.contactAddress}
                        onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                        className="w-full border p-2 rounded"
                        rows={2}
                    />
                </div>

                <button
                    disabled={loading}
                    className="bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                    {loading ? "Saving..." : "Save Settings"}
                </button>
            </form>
        </div>
    );
}
