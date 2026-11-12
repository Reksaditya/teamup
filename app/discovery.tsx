import Link from "next/link";
import { useState } from "react";
import {
  closed,
  date,
  personalId,
  type User,
  type State,
  type Competition,
  type Team,
} from "../lib/demo";
import type { Shared } from "./teamup";
import { Icon, Avatar, Badge, Status } from "./ui";
export function PartnerCard({
  u,
  user,
  state,
  request,
  preview,
}: {
  u: User;
  user?: User;
  state: State;
  request: (id: string) => void;
  preview?: boolean;
}) {
  const r = state.requests.find(
    (r) =>
      [r.from, r.to].includes(u.id) &&
      [r.from, r.to].includes(user?.id || "") &&
      ["Menunggu", "Diterima"].includes(r.status),
  );
  return (
    <article className={`partner-card card ${preview ? "preview-card" : ""}`}>
      <div className="person-heading">
        <Avatar user={u} />
        <div>
          <Link href={"/partner/" + u.id} className="person-name">
            {u.name}
          </Link>
          <p>{u.institution}</p>
        </div>
        <span className="person-spark">
          <Icon name="spark" size={16} />
        </span>
      </div>
      <p className="bio">{u.bio}</p>
      <div className="topic-list">
        {u.topics.slice(0, 3).map((t) => (
          <span className="topic" key={t.name}>
            {t.name}
            <span>{t.level}</span>
          </span>
        ))}
      </div>
      <div className="metadata">
        {(user || preview) && (
          <>
            <span>
              <Icon name="pin" size={16} />
              {u.city}
            </span>
            <span>
              <Icon name="globe" size={16} />
              {u.mode}
            </span>
          </>
        )}
      </div>
      {user && (
        <div className="schedule">
          <Icon name="clock" size={16} />
          {u.day}, {u.start}–{u.end}{" "}
          {u.zone === "Asia/Makassar"
            ? "WITA"
            : u.zone === "Asia/Jayapura"
              ? "WIT"
              : "WIB"}
        </div>
      )}
      <div className="card-bottom">
        <Link className="text-link" href={"/partner/" + u.id}>
          Lihat profil <Icon name="arrow" size={16} />
        </Link>
        {r?.status === "Diterima" ? (
          <Link
            className="button small secondary"
            href={"/pesan/" + personalId(user!.id, u.id)}
          >
            Buka chat
          </Link>
        ) : r?.status === "Menunggu" ? (
          <Link className="button small secondary" href="/aktivitas">
            Menunggu
          </Link>
        ) : (
          <button
            className="button small primary"
            disabled={
              !!user && (!user.verified || !user.complete || user.suspended)
            }
            onClick={() => request(u.id)}
          >
            <Icon name="plus" size={16} /> Ajak belajar
          </button>
        )}
      </div>
      <small className="disclaimer">
        {user && (!user.verified || !user.complete)
          ? "Verifikasi email dan lengkapi profil untuk mengajak belajar."
          : "Level diisi sendiri oleh pengguna."}
      </small>
    </article>
  );
}
export function CompetitionCard({ c }: { c: Competition }) {
  return (
    <article className="competition-card card">
      <Link
        href={"/lomba/" + c.id}
        className={"competition-art " + c.art}
        tabIndex={-1}
        aria-hidden="true"
      >
        <span className="art-grid" />
        <span className="art-label">TEAMUP / EXPLORE</span>
        <span className="art-symbol">
          <Icon
            name={
              c.art === "design"
                ? "spark"
                : c.art === "code"
                  ? "code"
                  : c.art === "data"
                    ? "grid"
                    : "leaf"
            }
            size={58}
          />
        </span>
        <span className="art-word">
          {c.art === "design"
            ? "design\nwhat’s next."
            : c.art === "code"
              ? "build a\nbetter tomorrow."
              : c.art === "data"
                ? "small data.\nbig possibilities."
                : "ideas\ninto impact."}
        </span>
        <span className="art-index">2026 ↗</span>
      </Link>
      <div className="competition-body">
        <div className="row between">
          <Badge tone="info">{c.category}</Badge>
          <span className="fee">
            {c.fee ? "Rp" + c.fee.toLocaleString("id-ID") : "Gratis"}
          </span>
        </div>
        <h3>
          <Link href={"/lomba/" + c.id}>{c.name}</Link>
        </h3>
        <p>{c.organizer}</p>
        <div className="metadata">
          <span>
            <Icon name="globe" size={16} />
            {c.level}
          </span>
          {c.verified && (
            <span title="Diperiksa admin, bukan jaminan kualitas penyelenggaraan.">
              <Icon name="shield" size={16} /> Informasi diperiksa
            </span>
          )}
        </div>
        <div className="deadline">
          <Icon name="clock" size={16} />
          <span>
            {closed(c)
              ? "Pendaftaran ditutup"
              : "Deadline " +
                new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "Asia/Jakarta",
                }).format(new Date(c.deadline))}
            <small>{date(c.deadline)}</small>
          </span>
        </div>
        <Link className="text-link" href={"/lomba/" + c.id}>
          Lihat detail lomba <Icon name="arrow" size={16} />
        </Link>
      </div>
    </article>
  );
}
export function TeamCard({ t, state }: { t: Team; state: State }) {
  const c = state.competitions.find((c) => c.id === t.competition)!;
  return (
    <article className="team-card card">
      <div className="row between">
        <span className="team-mark">
          <Icon name="users" size={24} />
        </span>
        <Status value={t.members.length >= t.capacity ? "Penuh" : t.status} />
      </div>
      <div>
        <h3>
          <Link href={"/tim/" + t.id}>{t.name}</Link>
        </h3>
        <p className="muted">{c.name}</p>
      </div>
      <p className="bio">{t.description}</p>
      <div className="topic-list">
        <span className="topic">{t.role}</span>
      </div>
      <div className="row between">
        <div className="avatar-stack">
          {t.members.map((id) => (
            <Avatar
              key={id}
              user={state.users.find((u) => u.id === id)}
              size="tiny"
            />
          ))}
        </div>
        <span className="muted">
          {t.members.length} dari {t.capacity} anggota
        </span>
      </div>
      <progress
        max={t.capacity}
        value={t.members.length}
        aria-label={`${t.members.length} dari ${t.capacity} anggota`}
      />
      <div className="card-bottom">
        <span className="muted">
          Ketua:{" "}
          {state.users.find((u) => u.id === t.leader)?.name.split(" ")[0]}
        </span>
        <Link href={"/tim/" + t.id} className="text-link">
          Lihat kebutuhan <Icon name="arrow" size={16} />
        </Link>
      </div>
    </article>
  );
}
export function Landing(p: Shared) {
  const [tab, setTab] = useState(0);
  return (
    <main>
      <section className="hero">
        <div className="hero-grid" />
        <div className="container hero-content">
          <div className="hero-kicker">
            Ruang bertemu, belajar, dan bertumbuh
          </div>
          <h1>
            Langkah besarmu,
            <br />
            dimulai <span>bersama.</span>
            <svg
              className="hero-underline"
              viewBox="0 0 360 18"
              aria-hidden="true"
            >
              <path
                d="M3 13Q170-6 355 9"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </h1>
          <p>
            Temukan partner belajar yang sefrekuensi, jelajahi lomba,
            <br className="desktop-break" /> dan bangun tim yang saling
            melengkapi.
          </p>
          <div className="actions center">
            <Link className="button primary" href="/partner">
              Temukan partner belajar <Icon name="arrow" />
            </Link>
            <Link className="button secondary" href="/lomba">
              <Icon name="trophy" /> Jelajahi lomba
            </Link>
          </div>
          <div className="hero-note">
            <Icon name="check" size={15} /> Gratis untuk mulai <span /> Dibuat
            untuk siswa & mahasiswa
          </div>
          <div className="product-preview">
            <div className="preview-top">
              <div className="window-dots">
                <i />
                <i />
                <i />
              </div>
              <span>Temukan ruang kolaborasimu</span>
              <Badge>Contoh tampilan</Badge>
            </div>
            <div className="preview-layout">
              <div className="preview-sidebar">
                <span className="eyebrow">BELAJAR BARENG</span>
                <h3>
                  Partner yang tepat.
                  <br />
                  Semangat yang baru.
                </h3>
                <p>Mulai dari minat yang sama, lalu tumbuh bersama.</p>
                <div className="preview-tags">
                  <span>
                    <Icon name="code" size={16} /> Web Development
                  </span>
                  <span>
                    <Icon name="spark" size={16} /> UI/UX Design
                  </span>
                  <span>
                    <Icon name="grid" size={16} /> Data Science
                  </span>
                </div>
                <span className="preview-foot">
                  <span className="live-dot" /> Satu langkah menuju kolaborasi
                </span>
              </div>
              <div className="preview-partner">
                {p.partnerCard(p.state.users[1], true)}
              </div>
              <div className="preview-team">
                <div className="row between">
                  <span className="team-mark">
                    <Icon name="users" />
                  </span>
                  <Badge tone="success">Merekrut</Badge>
                </div>
                <h3>Pixel Pioneers</h3>
                <p>Ide hebat butuh tim hebat.</p>
                <div className="preview-orbit">
                  <div className="orbit-ring" />
                  <Avatar user={p.state.users[1]} />
                  <Avatar user={p.state.users[4]} />
                  <span className="orbit-plus">+</span>
                </div>
                <div className="topic-list">
                  <span className="topic">UI/UX Designer</span>
                </div>
                <Link className="text-link" href="/tim/pixel">
                  Kenalan dengan tim <Icon name="arrow" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading centered">
          <div className="eyebrow">LEBIH DARI SEKADAR KONEKSI</div>
          <h2>Tujuanmu, ketemu jalannya.</h2>
          <p>Dari “ingin belajar” jadi “ayo kita mulai”. Semua ada di sini.</p>
        </div>
        <div className="benefit-grid">
          <Link href="/partner" className="benefit-card benefit-main">
            <span className="feature-icon">
              <Icon name="users" size={24} />
            </span>
            <h3>Belajar nggak harus sendiri.</h3>
            <p>
              Temukan teman diskusi berdasarkan bidang, level, dan waktu
              luangmu. Saling bantu, saling maju.
            </p>
            <div className="mini-connect">
              <Avatar user={p.state.users[0]} />
              <span className="connect-line" />
              <span className="connect-center">
                <Icon name="spark" />
              </span>
              <span className="connect-line" />
              <Avatar user={p.state.users[2]} />
            </div>
            <span className="text-link">
              Cari partner belajar <Icon name="arrow" size={16} />
            </span>
          </Link>
          <Link href="/lomba" className="benefit-card">
            <span className="feature-icon mint">
              <Icon name="trophy" size={24} />
            </span>
            <h3>
              Berani ambil
              <br />
              peluang baru.
            </h3>
            <p>Jelajahi lomba yang sesuai minat dan tantang kemampuanmu.</p>
            <span className="text-link">
              Jelajahi lomba <Icon name="arrow" size={16} />
            </span>
          </Link>
          <Link href="/tim" className="benefit-card">
            <span className="feature-icon violet">
              <Icon name="chat" size={24} />
            </span>
            <h3>
              Ide berbeda.
              <br />
              Satu tujuan.
            </h3>
            <p>Bangun tim, bagi peran, dan koordinasi dalam satu ruang.</p>
            <span className="text-link">
              Temukan tim <Icon name="arrow" size={16} />
            </span>
          </Link>
        </div>
      </section>
      <section className="how-section">
        <div className="container section">
          <div className="section-heading centered">
            <div className="eyebrow">SESEDERHANA ITU</div>
            <h2>Kolaborasi dimulai dari kamu.</h2>
            <p>Tiga langkah kecil untuk peluang yang lebih besar.</p>
          </div>
          <div className="segmented centered-segment">
            <button
              className={tab === 0 ? "selected" : ""}
              onClick={() => setTab(0)}
            >
              Partner belajar
            </button>
            <button
              className={tab === 1 ? "selected" : ""}
              onClick={() => setTab(1)}
            >
              Tim lomba
            </button>
          </div>
          <div className="grid three steps">
            {(tab === 0
              ? [
                  [
                    "Bikin profilmu",
                    "Ceritakan minat, level, dan jadwal belajarmu.",
                    "book",
                  ],
                  [
                    "Temukan partner",
                    "Cari teman dengan bidang dan waktu yang sesuai.",
                    "search",
                  ],
                  [
                    "Mulai belajar bareng",
                    "Kirim permintaan, terhubung, lalu mulai diskusi.",
                    "chat",
                  ],
                ]
              : [
                  [
                    "Pilih tantanganmu",
                    "Jelajahi lomba dan pelajari persyaratannya.",
                    "trophy",
                  ],
                  [
                    "Temukan atau buat tim",
                    "Bawa kemampuanmu ke tim yang saling melengkapi.",
                    "users",
                  ],
                  [
                    "Wujudkan ide bersama",
                    "Tinjau lamaran dan koordinasikan lewat chat grup.",
                    "spark",
                  ],
                ]
            ).map(([title, text, icon], i) => (
              <div className="step" key={title}>
                <div className="step-number">
                  0{i + 1}
                  <span>
                    <Icon name={icon} size={22} />
                  </span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading row between">
          <div>
            <div className="eyebrow">WAKTUNYA UNJUK IDE</div>
            <h2>Tantangan baru menantimu.</h2>
            <p>Temukan kesempatan untuk belajar lewat pengalaman.</p>
          </div>
          <Link className="button secondary" href="/lomba">
            Semua lomba <Icon name="arrow" size={18} />
          </Link>
        </div>
        <p className="demo-caption">
          <Icon name="info" size={14} /> Data contoh, bukan pengumuman lomba
          nyata.
        </p>
        <div className="grid three">
          {p.state.competitions
            .filter((c) => c.status === "Tayang" && !closed(c))
            .slice(0, 3)
            .map(p.competitionCard)}
        </div>
      </section>
      <section className="container cta-section">
        <span className="cta-decoration" aria-hidden="true">
          <Icon name="spark" size={150} />
        </span>
        <div>
          <div className="eyebrow">LET’S TEAM UP</div>
          <h2>
            Jangan cuma punya rencana.
            <br />
            Punya teman untuk memulainya.
          </h2>
          <p>Langkah pertama menuju kolaborasi berikutnya ada di sini.</p>
        </div>
        <Link className="button primary" href="/daftar">
          Mulai perjalananmu <Icon name="arrow" />
        </Link>
      </section>
    </main>
  );
}
