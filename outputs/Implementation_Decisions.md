# Keputusan implementasi TeamUp

Disetujui pengguna pada 13 November 2026. Catatan ini memperjelas PRD dan Design Requirement, tanpa menyatakan MVP produksi telah selesai.

- Nama tampilan: **TeamUp**, logo teks sementara dengan simbol sederhana.
- Seluruh halaman P1 dibuat sebagai **frontend interaktif dengan data demo**. Backend, OAuth, email, sesi aman, dan transaksi database belum diintegrasikan.
- Maksimal satu tim aktif per pengguna per lomba.
- Password contoh minimal 8 karakter; pesan maksimal 2.000 karakter; foto maksimal 2 MB.
- Kontak dummy: `halo@teamup.example`, ditandai tidak menerima pesan.
- Implementasi lokal pada stack Next.js, React, TypeScript yang tersedia. CSS token terpusat; Inter dan Plus Jakarta Sans WOFF2 disajikan lokal beserta lisensi OFL.
- Urutan hasil partner: nama A–Z. Tidak ada skor kecocokan atau klaim AI.
- Cooldown kirim ulang verifikasi 30 detik merupakan **asumsi demo**, bukan kebijakan produksi.
- Data disimpan di localStorage `teamup-demo-v1`. Pergantian persona, seed, dan reset disediakan agar kedua sisi alur dapat dicoba. Tidak menyimpan password.
- Tidak melakukan commit git atau publikasi.

## Penerimaan frontend

Seluruh modul P1 memiliki halaman yang bisa dijelajahi. Tindakan lokal mengikuti status partner, kapasitas tim, peran, keanggotaan, blokir, dan deadline. State memuat/kosong/gagal/ditolak dapat dicoba lewat kontrol simulasi pada halaman data. Pembatasan UI dan aturan domain lokal bukan pengamanan server.

Untuk produksi masih diperlukan autentikasi dan token nyata, otorisasi per objek di server, transaksi dan kontrol konkurensi, penyimpanan media, transport chat, moderasi operasional, analitik, kebijakan usia/retensi, backup, pengukuran performa, serta pengujian keamanan lintas akun. Keputusan usia, persetujuan dan retensi tetap terbuka.
