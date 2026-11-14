# TeamUp: arah pembaruan visual

## Dashboard dan Cara Kerja: revisi 14 November 2026

Lihat outputs/Dashboard_Requirements.md. Pengguna mempertahankan putih-navy, font serta light/dark. ENERGY 1 / RHYTHM 2 / MOTION 1. Sidebar kiri memisahkan navigasi kerja dari navbar publik, ringkasan tengah berisi kegiatan akun, panel kanan agenda terdekat dan kalender kecil. Kalender besar menggunakan grid bulan dan daftar tanggal terpilih agar deadline dapat dibaca bersama catatan. Warna semantik hanya menunjukkan jenis/status, selalu disertai teks. Dropdown kelompok/tim menampilkan keanggotaan sebenarnya. Carousel 4 langkah setelah hero menarasikan alur produk; tombol/pagination/swipe memindahkan langkah tanpa autoplay. Menu avatar menyediakan akses dashboard/profil/logout. Tidak menyalin logo, ornamen atau warna krem referensi.

## About Us: tambahan halaman publik

Tautan dokumen aktif: SRS dan User Manual kini memakai URL Google Drive yang diberikan pengguna pada app/about.tsx, menggantikan URL dummy dan TODO sebelumnya. Kartu tetap membuka tab baru tanpa label tautan sementara.

Arahan terbaru pengguna: hapus teks “Tautan sementara” dari kartu SRS/User Manual. Ini menggantikan keputusan label sebelumnya; URL dummy dan TODO penggantian tetap tercatat pada source/dokumen teknis.

Dokumen Website, 14 November 2026: dua kartu SRS dan User Manual sebelum bagian anggota, tersusun horizontal dalam dua kolom termasuk mobile dengan padding lebih ringkas. Kartu seluruhnya berupa tautan, ikon buku menandai dokumen dan ikon external menjelaskan tab baru. Status “Tautan sementara” mengidentifikasi URL dummy yang diminta pengguna; TODO penggantian URL berada pada websiteDocuments di app/about.tsx. Tidak menambahkan warna/efek dekoratif baru.

Revisi aktif 14 November 2026: pengguna mengganti placeholder dengan data 10 anggota yang diberikan langsung, serta menghapus seluruh foto. Kartu kini teks saja dengan nama, kelas, NIM, NID, kelompok; format dan kapitalisasi data pengguna dipertahankan, termasuk nol awal NID. Grid 3 kolom desktop, 2 tablet, 1 mobile memberi ruang bagi nama panjang dan NIM. Border tipis dan padding membedakan identitas tanpa mengandalkan potret. Tidak lagi menampilkan pesan identitas sedang dilengkapi. Revisi ini menggantikan detail potret/placeholder di bawah; warna dan dials tetap.

Permintaan pengguna: section About Us menjadi section terakhir landing sebelum footer, dengan deskripsi aplikasi dan tombol menuju `/aboutus`. Halaman publik ini menjelaskan TeamUp lalu menampilkan headline “Kelompok 20 Fortran”, subheader “Anggota:”, dan 10 profil dengan foto, nama, kelas, NIM, NID serta kelompok.

Referensi Pinterest pengguna (pin 883972233107601632) dipakai untuk judul terpusat, bentuk kapsul pada potret, dan grid profil yang ringan. ENERGY 1 / RHYTHM 2 / MOTION 1 tetap berlaku. Kartu menggunakan pemisah tipis agar identitas mudah dipindai; tanpa social link atau aksi fiktif. Grid 5 kolom desktop, 3 tablet, 2 pada layar menengah, dan kartu horizontal 1 kolom pada ponsel sempit menjaga label terbaca.

Pengguna memilih placeholder. Foto memakai siluet netral berlabel “Foto belum diisi”, nama “Nama anggota 01–10”, identitas kosong berlabel “Belum diisi”, kelompok “20 Fortran” sesuai instruksi. Tidak membuat foto/nama/NIM/NID nyata atau menebak arti NID. Konten dapat diganti pada array members di app/about.tsx. Warna, font, serta tema tetap dari token aktif.

## Revisi aktif 1.2: light mode dan referensi landing

Arahan langsung pengguna 13 November 2026 menggantikan keputusan tema tetap gelap dan hero terbagi di bawah. Pembacaan: landing kolaborasi siswa/mahasiswa dengan hero terpusat, bahasa visual putih–navy, ENERGY 1 / RHYTHM 2 / MOTION 1.

