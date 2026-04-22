import { db } from "@/db";
import { visitors, user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VisitorsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user as unknown as { role: string }).role !== 'admin') {
    redirect("/");
  }

  // Filter out anonymous by using innerJoin instead of leftJoin
  const visitorLogs = await db
    .select({
      id: visitors.id,
      name: user.name,
      city: user.city,
      province: user.province,
      accessedAt: visitors.accessedAt,
    })
    .from(visitors)
    .innerJoin(user, eq(visitors.userId, user.id))
    .orderBy(desc(visitors.accessedAt))
    .limit(100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Daftar Pengunjung</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pengguna
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lokasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waktu Akses
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visitorLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {log.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{log.city || "-"}</div>
                  <div className="text-sm text-gray-500">{log.province || "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.accessedAt).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
            {visitorLogs.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                  Belum ada data pengunjung terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
