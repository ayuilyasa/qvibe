"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteWorksheetButton({ 
    worksheetId, 
    categoryId, 
    onDelete 
}: { 
    worksheetId: string, 
    categoryId: string, 
    onDelete: (id: string, categoryId: string) => Promise<void> 
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Apakah Anda yakin ingin menghapus worksheet ini?")) return;
        
        setLoading(true);
        try {
            await onDelete(worksheetId, categoryId);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus worksheet");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
            title="Hapus Worksheet"
        >
            <Trash2 size={18} />
        </button>
    );
}
