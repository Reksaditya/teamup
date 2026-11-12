import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  blocked,
  closed,
  date,
  eligible,
  personalId,
  matchesAvailability,
  uid,
  type User,
  type Team,
} from "../lib/demo";
import type { Shared } from "./teamup";
import { RoleEditor } from "./controls";
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
  days,
} from "./ui";
export function Pagination({
  page,
  count,
  onChange,
}: {
  page: number;
  count: number;
  onChange: (n: number) => void;
}) {
  return (
    <nav className="pagination" aria-label="Halaman hasil">
      <button
        aria-label="Halaman sebelumnya"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        <Icon name="back" size={16} />
      </button>
      {Array.from({ length: Math.max(1, count) }, (_, i) => (
        <button
          key={i}
          aria-current={page === i + 1 ? "page" : undefined}
          className={page === i + 1 ? "selected" : ""}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        aria-label="Halaman berikutnya"
        disabled={page >= count}
        onClick={() => onChange(page + 1)}
      >
        <Icon name="arrow" size={16} />
      </button>
    </nav>
  );
}
export function DataState({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <label className="state-control">
      Simulasi data
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Simulasi state halaman"
      >
        <option value="normal">Normal</option>
        <option value="loading">Memuat</option>
        <option value="empty">Kosong</option>
        <option value="error">Gagal</option>
        <option value="denied">Akses ditolak</option>
      </select>
    </label>
  );
}
export function StateView({
  value,
  retry,
  children,
}: {
  value: string;
  retry: () => void;
  children: React.ReactNode;
}) {
  if (value === "loading")
    return (
      <div aria-busy="true">
        <div className="grid two">
          {[1, 2, 3, 4].map((n) => (
            <div className="skeleton card-skeleton" key={n} />
          ))}
        </div>
        <p>Memuat data contoh…</p>
        <button className="button secondary" onClick={retry}>
          Selesaikan simulasi
        </button>
      </div>
    );
  if (value === "error")
    return (
      <Empty
        title="Data belum bisa dimuat"
        text="Terjadi kegagalan simulasi. Data yang sudah tersimpan tetap aman."
      >
        <button className="button primary" onClick={retry}>
          Coba lagi
        </button>
      </Empty>
    );
  if (value === "denied")
    return (
      <Empty
        title="Akses ditolak"
        text="Kamu tidak memiliki izin untuk melihat data ini."
      />
    );
  if (value === "empty")
    return (
      <Empty text="Belum ada data pada simulasi ini.">
        <button className="button secondary" onClick={retry}>
          Kembali ke data demo
        </button>
      </Empty>
    );
  return children;
}
function SearchBox({
  placeholder,
  onSearch,
}: {
  placeholder: string;
  onSearch: (q: string) => void;
}) {
  return (
    <form
      className="search-box"
      onSubmit={(e) => {
        const f = formData(e);
        onSearch(f.q.trim());
      }}
    >
      <Icon name="search" />
      <input name="q" aria-label={placeholder} placeholder={placeholder} />
      <button className="button primary small">
        Cari <Icon name="arrow" size={16} />
      </button>
    </form>
  );
}
export function PartnerSearch(p: Shared) {
  const [q, setQ] = useState(""),
    [filters, setFilters] = useState<Record<string, string>>({}),
    [page, setPage] = useState(1),
    [drawer, setDrawer] = useState(false),
    [view, setView] = useState("normal");
  function match(u: User) {
    if (
      u.id === p.user?.id ||
      u.suspended ||
      u.admin ||
      !u.complete ||
      blocked(p.state, p.user!.id, u.id)
    )
      return false;
    if (
      q &&
      !`${u.name} ${u.institution} ${u.topics.map((t) => t.name).join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase())
    )
      return false;
    if (
      filters.topic &&
      !u.topics.some(
        (t) =>
          t.name === filters.topic &&
          (!filters.level || t.level === filters.level),
      )
    )
      return false;
    if (
      !filters.topic &&
      filters.level &&
      !u.topics.some((t) => t.level === filters.level)
    )
      return false;
    if (
      filters.city &&
      !u.city.toLowerCase().includes(filters.city.toLowerCase())
    )
      return false;
    if (filters.mode && u.mode !== filters.mode && u.mode !== "Keduanya")
      return false;
    if((filters.day||filters.start||filters.end)&&!matchesAvailability(u,filters))return false;
    return true;
  }
  const results = p.state.users
    .filter(match)
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <main className="container page">
      <Title
        eyebrow="TEMUKAN TEMAN BERTUMBUH"
        title="Belajar lebih jauh, bersama."
        text="Temukan partner dengan minat dan waktu yang sejalan."
      />
      <SearchBox
        placeholder="Cari nama, institusi, atau bidang belajar…"
        onSearch={(v) => {
          setQ(v);
          setPage(1);
        }}
      />
      <div className="search-layout">
        <aside className={"filter-panel card " + (drawer ? "filter-open" : "")}>
          <div className="row between">
            <h3>
              <Icon name="filter" /> Filter partner
            </h3>
            <button
              className="text-link"
              onClick={() => {
                setFilters({});
                setPage(1);
              }}
            >
              Reset
            </button>
          </div>
          <form
            key={JSON.stringify(filters)}
            onSubmit={(e) => {
              const f = formData(e);
              if (f.start && f.end && f.end <= f.start) {
                p.commit(() => {
                  throw Error("Waktu selesai harus setelah waktu mulai.");
                });
                return;
              }
              setFilters(f);
              setPage(1);
              setDrawer(false);
            }}
          >
            <Field label="Bidang belajar">
              <select name="topic" defaultValue={filters.topic || ""}>
                <option value="">Semua bidang</option>
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Level kemampuan">
              <select name="level" defaultValue={filters.level || ""}>
                <option value="">Semua level</option>
                {levels.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Kota / kabupaten">
              <input
                name="city"
                defaultValue={filters.city}
                placeholder="Contoh: Bandung"
              />
            </Field>
            <Field label="Mode belajar">
              <select name="mode" defaultValue={filters.mode || ""}>
                <option value="">Semua mode</option>
                <option>Online</option>
                <option>Offline</option>
              </select>
            </Field>
            <Field label="Hari belajar">
              <select name="day" defaultValue={filters.day || ""}>
                <option value="">Semua hari</option>
                {days.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <div className="grid two">
              <Field label="Mulai">
                <input type="time" name="start" defaultValue={filters.start} />
              </Field>
              <Field label="Selesai">
                <input type="time" name="end" defaultValue={filters.end} />
              </Field>
            </div>
            <Field label="Zona waktu">
              <select name="zone" defaultValue={filters.zone || "Asia/Jakarta"}>
                <option value="Asia/Jakarta">WIB · UTC+7</option>
                <option value="Asia/Makassar">WITA · UTC+8</option>
                <option value="Asia/Jayapura">WIT · UTC+9</option>
              </select>
            </Field>
            <button className="button primary full">Terapkan filter</button>
          </form>
          <p className="filter-note">
            <Icon name="info" size={16} /> Jadwal dicocokkan berdasarkan irisan
            waktu dan zona.
          </p>
        </aside>
        <section>
          <div className="results-heading">
            <div>
              <strong>{results.length} partner</strong>
              <span className="muted"> untuk langkah berikutnya</span>
            </div>
            <button
              className="button secondary small filter-toggle"
              onClick={() => setDrawer(!drawer)}
            >
              <Icon name="filter" /> Filter
            </button>
            <DataState value={view} onChange={setView} />
          </div>
          <div className="filter-chips">
            {Object.entries({ ...filters, ...(q ? { pencarian: q } : {}) })
              .filter(([k, v]) => v && k !== "zone")
              .map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => {
                    if (k === "pencarian") setQ("");
                    else setFilters((f) => ({ ...f, [k]: "" }));
                    setPage(1);
                  }}
                >
                  {v}
                  <Icon name="close" size={14} />
                </button>
              ))}
          </div>
          <p className="sort-note">
            Diurutkan berdasarkan nama A–Z · seluruh profil adalah data demo
          </p>
          <StateView value={view} retry={() => setView("normal")}>
            {results.length ? (
              <>
                <div className="grid two">
                  {results
                    .slice((page - 1) * 4, page * 4)
                    .map((u) => p.partnerCard(u))}
                </div>
                <Pagination
                  page={page}
                  count={Math.ceil(results.length / 4)}
                  onChange={setPage}
                />
              </>
            ) : (
              <Empty
                title="Belum ada partner dengan filter ini"
                text="Coba kurangi filter untuk menemukan teman belajar baru."
              >
                <button
                  className="button primary"
                  onClick={() => {
                    setFilters({});
                    setQ("");
                  }}
                >
                  Reset filter
                </button>
              </Empty>
            )}
          </StateView>
        </section>
      </div>
    </main>
  );
}
export function ProfileDetail(p: Shared & { id: string }) {
  const u = p.state.users.find(
    (u) => u.id === p.id && !u.suspended && !u.admin,
  );
  if (!u || (p.user && blocked(p.state, p.user.id, u.id)))
    return (
      <main className="container page">
        <Empty
          title="Profil tidak tersedia"
          text="Profil tidak ditemukan atau interaksi dibatasi."
        />
      </main>
    );
  const r = p.state.requests.find(
    (r) =>
      [r.from, r.to].includes(u.id) &&
      [r.from, r.to].includes(p.user?.id || "") &&
      ["Menunggu", "Diterima"].includes(r.status),
  );
  return (
    <main className="container page">
      <Link className="breadcrumb" href="/partner">
        <Icon name="back" size={16} /> Cari partner
      </Link>
      <div className="detail-layout">
        <section className="card detail-card">
          <div className="profile-hero">
            <Avatar user={u} size="large" />
            <div>
              <Badge tone="info">Partner belajar</Badge>
              <h1>{u.name}</h1>
              {p.user && (
                <p>
                  {u.institution} · {u.major}
                </p>
              )}
            </div>
          </div>
          <h3>Tentang saya</h3>
          <p>
            {p.user
              ? u.bio
              : "Pengguna TeamUp yang tertarik untuk belajar dan berkolaborasi."}
          </p>
          <hr />
          <h3>Bidang & kemampuan</h3>
          <div className="topic-list">
            {u.topics.map((t) => (
              <span className="topic" key={t.name}>
                {t.name}
                <span>{t.level}</span>
              </span>
            ))}
          </div>
          <small>Level ini diisi sendiri oleh pengguna.</small>
          {p.user ? (
            <>
              <hr />
              <h3>Preferensi belajar</h3>
              <div className="info-grid">
                <div>
                  <span>Kota / kabupaten</span>
                  <strong>{u.city}</strong>
                </div>
                <div>
                  <span>Mode</span>
                  <strong>{u.mode}</strong>
                </div>
                {(u.availability || [u]).map((a, i) => (
                  <div key={i}>
                    <span>Jadwal {i + 1}</span>
                    <strong>
                      {a.day} · {a.start}–{a.end}
                    </strong>
                    <small>{a.zone}</small>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="notice">
              <Icon name="lock" /> Masuk untuk melihat informasi akademik dan
              jadwal belajar.
            </div>
          )}
        </section>
        <aside className="card action-card">
          <span className="feature-icon">
            <Icon name="users" />
          </span>
          <h3>Mulai dari satu sapaan.</h3>
          <p>
            Kenalan, diskusi, dan temukan cara belajar yang pas untuk kalian.
          </p>
          {p.user?.id === u.id ? (
            <Link className="button primary" href="/profil">
              Edit profil
            </Link>
          ) : r?.status === "Diterima" ? (
            <Link
              className="button primary"
              href={"/pesan/" + personalId(p.user!.id, u.id)}
            >
              Buka chat <Icon name="chat" />
            </Link>
          ) : r?.status === "Menunggu" ? (
            <Link className="button secondary" href="/aktivitas">
              Lihat permintaan menunggu
            </Link>
          ) : (
            <button className="button primary" onClick={() => p.request(u.id)}>
              Ajak belajar <Icon name="plus" />
            </button>
          )}
          {p.user && p.user.id !== u.id && (
            <div className="actions">
              <button
                className="text-link"
                onClick={() => p.report("Pengguna: " + u.name)}
              >
                Laporkan
              </button>
              <button
                className="text-link danger-text"
                onClick={() => p.block(u)}
              >
                Blokir
              </button>
            </div>
          )}
          <small>Chat personal terbuka setelah permintaan diterima.</small>
        </aside>
      </div>
    </main>
  );
}
export function Competitions(p: Shared) {
  const [q, setQ] = useState(""),
    [filters, setFilters] = useState<Record<string, string>>({}),
    [page, setPage] = useState(1),
    [view, setView] = useState("normal");
  const results = p.state.competitions.filter(
    (c) =>
      c.status === "Tayang" &&
      (!q || c.name.toLowerCase().includes(q.toLowerCase())) &&
      (!filters.category || c.category === filters.category) &&
      (!filters.level || c.level === filters.level) &&
      (!filters.fee || (filters.fee === "Gratis" ? c.fee === 0 : c.fee > 0)) &&
      (!filters.from || c.deadline >= filters.from) &&
      (!filters.to || c.deadline <= filters.to + "T16:59:59Z"),
  );
  return (
    <main className="container page">
      <Title
        eyebrow="IDE BESAR, PELUANG BARU"
        title="Temukan tantangan berikutnya."
        text="Jelajahi lomba, asah kemampuan, dan bawa idemu lebih jauh."
      />
      <SearchBox
        placeholder="Cari lomba yang ingin kamu ikuti…"
        onSearch={(v) => {
          setQ(v);
          setPage(1);
        }}
      />
      <form
        className="filter-bar card"
        key={JSON.stringify(filters)}
        onSubmit={(e) => {
          const f = formData(e);
          if (f.from && f.to && f.from > f.to) {
            p.commit(() => {
              throw Error("Tanggal akhir harus setelah tanggal awal.");
            });
            return;
          }
          setFilters(f);
          setPage(1);
        }}
      >
        <Field label="Kategori">
          <select name="category" defaultValue={filters.category}>
            <option value="">Semua kategori</option>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Tingkat">
          <select name="level" defaultValue={filters.level}>
            <option value="">Semua tingkat</option>
            <option>Nasional</option>
            <option>Regional</option>
          </select>
        </Field>
        <Field label="Biaya">
          <select name="fee" defaultValue={filters.fee}>
            <option value="">Semua biaya</option>
            <option>Gratis</option>
            <option>Berbayar</option>
          </select>
        </Field>
        <Field label="Deadline mulai (WIB)">
          <input name="from" type="date" defaultValue={filters.from} />
        </Field>
        <Field label="Deadline akhir (WIB)">
          <input name="to" type="date" defaultValue={filters.to} />
        </Field>
        <button className="button primary">Terapkan</button>
      </form>
      <div className="results-heading">
        <strong>{results.length} lomba untuk dijelajahi</strong>
        <button
          className="text-link"
          onClick={() => {
            setFilters({});
            setQ("");
            setPage(1);
          }}
        >
          Reset filter
        </button>
        <DataState value={view} onChange={setView} />
      </div>
      <p className="demo-caption">
        <Icon name="info" size={14} /> Seluruh lomba dan tautan pendaftaran
        merupakan contoh.
      </p>
      <StateView value={view} retry={() => setView("normal")}>
        {results.length ? (
          <>
            <div className="grid three">
              {results.slice((page - 1) * 6, page * 6).map(p.competitionCard)}
            </div>
            <Pagination
              page={page}
              count={Math.ceil(results.length / 6)}
              onChange={setPage}
            />
          </>
        ) : (
          <Empty title="Belum ada lomba dengan filter ini" />
        )}
      </StateView>
    </main>
  );
}
export function CompetitionDetail(p: Shared & { id: string }) {
  const c = p.state.competitions.find(
    (c) => c.id === p.id && c.status === "Tayang",
  );
  if (!c)
    return (
      <main className="container page">
        <Empty title="Lomba tidak tersedia" />
      </main>
    );
  return (
    <main className="container page">
      <Link href="/lomba" className="breadcrumb">
        <Icon name="back" size={16} /> Jelajahi lomba
      </Link>
      <div className="detail-layout">
        <section className="card detail-card">
          <div className="topic-list">
            <Badge tone="info">{c.category}</Badge>
            <Badge>{c.level}</Badge>
            <Status value={closed(c) ? "Ditutup" : "Merekrut"} />
          </div>
          <h1>{c.name}</h1>
          <p>Diselenggarakan oleh {c.organizer}</p>
          {c.verified && (
            <div className="notice">
              <Icon name="shield" />
              <span>
                Informasi diperiksa admin. Bukan jaminan kualitas
                penyelenggaraan.
              </span>
            </div>
          )}
          <h3>Tentang lomba</h3>
          <p>{c.description}</p>
          <hr />
          <h3>Persyaratan peserta</h3>
          <p>{c.requirements}</p>
          {c.prize && (
            <>
              <hr />
              <h3>Hadiah & kesempatan</h3>
              <p>{c.prize}</p>
            </>
          )}
          <hr />
          <div className="info-grid">
            <div>
              <span>Deadline pendaftaran</span>
              <strong>{date(c.deadline)}</strong>
            </div>
            <div>
              <span>Pelaksanaan</span>
              <strong>{date(c.date)}</strong>
            </div>
            <div>
              <span>Biaya pendaftaran</span>
              <strong>
                {c.fee ? "Rp" + c.fee.toLocaleString("id-ID") : "Gratis"}
              </strong>
            </div>
            <div>
              <span>Batas anggota</span>
              <strong>Maksimal {c.max} orang, termasuk ketua</strong>
            </div>
          </div>
          <hr />
          <h3>Sumber informasi</h3>
          <a
            className="text-link"
            href={c.source}
            target="_blank"
            rel="noreferrer"
          >
            {new URL(c.source).hostname} · tautan contoh{" "}
            <Icon name="external" size={16} />
            <span className="sr-only">(buka tab baru)</span>
          </a>
          <small>
            Data lomba demo. Konfirmasi informasi di situs penyelenggara sebelum
            mendaftar.
          </small>
        </section>
        <aside className="card action-card">
          <span className="feature-icon mint">
            <Icon name="trophy" />
          </span>
          <h3>Idemu butuh tim yang tepat.</h3>
          <p>Temukan rekan dengan kemampuan yang saling melengkapi.</p>
          <Link href={"/tim?lomba=" + c.id} className="button primary">
            Cari tim <Icon name="users" />
          </Link>
          {closed(c) ? (
            <>
              <button className="button secondary" disabled>
                Buat tim
              </button>
              <small>
                Pendaftaran ditutup. Tim dan lamaran baru tidak tersedia.
              </small>
            </>
          ) : (
            <Link className="button secondary" href={"/tim/buat?lomba=" + c.id}>
              Buat tim <Icon name="plus" />
            </Link>
          )}
          <hr />
          <a
            className="text-link"
            href={c.source}
            target="_blank"
            rel="noreferrer"
          >
            Daftar di situs penyelenggara <Icon name="external" size={16} />
            <span className="sr-only">(buka tab baru)</span>
          </a>
          <small>
            Pendaftaran resmi dilakukan di luar TeamUp. Tautan saat ini adalah
            dummy.
          </small>
        </aside>
      </div>
    </main>
  );
}
export function Teams(p: Shared) {
  const [q, setQ] = useState(""),
    [competition, setCompetition] = useState(() =>
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("lomba") || ""
        : "",
    ),
    [role, setRole] = useState(""),
    [open, setOpen] = useState(false),
    [mine, setMine] = useState(false),
    [view, setView] = useState("normal");
  const results = p.state.teams.filter(
    (t) =>
      (!q || t.name.toLowerCase().includes(q.toLowerCase())) &&
      (!competition || t.competition === competition) &&
      (!role || t.role.toLowerCase().includes(role.toLowerCase())) &&
      (!open ||
        (t.status === "Merekrut" &&
          t.members.length < t.capacity &&
          !closed(
            p.state.competitions.find((c) => c.id === t.competition)!,
          ))) &&
      (!mine || t.members.includes(p.user?.id || "")) &&
      (!p.user ||
        !t.members.some((id) => blocked(p.state, p.user!.id, id)) ||
        t.members.includes(p.user.id)),
  );
  return (
    <main className="container page">
      <Title
        eyebrow="SATUKAN IDE DAN KEMAMPUAN"
        title="Tim hebat dimulai dari sini."
        text="Temukan tempat untuk kontribusimu, atau bangun tim versimu sendiri."
      >
        <Link href="/tim/buat" className="button primary">
          <Icon name="plus" /> Buat tim
        </Link>
      </Title>
      <SearchBox placeholder="Cari nama tim…" onSearch={setQ} />
      <div className="filter-bar card">
        <Field label="Lomba">
          <select
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
          >
            <option value="">Semua lomba</option>
            {p.state.competitions
              .filter((c) => c.status === "Tayang")
              .map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </Field>
        <Field label="Bidang / peran">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Contoh: Designer"
          />
        </Field>
        <label className="check-field">
          <input
            type="checkbox"
            checked={open}
            onChange={(e) => setOpen(e.target.checked)}
          />{" "}
          Hanya slot terbuka
        </label>
        {p.user && (
          <label className="check-field">
            <input
              type="checkbox"
              checked={mine}
              onChange={(e) => setMine(e.target.checked)}
            />{" "}
            Tim saya
          </label>
        )}
      </div>
      <div className="results-heading">
        <strong>{results.length} tim untuk kolaborasimu</strong>
        <button
          className="text-link"
          onClick={() => {
            setQ("");
            setCompetition("");
            setRole("");
            setOpen(false);
            setMine(false);
          }}
        >
          Reset filter
        </button>
        <DataState value={view} onChange={setView} />
      </div>
      <StateView value={view} retry={() => setView("normal")}>
        {results.length ? (
          <div className="grid two">{results.map(p.teamCard)}</div>
        ) : (
          <Empty
            title="Belum ada tim dengan filter ini"
            text="Coba filter lain atau mulai tim barumu sendiri."
          >
            <Link href="/tim/buat" className="button primary">
              Buat tim
            </Link>
          </Empty>
        )}
      </StateView>
    </main>
  );
}
export function TeamDetail(p: Shared & { id: string }) {
  const router = useRouter();
  const t = p.state.teams.find((t) => t.id === p.id);
  if (!t)
    return (
      <main className="container page">
        <Empty title="Tim tidak ditemukan" />
      </main>
    );
  const c = p.state.competitions.find((c) => c.id === t.competition)!;
  const member = t.members.includes(p.user?.id || ""),
    leader = t.leader === p.user?.id;
  const locked =
    closed(c) || t.status !== "Merekrut" || t.members.length >= t.capacity;
  const pending = p.state.applications.find(
    (a) => a.team === t.id && a.user === p.user?.id && a.status === "Menunggu",
  );
  function leave() {
    p.confirm(
      "Keluar dari " + t!.name + "?",
      "Kamu akan kehilangan akses baca dan kirim seluruh riwayat chat grup.",
      () => {
        p.commit(
          (s) => ({
            ...s,
            teams: s.teams.map((x) =>
              x.id === t!.id
                ? { ...x, members: x.members.filter((id) => id !== p.user!.id) }
                : x,
            ),
          }),
          "Kamu telah keluar dari tim.",
        );
        router.push("/tim");
      },
      "Keluar tim",
    );
  }
  return (
    <main className="container page">
      <Link href="/tim" className="breadcrumb">
        <Icon name="back" size={16} /> Cari tim
      </Link>
      <div className="detail-layout">
        <section className="card detail-card">
          <div className="row between">
            <span className="team-mark large">
              <Icon name="users" size={32} />
            </span>
            <Status
              value={t.members.length >= t.capacity ? "Penuh" : t.status}
            />
          </div>
          <h1>{t.name}</h1>
          <Link className="text-link" href={"/lomba/" + c.id}>
            {c.name} <Icon name="arrow" size={16} />
          </Link>
          <p>{t.description}</p>
          <hr />
          <h3>Peran yang dibutuhkan</h3>
          {(
            t.roles || [{ name: t.role, slots: t.capacity - t.members.length }]
          ).map((r) => (
            <div className="role-panel" key={r.name}>
              <Icon name="code" />
              <div>
                <strong>{r.name}</strong>
                <p>{r.slots} slot tersedia</p>
              </div>
              <Badge tone="info">{c.category}</Badge>
            </div>
          ))}
          <div className="row between">
            <strong>Kapasitas tim</strong>
            <span>
              {t.members.length} dari {t.capacity} anggota
            </span>
          </div>
          <progress
            max={t.capacity}
            value={t.members.length}
            aria-label="Kapasitas tim"
          />
          <small>
            Kapasitas termasuk ketua. Lamaran menunggu tidak memakai slot.
          </small>
          <hr />
          <h3>{member ? "Anggota tim" : "Ketua tim"}</h3>
          {(member ? t.members : [t.leader]).map((id) => {
            const u = p.state.users.find((u) => u.id === id)!;
            return (
              <div className="list-item" key={id}>
                <Avatar user={u} />
                <div>
                  <Link className="person-name" href={"/partner/" + id}>
                    {u.name}
                  </Link>
                  <p>{id === t.leader ? "Ketua tim" : "Anggota"}</p>
                </div>
                {leader && id !== p.user?.id && (
                  <button
                    className="text-link push-right"
                    disabled={u.suspended}
                    onClick={() =>
                      p.confirm(
                        "Pindahkan kepemimpinan?",
                        "Setelah dipindahkan, kamu menjadi anggota biasa dan dapat keluar dari tim.",
                        () =>
                          p.commit(
                            (s) => ({
                              ...s,
                              teams: s.teams.map((x) =>
                                x.id === t.id ? { ...x, leader: id } : x,
                              ),
                            }),
                            "Kepemimpinan dipindahkan.",
                          ),
                        "Pindahkan",
                      )
                    }
                  >
                    Jadikan ketua
                  </button>
                )}
              </div>
            );
          })}
          {!member && (
            <div className="notice">
              <Icon name="lock" /> Daftar anggota dan chat tersedia setelah kamu
              menjadi anggota.
            </div>
          )}
        </section>
        <aside className="card action-card">
          <h3>
            {member ? "Ruang kolaborasi timmu" : "Bawa idemu ke tim ini."}
          </h3>
          <p>Deadline lomba: {date(c.deadline)}</p>
          {member ? (
            <>
              <Link href={"/pesan/team:" + t.id} className="button primary">
                {t.status === "Bubar" ? "Baca riwayat grup" : "Buka chat grup"}{" "}
                <Icon name="chat" />
              </Link>
              {leader && t.status !== "Bubar" && (
                <>
                  <Link
                    href={"/tim/" + t.id + "/edit"}
                    className="button secondary"
                  >
                    Edit tim <Icon name="edit" />
                  </Link>
                  <Link href="/aktivitas" className="button secondary">
                    Tinjau lamaran
                  </Link>
                  <button
                    className="button secondary"
                    disabled={closed(c) || t.members.length >= t.capacity}
                    onClick={() =>
                      p.commit(
                        (s) => ({
                          ...s,
                          teams: s.teams.map((x) =>
                            x.id === t.id
                              ? {
                                  ...x,
                                  status:
                                    x.status === "Merekrut"
                                      ? "Ditutup"
                                      : "Merekrut",
                                }
                              : x,
                          ),
                        }),
                        "Status perekrutan diperbarui.",
                      )
                    }
                  >
                    {t.status === "Merekrut"
                      ? "Tutup perekrutan"
                      : "Buka perekrutan"}
                  </button>
                  {(closed(c) || t.members.length >= t.capacity) && (
                    <small>
                      Perekrutan terkunci karena deadline atau kapasitas penuh.
                    </small>
                  )}
                  <button
                    className="text-link danger-text"
                    onClick={() =>
                      p.confirm(
                        "Bubarkan tim?",
                        "Perekrutan ditutup. Riwayat grup menjadi hanya-baca untuk mantan anggota yang berhak.",
                        () =>
                          p.commit(
                            (s) => ({
                              ...s,
                              teams: s.teams.map((x) =>
                                x.id === t.id ? { ...x, status: "Bubar" } : x,
                              ),
                              applications: s.applications.map((a) =>
                                a.team === t.id && a.status === "Menunggu"
                                  ? { ...a, status: "Ditutup sistem" }
                                  : a,
                              ),
                            }),
                            "Tim dibubarkan.",
                          ),
                        "Bubarkan tim",
                      )
                    }
                  >
                    Bubarkan tim
                  </button>
                  <small>
                    Untuk keluar tanpa membubarkan, pindahkan kepemimpinan
                    terlebih dahulu.
                  </small>
                </>
              )}
              {!leader && t.status !== "Bubar" && (
                <button className="text-link danger-text" onClick={leave}>
                  Keluar tim
                </button>
              )}
              {t.status === "Bubar" && (
                <div className="notice">
                  Tim sudah bubar. Chat grup hanya dapat dibaca.
                </div>
              )}
            </>
          ) : pending ? (
            <Link href="/aktivitas" className="button secondary">
              Lamaran menunggu
            </Link>
          ) : (
            <>
              <button
                className="button primary"
                disabled={locked}
                onClick={() => p.apply(t)}
              >
                Ajukan lamaran <Icon name="arrow" />
              </button>
              {locked && (
                <small>
                  {closed(c)
                    ? "Deadline lomba telah lewat."
                    : t.members.length >= t.capacity
                      ? "Tim sudah penuh."
                      : "Perekrutan ditutup."}{" "}
                  Lamaran baru tidak dapat dikirim.
                </small>
              )}
            </>
          )}
          <hr />
          <small>
            Pendaftaran resmi tetap dilakukan di situs penyelenggara.
          </small>
        </aside>
      </div>
    </main>
  );
}
export function TeamForm(p: Shared & { id?: string }) {
  const router = useRouter(),
    t = p.state.teams.find((t) => t.id === p.id);
  const [error, setError] = useState(""),
    [capacity, setCapacity] = useState(t?.capacity || 4);
  if (p.id && (!t || t.leader !== p.user?.id || t.status === "Bubar"))
    return (
      <main className="container page">
        <Empty
          title="Akses ditolak"
          text="Hanya ketua tim aktif yang dapat mengedit tim."
        />
      </main>
    );
  return (
    <main className="container page narrow">
      <Title
        eyebrow="WUJUDKAN IDE BERSAMA"
        title={t ? "Edit tim" : "Bangun tim versimu."}
        text="Satu tujuan, beragam kemampuan. Mulai dari sini."
      />
      <form
        className="card form-card"
        onSubmit={(e) => {
          const f = formData(e);
          setError("");
          try {
            eligible(p.state, p.user!.id);
            const c = p.state.competitions.find((c) => c.id === f.competition)!;
            if (closed(c))
              throw Error("Deadline lomba sudah lewat. Tim belum tersimpan.");
            if (
              Number(f.capacity) > c.max ||
              Number(f.capacity) < (t?.members.length || 1)
            )
              throw Error(
                "Kapasitas harus mencakup anggota saat ini dan tidak melebihi batas lomba.",
              );
            if (
              !t &&
              p.state.teams.some(
                (x) =>
                  x.competition === c.id &&
                  x.status !== "Bubar" &&
                  x.members.includes(p.user!.id),
              )
            )
              throw Error(
                "Kamu sudah menjadi anggota satu tim aktif untuk lomba ini.",
              );
            const roles = JSON.parse(f.roles) as {
              name: string;
              slots: number;
            }[];
            if (
              new Set(roles.map((r) => r.name.trim().toLowerCase())).size !==
              roles.length
            )
              throw Error("Setiap peran harus berbeda.");
            if (
              roles.reduce((sum, r) => sum + r.slots, 0) >
              Number(f.capacity) - (t?.members.length || 1)
            )
              throw Error("Total slot peran melebihi kapasitas tersisa.");
            const id = t?.id || uid();
            const next: Team = {
              id,
              name: f.name,
              competition: c.id,
              leader: t?.leader || p.user!.id,
              members: t?.members || [p.user!.id],
              capacity: Number(f.capacity),
              role:
                roles
                  .filter((r) => r.slots > 0)
                  .map((r) => r.name)
                  .join(", ") || roles[0].name,
              roles,
              description: f.description,
              status: t?.status || "Merekrut",
            };
            p.commit(
              (s) => ({
                ...s,
                teams: [...s.teams.filter((x) => x.id !== id), next],
              }),
              "Tim demo tersimpan.",
            );
            router.push("/tim/" + id);
          } catch (err) {
            setError((err as Error).message);
          }
        }}
      >
        {error && (
          <div className="notice danger" role="alert" tabIndex={-1}>
            {error}
          </div>
        )}
        <Field label="Lomba (wajib)">
          <select
            name="competition"
            required
            defaultValue={
              t?.competition ||
              (typeof window !== "undefined"
                ? new URLSearchParams(window.location.search).get("lomba") || ""
                : "")
            }
            disabled={!!t}
          >
            {p.state.competitions
              .filter(
                (c) =>
                  c.status === "Tayang" &&
                  (!closed(c) || c.id === t?.competition),
              )
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
          {t && (
            <input type="hidden" name="competition" value={t.competition} />
          )}
        </Field>
        <Field label="Nama tim (wajib)">
          <input
            name="name"
            required
            defaultValue={t?.name}
            placeholder="Nama yang membawa semangat timmu"
          />
        </Field>
        <Field label="Tentang tim (wajib)">
          <textarea
            name="description"
            required
            defaultValue={t?.description}
            placeholder="Ceritakan ide, tujuan, dan cara kalian berkolaborasi…"
          />
        </Field>
        <Field
          label="Kapasitas total (wajib)"
          hint="Termasuk ketua. Kapasitas mengikuti batas anggota lomba."
        >
          <input
            type="number"
            name="capacity"
            min={Math.max(2, t?.members.length || 1)}
            required
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </Field>
        <RoleEditor
          initial={
            t?.roles ||
            (t
              ? [
                  {
                    name: t.role,
                    slots: Math.max(0, t.capacity - t.members.length),
                  },
                ]
              : undefined)
          }
          remaining={Math.max(0, capacity - (t?.members.length || 1))}
        />
        <div className="notice">
          <Icon name="info" /> Satu pengguna hanya dapat bergabung dengan satu
          tim aktif per lomba.
        </div>
        <div className="actions end">
          <Link className="button secondary" href={t ? "/tim/" + t.id : "/tim"}>
            Batal
          </Link>
          <button className="button primary">
            {t ? "Simpan perubahan" : "Buat tim"} <Icon name="arrow" />
          </button>
        </div>
      </form>
    </main>
  );
}
