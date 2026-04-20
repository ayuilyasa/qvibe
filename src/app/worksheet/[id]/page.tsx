import { getWorksheetsByCategory, getWorksheetCategoryById, deleteWorksheet } from "@/app/actions/worksheet";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DeleteWorksheetButton } from "@/components/delete-worksheet-button";

function getDriveFileInfo(url: string) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    const id = match[1];
    return {
        embedUrl: `https://drive.google.com/file/d/${id}/preview`,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${id}`,
    };
}

export default async function WorksheetListPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const category = await getWorksheetCategoryById(id);
    
    if (!category) {
        notFound();
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const isAdmin = session?.user && (session.user as any).role === 'admin';

    const worksheets = await getWorksheetsByCategory(id);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <Link href="/worksheet" className="text-sm text-primary hover:underline mb-4 inline-block">
                    &larr; Kembali ke Kategori
                </Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                        <p className="mt-2 text-gray-600">Daftar worksheet untuk kategori {category.name}.</p>
                    </div>
                    {isAdmin && (
                        <Link
                            href="/add-worksheet"
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            + Tambah Worksheet
                        </Link>
                    )}
                </div>
            </div>

            {worksheets.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <p className="text-gray-500">Belum ada worksheet di kategori ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-12">
                    {worksheets.map((worksheet) => {
                        const driveInfo = getDriveFileInfo(worksheet.driveUrl);
                        return (
                            <div key={worksheet.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {worksheet.title}
                                        </h3>
                                        {isAdmin && (
                                            <DeleteWorksheetButton 
                                                worksheetId={worksheet.id} 
                                                categoryId={id} 
                                                onDelete={deleteWorksheet} 
                                            />
                                        )}
                                    </div>
                                    {driveInfo && (
                                        <a
                                            href={driveInfo.downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                            </svg>
                                            Download PDF
                                        </a>
                                    )}
                                </div>
                                <div className="aspect-[16/9] w-full bg-gray-100">
                                    {driveInfo ? (
                                        <iframe
                                            src={driveInfo.embedUrl}
                                            className="w-full h-full border-none"
                                            allow="autoplay"
                                        ></iframe>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            Link Google Drive tidak valid
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
