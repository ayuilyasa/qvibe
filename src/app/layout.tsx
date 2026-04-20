import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AuthNav } from "@/components/auth-nav";
import { logVisitor } from "@/lib/visitor-logger";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Q-Vibe - Edukasi Islami",
  description: "Platform berbagi video edukasi Islami",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Log visitor access
  await logVisitor();

  return (
    <html lang="id">
      <body className={inter.className}>
        <nav className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0 flex flex-col">
                  <Link href="/" className="text-2xl font-bold text-primary leading-tight">Q-Vibe</Link>
                  <span className="text-[10px] text-gray-500 font-medium leading-tight">Quranic-Video, Interaktif, Belajar, Efektif</span>
                </div>
              </div>
              <AuthNav session={session} />
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
