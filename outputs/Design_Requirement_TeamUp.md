# Design Requirement — TeamUp Belajar

## Revisi dashboard, kalender, dan carousel: 14 November 2026

Persetujuan terbaru dirinci pada [Dashboard_Requirements.md](Dashboard_Requirements.md), dengan arah pada DESIGN.md. Navbar publik kini hanya Beranda, Kompetisi, Cari Tim, Cari Partner, Tentang Kami. Menu avatar mengarah ke dashboard/profil dan logout. Sidebar dashboard mengikuti susunan referensi, kalender berupa bulan + agenda tanggal terpilih, carousel empat langkah mengganti pilihan alur landing. Tetap token putih-navy dan kedua tema; detail kelompok/tim tetap layout lama. Revisi ini menggantikan susunan navigasi dan larangan kalender yang bertentangan pada rekomendasi sebelumnya.

## Tambahan About Us, 13 November 2026

Arahan terbaru pengguna: kartu SRS/User Manual tidak lagi menampilkan teks “Tautan sementara”, menggantikan ketentuan label pada revisi sebelumnya. URL dummy tetap sampai link asli diberikan.

Dokumen Website (14 November): tambahkan h2 “Dokumen Website” sebelum bagian anggota, dengan kartu SRS dan User Manual horizontal dua kolom. Kartu menavigasi ke URL Google Drive dummy pada tab baru, berlabel “Tautan sementara”, dengan petunjuk tab baru untuk pembaca layar. Warna mengikuti token light/dark; mobile tetap dua kolom dengan padding 16 px.

Revisi aktif 14 November 2026: tampilkan 10 identitas sesuai data pengguna, tanpa foto, siluet, atau placeholder foto. Kartu berisi nama, kelas, NIM, NID, dan kelompok; NIM/NID berupa string. Grid 3/2/1 kolom (desktop/tablet/mobile) menjaga keterbacaan nama lengkap. Headline “Kelompok 20 Fortran” dan “Anggota:” tetap. Revisi ini menggantikan kebutuhan foto/placeholder pada uraian awal berikut.

Atas permintaan pengguna, tambahkan section About Us terakhir sebelum footer landing, dengan deskripsi singkat dan tombol ke `/aboutus`. Halaman publik memuat penjelasan aplikasi, headline “Kelompok 20 Fortran”, subheader “Anggota:”, dan 10 kartu profil: foto, nama, kelas, NIM, NID, kelompok. Pengguna mengesahkan placeholder foto/identitas terlebih dahulu. Adaptasi referensi https://www.pinterest.com/pin/883972233107601632/ berupa potret kapsul, judul terpusat, dan grid profil; tidak menyalin foto/identitas referensi. Detail arah dan responsif tercatat pada DESIGN.md. Ini tambahan halaman informasi, tidak mengubah domain partner/tim atau prioritas produk lain.

## Revisi aktif 1.2, 13 November 2026

Tambahan interaksi logout: pada desktop maupun mobile tampilkan dialog “yakin ingin keluar dari akun?” sebelum sesi diakhiri. Tombol “Ya” berwarna merah dan mengakhiri sesi lokal; “Tidak” bergaya ghost dan membatalkan. Fokus awal pada Tidak; Escape/tutup membatalkan dan mengembalikan fokus. Warna destruktif bertoken terpusat dan tetap merah dalam kedua tema.

Arahan terbaru pengguna: light mode default dengan canvas #FFFFFF, teks/aksi navy #000321, switch tema pada navbar, hero terpusat mengikuti referensi lampiran terbaru, dan underline sedikit melengkung pada “lebih jauh”. Light/dark memakai token terpusat dalam app/globals.css; rincian alasan desain pada [DESIGN.md](../DESIGN.md). Ini menggantikan keputusan tema gelap tetap, tanpa toggle, hero terbagi, dan larangan underline pada revisi sebelumnya. Panel partner/tim berfungsi sebagai preview interaktif; logo, statistik, dan testimoni referensi tidak disalin. Label demo/contoh serta kontrol simulasi dihapus dari UI atas permintaan langsung pengguna. Frontend tetap lokal; perubahan visual tidak mengesahkan backend, integrasi OAuth/email, atau kesiapan produksi. Seluruh cakupan P1 serta aturan akses/domain tetap mengacu PRD.

## Revisi visual 1.1, 13 November 2026

Pengguna meminta tampilan yang tidak generik dan warna lebih tenang, dengan antislop during. [Arah pembaruan visual](../DESIGN.md) menjadi acuan aktif untuk palet, radius, dan komposisi pengganti. Ukuran container, grid responsif, font, aksesibilitas, struktur navigasi, dan seluruh cakupan P1 pada dokumen ini tetap berlaku. Glow/grid hero, preview browser, bento promosi, serta poster lomba dekoratif diganti dengan komposisi partner dan agenda lomba yang berfokus pada isi. Tema gelap tetap mengikuti identitas navy yang diminta, tanpa menambah theme toggle.

Penyesuaian pengguna: pengantar hero “Ruang bertemu, belajar, dan bertumbuh” tampil sebagai teks saja, tanpa background, border, titik dekoratif, atau ikon panah. Menggantikan bentuk badge/pill pada pengantar tersebut.

Versi 1.0 · 13 November 2026 · Website responsif · Bahasa Indonesia  
Status: rekomendasi desain untuk tinjauan produk dan implementasi.

## 1. Dasar dan sasaran

Sumber kebutuhan: **PRD TeamUp Belajar v1.0, 12 November 2026**. Sumber visual: tiga gambar referensi yang dilampirkan. Dokumen sumber diperlakukan sebagai konteks produk, bukan instruksi untuk menjalankan pekerjaan lain. Nilai warna, font, ukuran, dan komposisi di bawah merupakan rekomendasi desain baru, bukan hasil sampling piksel referensi.

