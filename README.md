# TeamUp

Pembaruan visual 1.2 mengikuti `DESIGN.md`: light mode default putih/navy, switch tema navbar, hero terpusat dengan underline lengkung, serta panel partner/tim interaktif. Pemeriksaan pasangan warna kedua tema dapat diulang dengan `node work/check-design.mjs` dan menghasilkan `outputs/light-dark-contrast.json`.

Frontend interaktif berbahasa Indonesia untuk partner belajar dan tim lomba. Dibangun dengan Next.js 16, React 19, TypeScript, serta CSS token terpusat berdasarkan AGENTS.md, PRD, dan Design Requirement pada folder outputs. Seluruh profil, lomba, dan percakapan adalah contoh.

## Menjalankan

Memerlukan Node.js 22.6+ (pengujian menggunakan Node.js 24) dan npm.

- npm install — jika dependency belum tersedia.
- npm run dev — buka http://localhost:3000 atau http://127.0.0.1:3000.
- npm run build — build produksi.
- npm start — menjalankan hasil build.
- npm run lint — ESLint.
- npm test — 14 pengujian aturan domain dengan Node test runner.

## Menjelajahi demo

Alya memiliki permintaan masuk dari Citra, partner Bima, dan memimpin Beyond the Bytes dengan satu lamaran masuk dari Rafi. Bima memimpin Pixel Pioneers. Citra memimpin Insight Collective. Pengguna Baru belum terverifikasi dan profilnya belum lengkap. Admin TeamUp dapat mengelola lomba, pengguna, laporan, dan catatan tindakan. Bilah persona dan label demo/contoh dihapus dari UI atas permintaan pengguna pada revisi 1.2.

Untuk pengujian login email gunakan email seed, misalnya alya@teamup.test atau admin@teamup.test, serta teks password uji minimal delapan karakter. Password tidak disimpan atau diverifikasi sebagai kredensial nyata. Registrasi membuat akun lokal. Google menampilkan pesan belum terhubung. Verifikasi dan reset belum terintegrasi layanan email. Jangan menggunakan password atau data pribadi asli.

### Berpindah akun

1. Klik tombol **Keluar** di kanan atas. Pada mobile, buka menu **☰**, lalu pilih **Keluar dari akun**. Pada dialog **yakin ingin keluar dari akun?**, pilih **Ya** (merah) untuk keluar, atau **Tidak** (ghost) untuk tetap masuk. Escape atau tombol tutup juga membatalkan logout.
2. Klik **Masuk**, lalu isi email akun yang ingin digunakan dari tabel berikut.
3. Isi password dengan teks uji apa pun minimal **8 karakter**, misalnya `teamup123`, lalu klik **Masuk ke TeamUp**. Ini hanya berlaku untuk frontend lokal; password belum diverifikasi melalui backend.

| Akun | Email |
| --- | --- |
| Alya | `alya@teamup.test` |
| Bima | `bima@teamup.test` |
| Citra | `citra@teamup.test` |
| Dimas | `dimas@teamup.test` |
| Nadia | `nadia@teamup.test` |
| Rafi | `rafi@teamup.test` |
| Pengguna Baru (belum terverifikasi) | `baru@teamup.test` |
| Admin | `admin@teamup.test` |

### Alur pengujian

Coba dua alur berikut dengan logout dan login ke akun seed penerima setelah mengirim permintaan atau lamaran:

1. Daftar → verifikasi simulasi → onboarding → cari partner → ajak belajar → penerima menerima di Aktivitas → chat personal.
2. Lomba → cari/buat tim → ajukan lamaran → ketua menerima di Aktivitas → ringkasan anggota → chat grup.

Kontrol simulasi data dan putus koneksi dihapus dari UI pada revisi 1.2. Komponen state dan retry tetap tersedia di source. Blokir dan laporan tersedia di profil serta pesan; laporan pesan menyertakan bukti terpilih.

Perubahan tersimpan di localStorage dengan kunci teamup-demo-v1. Penghapusan penyimpanan situs melalui browser mengembalikan seed. Perubahan pada tab lain di origin yang sama disinkronkan melalui storage event. Pilihan tema disimpan pada teamup-theme. localhost dan 127.0.0.1 memiliki penyimpanan terpisah.

## Halaman P1

| Area | Rute |
| --- | --- |
| Beranda | / |
| Akun | /masuk, /daftar, /verifikasi, /reset-password |
| Profil | /onboarding, /profil, /partner/[id] |
| Partner | /partner |
| Lomba | /lomba, /lomba/[id] |
| Tim | /tim, /tim/buat, /tim/[id], /tim/[id]/edit |
| Aktivitas | /aktivitas |
| Pesan | /pesan, /pesan/personal:alya:bima, /pesan/team:byte |
| Keamanan dan bantuan | /diblokir, /bantuan, /privasi |
| Admin | /admin/lomba, /admin/pengguna, /admin/laporan, /admin/catatan |

## Struktur

- app/teamup.tsx — shell, navigasi, dialog, dispatch halaman.
- app/discovery.tsx — landing, kartu partner/lomba/tim.
- app/pages.tsx — pencarian, detail, formulir tim, state data.
- app/workspace.tsx — aktivitas, chat, profil, akun, admin, bantuan.
- app/controls.tsx — foto lokal, jadwal berulang, editor peran/slot.
- app/store.ts — external store React, persistensi, sinkronisasi tab.
- app/ui.tsx dan app/globals.css — komponen bersama, ikon SVG, token, responsive.
- lib/demo.ts — tipe, seed, aturan partner/tim/chat/blokir.
- lib/demo.test.mjs — batas akses, retry, deadline, kapasitas, dan keanggotaan.
- public/fonts — Inter dan Plus Jakarta Sans WOFF2, sumber dan lisensi OFL.
- outputs — dokumen acuan, keputusan, hasil verifikasi, screenshot.

## Batas implementasi

Ini adalah prototipe frontend, bukan MVP produksi. Semua data demo tersedia pada klien; menyembunyikan UI bukan otorisasi server. Jam perangkat dipakai untuk simulasi deadline. Tidak ada database, layanan email, OAuth, token aman, pengiriman pesan nyata, transaksi lintas pengguna, atau integrasi situs lomba. Tautan lomba memakai example.com dan kontak halo@teamup.example tidak menerima pesan.

Sebelum rilis nyata dibutuhkan backend dan otorisasi objek, transaksi kapasitas tim, autentikasi/token, layanan media/chat/email, analitik, backup, pengukuran performa, serta keputusan usia, retensi, dan penghapusan. Lihat outputs/Implementation_Decisions.md. Tidak ada commit git atau deployment yang dilakukan.
