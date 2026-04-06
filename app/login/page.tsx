"use client";

import { login } from "@/lib/auth";
import { useMemo, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState("");
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // ⚠️ This still uses your old local auth helper.
      // If you later connect real API login, replace this block.
      const role = username === "owner" ? "owner" : "user";
      await login(role);

      if (role === "owner") {
        router.push("/owner");
      } else {
        router.push(redirectPath);
      }

      router.refresh();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          phone: signupPhone,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Signup failed");
      }

      alert("Signup successful! Please login now.");
      setIsSignup(false);

      // auto-fill login email
      setUsername(signupEmail);
      setPassword("");
    } catch (error: any) {
      console.error("Signup failed:", error);
      alert(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8faf8]">
      {/* Left Side */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Agriculture Field"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1a] via-[#1a2e1a]/40 to-transparent flex flex-col justify-end p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                <Leaf className="text-[#a8e6cf] w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">AANSHI</h1>
            </div>

            <p className="text-xl text-[#a8e6cf] font-medium tracking-wide uppercase">
              Fertilizers & Pesticides
            </p>

            <p className="text-gray-200 max-w-md leading-relaxed text-lg pt-4">
              Premium agricultural solutions for modern farmers, wholesalers, and partners.
            </p>

            <div className="flex items-center gap-3 pt-6 text-sm font-semibold text-[#a8e6cf]">
              <ShieldCheck size={20} />
              <span>GOVERNMENT APPROVED LICENSES</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-xl">
          {/* Mobile Branding */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <Leaf className="text-[#1a2e1a] w-12 h-12 mb-2" />
            <h2 className="text-2xl font-bold text-[#1a2e1a]">AANSHI</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">
              Fertilizers & Pesticides
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-2xl shadow p-1 flex w-full max-w-md">
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className={`w-1/2 py-3 rounded-xl font-semibold transition ${
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
                className={`w-1/2 py-3 rounded-xl font-semibold transition ${
                  isSignup
                    ? "bg-primary text-white shadow"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                New Sign Up
              </button>
            </div>
          </div>

          {/* 3D Flip Card */}
          <div className="[perspective:1400px]">
            <motion.div
              animate={{ rotateY: isSignup ? 180 : 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative min-h-[650px]"
            >
              {/* Login Side */}
              <div
                className="absolute inset-0 bg-white rounded-3xl shadow-2xl p-8 md:p-10 [backface-visibility:hidden]"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="space-y-2 mb-8">
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
                      <label className="text-sm font-semibold text-gray-700 ml-1">
                        Username / Email
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <User size={20} />
                        </div>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          placeholder="Enter your username or email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock size={20} />
                        </div>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between ml-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
                  >
                    {loading && !isSignup ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Enter Portal{" "}
                        <ArrowRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-8 border-t border-gray-100 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">
                    Need help? Contact support
                  </p>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#eaf6ea] flex items-center justify-center">
                      <Leaf size={16} className="text-primary" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#eaf6ea] flex items-center justify-center">
                      <ShieldCheck size={16} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Signup Side */}
              <div
                className="absolute inset-0 bg-white rounded-3xl shadow-2xl p-8 md:p-10 [backface-visibility:hidden]"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="space-y-2 mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Join Aanshi Family
                  </h2>
                  <p className="text-gray-500">
                    Create your account and unlock product inquiries, wholesale support, and faster ordering.
                  </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Phone size={20} />
                      </div>
                      <input
                        type="tel"
                        required
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="Create password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
                  >
                    {loading && isSignup ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account{" "}
                        <ArrowRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-8 border-t border-gray-100 mt-8">
                  <p className="text-sm text-gray-500 text-center">
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignup(false)}
                      className="text-primary font-semibold hover:underline"
                    >
                      Login now
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}