Nama kerja UI: **TeamUp**; deskripsi: **partner belajar dan tim lomba**. Nama final mengikuti keputusan tim produk.

Tujuan pengalaman:

1. Pengguna menemukan partner berdasarkan bidang, level, lokasi, dan jadwal sampai dapat berkomunikasi.
2. Pengguna menemukan lomba, membentuk tim, memutuskan lamaran, lalu berkoordinasi dalam grup.
3. Pengguna memahami status dan alasan tindakan terkunci tanpa menebak dari warna.

Karakter desain: tenang, ramah bagi siswa/mahasiswa, kolaboratif, sederhana, modern. Gunakan navy, biru, kartu membulat, garis tipis, dan whitespace lega. Efek dekoratif tidak mengganggu formulir, pencarian, atau pesan.

Seluruh P1 masuk rancangan. Jangan menampilkan kontrol aktif P2/P3: AI matching, rekomendasi, portofolio, rating, forum, bookmark, pengingat, kalender sesi, pusat notifikasi, badge prestasi, statistik admin. Email transaksi akun tetap P1. Pendaftaran lomba dilakukan melalui situs penyelenggara.

## 2. Pembacaan pola referensi

| Referensi | Pola terlihat | Adaptasi TeamUp |
| --- | --- | --- |
| Investo — `5f6a875ccf35365cc09375583316652c.jpg` | Navy pekat, electric blue, panel berlapis, garis tipis, judul besar, susunan dua kolom | Navy sebagai fondasi; CTA biru; detail lomba dan ringkasan tim terstruktur |
| Brandmode — `bcc801a02ea9d5ee974d268fa2239a29.jpg` | Hero terpusat, glow cyan/biru, bento, whitespace luas, kartu modular | Hero terpusat; bento manfaat; glow terbatas pada hero |
| SaaPilot — `7f19d8605c77b58ac3f1a0ec410774c1.webp` | Dasar hampir hitam, mint, pill, rounded card, preview produk, CTA dominan | Radius ramah, preview pencarian/tim, badge ringkas; mint sebagai aksen kolaborasi |

**Sintesis:** biru sebagai aksen utama, mint sebagai pendukung/sukses. Bento hanya untuk pengenalan; hasil pencarian memakai kartu seragam agar dapat dibandingkan. Tidak memakai transparansi/glow di belakang teks panjang atau form.

Nama font asli referensi tidak dapat dipastikan dari gambar. Font di bawah merupakan pilihan TeamUp. Logo, ilustrasi, teks, statistik, dan testimoni referensi tidak disalin. Tidak menampilkan jumlah pengguna, institusi mitra, atau persentase kecocokan tanpa data sah.

## 3. Arsitektur informasi

| Area | Halaman | Akses |
| --- | --- | --- |
| Publik | Beranda, daftar/detail lomba, profil publik terbatas, autentikasi | Guest |
| Member | Cari Partner, Lomba, Cari Tim, Aktivitas, Pesan, Profil | Sesuai status akun dan hak akses |
| Profil | Edit profil, pengguna diblokir, privasi/bantuan | Pemilik |
| Admin | Lomba, pengguna, laporan, catatan tindakan | Admin |

Desktop member memakai topbar; sidebar hanya untuk filter, percakapan, admin. Mobile memakai topbar dan drawer seluruh navigasi; tanpa bottom navigation tambahan. Aktivitas memuat status permintaan/lamaran, bukan pusat notifikasi P2.

Alur partner: daftar/login → verifikasi → lengkapi profil → pencarian → detail profil → permintaan → keputusan → chat personal.

Alur tim: lomba → detail → cari/buat tim → lamaran → keputusan ketua → ringkasan tim → chat grup. Pendaftaran resmi tetap terpisah.

Tindakan privat dari guest mengarah ke login dengan tujuan asal tersimpan. Setelah kembali, tampilkan konteks dan minta pengguna menekan tindakan kembali; jangan otomatis mengirim permintaan/lamaran.

## 4. Sistem warna

HEX memakai sRGB; delapan digit berarti alpha pada dua digit terakhir. Token komponen merujuk tepat ke nilai berikut. Jangan menambahkan warna di luar sistem tanpa memperbarui token.

### 4.1 Token dasar

| Token | HEX | Penggunaan |
| --- | --- | --- |
| `bg.canvas` | `#080F1F` | Latar halaman/area pesan |
| `bg.surface` | `#111C30` | Card, topbar, sidebar, modal |
| `bg.raised` | `#19263D` | Menu, tooltip, hover item |
| `bg.input` | `#0C1628` | Input, select, textarea |
| `bg.selected` | `#17365D` | Item aktif, bubble sendiri |
| `border.subtle` | `#2A3A53` | Batas card/divider dekoratif |
| `border.control` | `#7185A3` | Batas kontrol penting |
| `text.primary` | `#F3F6FC` | Judul/isi utama |
| `text.secondary` | `#B8C5D9` | Deskripsi/metadata |
| `text.muted` | `#92A4BF` | Placeholder/pendukung |
| `text.onAccent` | `#071426` | Label di atas biru muda/mint |
| `brand.primary` | `#60A5FA` | CTA utama/mark brand |
| `brand.hover` | `#93C5FD` | Hover CTA |
| `brand.pressed` | `#3B82F6` | Pressed CTA |
| `link.default` | `#93C5FD` | Tautan |
| `link.hover` | `#BFDBFE` | Hover tautan |
| `accent.mint` | `#34D399` | Kolaborasi/sukses |
| `focus.ring` | `#A5B4FC` | Fokus keyboard |
| `disabled.bg` | `#26344A` | Kontrol nonaktif |
| `disabled.text` | `#92A4BF` | Label nonaktif |
| `overlay` | `#020617B8` | Backdrop dialog/drawer |

