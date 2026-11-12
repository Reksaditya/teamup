import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container page">
      <div className="empty">
        <div className="eyebrow">TEAMUP / 404</div>
        <h1>Halaman ini belum ketemu.</h1>
        <p>Masih banyak ruang kolaborasi yang bisa kamu jelajahi.</p>
        <Link className="button primary" href="/">
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
