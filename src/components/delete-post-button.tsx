"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeletePostButton({ postId, onDelete }: { postId: string, onDelete: (id: string) => Promise<void> }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Apakah Anda yakin ingin menghapus postingan ini?")) return;
        
        setLoading(true);
        try {
            await onDelete(postId);
            router.refresh();
        } catch {
            alert("Gagal menghapus postingan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors disabled:opacity-50"
            title="Hapus Postingan"
        >
            <Trash2 size={18} />
        </button>
    );
}