### 4.2 Semantik

| Jenis | Background | Teks/ikon | Border | Status/contoh |
| --- | --- | --- | --- | --- |
| Info | `#102E50` | `#BFDBFE` | `#3C6E9D` | Verifikasi, kemampuan mandiri |
| Sukses | `#0D332B` | `#6EE7B7` | `#347D68` | Diterima, tersimpan, merekrut |
| Peringatan | `#382B16` | `#FCD34D` | `#92712D` | Menunggu, deadline dekat |
| Bahaya | `#3B1D2B` | `#FDA4AF` | `#AA5366` | Ditolak, gagal |
| Netral | `#223047` | `#CBD5E1` | `#7185A3` | Dibatalkan, ditutup, penuh, bubar |

Status selalu berlabel. Ditutup sistem menggunakan netral dan alasan seperti kapasitas penuh. Level pemula/menengah/mahir memakai netral yang sama agar tidak menyerupai sertifikasi kualitas.

### 4.3 Efek

- Hero: `radial-gradient(ellipse at 50% 0%, #1D4ED84D 0%, #080F1F00 68%)` di atas `bg.canvas`.
- Panel CTA: `linear-gradient(120deg, #17365D 0%, #111C30 100%)`.
- Mint dekoratif opsional: `#34D3991F`, satu area kecil preview.
- Shadow menu: `0 8px 24px #02061740`; modal: `0 24px 64px #02061780`.
- Maksimal satu glow hero per halaman; dekorasi tidak interaktif dan tersembunyi dari pembaca layar.
- MVP memakai tema gelap; tidak menampilkan toggle light mode yang belum dirancang.

## 5. Tipografi dan ikon

Heading/brand: **Plus Jakarta Sans** 600/700. Isi/kontrol: **Inter** 400/500/600. Fallback: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

Gunakan WOFF2 dengan lisensi sesuai, subset seperlunya, `font-display: swap`. Maksimal dua keluarga; gunakan rem ekuivalen agar mengikuti pengaturan pengguna.

| Gaya | Desktop ukuran/line-height | Tablet | Mobile | Weight; letter-spacing |
| --- | --- | --- | --- | --- |
| Hero | 56/64 px | 44/52 px | 36/44 px | 700; -0.03em |
| H1 halaman | 36/44 px | 32/40 px | 28/36 px | 700; -0.02em |
| H2 section | 28/36 px | 28/36 px | 24/32 px | 700; -0.02em |
| H3 card | 20/28 px | sama | sama | 600; -0.01em |
| Body besar | 18/28 px | sama | sama | 400; 0 |
| Body/input | 16/24 px | sama | sama | 400; 0 |
| Label/tombol | 14/20 px | sama | sama | 600; 0 |
| Metadata/helper | 14/20 px | sama | sama | 400; 0 |
| Caption | 12/18 px | sama | sama | 500; 0 |

Caption hanya label pendek/timestamp. Instruksi penting tidak memakai caption. Paragraf max 65 karakter per baris; hero judul sekitar 22, deskripsi 56. Jangan memaksa line break tetap pada mobile.

Ikon outline konsisten, misalnya Lucide: 20×20 px, stroke 1.75–2 px; ikon kecil 16; empty state 40. Tombol ikon memiliki accessible name dan target ≥44×44. Google login menggunakan aset resmi saat implementasi.

## 6. Grid, padding, margin

Ukuran adalah CSS px. Padding dua nilai berarti vertikal × horizontal. Reset margin heading/paragraf ke 0; gunakan gap parent agar jarak tidak berlipat.

| Properti | Mobile 360–767 | Tablet 768–1023 | Desktop ≥1024 |
| --- | --- | --- | --- |
| Gutter halaman kiri/kanan | 16 | 24 | 32 |
| Max-width container | tersedia | tersedia | 1200 |
| Grid | 4 kolom | 8 kolom | 12 kolom |
| Gap kolom/card | 16 | 20 | 24 |
| Tinggi topbar | 64 | 72 | 80 |
| Padding aplikasi atas/bawah | 24/40 | 32/48 | 32/64 |
| Padding section landing atas/bawah | 48/48 | 64/64 | 80/80 |
| Gap blok utama aplikasi | 24 | 32 | 32 |

Container: `width: min(1200px, calc(100% - 2 * pageGutter)); margin-inline: auto`. Gutter tidak ditambah ulang pada anak. Pada 1440, margin kiri/kanan 120; pada 768, isi 720; pada 360, isi 328. Di bawah 360 tetap reflow satu kolom, tanpa min-width yang memicu scroll horizontal.

- Skala spacing: **4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96**.
- Label–input 8; input–helper/error 8; antarfield 20; antargrup 32.
- Judul–deskripsi 8; deskripsi–konten 24; konten–aksi 24.
- Radius: input/tombol 12; card 16; panel/modal 20; badge/avatar/pill 999.
- Border 1; selected control 2 dengan kompensasi padding agar tidak bergeser.
- Layer: konten 0, sticky topbar 20, dropdown 30, backdrop 40, dialog/drawer 50, toast 60. Tooltip modal berada di atas modal.

## 7. Komponen

### 7.1 Navigasi dan aksi

