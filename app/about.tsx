import Link from "next/link";
import { Icon } from "./ui";

const websiteDocuments = [
  {
    id: "srs",
    title: "SRS",
    description: "Kebutuhan dan ruang lingkup aplikasi TeamUp.",
    href: "https://drive.google.com/file/d/1yG-AxbGD5aTxhFeCaeNEolJj8OAvYYO5/view?usp=drive_link",
  },
  {
    id: "user-manual",
    title: "User Manual",
    description: "Panduan menggunakan fitur-fitur TeamUp.",
    href: "https://drive.google.com/file/d/1tF3nl9l3RnxrHWIiWscgW6U21e9d4ed5/view?usp=drive_link",
  },
];

export const aboutDescription =
  "TeamUp membantu siswa dan mahasiswa menemukan partner belajar serta rekan tim lomba. Kamu bisa mencari teman berdasarkan bidang, level, lokasi, dan jadwal, lalu memulai diskusi setelah terhubung.";

type TeamMember = {
  id: string;
  name: string;
  className: string;
  nim: string;
  nid: string;
  group: string;
};

const members: TeamMember[] = [
  {
    id: "01",
    name: "Dewa Gede Reksa Parama Aditya",
    className: "IF-49-11",
    nim: "103012500123",
    nid: "1002",
    group: "GARETH",
  },
  {
    id: "02",
    name: "Sayyid Rahman Al-Azis",
    className: "IF-49-09",
    nim: "103012500329",
    nid: "1008",
    group: "GARETH",
  },
  {
    id: "03",
    name: "Nabila N Alifah",
    className: "IF-49-06",
    nim: "103012500236",
    nid: "1001",
    group: "Gareth",
  },
  {
    id: "04",
    name: "Mochamad Dzikri Abbas",
    className: "IF-49-09",
    nim: "103012500052",
    nid: "1009",
    group: "Gareth",
  },
  {
    id: "05",
    name: "Radhia Farrel Rabbani",
    className: "IF-49-02",
    nim: "103012500394",
    nid: "0935",
    group: "KAY",
  },
  {
    id: "06",
    name: "Farrel Raza Sigak Amrullah",
    className: "IF-49-08",
    nim: "103012530052",
    nid: "0939",
    group: "KAY",
  },
  {
    id: "07",
    name: "Rizky Alvino Putra",
    className: "IF-49-02",
    nim: "103012500035",
    nid: "0963",
    group: "KAY",
  },
  {
    id: "08",
    name: "Muh Alif Fayyaz",
    className: "IF-49-07",
    nim: "103012500105",
    nid: "0929",
    group: "KAY",
  },
  {
    id: "09",
    name: "Muhammad Rabbani Al-Kautsar",
    className: "IF-49-12",
    nim: "103012500121",
    nid: "1107",
    group: "Lamorak",
  },
  {
    id: "10",
    name: "Arshanta Ayu Kusumaningtyas",
    className: "IF-49-07",
    nim: "103012500278",
    nid: "0931",
    group: "KAY",
  },
];

export function AboutTeaser() {
  return (
    <section className="about-teaser" aria-labelledby="about-teaser-title">
      <div className="container about-teaser-inner">
        <div>
          <p className="section-label">About Us</p>
          <h2 id="about-teaser-title">Kenali TeamUp lebih dekat.</h2>
        </div>
        <div className="about-teaser-copy">
          <p>{aboutDescription}</p>
          <Link href="/aboutus" className="button primary">
            Tentang kami
          </Link>
        </div>
      </div>
    </section>
  );
}

export function AboutUs() {
  return (
    <main className="container about-page">
      <section className="about-intro" aria-labelledby="about-title">
        <p className="section-label">About Us</p>
        <h1 id="about-title">Tentang TeamUp</h1>
        <p>{aboutDescription}</p>
        <p>
          Dari teman diskusi hingga tim yang saling melengkapi, TeamUp memberi
          ruang untuk belajar dan mengerjakan tujuan bersama.
        </p>
      </section>

      <section className="about-documents" aria-labelledby="documents-title">
        <h2 id="documents-title">Dokumen Website</h2>
        <div className="document-grid">
          {websiteDocuments.map((document) => (
            <a
              className="document-card"
              href={document.href}
              key={document.id}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="document-card-icons" aria-hidden="true">
                <Icon name="book" />
                <Icon name="external" size={16} />
              </div>
              <h3>{document.title}</h3>
              <p>{document.description}</p>
              <span className="sr-only">(buka tab baru)</span>
            </a>
          ))}
        </div>
      </section>

      <section className="about-members" aria-labelledby="team-title">
        <div className="about-team-heading">
          <p className="section-label">Tim di balik TeamUp</p>
          <h2 id="team-title">Kelompok 20 Fortran</h2>
          <p>Kenali orang-orang yang mengembangkan ruang kolaborasi ini.</p>
        </div>
        <div className="member-list-heading">
          <h3>Anggota:</h3>
        </div>
        <div className="member-grid">
          {members.map((member) => {
            return (
              <article
                className="member-card"
                key={member.id}
                aria-labelledby={`member-${member.id}`}
              >
                <div className="member-details">
                  <h4 id={`member-${member.id}`}>{member.name}</h4>
                  <dl>
                    <div>
                      <dt>Kelas</dt>
                      <dd>{member.className}</dd>
                    </div>
                    <div>
                      <dt>NIM</dt>
                      <dd>{member.nim}</dd>
                    </div>
                    <div>
                      <dt>NID</dt>
                      <dd>{member.nid}</dd>
                    </div>
                    <div>
                      <dt>Kelompok</dt>
                      <dd>{member.group}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <div className="about-return">
        <Link className="button secondary" href="/">
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
