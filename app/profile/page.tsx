"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
  PencilLine,
  Save,
  X,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ProfileUser = {
  _id: string;
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  signupCompleted: boolean;
  pendingEmail?: string | null;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    villageOrCity?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [villageOrCity, setVillageOrCity] = useState("");
  const [district, setDistrict] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [pincode, setPincode] = useState("");

  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setPageError("");

      const res = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Unauthorized");
      }

      setUser(data);
      setNameInput(data?.name || "");
      setEmailInput(data?.email || "");
      setPhoneInput(data?.phone || "");
      setAddressLine1(data?.address?.addressLine1 || "");
      setAddressLine2(data?.address?.addressLine2 || "");
      setVillageOrCity(data?.address?.villageOrCity || "");
      setDistrict(data?.address?.district || "");
      setStateInput(data?.address?.state || "");
      setPincode(data?.address?.pincode || "");
    } catch (error: any) {
      setPageError(error?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setStatusError("");
      setStatusMessage("");

      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameInput.trim(),
          email: emailInput.trim().toLowerCase(),
          phone: phoneInput.trim(),
          address: {
            addressLine1,
            addressLine2,
            villageOrCity,
            district,
            state: stateInput,
            pincode,
          },
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update profile");
      }

      setStatusMessage(data?.message || "Profile updated successfully.");
      setIsEditing(false);
      await fetchProfile();
    } catch (error: any) {
      setStatusError(error?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setStatusError("");
    setStatusMessage("");

    if (user) {
      setNameInput(user.name || "");
      setEmailInput(user.email || "");
      setPhoneInput(user.phone || "");
      setAddressLine1(user.address?.addressLine1 || "");
      setAddressLine2(user.address?.addressLine2 || "");
      setVillageOrCity(user.address?.villageOrCity || "");
      setDistrict(user.address?.district || "");
      setStateInput(user.address?.state || "");
      setPincode(user.address?.pincode || "");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8faf8] px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-600">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (pageError || !user) {
    return (
      <main className="min-h-screen bg-[#f8faf8] px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium text-red-700">
              {pageError || "Unable to load profile."}
            </p>

            <button
              onClick={() => router.push("/login")}
              className="mt-4 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white"
              type="button"
            >
              Go to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf8] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-green-700 to-green-600 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-green-100">
                My Profile
              </p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                Hello, {user.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-green-50 sm:text-base">
                Manage your account details, verification status, and security actions from one place.
              </p>
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setStatusError("");
                  setStatusMessage("");
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <PencilLine className="h-4 w-4" />
                Edit Details
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {statusError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
            {statusError}
          </div>
        ) : null}

        {statusMessage ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-medium text-green-700">
            {statusMessage}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">
                Personal Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Full Name
                </p>

                {isEditing ? (
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="mt-1 text-base font-semibold text-gray-900">
                    {user.name}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div className="w-full">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </p>

                    {isEditing ? (
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="mt-1 text-base font-semibold text-gray-900">
                        {user.email || "Not available"}
                      </p>
                    )}

                    {user.pendingEmail ? (
                      <p className="mt-2 text-sm font-medium text-amber-700">
                        Pending new email: {user.pendingEmail} (verification required)
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div className="w-full">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone
                    </p>

                    {isEditing ? (
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="mt-1 text-base font-semibold text-gray-900">
                        {user.phone || "Not available"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div className="w-full">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Address
                    </p>

                    {isEditing ? (
                      <div className="mt-2 grid gap-3">
                        <input
                          type="text"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="Address line 1"
                        />
                        <input
                          type="text"
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="Address line 2 (optional)"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            value={villageOrCity}
                            onChange={(e) => setVillageOrCity(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Village / City"
                          />
                          <input
                            type="text"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="District"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            value={stateInput}
                            onChange={(e) => setStateInput(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="State"
                          />
                          <input
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Pincode"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 space-y-1 text-base font-semibold text-gray-900">
                        <p>{user.address?.addressLine1 || "Not added"}</p>
                        {user.address?.addressLine2 ? (
                          <p>{user.address.addressLine2}</p>
                        ) : null}
                        <p>
                          {[user.address?.villageOrCity, user.address?.district]
                            .filter(Boolean)
                            .join(", ") || "Location not added"}
                        </p>
                        <p>
                          {[user.address?.state, user.address?.pincode]
                            .filter(Boolean)
                            .join(" - ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Account Type
                </p>
                <p className="mt-1 text-base font-semibold capitalize text-gray-900">
                  {user.role}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">
                Verification Status
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Email Verification
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Your email is used for login, password reset, and account security.
                  </p>
                </div>

                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    Not Verified
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Phone Verification
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Phone verification is temporarily unavailable. Your saved number is still visible in your account.
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                  <AlertCircle className="h-4 w-4" />
                  Coming Later
                </span>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                We are currently using email-first verification for a smoother and more reliable customer experience. If you change your email, verification will be required before it becomes active.
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Security & Actions
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              Change Password
            </button>

            <button
              type="button"
              onClick={() => router.push("/my-orders")}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              View My Activity
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}