import { db } from "@/db";
import { posts as postsTable } from "@/db/schema";
import { getYouTubeId } from "@/lib/youtube";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DeletePostButton } from "@/components/delete-post-button";
import { deletePost } from "@/app/actions/post";

const categories = [
  { name: "Materi Alquran dan Ilmu tajwid", slug: "materi-alquran-dan-ilmu-tajwid" },
  { name: "Surat Pendek", slug: "surat-pendek" },
  { name: "Doa doa harian", slug: "doa-doa-harian" },
  { name: "Surat Pilihan", slug: "surat-pilihan" },
  { name: "Hadis harian", slug: "hadis-harian" },
  { name: "Materi fiqih", slug: "materi-fiqih" },
  { name: "Aqidah akhlak", slug: "aqidah-akhlak" },
  { name: "Materi tarikh", slug: "materi-tarikh" },
];

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const posts = await db.select().from(postsTable).where(eq(postsTable.category, slug));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-primary hover:underline mb-2 block">
            &larr; Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        {(session?.user as unknown as { role: string } | undefined)?.role === 'admin' && (
          <Link 
            href="/tambah-postingan" 
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            + Tambah Postingan
          </Link>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => {
            const videoId = getYouTubeId(post.youtubeUrl);
            return (
              <div key={post.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-video w-full">
                  {videoId ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={post.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      Invalid Video URL
                    </div>
                  )}
                </div>
                <div className="p-4 flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  {(session?.user as unknown as { role: string } | undefined)?.role === 'admin' && (
                    <DeletePostButton postId={post.id} onDelete={deletePost} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-500">Belum ada postingan untuk kategori ini.</p>
        </div>
      )}
    </div>
  );
}
