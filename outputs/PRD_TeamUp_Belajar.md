# Product Requirements Document TeamUp Belajar

| Atribut | Keterangan |
| --- | --- |
| Versi | 1.0 |
| Tanggal | 12 November 2026 |
| Status | Draf untuk tinjauan tim |
| Nama produk | TeamUp Belajar, nama sementara |
| Platform | Web responsif |
| Rilis awal | MVP dengan seluruh fitur P1 |
| Pemilik produk dan tim | Ditentukan tim |

## 1. Ringkasan produk

TeamUp Belajar mempertemukan siswa dan mahasiswa dengan partner belajar serta rekan tim lomba berdasarkan bidang, tingkat kemampuan, lokasi, dan ketersediaan waktu. Platform menggabungkan profil keterampilan, pencarian partner, informasi lomba, perekrutan anggota tim, serta komunikasi dalam satu tempat.

MVP harus memungkinkan pengguna menyelesaikan dua aktivitas utama secara menyeluruh: menemukan partner hingga berkomunikasi, serta menemukan lomba hingga membentuk tim dan berkoordinasi. Pendaftaran lomba dilakukan pada situs penyelenggara.

Dokumen ini menjadi acuan perancangan antarmuka, pengembangan, dan pengujian. Ketentuan operasional tambahan di bawah merupakan usulan keputusan produk agar spesifikasi dapat diimplementasikan; keputusan yang belum final dicatat pada bagian 16.

## 2. Latar belakang dan masalah

1. Pengguna kesulitan menemukan partner dengan minat dan jadwal yang sesuai di luar pertemanan.
2. Calon peserta melewatkan lomba karena tidak memiliki tim atau terlambat memperoleh informasi.
3. Informasi lomba tersebar sehingga sulit dibandingkan dan ditelusuri.
4. Kemampuan calon partner sulit dinilai tanpa profil yang terstruktur.

Pada MVP, kemampuan ditampilkan sebagai pernyataan pengguna sendiri. Platform belum memberikan sertifikasi keahlian atau menjamin bahwa level kemampuan telah diuji.

## 3. Tujuan dan pengukuran keberhasilan

### 3.1 Tujuan produk

- Mempermudah penemuan partner belajar yang relevan.
- Memusatkan informasi lomba dan proses pembentukan tim.
- Membantu pengguna memulai kolaborasi melalui chat.
- Menyediakan mekanisme pelaporan dan pengendalian interaksi yang tidak diinginkan.

### 3.2 Indikator keberhasilan

Target numerik bisnis ditetapkan setelah pilot karena belum ada baseline pengguna. Definisi berikut harus digunakan secara konsisten pada analitik.

| Indikator | Definisi |
| --- | --- |
| Aktivasi profil | Pengguna baru yang menyelesaikan profil wajib dalam 7 hari / seluruh pengguna baru |
| Konversi pencarian partner | Pengguna yang mengirim permintaan setelah mencari / pengguna yang melakukan pencarian |
| Penerimaan partner | Permintaan partner yang diterima / permintaan yang memperoleh keputusan diterima atau ditolak |
| Kolaborasi dimulai | Pasangan partner baru yang kedua pihaknya mengirim sedikitnya satu pesan dalam 7 hari setelah diterima |
| Keberhasilan perekrutan | Tim yang menerima sedikitnya satu pelamar dalam 14 hari / tim yang membuka perekrutan pada periode yang sama |
| Retensi mingguan | Pengguna aktif suatu minggu yang kembali aktif pada minggu berikutnya / pengguna aktif minggu awal |
| Respons moderasi | Median waktu dari laporan dibuat sampai tindakan atau keputusan admin pertama |

Catat peristiwa registrasi berhasil, profil lengkap, pencarian, permintaan partner, keputusan permintaan, pembuatan tim, lamaran, keputusan lamaran, pesan terkirim, dan laporan. Analitik tidak menyimpan isi pesan atau kata sandi.

## 4. Pengguna dan hak akses

