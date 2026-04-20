"use server";

import { db } from "@/db";
import { worksheetCategories, worksheets } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, like, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as unknown as { role: string }).role !== 'admin') {
        throw new Error("Unauthorized: Only admins can perform this action");
    }
    return session;
}

export async function createWorksheetCategory(name: string) {
    await checkAdmin();
    await db.insert(worksheetCategories).values({
        id: crypto.randomUUID(),
        name,
    });
    revalidatePath("/worksheet");
}

export async function updateWorksheetCategory(id: string, name: string) {
    await checkAdmin();
    await db.update(worksheetCategories)
        .set({ name })
        .where(eq(worksheetCategories.id, id));
    revalidatePath("/worksheet");
    revalidatePath(`/worksheet/${id}`);
}

export async function deleteWorksheetCategory(id: string) {
    await checkAdmin();
    await db.delete(worksheetCategories).where(eq(worksheetCategories.id, id));
    revalidatePath("/worksheet");
}

export async function createWorksheets(categoryId: string, data: { title: string, driveUrl: string }[]) {
    await checkAdmin();
    if (data.length === 0) return;
    
    await db.insert(worksheets).values(
        data.map(item => ({
            id: crypto.randomUUID(),
            categoryId,
            title: item.title,
            driveUrl: item.driveUrl,
        }))
    );
    revalidatePath(`/worksheet/${categoryId}`);
}

export async function deleteWorksheet(id: string, categoryId: string) {
    await checkAdmin();
    await db.delete(worksheets).where(eq(worksheets.id, id));
    revalidatePath(`/worksheet/${categoryId}`);
}

export async function getWorksheetCategories() {
    return await db.query.worksheetCategories.findMany({
        orderBy: (categories, { desc }) => [desc(categories.createdAt)],
    });
}

export async function getWorksheetsByCategory(
    categoryId: string, 
    searchQuery?: string, 
    page: number = 1, 
    limit: number = 30
) {
    const offset = (page - 1) * limit;
    
    return await db.query.worksheets.findMany({
        where: (worksheets, { eq, and, like }) => {
            const conditions = [eq(worksheets.categoryId, categoryId)];
            if (searchQuery) {
                conditions.push(like(worksheets.title, `%${searchQuery}%`));
            }
            return and(...conditions);
        },
        orderBy: (worksheets, { desc }) => [desc(worksheets.createdAt)],
        limit,
        offset,
    });
}

export async function getWorksheetsCountByCategory(categoryId: string, searchQuery?: string) {
    const result = await db.select({ count: sql<number>`count(*)` })
        .from(worksheets)
        .where(and(
            eq(worksheets.categoryId, categoryId),
            searchQuery ? like(worksheets.title, `%${searchQuery}%`) : undefined
        ));
    return result[0].count;
}

export async function getWorksheetCategoryById(id: string) {
    return await db.query.worksheetCategories.findFirst({
        where: (categories, { eq }) => eq(categories.id, id),
    });
}
