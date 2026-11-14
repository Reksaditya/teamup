import Link from "next/link";
import { AboutTeaser } from "./about";
import { HowItWorks } from "./how-it-works";
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
import { Icon, Avatar, Status, Empty } from "./ui";

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
  const relation = state.requests.find(
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
          <h2 className="person-name">
            <Link href={"/partner/" + u.id}>{u.name}</Link>
          </h2>
          <p>{u.institution}</p>
        </div>
      </div>
      <p className="bio">{u.bio}</p>
      <dl className="partner-topics">
        {u.topics.slice(0, 3).map((t) => (
          <div key={t.name}>
            <dt>{t.name}</dt>
            <dd>{t.level}</dd>
          </div>
        ))}
      </dl>
      {(user || preview) && (
        <div className="metadata">
          <span>
            <Icon name="pin" size={16} />
            {u.city}
          </span>
          <span>
            <Icon name="globe" size={16} />
            {u.mode}
          </span>
        </div>
      )}
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
          Lihat profil
        </Link>
        {relation?.status === "Diterima" ? (
          <Link
            className="button small secondary"
            href={"/pesan/" + personalId(user!.id, u.id)}
          >
            Buka chat
          </Link>
        ) : relation?.status === "Menunggu" ? (
          <Link className="button small secondary" href="/aktivitas">
            Lihat permintaan
          </Link>
        ) : (
          <button
            className="button small primary"
            disabled={
              !!user && (!user.verified || !user.complete || user.suspended)
            }
            onClick={() => request(u.id)}
          >
            Ajak belajar
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
      <div className="competition-body">
        <div className="row between">
          <span className="competition-category">{c.category}</span>
          <span className="fee">
            {c.fee ? "Rp" + c.fee.toLocaleString("id-ID") : "Gratis"}
          </span>
        </div>
        <h2>
          <Link href={"/lomba/" + c.id}>{c.name}</Link>
        </h2>
        <p>{c.organizer}</p>
        <div className="metadata">
          <span>{c.level}</span>
          {c.verified && (
            <span title="Diperiksa admin, bukan jaminan kualitas penyelenggaraan.">
              <Icon name="shield" size={16} />
              Informasi diperiksa
            </span>
          )}
        </div>
        <div className="deadline">
          <Icon name="clock" size={16} />
          <span>
            {closed(c) ? "Pendaftaran ditutup" : "Batas pendaftaran"}
            <time dateTime={c.deadline}>{date(c.deadline)}</time>
          </span>
        </div>
        <Link className="text-link" href={"/lomba/" + c.id}>
          Detail & kebutuhan tim <Icon name="arrow" size={16} />
        </Link>
      </div>
    </article>
  );
}

export function TeamCard({ t, state }: { t: Team; state: State }) {
  const competition = state.competitions.find((c) => c.id === t.competition)!;
  return (
    <article className="team-card card">
      <div className="row between">
        <span className="team-type">Tim lomba</span>
        <Status value={t.members.length >= t.capacity ? "Penuh" : t.status} />
      </div>
      <div>
        <h2>
          <Link href={"/tim/" + t.id}>{t.name}</Link>
        </h2>
        <p className="muted">{competition.name}</p>
      </div>
      <p className="bio">{t.description}</p>
      <div className="team-role">
        <span>Mencari</span>
        <strong>{t.role}</strong>
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
  const [preview, setPreview] = useState("partner");
  const people = p.state.users
    .filter(
      (u) => !u.admin && !u.suspended && u.complete && u.id !== p.user?.id,
    )
    .slice(0, 3);
  const competitions = p.state.competitions
    .filter((c) => c.status === "Tayang" && !closed(c))
    .slice(0, 3);
  const teams = p.state.teams
    .filter(
      (t) =>
        t.status === "Merekrut" &&
        t.members.length < t.capacity &&
        !closed(p.state.competitions.find((c) => c.id === t.competition)!),
    )
    .slice(0, 2);
  return (
    <main>
      <section className="home-intro container">
        <div className="intro-copy">
          <p className="hero-kicker">Ruang bertemu, belajar, dan bertumbuh</p>
          <h1>
            Belajar bareng.
            <br />
            Melangkah{" "}
            <span className="curved-underline">
              lebih jauh
              <svg
                viewBox="0 0 300 18"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M3 13 Q145 -3 297 11" />
              </svg>
            </span>
            .
          </h1>
          <p className="intro-description">
            Ada hal yang lebih mudah dipelajari bersama. Temukan teman diskusi,
            siapkan tim lomba, dan mulai dari tujuan yang sama.
          </p>
          <div className="actions">
            <Link className="button primary" href="/partner">
              Cari partner belajar
            </Link>
            <Link className="button secondary" href="/tim">
              Temukan tim lomba
            </Link>
          </div>
          <p className="intro-footnote">
            Untuk siswa dan mahasiswa. Dari diskusi pertama sampai kerja tim.
          </p>
        </div>
        <aside className="study-board" aria-label="Ruang kolaborasi TeamUp">
          <div className="workspace-rail">
            <span className="workspace-brand">
              TeamUp<span>.</span>
            </span>
            <p>Ruang kolaborasi</p>
            <div
              role="tablist"
              aria-label="Jenis kolaborasi"
              className="preview-tabs"
              onKeyDown={(event) => {
                if (
                  ![
                    "ArrowRight",
                    "ArrowLeft",
                    "ArrowDown",
                    "ArrowUp",
                    "Home",
                    "End",
                  ].includes(event.key)
                )
                  return;
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? "partner"
                    : event.key === "End"
                      ? "tim"
                      : preview === "partner"
                        ? "tim"
                        : "partner";
                setPreview(next);
                event.currentTarget
                  .querySelector<HTMLButtonElement>(
                    next === "partner" ? "#partner-tab" : "#team-tab",
                  )
                  ?.focus();
              }}
            >
              <button
                type="button"
                role="tab"
                id="partner-tab"
                tabIndex={preview === "partner" ? 0 : -1}
                aria-controls="collaboration-preview"
                aria-selected={preview === "partner"}
                onClick={() => setPreview("partner")}
              >
                <Icon name="users" size={18} />
                Partner belajar
              </button>
              <button
                type="button"
                role="tab"
                id="team-tab"
                tabIndex={preview === "tim" ? 0 : -1}
                aria-controls="collaboration-preview"
                aria-selected={preview === "tim"}
                onClick={() => setPreview("tim")}
              >
                <Icon name="trophy" size={18} />
                Tim lomba
              </button>
            </div>
            <div className="rail-note">
              <Icon name="book" size={20} />
              <span>
                Tujuan sama.
                <br />
                Langkah bersama.
              </span>
            </div>
          </div>
          <div
            className="workspace-content"
            role="tabpanel"
            id="collaboration-preview"
            aria-labelledby={preview === "partner" ? "partner-tab" : "team-tab"}
          >
            <div className="board-heading">
              <div>
                <p className="section-label">Teman satu tujuan</p>
                <h2>
                  {preview === "partner"
                    ? "Mulai dari minat yang sama."
                    : "Temukan ruang untuk kontribusimu."}
                </h2>
              </div>
              <Link
                className="text-link"
                href={preview === "partner" ? "/partner" : "/tim"}
              >
                Lihat semua <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div className="board-people">
              {preview === "partner"
                ? people.map((u) => (
                    <Link
                      className="board-person"
                      key={u.id}
                      href={"/partner/" + u.id}
                    >
                      <Avatar user={u} />
                      <div>
                        <strong>{u.name}</strong>
                        <span>{u.topics[0]?.name || "Belajar bersama"}</span>
                        <small>{u.topics[0]?.level} · kemampuan mandiri</small>
                      </div>
                      <Icon name="arrow" size={18} />
                    </Link>
                  ))
                : teams.map((t) => (
                    <Link
                      className="board-person"
                      key={t.id}
                      href={"/tim/" + t.id}
                    >
                      <span className="preview-team-icon">
                        <Icon name="users" />
                      </span>
                      <div>
                        <strong>{t.name}</strong>
                        <span>{t.role}</span>
                        <small>
                          {t.capacity - t.members.length} tempat tersedia
                        </small>
                      </div>
                      <Icon name="arrow" size={18} />
                    </Link>
                  ))}
              {!(preview === "partner" ? people.length : teams.length) && (
                <Empty
                  title="Ruang baru menantimu"
                  text="Lengkapi profilmu untuk memulai kolaborasi."
                />
              )}
            </div>
            <div className="board-note">
              <Icon name="book" size={18} />
              <p>
                Bidang, level, dan jadwal membantu kamu memulai percakapan yang
                tepat.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <HowItWorks />

      <section
        className="competition-agenda container"
        aria-labelledby="agenda-title"
      >
        <div className="section-heading">
          <div>
            <p className="section-label">Kesempatan berikutnya</p>
            <h2 id="agenda-title">Ada tantangan untuk idemu.</h2>
          </div>
          <Link href="/lomba" className="text-link">
            Lihat daftar lomba <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="agenda-list">
          {competitions.length ? (
            competitions.map((c) => (
              <article className="agenda-row" key={c.id}>
                <div className="agenda-date">
                  <span>Deadline</span>
                  <time dateTime={c.deadline}>
                    {new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "short",
                      timeZone: "Asia/Jakarta",
                    }).format(new Date(c.deadline))}
                  </time>
                  <small>
                    {new Intl.DateTimeFormat("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Jakarta",
                    }).format(new Date(c.deadline))}{" "}
                    WIB
                  </small>
                </div>
                <div className="agenda-description">
                  <p>
                    {c.category} <span> / </span> {c.level}
                  </p>
                  <h3>
                    <Link href={"/lomba/" + c.id}>{c.name}</Link>
                  </h3>
                  <span>{c.organizer}</span>
                </div>
                <span className="agenda-fee">
                  {c.fee ? "Rp" + c.fee.toLocaleString("id-ID") : "Gratis"}
                </span>
                <Link
                  className="agenda-link icon-button"
                  href={"/lomba/" + c.id}
                  aria-label={"Detail " + c.name}
                >
                  <Icon name="arrow" />
                </Link>
              </article>
            ))
          ) : (
            <Empty
              title="Belum ada lomba terbuka"
              text="Lomba yang masih membuka pendaftaran akan ditampilkan di sini."
            />
          )}
        </div>
      </section>

      <section className="team-section">
        <div className="container team-section-inner">
          <div className="team-section-copy">
            <p className="section-label">Ruang untuk kontribusimu</p>
            <h2>
              Tim yang tepat <br />
              saling melengkapi.
            </h2>
            <p>
              Tidak harus bisa semuanya. Kenali peran yang dibutuhkan dan
              ceritakan apa yang ingin kamu kerjakan.
            </p>
            <Link className="text-link" href="/tim">
              Cari tim yang masih merekrut <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="team-notes">
            {teams.map((t) => (
              <article className="team-note" key={t.id}>
                <div className="row between">
                  <h3>
                    <Link href={"/tim/" + t.id}>{t.name}</Link>
                  </h3>
                  <Status value="Merekrut" />
                </div>
                <p>
                  {
                    p.state.competitions.find((c) => c.id === t.competition)
                      ?.name
                  }
                </p>
                <div className="team-note-role">
                  <span>Peran terbuka</span>
                  <strong>{t.role}</strong>
                </div>
                <Link className="text-link" href={"/tim/" + t.id}>
                  Lihat kebutuhan tim <Icon name="arrow" size={16} />
                </Link>
              </article>
            ))}
            {!teams.length && (
              <Empty
                title="Belum ada tim merekrut"
                text="Kamu bisa membuat tim untuk lomba yang terbuka."
              />
            )}
          </div>
        </div>
      </section>

      <section className="home-closing container">
        <div>
          <p className="section-label">Dari kenalan jadi rekan</p>
          <h2>Mulai dengan memperkenalkan diri.</h2>
          <p>
            Isi bidang dan jadwalmu. Percakapan terbuka setelah permintaan
            partner atau lamaran tim diterima.
          </p>
        </div>
        <Link className="button primary" href={p.user ? "/profil" : "/daftar"}>
          {p.user ? "Lengkapi profil saya" : "Buat profil belajar"}
        </Link>
      </section>
      <AboutTeaser />
    </main>
  );
}
