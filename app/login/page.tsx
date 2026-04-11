"use client";

import { Suspense, useMemo, useState } from "react";
import {
  Leaf,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [ownerOtpStep, setOwnerOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [ownerEmailHint, setOwnerEmailHint] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectPath = useMemo(() => {
    return searchParams.get("redirect") || "/";
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const loginData = await loginRes.json().catch(() => null);

      if (!loginRes.ok) {
        throw new Error(loginData?.error || "Login failed");
      }

      if (loginData?.requiresOtp) {
        setOwnerOtpStep(true);
        setOwnerEmailHint(loginData?.email || email.trim());
        return;
      }

      const role = loginData?.user?.role;

      if (role === "owner") {
        router.push(redirectPath === "/" ? "/owner" : redirectPath);
      } else {
        router.push(redirectPath);
      }

      router.refresh();
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-owner-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          otp: otp.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "OTP verification failed");
      }

      router.push(redirectPath === "/" ? "/owner" : redirectPath);
      router.refresh();
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      alert(error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/resend-owner-otp", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to resend OTP");
      }

      alert(data?.message || "A new OTP has been sent");
    } catch (error: any) {
      console.error("Resend OTP failed:", error);
      alert(error.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupName.trim(),
          email: signupEmail.trim(),
          phone: signupPhone.trim(),
          password: signupPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Signup failed");
      }

      alert("Signup successful! Please login now.");
      setIsSignup(false);
      setEmail(signupEmail.trim());
      setPassword("");
    } catch (error: any) {
      console.error("Signup failed:", error);
      alert(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8] md:flex-row">
      <div className="relative hidden overflow-hidden md:flex md:w-1/2">
        <Image
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Agriculture Field"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#1a2e1a] via-[#1a2e1a]/40 to-transparent p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2 backdrop-blur-md">
                <Leaf className="h-8 w-8 text-[#a8e6cf]" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">AANSHI</h1>
            </div>

            <p className="text-xl font-medium uppercase tracking-wide text-[#a8e6cf]">
              Fertilizers & Pesticides
            </p>

            <p className="max-w-md pt-4 text-lg leading-relaxed text-gray-200">
              Premium agricultural solutions for modern farmers, wholesalers,
              and partners.
            </p>

            <div className="flex items-center gap-3 pt-6 text-sm font-semibold text-[#a8e6cf]">
              <ShieldCheck size={20} />
              <span>GOVERNMENT APPROVED LICENSES</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex flex-col items-center md:hidden">
            <Leaf className="mb-2 h-12 w-12 text-[#1a2e1a]" />
            <h2 className="text-2xl font-bold text-[#1a2e1a]">AANSHI</h2>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Fertilizers & Pesticides
            </p>
          </div>

          {!ownerOtpStep && (
            <div className="mb-8 flex items-center justify-center">
              <div className="flex w-full max-w-md rounded-2xl bg-white p-1 shadow">
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className={`w-1/2 rounded-xl py-3 font-semibold transition ${
                    !isSignup
                      ? "bg-primary text-white shadow"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Already a Customer
                </button>

                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className={`w-1/2 rounded-xl py-3 font-semibold transition ${
                    isSignup
                      ? "bg-primary text-white shadow"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  New Sign Up
                </button>
              </div>
            </div>
          )}

          {ownerOtpStep ? (
            <div className="rounded-3xl bg-white p-8 shadow-2xl md:p-10">
              <div className="mb-8 space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Owner Verification
                </h2>
                <p className="text-gray-500">
                  We sent a 6-digit OTP to {ownerEmailHint || "your email"}.
                  Enter it below to complete owner login.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-semibold text-gray-700">
                    OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-sm font-semibold text-primary hover:underline disabled:opacity-70"
                  >
                    Resend OTP
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOwnerOtpStep(false);
                      setOtp("");
                    }}
                    className="text-sm font-semibold text-gray-600 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="[perspective:1400px]">
              <motion.div
                animate={{ rotateY: isSignup ? 180 : 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative min-h-[650px]"
              >
                <div
                  className="absolute inset-0 rounded-3xl bg-white p-8 shadow-2xl md:p-10 [backface-visibility:hidden]"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="mb-8 space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Welcome Back
                    </h2>
                    <p className="text-gray-500">
                      Login to continue your agricultural journey with Aanshi.
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-semibold text-gray-700">
                          Email
                        </label>
                        <div className="group relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Mail size={20} />
                          </div>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-semibold text-gray-700">
                          Password
                        </label>
                        <div className="group relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Lock size={20} />
                          </div>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="ml-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="remember"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                        />
                        <label
                          htmlFor="remember"
                          className="cursor-pointer text-sm text-gray-600"
                        >
                          Remember me
                        </label>
                      </div>

                      <Link
                        href="/forgot-password"
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading && !isSignup ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <>
                          Enter Portal
                          <ArrowRight
                            size={20}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
                    <p className="text-sm text-gray-500">
                      Need help? Contact support
                    </p>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf6ea]">
                        <Leaf size={16} className="text-primary" />
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf6ea]">
                        <ShieldCheck size={16} className="text-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute inset-0 rounded-3xl bg-white p-8 shadow-2xl md:p-10 [backface-visibility:hidden]"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="mb-8 space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Join Aanshi Family
                    </h2>
                    <p className="text-gray-500">
                      Create your account and unlock product inquiries, wholesale
                      support, and faster ordering.
                    </p>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-5">
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-gray-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          <User size={20} />
                        </div>
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="block w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-gray-700">
                        Email
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          <Mail size={20} />
                        </div>
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="block w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-gray-700">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          <Phone size={20} />
                        </div>
                        <input
                          type="tel"
                          required
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          className="block w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          <Lock size={20} />
                        </div>
                        <input
                          type="password"
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="block w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="Create password"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading && isSignup ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <>
                          Create Account
                          <ArrowRight
                            size={20}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 border-t border-gray-100 pt-8">
                    <p className="text-center text-sm text-gray-500">
                      Already registered?{" "}
                      <button
                        type="button"
                        onClick={() => setIsSignup(false)}
                        className="font-semibold text-primary hover:underline"
                      >
                        Login now
                      </button>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8faf8]" />}>
      <LoginContent />
    </Suspense>
  );
}