| Komponen | Warna/state | Ukuran/spacing |
| --- | --- | --- |
| Topbar | `bg.surface`, border bawah `border.subtle`; logo `text.primary`, mark `brand.primary` | Tinggi sesuai breakpoint; container global; logo–nav 40; antaritem 8 |
| Item nav | `text.secondary`; hover `bg.raised` + `text.primary`; aktif `bg.selected` + `link.default`, underline `brand.primary` 2 | Padding 12×16; radius 12; target tinggi ≥44 |
| Primer | `brand.primary` + `text.onAccent`; hover `brand.hover`; pressed `brand.pressed` | Tinggi 48; padding 12×20; gap ikon 8 |
| Sekunder | `bg.surface` + `text.primary`, border `border.control`; hover `bg.raised`; pressed `bg.selected` | Tinggi 48; padding 12×20 |
| Ghost | Transparan + `link.default`; hover `bg.raised`; pressed `bg.selected` | Tinggi 44; padding 12×16 |
| Destruktif | `#FDA4AF` + `#250B14`; hover `#FECDD3`; pressed `#FB7185` | Tinggi 48; padding 12×20; untuk konfirmasi destruktif |
| Disabled | `disabled.bg` + `disabled.text`, border `border.subtle` | Ukuran tetap; alasan penguncian terlihat |
| Link | `link.default`; hover `link.hover` + underline | Link paragraf selalu underlined |
| Dropdown | `bg.raised`, `text.primary`, border `border.subtle`; hover item `bg.selected` | Panel padding 8; item tinggi ≥44, padding 12; gap 4; min-width 200, max viewport−32 |

Tombol kecil tinggi visual 40, target ≥44, padding horizontal 16. Fokus keyboard: ring 2 `focus.ring`, offset 2 `bg.canvas`. Loading mempertahankan lebar, spinner + label seperti “Mengirim…”, dan mencegah submit ganda.

### 7.2 Form dan filter

| Komponen | Warna/state | Ukuran/spacing |
| --- | --- | --- |
| Input/select | `bg.input`, `text.primary`, placeholder `text.muted`, border `border.control`; hover border `link.default` | Tinggi 48; padding 12×16; ikon 20; gap 8 |
| Textarea | Sama input | Min-height 120; padding 12×16; resize vertikal |
| Label/helper | Label `text.primary`; helper `text.secondary` | 14/20; label semibold; gap kontrol 8 |
| Error | Border/ikon/teks `#FDA4AF`; bg tetap `bg.input` | 14/20; gap bawah kontrol 8 |
| Checkbox/radio | `bg.input`, border `border.control`; selected `brand.primary`, check/dot `text.onAccent` | Visual 20; target baris ≥44; gap label 12 |
| Switch | Off `disabled.bg`, border `border.control`; on `brand.primary`; thumb `text.primary` | Track 44×24; target tinggi ≥44; label status |
| Search | Sama input; ikon `text.muted`, hapus `text.secondary` | Tinggi 48; full-width kolom; hapus target 44 |
| Chip filter | `bg.raised` + `text.secondary`; aktif `bg.selected` + `#BFDBFE`, border `#60A5FA` | Tinggi ≥44; padding 10×12; ikon gap 8; wrap gap 8 |
| Pagination | `bg.surface` + `text.secondary`; aktif `bg.selected` + `text.primary` | Target 44×44; gap 8; margin atas 32 |

Label permanen; tanda wajib memakai kata “wajib”. Password memiliki tampilkan/sembunyikan. Error konkret: “Waktu selesai harus setelah waktu mulai.” Input dipertahankan saat gagal; fokus submit gagal menuju ringkasan error dengan link ke field. Batas karakter selain usulan PRD tidak ditentukan sepihak.

### 7.3 Card dan informasi

| Komponen | Warna | Ukuran/spacing |
| --- | --- | --- |
| Card partner | `bg.surface`, border `border.subtle`; judul `text.primary`, hover link `link.hover` | Padding 24 desktop/tablet, 20 mobile; gap 16; avatar 48 |
| Card lomba | Sama card partner | Media opsional 16:9; body padding 24/20; gap 16; aksi margin atas 24 |
| Card tim | Sama card partner | Padding 24/20; gap 16; avatar stack 32, overlap 8, ring 2 `bg.surface` |
| Badge | Sesuai tabel semantik | Padding 4×8; ikon gap 4; 12/18; tinggi ≥26; wrap |
| Avatar kosong | `bg.selected` + `#BFDBFE` | 32 daftar, 48 card, 80 detail desktop/64 mobile |
| Divider | `border.subtle` | Tinggi 1; margin vertikal 24 |
| Kapasitas | Track `#26344A`, isi `brand.primary` | Tinggi 6; radius 999; teks “3 dari 5 anggota” wajib |
| Tab | `text.secondary`; aktif `text.primary`, underline `brand.primary`; hover `bg.raised` | Tinggi ≥48; padding horizontal 16; gap 8 |
| Banner | Tabel semantik | Padding 16; ikon gap 12; radius 12; aksi wrap mobile |
| Tooltip | `bg.raised`, `text.primary`, border `border.subtle` | Padding 8×12; max-width 280; jarak trigger 8; radius 8 |

Card dengan banyak aksi tidak seluruhnya menjadi link. Judul menuju detail, tombol menjalankan tindakan. Judul listing maksimal dua baris; lengkap di detail. Deadline, slot, dan status tidak dipotong. Sejajarkan footer memakai flex, bukan menghilangkan konten.

### 7.4 Dialog dan feedback

