from pathlib import Path
from html import escape
import json
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'outputs' / 'Panduan_Pengujian_TeamUp.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(TTFont('Guide', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('GuideBold', 'C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Guide', normal='Guide', bold='GuideBold', italic='Guide', boldItalic='GuideBold')
NAVY = HexColor('#000321')
INK = HexColor('#263348')
MUTED = HexColor('#596579')
LINE = HexColor('#DCE2EA')
PALE = HexColor('#F3F6FA')
styles = getSampleStyleSheet()
for name, size, leading, color in [('Body',10,14,INK), ('Small',8.4,11.5,MUTED), ('Heading',22,28,NAVY), ('Case',12,16,NAVY), ('Label',9,12,MUTED)]:
    styles.add(ParagraphStyle(name, fontName='GuideBold' if name in ['Heading','Case'] else 'Guide', fontSize=size, leading=leading, textColor=color, spaceAfter=6))
styles.add(ParagraphStyle('Cover',fontName='GuideBold',fontSize=34,leading=40,textColor=NAVY,spaceAfter=16))
story=[]
case_ids=[]
def p(text, style='Body'):
    return Paragraph(text, styles[style])
def add(text, style='Body'):
    story.append(p(text,style))
def gap(n=8): story.append(Spacer(1,n))
def table(rows,widths,header=True):
    data=[[p(str(c),'Small' if i or not header else 'Body') for c in row] for i,row in enumerate(rows)]
    t=Table(data,colWidths=widths,hAlign='LEFT',repeatRows=1 if header else 0)
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,0),(-1,-1),.5,LINE),('BACKGROUND',(0,0),(-1,0),PALE if header else white)]))
    story.append(t)
def page(number,title,subtitle):
    if story: story.append(PageBreak())
    add(f'{number:02d} / PANDUAN PENGUJIAN','Label')
    add(title,'Heading')
    add(subtitle,'Small')
    gap(8)