| Aktor | Kebutuhan utama | Hak akses |
| --- | --- | --- |
| Pengunjung | Mengenali layanan dan menemukan lomba | Landing page, daftar dan detail lomba tayang, profil publik terbatas |
| Member | Menemukan partner dan tim | Profil sendiri, pencarian, permintaan partner, tim, chat, laporan, blokir |
| Penyelenggara | Mempublikasikan informasi lomba | Pengajuan dan pengelolaan lomba miliknya pada P2; tidak menjadi modul mandiri MVP |
| Admin | Menjaga kualitas dan keamanan platform | Kelola lomba, moderasi laporan dan konten, penangguhan akun, verifikasi lomba |

Ketua tim adalah member yang memiliki tim, bukan peran akun global. Ketua berwenang mengelola tim dan memutuskan lamaran pada tim tersebut. Hak akses diperiksa pada server untuk setiap operasi.

## 5. Cakupan dan prioritas

| Modul | P1 — MVP | P2 — Setelah MVP | P3 — Lanjutan |
| --- | --- | --- | --- |
| Akun | Email/password, Google, verifikasi email, reset password | — | Verifikasi status pelajar |
| Profil | Identitas, institusi, bidang, level, jadwal | Portofolio, prestasi, pengaturan privasi tambahan | — |
| Partner | Pencarian dan filter, kirim/terima/tolak permintaan | Rekomendasi, daftar partner khusus, riwayat kolaborasi | — |
| Lomba | Daftar, filter, detail, pengelolaan oleh admin | Bookmark, pengingat, pengajuan penyelenggara | — |
| Tim | Buat tim, lowongan, pencarian, lamaran dan keputusan | Halaman tim lengkap | — |
| Komunikasi | Chat personal dan grup tim | Notifikasi aplikasi/email, penjadwalan sesi | — |
| Moderasi | Lapor, blokir, hapus konten, tangguhkan akun, verifikasi lomba | Dasbor statistik admin | Review, rating, forum, badge |

**Batas minimum pendukung P1:** ringkasan anggota, kapasitas, status tim, serta akses ke percakapan tersedia dalam MVP karena diperlukan untuk perekrutan dan chat. Halaman tim lengkap, daftar partner khusus, dan pusat notifikasi tetap P2. Status permintaan dan lamaran pada MVP dapat dilihat melalui halaman aktivitas.

**Di luar cakupan:** aplikasi mobile native, pembayaran, pendaftaran lomba internal, scraping otomatis, video call, ujian keterampilan, serta AI matching. Tidak ada kewajiban stack teknologi tertentu dalam PRD ini.

## 6. Alur pengguna utama

### 6.1 Menemukan partner belajar

Daftar atau login → verifikasi email → lengkapi profil → cari dan filter partner → lihat profil → kirim permintaan → penerima menerima atau menolak → jika diterima, chat tersedia. Pada MVP, kesepakatan jadwal dilakukan melalui chat; kalender sesi terstruktur masuk P2.

### 6.2 Membentuk tim lomba

Lihat lomba → buka detail → pilih buat tim atau cari tim → lihat kebutuhan peran → ajukan lamaran → ketua meninjau profil dan lamaran → ketua menerima atau menolak → jika diterima, anggota mendapat akses chat grup. Pengguna melanjutkan pendaftaran resmi melalui tautan penyelenggara.

### 6.3 Mengelola lomba

MVP: admin membuat draf → memeriksa kelengkapan dan sumber → menyetujui serta menayangkan → memperbarui atau mengarsipkan.

P2: penyelenggara membuat pengajuan → admin meninjau → disetujui atau dikembalikan dengan alasan → lomba yang disetujui tayang. Pemantauan peminat dirancang pada tahap P2.

## 7. Kebutuhan fungsional dan kriteria penerimaan

### 7.1 Autentikasi dan akun

