"use client";

import Link from "next/link";
import { createPost } from "@/app/actions/post";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const categories = [
  "Materi Alquran dan Ilmu tajwid",
  "Surat Pendek",
  "Doa doa harian",
  "Surat Pilihan",
  "Hadis harian",
  "Materi fiqih",
  "Aqidah akhlak",
  "Materi tarikh",
];

export default function AddPostPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isPending) {
      if (!session || (session.user as unknown as { role: string }).role !== 'admin') {
        setIsAdmin(false);
        router.push("/");
      } else {
        setIsAdmin(true);
      }
    }
  }, [session, isPending, router]);

  if (isPending || isAdmin === null) return <div className="p-8 text-center text-gray-500">Memuat...</div>;
  if (isAdmin === false) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-primary hover:underline mb-2 block">
          &larr; Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-bold">Tambah Postingan Baru</h1>
        <p className="text-gray-500 mt-2">Berbagi video edukasi Islami yang bermanfaat.</p>
      </div>

      <form action={createPost} className="space-y-6 bg-white p-8 border rounded-2xl shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Judul Video
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Contoh: Cara Membaca Idgham Bighunnah"
          />
        </div>

        <div>
          <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700">
            Link YouTube
          </label>
          <input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat.toLowerCase().replace(/\s+/g, "-")}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Unggah Video
          </button>
        </div>
      </form>
    </div>
  );
}
