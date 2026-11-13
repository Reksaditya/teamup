# TeamUp visual 1.1: Delivery Gate

Status akhir: PASS untuk perubahan presentasi frontend ini. Mode antislop: during, dipilih pengguna pada sesi ini. Arah: ENERGY 1 / RHYTHM 2 / MOTION 1. Lingkup bukan persetujuan MVP produksi, audit legal, atau integrasi backend.

## Bukti

- `npm run lint`, `npx tsc --noEmit`, dan `npm run build` lulus. Build terakhir dijalankan di luar sandbox setelah build awal terhalang izin folder output.
- `npm test`: 14 lulus, 0 gagal. Ada peringatan Node nonfatal tentang pendeteksian modul TypeScript.
- `node work/check-design.mjs`: 38 pasangan warna memenuhi target teks 4.5:1 dan kontrol/fokus 3:1. Hasil numerik: [redesign-contrast.json](redesign-contrast.json).
- 81 observasi browser tercatat di [redesign-browser-checks.json](redesign-browser-checks.json), termasuk inventaris kontrol, heading, URL, dan pengukuran lebar.
- Semua 20 tautan beranda baru diklik satu per satu dan mencapai tujuan yang tersedia. Catatan berlabel `Klik beranda 1` sampai `Klik beranda 20` memuat hasil masing-masing.
- Desktop 1440, tablet 768, mobile 360, serta reflow 320 diperiksa pada halaman yang tercantum dalam log. Satu overflow profil ditemukan pada pengujian awal dan diperbaiki pada input file tersembunyi; pemeriksaan ulang profil 360 dan 320 menunjukkan `scrollWidth === clientWidth`.
- Console browser tidak mengeluarkan error pada pemeriksaan akhir.

## Hard Gate

- R-02 PASS: pencarian pada source `app` tidak menemukan em dash dalam copy UI.
- R-03 PASS: pemeriksaan ulang halaman utama, daftar, detail, formulir, chat, dan admin pada ukuran yang dicatat tidak menunjukkan overflow; input foto telah diperbaiki.
- R-17 PASS: tidak menambahkan statistik pemasaran; jumlah partner/anggota/deadline berasal dari state demo dan diberi konteks.
- R-18 PASS: tidak ada testimoni, foto orang buatan, atau identitas pelanggan yang dibuat.
- R-23 PASS: tidak membuat media baru; logo tetap teks, avatar inisial yang sudah disetujui dipertahankan, favicon yang ada hanya diredupkan warnanya.
- R-24 PASS: seluruh 20 tautan beranda mencapai rute nyata; navigasi P1 tetap memakai halaman yang tersedia.
- R-25 PASS: 38 pasangan token teks, status, kontrol, dan fokus diuji secara numerik; tidak ada teks yang ditaruh di atas gradient.
- R-26 PASS: tautan baru bekerja; tombol filter, pagination, toggle password, dialog, profil, chat, dan laporan menunjukkan perubahan state yang dicatat. Login Google tetap simulasi yang dijelaskan saat dipilih.
- R-27 PASS: state memuat, kosong, gagal, dan akses ditolak diaktifkan dari kontrol simulasi dan diperiksa di browser.
- R-28 PASS: tidak menambahkan FAQ promosi; bantuan tetap menjelaskan penggunaan fitur TeamUp yang tersedia.
- R-32 PASS: kontrol memakai elemen native dan focus ring; Escape menutup menu/dialog, konfirmasi destruktif memfokuskan Batal, filter mobile memindahkan dan mengembalikan fokus.
- R-33 PASS: perubahan UI ditulis langsung pada source melalui patch editor; skrip pemeriksaan warna hanya membaca CSS dan menulis hasil uji, tidak menulis ulang fitur.
- R-34 PASS: hanya tema gelap yang diminta dan ditetapkan design requirement yang disajikan; tidak ada toggle dengan tema tidak lengkap.
- R-35 PASS: build berhasil, console diperiksa, semua tautan beranda baru diklik, dan kontrol bersama yang dipengaruhi redesign dicoba dengan hasil rinci di bawah.
- R-36 PASS: tidak menambahkan klaim keamanan, performa, kepatuhan, pelanggan, atau sertifikasi.
- R-37 PASS: arahan pengguna dicatat sebelum implementasi di `DESIGN.md`, termasuk alasan palet dan komposisi pengganti.
- R-38 PASS: partner, tim, lomba, kontak, dan interaksi tetap berada dalam konteks Mode demo; beranda menyebut Data contoh dan tautan lomba tetap dinyatakan dummy.
- R-39 PASS: label profil mobile ditambahkan; heading bagian diperbaiki ke h2, kontrol memakai nama aksesibel, link/button native, label form, pointer, dan state hover/active/disabled.
- R-40 PASS: tidak ada media hero atau script pihak ketiga; foto profil memakai Image dengan width/height, font lokal memakai swap, dan tidak ada skor performa yang diklaim.

