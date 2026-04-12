import Link from "next/link";

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

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Edukasi Islami Terpercaya
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Pilih kategori untuk mulai belajar dari video pilihan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/kategori/${category.slug}`}
            className="group relative bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">
              {category.name}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Lihat koleksi video {category.name.toLowerCase()}
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-primary group-hover:underline">
              Jelajahi Sekarang &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
