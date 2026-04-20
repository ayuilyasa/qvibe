"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Reconstruct the dummy email generated during registration
    const dummyEmail = `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@qvibe.local`;

    const { error } = await authClient.signIn.email({
      email: dummyEmail,
      password,
    });

    if (error) {
      setError(error.message || "Gagal masuk. Periksa kembali username dan kata sandi Anda.");
    } else {
      window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border rounded-2xl shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Masuk ke Q-Vibe</h2>
          <p className="mt-2 text-sm text-gray-600">
            Atau{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              daftar akun baru
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Username anda"
              />
            </div>
            <div>
              <label htmlFor="password" title="password" className="block text-sm font-medium text-gray-700">
                Kata Sandi
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