- Putih #FFFFFF memberi ruang baca; navy #000321 menegaskan judul dan aksi utama. Biru baja pada underline menjadi aksen tunggal, bukan warna promosi di setiap komponen.
- Hero terpusat mengikuti hierarki referensi pengguna; panel kolaborasi di bawahnya berisi tautan profil dan tab tim yang bekerja, bukan gambar dashboard atau statistik buatan.
- Garis bawah lengkung pada “lebih jauh” diminta eksplisit sebagai gestur kemajuan bersama. SVG inline menjaga ketajaman dan mengikuti lebar teks tanpa aset gambar baru.
- Preview memakai satu shadow untuk membedakannya sebagai pintu masuk ruang kolaborasi. Bagian lain tetap datar; agenda memudahkan perbandingan deadline dan catatan tim menjelaskan kebutuhan peran.
- Tipografi tetap Plus Jakarta Sans/Inter dan whitespace mengikuti grid proyek. Mobile menumpuk panel serta mempertahankan tombol sentuh minimal 44 px.
- Light mode adalah default kunjungan pertama. Switch navbar mengganti seluruh token light/dark, menyimpan pilihan lokal, dan menyelaraskan tab browser.
- Permintaan eksplisit pengguna menghapus label demo/contoh dan kontrol simulasi dari UI menggantikan aturan penanda prototype sebelumnya. Data lokal yang sudah diizinkan tetap digunakan; tidak menambah testimoni, logo mitra, atau statistik. Dokumen teknis tetap menjelaskan batas prototype.
- OAuth belum terhubung dan tidak lagi berpura-pura masuk ke akun Alya. Keterbatasan layanan ditampilkan saat relevan pada tindakan dan privasi, tanpa mengklaim backend tersedia.

Token light aktif ada pada `:root` app/globals.css; token dark pada `[data-theme="dark"]`. Palet dark 1.1 di bawah tetap menjadi pilihan sekunder.

## Dasar keputusan

Pengguna memilih antislop during dan menolak desain yang terasa generik serta warna yang terlalu mencolok. Pembaruan ini mempertahankan struktur P1, tema navy, dua keluarga font, ukuran kontrol, container, dan grid responsif dari design requirement. Palet dan komposisi diperhalus sesuai arahan pengguna terbaru.

Pembacaan: aplikasi partner belajar dan tim lomba untuk siswa dan mahasiswa, dengan bahasa visual ruang belajar yang tenang dan terstruktur. ENERGY 1 / RHYTHM 2 / MOTION 1.

## Bahasa visual

- Warna: charcoal bernuansa navy sebagai ruang kerja; biru abu-abu untuk aksi utama agar tidak terasa neon.
- Tipografi: Plus Jakarta Sans menjaga karakter ramah pada judul; Inter menjaga keterbacaan profil, jadwal, formulir, dan pesan.
- Komposisi: hero terbagi antara ajakan konkret dan contoh partner; daftar lomba disusun seperti agenda agar deadline mudah dibandingkan.
- Ritme: kombinasi pembuka dua kolom, baris kebutuhan belajar, agenda lomba, dan catatan kolaborasi. Hindari pola berulang judul terpusat dan tiga kartu promosi.
- Identitas: pasangan informasi yang saling melengkapi, seperti bidang dengan jadwal dan peran dengan kebutuhan tim. Identitas berasal dari isi kolaborasi, bukan ornamen.
- Kartu: khusus objek yang perlu dibandingkan, seperti profil dan tim. Tidak membungkus setiap paragraf dalam kotak.
- Radius: 8 untuk kontrol, 12 untuk panel/kartu, bulat hanya avatar dan status ringkas. Variasi ini membedakan aksi, isi, dan identitas.
- Ikon: pencarian, lokasi, jadwal, komunikasi, dan arah navigasi memiliki arti langsung. Tidak menggunakan sparkle sebagai dekorasi.
- Efek: tanpa glow, grid latar, garis bawah judul dekoratif, browser palsu, atau poster lomba buatan. Shadow hanya dialog dan toast untuk menandai lapisan.
- Motion: perubahan hover, fokus, dan status singkat. Tidak ada animasi dekoratif atau reveal saat scroll.
- Konten: demo tetap diberi penanda, tanpa klaim pengguna/testimoni/statistik. Foto profil tetap opsional dan avatar inisial tetap placeholder.

## Token warna pengganti

Token ini menggantikan nilai warna versi 1.0. Definisi aktif ada di app/globals.css.

| Kelompok | Nilai |
| --- | --- |
| canvas / surface / raised / input | #111821 / #18212C / #222D39 / #111A24 |
| selected / border / control | #2A394B / #35424F / #7A8B9E |
| text / secondary / muted | #EEEDE9 / #BCC4CD / #A0ADBB |
| primary / hover / pressed / onAccent | #A4B8CF / #BDCCDD / #8FA6C0 / #142131 |
| link / focus | #BCCDE0 / #C7D5E4 |
| info: bg / text / border | #202E3D / #C0D1E3 / #617991 |
| success: bg / text / border | #20332D / #BED2C7 / #668678 |
| warning: bg / text / border | #342F24 / #D9CBAD / #968466 |
| danger: bg / text / border | #35272B / #DEC0C4 / #9E7C83 |
| neutral: bg / text / border | #28323E / #CCD3DC / #7A8B9E |

## Keputusan yang dipertahankan

Pengantar hero tetap teks tanpa badge dan tanpa margin bawah. Banner simulasi frontend tidak dikembalikan pada autentikasi, dan label tombol tetap Lanjutkan dengan Google. Bilah demo tetap mengidentifikasi prototype. Tidak menambahkan theme toggle karena arah produk tetap tema gelap, sesuai design requirement. Tidak mengubah backend, aturan domain, atau prioritas fitur.