def note(title,text):
    t=Table([[p(f'<b>{title}</b><br/>{text}')]],colWidths=[491])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('BOX',(0,0),(-1,-1),.5,LINE),('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),9)]))
    story.append(t)
    gap()
def case(id,title,ref,pre,steps,expected):
    case_ids.append(id)
    content=[p(f'{id}  {title}','Case'),p(f'<b>Acuan:</b> {ref}  |  <b>Kondisi awal:</b> {pre}','Small')]
    for i,s in enumerate(steps,1): content.append(p(f'<b>{i}.</b> {s}'))
    content += [p('<b>Hasil yang diharapkan:</b> '+expected),p('Status: __________   Temuan/bukti: ______________________________','Small'),Spacer(1,10)]
    story.append(KeepTogether(content))

page(1,'Panduan pengujian\nTeamUp','Versi 1.0 | 13 November 2026 | Acuan UI visual 1.2 | Bahasa Indonesia')
add('Uji alur kolaborasi dari akun hingga percakapan, lalu catat hasilnya secara konsisten. Panduan ini ditujukan bagi tim produk, desain, QA, dan pengembang.')
note('Lingkup saat ini','Frontend interaktif dengan data lokal. Tampilan tidak memakai label demo, tetapi akun, verifikasi, chat, dan keputusan tetap diproses pada browser. Hasil uji ini tidak membuktikan keamanan server atau kesiapan produksi.')
table([['Paket','Skenario','Perkiraan waktu'],['Cek cepat','TC-01, 02, 07, 08, 09, 13, 19, 24, 31','20-30 menit'],['Uji menyeluruh','TC-01 sampai TC-33, berurutan','90-150 menit'],['Uji ulang temuan','Kasus gagal + alur yang terdampak','Sesuai temuan']],[110,270,111])
gap(14)
add('Cara menggunakan panduan','Case')
add('1. Siapkan lingkungan dan data awal di halaman 2. Gunakan profil browser khusus pengujian.')
add('2. Jalankan kasus sesuai urutan. Kasus yang bergantung pada hasil sebelumnya menyebutkan ID prasyarat. Cek cepat memakai data awal yang sudah tersedia.')
add('3. Isi satu status pada setiap kasus: <b>Lulus</b>, <b>Gagal</b>, <b>Terblokir</b>, atau <b>Belum diuji</b>. Simpan bukti sebelum mengatur ulang data.')
add('4. Jalankan kasus blokir, keluar tim, pembubaran, dan penangguhan hanya pada data pengujian. Ringkasan hasil dan daftar integrasi tertunda ada di halaman 14.')
gap(12)
table([['Identitas sesi','Isi oleh penguji'],['Nama penguji / tanggal','________________________________________'],['Versi build / commit yang diuji','________________________________________'],['Browser / perangkat / ukuran layar','________________________________________'],['Alamat situs (origin)','________________________________________']],[180,311])
gap()
add('Perkiraan waktu adalah panduan perencanaan, bukan hasil pengukuran performa aplikasi. Kasus di dokumen ini adalah instruksi uji; statusnya belum dinyatakan lulus.','Small')

page(2,'Persiapan dan akun uji','Satu perangkat, satu profil browser, satu alamat situs untuk satu rangkaian uji.')
add('<b>Pengembang:</b> dari folder proyek jalankan <b>npm install</b> bila dependensi belum ada, lalu <b>npm run dev</b>. Gunakan alamat yang muncul di terminal, umumnya http://127.0.0.1:3000. Jika port berubah, catat alamat yang benar.')
add('<b>Penguji:</b> gunakan profil browser khusus uji. Penguji pada browser/perangkat berbeda memiliki data terpisah, meskipun membuka server yang sama. Jangan berpindah antara localhost dan 127.0.0.1 di tengah pengujian.')
note('Berganti akun untuk memeriksa dua sisi alur','Klik ikon Keluar di kanan atas, lalu Masuk dengan email di bawah. Pada mobile: buka menu tiga garis, lalu Keluar dari akun. Password uji apa pun minimal 8 karakter, misalnya <b>teamup123</b>. Jangan memakai password asli. Jangan login sebagai dua akun pada dua tab bersamaan: sesi pada origin yang sama ikut tersinkronisasi.')
table([['Akun','Email','Kondisi data awal'],['Alya','alya@teamup.test','Partner Bima; ketua Beyond the Bytes'],['Bima','bima@teamup.test','Partner Alya; ketua Pixel Pioneers'],['Citra','citra@teamup.test','Permintaan ke Alya; ketua Insight Collective'],['Dimas','dimas@teamup.test','Anggota Beyond the Bytes'],['Nadia','nadia@teamup.test','Anggota Pixel Pioneers'],['Rafi','rafi@teamup.test','Lamaran menunggu ke Beyond the Bytes'],['Pengguna Baru','baru@teamup.test','Belum terverifikasi; profil belum lengkap'],['Admin','admin@teamup.test','Kelola lomba, pengguna, laporan, audit']],[72,151,268])
gap(10)
add('<b>Data awal bersih:</b> profil browser baru akan memuat data awal. Jika mengulang pada profil uji yang sama, simpan bukti dahulu; buka DevTools &gt; Application/Storage &gt; Local Storage untuk origin uji, hapus hanya <b>teamup-demo-v1</b> dan muat ulang. Ini menghapus seluruh perubahan lokal pengujian. Hapus <b>teamup-theme</b> juga hanya untuk menguji default light mode.')
add('<b>Tanggal:</b> data awal dibuat pada 13 November 2026. Bila lomba terbuka sudah melewati deadline saat diuji, admin perlu mengubah deadline ke masa depan pada data uji. Jangan mengubah jam sistem. Tidak ada pendaftaran atau bantuan eksternal nyata yang diuji.','Small')

page(3,'Beranda dan akses awal','TC-01 sampai TC-03 | Mulai sebagai pengunjung dengan data awal bersih.')
case('TC-01','Beranda dan pintu masuk','Desain 1.2, navigasi P1','Belum login.',[
'Buka halaman /. Periksa logo teks TeamUp, heading, underline melengkung hanya pada "lebih jauh", dan dua tombol utama.',
'Pilih tab Partner belajar lalu Tim lomba pada panel preview. Buka satu profil atau tim, lalu kembali ke beranda.',
'Klik Cari partner belajar dan Temukan tim lomba. Periksa tujuan masing-masing, lalu kembali.'
],'Tab mengubah isi; tautan membuka konteks yang sesuai. Partner dapat meminta login, sedangkan ringkasan tim tetap dapat dibaca. Tidak ada tombol tanpa respons atau label demo/contoh pada copy antarmuka.')
case('TC-02','Light default dan switch tema','Desain 1.2, aksesibilitas','Pilihan tema belum tersimpan.',[
'Buka /. Pastikan latar putih dan teks/tombol navy gelap.',
'Klik switch tema di navbar. Buka Lomba, lalu muat ulang halaman.',
'Kembalikan ke light mode. Periksa tombol, input, badge, menu, dan dialog pada kedua tema.'
],'Kunjungan pertama memakai light mode. Switch mengubah seluruh halaman; pilihan bertahan sesudah navigasi dan reload. Tidak ada teks atau kontrol yang hilang akibat warna.')
case('TC-03','Akses pengunjung dan logout','AUTH-02, PROF-04, MOD-05','Belum login.',[
'Buka /profil, /aktivitas, dan /pesan. Ikuti ajakan Masuk pada salah satunya tanpa mengirim tindakan otomatis.',
'Buka /lomba dan satu profil publik melalui tautan preview.',
'Login sebagai Rafi, lalu Keluar. Buka kembali /profil. Coba /admin/lomba sebagai Rafi pada sesi terpisah.'
],'Halaman privat meminta login; profil publik tidak menampilkan email/jadwal rinci. Logout menghilangkan akses privat. Member biasa ditolak dari admin. Ini pemeriksaan UI lokal, bukan bukti proteksi API.')

page(4,'Akun dan profil','TC-04 sampai TC-06 | Gunakan data fiktif untuk akun yang dibuat sendiri.')
case('TC-04','Daftar dan validasi form','AUTH-01, AUTH-02','Pengunjung; email QA belum dipakai.',[
'Buka /daftar. Kirim form kosong; coba email tidak valid dan password kurang dari 8 karakter.',
'Isi nama "Penguji QA", email unik seperti qa01@teamup.test, dan teamup123. Baca tautan privasi, lalu buat akun.',
'Jika ingin menguji duplikasi, logout dan daftar lagi dengan email yang sama.'
],'Form menahan input tidak valid dan menunjukkan alasan. Akun lokal baru belum terverifikasi. Email duplikat ditolak. Jangan menilai login password salah sebagai uji keamanan karena password belum diverifikasi backend.')
case('TC-05','Verifikasi lokal dan kelengkapan profil','AUTH-04, PROF-01-03','Akun TC-04 atau Pengguna Baru.',[
'Sebelum verifikasi/profil lengkap, coba kirim permintaan partner atau membuat tim. Catat alasan penolakan.',
'Buka /verifikasi dan pilih Verifikasi email. Ini mengubah status lokal; tidak membuktikan kepemilikan email.',
'Lengkapi Identitas: nama, institusi, jurusan/kelas, kota. Pada Bidang &amp; level pilih Web Development/Pemula. Pada Jadwal belajar pilih Online, satu hari, 19.00-20.00, Asia/Jakarta. Simpan, lalu reload.'
],'Aksi kolaborasi terkunci sebelum syarat terpenuhi. Setelah data lengkap tersimpan, profil bertahan setelah reload dan akun dapat memulai tindakan lokal yang diizinkan.')
case('TC-06','Google, reset, dan kirim ulang','AUTH-03-05','Pengunjung; Pengguna Baru untuk kirim ulang.',[
'Pada /masuk, klik Lanjutkan dengan Google lalu Kembali. Pastikan tidak otomatis masuk sebagai Alya.',
'Buka Lupa password?, isi qa01@teamup.test, lalu Minta petunjuk reset.',
'Sebagai Pengguna Baru yang belum diverifikasi, pilih Kirim ulang email dan periksa cooldown 30 detik.'
],'Google menjelaskan belum terhubung; reset/kirim ulang menjelaskan pengiriman belum tersedia. Tidak menunggu email masuk atau menganggap reset selesai. Cooldown menahan klik berulang. Integrasi nyata diberi status terblokir integrasi, bukan lulus.')

page(5,'Cari partner sampai chat','TC-07 sampai TC-09 | Login bergantian pada profil browser dan origin yang sama.')
case('TC-07','Filter partner, reset, dan hasil kosong','PART-01, PROF-02','Login Rafi; data awal.',[
'Buka Cari Partner. Gabungkan bidang UI/UX Design, level Mahir, dan kota Bandung, lalu Terapkan filter.',
'Periksa bahwa hasil memuat Nadia dan sesuai semua filter aktif. Coba mode, hari, serta interval waktu yang beririsan dengan profil hasil.',
'Gunakan kota "KotaTidakAdaQA" untuk memunculkan hasil kosong. Reset semua filter dan coba halaman hasil berikutnya bila tersedia.'
],'Filter digabungkan, hasil kosong berbeda dari error, reset memulihkan daftar, dan pagination berfungsi. Level diberi konteks penilaian mandiri; tidak ada skor kecocokan buatan.')
case('TC-08','Kirim dan terima permintaan','PART-02-04','Rafi dan Nadia belum memiliki permintaan aktif.',[
'Sebagai Rafi, buka profil Nadia dari hasil pencarian. Pilih Ajak belajar.',
'Buka Aktivitas &gt; Permintaan partner &gt; Terkirim. Periksa status Menunggu; kembali ke profil Nadia dan pastikan tidak membuat permintaan aktif kedua.',
'Logout, login Nadia. Buka Aktivitas &gt; Permintaan partner &gt; Masuk. Terima permintaan Rafi dan selesaikan konfirmasi bila muncul.'
],'Satu permintaan aktif terbentuk. Nadia dapat memutuskan; status menjadi Diterima dan satu chat personal tersedia. Pengirim tidak mendapat kontrol keputusan penerima.')
case('TC-09','Chat personal dan riwayat lokal','CHAT-01, CHAT-03','TC-08 selesai. Untuk cek cepat, gunakan Alya dan Bima.',[
'Buka chat partner yang sudah diterima. Kirim "QA-CHAT-01: pesan dari pengirim". Coba pesan kosong dan teks dengan Shift+Enter.',
'Reload. Pastikan pesan tersimpan satu kali dengan pengirim, waktu, dan status yang sesuai.',
'Ganti login ke partner penerima pada browser yang sama. Buka percakapan dan balas "QA-CHAT-02: balasan".'
],'Pesan kosong tidak terkirim, Shift+Enter membuat baris baru, riwayat lokal bertahan dan balasan terlihat ketika berganti akun. Ini bukan uji real-time antarperangkat atau konfirmasi server.')

page(6,'Status partner dan validasi profil','TC-10 sampai TC-12 | Gunakan pasangan yang berbeda agar hasil tidak saling menimpa.')
case('TC-10','Batalkan dan tolak permintaan','PART-03-04','Login Rafi; Dimas/Citra belum memiliki permintaan aktif dengannya.',[
'Kirim permintaan Rafi ke Dimas. Pada Aktivitas &gt; Terkirim pilih Batalkan, lalu konfirmasi.',
'Kirim permintaan baru dari Rafi ke Citra. Ganti login Citra; buka permintaan Masuk dan Tolak.',
'Kembali sebagai Rafi dan periksa kedua status melalui filter Aktivitas.'
],'Permintaan ke Dimas berstatus Dibatalkan; ke Citra berstatus Ditolak. Tidak ada chat personal baru dari dua permintaan ini. Tindakan hanya berlaku pada permintaan Menunggu.')
case('TC-11','Validasi bidang dan jadwal','PROF-01-03','Akun QA buatan TC-04; jangan mengubah profil seed utama.',[
'Buka Profil, kosongkan semua bidang belajar, lanjut ke jadwal lalu simpan.',
'Tambahkan kembali satu bidang. Buat interval 20.00-19.00, lalu simpan.',
'Perbaiki menjadi 19.00-20.00. Tambah interval kedua, ubah zona, hapus interval tambahan, lalu simpan dan reload.'
],'Bidang kosong dan interval terbalik ditolak dengan alasan; input lain tidak hilang. Jadwal valid tersimpan. Jadwal lintas tengah malam perlu dibagi dua; normalisasi server belum diuji di sini.')
case('TC-12','Foto opsional dan profil terbatas','PROF-01, PROF-04','Akun QA; sediakan JPG/PNG/WebP uji dan berkas non-gambar.',[
'Coba pilih berkas non-gambar atau gambar lebih dari 2 MB pada Profil.',
'Unggah gambar uji yang valid dan kecil, simpan, lalu reload. Jangan memakai foto pribadi.',
'Catat URL profil akun QA, logout, dan buka URL tersebut sebagai pengunjung.'
],'Berkas tidak valid ditolak; foto valid tampil dan tersimpan lokal. Profil tetap dapat lengkap tanpa foto. Pengunjung hanya mendapat profil terbatas tanpa email/jadwal rinci; ini bukan pemeriksaan payload atau upload server.')

page(7,'Lomba dan deadline','TC-13 sampai TC-15 | Data awal memuat lomba terbuka dan satu lomba lewat deadline.')
case('TC-13','Daftar dan kombinasi filter lomba','COMP-01','Pengunjung atau member.',[
'Buka Lomba. Pilih kategori UI/UX Design, tingkat Nasional, biaya Gratis, dan rentang deadline yang mencakup 20 Desember 2026.',
'Periksa Innovate UI/UX Challenge 2026 sesuai filter. Ubah filter agar tidak ada hasil.',
'Reset filter. Periksa daftar kembali muncul dan pagination dapat digunakan bila ada lebih banyak hasil.'
],'Hanya lomba Tayang tampil publik; grup filter aktif digabungkan. Hasil kosong menampilkan penjelasan, bukan error jaringan. Bila tanggal uji melewati data awal, sesuaikan rentang/deadline data uji terlebih dahulu.')
case('TC-14','Kelengkapan detail dan sumber','COMP-02','Buka Innovate UI/UX Challenge 2026.',[
'Periksa judul, penyelenggara, kategori/tingkat, deskripsi, syarat, hadiah, biaya, dan kapasitas tim.',
'Bedakan deadline pendaftaran dari tanggal pelaksanaan. Pastikan waktu menampilkan zona WIB.',
'Periksa tautan sumber/pendaftaran membuka tab baru dengan konteks meninggalkan TeamUp. Jangan mengisi formulir atau membayar pada situs eksternal.'
],'Informasi penting terbaca dan verifikasi dijelaskan sebagai pemeriksaan informasi. Sumber awal memakai example.com: catat navigasinya saja; validitas penyelenggara/pendaftaran nyata belum dapat diterima dari data ini.')
case('TC-15','Deadline lewat mengunci tindakan','COMP-04, TEAM-01, TEAM-03','Login member lengkap; Student Business Plan sudah lewat deadline.',[
'Buka detail Student Business Plan dan periksa label Ditutup.',
'Coba Buat tim dari detail atau /tim/buat dengan lomba tersebut. Periksa pilihan lomba dan pesan penolakan.',
'Bandingkan dengan satu lomba yang deadline-nya masih di masa depan.'
],'Lomba tayang yang lewat deadline tetap terbaca; pembuatan tim/lamaran baru terkunci. Kasus deadline lewat ketika form sedang terbuka perlu pemeriksaan server terpisah; jam browser lokal tidak membuktikannya.')

page(8,'Membuat dan mengelola tim','TC-16 sampai TC-18 | Gunakan akun QA dari TC-04 yang sudah lengkap.')
case('TC-16','Buat tim dan otomatis menjadi ketua','TEAM-01, TEAM-06','Akun QA belum bergabung tim pada lomba UI/UX.',[
'Buka /tim/buat. Pilih Innovate UI/UX Challenge 2026, nama "Tim QA [inisial]", deskripsi, dan kapasitas total 3.',
'Tambahkan peran UI/UX Designer dengan 2 slot. Simpan.',
'Catat URL tim. Periksa nama ketua, daftar anggota, kapasitas 1 dari 3, peran terbuka, dan Buka chat grup.'
],'Pembuat menjadi ketua sekaligus anggota pertama; kapasitas termasuk ketua. Tim dan grup terbentuk satu kali. Tautan detail dipakai pada kasus berikutnya.')
case('TC-17','Edit kapasitas dan batas slot','TEAM-01, TEAM-05','Ketua tim TC-16.',[
'Buka Edit tim. Coba kapasitas di bawah jumlah anggota atau di atas batas lomba (UI/UX maksimal 4).',
'Coba total slot peran melebihi kapasitas tersisa; periksa validasi saat menyimpan.',
'Perbaiki kapasitas 3 dan total slot 2. Ubah deskripsi, simpan, lalu reload detail.'
],'Input yang melanggar kapasitas/slot ditolak tanpa menghilangkan data form. Perubahan valid tersimpan. Jika kontrol membatasi angka sebelum submit, catat batas yang terlihat sebagai hasil uji.')
case('TC-18','Tutup dan buka perekrutan','TEAM-02, TEAM-05','Tim TC-16 masih terbuka dan belum penuh.',[
'Sebagai ketua, pilih Tutup perekrutan pada detail tim.',
'Ganti login Dimas, buka URL tim, dan coba mengajukan lamaran. Periksa juga filter peran/lomba di Cari Tim.',
'Kembali ke ketua, Buka perekrutan. Login Dimas lagi dan pastikan tindakan lamaran tersedia tanpa mengirimnya.'
],'Status Ditutup mengunci lamaran baru; dibuka kembali mengaktifkannya selama deadline/kapasitas mengizinkan. Nonketua tidak mendapat kontrol pengelolaan tim.')

page(9,'Lamaran dan batas anggota','TC-19 sampai TC-21 | Gunakan Beyond the Bytes, terpisah dari Tim QA.')
case('TC-19','Terima lamaran sampai chat grup','TEAM-03-04, CHAT-02','Data awal: Rafi menunggu di Beyond the Bytes; anggota 2 dari 4.',[
'Sebagai Rafi, buka Aktivitas &gt; Lamaran tim &gt; Terkirim; periksa lamaran Menunggu.',
'Login Alya. Pada Lamaran tim &gt; Masuk, terima Rafi.',
'Kembali sebagai Rafi. Buka Beyond the Bytes dan Buka chat grup. Kirim "QA-GRUP-01" lalu reload.'
],'Rafi diterima satu kali, anggota menjadi 3 dari 4, dan chat grup dapat dibaca/dikirim oleh Rafi. Untuk cek cepat kasus ini dapat dijalankan langsung dari data awal.')
case('TC-20','Batalkan dan tolak lamaran','TEAM-03-04','Rafi sudah diterima TC-19; Citra belum menjadi anggota Pixel Pioneers.',[
'Rafi melamar Insight Collective untuk Data for Good Competition. Periksa Menunggu lalu batalkan dari Aktivitas Terkirim.',
'Citra melamar Pixel Pioneers dengan peran tersedia dan pesan singkat.',
'Login Bima, buka lamaran Masuk untuk Pixel Pioneers, lalu tolak Citra. Kembali sebagai Citra untuk memeriksa status.'
],'Lamaran Rafi Dibatalkan, lamaran Citra Ditolak. Tidak ada anggota atau akses grup baru dari kedua tindakan. Bila ada pembatasan bidang dari input UI, gunakan peran yang benar-benar tersedia.')
case('TC-21','Slot terakhir dan lamaran tersisa','TEAM-04-05','TC-19 selesai: Beyond the Bytes 3 dari 4; deadline terbuka.',[
'Nadia dan Citra bergantian melamar Beyond the Bytes pada peran yang tersedia; keduanya harus Menunggu sebelum ketua memutuskan.',
'Login Alya dan terima Nadia. Periksa anggota menjadi 4 dari 4 dan status Penuh.',
'Periksa lamaran Citra ditutup sistem dengan alasan. Sebagai Bima, coba melamar tim penuh.'
],'Anggota tidak melampaui 4; satu tempat terakhir terpakai satu orang dan lamaran lain ditutup. Ini skenario keputusan berurutan; race condition dua request server serentak belum diuji.')

page(10,'Akses dan siklus anggota','TC-22 sampai TC-24 | Kasus ini mengubah keanggotaan; simpan bukti sebelum melanjutkan.')
case('TC-22','Keluar tim mencabut akses UI','TEAM-06, CHAT-02','Dimas anggota Beyond the Bytes.',[
'Sebagai Dimas, baca grup /pesan/team:byte dan catat satu pesan yang terlihat.',
'Buka detail tim, pilih Keluar tim, lalu konfirmasi.',
'Buka lagi URL grup langsung dan reload. Periksa tombol kirim serta riwayatnya.'
],'Dimas tidak lagi tercantum sebagai anggota dan akses baca/kirim grup ditolak di UI. Riwayat tidak boleh tampil sebagai percakapan yang masih dapat digunakan. Penolakan API belum dapat diuji karena belum ada backend.')
case('TC-23','Transfer ketua dan bubarkan tim','TEAM-06, CHAT-02','Pixel Pioneers masih berisi Bima dan Nadia.',[
'Login Bima, buka Pixel Pioneers. Gunakan kontrol pemindahan ketua pada anggota Nadia, lalu konfirmasi.',
'Pastikan Nadia menjadi ketua; Bima kini dapat Keluar tim. Logout lalu masuk Nadia.',
'Sebagai Nadia, bubarkan Pixel Pioneers. Buka riwayat grup dan coba menulis pesan.'
],'Ketua berpindah hanya ke anggota aktif. Mantan ketua kehilangan akses setelah keluar. Tim bubar menutup perekrutan; anggota yang masih berhak hanya dapat membaca riwayat tanpa mengirim pesan.')
case('TC-24','Batas akses chat dan teks','CHAT-01-03','Login Alya; untuk cek cepat gunakan data awal.',[
'Buka Pesan: chat personal Bima dan grup Beyond the Bytes harus tersedia. Coba kirim pesan hanya berisi spasi.',
'Buka langsung /pesan/team:insight dan /pesan/personal:bima:citra sebagai Alya.',
'Kembali ke chat yang diizinkan, coba Enter untuk kirim dan Shift+Enter untuk baris baru. Periksa batas 2.000 karakter pada komposer.'
],'Percakapan yang bukan milik Alya ditolak tanpa isi pesan. Pesan kosong tidak terkirim dan batas panjang ditegakkan. Jangan menyatakan pemeriksaan ini membuktikan otorisasi server.')

page(11,'Blokir dan laporan','TC-25 sampai TC-27 | Gunakan data uji saja; selesaikan alur partner/tim sebelum blokir.')
case('TC-25','Blokir personal dan buka blokir','MOD-02, PART-02, CHAT-01','Alya dan Bima adalah partner awal.',[
'Login Alya, buka profil Bima atau chat personalnya, pilih Blokir dan konfirmasi.',
'Coba kirim pesan personal; cari Bima kembali melalui Cari Partner. Ganti Bima dan periksa interaksi dengan Alya.',
'Sebagai Alya, buka /diblokir dan Buka blokir Bima.'
],'Pesan personal dan interaksi baru terhalang saat diblokir; hasil pencarian kedua pihak dibatasi. Membuka blokir tidak otomatis mengirim ulang permintaan yang pernah dibatalkan.')
case('TC-26','Blokir dalam grup bersama','MOD-02, CHAT-02','TC-19 selesai: Alya dan Rafi masih anggota Beyond the Bytes.',[
'Rafi kirim "QA-BLOCK-GRUP" pada grup. Ganti Alya dan pastikan pesan itu ada.',
'Sebagai Alya, blokir Rafi melalui profilnya. Buka kembali grup dan periksa isi dari Rafi serta penjelasan masih satu tim.',
'Periksa daftar anggota; buka blokir Rafi melalui /diblokir setelah bukti dicatat.'
],'Blokir tidak mengeluarkan anggota tim. Pesan Rafi disembunyikan bagi Alya dan penjelasan serta opsi keluar/lapor tersedia. Akses anggota lain tidak boleh hilang.')
case('TC-27','Laporkan pesan dengan bukti relevan','MOD-01, MOD-05','Login Alya; pesan Bima tersedia pada personal.',[
'Pada satu pesan Bima pilih Laporkan pesan, tentukan kategori dan alasan "QA-LAPOR-01: verifikasi alur laporan".',
'Coba kirim tanpa alasan, lalu isi kembali dan kirim satu kali.',
'Buka Bantuan dan periksa Status laporan saya. Catat objek, kategori, alasan, waktu, dan status awal.'
],'Alasan wajib; pengiriman valid memberi konfirmasi dan satu laporan Baru. Bukti merujuk pesan yang dipilih, bukan akses bebas ke seluruh chat. Catat ID/objek untuk TC-28.')

page(12,'Panel admin','TC-28 sampai TC-30 | Semua perubahan hanya pada data lokal profil browser uji.')
case('TC-28','Tinjau laporan dan audit','MOD-03, MOD-05','Laporan TC-27 tersedia; login Admin.',[
'Buka /admin/laporan, cari laporan QA-LAPOR-01 dan buka bukti relevannya.',
'Ubah status menjadi Ditinjau dengan alasan "QA: bukti sedang diperiksa". Simpan keputusan.',
'Buka /admin/catatan. Periksa aktor, objek, waktu, alasan, akses bukti, dan transisi status. Sebagai Alya, periksa status laporan di Bantuan.'
],'Keputusan dan akses bukti tercatat; pelapor melihat status terbaru. Member biasa tidak dapat membuka audit admin. Akses audit ini tetap simulasi lokal, bukan kontrol server.')
case('TC-29','Siklus publikasi lomba','COMP-03, MOD-05','Login Admin; gunakan lomba baru khusus QA.',[
'Tambah lomba bernama "Lomba QA [inisial]". Lengkapi semua field wajib, deadline masa depan, tanggal pelaksanaan terpisah, dan URL example.com. Simpan draf.',
'Ajukan tinjauan lalu Setujui &amp; tayangkan dengan alasan. Periksa lomba pada daftar publik.',
'Arsipkan dan pastikan hilang dari publik. Untuk jalur penolakan, buat draf QA kedua, ajukan tinjauan, lalu Tolak dengan alasan. Periksa audit.'
],'Draf tidak tampil publik; Tayang muncul; Diarsipkan hilang dari daftar publik. Penolakan membutuhkan alasan. Status publikasi berbeda dari status deadline; jejak keputusan tersedia.')
case('TC-30','Tangguhkan dan pulihkan akun','MOD-04-05','Gunakan akun QA TC-04; jangan menangguhkan satu-satunya admin.',[
'Sebagai Admin, buka Pengguna, cari akun QA, lalu tangguhkan dengan alasan "QA: uji status akun".',
'Logout dan coba login sebagai akun QA; periksa akses privat. Sebagai member lain, cari akun tersebut.',
'Kembali sebagai Admin, pulihkan dengan alasan. Periksa audit lalu login ulang akun QA.'
],'Akun ditangguhkan ditolak dari login/tindakan privat dan pencarian; pemulihan tercatat dan mengizinkan login lagi. Pencabutan sesi lintas perangkat belum dapat dibuktikan di frontend lokal.')

page(13,'Responsif dan ketahanan UI','TC-31 sampai TC-33 | Ulangi pada light dan dark mode.')
case('TC-31','Ukuran layar dan keterbacaan','Desain bagian 4-8, nonfungsional UI','Satu desktop browser dan mobile nyata bila tersedia.',[
'Uji viewport 1440, 768, 360, dan 320 CSS px pada beranda, login, partner/filter, detail lomba/tim, profil, chat, serta admin.',
'Periksa tidak ada scroll horizontal halaman, teks terpotong, tombol bertumpuk, atau navbar sulit digunakan. Pada mobile, buka/tutup menu dan drawer filter.',
'Coba zoom browser 200%. Di ponsel buka keyboard chat; pastikan komposer tetap dapat digunakan. Ulangi kedua tema.'
],'Konten reflow dan kontrol tetap terbaca/terjangkau. Sticky header, dialog, dan keyboard tidak menutup aksi penting. Catat ukuran, tema, dan perangkat setiap kali ada masalah.')
case('TC-32','Keyboard, fokus, dan dialog','Desain aksesibilitas, WCAG target','Gunakan keyboard tanpa mouse.',[
'Mulai dari atas halaman: gunakan Tab untuk Skip link, navbar, switch, CTA, tab preview, serta field form. Gunakan Shift+Tab untuk kembali.',
'Operasikan switch dengan Space/Enter dan tab preview dengan panah/Home/End. Buka menu/dialog, tekan Escape, periksa fokus kembali ke pemicu.',
'Kirim form tidak valid; pastikan label/helper jelas dan informasi error dapat ditemukan. Aktifkan preferensi reduced motion pada sistem/browser pengujian bila tersedia.'
],'Fokus terlihat, urutan masuk akal, dialog menahan fokus, Escape menutup, dan label dapat dipahami pembaca layar. Tidak ada animasi dekoratif terus-menerus. Audit pembaca layar formal dilakukan terpisah.')
case('TC-33','Kosong, reload, dan batas state','PART-01, CHAT-03-04, desain state','Data lokal; bukti tersimpan sebelum reset.',[
'Cari partner/lomba dengan kata yang tidak ada; periksa empty state dan pemulihan melalui reset.',
'Reload setelah profil, pesan, dan keputusan tersimpan. Jika memungkinkan, blokir storage hanya pada profil browser uji, lalu reload dan periksa pemberitahuan penyimpanan.',
'Catat bahwa pemilih simulasi data/putus koneksi sudah dihapus. Jangan menganggap mematikan Wi-Fi akan membuat chat lokal Gagal.'
],'Empty state berbeda dari error dan perubahan lokal normal bertahan setelah reload. Storage yang ditolak memberi penjelasan. Loading cepat/error jaringan/retry tidak selalu dapat dipicu lewat UI sekarang: tandai Terblokir bila perlu fixture/integrasi, bukan Lulus tanpa bukti.')

page(14,'Catat hasil dan tindak lanjut','Isi setelah pengujian. Dokumen ini tidak menyatakan seluruh P1 telah diterima.')
table([['Rekap sesi','Jumlah / tautan bukti'],['Lulus / Gagal','________ / ________'],['Terblokir / Belum diuji','________ / ________'],['ID temuan prioritas tertinggi','________________________________________'],['Keputusan: lanjut perbaikan / uji ulang','________________________________________']],[230,261])
gap(10)
add('Format satu temuan','Case')
add('<b>ID temuan:</b> QA-___  |  <b>Kasus:</b> TC-___  |  <b>Prioritas:</b> Kritis / Tinggi / Sedang / Rendah<br/><b>Ringkasan:</b> ______________________________<br/><b>Lingkungan:</b> build, browser, perangkat, ukuran layar, tema, akun, origin<br/><b>Prasyarat dan langkah:</b> data awal serta tindakan yang bisa diulang<br/><b>Hasil aktual:</b> ______________________________<br/><b>Hasil yang diharapkan:</b> ______________________________<br/><b>Bukti:</b> screenshot/video + URL + waktu. Jangan sertakan password/data pribadi.<br/><b>Pemilik / status / hasil uji ulang:</b> ______________________________')
add('<b>Prioritas:</b> Kritis = kebocoran isi privat/kerusakan data/alur inti terhenti tanpa jalan lain; Tinggi = fungsi inti gagal; Sedang = gangguan dengan jalan lain; Rendah = masalah visual/copy kecil. Temuan keamanan lokal tetap dicatat, tanpa menyamakannya dengan bukti keamanan server.','Small')
gap(4)
add('Belum dapat diterima dari frontend ini','Case')
table([['Area integrasi','Pengujian lanjutan yang diperlukan'],['Akun dan otorisasi','Password salah; OAuth asli; email; token sekali pakai/kedaluwarsa; sesi dicabut; akses objek/API ditolak.'],['Tim dan deadline','Dua penerimaan serentak pada slot terakhir; transaksi atomik; deadline berdasarkan waktu server saat submit.'],['Chat dan moderasi','Konfirmasi server, putus/pulih jaringan, retry tanpa duplikat, real-time lintas pengguna, pencabutan riwayat dan audit server.'],['Operasional','Backup/pemulihan, retensi/usia/privasi final, performa jaringan, beban, dan keamanan produksi.']],[110,381])
gap(9)
add('<b>Kriteria selesai sesi:</b> setiap kasus mempunyai status atau alasan belum diuji; setiap Gagal memiliki bukti dan langkah ulang; temuan kritis/tinggi ditriase; hasil uji ulang dicatat. Persetujuan frontend tidak sama dengan persetujuan peluncuran produksi.','Small')
add('Acuan internal: README.md; outputs/PRD_TeamUp_Belajar.md bagian 7, 9, 14-15; outputs/Design_Requirement_TeamUp.md revisi 1.2; outputs/Implementation_Decisions.md; source app dan lib/demo.ts.','Small')

class NumberedCanvas(canvas.Canvas):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        self.saved=[]
    def showPage(self):
        self.saved.append(dict(self.__dict__))
        self._startPage()
    def save(self):
        count=len(self.saved)
        for state in self.saved:
            self.__dict__.update(state)
            self.setStrokeColor(LINE)
            self.setLineWidth(.6)
            self.line(52,42,A4[0]-52,42)
            self.setFillColor(MUTED)
            self.setFont('Guide',8)
            self.drawString(52,28,'TeamUp | Panduan uji frontend lokal | v1.0')
            self.drawRightString(A4[0]-52,28,f'{self._pageNumber} / {count}')
            super().showPage()
        super().save()

doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=52,leftMargin=52,topMargin=42,bottomMargin=58,title='Panduan Pengujian Aplikasi TeamUp',author='TeamUp',subject='Langkah pengujian frontend interaktif untuk tim')
doc.build(story,canvasmaker=NumberedCanvas)
from pypdf import PdfReader
reader=PdfReader(str(OUT))
pages=[page.extract_text() for page in reader.pages]
assert len(set(case_ids)) == 33
assert all(id in '\n'.join(pages) for id in case_ids)
assert len(pages)==14, f'Expected 14 pages, got {len(pages)}. Review page overflow.'
(ROOT/'work'/'testing-guide-validation.json').write_text(json.dumps({'file':str(OUT),'pages':len(pages),'cases':case_ids,'page_text_lengths':[len(x) for x in pages]},indent=2),encoding='utf-8')
print(json.dumps({'file':str(OUT),'pages':len(pages),'cases':len(case_ids)},indent=2))
