"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // If user is already logged in and NOT an admin, they shouldn't be here
    // But since this page is also used by admin to register users, we check the role
    if (!isPending && session && (session.user as { role?: string }).role !== 'admin') {
      router.push("/");
    }
  }, [session, isPending, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      setError("Kata sandi minimal harus 8 karakter");
      return;
    }

    setLoading(true);
    setError("");

    // Generate dummy email from username
    const dummyEmail = `${username.toLowerCase().replace(/[^a-z0-9]/g, "")}@qvibe.local`;

    const { error } = await authClient.signUp.email({
      email: dummyEmail,
      password,
      name: username,
      // @ts-ignore - city and province are added as additional fields
      city,
      province,
    });

    if (error) {
      setError(error.message || "Gagal mendaftar");
    } else {
      alert("Pendaftaran berhasil!");
      if (!session) {
        router.push("/login");
      } else {
        setUsername("");
        setPassword("");
        setCity("");
        setProvince("");
      }
    }
    setLoading(false);
  };

  if (isPending) return <div className="p-8 text-center text-gray-500">Memuat...</div>;
  
  // Only allow access if not logged in, or if logged in as admin
  if (session && (session.user as { role?: string }).role !== 'admin') return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border rounded-2xl shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Daftar Akun Baru</h2>
          <p className="mt-2 text-sm text-gray-600">
            Lengkapi data diri anda untuk bergabung.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
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
                placeholder="Pilih username"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Kota
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Nama kota"
                />
              </div>
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                  Provinsi
                </label>
                <input
                  id="province"
                  name="province"
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Provinsi"
                />
              </div>
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
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm pr-10"
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
