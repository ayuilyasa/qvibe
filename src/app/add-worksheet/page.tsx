"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
    createWorksheetCategory, 
    updateWorksheetCategory, 
    deleteWorksheetCategory, 
    createWorksheets,
    getWorksheetCategories 
} from "@/app/actions/worksheet";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
}

interface WorksheetInput {
    title: string;
    driveUrl: string;
}

export default function ManageWorksheetPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [worksheetInputs, setWorksheetInputs] = useState<WorksheetInput[]>([{ title: "", driveUrl: "" }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isPending) {
            if (!session || (session.user as unknown as { role: string }).role !== 'admin') {
                setIsAdmin(false);
                router.push("/");
            } else {
                setIsAdmin(true);
                fetchCategories();
            }
        }
    }, [session, isPending, router]);

    const fetchCategories = async () => {
        const data = await getWorksheetCategories();
        setCategories(data);
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName) return;
        await createWorksheetCategory(newCategoryName);
        setNewCategoryName("");
        fetchCategories();
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !editingCategory.name) return;
        await updateWorksheetCategory(editingCategory.id, editingCategory.name);
        setEditingCategory(null);
        fetchCategories();
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm("Hapus kategori ini? Semua worksheet di dalamnya juga akan terhapus.")) {
            await deleteWorksheetCategory(id);
            fetchCategories();
        }
    };

    const addWorksheetInput = () => {
        setWorksheetInputs([...worksheetInputs, { title: "", driveUrl: "" }]);
    };

    const removeWorksheetInput = (index: number) => {
        if (worksheetInputs.length === 1) return;
        const newInputs = [...worksheetInputs];
        newInputs.splice(index, 1);
        setWorksheetInputs(newInputs);
    };

    const handleWorksheetInputChange = (index: number, field: keyof WorksheetInput, value: string) => {
        const newInputs = [...worksheetInputs];
        newInputs[index][field] = value;
        setWorksheetInputs(newInputs);
    };

    const handleUploadWorksheets = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryId || worksheetInputs.some(i => !i.title || !i.driveUrl)) {
            alert("Harap pilih kategori dan lengkapi semua judul & link.");
            return;
        }
        
        setIsSubmitting(true);
        try {
            await createWorksheets(selectedCategoryId, worksheetInputs);
            alert("Worksheet berhasil diunggah!");
            setWorksheetInputs([{ title: "", driveUrl: "" }]);
            router.push(`/worksheet/${selectedCategoryId}`);
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat mengunggah worksheet.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPending || isAdmin === null) return <div className="p-8 text-center text-gray-500">Memuat...</div>;
    if (isAdmin === false) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
             <div className="mb-8">
                <Link href="/worksheet" className="text-sm text-primary hover:underline mb-2 block">
                    &larr; Kembali ke Worksheet
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Kelola Worksheet</h1>
                <p className="text-gray-500 mt-2">Atur kategori dan unggah lembar kerja PDF.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Section */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-white p-6 border rounded-2xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Kategori</h2>
                        <form onSubmit={handleCreateCategory} className="flex gap-2 mb-6">
                            <input
                                type="text"
                                placeholder="Tambah kategori..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            />
                            <button type="submit" className="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                                +
                            </button>
                        </form>

                        <div className="space-y-2">
                            {categories.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-4">Belum ada kategori</p>
                            ) : (
                                categories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        {editingCategory?.id === cat.id ? (
                                            <form onSubmit={handleUpdateCategory} className="flex gap-2 w-full">
                                                <input
                                                    type="text"
                                                    value={editingCategory.name}
                                                    onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                    className="flex-1 px-2 py-1 border rounded text-sm outline-none focus:ring-1 focus:ring-primary"
                                                    autoFocus
                                                />
                                                <button type="submit" className="text-green-600 text-xs font-bold">✓</button>
                                                <button type="button" onClick={() => setEditingCategory(null)} className="text-gray-400 text-xs font-bold">✕</button>
                                            </form>
                                        ) : (
                                            <>
                                                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                                <div className="flex gap-3">
                                                    <button onClick={() => setEditingCategory({id: cat.id, name: cat.name})} className="text-gray-400 hover:text-primary transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.586.464z"/>
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* Worksheet Section */}
                <div className="lg:col-span-2">
                    <section className="bg-white p-6 border rounded-2xl shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Unggah Worksheet</h2>
                        <form onSubmit={handleUploadWorksheets} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Kategori</label>
                                <select
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none"
                                    required
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">Daftar Worksheet</label>
                                {worksheetInputs.map((input, index) => (
                                    <div key={index} className="relative p-5 border rounded-2xl bg-gray-50/50 space-y-4">
                                        {worksheetInputs.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeWorksheetInput(index)}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                                                </svg>
                                            </button>
                                        )}
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Judul Worksheet</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Belajar Mewarnai Hewan"
                                                value={input.title}
                                                onChange={(e) => handleWorksheetInputChange(index, "title", e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary bg-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Link Google Drive PDF</label>
                                            <input
                                                type="url"
                                                placeholder="https://drive.google.com/file/d/..."
                                                value={input.driveUrl}
                                                onChange={(e) => handleWorksheetInputChange(index, "driveUrl", e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary bg-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addWorksheetInput}
                                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                                >
                                    + Tambah Worksheet Lainnya
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${isSubmitting ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}
                            >
                                {isSubmitting ? 'Sedang Menyimpan...' : 'Simpan Semua Worksheet'}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
