"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function createPost(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as unknown as { role: string }).role !== 'admin') {
        throw new Error("Unauthorized: Only admins can create posts");
    }

    const title = formData.get("title") as string;
    const youtubeUrl = formData.get("youtubeUrl") as string;
    const category = formData.get("category") as string;

    await db.insert(posts).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        title,
        youtubeUrl,
        category,
    });

    redirect(`/kategori/${category}`);
}

export async function deletePost(postId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as unknown as { role: string }).role !== 'admin') {
        throw new Error("Unauthorized: Only admins can delete posts");
    }

    // Admins can delete any post
    const post = await db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, postId),
    });

    if (!post) {
        throw new Error("Post not found");
    }

    await db.delete(posts).where(eq(posts.id, postId));
}
