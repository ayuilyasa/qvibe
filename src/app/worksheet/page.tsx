import { getWorksheetCategories } from "@/app/actions/worksheet";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function WorksheetPage() {
    const categories = await getWorksheetCategories();
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const isAdmin = !!(session?.user && (session.user as unknown as { role: string }).role === 'admin');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Worksheet Categories</h1>
                    <p className="mt-2 text-gray-600">Pilih kategori worksheet untuk melihat daftar materi.</p>
                </div>
                {isAdmin && (
                    <Link
                        href="/add-worksheet"
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Kelola Worksheet
                    </Link>
                )}
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
                    <p className="text-gray-500">Belum ada kategori worksheet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/worksheet/${category.id}`}
                            className="group bg-white border rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                                {category.name}
                            </h3>
                            <div className="mt-4 flex items-center text-sm font-medium text-primary">
                                Lihat Worksheet &rarr;
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
