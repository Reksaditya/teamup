from pathlib import Path
import json
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'outputs'/'Panduan_Pengujian_TeamUp.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Beginner','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('BeginnerBold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Beginner',normal='Beginner',bold='BeginnerBold',italic='Beginner',boldItalic='BeginnerBold')
NAVY=HexColor('#000321'); INK=HexColor('#263348'); MUTED=HexColor('#596579'); LINE=HexColor('#DCE2EA'); PALE=HexColor('#F3F6FA')
styles={
 'body':ParagraphStyle('body',fontName='Beginner',fontSize=10.7,leading=15.2,textColor=INK,spaceAfter=4),
 'small':ParagraphStyle('small',fontName='Beginner',fontSize=9,leading=12.5,textColor=MUTED,spaceAfter=6),
 'title':ParagraphStyle('title',fontName='BeginnerBold',fontSize=23,leading=29,textColor=NAVY,spaceAfter=7),
 'feature':ParagraphStyle('feature',fontName='BeginnerBold',fontSize=12.3,leading=17,textColor=NAVY,spaceAfter=6),
 'table':ParagraphStyle('table',fontName='Beginner',fontSize=9.1,leading=12,textColor=INK),
}
story=[]; features=[]
def p(text,style='body'):return Paragraph(text,styles[style])
def add(text,style='body'):story.append(p(text,style))
def space(n=9):story.append(Spacer(1,n))
def page(title,subtitle):
 if story:story.append(PageBreak())
 add(title,'title');add(subtitle,'small');space(7)
def feature(number,title,steps,result):
 features.append(number)
 parts=[p(f'{number:02d}. {title}','feature')]
 for i,text in enumerate(steps,1):parts.append(p(f'<b>{i}.</b> {text}'))
 parts.extend([p(f'<b>Yang perlu dilihat:</b> {result}'),Spacer(1,12)])
 story.append(KeepTogether(parts))
def box(text):
 t=Table([[p(text)]],colWidths=[495])
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('BOX',(0,0),(-1,-1),.5,LINE),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
 story.append(t);space(9)

page('Masuk, keluar, dan tema','Panduan pengujian TeamUp | Versi ringkas untuk pemula | 13 November 2026')
add('Buka alamat website yang diberikan pengembang. Gunakan <b>browser dan alamat website yang sama</b> saat berganti akun. Data pengujian belum dibagikan ke perangkat lain.','small')
feature(1,'Masuk ke akun',[
 'Klik <b>Masuk</b>, lalu isi salah satu email di tabel bawah.',
 'Isi password <b>teamup123</b>, lalu klik <b>Masuk ke TeamUp</b>.'
],'Nama akun muncul di kanan atas. Password ini hanya untuk pengujian lokal.')
rows=[['Akun','Email','Digunakan untuk'],['Alya','alya@teamup.test','Ketua Beyond the Bytes'],['Bima','bima@teamup.test','Ketua Pixel Pioneers'],['Citra','citra@teamup.test','Mencoba lamaran tim'],['Dimas','dimas@teamup.test','Anggota Beyond the Bytes'],['Nadia','nadia@teamup.test','Menerima ajakan belajar'],['Rafi','rafi@teamup.test','Mengirim ajakan belajar'],['Pengguna Baru','baru@teamup.test','Profil belum lengkap'],['Admin','admin@teamup.test','Mengelola data dan laporan']]
t=Table([[p(c,'table') for c in row] for row in rows],colWidths=[92,175,228],repeatRows=1)
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PALE),('LINEBELOW',(0,0),(-1,-1),.5,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),('LEFTPADDING',(0,0),(-1,-1),8)]))
story.append(t);space(12)
feature(2,'Keluar atau berganti akun',[
 'Klik ikon <b>Keluar</b> di kanan atas. Di ponsel, buka menu tiga garis lalu <b>Keluar dari akun</b>.',
 'Pada pertanyaan "yakin ingin keluar dari akun?", coba <b>Tidak</b>. Buka lagi, lalu pilih <b>Ya</b>.'
],'Tidak membatalkan logout. Ya berwarna merah dan mengeluarkan akun. Untuk berganti akun, masuk lagi dengan email lain.')
feature(3,'Mengganti tema',[
 'Klik switch tema di bagian atas untuk mengganti tampilan terang/gelap.',
 'Buka halaman Lomba, lalu muat ulang halaman.'
],'Warna berubah dan pilihan tema tetap tersimpan. Kunjungan pertama memakai tema terang.')

