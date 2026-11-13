# TeamUp visual 1.2: Delivery Gate

Status: PASS untuk perubahan landing, tema, dan copy antarmuka dalam tugas ini. Antislop during, pilihan sesi pengguna. Ini bukan penerimaan MVP produksi.

Pemetaan: design requirement revisi 1.2 serta bagian 4–8 (token, komponen, layout, interaksi). Perubahan presentasi menyentuh halaman AUTH-01–05, PROF-01–04, PART-01–04, COMP-01–04, TEAM-01–06, CHAT-01–04, dan MOD-01–05 tanpa mengubah aturan domain/server PRD.

## Bukti dan lingkup

- `npm run lint`, `npm run build`, `npx tsc --noEmit`: lulus. Build final juga menjalankan pemeriksaan TypeScript.
- `npm test`: 14 lulus, 0 gagal. Peringatan deteksi tipe modul Node bersifat nonfatal.
- `node work/check-design.mjs`: 76 pasangan token light/dark memenuhi target teks 4.5:1 dan kontrol/fokus 3:1. Angka pada [light-dark-contrast.json](light-dark-contrast.json).
- [light-dark-browser-checks.json](light-dark-browser-checks.json): 118 rekaman, termasuk 18 variasi halaman member/publik dan 4 halaman admin pada 1440/360 dalam kedua tema. Pemeriksaan teks hasil render pada seluruh variasi tersebut tidak menemukan kegagalan kontras.
- Landing juga diperiksa pada 768 dan 320. Overflow navbar 4 px ditemukan pada pengujian awal 320, lalu diperbaiki dengan gap header yang lebih kecil. Dua rekaman `guest landing 320 corrected` menunjukkan scrollWidth = clientWidth = 305 dalam kedua tema; viewport luar 320 dengan scrollbar browser.
- Riwayat mentah tetap menyimpan temuan awal. Kata “demo” yang terdeteksi pada admin/catatan berasal dari alasan audit yang sudah tersimpan pada pengujian sebelumnya, bukan label UI. Isi laporan, pesan, dan audit milik pengguna tidak dihapus atau ditulis ulang. Copy statis dan suffix seed sudah dibersihkan.
- Seluruh 21 tautan konten landing, 3 tautan tab tim, dan 6 tautan navbar admin diklik satu per satu; URL hasil tercatat. Kontrol bersama yang tidak berubah perilakunya mengacu bukti pengujian sebelumnya pada [Redesign_Delivery_Gate.md](Redesign_Delivery_Gate.md); pemeriksaan ini tidak mengklaim mengulang seluruh kombinasi mutasi aplikasi.
- Google membuka dialog belum terhubung dan Kembali menutupnya; form daftar kosong menunjukkan validasi; tampilkan password bekerja; login lokal Alya/admin dan logout bekerja; reset menampilkan pengiriman email belum tersedia.
- Switch bekerja melalui klik, Space, Enter dan mempertahankan pilihan setelah reload. ArrowRight/Home mengoperasikan tab preview. Menu mobile dibuka, ditutup Escape dengan fokus kembali, dan tautan Bantuan menuju halaman yang benar. Skip link memfokuskan main-content. Focus ring yang diamati tercatat dalam log.
- Pemeriksaan console akhir: tidak ada error/warning browser.
- Gambar: [desktop light](teamup-light-desktop.jpg), [mobile light](teamup-light-mobile.jpg), [halaman lengkap](teamup-light-full.jpg), [desktop dark](teamup-dark-desktop.jpg).

## Hard Gate

- R-02 PASS: pencarian source TSX tidak menemukan em dash dalam copy UI.
- R-03 PASS: pemeriksaan 1440/768/360 dan pemeriksaan ulang 320 tidak menunjukkan overflow akhir; kontrol baru memiliki target minimal 44 px.
- R-17 PASS: tidak menambah statistik pemasaran; angka kapasitas, jumlah hasil, dan deadline berasal dari state lokal yang telah disetujui.
- R-18 PASS: tidak ada testimoni, foto buatan, atau klaim pelanggan baru.
- R-23 PASS: logo teks dan avatar inisial dipertahankan sesuai persetujuan; underline SVG dibuat atas permintaan eksplisit pengguna.
- R-24 PASS: 21 tautan landing, 3 tautan preview tim dan 6 navbar mencapai rute tersedia, tercatat per elemen.
- R-25 PASS: 76 pasangan token dan teks hasil render pada 22 variasi halaman di kedua tema memenuhi ambang yang diperiksa.
- R-26 PASS: switch, tab, tautan, dialog, form validasi, login/logout, dan menu menunjukkan hasil nyata pada log; Google memberi status belum tersedia tanpa login palsu.
- R-27 PASS: loading shell, empty result/preview, StateView error/denied dan error boundary tetap tersedia dalam source; penghapusan pemilih simulasi tidak menghapus komponennya. Pengujian aktivasi state lama tercatat pada gate 1.1.
- R-28 PASS: bantuan menjelaskan profil, akses chat, pesan gagal, dan laporan TeamUp; tidak menambah FAQ pemasaran generik.
- R-32 PASS: switch native bekerja dengan Space/Enter; tab memiliki roving tabIndex dan tombol panah/Home/End; Escape, pemulihan fokus dan skip link diperiksa.
- R-33 PASS: perubahan ditulis langsung melalui apply_patch. Skrip kontras hanya membaca CSS dan menulis hasil analisis; Prettier hanya memformat.
- R-34 PASS: light/dark menggunakan token lengkap, color-scheme kontrol mengikuti tema, layout dan kontras diuji pada keduanya.
- R-35 PASS: build dijalankan, klik elemen landing dan kontrol baru dicatat, console akhir kosong; batas pengulangan kontrol lama dinyatakan di bagian bukti.
- R-36 PASS: tidak menambah klaim keamanan, kepatuhan, performa atau integrasi yang belum tersedia.
- R-37 PASS: arah referensi, putih/navy, hero terpusat dan dials dinyatakan sebelum implementasi dan dicatat pada DESIGN.md.
- R-38 PASS dengan override langsung pengguna: seed lokal yang sebelumnya disetujui dipertahankan, label demo/contoh dihapus sesuai permintaan terbaru. Batas prototype tetap dinyatakan dalam dokumen teknis; tidak ada statistik/testimoni/logo mitra fiktif baru.
- R-39 PASS: switch memiliki nama dan aria-checked; tab mengacu panel, label form tetap tersedia, kontrol native memiliki pointer/state/fokus, reduced motion menonaktifkan transisi.
- R-40 PASS: tidak menambah media hero atau script pihak ketiga. Script tema kecil hanya membaca pilihan lokal sebelum render. Font lokal swap dan dimensi foto tetap dipertahankan. Tidak melaporkan skor performa yang tidak diukur.

