import type { Metadata } from "next";

import { AppFrame } from "@/components/layout/AppFrame";
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
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
