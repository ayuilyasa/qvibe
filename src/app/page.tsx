import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { LayoutPanelLeft } from "lucide-react";

const categories = [
  { name: "Materi Alquran dan Ilmu tajwid", slug: "materi-alquran-dan-ilmu-tajwid", icon: "📖" },
  { name: "Surat Pendek", slug: "surat-pendek", icon: "📜" },
  { name: "Doa doa harian", slug: "doa-doa-harian", icon: "🙏" },
  { name: "Surat Pilihan", slug: "surat-pilihan", icon: "✨" },
  { name: "Hadis harian", slug: "hadis-harian", icon: "🤝" },
  { name: "Materi fiqih", slug: "materi-fiqih", icon: "🕌" },
  { name: "Aqidah akhlak", slug: "aqidah-akhlak", icon: "🤲" },
  { name: "Materi tarikh", slug: "materi-tarikh", icon: "⏳" },
];

const backgroundImages = [
  "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop", // Quran
  "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop", // Islamic Art
  "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=800&auto=format&fit=crop", // Islamic Pattern
  "https://images.unsplash.com/photo-1767555712347-2089d178685a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1676928117296-66bc2882ec6a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1642575688958-24ee4c5aba9b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582033130049-90d7592583b4?q=80&w=800&auto=format&fit=crop"
];

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <LandingPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 space-y-6">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black">
          Q-VIBE
        </h1>

        <p className="max-w-4xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
          Platform edukasi terintegrasi yang menyajikan video pembelajaran agama, dongeng anak,
          dan berbagai worksheet interaktif siap cetak untuk mendukung belajar mandiri yang
          efektif, kreatif, inovatif dan menyenangkan.
        </p>

        <div className="pt-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Edukasi Islam Terpercaya
          </h2>
          <p className="mt-4 text-lg text-gray-500 italic">
            Pilih kategori untuk mulai belajar dari video dan worksheet pilihan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        <Link
          href="/worksheet"
          className="group relative overflow-hidden rounded-2xl h-64 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-primary/20"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${backgroundImages[0]})` }}
          />
          <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors" />
          <div className="relative h-full p-8 flex flex-col justify-end text-white">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-2xl font-bold drop-shadow-md">
              Worksheet
            </h3>
            <p className="mt-2 text-sm text-gray-100 line-clamp-2 drop-shadow-md font-medium">
              Download materi belajar dan lembar kerja PDF
            </p>
          </div>
        </Link>

        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/kategori/${category.slug}`}
            className="group relative overflow-hidden rounded-2xl h-64 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${backgroundImages[(index + 1) % backgroundImages.length]})` }}
            />
            <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors" />
            <div className="relative h-full p-8 flex flex-col justify-end text-white">
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-2xl font-bold drop-shadow-md">
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-gray-100 line-clamp-2 drop-shadow-md font-medium">
                Lihat koleksi video {category.name.toLowerCase()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#5c67f2] via-[#7d5cf2] to-[#22c55e] text-[#1a1a1a] p-4 relative overflow-hidden">
      {/* Network Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute -top-20 -left-20 text-white/40">
          <LayoutPanelLeft size={400} strokeWidth={0.5} />
        </div>
      </div>

      {/* Circle/Blob in the background */}
      <div className="absolute top-[10%] left-[10%] w-[40%] h-[60%] bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="z-10 text-center max-w-5xl mx-auto space-y-12">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 tracking-tight animate-fade-in-up opacity-0">
          Selamat Datang di Aplikasi
        </h2>

        <h1 className="text-8xl md:text-[12rem] font-black leading-none tracking-tighter mb-4 text-black flex justify-center">
          {"Q- VIBE".split("").map((char, i) => (
            <span
              key={i}
              className={`inline-block animate-jump ${char === " " ? "w-[0.3em]" : ""}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {char}
            </span>
          ))}
        </h1>

        <div className="animate-fade-in-up opacity-0 [animation-delay:400ms] mt-8">
          <p className="text-xl md:text-4xl font-bold text-gray-800 italic">
            "Tumbuh Cerdas dengan Ilmu, Dongeng, dan Worksheet Kreatif"
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16 animate-fade-in-up opacity-0 [animation-delay:600ms]">
          <Link
            href="/login"
            className="px-12 py-5 bg-primary text-white font-black rounded-2xl text-2xl hover:bg-primary/90 transition-all shadow-[0_10px_0_0_rgba(0,0,0,0.1)] hover:translate-y-1 hover:shadow-none"
          >
            Masuk (Login)
          </Link>
          <Link
            href="/register"
            className="px-12 py-5 bg-white text-primary font-black rounded-2xl text-2xl hover:bg-gray-50 transition-all shadow-[0_10px_0_0_rgba(0,0,0,0.1)] hover:translate-y-1 hover:shadow-none border-2 border-primary/10"
          >
            Daftar (Register)
          </Link>
        </div>
      </div>
    </div>
  );
}
