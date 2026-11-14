"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Shared } from "./teamup";
import { Avatar, Empty, Field, Status, Title, formData, topics } from "./ui";
import {
  date,
  blocked,
  saveGroup,
  requestGroup,
  decideGroup,
  manageGroup,
  GROUP_CAPACITY_MAX,
  type StudyGroup,
  type State,
} from "../lib/demo";

export function attempt(
  p: Shared,
  change: (s: State) => State,
  setError: (message: string) => void,
  done: () => void,
) {
  const ok = p.commit((s) => {
    try {
      return change(s);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Tindakan belum berhasil.",
      );
      throw error;
    }
  });
  if (ok) done();
}
const eligibility = (p: Shared) =>
  !p.user
    ? "Masuk untuk mulai berkolaborasi."
    : !p.user.verified
      ? "Verifikasi email terlebih dahulu."
      : !p.user.complete
        ? "Lengkapi profil terlebih dahulu."
        : "";

function GroupForm({ p, group }: { p: Shared; group?: StudyGroup }) {
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        const f = formData(e);
        setError("");
        attempt(
          p,
          (s) =>
            saveGroup(
              s,
              p.user!.id,
              {
                name: f.name,
                topic: f.topic,
                description: f.description,
                mode: f.mode,
                capacity: Number(f.capacity),
              },
              group?.id,
            ),
          setError,
          () => {
            p.setModal(null);
            router.push("/dashboard/kelompok");
          },
        );
      }}
    >
      {error && (
        <div className="notice danger" role="alert">
          {error}
        </div>
      )}
      <Field label="Nama kelompok">
        <input
          name="name"
          required
          maxLength={100}
          defaultValue={group?.name}
        />
      </Field>
      <Field label="Bidang belajar">
        <select name="topic" defaultValue={group?.topic}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field label="Deskripsi">
        <textarea
          name="description"
          required
          maxLength={2000}
          defaultValue={group?.description}
        />
      </Field>
      <div className="grid two">
        <Field label="Mode belajar">
          <select name="mode" defaultValue={group?.mode}>
            <option>Online</option>
            <option>Offline</option>
            <option>Keduanya</option>
          </select>
        </Field>
        <Field label="Kapasitas termasuk ketua">
          <input
            name="capacity"
            type="number"
            min={Math.max(2, group?.members.length || 1)}
            max={GROUP_CAPACITY_MAX}
            defaultValue={group?.capacity || 6}
            required
          />
        </Field>
      </div>
      <button className="button primary full">
        {group ? "Simpan perubahan" : "Buat kelompok"}
      </button>
    </form>
  );
}
function JoinForm({ p, group }: { p: Shared; group: StudyGroup }) {
  const [error, setError] = useState("");
  return (
    <form
      onSubmit={(e) => {
        const f = formData(e);
        attempt(
          p,
          (s) => requestGroup(s, p.user!.id, group.id, f.message),
          setError,
          () => p.setModal(null),
        );
      }}
    >
      <p className="dialog-description">
        Ceritakan apa yang ingin kamu pelajari bersama {group.name}.
      </p>
      {error && (
        <div className="notice danger" role="alert">
          {error}
        </div>
      )}
      <Field label="Pesan untuk ketua">
        <textarea required name="message" maxLength={2000} />
      </Field>
      <button className="button primary full">
        Kirim permintaan bergabung
      </button>
    </form>
  );
}
export function Groups(p: Shared) {
  const [query, setQuery] = useState(""),
    [mine, setMine] = useState(false),
    [topic, setTopic] = useState("");
  const groups = p.state.groups.filter(
    (g) =>
      (g.status !== "Bubar" || g.members.includes(p.user!.id)) &&
      (!mine || g.members.includes(p.user!.id)) &&
      (!topic || g.topic === topic) &&
      `${g.name} ${g.description}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (g.members.includes(p.user!.id) ||
        !g.members.some((id) => blocked(p.state, id, p.user!.id))),
  );
  const reason = eligibility(p);
  return (
    <main className="dashboard-page">
      <Title
        title="Kelompok belajar"
        text="Temukan teman diskusi dan ruang untuk belajar secara rutin."
      >
        <button
          className="button primary"
          disabled={!!reason}
          onClick={() =>
            p.setModal({
              title: "Buat kelompok belajar",
              content: <GroupForm p={p} />,
            })
          }
        >
          Buat kelompok
        </button>
      </Title>
      {reason && <div className="notice">{reason}</div>}
      <div className="group-filters">
        <Field label="Cari kelompok">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nama atau topik kelompok"
          />
        </Field>
        <Field label="Bidang">
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">Semua bidang</option>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <label className="check-field">
          <input
            type="checkbox"
            checked={mine}
            onChange={(e) => setMine(e.target.checked)}
          />
          Hanya kelompok saya
        </label>
      </div>
      {groups.length ? (
        <div className="grid two">
          {groups.map((g) => (
            <article className="card group-card" key={g.id}>
              <div className="row between">
                <h2>
                  <Link href={"/kelompok/" + g.id}>{g.name}</Link>
                </h2>
                <Status
                  value={
                    g.members.length >= g.capacity && g.status !== "Bubar"
                      ? "Penuh"
                      : g.status
                  }
                />
              </div>
              <p>{g.description}</p>
              <p className="muted">
                {g.topic} · {g.mode}
              </p>
              <p>
                {g.members.length} / {g.capacity} anggota
              </p>
              <Link className="text-link" href={"/kelompok/" + g.id}>
                Lihat kelompok
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Belum ada kelompok yang sesuai"
          text="Coba bidang lain atau buat kelompok belajar pertamamu."
        >
          <button
            className="button secondary"
            onClick={() => {
              setQuery("");
              setTopic("");
              setMine(false);
            }}
          >
            Reset pencarian
          </button>
        </Empty>
      )}
    </main>
  );
}
export function GroupDetail(p: Shared & { id: string }) {
  const router = useRouter();
  const g = p.state.groups.find((g) => g.id === p.id);
  if (!g)
    return (
      <main className="container page">
        <Empty
          page
          title="Kelompok tidak ditemukan"
          text="Kelompok ini tidak tersedia."
        />
      </main>
    );
  const member = !!p.user && g.members.includes(p.user.id),
    leader = g.leader === p.user?.id;
  const pending = p.state.groupRequests.find(
    (r) => r.group === g.id && r.user === p.user?.id && r.status === "Menunggu",
  );
  const reason =
    eligibility(p) ||
    (g.status !== "Merekrut"
      ? "Kelompok tidak membuka permintaan baru."
      : g.members.length >= g.capacity
        ? "Kapasitas kelompok penuh."
        : g.members.some((id) => blocked(p.state, id, p.user!.id))
          ? "Interaksi dibatasi karena blokir."
          : "");
  return (
    <main className="container page">
      <Link className="breadcrumb" href="/dashboard/kelompok">
        Kelompok belajar
      </Link>
      <div className="detail-layout">
        <section className="card detail-card">
          <Status
            value={
              g.status === "Bubar"
                ? "Bubar"
                : g.members.length >= g.capacity
                  ? "Penuh"
                  : g.status
            }
          />
          <h1>{g.name}</h1>
          <p>{g.description}</p>
          <p>
            {g.topic} · {g.mode}
          </p>
          <p>
            <strong>
              {g.members.length} dari {g.capacity} anggota
            </strong>
          </p>
          {member ? (
            <>
              <hr />
              <h2>Anggota kelompok</h2>
              {g.members.map((id) => {
                const u = p.state.users.find((u) => u.id === id);
                return (
                  <div className="row between group-member" key={id}>
                    <div className="row">
                      <Avatar user={u} />
                      <span>
                        {u?.name || "Anggota"}
                        {g.leader === id ? " · Ketua" : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p className="notice">
              Daftar anggota dan chat tersedia setelah permintaan bergabung
              diterima.
            </p>
          )}
        </section>
        <aside className="card action-card">
          <h2>{member ? "Ruang belajarmu" : "Belajar bersama kelompok ini"}</h2>
          {member ? (
            <>
              <Link
                className="button primary"
                href={"/dashboard/pesan/study:" + g.id}
              >
                {g.status === "Bubar"
                  ? "Baca riwayat grup"
                  : "Buka chat kelompok"}
              </Link>
              <Link className="button secondary" href="/dashboard/kalender">
                Kalender bersama
              </Link>
              {g.status === "Bubar" ? (
                <p className="notice">
                  Kelompok bubar. Riwayat chat dan agenda hanya dapat dibaca.
                </p>
              ) : leader ? (
                <>
                  <button
                    className="button secondary"
                    onClick={() =>
                      p.setModal({
                        title: "Edit kelompok",
                        content: <GroupForm p={p} group={g} />,
                      })
                    }
                  >
                    Edit kelompok
                  </button>
                  <button
                    className="button secondary"
                    onClick={() =>
                      p.commit(
                        (s) => manageGroup(s, p.user!.id, g.id, "toggle"),
                        "Status kelompok diperbarui.",
                      )
                    }
                  >
                    {g.status === "Merekrut"
                      ? "Tutup permintaan"
                      : "Buka permintaan"}
                  </button>
                  <Link
                    className="button secondary"
                    href="/dashboard/aktivitas"
                  >
                    Tinjau permintaan
                  </Link>
                  {g.members.length > 1 ? (
                    <button
                      className="button secondary"
                      onClick={() =>
                        p.setModal({
                          title: "Pindahkan kepemimpinan",
                          content: (
                            <form
                              onSubmit={(e) => {
                                const f = formData(e);
                                if (
                                  p.commit(
                                    (s) =>
                                      manageGroup(
                                        s,
                                        p.user!.id,
                                        g.id,
                                        "transfer",
                                        f.member,
                                      ),
                                    "Ketua diperbarui.",
                                  )
                                )
                                  p.setModal(null);
                              }}
                            >
                              <Field label="Ketua baru">
                                <select name="member" required>
                                  {g.members
                                    .filter(
                                      (id) =>
                                        id !== p.user?.id &&
                                        !p.state.users.find((u) => u.id === id)
                                          ?.suspended,
                                    )
                                    .map((id) => (
                                      <option key={id} value={id}>
                                        {
                                          p.state.users.find((u) => u.id === id)
                                            ?.name
                                        }
                                      </option>
                                    ))}
                                </select>
                              </Field>
                              <button className="button primary full">
                                Pindahkan kepemimpinan
                              </button>
                            </form>
                          ),
                        })
                      }
                    >
                      Pindahkan kepemimpinan
                    </button>
                  ) : (
                    <button
                      className="text-link danger-text"
                      onClick={() =>
                        p.confirm(
                          "Bubarkan kelompok?",
                          "Permintaan ditutup. Grup dan agenda menjadi hanya-baca.",
                          () =>
                            p.commit(
                              (s) =>
                                manageGroup(s, p.user!.id, g.id, "dissolve"),
                              "Kelompok dibubarkan.",
                            ),
                          "Bubarkan kelompok",
                        )
                      }
                    >
                      Bubarkan kelompok
                    </button>
                  )}
                  <small>
                    Pindahkan kepemimpinan sebelum keluar jika masih ada anggota
                    lain.
                  </small>
                </>
              ) : (
                <button
                  className="text-link danger-text"
                  onClick={() =>
                    p.confirm(
                      "Keluar dari kelompok?",
                      "Akses chat, riwayat, dan agenda bersama akan berakhir.",
                      () => {
                        if (
                          p.commit(
                            (s) => manageGroup(s, p.user!.id, g.id, "leave"),
                            "Kamu keluar dari kelompok.",
                          )
                        )
                          router.push("/dashboard/kelompok");
                      },
                      "Keluar kelompok",
                    )
                  }
                >
                  Keluar kelompok
                </button>
              )}
            </>
          ) : !p.user ? (
            <Link
              className="button primary"
              href={"/masuk?next=" + encodeURIComponent("/kelompok/" + g.id)}
            >
              Masuk untuk bergabung
            </Link>
          ) : pending ? (
            <Link className="button secondary" href="/dashboard/aktivitas">
              Permintaan menunggu
            </Link>
          ) : (
            <>
              <button
                className="button primary"
                disabled={!!reason}
                onClick={() =>
                  p.setModal({
                    title: "Bergabung dengan " + g.name,
                    content: <JoinForm p={p} group={g} />,
                  })
                }
              >
                Ajukan permintaan
              </button>
              {reason && <small>{reason}</small>}
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
export function GroupApplications(p: Shared) {
  const [filter, setFilter] = useState("");
  const requests = p.state.groupRequests.filter(
    (r) =>
      (r.user === p.user!.id ||
        p.state.groups.find((g) => g.id === r.group)?.leader === p.user!.id) &&
      (!filter || r.status === filter),
  );
  return (
    <section className="group-requests" aria-labelledby="group-requests-title">
      <div className="section-heading">
        <h2 id="group-requests-title">Permintaan kelompok belajar</h2>
        <label className="field">
          Status kelompok
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Semua status</option>
            {[
              "Menunggu",
              "Diterima",
              "Ditolak",
              "Dibatalkan",
              "Ditutup sistem",
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>
      {requests.length ? (
        requests.map((r) => {
          const g = p.state.groups.find((g) => g.id === r.group)!;
          const own = r.user === p.user!.id;
          return (
            <article className="card group-request" key={r.id}>
              <div className="row between">
                <h3>
                  <Link href={"/kelompok/" + g.id}>{g.name}</Link>
                </h3>
                <Status value={r.status} />
              </div>
              <p>
                {p.state.users.find((u) => u.id === r.user)?.name} ·{" "}
                {own ? "Terkirim" : "Masuk"}
              </p>
              <p>{r.message}</p>
              <small>{date(r.at)}</small>
              {r.reason && <p>{r.reason}</p>}
              {r.status === "Menunggu" && (
                <div className="actions">
                  {(own ? ["Dibatalkan"] : ["Diterima", "Ditolak"]).map(
                    (status) => (
                      <button
                        key={status}
                        className={
                          "button " +
                          (status === "Diterima" ? "primary" : "secondary")
                        }
                        onClick={() =>
                          p.confirm(
                            status === "Diterima"
                              ? "Terima anggota?"
                              : status === "Ditolak"
                                ? "Tolak permintaan?"
                                : "Batalkan permintaan?",
                            "Keputusan akan memperbarui status dan akses kelompok.",
                            () =>
                              p.commit(
                                (s) =>
                                  decideGroup(
                                    s,
                                    p.user!.id,
                                    r.id,
                                    status as
                                      "Diterima" | "Ditolak" | "Dibatalkan",
                                  ),
                                "Status permintaan diperbarui.",
                              ),
                            status === "Diterima"
                              ? "Terima"
                              : status === "Ditolak"
                                ? "Tolak"
                                : "Batalkan",
                          )
                        }
                      >
                        {status === "Diterima"
                          ? "Terima"
                          : status === "Ditolak"
                            ? "Tolak"
                            : "Batalkan"}
                      </button>
                    ),
                  )}
                </div>
              )}
            </article>
          );
        })
      ) : (
        <Empty
          title="Tidak ada permintaan kelompok"
          text="Permintaan yang kamu kirim atau terima sebagai ketua tampil di sini."
        />
      )}
    </section>
  );
}