## Purpose Gate

- R-01 PASS: palet navy abu-abu redup mengikuti arahan pengguna; glow dan gradient dekoratif dihilangkan.
- R-04 PASS: sparkle dihapus; ikon tersisa menunjukkan pencarian, lokasi, jadwal, komunikasi, atau navigasi.
- R-06 PASS: Plus Jakarta Sans mempertahankan suara ramah, Inter untuk membaca data; label tidak diberi tracking ekstrem atau gaya terminal.
- R-07 PASS: tidak ada grid/dot/blueprint pada latar.
- R-08 PASS: panah beranda menunjukkan perpindahan ke profil, daftar, atau detail; aksi utama tidak lagi memerlukan panah dekoratif.
- R-09 PASS: badge dipakai untuk status perekrutan, keputusan, kategori, atau verifikasi, bukan janji marketing.
- R-10 PASS: tidak memakai glassmorphism/backdrop blur.
- R-12 PASS: shadow hanya pada dialog dan toast untuk menandai lapisan, bukan semua kartu.
- R-13 PASS: tidak memakai glow.
- R-14 PASS: profil memakai pasangan bidang/level, tim memakai kebutuhan peran/kapasitas, dan lomba memakai informasi deadline; bagian promosi tidak dibungkus dalam kartu seragam.
- R-19 PASS: motion hanya hover, fokus, dan feedback tekan; reduced motion menonaktifkan transition.
- R-22 PASS: tidak membuat ilustrasi atau poster lomba fiktif; poster dekoratif lama dihapus.

## Liveliness dan kualitas

- R-05 PASS: komposisi pembuka dua kolom, pilihan alur berupa baris, agenda lomba, dan catatan tim membentuk ritme yang berbeda sesuai isi.
- R-11 PASS: radius 8 pada kontrol, 12 pada panel, bulat pada avatar; status memiliki radius kecil, bukan semua elemen berbentuk pill.
- R-15 PASS: CTA menyebut aksi konkret: Cari partner belajar, Saya mencari tim, Buat profil belajar, dan Lihat kebutuhan tim.
- R-16 PASS: tidak ada buzzword AI atau klaim revolusioner pada copy baru.
- R-20 PASS: pasangan bidang/jadwal dan peran/kapasitas menjadi motif informasi TeamUp, menggantikan grid dan ikon dekoratif.
- R-21 PASS: tema navy gelap dipertahankan karena arah visual produk yang diminta; tidak menambah pilihan tema di luar requirement.
- R-29 PASS: dasar navy/charcoal, biru abu-abu untuk aksi, warna semantik redup hanya untuk status; avatar tidak lagi memakai enam warna berbeda.
- R-30 PASS: tidak meniru layout atau identitas produk lain; komposisi berangkat dari dua alur TeamUp.
- R-31 PASS: alasan warna, layout, font, spacing, kartu, ikon, dan motion dicatat di `DESIGN.md`.
- Dials PASS: ENERGY 1 terlihat pada palet/typografi tenang, RHYTHM 2 pada variasi komposisi, MOTION 1 pada interaksi singkat tanpa animasi scroll.
- Fokus PASS: CTA pencarian menjadi fokus pembuka; pada halaman aplikasi, judul dan tindakan terkait mendahului data pendukung.
- Whitespace PASS: jarak memisahkan intro, pilihan alur, agenda, serta kebutuhan tim; bukan area kosong untuk dekorasi.
- C-1 PASS: keputusan utama mempunyai alasan produk dan tidak dipilih sebagai default visual.
- C-2 PASS: kontrol dalam lingkup perubahan mempunyai perilaku yang tersedia; hasil uji kontrol bersama dicatat.
- C-3 PASS: setiap bagian beranda membantu memilih partner atau membentuk tim; bento manfaat dan langkah generik dihapus.
- C-4 PASS: state data, breakpoint, dialog, fokus, serta input foto diperiksa dan perbaikannya diuji ulang.
- C-5 PASS: tidak menambahkan klaim/testimoni tanpa sumber; data contoh diberi konteks yang jelas.