| ID | Kebutuhan P1 | Kriteria penerimaan |
| --- | --- | --- |
| AUTH-01 | Registrasi email dan password | Email unik; input divalidasi; password minimal 8 karakter sebagai usulan awal; akun dibuat dengan status belum terverifikasi; email verifikasi dikirim |
| AUTH-02 | Login dan logout | Kredensial valid membuka sesi; kredensial salah menampilkan pesan umum; logout membatalkan sesi; halaman privat tidak dapat diakses tanpa sesi |
| AUTH-03 | Login Google | Identitas Google diverifikasi server; pengguna baru diarahkan melengkapi profil; pembatalan atau kegagalan login tidak membuat akun parsial |
| AUTH-04 | Verifikasi email | Token hanya dapat digunakan sekali dan memiliki kedaluwarsa; tautan tidak valid ditolak; pengguna dapat meminta pengiriman ulang dengan pembatasan frekuensi |
| AUTH-05 | Reset password | Respons tidak mengungkap keberadaan email; token sekali pakai dan kedaluwarsa; password lama tidak berlaku setelah reset; sesi lama dicabut |

Member belum terverifikasi dapat mengelola profil, tetapi belum dapat mengirim permintaan, melamar, membuat tim, atau mengirim chat. Email Google dianggap terverifikasi hanya jika penyedia memberikan klaim email terverifikasi yang valid. Akun dengan email sama tidak digabung otomatis tanpa pembuktian kepemilikan akun.

### 7.2 Profil pengguna

| ID | Kebutuhan P1 | Kriteria penerimaan |
| --- | --- | --- |
| PROF-01 | Kelola identitas | Pemilik dapat menyimpan nama, foto opsional, institusi, jurusan/kelas, serta kota/kabupaten; pengguna lain tidak dapat mengubahnya |
| PROF-02 | Kelola bidang dan level | Pengguna memilih minimal satu bidang yang dikuasai atau ingin dipelajari; level pemula/menengah/mahir tersimpan per bidang; label kemampuan mandiri ditampilkan |
| PROF-03 | Kelola jadwal dan mode | Pengguna mengisi sedikitnya satu interval hari dan waktu, zona waktu, serta online/offline/keduanya; waktu selesai harus setelah waktu mulai |
| PROF-04 | Profil publik terbatas | Guest hanya melihat nama tampilan, foto jika ada, dan ringkasan bidang; email, jadwal rinci, dan alamat tidak tampil publik |

Profil lengkap memerlukan nama, institusi, jurusan/kelas, kota/kabupaten, bidang beserta level, mode, dan jadwal. Foto tidak menghalangi penyelesaian profil. Domisili cukup tingkat kota/kabupaten; alamat rumah tidak diminta.

### 7.3 Pencarian dan permintaan partner

| ID | Kebutuhan P1 | Kriteria penerimaan |
| --- | --- | --- |
| PART-01 | Pencarian dan filter | Filter bidang, level, lokasi, hari/waktu, dan mode dapat dikombinasikan; hasil sesuai semua filter aktif; tersedia reset, paginasi, serta kondisi kosong |
| PART-02 | Kirim permintaan | Member terverifikasi dengan profil lengkap dapat mengirim satu permintaan aktif ke pengguna lain; diri sendiri, akun ditangguhkan, dan relasi blokir ditolak |
| PART-03 | Putuskan permintaan | Hanya penerima dapat menerima atau menolak permintaan menunggu; penerimaan membentuk relasi partner dan satu percakapan personal |
| PART-04 | Lihat status permintaan | Pengirim dan penerima melihat status menunggu/diterima/ditolak/dibatalkan; pengirim dapat membatalkan permintaan menunggu |

Kecocokan jadwal berarti interval waktu beririsan setelah normalisasi zona waktu. Jadwal berulang menggunakan hari dan zona waktu pengguna. Batas interval lintas tengah malam dipecah menjadi dua interval. Permintaan berlawanan arah tidak membuat duplikat; pengguna diarahkan ke permintaan yang sudah menunggu.

### 7.4 Informasi lomba

| ID | Kebutuhan P1 | Kriteria penerimaan |
| --- | --- | --- |
| COMP-01 | Daftar dan filter lomba | Guest/member dapat memfilter kategori, tingkat, biaya gratis/berbayar, dan rentang deadline; hanya lomba tayang yang muncul |
| COMP-02 | Detail lomba | Menampilkan judul, penyelenggara, kategori, tingkat, deskripsi, syarat, hadiah jika tersedia, biaya, deadline dengan zona waktu, sumber, serta tautan pendaftaran |
| COMP-03 | Kelola dan verifikasi | Admin dapat membuat/mengubah draf, menyetujui untuk tayang, menolak dengan alasan, dan mengarsipkan; perubahan status dicatat |
| COMP-04 | Deadline | Deadline lewat diberi label ditutup; tombol membuat tim dan lamaran baru untuk lomba tersebut dinonaktifkan; data lomba tetap dapat dibaca jika masih tayang |

