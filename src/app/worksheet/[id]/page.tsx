import { 
    getWorksheetsByCategory, 
    getWorksheetCategoryById, 
    deleteWorksheet,
    getWorksheetsCountByCategory
} from "@/app/actions/worksheet";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DeleteWorksheetButton } from "@/components/delete-worksheet-button";
import { WorksheetCard } from "@/components/worksheet-card";
import { Search } from "lucide-react";

function getDriveFileInfo(url: string) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    const id = match[1];
    return {
        embedUrl: `https://drive.google.com/file/d/${id}/preview`,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${id}`,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
    };
}

export default async function WorksheetListPage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ q?: string, page?: string }>
}) {
    const { id } = await params;
    const { q, page } = await searchParams;
    
    const category = await getWorksheetCategoryById(id);
    
    if (!category) {
        notFound();
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const isAdmin = !!(session?.user && (session.user as unknown as { role: string }).role === 'admin');

    const currentPage = parseInt(page || "1", 10);
    const searchQuery = q || "";
    const limit = 30;

    const [worksheets, totalCount] = await Promise.all([
        getWorksheetsByCategory(id, searchQuery, currentPage, limit),
        getWorksheetsCountByCategory(id, searchQuery)
    ]);

    const hasNextPage = totalCount > currentPage * limit;
    const hasPrevPage = currentPage > 1;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/worksheet" className="text-sm text-primary hover:underline mb-2 block">
                        &larr; Kembali ke Kategori
                    </Link>
                    <h1 className="text-3xl font-bold">{category.name}</h1>
                </div>
                {isAdmin && (
                    <Link
                        href="/add-worksheet"
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 text-sm font-medium whitespace-nowrap self-start md:self-auto"
                    >
                        + Tambah Worksheet
                    </Link>
                )}
            </div>

            <form action="" method="GET" className="mb-12">
                <div className="relative max-w-2xl">
                    <input 
                        type="text" 
                        name="q" 
                        defaultValue={searchQuery}
                        placeholder="Cari judul worksheet..."
                        className="w-full px-5 py-3 pr-12 border rounded-2xl outline-none focus:ring-1 focus:ring-primary shadow-sm"
                    />
                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                        <Search size={20} />
                    </button>
                </div>
                {searchQuery && (
                    <p className="mt-3 text-sm text-gray-500">
                        Menampilkan hasil pencarian untuk: <span className="font-semibold">&quot;{searchQuery}&quot;</span>
                        <Link href={`/worksheet/${id}`} className="ml-2 text-primary hover:underline">Hapus pencarian</Link>
                    </p>
                )}
            </form>

            {worksheets.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
                    <p className="text-gray-500">
                        {searchQuery ? "Tidak ditemukan worksheet yang sesuai dengan pencarian." : "Belum ada worksheet di kategori ini."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {worksheets.map((worksheet) => {
                            const driveInfo = getDriveFileInfo(worksheet.driveUrl);
                            if (!driveInfo) return null;

                            return (
                                <WorksheetCard
                                    key={worksheet.id}
                                    title={worksheet.title}
                                    embedUrl={driveInfo.embedUrl}
                                    thumbnailUrl={driveInfo.thumbnailUrl}
                                    downloadUrl={driveInfo.downloadUrl}
                                    isAdmin={isAdmin}
                                    deleteButton={
                                        <DeleteWorksheetButton 
                                            worksheetId={worksheet.id} 
                                            categoryId={id} 
                                            onDelete={deleteWorksheet} 
                                        />
                                    }
                                />
                            );
                        })}
                    </div>

                    {(hasNextPage || hasPrevPage) && (
                        <div className="mt-16 flex justify-center items-center gap-6">
                            {hasPrevPage ? (
                                <Link 
                                    href={`/worksheet/${id}?q=${searchQuery}&page=${currentPage - 1}`}
                                    className="px-6 py-2 border rounded-full hover:bg-gray-50 transition-all font-medium text-sm text-gray-600 shadow-sm"
                                >
                                    &larr; Sebelumnya
                                </Link>
                            ) : (
                                <span className="px-6 py-2 border rounded-full opacity-30 text-sm font-medium cursor-not-allowed">
                                    &larr; Sebelumnya
                                </span>
                            )}
                            
                            <span className="text-sm font-bold text-gray-500 bg-gray-100 px-4 py-1 rounded-full">
                                Halaman {currentPage}
                            </span>

                            {hasNextPage ? (
                                <Link 
                                    href={`/worksheet/${id}?q=${searchQuery}&page=${currentPage + 1}`}
                                    className="px-6 py-2 border rounded-full hover:bg-gray-50 transition-all font-medium text-sm text-gray-600 shadow-sm"
                                >
                                    Selanjutnya &rarr;
                                </Link>
                            ) : (
                                <span className="px-6 py-2 border rounded-full opacity-30 text-sm font-medium cursor-not-allowed">
                                    Selanjutnya &rarr;
                                </span>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
