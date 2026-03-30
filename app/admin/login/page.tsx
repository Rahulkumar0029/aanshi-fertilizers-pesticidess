"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = () => {
        if (password === "admin123") {
            localStorage.setItem("admin", "true");
            router.push("/admin");
        } else {
            alert("Wrong password");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl mb-4">Admin Login</h2>
                <input
                    type="password"
                    placeholder="Enter password"
                    className="border p-2 w-full mb-3"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="bg-black text-white px-4 py-2 w-full"
                >
                    Login
                </button>
            </div>
        </div>
    );
}