page('Profil dan partner belajar','Coba berurutan. Gunakan data rekaan, bukan data pribadi atau password asli.')
feature(4,'Membuat akun sendiri',[
 'Keluar dari akun saat ini. Klik <b>Buat akun</b>.',
 'Isi nama, email baru seperti <b>qa01@teamup.test</b>, dan password <b>teamup123</b>. Klik <b>Buat akun</b>.',
 'Pada halaman verifikasi, klik <b>Verifikasi email</b>, lalu <b>Lengkapi profil</b>.'
],'Akun dibuat dan halaman pengisian profil terbuka. Pada versi ini verifikasi masih berupa tombol, tanpa email masuk.')
feature(5,'Melengkapi profil',[
 'Isi nama, institusi, jurusan/kelas, dan kota. Klik <b>Lanjut</b>.',
 'Pilih sedikitnya satu bidang belajar dan levelnya. Klik <b>Lanjut</b>.',
 'Pilih mode belajar dan jadwal, misalnya Sabtu 19.00-20.00 WIB. Klik <b>Simpan profil</b>.'
],'Profil tersimpan. Waktu selesai harus setelah waktu mulai. Foto boleh dikosongkan.')
feature(6,'Mencari partner',[
 'Berganti ke akun <b>Rafi</b>, lalu buka <b>Cari Partner</b>.',
 'Pilih UI/UX Design, level Mahir, kota Bandung, lalu <b>Terapkan filter</b>. Di ponsel, buka tombol Filter dahulu.',
 'Buka profil Nadia. Kembali ke daftar dan coba <b>Reset</b>.'
],'Nadia sesuai filter tersebut. Setelah reset, daftar partner kembali lebih luas.')
feature(7,'Mengajak partner dan menerima ajakan',[
 'Sebagai <b>Rafi</b>, buka profil <b>Nadia</b>, lalu klik <b>Ajak belajar</b>.',
 'Buka <b>Aktivitas &gt; Permintaan partner &gt; Terkirim</b>. Periksa status Menunggu.',
 'Berganti ke <b>Nadia</b>. Buka <b>Aktivitas &gt; Permintaan partner &gt; Masuk</b>, lalu terima Rafi.'
],'Status berubah menjadi Diterima dan percakapan personal tersedia. Jika ajakan sudah ada, periksa statusnya dahulu.')
box('Untuk mencoba pembatalan: sebagai pengirim, buka ajakan yang masih <b>Menunggu</b> lalu pilih <b>Batalkan</b>. Untuk mencoba penolakan: sebagai penerima, pilih <b>Tolak</b>. Status harus berubah sesuai pilihan.')

page('Lomba dan tim','Jika lomba sudah ditutup, pilih lomba lain yang masih membuka pendaftaran.')
feature(8,'Melihat dan mencari lomba',[
 'Buka <b>Lomba</b>. Coba filter kategori, tingkat, atau biaya, lalu klik <b>Terapkan</b>.',
 'Buka salah satu lomba. Baca syarat, biaya, deadline, dan tanggal pelaksanaannya.'
],'Daftar mengikuti filter. Deadline dan tanggal pelaksanaan terlihat sebagai dua informasi berbeda.')
feature(9,'Membuat tim',[
 'Masuk dengan <b>akun baru yang profilnya sudah lengkap</b>. Pada lomba terbuka, klik <b>Buat tim</b>.',
 'Isi nama "Tim Belajar QA", deskripsi, kapasitas 3 orang, dan peran dengan total 2 slot.',
 'Simpan, lalu buka detail tim yang baru dibuat.'
],'Nama tim muncul; akun pembuat menjadi ketua dan anggota pertama, sehingga kapasitas terisi 1 dari 3.')
feature(10,'Melamar ke tim',[
 'Masuk sebagai <b>Citra</b>. Buka <b>Cari Tim</b>, lalu pilih <b>Pixel Pioneers</b>.',
 'Klik <b>Ajukan lamaran</b>, pilih peran yang tersedia, dan tulis pesan singkat. Kirim lamaran.',
 'Lihat <b>Aktivitas &gt; Lamaran tim &gt; Terkirim</b>.'
],'Lamaran berstatus Menunggu. Jika tombol terkunci, baca alasannya; jangan mengirim berulang kali.')
feature(11,'Menerima lamaran sebagai ketua',[
 'Berganti ke <b>Bima</b>, ketua Pixel Pioneers.',
 'Buka <b>Aktivitas &gt; Lamaran tim &gt; Masuk</b>, lalu terima Citra.',
 'Berganti ke <b>Citra</b> dan buka lagi detail Pixel Pioneers.'
],'Citra tercantum sebagai anggota dan mendapat tombol Buka chat grup.')
feature(12,'Mengatur perekrutan',[
 'Kembali ke akun pembuat <b>Tim Belajar QA</b>. Buka tim, pilih <b>Edit tim</b>, ubah deskripsi, lalu simpan.',
 'Klik <b>Tutup perekrutan</b>, kemudian <b>Buka perekrutan</b>.'
],'Deskripsi dan status berubah sesuai tindakan. Pilihan pengelolaan tersedia untuk ketua tim.')
add('Tautan penyelenggara pada data awal belum merupakan pendaftaran nyata. Cukup periksa tautannya; tidak perlu mendaftar atau membayar di situs luar.','small')