Deadline pendaftaran dan tanggal pelaksanaan disimpan terpisah. Tanggal tanpa jam harus diberi asumsi eksplisit saat input. Badge verifikasi berarti informasi diperiksa admin, bukan jaminan kualitas penyelenggaraan. Perubahan material pada informasi lomba tayang harus melalui peninjauan admin.

### 7.5 Pembentukan tim

| ID | Kebutuhan P1 | Kriteria penerimaan |
| --- | --- | --- |
| TEAM-01 | Buat tim | Member terverifikasi dengan profil lengkap memilih lomba terbuka, nama tim, deskripsi, kapasitas total, dan peran yang dibutuhkan; pembuat otomatis menjadi ketua dan anggota |
| TEAM-02 | Cari tim dan anggota | Pengguna mencari tim berdasarkan lomba, bidang/peran, dan slot terbuka; ketua dapat mencari calon anggota melalui pencarian profil dan membagikan tautan tim melalui chat yang diizinkan |
| TEAM-03 | Ajukan lamaran | Nonanggota mengirim peran tujuan dan pesan singkat; satu lamaran aktif per pengguna per tim; lamaran ditolak bila tim penuh, ditutup, atau deadline lewat |
| TEAM-04 | Tinjau lamaran | Hanya ketua dapat menerima atau menolak; menerima menambah anggota dan akses grup secara atomik; permintaan serentak tidak melampaui kapasitas |
| TEAM-05 | Kelola perekrutan | Ketua dapat membuka/menutup perekrutan sebelum deadline; kapasitas tidak boleh di bawah jumlah anggota; tim penuh otomatis tidak menerima lamaran baru |
| TEAM-06 | Ringkasan tim | Anggota dapat melihat nama, ketua, lomba, anggota, kapasitas, peran terbuka, status, dan akses chat; nonanggota hanya melihat ringkasan perekrutan |

Kapasitas mencakup ketua. Jumlah slot per peran tidak boleh melampaui sisa kapasitas. Jika ketentuan lomba mencantumkan batas anggota, kapasitas wajib mematuhinya. Lamaran menunggu tidak memakai slot. Ketika tim penuh, lamaran tersisa ditutup dengan alasan kapasitas penuh. Usulan awal: satu pengguna hanya menjadi anggota satu tim aktif per lomba; aturan ini perlu disepakati tim produk. Undangan anggota khusus berada di luar MVP.

Anggota dapat keluar dari tim dan kehilangan akses grup. Ketua harus memindahkan kepemimpinan ke anggota aktif sebelum keluar, atau membubarkan tim jika tidak ada anggota lain. Tim bubar menutup perekrutan dan membuat grup hanya-baca bagi mantan anggota yang berhak; akun ditangguhkan tetap tidak dapat mengaksesnya.

### 7.6 Komunikasi

| ID | Kebutuhan P1 | Kriteria penerimaan |
| --- | --- | --- |
| CHAT-01 | Chat personal | Hanya pasangan partner diterima yang dapat membuka dan mengirim pesan pada percakapan mereka; pengguna lain ditolak server |
| CHAT-02 | Chat grup tim | Grup dibuat bersama tim; hanya anggota aktif dapat mengirim atau membaca; anggota keluar tidak dapat mengambil riwayat melalui API |
| CHAT-03 | Pesan teks dan riwayat | Pesan menyimpan pengirim dan waktu; riwayat dipaginasi dan berurutan; status gagal/kirim tersedia; pengiriman ulang tidak membuat duplikat |
| CHAT-04 | Pemulihan koneksi | Setelah koneksi tersambung kembali, pesan tersimpan dapat dimuat; kegagalan pengiriman tidak ditampilkan sebagai berhasil |