## Purpose Gate

- R-01 PASS: putih/navy diminta pengguna; tidak ada gradient atau glow.
- R-04 PASS: ikon partner, lomba, buku dan arah menunjukkan isi atau tujuan navigasi.
- R-06 PASS: Plus Jakarta Sans untuk judul ramah dan Inter untuk data panjang, sesuai alasan di DESIGN.md.
- R-07 PASS: tanpa grid/dot/blueprint latar.
- R-08 PASS: panah menunjukkan tautan daftar/detail; kedua CTA hero menyebut aksi tanpa panah dekoratif.
- R-09 PASS: pengantar hero tetap teks biasa; badge hanya status atau metadata domain.
- R-10 PASS: tidak memakai glassmorphism.
- R-12 PASS: shadow baru hanya menegaskan satu preview ruang kolaborasi; tidak diterapkan ke seluruh kartu.
- R-13 PASS: tidak ada glow.
- R-14 PASS: komposisi berbeda untuk preview partner, agenda deadline, dan kebutuhan peran tim.
- R-19 PASS: transisi thumb switch 150 ms membantu membaca perubahan; tidak ada animasi scroll atau dekorasi berulang.
- R-22 PASS: tidak menambah ilustrasi/poster; preview memakai komponen dan tautan aplikasi yang bekerja.

## Liveliness dan quality locks

- Dials PASS: ENERGY 1 / RHYTHM 2 / MOTION 1 dinyatakan dan tampak pada palet tenang, variasi komposisi serta interaksi singkat.
- Fokus PASS: heading dan CTA hero mendahului preview; halaman data mempertahankan judul dan tindakan kontekstual.
- Whitespace PASS: jarak memisahkan ajakan, preview, jalur belajar, agenda, serta tim.
- Aksen PASS: underline biru baja menggarisbawahi “lebih jauh” sesuai permintaan; tidak menyebarkan ornamen pada setiap section.
- Motif PASS: tujuan belajar dan pasangan bidang/level/peran tetap menjadi isi visual TeamUp.
- Design Read PASS: arah dinyatakan sebelum perubahan pada commentary dan DESIGN.md.
- C-1 PASS: alasan warna, layout, font, shadow, underline dan switch dicatat pada revisi 1.2 DESIGN.md.
- C-2 PASS: semua elemen interaktif landing dan kontrol tema/tab baru memiliki hasil klik/keyboard yang dicatat.
- C-3 PASS: preview membantu memilih partner/tim; agenda membantu membaca deadline; tidak menambahkan trust logo atau pricing template.
- C-4 PASS: kedua tema dan variasi halaman diuji; overflow kecil 320 diperbaiki dan diuji ulang.
- C-5 PASS: tidak menambah testimoni, statistik, atau janji layanan; batas data lokal tetap terdokumentasi.
- R-05 PASS: hero terpusat diminta pengguna, diikuti preview fungsional, baris jalur, agenda dan catatan peran yang berbeda komposisi.
- R-11 PASS: kontrol 8 px, panel 12 px, pill hanya switch/avatar; tidak semua objek dibuat pill.
- R-15 PASS: CTA “Cari partner belajar”, “Temukan tim lomba”, “Buat profil belajar” menyebut tujuan konkret.
- R-16 PASS: tidak menambah buzzword AI atau klaim revolusioner.
- R-20 PASS: identitas putih/navy, judul Jakarta Sans, gesture underline dan isi kolaborasi mengikuti brief TeamUp.
- R-21 PASS: light default kunjungan pertama dan switch dark berfungsi, pilihan tersimpan.
- R-29 PASS: inti putih/navy dengan aksen biru baja; warna status dibatasi untuk arti domain.
- R-30 PASS: referensi dipakai untuk hierarki terpusat dan preview, tanpa menyalin logo, teks, pelanggan, atau ikon produk referensi.
- R-31 PASS: setiap keputusan utama diberi alasan pada DESIGN.md revisi 1.2.

## Batas validasi

Pengujian ini menilai frontend lokal dan perubahan visual; OAuth, email, keamanan server dan sinkronisasi lintas pengguna belum terintegrasi. Reflow 320 diuji; zoom browser 200% secara terpisah, Lighthouse, Core Web Vitals, dan seluruh kombinasi input/mutasi tidak diukur ulang. Tidak ada commit atau deployment.
