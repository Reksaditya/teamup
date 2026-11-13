"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container page">
      <div className="empty">
        <h1>Halaman belum bisa dimuat.</h1>
        <p>
          Data yang sudah tersimpan di browser tetap tersedia. Coba muat
          ulang halaman ini.
        </p>
        <div className="actions">
          <button className="button primary" onClick={reset}>
            Coba lagi
          </button>
          <Link className="button secondary" href="/">
            Ke beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