page('Pesan, aktivitas, dan laporan','Selesaikan langkah partner/tim di halaman sebelumnya sebelum mencoba chat baru.')
feature(13,'Melihat status aktivitas',[
 'Buka <b>Aktivitas</b>. Pilih <b>Permintaan partner</b> atau <b>Lamaran tim</b>.',
 'Coba pilihan <b>Masuk</b>, <b>Terkirim</b>, dan filter status.'
],'Daftar berubah sesuai pilihan. Ajakan/lamaran yang diterima tidak tetap berstatus Menunggu.')
feature(14,'Mengirim pesan personal',[
 'Masuk sebagai <b>Rafi</b> setelah ajakannya diterima Nadia. Buka <b>Pesan</b> dan pilih Nadia.',
 'Ketik "Halo, ini pesan pengujian", lalu kirim. Muat ulang halaman.',
 'Berganti ke <b>Nadia</b>, buka percakapan Rafi, lalu balas.'
],'Pesan dan balasan terlihat serta tetap ada setelah halaman dimuat ulang. Alternatif akun awal: Alya dan Bima sudah menjadi partner.')
feature(15,'Mengirim pesan grup',[
 'Masuk sebagai <b>Citra</b> setelah diterima di Pixel Pioneers.',
 'Buka tim, klik <b>Buka chat grup</b>, lalu kirim "Halo tim, ini pengujian".',
 'Berganti ke <b>Bima</b> dan buka grup yang sama.'
],'Pesan Citra terlihat oleh Bima. Tetap gunakan browser yang sama saat berganti akun.')
feature(16,'Memblokir dan membuka blokir',[
 'Masuk sebagai <b>Alya</b>. Buka profil Bima, pilih <b>Blokir</b>, lalu konfirmasi.',
 'Coba buka chat personal Bima dan kirim pesan.',
 'Buka <b>Profil &gt; Pengguna diblokir</b>, lalu <b>Buka blokir</b> Bima.'
],'Pesan personal terhalang selama diblokir. Nama Bima hilang dari daftar blokir setelah dibuka kembali.')
feature(17,'Melaporkan masalah pada pesan',[
 'Sebagai <b>Alya</b>, buka satu pesan Bima dan klik tombol <b>Laporkan</b> pada pesan itu.',
 'Pilih kategori, tulis "Uji laporan oleh tim", lalu kirim.',
 'Buka <b>Bantuan</b> dan lihat <b>Status laporan saya</b>.'
],'Laporan muncul dengan status Baru. Laporan ini akan digunakan pada pengujian admin berikutnya.')

