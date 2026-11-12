import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeamUp — Temukan partner. Tumbuh bersama.",
  description:
    "Partner belajar dan tim lomba. Prototipe interaktif dengan data demo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