- Modal max-width 480, form 640; `bg.surface`, border `border.subtle`, radius 20, padding 32 desktop/24 mobile. Judul–isi 16, isi–aksi 24, antaraksi 12. Mobile max-width viewport−32, max-height 100dvh−32, isi scroll.
- Drawer navigasi: `min(360px, 100vw - 32px)`, padding 24, `bg.surface`, backdrop `overlay`. Filter boleh full-width pada 360 dengan padding 16.
- Toast: `bg.raised`, `text.primary`, ikon semantik, border `border.subtle`; padding 16, gap 12, max-width 400. Desktop kanan/bawah 24; mobile kiri/kanan/bawah 16 + safe area. Sukses 5 detik, dapat ditutup; error penting tetap inline/banner.
- Empty: ikon 40 `text.muted`, H3 `text.primary`, isi `text.secondary`, CTA primer. Padding 48×24 desktop/32×20 mobile; gap 12; CTA margin atas 12; teks max 400.
- Skeleton: base `#19263D`, highlight `#26344A`, radius 8; bentuk mengikuti konten; reduced motion meniadakan animasi.
- Gagal: “Data belum bisa dimuat”, penjelasan, Coba lagi. Akses ditolak tidak menampilkan data privat di belakang pesan.
- Dialog memiliki focus trap, Escape, tombol tutup, pengembalian fokus. Konfirmasi destruktif memfokuskan Batal.

### 7.5 Chat

| Bagian | Warna | Ukuran/spacing |
| --- | --- | --- |
| Daftar percakapan | `bg.surface`; hover `bg.raised`; aktif `bg.selected`; divider `border.subtle` | Item padding 16; gap 12; avatar 40 |
| Area pesan | `bg.canvas` | Padding 24 desktop/16 mobile; gap antargrup 16, pengirim sama 8 |
| Bubble masuk | `bg.raised` + `text.primary` | Padding 12×16; radius 16, kiri bawah 4 |
| Bubble sendiri | `#17365D` + `#F3F6FC` | Padding 12×16; radius 16, kanan bawah 4 |
| Timestamp/status | `text.secondary`; gagal `#FDA4AF` | 12/18; gap atas 4 |
| Composer | Panel `bg.surface`, input `bg.input`, border `border.control` | Panel padding 16; input tinggi 48–144; kirim 48×48; gap 12 |
| Banner koneksi | Warna peringatan | Padding 12×16; di bawah header |

Bubble maksimal 70% area desktop/85% mobile. URL panjang wrap. Grup menyebut nama pengirim. Status Mengirim/Terkirim/Gagal; tanpa tanda baca, indikator mengetik, attachment, video call. Counter 2.000 karakter mengikuti usulan PRD yang masih perlu disahkan.

## 8. Requirement halaman

### 8.1 Landing

1. Header: logo kiri, Cara kerja/Lomba tengah desktop, Masuk sekunder/Daftar primer kanan; gap aksi 12. Mobile logo + drawer.
2. Hero terpusat: padding atas/bawah 80/64 desktop, 56/40 tablet, 40/32 mobile. Badge → gap 20 → judul → gap 16 → deskripsi → gap 32 → aksi. Judul max-width 760; deskripsi 600. Contoh: “Temukan partner. Bangun tim hebat.”
3. Cari Partner Belajar primer, Jelajahi Lomba sekunder; gap 12; mobile stacked full-width.
4. Preview produk: margin atas 48 desktop/32 mobile; max-width 1000; padding 24/16; radius 20. Contoh card partner/tim berlabel “Contoh tampilan”; bukan profil nyata.
5. Manfaat: judul → gap 32 → bento desktop 6+3+3 kolom; tablet satu card 8 dan dua card 4; mobile satu kolom. Padding 24. Isi: bidang/jadwal, lomba, koordinasi setelah terhubung.
6. Cara kerja: tab Partner belajar/Tim lomba, tiga langkah; tiga kolom desktop, satu mobile, gap 24.
7. Lomba terbuka: grid 3/2/1, hanya data tayang; Lihat semua lomba. Empty state jujur.
8. CTA penutup gradient: padding 48 desktop/24 mobile; judul–isi 16, isi–aksi 24.
9. Footer: border atas `border.subtle`, padding vertikal 40, gap 24; dua kolom desktop/satu mobile. Brand, privasi, bantuan; kontak diisi tim.

### 8.2 Autentikasi — AUTH-01–05

Form max-width 440; card padding 32 desktop/24 mobile; margin vertikal 48/24. Judul–deskripsi 8; form margin atas 32; antarfield 20. Google sekunder di atas form; pemisah “atau” margin vertikal 24. Submit full-width; link masuk/daftar margin atas 24.

- Daftar: email/password, bantuan minimal 8 karakter sebagai usulan PRD; pemberitahuan tujuan data/link privasi sebelum selesai. Usia/persetujuan menunggu keputusan produk.
- Login: error kredensial umum, reset password; logout di menu profil.
- Verifikasi: instruksi, status terkirim, kirim ulang; cooldown mengikuti server. Akun belum verifikasi tetap dapat edit profil.
- Reset: respons tidak mengungkap email terdaftar. Token salah/kedaluwarsa/terpakai memiliki state dan aksi meminta tautan baru.
- OAuth dibatalkan/gagal: tetap di login, tidak dianggap sukses. Akun email sama tidak otomatis digabung.
- Ditangguhkan: layar pembatasan dengan bantuan, tanpa data privat.

### 8.3 Onboarding/edit profil — PROF-01–04

Tiga langkah Identitas → Bidang & level → Jadwal. Form max 720; stepper margin bawah 32; field pendek dua kolom desktop gap 24, mobile satu gap 20. Footer Kembali/Lanjut atau Simpan gap 12; tidak menutup keyboard/field.

