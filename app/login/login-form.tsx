"use client";

import { useMemo, useState } from "react";
import {
  Leaf,
  Lock,
  User,
  ArrowRight,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectPath = useMemo(() => {
    return searchParams.get("redirect") || "/";
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  function normalizeIndianPhone(phone: string) {
    const digits = phone.replace(/\D/g, "");

    if (digits.length === 12 && digits.startsWith("91")) {
      return digits.slice(2);
    }

    return digits;
  }

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidIndianPhone(phone: string) {
    return /^[6-9]\d{9}$/.test(phone);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setLoginError("");
    setLoginSuccess("");

    const normalizedIdentifier = identifier.trim();

    if (!normalizedIdentifier || !password.trim()) {
      setLoginError("Please enter your email/phone and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: normalizedIdentifier,
          password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (data?.requiresEmailVerification) {
          setShowResendVerification(true);
        }
        throw new Error(data?.error || "Login failed");
      }

      setLoginSuccess(data?.message || "Login successful.");

      const role = data?.user?.role;

      if (role === "owner") {
        router.push("/owner");
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push(redirectPath);
      }

      router.refresh();
    } catch (error: any) {
      setLoginError(error?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setSignupError("");
    setSignupSuccess("");
    setShowResendVerification(false);

    const normalizedEmail = signupEmail.trim().toLowerCase();
    const normalizedPhone = normalizeIndianPhone(signupPhone);
    const trimmedName = signupName.trim();
    const trimmedPassword = signupPassword.trim();

    if (!trimmedName || !normalizedEmail || !normalizedPhone || !trimmedPassword) {
      setSignupError("All fields are required.");
      setLoading(false);
      return;
    }

    if (trimmedName.length < 2) {
      setSignupError("Please enter a valid full name.");
      setLoading(false);
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setSignupError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!isValidIndianPhone(normalizedPhone)) {
      setSignupError("Please enter a valid 10-digit Indian mobile number.");
      setLoading(false);
      return;
    }

    if (trimmedPassword.length < 8) {
      setSignupError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: normalizedEmail,
          phone: normalizedPhone,
          password: trimmedPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Signup failed");
      }

      setSignupSuccess(
        data?.message ||
          "Account created successfully. Please verify your email to continue."
      );

      setShowResendVerification(true);
      setIsSignup(false);

      setIdentifier(normalizedEmail);
      setPassword("");

      setSignupName("");
      setSignupEmail(normalizedEmail);
      setSignupPhone("");
      setSignupPassword("");
    } catch (error: any) {
      setSignupError(error?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const emailToUse = signupEmail.trim().toLowerCase() || identifier.trim().toLowerCase();

    if (!emailToUse) {
      setSignupError("Please enter your email first.");
      return;
    }

    setResendLoading(true);
    setLoginError("");
    setSignupError("");
    setSignupSuccess("");
    setLoginSuccess("");

    try {
      const res = await fetch("/api/auth/resend-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailToUse,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to resend verification email");
      }

      if (isSignup) {
        setSignupSuccess(
          data?.message || "A new verification email has been sent successfully."
        );
      } else {
        setLoginSuccess(
          data?.message || "A new verification email has been sent successfully."
        );
      }
    } catch (error: any) {
      if (isSignup) {
        setSignupError(error?.message || "Failed to resend verification email");
      } else {
        setLoginError(error?.message || "Failed to resend verification email");
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Leaf className="h-8 w-8 text-white" />
              <h1 className="text-3xl font-bold text-white">AANSHI</h1>
            </div>
            <p className="text-sm font-medium text-green-100">
              Quality Fertilizers &amp; Pesticides
            </p>
          </div>

          <div className="p-8">
            {!isSignup ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div className="mb-1 flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  Browse freely. Login is only needed for account-based actions.
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email or Phone
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter email or phone number"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 py-3 pl-10 pr-4 transition-colors focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 py-3 pl-10 pr-4 transition-colors focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {loginError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {loginError}
                  </div>
                ) : null}

                {loginSuccess ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {loginSuccess}
                  </div>
                ) : null}

                {showResendVerification ? (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="w-full rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {resendLoading
                      ? "Sending verification email..."
                      : "Resend Verification Email"}
                  </button>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 py-3 font-bold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </button>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(true);
                      setLoginError("");
                      setLoginSuccess("");
                    }}
                    className="font-semibold text-green-600 hover:text-green-700"
                  >
                    Create account
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="font-semibold text-gray-600 hover:text-gray-800"
                  >
                    Forgot password?
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSignup}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 py-3 pl-10 pr-4 transition-colors focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 py-3 pl-10 pr-4 transition-colors focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 py-3 pl-10 pr-4 transition-colors focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="password"
                      placeholder="Create password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 py-3 pl-10 pr-4 transition-colors focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {signupError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {signupError}
                  </div>
                ) : null}

                {signupSuccess ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {signupSuccess}
                  </div>
                ) : null}

                {showResendVerification ? (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="w-full rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {resendLoading
                      ? "Sending verification email..."
                      : "Resend Verification Email"}
                  </button>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 py-3 font-bold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create Account"}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignup(false);
                        setSignupError("");
                        setSignupSuccess("");
                      }}
                      className="font-semibold text-green-600 hover:text-green-700"
                    >
                      Login
                    </button>
                  </p>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}