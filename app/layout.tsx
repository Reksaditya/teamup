import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeamUp | Teman belajar dan tim lomba",
  description:
    "Temukan partner belajar dan rekan tim lomba berdasarkan bidang, jadwal, dan tujuanmu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.dataset.theme=localStorage.getItem('teamup-theme')==='dark'?'dark':'light'}catch{}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