- Nama, foto opsional, institusi, jurusan/kelas, kota/kabupaten. Preview foto 80; usulan batas 2 MB dijelaskan. Tidak meminta alamat rumah/kartu identitas.
- Minimal satu bidang dikuasai/ingin dipelajari dan level per bidang. Subpanel `bg.input`, padding 16, gap 12; label “Level diisi sendiri oleh pengguna”.
- Zona waktu, mode online/offline/keduanya, hari, mulai, selesai; minimal satu interval. Desktop sejajar, mobile stacked. Tambah interval margin atas 16. Selesai setelah mulai; lintas tengah malam dibagi dua dengan bantuan.
- Foto tidak memengaruhi kelengkapan. Tampilkan daftar field kurang, bukan skor kecocokan.

### 8.4 Cari partner — PART-01–04

Judul/deskripsi → gap 24 → search → gap 24 → isi. Desktop sidebar 280 + hasil fleksibel, gap 24; container 1200 menghasilkan hasil 896 dan dua card 436. Tablet filter drawer + dua kolom, mobile drawer + satu kolom.

Sidebar `bg.surface`, padding 24, radius 16, grup gap 24. Filter bidang, level, kota, hari/waktu dengan zona, mode; Terapkan primer/Reset ghost. Teks dicari dengan Enter/Cari. Filter digabung sesuai PRD. Chip wrap gap 8, jumlah hasil dari server, pagination margin atas 32.

Card: avatar/nama, institusi, kota, bidang/level, mode, ringkasan jadwal berzona, label kemampuan mandiri. Maks tiga bidang lalu +N. Aksi Lihat profil/Ajak belajar; menunggu menjadi Permintaan terkirim; diterima Buka chat. Tidak menampilkan email.

Tidak ada skor AI/urutan Paling cocok. Urutan default deterministik disepakati produk/teknis. Empty: “Belum ada partner dengan filter ini” + Reset. Tidak mengabaikan filter diam-diam atau menampilkan profil palsu. Diri sendiri/ditangguhkan/blokir mengikuti pengecualian PRD.

### 8.5 Detail profil

Header padding 32 desktop/24 mobile; avatar 80/64, gap 24/16. Desktop informasi 8 kolom + aksi 4, gap 24; mobile stacked.

Member melihat identitas akademik, kota, bidang/level mandiri, mode, jadwal berzona. Guest hanya nama tampilan, foto opsional, ringkasan bidang; data lain tidak dirender sebagai publik. Email tidak ditampilkan.

Ajak belajar/Menunggu/Buka chat sesuai hubungan; menu Lapor/Blokir untuk member. Diri sendiri Edit profil. Permintaan berlawanan arah menuju permintaan menunggu yang sama, tanpa duplikat.

### 8.6 Aktivitas

Tab Permintaan partner/Lamaran tim; segmentasi Masuk/Terkirim, filter status. Tab–filter 24, filter–daftar 16; card padding 20, gap 16.

Item: pihak/tim, bidang/peran, waktu, status, aksi sah. Penerima Terima/Tolak; pengirim Batalkan. Lamaran masuk hanya bagi ketua terkait. Hasil tetap terbaca; diterima memberi Buka chat/Lihat tim. Penolakan bukan error. Batal/tolak memakai dialog; alasan tidak wajib tanpa keputusan produk. Jika status berubah di server, muat ulang dan jelaskan, jangan memberi sukses palsu.

### 8.7 Lomba — COMP-01–04

Daftar: judul/deskripsi, filter kategori, tingkat, gratis/berbayar, rentang deadline. Gap header–filter–hasil 24. Grid 3 desktop/2 tablet/1 mobile; filter mobile drawer.

Card: judul, penyelenggara, kategori/tingkat, biaya, deadline berzona, status, detail. Badge Informasi diperiksa memiliki penjelasan “Diperiksa admin, bukan jaminan kualitas penyelenggaraan.”

Detail: breadcrumb margin bawah 16; judul–metadata 16; desktop 8/4 kolom gap 24, mobile stacked. Aksi sticky topbar+24 hanya jika muat viewport, mobile normal. Section deskripsi, syarat, hadiah jika ada, biaya, deadline, pelaksanaan, sumber, pembaruan gap 32.

Cari tim primer, Buat tim sekunder; link “Daftar di situs penyelenggara” dengan ikon eksternal/domain. Tab baru diberi informasi aksesibel. Deadline berbeda dari pelaksanaan. Contoh “25 November 2026, 23.59 WIB (UTC+7)”; asumsi jam tanggal tanpa jam dicatat admin dan dijelaskan.

Deadline lewat: tetap terbaca, Buat tim/lamaran baru nonaktif dengan alasan; Cari tim boleh ke ringkasan yang ada. Waktu mengikuti server.

### 8.8 Tim — TEAM-01–06

Cari: filter lomba, bidang/peran, slot terbuka; dua kolom desktop/tablet, satu mobile. Card nama, lomba, ketua, peran, N dari M anggota, slot/status, Lihat kebutuhan.

Buat/edit max-width 720: lomba terbuka, nama, deskripsi, kapasitas total, peran/slot. Panel peran padding 16 gap 16; Tambah peran margin atas 16. Bantuan “Kapasitas termasuk ketua”. Slot peran tidak melebihi kapasitas tersisa, mengikuti batas lomba. Pembuat otomatis ketua/anggota; lamaran menunggu tidak memakai slot.

Ringkasan MVP: nama, ketua, lomba, anggota, kapasitas, peran, status, chat. Desktop 8/4, mobile stacked; bukan halaman lengkap P2.