MVP mendukung teks dengan batas usulan 2.000 karakter per pesan. Lampiran, panggilan, indikator mengetik, dan tanda baca pesan tidak diwajibkan. Pengiriman dapat memakai koneksi real-time atau polling selama memenuhi target latensi. Email transaksi akun tetap P1; notifikasi email pesan, permintaan, dan deadline adalah P2.

### 7.7 Keamanan dan moderasi

| ID | Kebutuhan P1 | Kriteria penerimaan |
| --- | --- | --- |
| MOD-01 | Lapor pengguna/konten | Member memilih kategori, alasan, dan objek laporan; laporan tersimpan dengan status dan referensi bukti yang relevan; pelapor menerima konfirmasi |
| MOD-02 | Blokir pengguna | Blokir menghentikan pesan personal, permintaan partner, dan interaksi perekrutan baru antar keduanya; profil dibatasi dari hasil pencarian masing-masing |
| MOD-03 | Tindak laporan | Admin meninjau antrean, mencatat keputusan, alasan, dan status; dapat menyembunyikan/menghapus konten atau menangguhkan akun |
| MOD-04 | Penangguhan | Sesi akun ditangguhkan dicabut; login dan tindakan privat ditolak; akun tidak muncul pada pencarian; pemulihan dilakukan admin dengan catatan |
| MOD-05 | Audit | Aktor, waktu, objek, alasan, dan perubahan status moderasi tercatat; pengguna biasa tidak dapat mengakses log admin |

Blokir tidak otomatis mengeluarkan anggota dari tim bersama. Pesan pengguna yang diblokir disembunyikan bagi pemblokir dalam grup bersama; antarmuka menjelaskan bahwa keduanya masih satu tim dan menyediakan keluar/lapor. Admin hanya memperoleh akses bukti pesan yang relevan dengan laporan melalui akses tercatat, bukan akses bebas ke semua percakapan.

## 8. Model status dan aturan konsistensi

| Objek | Status dan transisi utama |
| --- | --- |
| Akun | Belum terverifikasi → aktif → ditangguhkan; admin dapat memulihkan |
| Permintaan partner | Menunggu → diterima / ditolak / dibatalkan; blokir membatalkan permintaan yang masih menunggu |
| Lamaran tim | Menunggu → diterima / ditolak / dibatalkan / ditutup sistem |
| Publikasi lomba | Draf → ditinjau → tayang / ditolak; tayang → diarsipkan; status deadline terbuka/ditutup dihitung terpisah |
| Tim | Merekrut ↔ ditutup; penuh dihitung dari kapasitas; tim dapat menjadi bubar |
| Laporan | Baru → ditinjau → ditindak / ditutup tanpa tindakan |

Operasi penerimaan partner, penerimaan anggota, perubahan kepemimpinan, dan pembubaran tim harus konsisten dalam transaksi. Permintaan ulang dari jaringan tidak boleh membuat relasi, anggota, atau grup ganda. Semua keputusan menggunakan waktu server.

## 9. Kebutuhan nonfungsional

Angka pengujian tambahan berikut adalah target usulan untuk pilot, bukan hasil pengukuran yang sudah tercapai.

| Aspek | Persyaratan dan cara penerimaan |
| --- | --- |
| Performa halaman | LCP halaman utama ≤3 detik pada persentil ke-75; profil uji awal perangkat mobile kelas menengah, koneksi 10 Mbps dan RTT 100 ms; skenario dan data uji didokumentasikan |
| Pencarian | Respons server p95 ≤1 detik pada data uji 10.000 profil, 1.000 lomba, dan 100 pengguna serentak |
| Chat | Pesan diterima klien tujuan p95 ≤3 detik ketika kedua pengguna terhubung pada profil jaringan uji |
| Ketersediaan | Uptime bulanan ≥99%; dihitung dari pemeriksaan endpoint publik berkala; seluruh downtime layanan dihitung |
| Keamanan | HTTPS, hash password adaptif, validasi server, query berparameter, encoding keluaran, pembatasan login/pesan, serta pemeriksaan otorisasi objek |
| Sesi | Cookie sesi jika digunakan harus Secure dan HttpOnly dengan kebijakan SameSite sesuai alur; operasi berbasis cookie menerapkan perlindungan CSRF |
| Upload foto | Batasi ukuran usulan 2 MB, validasi tipe dan isi gambar, hilangkan metadata lokasi; file tidak boleh dieksekusi |
| Responsif | Alur utama berfungsi pada lebar 360, 768, dan 1440 piksel tanpa gulir horizontal |
| Aksesibilitas | Navigasi keyboard, fokus terlihat, label formulir, kontras teks memadai, dan kesalahan tidak bergantung pada warna |
| Bahasa | Bahasa Indonesia sebagai default; bahasa Inggris opsional sesudah MVP |
| Skalabilitas | Paginasi daftar, indeks filter utama, serta pemisahan penyimpanan media; kapasitas layanan dapat ditambah tanpa mengubah alur pengguna |
| Pemulihan | Backup harian; target awal RPO ≤24 jam dan RTO ≤8 jam; lakukan simulasi pemulihan sebelum rilis |
| Observabilitas | Catat error dan latensi tanpa token, password, atau isi chat; pantau kegagalan login, email, dan pengiriman pesan |

