# Keputusan implementasi TeamUp

Pembaruan visual 1.1: pengguna menyetujui antislop during dan meminta warna tidak mencolok serta desain tidak generik. `../DESIGN.md` dan revisi 1.1 pada Design Requirement menjadi arah visual aktif. Perubahan hanya pada presentasi dan perbaikan aksesibilitas terkait; batas frontend demo tetap berlaku.

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

### Revisi visual 1.2

Arahan terbaru pengguna: label demo/contoh dan kontrol pengujian dihilangkan dari UI, light mode default dan switch tema navbar, serta landing terpusat dengan underline lengkung pada “lebih jauh”. Kontak dummy dihapus dari halaman bantuan agar tidak menjadi tautan layanan palsu. Data, akun, chat, dan aturan domain tetap berjalan lokal; penghapusan label bukan integrasi produksi. Google kini menampilkan status belum terhubung, tanpa masuk otomatis sebagai Alya. Pengujian lintas persona menggunakan login email seed `nama@teamup.test` lalu logout, bukan bilah persona. Penyimpanan lama dimigrasikan untuk menghapus suffix label seed tanpa menghapus perubahan pengguna. Pilihan tema disimpan terpisah pada `teamup-theme`.

Seluruh modul P1 memiliki halaman yang bisa dijelajahi. Tindakan lokal mengikuti status partner, kapasitas tim, peran, keanggotaan, blokir, dan deadline. State memuat/kosong/gagal/ditolak dipertahankan, tetapi pemilih state pengujian dihapus dari UI pada revisi 1.2. Pembatasan UI dan aturan domain lokal bukan pengamanan server.

Untuk produksi masih diperlukan autentikasi dan token nyata, otorisasi per objek di server, transaksi dan kontrol konkurensi, penyimpanan media, transport chat, moderasi operasional, analitik, kebijakan usia/retensi, backup, pengukuran performa, serta pengujian keamanan lintas akun. Keputusan usia, persetujuan dan retensi tetap terbuka.