- Nonanggota hanya ringkasan perekrutan; Lamar membuka dialog peran dan pesan singkat.
- Anggota aktif Buka chat/Keluar; dialog keluar menjelaskan kehilangan akses.
- Ketua buka/tutup perekrutan, edit, tinjau, pindah kepemimpinan. Area bubarkan terpisah margin atas 40.
- Ketua transfer ke anggota aktif sebelum keluar; jika sendirian, bubarkan.
- Penuh/deadline lewat: lamaran terkunci dengan alasan; lamaran ditutup sistem menampilkan penyebab.
- Konflik slot terakhir: jumlah anggota berubah hanya setelah server berhasil; gagal menjelaskan sudah penuh.
- Deadline lewat saat form terbuka: pertahankan teks, jelaskan belum terkirim, nonaktifkan kirim.
- Bubar: banner, perekrutan tertutup, grup hanya-baca bagi mantan anggota yang berhak; ditangguhkan tetap ditolak.

Satu pengguna satu tim aktif per lomba tetap usulan PRD. State konflik diaktifkan setelah disahkan. Undangan khusus anggota di luar MVP.

### 8.9 Pesan — CHAT-01–04

Shell `100dvh − topbar`, tanpa padding vertikal halaman biasa. Desktop daftar 320 + percakapan fleksibel; tablet daftar 280. Header percakapan 72; daftar/riwayat scroll terpisah. Mobile satu layar daftar atau chat, tombol kembali, composer mengikuti keyboard/safe area.

Header avatar/nama/Personal atau Grup tim/menu keamanan; tanpa online/last seen yang belum disyaratkan. Riwayat lama dimuat saat scroll atas dengan posisi baca tetap. Pesan masuk tidak memaksa scroll saat membaca; tampilkan Pesan baru.

Personal hanya setelah diterima, grup anggota aktif; pengecualian hanya-baca tim bubar sesuai PRD. Keluar/ditangguhkan menghentikan tampilan privat yang tak lagi berhak. Blokir personal mengunci composer dan menjelaskan alasan.

Koneksi putus memberi banner. Terkirim menunggu server; gagal mempertahankan isi + Kirim ulang. Pulih tanpa duplikat. Jadwal disepakati lewat teks, bukan kalender terstruktur.

### 8.10 Keamanan/privasi — MOD-01–05

Laporan modal max 640: objek, kategori, alasan, bukti relevan, Kirim laporan; antarfield 20. Tidak menawarkan upload bebas sebelum disepakati. Bukti hanya pesan relevan yang berhak, bukan semua chat. Konfirmasi tidak menjanjikan SLA yang belum ada.

Blokir menjelaskan dampak personal/permintaan/perekrutan baru. Dalam satu tim, keduanya tetap anggota; pesan pihak diblokir disembunyikan bagi pemblokir dengan placeholder netral dan opsi Lapor/Keluar, tanpa mengeluarkan otomatis.

Daftar diblokir: avatar/nama/Buka blokir, padding 16, gap 12. Membuka blokir tidak menghidupkan permintaan lama. Privasi/bantuan menyediakan jalur akses, koreksi, penghapusan melalui admin; kontak/retensi ditentukan tim sebelum publik, tanpa janji hapus instan.

### 8.11 Admin

Desktop sidebar 240, konten padding 32 gap 24. Tablet/mobile drawer, padding 24/16. Token sama dengan member.

- Lomba: draf, tinjau, tayang/tolak dengan alasan, arsip; sumber wajib. Publikasi terpisah dari deadline. Perubahan material tayang ditinjau.
- Pengguna: cari/status/tangguhkan/pulihkan dengan alasan.
- Laporan: baru/ditinjau/ditindak/ditutup tanpa tindakan; bukti relevan, akses tercatat; tanpa akses bebas seluruh chat.
- Catatan tindakan: aktor, waktu, objek, alasan, perubahan status; tanpa statistik P2.

Tabel header `bg.raised` + `text.secondary`; row `bg.surface`, hover `bg.raised`, selected `bg.selected`; border `border.subtle`. Header tinggi 44, cell padding 16, row min 64. Mobile card berlabel + menu aksi tanpa scroll horizontal halaman. Form section gap 32; footer tidak menutup input.

## 9. State lintas fitur

| State | Feedback | Aksi |
| --- | --- | --- |
| Guest ingin interaksi | Perlu akun | Masuk/Daftar lalu kembali |
| Belum verifikasi | Banner info | Kirim ulang; permintaan/lamaran/buat tim/chat terkunci |
| Profil belum lengkap | Banner + kekurangan | Lengkapi; permintaan/lamaran/buat tim terkunci |
| Menunggu | Badge peringatan/waktu | Terima/Tolak penerima; Batalkan pengirim |
| Diterima | Sukses | Buka chat/tim yang sudah terbentuk |
| Ditolak/dibatalkan | Bahaya/netral | Status terbaca; pengiriman ulang mengikuti server |
| Ditutup sistem | Netral + alasan | Tidak ada Terima yang aktif |
| Penuh/ditutup/deadline | Status + penyebab | Lamaran baru terkunci |
| Koneksi gagal | Banner/status akurat | Coba lagi, tanpa sukses palsu |
| Akses ditolak | Pesan umum tanpa data privat | Kembali ke area sah |
| Ditangguhkan | Layar pembatasan | Bantuan, tanpa akses privat |

Setiap halaman data memiliki loading, kosong, gagal, akses ditolak. Gagal memperbarui tidak mengubah data lama yang masih sah menjadi kosong. Otorisasi server tetap wajib; UI terkunci bukan penggantinya.

## 10. Aksesibilitas dan interaksi

Acuan kualitas yang diusulkan: WCAG 2.2 AA, bukan klaim sertifikasi. Kontras teks normal ≥4.5:1, teks besar ≥3:1, indikator/batas kontrol penting ≥3:1. Verifikasi pasangan nyata setelah implementasi termasuk alpha. Border dekoratif tidak menggantikan border kontrol. Tombol biru memakai teks gelap sesuai token, bukan putih.

