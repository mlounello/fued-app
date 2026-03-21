import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Feud App",
  description: "Operator and live display tooling for Family Feud-style games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-[color:var(--border)] bg-black/5">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-xl font-bold tracking-wide">
                Feud
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/games/new">New Game</Link>
                <Link href="/admin">Admin</Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