### 9.1 Privasi dan pengguna di bawah umur

- Minimalkan data; tidak meminta nomor identitas, alamat rumah, atau kartu pelajar pada MVP.
- Tampilkan pemberitahuan privasi dan tujuan penggunaan data sebelum registrasi selesai.
- Terapkan tampilan profil terbatas sebagai default; kontrol privasi tambahan tetap P2.
- Sediakan jalur permintaan akses, koreksi, dan penghapusan akun/data, yang dapat diproses admin pada MVP.
- Simpan waktu pada UTC dan tampilkan zona waktu secara eksplisit; jangan memublikasikan jadwal rinci kepada guest.
- Sebelum peluncuran publik, tetapkan batas usia, mekanisme persetujuan yang diperlukan, retensi chat/laporan/backup, dan prosedur penanganan insiden melalui peninjauan kepatuhan yang sesuai. Dokumen ini tidak menyatakan bahwa kepatuhan hukum telah terpenuhi.

## 10. Entitas data utama

| Entitas | Data inti dan hubungan |
| --- | --- |
| User | Email unik, metode autentikasi, peran, status, waktu verifikasi |
| Profile | Satu profil per user; nama, foto, institusi, jurusan/kelas, kota, mode |
| Topic dan UserTopic | Katalog bidang, bidang dikuasai/ingin dipelajari, level per pengguna |
| Availability | User, hari, jam mulai/selesai, zona waktu |
| PartnerRequest dan Partnership | Pengirim, penerima, status; relasi partner unik per pasangan |
| Competition | Detail, biaya, deadline, zona waktu, sumber, tautan, status publikasi, pemeriksa |
| Team dan TeamRole | Lomba, ketua, kapasitas, status; peran yang dibutuhkan dan slot |
| TeamMembership dan TeamApplication | User, tim, peran, status, waktu keputusan |
| Conversation dan Message | Jenis personal/grup, peserta yang berhak, pengirim, isi, waktu, identitas pesan untuk deduplikasi |
| Block | Pemblokir, pengguna diblokir, waktu; pasangan terarah unik |
| Report dan ModerationAction | Pelapor, objek, alasan, bukti, status, admin, tindakan dan waktu |

Penghapusan akun tidak boleh merusak integritas tim atau laporan. Data publik dihapus atau dianonimkan sesuai kebijakan yang ditetapkan; bukti moderasi dan backup mengikuti masa retensi yang disepakati sebelum rilis.

## 11. Struktur halaman MVP

1. Landing page dan pengenalan layanan.
2. Registrasi, login, verifikasi email, dan reset password.
3. Onboarding serta edit profil.
4. Pencarian partner dan detail profil.
5. Aktivitas permintaan partner dan lamaran tim.
6. Daftar lomba dan detail lomba.
7. Pencarian tim, formulir buat/edit tim, serta ringkasan tim.
8. Kotak percakapan, chat personal, dan chat grup.
9. Formulir laporan dan daftar pengguna diblokir.
10. Panel admin untuk lomba, pengguna, laporan, dan catatan tindakan.

