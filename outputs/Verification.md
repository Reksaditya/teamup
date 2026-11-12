# Verifikasi frontend TeamUp

Tanggal: 13 November 2026. Lingkup: frontend dengan data demo, bukan integrasi produksi.

## Pemeriksaan otomatis

- npm run lint: lulus tanpa error atau warning ESLint.
- npx tsc --noEmit: lulus.
- npm test: 14 pengujian lulus, 0 gagal. Node mengeluarkan peringatan nonfatal tentang pendeteksian modul TypeScript; hasil pengujian tetap lulus.
- npm run build: lulus. Next.js menghasilkan rute beranda, halaman dinamis, fallback, dan ikon SVG.
- git diff --check: lulus. Tidak ada commit atau staging.

Pengujian domain mencakup permintaan ganda/berlawanan arah, kewenangan penerima/pengirim, slot terakhir, satu tim aktif per lomba, deadline berubah saat form terbuka, blokir, akses setelah keluar/bubar/ditangguhkan, deduplikasi retry, verifikasi/profil, slot peran, dan irisan jadwal berbeda zona termasuk perubahan hari. Semua ini menguji aturan lokal dalam memori.

## Pemeriksaan browser yang dilakukan

- Beranda serta navigasi desktop, tablet, dan mobile.
- Alur Alya menerima Citra, membuka chat, dan mengirim pesan.
- Beralih ke Citra, melihat percakapan, simulasi koneksi putus, pesan gagal, sambung kembali, kirim ulang menjadi Terkirim (demo).
- Ketua Alya menerima Rafi; ringkasan tim menunjukkan 3/4 anggota; Rafi mendapat akses chat grup Beyond the Bytes.
- Kombinasi filter UI/UX Design, Mahir, Bandung menghasilkan Nadia saja.
- State gagal menampilkan penjelasan serta tombol Coba lagi.
- Admin membuat draf lomba, mengajukan tinjauan, menyetujui dengan alasan, dan melihat tiga catatan audit.
- Dialog native membatasi fokus; konfirmasi destruktif memfokuskan Batal. Navigasi mobile membuka dialog dengan menu yang relevan.
- Pemeriksaan lebar 360 (chat), 768 (beranda), dan 1440 (beranda) menunjukkan scrollWidth sama dengan clientWidth. Pada pemeriksaan tambahan 320, ada selisih pembulatan 1 CSS piksel pada beranda; ini belum menjadi audit reflow menyeluruh.
- Screenshot desktop dan mobile disimpan di folder outputs. Data uji browser dikembalikan ke seed awal sebelum penyerahan.

## Batas verifikasi

Belum dilakukan audit WCAG menyeluruh, zoom 200% pada semua halaman, pengujian seluruh browser/perangkat, pengukuran LCP/latensi/uptime, atau pengujian OAuth/email/token/server/database/backup. Foto dan semua formulir belum diuji untuk setiap variasi input. UI memakai validasi native dan aturan domain lokal; otorisasi server dan transaksi serentak nyata belum ada.

Tidak ada klaim siap produksi atau kepatuhan hukum.