## Catatan klik kontrol bersama

| Kontrol / alur | Hasil yang diamati |
| --- | --- |
| 20 tautan beranda | Masing-masing menuju halaman yang tersedia; URL dan heading dicatat per tautan. |
| Cari partner sebagai pengunjung | Menampilkan akses masuk, lalu membuka halaman login dengan tujuan partner. |
| Lanjutkan dengan Google, Batal | Dialog simulasi terbuka dan batal menutupnya tanpa membuat akun. |
| Tampilkan / sembunyikan password | Tipe tampilan berubah dan label tombol ikut berubah. |
| Pemilih persona | Navigasi dan akses berubah sesuai akun demo yang dipilih. |
| Bidang, level, kota, Terapkan | UI/UX Design + Mahir + Bandung menampilkan Nadia. |
| Reset dan pagination | Filter kembali kosong, halaman berikutnya menampilkan hasil lanjutan. |
| Memuat / kosong / gagal / ditolak | State yang dipilih tampil, tombol pemulihan mengembalikan data. |
| Stepper dan Lanjut profil | Berpindah dari identitas ke bidang, lalu jadwal. |
| Checkbox bidang dan select level | Python ditambahkan, level dipilih, lalu bidang dapat dilepas lagi. |
| Tambah / hapus interval | Jadwal kedua muncul lalu dihapus; lebar mobile tetap sesuai viewport. |
| Simpan profil | Kembali ke pencarian partner dan menampilkan feedback tersimpan. |
| Filter mobile | Panel terbuka; fokus menuju select, tersedia tombol Tutup dan Escape. |
| Menu mobile dan Escape | Menu native terbuka dan tertutup, fokus dikembalikan. |
| Chat offline, Kirim, Sambungkan, Retry | Pesan berubah Gagal dengan tombol retry, lalu Terkirim setelah dicoba ulang. |
| Lapor, kategori, alasan, Kirim | Form laporan demo tersimpan dan muncul di admin. |
| Blokir, Batal | Konfirmasi memfokuskan Batal dan dapat ditutup tanpa memblokir. |
| Admin: bukti laporan | Bukti relevan dibuka dan aksesnya dicatat. |
| Admin: Ditinjau dan Simpan | Dialog menerima alasan, status diperbarui, audit memuat aktor/waktu/alasan. |

## Batas pengujian

Gate ini menilai perubahan desain dan kontrol bersama yang disentuh. Ini tidak menyatakan seluruh variasi transaksi, semua browser, layanan autentikasi/email, atau seluruh kombinasi input produksi telah diuji. Pemeriksaan 320 CSS px dilakukan sebagai reflow; zoom browser 200% secara terpisah belum diukur. Tidak ada Lighthouse atau Core Web Vitals yang diukur. Batas frontend demo dan pekerjaan produksi berikutnya tetap mengikuti README dan Implementation_Decisions.