Setiap halaman data menyediakan kondisi memuat, kosong, gagal, dan akses ditolak. Formulir mempertahankan input ketika validasi gagal serta menandai bidang yang perlu diperbaiki.

## 12. Dependensi dan risiko

| Risiko/dependensi | Dampak | Penanganan |
| --- | --- | --- |
| Komunitas awal kecil | Hasil pencarian kosong | Pilot pada komunitas terbatas; kurasi bidang dan lomba awal |
| Klaim kemampuan berlebihan | Partner tidak sesuai | Label kemampuan mandiri dan percakapan awal; portofolio P2 |
| Informasi lomba usang | Deadline atau syarat keliru | Sumber wajib, waktu pembaruan, peninjauan admin, status ditutup otomatis |
| Spam/pelecehan | Pengguna berhenti memakai layanan | Verifikasi email, pembatasan tindakan, chat berdasarkan relasi, blokir dan moderasi |
| OAuth dan layanan email | Login/verifikasi terganggu | Tangani kegagalan, retry terbatas, pemantauan, dan konfigurasi domain sebelum pilot |
| Anggota diterima bersamaan | Tim melebihi kapasitas | Transaksi dan penguncian atau kontrol konkurensi pada penerimaan |
| Pengguna di bawah umur | Persetujuan/privasi belum siap | Selesaikan keputusan usia dan proses privasi sebelum peluncuran publik |

## 13. Rencana rilis berbasis hasil

Durasi dan tanggal ditentukan setelah kapasitas tim diketahui.

| Tahap | Hasil yang harus tersedia |
| --- | --- |
| Perancangan | Alur, wireframe, model data, aturan akses, keputusan terbuka disepakati |
| Fondasi | Akun, profil, katalog bidang, panel admin dasar |
| Penemuan | Pencarian partner, permintaan, daftar/detail lomba dan filter |
| Pembentukan tim | Perekrutan, lamaran, keputusan, kapasitas, ringkasan tim |
| Kolaborasi dan keamanan | Chat, blokir, laporan, audit, penangguhan |
| Pilot dan rilis | Pengujian menyeluruh, seed lomba, pengukuran performa, pemulihan backup, tinjauan privasi |

Setelah MVP stabil, P2 mencakup rekomendasi berbasis minat/jadwal, portofolio, privasi tambahan, bookmark dan pengingat, pengajuan penyelenggara, notifikasi, penjadwalan sesi, riwayat kolaborasi, dan statistik admin. P3 mencakup verifikasi pelajar, rating, forum, dan gamifikasi.

## 14. Skenario penerimaan lintas fitur

| Skenario | Hasil yang diharapkan |
| --- | --- |
| Pengguna baru menyelesaikan onboarding | Dapat ditemukan member lain dan mengirim permintaan setelah email terverifikasi |
| Permintaan partner diterima dua kali akibat retry | Hanya satu relasi dan satu percakapan dibuat |
| Dua lamaran diterima untuk satu slot tersisa | Hanya satu berhasil; lainnya mendapat alasan kapasitas penuh |
| Pengguna membuka URL chat tim lain | Server menolak tanpa membocorkan pesan |
| Pengguna memblokir partner | Pesan personal dan permintaan baru antar keduanya berhenti |
| Anggota keluar dari tim | Tidak dapat membaca/mengirim pesan grup melalui UI maupun API |
| Deadline terlewati saat formulir lamaran terbuka | Pengiriman ditolak oleh validasi server dengan alasan deadline |
| Admin menangguhkan akun yang sedang login | Sesi dicabut dan tindakan berikutnya ditolak |
| Token reset digunakan ulang | Ditolak; password tidak berubah lagi |
| Layanan chat terputus lalu pulih | Pesan gagal ditandai, riwayat pulih, retry tidak menggandakan pesan |

## 15. Definition of Done MVP

