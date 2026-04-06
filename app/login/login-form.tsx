"use client";

import { useState, useMemo } from "react";
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

export default function LoginForm() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">AANSHI</h1>
            </div>
            <p className="text-green-100 text-sm font-medium">
              Quality Fertilizers & Pesticides
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8">
            {!isSignup ? (
              // LOGIN FORM
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignup(true)}
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      Sign up
                    </button>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center mb-3">
                    Demo credentials:
                  </p>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p>👤 User: username = "user", password = anything</p>
                    <p>👨‍💼 Owner: username = "owner", password = anything</p>
                  </div>
                </div>
              </motion.form>
            ) : (
              // SIGNUP FORM
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSignup}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Create password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignup(false)}
                      className="text-green-600 hover:text-green-700 font-semibold"
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
