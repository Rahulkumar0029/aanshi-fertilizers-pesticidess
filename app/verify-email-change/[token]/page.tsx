"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function VerifyEmailChangePage() {
  const params = useParams();
  const token = useMemo(
    () => (typeof params?.token === "string" ? params.token : ""),
    [params]
  );

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function verifyEmailChange() {
      if (!token) {
        if (!ignore) {
          setError("Invalid verification link.");
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch("/api/auth/verify-email-change", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(
            data?.error || "Unable to verify your new email right now."
          );
        }

        if (!ignore) {
          setSuccess(
            data?.message ||
              "Your email has been updated and verified successfully."
          );
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || "Failed to verify email change.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    verifyEmailChange();

    return () => {
      ignore = true;
    };
  }, [token]);

  return (
    <main className="min-h-screen bg-[#f8faf8] px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Verify New Email
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
            We’re verifying your updated email address.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm font-medium text-gray-700">
            Verifying your new email, please wait...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && success ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/profile"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Go to Profile
          </Link>

          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </main>
  );
}