- Semua kebutuhan P1 dan skenario penerimaan disetujui melalui pengujian.
- Alur partner dan tim berhasil dari registrasi hingga chat dengan akun berbeda.
- Otorisasi diuji untuk guest, member, ketua, admin, serta akun ditangguhkan.
- Tidak ada cacat kritis yang menyebabkan kebocoran data, kehilangan pesan tersimpan, atau kapasitas tim berlebih.
- Pengukuran performa, responsivitas, pemulihan backup, serta penanganan koneksi gagal terdokumentasi.
- Konfigurasi OAuth, email, HTTPS, pemantauan, seed informasi lomba, dan penanggung jawab moderasi tersedia.
- Kebijakan privasi, retensi, usia, serta alur permintaan penghapusan ditetapkan sebelum peluncuran publik.

## 16. Keputusan yang perlu difinalkan tim

| Keputusan | Usulan awal / kebutuhan |
| --- | --- |
| Nama produk | TeamUp Belajar sebagai nama kerja |
| Batas usia dan persetujuan | Ditentukan sebelum registrasi publik dibuka |
| Keanggotaan lintas tim pada lomba sama | Maksimal satu tim aktif per pengguna per lomba |
| Batas tindakan anti-spam | Tetapkan jumlah permintaan, lamaran, dan pesan berdasarkan pilot |
| Retensi data dan penghapusan | Tetapkan masa simpan pesan, bukti laporan, log, dan backup |
| Target bisnis pilot | Tetapkan angka aktivasi, penerimaan, dan retensi setelah baseline tersedia |
| Kapasitas operasional | Tentukan admin, jam pemantauan, dan target waktu respons laporan |
| Jadwal dan stack | Sesuaikan kapasitas tim, anggaran, serta layanan autentikasi/chat yang dipilih |

Perubahan terhadap cakupan P1, aturan akses, atau penggunaan data harus memperbarui PRD beserta kriteria penerimaannya sebelum implementasi terkait dimulai.


## Keputusan pengguna — 13 November 2026

Nama TeamUp, frontend interaktif dengan data demo untuk seluruh halaman P1, satu tim aktif per pengguna per lomba, password contoh minimal 8 karakter, pesan 2.000 karakter, dan foto 2 MB telah disetujui. Logo teks dan kontak dummy digunakan sementara. Detail cakupan, penerimaan frontend, dan batas integrasi: [Implementation_Decisions.md](Implementation_Decisions.md). Ketentuan usulan lain tetap terbuka.

### Halaman informasi About Us

Revisi copy terbaru: atas permintaan pengguna, hapus label “Tautan sementara” pada kartu SRS/User Manual. Ini menggantikan ketentuan konteks label pada catatan sebelumnya; URL dummy tetap didokumentasikan secara teknis sampai link asli tersedia.

Tambahan dokumen, 14 November 2026: di atas bagian anggota tampilkan headline “Dokumen Website” dengan dua kartu horizontal SRS dan User Manual. Kartu menaut ke Google Drive; pengguna meminta URL dummy terlebih dahulu, sehingga tampilkan konteks tautan sementara sampai URL dokumen asli tersedia. Ini hanya konten publik, tanpa integrasi atau pengambilan berkas Drive.

Pembaruan 14 November 2026: pengguna memberikan data lengkap 10 anggota untuk ditampilkan pada About Us dan meminta seluruh foto dihapus. Kriteria aktif: tepat 10 kartu teks berisi nama, kelas, NIM, NID, serta kelompok sesuai data pengguna; NIM/NID disimpan sebagai string agar nol awal tetap ada. Headline “Kelompok 20 Fortran” dan subheader “Anggota:” tetap. Tidak ada foto atau placeholder foto. Ini menggantikan persetujuan placeholder sebelumnya dan tidak mengubah data profil member.

Pengguna menambahkan section About Us sebelum footer landing dan halaman publik `/aboutus`. Kriteria penerimaan: deskripsi singkat aplikasi serta tombol menuju halaman; halaman memuat deskripsi, headline “Kelompok 20 Fortran”, subheader “Anggota:”, dan tepat 10 profil tim berisi foto/nama/kelas/NIM/NID/kelompok. Pengguna menyetujui placeholder terlebih dahulu. Identitas ini merupakan konten tim pengembang yang terpisah dari profil member; tidak menambah pengumpulan NIM/NID pada registrasi. Tidak menebak data pribadi atau arti NID. Halaman mengikuti light/dark dan layout responsif aktif. Aturan akses/domain P1 lain tetap berlaku.
