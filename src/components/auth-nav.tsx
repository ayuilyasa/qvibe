"use client";

import { authClient } from "@/lib/auth-client";

export function AuthNav({ session }: { session: { user: { name: string, role: string } } | null }) {

    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error", error);
            window.location.href = "/login";
        }
    };

    if (session) {
        return (
            <div className="flex items-center gap-4">
                {session.user.role === 'admin' && (
                    <>
                        <a href="/pengunjung" className="text-sm font-medium text-primary hover:underline">Daftar Pengunjung</a>
                        <a href="/add-worksheet" className="text-sm font-medium text-primary hover:underline">Kelola Worksheet</a>
                        <a href="/register" className="text-sm font-medium text-primary hover:underline">Daftar Akun</a>
                    </>
                )}
                <span className="text-sm text-gray-600">Halo, {session.user.name}</span>
                <button 
                    onClick={handleSignOut}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                    Keluar
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-4">
            <a href="/login" className="text-sm font-medium hover:text-primary px-3 py-2">Masuk</a>
            <a href="/register" className="text-sm font-medium hover:text-primary px-3 py-2 border rounded-md border-primary text-primary">Daftar</a>
        </div>
    );
}
