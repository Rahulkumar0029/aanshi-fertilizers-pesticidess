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
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

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
                <p className="mt-1 text-base font-semibold text-gray-900">
                  {user.name}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </p>
                    <p className="mt-1 text-base font-semibold text-gray-900">
                      {user.email || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone
                    </p>
                    <p className="mt-1 text-base font-semibold text-gray-900">
                      {user.phone || "Not available"}
                    </p>
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
                We are currently using email-first verification for a smoother and more reliable customer experience. Phone verification will be added later.
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