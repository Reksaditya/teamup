import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  uid,
  now,
  date,
  closed,
  blocked,
  canRead,
  personalId,
  decideRequest,
  decideApplication,
  sendMessage,
  type User,
  type Competition,
} from "../lib/demo";
import type { Shared } from "./teamup";
import {
  Icon,
  Avatar,
  Badge,
  Status,
  Field,
  Empty,
  Title,
  formData,
  topics,
  levels,
} from "./ui";
import { DataState, StateView } from "./pages";
import { PhotoInput, ScheduleEditor } from "./controls";
export function Activities(p: Shared) {
  const [tab, setTab] = useState("partner"),
    [direction, setDirection] = useState("Masuk"),
    [status, setStatus] = useState(""),
    [view, setView] = useState("normal");
  const requests = p.state.requests.filter(
    (r) =>
      (direction === "Masuk" ? r.to : r.from) === p.user?.id &&
      (!status || r.status === status),
  );
  const applications = p.state.applications.filter(
    (a) =>
      (direction === "Masuk"
        ? p.state.teams.find((t) => t.id === a.team)?.leader === p.user?.id
        : a.user === p.user?.id) &&
      (!status || a.status === status),
  );
  return (
    <main className="container page">
      <Title
        eyebrow="LANGKAH KOLABORASIMU"
        title="Setiap koneksi punya cerita."
        text="Kelola permintaan partner dan lamaran tim di satu tempat."
      />
      <div className="tabs">
        <button
          className={tab === "partner" ? "active" : ""}
          onClick={() => setTab("partner")}
        >
          Permintaan partner
        </button>
        <button
          className={tab === "team" ? "active" : ""}
          onClick={() => setTab("team")}
        >
          Lamaran tim
        </button>
      </div>
      <div className="results-heading">
        <div className="segmented">
          {["Masuk", "Terkirim"].map((d) => (
            <button
              key={d}
              className={direction === d ? "selected" : ""}
              onClick={() => setDirection(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <select
          aria-label="Filter status aktivitas"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Semua status</option>
          {[
            "Menunggu",
            "Diterima",
            "Ditolak",
            "Dibatalkan",
            "Ditutup sistem",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <DataState value={view} onChange={setView} />
      </div>
      <StateView value={view} retry={() => setView("normal")}>
        {tab === "partner" ? (
          requests.length ? (
            <div className="activity-list">
              {requests.map((r) => {
                const u = p.state.users.find(
                  (u) => u.id === (direction === "Masuk" ? r.from : r.to),
                )!;
                return (
                  <article className="card activity-item" key={r.id}>
                    <Avatar user={u} />
                    <div className="activity-content">
                      <Link className="person-name" href={"/partner/" + u.id}>
                        {u.name}
                      </Link>
                      <p>
                        {direction === "Masuk"
                          ? "Ingin belajar bareng kamu"
                          : "Permintaan partner belajarmu"}
                      </p>
                      <small>{date(r.at)}</small>
                    </div>
                    <Status value={r.status} />
                    <div className="actions">
                      {r.status === "Menunggu" ? (
                        direction === "Masuk" ? (
                          <>
                            <button
                              className="button secondary small"
                              onClick={() =>
                                p.confirm(
                                  "Tolak permintaan?",
                                  "Status penolakan akan terlihat oleh pengirim.",
                                  () =>
                                    p.commit(
                                      (s) =>
                                        decideRequest(
                                          s,
                                          r.id,
                                          p.user!.id,
                                          "Ditolak",
                                        ),
                                      "Permintaan ditolak.",
                                    ),
                                  "Tolak",
                                )
                              }
                            >
                              Tolak
                            </button>
                            <button
                              className="button primary small"
                              onClick={() =>
                                p.commit(
                                  (s) =>
                                    decideRequest(
                                      s,
                                      r.id,
                                      p.user!.id,
                                      "Diterima",
                                    ),
                                  "Partner diterima. Chat personal siap dibuka.",
                                )
                              }
                            >
                              Terima <Icon name="check" size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            className="button secondary small"
                            onClick={() =>
                              p.confirm(
                                "Batalkan permintaan?",
                                "Permintaan ini tidak akan dapat diterima setelah dibatalkan.",
                                () =>
                                  p.commit(
                                    (s) =>
                                      decideRequest(
                                        s,
                                        r.id,
                                        p.user!.id,
                                        "Dibatalkan",
                                      ),
                                    "Permintaan dibatalkan.",
                                  ),
                                "Batalkan permintaan",
                              )
                            }
                          >
                            Batalkan
                          </button>
                        )
                      ) : r.status === "Diterima" ? (
                        <Link
                          className="button primary small"
                          href={"/pesan/" + personalId(r.from, r.to)}
                        >
                          Buka chat <Icon name="chat" size={16} />
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <Empty
              title="Belum ada permintaan di sini"
              text="Temukan partner dan mulai dari satu sapaan."
            >
              <Link className="button primary" href="/partner">
                Cari partner
              </Link>
            </Empty>
          )
        ) : applications.length ? (
          <div className="activity-list">
            {applications.map((a) => {
              const t = p.state.teams.find((t) => t.id === a.team)!;
              const u = p.state.users.find((u) => u.id === a.user)!;
              return (
                <article className="card application-item" key={a.id}>
                  <div className="row between">
                    <div className="person-heading">
                      <Avatar user={u} />
                      <div>
                        <Link className="person-name" href={"/partner/" + u.id}>
                          {u.name}
                        </Link>
                        <p>
                          Melamar ke <Link href={"/tim/" + t.id}>{t.name}</Link>{" "}
                          · {a.role}
                        </p>
                      </div>
                    </div>
                    <Status value={a.status} />
                  </div>
                  <p className="application-message">“{a.message}”</p>
                  <div className="row between">
                    <small>{date(a.at)}</small>
                    <div className="actions">
                      {a.status === "Menunggu" ? (
                        direction === "Masuk" ? (
                          <>
                            <button
                              className="button secondary small"
                              onClick={() =>
                                p.confirm(
                                  "Tolak lamaran?",
                                  "Pelamar akan melihat status ditolak.",
                                  () =>
                                    p.commit(
                                      (s) =>
                                        decideApplication(
                                          s,
                                          a.id,
                                          p.user!.id,
                                          "Ditolak",
                                        ),
                                      "Lamaran ditolak.",
                                    ),
                                  "Tolak",
                                )
                              }
                            >
                              Tolak
                            </button>
                            <button
                              className="button primary small"
                              onClick={() =>
                                p.commit(
                                  (s) =>
                                    decideApplication(
                                      s,
                                      a.id,
                                      p.user!.id,
                                      "Diterima",
                                    ),
                                  "Anggota diterima dan mendapat akses chat grup.",
                                )
                              }
                            >
                              Terima
                            </button>
                          </>
                        ) : (
                          <button
                            className="button secondary small"
                            onClick={() =>
                              p.confirm(
                                "Batalkan lamaran?",
                                "Lamaran ini tidak dapat diterima setelah dibatalkan.",
                                () =>
                                  p.commit(
                                    (s) =>
                                      decideApplication(
                                        s,
                                        a.id,
                                        p.user!.id,
                                        "Dibatalkan",
                                      ),
                                    "Lamaran dibatalkan.",
                                  ),
                                "Batalkan lamaran",
                              )
                            }
                          >
                            Batalkan
                          </button>
                        )
                      ) : a.status === "Diterima" ? (
                        <Link
                          className="button primary small"
                          href={"/tim/" + t.id}
                        >
                          Lihat tim
                        </Link>
                      ) : a.status === "Ditutup sistem" ? (
                        <small>
                          Ditutup karena kapasitas, keanggotaan, atau perubahan
                          akses.
                        </small>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <Empty
            title="Belum ada lamaran di sini"
            text="Lamaran masuk hanya ditampilkan kepada ketua tim terkait."
          >
            <Link className="button primary" href="/tim">
              Jelajahi tim
            </Link>
          </Empty>
        )}
      </StateView>
    </main>
  );
}

export function Chat(p: Shared & { id?: string }) {
  const [draft, setDraft] = useState(""),
    [search, setSearch] = useState(""),
    [limit, setLimit] = useState(30),
    [view, setView] = useState("normal"),
    [newMessages, setNewMessages] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const id = p.id ? decodeURIComponent(p.id) : "";
  const convs = [
    ...p.state.requests
      .filter(
        (r) => r.status === "Diterima" && [r.from, r.to].includes(p.user!.id),
      )
      .map((r) => {
        const u = p.state.users.find(
          (u) => u.id === (r.from === p.user!.id ? r.to : r.from),
        )!;
        return {
          id: personalId(r.from, r.to),
          name: u.name,
          user: u,
          type: "Personal",
        };
      }),
    ...p.state.teams
      .filter((t) => t.members.includes(p.user!.id))
      .map((t) => ({
        id: "team:" + t.id,
        name: t.name,
        user: undefined,
        type: t.status === "Bubar" ? "Grup · hanya-baca" : "Grup tim",
      })),
  ];
  const conversation = convs.find((c) => c.id === id);
  const allowed = canRead(p.state, id, p.user!.id);
  const t = p.state.teams.find((t) => "team:" + t.id === id);
  const locked =
    !p.user?.verified ||
    t?.status === "Bubar" ||
    (conversation?.user && blocked(p.state, p.user!.id, conversation.user.id));
  const messages = allowed
    ? p.state.messages.filter((m) => m.conversation === id)
    : [];
  useEffect(() => {
    const el = scroll.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 240)
      el.scrollTop = el.scrollHeight;
    else {
      const frame = requestAnimationFrame(() => setNewMessages(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [p.state.messages.length]);
  function retry(mid: string) {
    const m = p.state.messages.find((m) => m.id === mid)!;
    if (p.offline) {
      p.commit(() => {
        throw Error(
          "Koneksi simulasi masih terputus. Sambungkan kembali untuk mencoba.",
        );
      });
      return;
    }
    p.commit(
      (s) => sendMessage(s, id, p.user!.id, m.text, m.id),
      "Pesan demo terkirim.",
    );
  }
  return (
    <main className={"chat-shell " + (id ? "conversation-open" : "")}>
      <aside className="chat-sidebar">
        <div className="chat-list-title">
          <div className="eyebrow">RUANG KOLABORASI</div>
          <h1>
            Pesan<span>.</span>
          </h1>
          <label className="compact-search">
            <Icon name="search" size={18} />
            <input
              aria-label="Cari percakapan"
              placeholder="Cari percakapan…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        <div className="conversation-list">
          {convs
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
            .map((c) => {
              const last = p.state.messages
                .filter((m) => m.conversation === c.id)
                .at(-1);
              return (
                <Link
                  className={
                    "conversation-item " + (id === c.id ? "selected" : "")
                  }
                  href={"/pesan/" + c.id}
                  key={c.id}
                >
                  {c.user ? (
                    <Avatar user={c.user} />
                  ) : (
                    <span className="team-mark">
                      <Icon name="users" />
                    </span>
                  )}
                  <div>
                    <strong>{c.name}</strong>
                    <span>{c.type}</span>
                    <p>
                      {(last &&
                        (p.state.blocks.some(
                          (b) => b.from === p.user?.id && b.to === last.user,
                        )
                          ? "Pesan disembunyikan"
                          : last.text)) ||
                        "Mulai percakapan baru"}
                    </p>
                  </div>
                </Link>
              );
            })}
          {!convs.length && (
            <Empty
              title="Belum ada percakapan"
              text="Chat terbuka setelah partner diterima atau kamu bergabung dengan tim."
            />
          )}
        </div>
        <div className="chat-sidebar-bottom">
          <Icon name="shield" size={17} /> Hanya untuk kolaborasi yang
          terhubung.
        </div>
      </aside>
      <section className="chat-main">
        {!id ? (
          <Empty
            title="Obrolan kecil, ide besar."
            text="Pilih percakapan dan mulai langkah kolaborasi berikutnya."
          >
            <Icon name="chat" size={48} />
          </Empty>
        ) : !allowed || !conversation ? (
          <Empty
            title="Akses percakapan ditolak"
            text="Kamu bukan peserta yang berhak, sudah keluar dari tim, atau akun dibatasi."
          />
        ) : (
          <>
            <div className="chat-heading">
              <button
                className="icon-button chat-back"
                aria-label="Kembali ke daftar pesan"
                onClick={() => router.push("/pesan")}
              >
                <Icon name="back" />
              </button>
              {conversation.user ? (
                <Avatar user={conversation.user} />
              ) : (
                <span className="team-mark">
                  <Icon name="users" />
                </span>
              )}
              <div>
                <strong>{conversation.name}</strong>
                <p>{conversation.type}</p>
              </div>
              <div className="actions push-right">
                {conversation.user && (
                  <button
                    className="icon-button"
                    aria-label="Blokir pengguna"
                    onClick={() => p.block(conversation.user!)}
                  >
                    <Icon name="lock" size={18} />
                  </button>
                )}
                {t && (
                  <Link
                    className="icon-button"
                    href={"/tim/" + t.id}
                    aria-label="Lihat tim"
                  >
                    <Icon name="users" />
                  </Link>
                )}
                <button
                  className="icon-button"
                  aria-label="Laporkan percakapan"
                  onClick={() => p.report("Percakapan " + conversation.name)}
                >
                  <Icon name="flag" size={18} />
                </button>
              </div>
            </div>
            <div className="chat-tools">
              <button
                className={"text-link " + (p.offline ? "warning-text" : "")}
                onClick={() => p.setOffline(!p.offline)}
              >
                <Icon name="wifi" size={15} />
                {p.offline ? "Sambungkan kembali" : "Simulasi putus koneksi"}
              </button>
              <DataState value={view} onChange={setView} />
            </div>
            {p.offline && (
              <div className="notice warning">
                Koneksi simulasi terputus. Pesan gagal tetap tersimpan untuk
                dikirim ulang.
              </div>
            )}
            {t &&
              p.state.blocks.some(
                (b) => b.from === p.user!.id && t.members.includes(b.to),
              ) && (
                <div className="notice">
                  Kamu masih satu tim dengan pengguna yang diblokir. Pesannya
                  disembunyikan untukmu.{" "}
                  <Link className="text-link" href={"/tim/" + t.id}>
                    Kelola keanggotaan
                  </Link>
                </div>
              )}
            <div className="message-history" ref={scroll}>
              <StateView value={view} retry={() => setView("normal")}>
                {messages.length > limit && (
                  <button
                    className="button secondary small"
                    onClick={() => {
                      const el = scroll.current;
                      const height = el?.scrollHeight || 0;
                      setLimit(limit + 30);
                      requestAnimationFrame(() => {
                        if (el) el.scrollTop = el.scrollHeight - height;
                      });
                    }}
                  >
                    Muat pesan sebelumnya
                  </button>
                )}
                <div className="chat-date">Riwayat demo · semua waktu WIB</div>
                {!messages.length && (
                  <Empty
                    title="Mulai percakapanmu"
                    text="Sapa rekan kolaborasimu dengan pesan pertama."
                  />
                )}
                {messages.slice(-limit).map((m) => {
                  const u = p.state.users.find((u) => u.id === m.user)!;
                  const hidden = p.state.blocks.some(
                    (b) => b.from === p.user!.id && b.to === m.user,
                  );
                  return (
                    <div
                      key={m.id}
                      className={
                        "message-row " + (m.user === p.user!.id ? "self" : "")
                      }
                    >
                      <div className="message-bubble">
                        {t && (
                          <strong className="message-sender">{u.name}</strong>
                        )}
                        <p>
                          {hidden
                            ? "Pesan pengguna yang diblokir disembunyikan."
                            : m.text}
                        </p>
                        <div className="message-meta">
                          <time dateTime={m.at}>{date(m.at)}</time>
                          <span
                            className={
                              m.status === "Gagal" ? "danger-text" : ""
                            }
                          >
                            {m.status === "Terkirim"
                              ? "Terkirim (demo)"
                              : m.status}
                          </span>
                          {!hidden && m.user !== p.user!.id && (
                            <button
                              aria-label={"Laporkan pesan dari " + u.name}
                              onClick={() =>
                                p.report(
                                  "Pesan dari " + u.name,
                                  m.id + " · " + m.text,
                                )
                              }
                            >
                              <Icon name="flag" size={12} />
                            </button>
                          )}
                        </div>
                        {m.status === "Gagal" && m.user === p.user!.id && (
                          <button
                            className="text-link"
                            onClick={() => retry(m.id)}
                          >
                            Kirim ulang
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </StateView>
            </div>
            {newMessages && (
              <button
                className="new-messages button secondary small"
                onClick={() => {
                  if (scroll.current)
                    scroll.current.scrollTop = scroll.current.scrollHeight;
                  setNewMessages(false);
                }}
              >
                Pesan baru ↓
              </button>
            )}
            {locked && (
              <div className="notice">
                {t?.status === "Bubar"
                  ? "Tim bubar. Percakapan hanya dapat dibaca."
                  : !p.user?.verified
                    ? "Verifikasi email untuk mengirim pesan."
                    : "Pesan personal dibatasi karena blokir."}
              </div>
            )}
            <form
              className="composer"
              onSubmit={(e) => {
                e.preventDefault();
                const text = draft;
                if (!text.trim() || locked) return;
                const mid = uid();
                if (p.offline) {
                  p.commit(
                    (s) => ({
                      ...s,
                      messages: [
                        ...s.messages,
                        {
                          id: mid,
                          conversation: id,
                          user: p.user!.id,
                          text,
                          at: now(),
                          status: "Gagal",
                        },
                      ],
                    }),
                    "Pesan belum terkirim. Sambungkan lalu pilih Kirim ulang.",
                  );
                  setDraft("");
                } else if (
                  p.commit((s) => sendMessage(s, id, p.user!.id, text, mid))
                )
                  setDraft("");
              }}
            >
              <div>
                <textarea
                  aria-label="Tulis pesan"
                  placeholder="Tulis ide, sapa temanmu…"
                  value={draft}
                  maxLength={2000}
                  disabled={!!locked}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
                <small>
                  {draft.length}/2.000 · Enter kirim, Shift+Enter baris baru
                </small>
              </div>
              <button
                className="button primary"
                aria-label="Kirim pesan"
                disabled={!!locked || !draft.trim()}
              >
                <Icon name="send" />
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

export function ProfileForm(p: Shared) {
  const [step, setStep] = useState(0),
    [error, setError] = useState(""),
    [profile, setProfile] = useState<User>(() => ({
      ...p.user!,
      topics: [...p.user!.topics],
    }));
  const router = useRouter();
  function update(key: keyof User, value: unknown) {
    setProfile((s) => ({ ...s, [key]: value }));
  }
  return (
    <main className="container page narrow">
      <Title
        eyebrow="KENALKAN DIRIMU"
        title="Profil kecil. Peluang besar."
        text="Bantu teman kolaborasimu mengenal minat dan waktu belajarmu."
      />
      <div className="profile-links">
        <Link className="text-link" href="/diblokir">
          Pengguna diblokir
        </Link>
        <Link className="text-link" href="/privasi">
          Privasi & data
        </Link>
      </div>
      <div className="stepper">
        {["Identitas", "Bidang & level", "Jadwal belajar"].map((s, i) => (
          <button
            key={s}
            className={i === step ? "active" : i < step ? "done" : ""}
            onClick={() => setStep(i)}
          >
            <span>{i < step ? <Icon name="check" size={16} /> : i + 1}</span>
            {s}
          </button>
        ))}
      </div>
      <form
        className="card form-card"
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          if (step < 2) {
            setStep(step + 1);
            return;
          }
          const missing = [];
          if (
            !profile.name.trim() ||
            !profile.institution.trim() ||
            !profile.major.trim() ||
            !profile.city.trim()
          )
            missing.push(
              "Lengkapi nama, institusi, jurusan/kelas, dan kota pada langkah Identitas.",
            );
          if (!profile.topics.length)
            missing.push("Pilih sedikitnya satu bidang dan level.");
          if (
            (profile.availability || [profile]).some(
              (a) => !a.start || !a.end || a.start >= a.end,
            )
          )
            missing.push(
              "Waktu selesai harus setelah waktu mulai. Jadwal lintas tengah malam dibagi menjadi dua interval.",
            );
          if (missing.length) {
            setError(missing.join(" "));
            return;
          }
          p.commit(
            (s) => ({
              ...s,
              users: s.users.map((u) =>
                u.id === profile.id ? { ...profile, complete: true } : u,
              ),
            }),
            "Profil demo berhasil disimpan.",
          );
          router.push("/partner");
        }}
      >
        {error && (
          <div className="notice danger" role="alert" tabIndex={-1}>
            {error}
          </div>
        )}
        {step === 0 ? (
          <>
            <div className="profile-avatar-edit">
              <Avatar user={profile} size="large" />
              <div>
                <strong>Foto profilmu</strong>
                <PhotoInput
                  profile={profile}
                  onChange={(photo) => update("photo", photo)}
                />
              </div>
            </div>
            <Field label="Nama tampilan (wajib)">
              <input
                required
                value={profile.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </Field>
            <Field label="Institusi (wajib)">
              <input
                required
                value={profile.institution}
                onChange={(e) => update("institution", e.target.value)}
                placeholder="Sekolah atau universitas"
              />
            </Field>
            <div className="grid two">
              <Field label="Jurusan / kelas (wajib)">
                <input
                  required
                  value={profile.major}
                  onChange={(e) => update("major", e.target.value)}
                />
              </Field>
              <Field label="Kota / kabupaten (wajib)">
                <input
                  required
                  value={profile.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Tentang kamu">
              <textarea
                value={profile.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="Apa yang ingin kamu pelajari dan bagikan?"
              />
            </Field>
          </>
        ) : step === 1 ? (
          <>
            <h3>Bidang yang menarik buatmu</h3>
            <p className="muted">
              Pilih sedikitnya satu bidang. Level merupakan penilaian mandiri.
            </p>
            {topics.map((t) => {
              const selected = profile.topics.find((x) => x.name === t);
              return (
                <div className="topic-select" key={t}>
                  <label className="check-field">
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={(e) =>
                        update(
                          "topics",
                          e.target.checked
                            ? [...profile.topics, { name: t, level: "Pemula" }]
                            : profile.topics.filter((x) => x.name !== t),
                        )
                      }
                    />
                    {t}
                  </label>
                  {selected && (
                    <select
                      aria-label={"Level " + t}
                      value={selected.level}
                      onChange={(e) =>
                        update(
                          "topics",
                          profile.topics.map((x) =>
                            x.name === t ? { ...x, level: e.target.value } : x,
                          ),
                        )
                      }
                    >
                      {levels.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
            <div className="notice">
              <Icon name="info" /> Level ini diisi sendiri oleh pengguna, bukan
              sertifikasi keahlian.
            </div>
          </>
        ) : (
          <>
            <Field label="Mode belajar">
              <select
                value={profile.mode}
                onChange={(e) => update("mode", e.target.value)}
              >
                <option>Online</option>
                <option>Offline</option>
                <option>Keduanya</option>
              </select>
            </Field>
            <ScheduleEditor
              values={
                profile.availability || [
                  {
                    day: profile.day,
                    start: profile.start,
                    end: profile.end,
                    zone: profile.zone,
                  },
                ]
              }
              onChange={(values) =>
                setProfile((s) => ({
                  ...s,
                  ...values[0],
                  availability: values,
                }))
              }
            />
            <div className="notice">
              <Icon name="lock" /> Jadwal hanya terlihat oleh member. Email
              tidak ditampilkan pada profil publik.
            </div>
          </>
        )}
        <div className="actions end">
          {step > 0 && (
            <button
              type="button"
              className="button secondary"
              onClick={() => setStep(step - 1)}
            >
              Kembali
            </button>
          )}
          <button className="button primary">
            {step === 2 ? "Simpan profil" : "Lanjut"} <Icon name="arrow" />
          </button>
        </div>
      </form>
    </main>
  );
}

export function Auth(p: Shared & { kind: string }) {
  const router = useRouter(),
    [show, setShow] = useState(false),
    [error, setError] = useState(""),
    [sent, setSent] = useState(false),
    [reset, setReset] = useState(false),
    [used, setUsed] = useState(false),
    [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (!cooldown) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);
  function finish(id: string) {
    p.commit((s) => ({ ...s, session: id }));
    const target = new URLSearchParams(window.location.search).get("next");
    router.push(
      target && target.startsWith("/") && !target.startsWith("//")
        ? target
        : "/partner",
    );
  }
  const kind = p.kind;
  return (
    <main className="auth-page">
      <div className="auth-decoration" aria-hidden="true">
        <Icon name="spark" size={60} />
        <p>
          Mulai sendiri.
          <br />
          <span>Tumbuh bersama.</span>
        </p>
        <div className="avatar-stack">
          {p.state.users.slice(0, 4).map((u) => (
            <Avatar user={u} key={u.id} />
          ))}
        </div>
        <small>Temukan ruang untuk ide dan ambisimu.</small>
      </div>
      <section className="card auth-card">
        <Badge tone="info">
          {kind === "verifikasi" ? "SATU LANGKAH LAGI" : "LET’S TEAM UP"}
        </Badge>
        <h1>
          {kind === "masuk"
            ? "Senang kamu kembali."
            : kind === "daftar"
              ? "Awal dari cerita baru."
              : kind === "verifikasi"
                ? "Verifikasi emailmu."
                : "Lupa password?"}
        </h1>
        <p>
          {kind === "masuk"
            ? "Masuk dan lanjutkan langkah kolaborasimu."
            : kind === "daftar"
              ? "Temukan orang yang membuatmu ingin maju."
              : kind === "verifikasi"
                ? "Email terverifikasi membantu menjaga ruang kolaborasi."
                : "Kita bantu kamu kembali ke ruang kolaborasi."}
        </p>
        {error && (
          <div role="alert" className="notice danger">
            {error}
          </div>
        )}
        {["masuk", "daftar"].includes(kind) ? (
          <>
            <button
              className="button secondary full"
              onClick={() =>
                p.setModal({
                  title: "Simulasi login Google",
                  content: (
                    <>
                      <p className="dialog-description">
                        Ini bukan OAuth nyata. Lanjutkan sebagai akun demo Alya,
                        atau batalkan tanpa membuat akun.
                      </p>
                      <div className="actions end">
                        <button
                          className="button secondary"
                          onClick={() => p.setModal(null)}
                        >
                          Batal
                        </button>
                        <button
                          className="button primary"
                          onClick={() => {
                            p.setModal(null);
                            finish("alya");
                          }}
                        >
                          Lanjutkan simulasi
                        </button>
                      </div>
                    </>
                  ),
                })
              }
            >
              <span className="google-g">G</span> Lanjutkan dengan Google
            </button>
            <div className="form-divider">
              <span />
              atau dengan email
              <span />
            </div>
            <form
              onSubmit={(e) => {
                const f = formData(e);
                setError("");
                if (kind === "masuk") {
                  const u = p.state.users.find(
                    (u) => u.email.toLowerCase() === f.email.toLowerCase(),
                  );
                  if (!u || u.suspended || f.password.length < 8) {
                    setError(
                      "Email atau password tidak valid, atau akun tidak dapat diakses.",
                    );
                    return;
                  }
                  finish(u.id);
                } else {
                  if (
                    p.state.users.some(
                      (u) => u.email.toLowerCase() === f.email.toLowerCase(),
                    )
                  ) {
                    setError(
                      "Email ini tidak dapat digunakan. Coba masuk atau reset password.",
                    );
                    return;
                  }
                  const id = uid();
                  const u: User = {
                    id,
                    name: f.name,
                    email: f.email,
                    institution: "",
                    major: "",
                    city: "",
                    bio: "",
                    topics: [],
                    mode: "Online",
                    day: "Sabtu",
                    start: "19:00",
                    end: "21:00",
                    zone: "Asia/Jakarta",
                    verified: false,
                    complete: false,
                    suspended: false,
                    color: 0,
                  };
                  p.commit(
                    (s) => ({ ...s, users: [...s.users, u], session: id }),
                    "Akun demo dibuat.",
                  );
                  router.push("/verifikasi");
                }
              }}
            >
              {kind === "daftar" && (
                <Field label="Nama tampilan (wajib)">
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Nama panggilanmu"
                  />
                </Field>
              )}
              <Field label="Email (wajib)">
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="alya@demo.teamup.test"
                />
              </Field>
              <Field
                label="Password (wajib)"
                hint="Minimal 8 karakter. Gunakan password contoh, bukan password asli."
              >
                <div className="password-field">
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    required
                    minLength={8}
                    autoComplete={
                      kind === "masuk" ? "current-password" : "new-password"
                    }
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={
                      show ? "Sembunyikan password" : "Tampilkan password"
                    }
                    onClick={() => setShow(!show)}
                  >
                    <Icon name="eye" size={18} />
                  </button>
                </div>
              </Field>
              {kind === "masuk" ? (
                <Link className="text-link forgot" href="/reset-password">
                  Lupa password?
                </Link>
              ) : (
                <p className="privacy-copy">
                  Data digunakan untuk profil, pencarian, dan kolaborasi. Baca{" "}
                  <Link href="/privasi">pemberitahuan privasi demo</Link>{" "}
                  sebelum melanjutkan.
                </p>
              )}
              <button className="button primary full">
                {kind === "masuk" ? "Masuk ke TeamUp" : "Buat akun demo"}{" "}
                <Icon name="arrow" />
              </button>
            </form>
            <p className="auth-switch">
              {kind === "masuk" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
              <Link href={kind === "masuk" ? "/daftar" : "/masuk"}>
                {kind === "masuk" ? "Daftar gratis" : "Masuk"}
              </Link>
            </p>
            <small>
              Untuk akun demo gunakan email pada persona, misalnya
              alya@demo.teamup.test, dengan teks password contoh minimal 8
              karakter.
            </small>
          </>
        ) : kind === "verifikasi" ? (
          p.user ? (
            <>
              <div className="verification-icon">
                <Icon name={p.user.verified ? "check" : "mail"} size={36} />
              </div>
              <p className="centered">
                {p.user.verified ? (
                  "Email demo sudah diverifikasi."
                ) : (
                  <>
                    Tautan contoh untuk <strong>{p.user.email}</strong>
                  </>
                )}
              </p>
              {!p.user.verified ? (
                <>
                  <button
                    className="button primary full"
                    disabled={used}
                    onClick={() => {
                      p.commit(
                        (s) => ({
                          ...s,
                          users: s.users.map((u) =>
                            u.id === p.user!.id ? { ...u, verified: true } : u,
                          ),
                        }),
                        "Email demo terverifikasi.",
                      );
                      setUsed(true);
                    }}
                  >
                    Buka tautan verifikasi simulasi <Icon name="arrow" />
                  </button>
                  <button
                    className="text-link"
                    disabled={cooldown > 0}
                    onClick={() => {
                      setCooldown(30);
                      setSent(true);
                    }}
                  >
                    {cooldown
                      ? `Kirim ulang dalam ${cooldown} dtk`
                      : "Simulasi kirim ulang email"}
                  </button>
                  {sent && (
                    <div className="notice">
                      Permintaan kirim ulang demo dicatat. Tidak ada email nyata
                      yang dikirim.
                    </div>
                  )}
                  <button
                    className="text-link"
                    onClick={() =>
                      setError(
                        "Tautan verifikasi tidak valid, sudah dipakai, atau kedaluwarsa. Minta tautan baru.",
                      )
                    }
                  >
                    Uji tautan tidak valid
                  </button>
                </>
              ) : (
                <Link className="button primary full" href="/onboarding">
                  Lengkapi profil <Icon name="arrow" />
                </Link>
              )}
            </>
          ) : (
            <Link className="button primary" href="/masuk">
              Masuk terlebih dahulu
            </Link>
          )
        ) : (
          <>
            {!sent ? (
              <form
                onSubmit={(e) => {
                  formData(e);
                  setSent(true);
                }}
              >
                <Field label="Email akun">
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="Email kamu"
                  />
                </Field>
                <button className="button primary full">
                  Minta petunjuk reset demo
                </button>
              </form>
            ) : !reset ? (
              <>
                <div className="notice success">
                  Jika email ini terdaftar, petunjuk reset akan dikirim. Ini
                  adalah simulasi tanpa pengiriman email.
                </div>
                <button
                  className="button secondary full"
                  onClick={() => setReset(true)}
                >
                  Buka tautan reset simulasi
                </button>
                <button
                  className="text-link"
                  onClick={() =>
                    setError(
                      "Tautan reset tidak valid atau kedaluwarsa. Minta tautan baru.",
                    )
                  }
                >
                  Uji tautan kedaluwarsa
                </button>
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  formData(e);
                  if (used) {
                    setError(
                      "Tautan reset sudah digunakan. Minta tautan baru.",
                    );
                    return;
                  }
                  setUsed(true);
                  p.commit(
                    (s) => ({ ...s, session: null }),
                    "Simulasi reset selesai. Sesi demo saat ini diakhiri; password tidak disimpan.",
                  );
                }}
              >
                <Field label="Password baru contoh">
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={8}
                    placeholder="Minimal 8 karakter"
                  />
                </Field>
                <button className="button primary full">
                  {used
                    ? "Uji penggunaan ulang tautan"
                    : "Simpan password contoh"}
                </button>
                {used && (
                  <Link className="text-link" href="/masuk">
                    Kembali masuk
                  </Link>
                )}
              </form>
            )}
            <Link className="text-link" href="/masuk">
              Kembali ke halaman masuk
            </Link>
          </>
        )}
      </section>
    </main>
  );
}

export function Admin(p: Shared & { section: string }) {
  const [q, setQ] = useState(""),
    [status, setStatus] = useState(""),
    [view, setView] = useState("normal");
  const [openReport, setOpenReport] = useState("");
  const tabs = [
    ["lomba", "Lomba", "trophy"],
    ["pengguna", "Pengguna", "users"],
    ["laporan", "Laporan", "flag"],
    ["catatan", "Catatan tindakan", "activity"],
  ];
  function audit(object: string, action: string, reason: string) {
    return {
      id: uid(),
      actor: p.user!.name,
      object,
      action,
      reason,
      at: now(),
    };
  }
  function competitionForm(c?: Competition) {
    p.setModal({
      title: c ? "Edit informasi lomba" : "Buat draf lomba",
      content: (
        <form
          onSubmit={(e) => {
            const f = formData(e);
            if (new Date(f.date).getTime() < new Date(f.deadline).getTime()) {
              p.commit(() => {
                throw Error("Pelaksanaan harus setelah deadline pendaftaran.");
              });
              return;
            }
            const next: Competition = {
              id: c?.id || uid(),
              name: f.name,
              organizer: f.organizer,
              category: f.category,
              level: f.level,
              fee: Number(f.fee),
              deadline: new Date(f.deadline + "+07:00").toISOString(),
              date: new Date(f.date + "+07:00").toISOString(),
              description: f.description,
              requirements: f.requirements,
              prize: f.prize,
              source: f.source,
              status: "Draf",
              verified: false,
              max: Number(f.max),
              art: c?.art || "design",
            };
            p.commit(
              (s) => ({
                ...s,
                competitions: [
                  ...s.competitions.filter((x) => x.id !== next.id),
                  next,
                ],
                audit: [
                  ...s.audit,
                  audit(
                    next.name,
                    c ? "Ubah → Draf" : "Buat draf",
                    "Informasi baru wajib ditinjau sebelum tayang.",
                  ),
                ],
              }),
              "Draf lomba demo disimpan.",
            );
            p.setModal(null);
          }}
        >
          <div className="notice">
            Semua tanggal diinput dalam WIB (UTC+7). Perubahan lomba tayang
            kembali menjadi draf.
          </div>
          <Field label="Judul (wajib)">
            <input name="name" required defaultValue={c?.name} />
          </Field>
          <Field label="Penyelenggara (wajib)">
            <input name="organizer" required defaultValue={c?.organizer} />
          </Field>
          <div className="grid two">
            <Field label="Kategori">
              <select name="category" defaultValue={c?.category}>
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Tingkat">
              <select name="level" defaultValue={c?.level}>
                <option>Nasional</option>
                <option>Regional</option>
              </select>
            </Field>
          </div>
          <Field label="Deskripsi (wajib)">
            <textarea
              name="description"
              required
              defaultValue={c?.description}
            />
          </Field>
          <Field label="Syarat (wajib)">
            <textarea
              name="requirements"
              required
              defaultValue={c?.requirements}
            />
          </Field>
          <Field label="Hadiah (opsional)">
            <input name="prize" defaultValue={c?.prize} />
          </Field>
          <div className="grid two">
            <Field label="Biaya (Rp)">
              <input
                name="fee"
                type="number"
                min="0"
                required
                defaultValue={c?.fee || 0}
              />
            </Field>
            <Field label="Maksimum anggota">
              <input
                name="max"
                type="number"
                min="2"
                required
                defaultValue={c?.max || 4}
              />
            </Field>
          </div>
          <Field label="Deadline · WIB (wajib)">
            <input
              type="datetime-local"
              name="deadline"
              required
              defaultValue={
                c
                  ? new Date(new Date(c.deadline).getTime() + 7 * 3600000)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
            />
          </Field>
          <Field label="Pelaksanaan · WIB (wajib)">
            <input
              type="datetime-local"
              name="date"
              required
              defaultValue={
                c
                  ? new Date(new Date(c.date).getTime() + 7 * 3600000)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
            />
          </Field>
          <Field label="Sumber / tautan resmi HTTPS (wajib)">
            <input
              type="url"
              pattern="https://.*"
              name="source"
              required
              defaultValue={c?.source || "https://example.com/"}
            />
          </Field>
          <button className="button primary full">Simpan draf demo</button>
        </form>
      ),
    });
  }
  function reasonAction(
    object: string,
    action: string,
    update: (reason: string) => void,
  ) {
    p.setModal({
      title: action,
      content: (
        <form
          onSubmit={(e) => {
            const f = formData(e);
            update(f.reason);
            p.setModal(null);
          }}
        >
          <p className="dialog-description">
            Objek: {object}. Tindakan dan alasan dicatat pada log admin.
          </p>
          <Field label="Alasan (wajib)">
            <textarea name="reason" required />
          </Field>
          <div className="actions end">
            <button
              type="button"
              className="button secondary"
              onClick={() => p.setModal(null)}
            >
              Batal
            </button>
            <button className="button primary">Simpan keputusan</button>
          </div>
        </form>
      ),
    });
  }
  return (
    <main className="container page admin-layout">
      <aside className="admin-sidebar">
        <div className="eyebrow">TEAMUP ADMIN</div>
        {tabs.map(([id, label, icon]) => (
          <Link
            className={p.section === id ? "active" : ""}
            href={"/admin/" + id}
            key={id}
          >
            <Icon name={icon} />
            {label}
          </Link>
        ))}
        <p>
          Panel demo.
          <br />
          Seluruh tindakan hanya mengubah data browser ini.
        </p>
      </aside>
      <section>
        <Title
          title={tabs.find((t) => t[0] === p.section)?.[1] || "Admin"}
          text="Kelola informasi dan jaga ruang kolaborasi tetap nyaman."
        >
          {p.section === "lomba" && (
            <button
              className="button primary"
              onClick={() => competitionForm()}
            >
              <Icon name="plus" /> Tambah lomba
            </button>
          )}
        </Title>
        <div className="results-heading">
          <label className="compact-search">
            <Icon name="search" />
            <input
              aria-label="Cari data admin"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari data…"
            />
          </label>
          <select
            aria-label="Filter status admin"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Semua status</option>
            {(p.section === "lomba"
              ? ["Draf", "Ditinjau", "Tayang", "Ditolak", "Diarsipkan"]
              : p.section === "pengguna"
                ? ["Aktif", "Ditangguhkan"]
                : ["Baru", "Ditinjau", "Ditindak", "Ditutup tanpa tindakan"]
            ).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <DataState value={view} onChange={setView} />
        </div>
        <StateView value={view} retry={() => setView("normal")}>
          {p.section === "lomba" ? (
            <div className="admin-list">
              {p.state.competitions
                .filter(
                  (c) =>
                    c.name.toLowerCase().includes(q.toLowerCase()) &&
                    (!status || c.status === status),
                )
                .map((c) => (
                  <article className="card admin-row" key={c.id}>
                    <div className="row between">
                      <div>
                        <h3>{c.name}</h3>
                        <p>{c.organizer}</p>
                        <small>
                          Deadline: {date(c.deadline)} ·{" "}
                          {closed(c) ? "Ditutup" : "Terbuka"}
                        </small>
                      </div>
                      <Status value={c.status} />
                    </div>
                    <div className="actions">
                      <button
                        className="button secondary small"
                        onClick={() => competitionForm(c)}
                      >
                        Edit
                      </button>
                      {(c.status === "Draf" || c.status === "Ditolak") && (
                        <button
                          className="button secondary small"
                          onClick={() =>
                            p.commit(
                              (s) => ({
                                ...s,
                                competitions: s.competitions.map((x) =>
                                  x.id === c.id
                                    ? { ...x, status: "Ditinjau" }
                                    : x,
                                ),
                                audit: [
                                  ...s.audit,
                                  audit(
                                    c.name,
                                    c.status + " → Ditinjau",
                                    "Diajukan untuk pemeriksaan informasi.",
                                  ),
                                ],
                              }),
                              "Diajukan untuk ditinjau.",
                            )
                          }
                        >
                          Ajukan tinjauan
                        </button>
                      )}
                      {c.status === "Ditinjau" && (
                        <>
                          <button
                            className="button primary small"
                            onClick={() =>
                              reasonAction(
                                c.name,
                                "Setujui & tayangkan",
                                (reason) =>
                                  p.commit(
                                    (s) => ({
                                      ...s,
                                      competitions: s.competitions.map((x) =>
                                        x.id === c.id
                                          ? {
                                              ...x,
                                              status: "Tayang",
                                              verified: true,
                                            }
                                          : x,
                                      ),
                                      audit: [
                                        ...s.audit,
                                        audit(
                                          c.name,
                                          "Ditinjau → Tayang",
                                          reason,
                                        ),
                                      ],
                                    }),
                                    "Lomba demo ditayangkan.",
                                  ),
                              )
                            }
                          >
                            Setujui
                          </button>
                          <button
                            className="button secondary small"
                            onClick={() =>
                              reasonAction(c.name, "Tolak lomba", (reason) =>
                                p.commit(
                                  (s) => ({
                                    ...s,
                                    competitions: s.competitions.map((x) =>
                                      x.id === c.id
                                        ? { ...x, status: "Ditolak" }
                                        : x,
                                    ),
                                    audit: [
                                      ...s.audit,
                                      audit(
                                        c.name,
                                        "Ditinjau → Ditolak",
                                        reason,
                                      ),
                                    ],
                                  }),
                                  "Lomba ditolak.",
                                ),
                              )
                            }
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      {c.status === "Tayang" && (
                        <button
                          className="button secondary small"
                          onClick={() =>
                            reasonAction(c.name, "Arsipkan lomba", (reason) =>
                              p.commit(
                                (s) => ({
                                  ...s,
                                  competitions: s.competitions.map((x) =>
                                    x.id === c.id
                                      ? { ...x, status: "Diarsipkan" }
                                      : x,
                                  ),
                                  audit: [
                                    ...s.audit,
                                    audit(
                                      c.name,
                                      "Tayang → Diarsipkan",
                                      reason,
                                    ),
                                  ],
                                }),
                                "Lomba diarsipkan.",
                              ),
                            )
                          }
                        >
                          Arsipkan
                        </button>
                      )}
                    </div>
                  </article>
                ))}
            </div>
          ) : p.section === "pengguna" ? (
            <div className="admin-list">
              {p.state.users
                .filter(
                  (u) =>
                    !u.admin &&
                    `${u.name} ${u.email}`
                      .toLowerCase()
                      .includes(q.toLowerCase()) &&
                    (!status ||
                      (u.suspended ? "Ditangguhkan" : "Aktif") === status),
                )
                .map((u) => (
                  <article className="card admin-row" key={u.id}>
                    <div className="person-heading">
                      <Avatar user={u} />
                      <div>
                        <h3>{u.name}</h3>
                        <p>{u.email}</p>
                      </div>
                      <Status value={u.suspended ? "Ditangguhkan" : "Aktif"} />
                    </div>
                    <button
                      className="button secondary small"
                      onClick={() =>
                        reasonAction(
                          u.name,
                          u.suspended ? "Pulihkan akun" : "Tangguhkan akun",
                          (reason) =>
                            p.commit(
                              (s) => ({
                                ...s,
                                users: s.users.map((x) =>
                                  x.id === u.id
                                    ? { ...x, suspended: !u.suspended }
                                    : x,
                                ),
                                session: s.session === u.id ? null : s.session,
                                audit: [
                                  ...s.audit,
                                  audit(
                                    u.name,
                                    u.suspended
                                      ? "Ditangguhkan → Aktif"
                                      : "Aktif → Ditangguhkan",
                                    reason,
                                  ),
                                ],
                              }),
                              "Status akun demo diperbarui.",
                            ),
                        )
                      }
                    >
                      {u.suspended ? "Pulihkan" : "Tangguhkan"}
                    </button>
                  </article>
                ))}
            </div>
          ) : p.section === "laporan" ? (
            p.state.reports.length ? (
              <div className="admin-list">
                {p.state.reports
                  .filter(
                    (r) =>
                      `${r.target} ${r.reason}`
                        .toLowerCase()
                        .includes(q.toLowerCase()) &&
                      (!status || r.status === status),
                  )
                  .map((r) => (
                    <article className="card admin-row" key={r.id}>
                      <div className="row between">
                        <h3>{r.target}</h3>
                        <Status value={r.status} />
                      </div>
                      <p>
                        {r.category} · {r.reason}
                      </p>
                      <small>{date(r.at)}</small>
                      {openReport === r.id ? (
                        <div className="notice">
                          Bukti relevan:{" "}
                          {r.evidence || "Tidak ada pesan yang dilampirkan."}
                        </div>
                      ) : (
                        <button
                          className="text-link"
                          onClick={() => {
                            p.commit((s) => ({
                              ...s,
                              audit: [
                                ...s.audit,
                                audit(
                                  r.target,
                                  "Akses bukti laporan",
                                  "Membuka bukti relevan laporan " + r.id,
                                ),
                              ],
                            }));
                            setOpenReport(r.id);
                          }}
                        >
                          Lihat bukti relevan (akses dicatat)
                        </button>
                      )}
                      <div className="actions">
                        {["Ditinjau", "Ditindak", "Ditutup tanpa tindakan"].map(
                          (status) => (
                            <button
                              className="button secondary small"
                              key={status}
                              onClick={() =>
                                reasonAction(r.target, status, (reason) =>
                                  p.commit(
                                    (s) => ({
                                      ...s,
                                      reports: s.reports.map((x) =>
                                        x.id === r.id ? { ...x, status } : x,
                                      ),
                                      audit: [
                                        ...s.audit,
                                        audit(
                                          r.target,
                                          r.status + " → " + status,
                                          reason,
                                        ),
                                      ],
                                    }),
                                    "Keputusan laporan disimpan.",
                                  ),
                                )
                              }
                            >
                              {status}
                            </button>
                          ),
                        )}
                        {r.evidence && (
                          <button
                            className="button secondary small"
                            onClick={() =>
                              reasonAction(
                                r.target,
                                "Sembunyikan pesan dilaporkan",
                                (reason) =>
                                  p.commit(
                                    (s) => ({
                                      ...s,
                                      messages: s.messages.map((m) =>
                                        r.evidence.startsWith(m.id + " · ")
                                          ? {
                                              ...m,
                                              text: "[Konten disembunyikan oleh admin]",
                                            }
                                          : m,
                                      ),
                                      audit: [
                                        ...s.audit,
                                        audit(
                                          r.target,
                                          "Konten disembunyikan",
                                          reason,
                                        ),
                                      ],
                                    }),
                                    "Pesan disembunyikan.",
                                  ),
                              )
                            }
                          >
                            Sembunyikan konten
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
              </div>
            ) : (
              <Empty
                title="Belum ada laporan"
                text="Laporan dari member akan muncul di antrean ini."
              />
            )
          ) : p.section === "catatan" ? (
            p.state.audit.length ? (
              <div className="admin-list">
                {p.state.audit
                  .filter((a) =>
                    `${a.object} ${a.reason} ${a.action}`
                      .toLowerCase()
                      .includes(q.toLowerCase()),
                  )
                  .slice()
                  .reverse()
                  .map((a) => (
                    <article className="card admin-row" key={a.id}>
                      <div className="row between">
                        <strong>{a.action}</strong>
                        <small>{date(a.at)}</small>
                      </div>
                      <p>
                        {a.object} · {a.reason}
                      </p>
                      <small>Aktor: {a.actor}</small>
                    </article>
                  ))}
              </div>
            ) : (
              <Empty
                title="Belum ada catatan tindakan"
                text="Perubahan admin akan dicatat beserta aktor, waktu, objek, dan alasan."
              />
            )
          ) : (
            <Empty title="Halaman admin tidak ditemukan" />
          )}
        </StateView>
      </section>
    </main>
  );
}

export function Information(p: Shared & { kind: string }) {
  const privacy = p.kind === "privasi";
  return (
    <main className="container page narrow">
      <Title
        eyebrow={privacy ? "DATA & PRIVASI" : "KAMI SIAP MEMBANTU"}
        title={privacy ? "Kolaborasi yang kamu pahami." : "Butuh bantuan?"}
        text={
          privacy
            ? "Pemberitahuan penggunaan data untuk prototipe TeamUp."
            : "Panduan singkat untuk langkah kolaborasimu."
        }
      />
      <section className="card detail-card">
        {privacy ? (
          <>
            <h3>Ini adalah prototipe frontend</h3>
            <p>
              Data contoh dan perubahanmu disimpan di localStorage browser ini.
              Tidak ada backend, email transaksi, OAuth Google, atau
              sinkronisasi antarperangkat. Jangan masukkan data sensitif atau
              password asli.
            </p>
            <h3>Data yang digunakan</h3>
            <p>
              Profil berisi nama, institusi, jurusan/kelas, kota, bidang, level
              mandiri, mode, dan jadwal. Data dipakai untuk pencarian partner,
              perekrutan tim, dan percakapan demo.
            </p>
            <h3>Visibilitas profil</h3>
            <p>
              Pengunjung melihat nama tampilan dan bidang. Member dapat melihat
              detail akademik, kota, dan jadwal. Email tidak ditampilkan pada
              profil publik. Pembatasan demo di browser bukan otorisasi server.
            </p>
            <h3>Akses, koreksi, dan penghapusan</h3>
            <p>
              Koreksi profil melalui menu Profil. Gunakan tombol reset pada
              bilah demo untuk menghapus perubahan lokal dan memulihkan data
              awal. Alur permintaan data melalui admin nyata belum tersedia.
            </p>
            <h3>Sebelum peluncuran publik</h3>
            <p>
              Kebijakan usia, persetujuan, retensi chat/laporan/backup, dan
              prosedur penghapusan masih perlu ditetapkan. Halaman ini belum
              merupakan kebijakan layanan produksi.
            </p>
          </>
        ) : (
          <>
            <h3>Bagaimana memulai?</h3>
            <p>
              Daftar akun demo, lakukan simulasi verifikasi, dan lengkapi
              profil. Kamu juga bisa memilih persona pada bilah Mode demo untuk
              langsung menjelajahi aplikasi.
            </p>
            <h3>Kapan chat bisa dibuka?</h3>
            <p>
              Chat personal dibuka setelah permintaan partner diterima. Chat
              grup tersedia bagi anggota tim. Ganti persona untuk mencoba
              keputusan dari sisi penerima atau ketua.
            </p>
            <h3>Bagaimana mencoba kegagalan?</h3>
            <p>
              Gunakan kontrol Simulasi data pada halaman daftar. Di chat, pilih
              Simulasi putus koneksi, kirim pesan, sambungkan kembali, lalu
              pilih Kirim ulang.
            </p>
            <h3>Kontak bantuan sementara</h3>
            <div className="notice">
              <Icon name="mail" />
              <span>
                halo@teamup.example ·{" "}
                <strong>kontak dummy, tidak menerima pesan</strong>
              </span>
            </div>
            <p>
              Belum ada layanan bantuan atau waktu respons yang dijanjikan.
              Semua laporan hanya tersimpan dalam demo browser ini.
            </p>
            <div className="actions">
              <Link className="button secondary" href="/diblokir">
                Pengguna diblokir
              </Link>
              <Link className="button secondary" href="/privasi">
                Privasi & data
              </Link>
            </div>
            {p.user && (
              <>
                <hr />
                <h3>Status laporan saya</h3>
                {p.state.reports.filter((r) => r.user === p.user?.id).length ? (
                  p.state.reports
                    .filter((r) => r.user === p.user?.id)
                    .map((r) => (
                      <div className="list-item" key={r.id}>
                        <div>
                          <strong>{r.target}</strong>
                          <p>{r.reason}</p>
                        </div>
                        <Status value={r.status} />
                      </div>
                    ))
                ) : (
                  <p>Belum ada laporan yang kamu kirim.</p>
                )}
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}