- Keyboard lengkap, fokus jelas, urutan DOM sesuai visual, skip link Lewati ke konten.
- Target ≥44×44, gap antaraksi ≥8; informasi wajib tidak bergantung hover/tooltip.
- Zoom 200% dan reflow ekuivalen 320 CSS px tidak menutup kontrol. Uji PRD pada 360/768/1440.
- Label/helper terhubung, `aria-invalid`, ringkasan error, status tidak bergantung warna.
- Live region status penting tanpa mengumumkan semua riwayat chat berulang.
- Avatar dekoratif di samping nama tidak mengulang pembacaan; ilustrasi berketerangan.
- Transisi hover/focus 150 ms, dialog 180 ms; easing `cubic-bezier(0.2, 0, 0, 1)`; reduced motion mematikan dekorasi bergerak.
- Tanpa carousel otomatis, parallax, kedip, glow terus bergerak.

## 11. Microcopy dan kepercayaan

Gunakan “kamu” untuk member; admin memakai bahasa tindakan lugas. Jangan mengklaim kemampuan diuji, kecocokan dijamin, atau lomba dijamin aman.

| Konteks | Copy |
| --- | --- |
| Kemampuan | Level ini diisi sendiri oleh pengguna. |
| Permintaan | Permintaan terkirim. Lihat statusnya di Aktivitas. |
| Kosong | Belum ada hasil dengan filter ini. Coba kurangi filter. |
| Penuh | Tim sudah penuh. Lamaran baru tidak dapat dikirim. |
| Deadline berubah | Pendaftaran sudah ditutup. Lamaran ini belum terkirim. |
| Pesan gagal | Pesan belum terkirim. Coba kirim ulang. |
| Reset | Jika email ini terdaftar, petunjuk reset akan dikirim. |

Tanggal relatif dilengkapi waktu absolut berzona. Irisan jadwal sesuai normalisasi zona, bukan skor kecocokan. Analitik tidak menyimpan isi chat/password. Tidak meminta data di luar kebutuhan PRD.

## 12. Handoff dan pemetaan

Rancangan lanjutan: library token/komponen semua state; wireframe/high-fidelity pada 360/768/1440; prototype dua alur sampai chat; varian guest/member/ketua/admin/dibatasi; catatan akses/error server.

Deliverable ini adalah requirement Markdown. Website, prototype, high-fidelity, dan library Figma belum dibuat sebagai bagian dari dokumen ini.

| PRD | Bagian desain |
| --- | --- |
| AUTH-01–05 | 8.2, 9 |
| PROF-01–04 | 8.3, 8.5 |
| PART-01–04 | 8.4–8.6 |
| COMP-01–04 | 8.7, 8.11 |
| TEAM-01–06 | 8.6, 8.8, 9 |
| CHAT-01–04 | 7.5, 8.9 |
| MOD-01–05 | 8.10–8.11 |
| Responsif/aksesibilitas/privasi | 6, 9–11 |

## 13. Kriteria penerimaan desain

- Kedua alur lengkap, termasuk keputusan pihak lain, kegagalan, akses chat.
- Seluruh halaman P1 memiliki state dasar dan varian peran.
- Grid/padding/margin konsisten 360/768/1440 tanpa scroll horizontal halaman.
- Komponen memakai token HEX/font/radius/spacing; tambahan dicatat.
- Filter kombinasi/reset/chip/pagination konsisten; tanpa skor AI/hasil palsu.
- Guest hanya profil terbatas; email/jadwal rinci tidak bocor.
- Keluar/bubar/blokir/penangguhan mengubah chat sesuai PRD.
- Deadline lewat saat form terbuka dan konflik slot memiliki feedback tanpa sukses palsu.
- Kapasitas mencakup ketua; lamaran menunggu tidak memakai slot.
- Level mandiri/verifikasi lomba dijelaskan; pendaftaran lomba eksternal.
- Kontras, keyboard, dialog, zoom, reduced motion, target sentuh diperiksa pada implementasi.

## 14. Keputusan produk terbuka

| Keputusan | Dampak/posisi |
| --- | --- |
| Nama final | TeamUp sebagai nama kerja |
| Usia/persetujuan | Menentukan registrasi publik, belum dianggap selesai |
| Satu tim aktif per lomba | Tetap usulan, state konflik mengikuti final |
| Anti-spam/cooldown | Nilai mengikuti server setelah disahkan |
| Retensi/penghapusan | Copy kebijakan, tanpa janji masa simpan/hapus instan |
| Batas pesan/foto/password | 2.000 karakter, 2 MB, minimal 8 karakter masih usulan PRD |
| Urutan hasil | Deterministik, disepakati tanpa menyiratkan AI |
| Kontak bantuan/respons moderasi | Diisi tim sebelum publik; tidak dikarang |

Keputusan visual dapat digunakan untuk perancangan. Keputusan produk terbuka disahkan dan dicatat pada PRD sebelum fitur terkait difinalkan.


## Keputusan pengguna — 13 November 2026

Nama TeamUp, frontend interaktif dengan data demo untuk seluruh halaman P1, satu tim aktif per pengguna per lomba, password contoh minimal 8 karakter, pesan 2.000 karakter, dan foto 2 MB telah disetujui. Logo teks dan kontak dummy digunakan sementara. Detail cakupan, penerimaan frontend, dan batas integrasi: [Implementation_Decisions.md](Implementation_Decisions.md). Ketentuan usulan lain tetap terbuka.