page('Admin dan pemeriksaan akhir','Untuk nomor 18-20, keluar lalu masuk dengan admin@teamup.test.')
feature(18,'Menambah lomba',[
 'Buka <b>Admin &gt; Lomba &gt; Tambah lomba</b>. Isi nama "Lomba Uji Tim" dan semua isian wajib. Pilih deadline di masa depan.',
 'Klik <b>Simpan draf</b>, lalu <b>Ajukan tinjauan</b>. Klik <b>Setujui</b>, isi alasan, lalu <b>Simpan keputusan</b>.',
 'Buka daftar Lomba untuk melihat hasilnya. Setelah selesai, arsipkan lomba uji dari halaman Admin.'
],'Draf belum terlihat publik, lomba Tayang muncul di daftar, dan lomba yang diarsipkan hilang dari daftar publik.')
feature(19,'Meninjau laporan',[
 'Buka <b>Admin &gt; Laporan</b>. Cari laporan "Uji laporan oleh tim" dari langkah 17.',
 'Buka bukti pesan. Ubah status ke <b>Ditinjau</b>, isi alasan, lalu simpan keputusan.',
 'Buka <b>Catatan tindakan</b>. Setelah itu, masuk sebagai Alya dan cek laporan di Bantuan.'
],'Keputusan tercatat dan status laporan yang dilihat Alya ikut berubah.')
feature(20,'Menangguhkan dan memulihkan akun',[
 'Sebagai Admin, buka <b>Pengguna</b>. Pilih <b>akun baru buatanmu</b>, lalu tangguhkan dengan alasan pengujian.',
 'Coba masuk menggunakan akun tersebut. Setelah diperiksa, masuk lagi sebagai Admin dan pulihkan akun itu.'
],'Akun ditangguhkan tidak bisa digunakan untuk masuk. Setelah dipulihkan, akun dapat masuk lagi. Jangan gunakan akun Admin untuk percobaan ini.')
feature(21,'Mencoba tampilan ponsel dan keyboard',[
 'Buka website di ponsel. Coba menu tiga garis, filter partner, form profil, dan chat pada tema terang serta gelap.',
 'Di komputer, gunakan <b>Tab</b> untuk berpindah tombol, <b>Enter</b> untuk memilih, dan <b>Escape</b> untuk menutup dialog.'
],'Teks mudah dibaca, tombol tidak bertumpuk, layar tidak bergeser ke samping, dan tombol yang dipilih dengan keyboard terlihat jelas.')
box('<b>Kalau menemukan masalah, cukup catat:</b><br/>Fitur: ____________________ &nbsp; Akun: ____________________<br/>Saya menekan: _________________________________________<br/>Yang terjadi: __________________________________________<br/>Lampirkan screenshot. Tandai: <b>Berhasil / Belum berhasil / Belum dicoba</b>.')
add('Login Google, pengiriman email, dan percakapan antarperangkat belum tersedia. Tidak perlu menunggu email masuk. Jika akun/tim awal sudah berubah, minta pengembang menyiapkan data uji kembali.','small')

class FooterCanvas(canvas.Canvas):
 def __init__(self,*args,**kwargs):super().__init__(*args,**kwargs);self.saved=[]
 def showPage(self):self.saved.append(dict(self.__dict__));self._startPage()
 def save(self):
  total=len(self.saved)
  for state in self.saved:
   self.__dict__.update(state);self.setStrokeColor(LINE);self.setLineWidth(.5);self.line(50,40,A4[0]-50,40)
   self.setFillColor(MUTED);self.setFont('Beginner',8);self.drawString(50,26,'TeamUp | Panduan pengujian ringkas | v1.1')
   self.drawRightString(A4[0]-50,26,f'{self._pageNumber} / {total}');super().showPage()
  super().save()

SimpleDocTemplate(str(OUT),pagesize=A4,leftMargin=50,rightMargin=50,topMargin=38,bottomMargin=54,title='Panduan Pengujian TeamUp - Versi Ringkas',author='TeamUp').build(story,canvasmaker=FooterCanvas)
reader=PdfReader(str(OUT));texts=[page.extract_text() for page in reader.pages]
assert len(texts)==5,f'Expected 5 pages; got {len(texts)}'
assert len(features)==21
assert all(f'{n:02d}.' in '\n'.join(texts) for n in features)
words=sum(len(text.split()) for text in texts)
(ROOT/'work'/'simple-testing-guide-validation.json').write_text(json.dumps({'pages':len(texts),'features':len(features),'words':words,'file':str(OUT)},indent=2),encoding='utf-8')
print(json.dumps({'file':str(OUT),'pages':len(texts),'features':len(features),'words':words},indent=2))
