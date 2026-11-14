"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  uid,
  now,
  requestPartner,
  blockUser,
  applyTeam,
  type State,
  type User,
  type Competition,
  type Team,
} from "../lib/demo";
import { Icon, Avatar, Empty, Title, formData } from "./ui";
import { useDemoState } from "./store";
import { ThemeSwitch } from "./theme";
import { AboutUs } from "./about";
import { PartnerCard, CompetitionCard, TeamCard, Landing } from "./discovery";
import {
  PartnerSearch,
  ProfileDetail,
  Competitions,
  CompetitionDetail,
  Teams,
  TeamDetail,
  TeamForm,
} from "./pages";
import {
  Activities,
  Chat,
  ProfileForm,
  Auth,
  Admin,
  Information,
} from "./workspace";
export type Modal = { title: string; content: ReactNode } | null;
export type Shared = {
  state: State;
  user?: User;
  commit: (f: (s: State) => State, message?: string) => boolean;
  setModal: (m: Modal) => void;
  confirm: (
    title: string,
    text: string,
    action: () => void,
    label?: string,
  ) => void;
  request: (id: string) => void;
  report: (target: string, evidence?: string) => void;
  block: (u: User) => void;
  apply: (t: Team) => void;
  partnerCard: (u: User, preview?: boolean) => ReactNode;
  competitionCard: (c: Competition) => ReactNode;
  teamCard: (t: Team) => ReactNode;
  offline: boolean;
  setOffline: (b: boolean) => void;
};
function Dialog({ modal, close }: { modal: Modal; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    if (modal && el && !el.open) {
      el.showModal();
      el.querySelector<HTMLElement>("[data-dialog-initial-focus]")?.focus();
    }
    return () => {
      if (el?.open) el.close();
      previous?.focus();
    };
  }, [modal]);
  return (
    <dialog
      ref={ref}
      onCancel={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-heading">
        <h2 id="dialog-title">{modal?.title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label="Tutup dialog"
          onClick={close}
        >
          <Icon name="close" />
        </button>
      </div>
      {modal?.content}
    </dialog>
  );
}
export default function TeamUp() {
  const path = usePathname(),
    router = useRouter();
  const { state, setState, ready, storageWarning } = useDemoState();
  const [modal, setModal] = useState<Modal>(null),
    [toast, setToast] = useState(""),
    [offline, setOffline] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(t);
  }, [toast]);
  const user = state.users.find((u) => u.id === state.session);
  function commit(change: (s: State) => State, message = "") {
    try {
      setState((current) => change(current));
      if (message) setToast(message);
      return true;
    } catch (e) {
      setToast(
        e instanceof Error ? e.message : "Tindakan belum berhasil. Coba lagi.",
      );
      return false;
    }
  }
  function requireUser() {
    if (!user) {
      router.push("/masuk?next=" + encodeURIComponent(path));
      return false;
    }
    return true;
  }
  function confirm(
    title: string,
    text: string,
    action: () => void,
    label = "Konfirmasi",
  ) {
    setModal({
      title,
      content: (
        <>
          <p className="dialog-description">{text}</p>
          <div className="actions end">
            <button
              className="button secondary"
              autoFocus
              data-dialog-initial-focus
              onClick={() => setModal(null)}
            >
              Batal
            </button>
            <button
              className="button danger"
              onClick={() => {
                action();
                setModal(null);
              }}
            >
              {label}
            </button>
          </div>
        </>
      ),
    });
  }
  function request(to: string) {
    if (requireUser())
      commit(
        (s) => requestPartner(s, user!.id, to),
        "Permintaan terkirim. Lihat statusnya di Aktivitas.",
      );
  }
  function requestLogout() {
    setModal({
      title: "yakin ingin keluar dari akun?",
      content: (
        <div className="actions end">
          <button
            type="button"
            className="button ghost"
            autoFocus
            data-dialog-initial-focus
            onClick={() => setModal(null)}
          >
            Tidak
          </button>
          <button
            type="button"
            className="button logout-confirm"
            onClick={() => {
              setState((s) => ({ ...s, session: null }));
              setModal(null);
              router.push("/");
            }}
          >
            Ya
          </button>
        </div>
      ),
    });
  }
  function report(target: string, evidence = "") {
    if (!requireUser()) return;
    setModal({
      title: "Laporkan pengguna atau konten",
      content: (
        <form
          onSubmit={(e) => {
            const f = formData(e);
            if (
              commit(
                (s) => ({
                  ...s,
                  reports: [
                    ...s.reports,
                    {
                      id: uid(),
                      user: user!.id,
                      target,
                      category: f.category,
                      reason: f.reason,
                      evidence,
                      status: "Baru",
                      at: now(),
                    },
                  ],
                }),
                "Laporan tersimpan. Lihat statusnya di Bantuan.",
              )
            )
              setModal(null);
          }}
        >
          <div className="notice">
            Objek: {target}. Hanya bukti pesan yang dipilih akan disertakan.
          </div>
          <label className="field">
            Kategori
            <select name="category">
              <option>Spam</option>
              <option>Pelecehan</option>
              <option>Informasi tidak sesuai</option>
              <option>Lainnya</option>
            </select>
          </label>
          <label className="field">
            Alasan (wajib)
            <textarea
              name="reason"
              required
              placeholder="Ceritakan hal yang perlu ditinjau admin…"
            />
          </label>
          <button className="button primary full">Kirim laporan</button>
        </form>
      ),
    });
  }
  function block(target: User) {
    confirm(
      "Blokir " + target.name + "?",
      "Pesan personal dan interaksi baru dihentikan. Dalam tim bersama, kamu tetap menjadi anggota dan pesan pengguna ini disembunyikan untukmu.",
      () =>
        commit((s) => blockUser(s, user!.id, target.id), "Pengguna diblokir."),
      "Blokir pengguna",
    );
  }
  function apply(t: Team) {
    if (!requireUser()) return;
    setModal({
      title: "Bergabung dengan " + t.name,
      content: (
        <form
          onSubmit={(e) => {
            const f = formData(e);
            if (
              commit(
                (s) => applyTeam(s, user!.id, t.id, f.role, f.message),
                "Lamaran terkirim. Lihat statusnya di Aktivitas.",
              )
            )
              setModal(null);
          }}
        >
          <p className="dialog-description">
            Ceritakan kontribusimu. Lamaran menunggu tidak memakai slot tim.
          </p>
          <label className="field">
            Peran tujuan
            <select name="role">
              {(
                t.roles || [
                  { name: t.role, slots: t.capacity - t.members.length },
                ]
              )
                .filter((r) => r.slots > 0)
                .map((r) => (
                  <option key={r.name}>{r.name}</option>
                ))}
            </select>
          </label>
          <label className="field">
            Pesan singkat (wajib)
            <textarea
              name="message"
              required
              placeholder="Halo! Aku tertarik bergabung karena…"
            />
          </label>
          <button className="button primary full">
            Kirim lamaran <Icon name="arrow" />
          </button>
        </form>
      ),
    });
  }
  const shared: Shared = {
    state,
    user,
    commit,
    setModal,
    confirm,
    request,
    report,
    block,
    apply,
    partnerCard: (u, preview) => (
      <PartnerCard
        key={u.id}
        u={u}
        user={user}
        state={state}
        request={request}
        preview={preview}
      />
    ),
    competitionCard: (c) => <CompetitionCard key={c.id} c={c} />,
    teamCard: (t) => <TeamCard key={t.id} t={t} state={state} />,
    offline,
    setOffline,
  };
  function gate(content: ReactNode, admin = false) {
    if (!user)
      return (
        <main className="container page">
          <Empty
            page
            title="Masuk untuk melanjutkan"
            text="Temukan teman belajar dan mulai kolaborasimu di TeamUp."
          >
            <Link
              className="button primary"
              href={"/masuk?next=" + encodeURIComponent(path)}
            >
              Masuk ke TeamUp <Icon name="arrow" />
            </Link>
          </Empty>
        </main>
      );
    if (user.suspended)
      return (
        <main className="container page">
          <Empty
            page
            title="Akun ditangguhkan"
            text="Akses privat akun ini dibatasi. Hubungi bantuan untuk peninjauan."
          >
            <Link className="button secondary" href="/bantuan">
              Buka bantuan
            </Link>
          </Empty>
        </main>
      );
    if (admin && !user.admin)
      return (
        <main className="container page">
          <Empty
            page
            title="Akses khusus admin"
            text="Kamu tidak memiliki izin untuk membuka halaman ini."
          />
        </main>
      );
    return content;
  }
  const parts = path.split("/").filter(Boolean);
  let content: ReactNode;
  if (path === "/") content = <Landing {...shared} />;
  else if (path === "/aboutus") content = <AboutUs />;
  else if (parts[0] === "partner")
    content = parts[1] ? (
      <ProfileDetail {...shared} id={parts[1]} />
    ) : (
      gate(<PartnerSearch {...shared} />)
    );
  else if (parts[0] === "lomba")
    content = parts[1] ? (
      <CompetitionDetail {...shared} id={parts[1]} />
    ) : (
      <Competitions {...shared} />
    );
  else if (parts[0] === "tim")
    content =
      parts[1] === "buat" || parts[2] === "edit" ? (
        gate(
          <TeamForm
            {...shared}
            id={parts[2] === "edit" ? parts[1] : undefined}
          />,
        )
      ) : parts[1] ? (
        <TeamDetail {...shared} id={parts[1]} />
      ) : (
        <Teams {...shared} />
      );
  else if (parts[0] === "aktivitas") content = gate(<Activities {...shared} />);
  else if (parts[0] === "pesan")
    content = gate(
      <Chat key={`${user?.id}:${parts[1]}`} {...shared} id={parts[1]} />,
    );
  else if (["profil", "onboarding"].includes(parts[0]))
    content = gate(<ProfileForm key={user?.id} {...shared} />);
  else if (
    ["masuk", "daftar", "verifikasi", "reset-password"].includes(parts[0])
  )
    content = (
      <Auth key={`${parts[0]}:${user?.id}`} {...shared} kind={parts[0]} />
    );
  else if (parts[0] === "admin")
    content = gate(
      <Admin
        key={`${user?.id}:${parts[1]}`}
        {...shared}
        section={parts[1] || "lomba"}
      />,
      true,
    );
  else if (parts[0] === "diblokir")
    content = gate(
      <main className="container page narrow">
        <Title
          title="Pengguna diblokir"
          text="Membuka blokir tidak mengaktifkan kembali permintaan lama."
        />
        {state.blocks.filter((b) => b.from === user?.id).length ? (
          state.blocks
            .filter((b) => b.from === user?.id)
            .map((b) => (
              <div className="card list-item" key={b.to}>
                <Avatar user={state.users.find((u) => u.id === b.to)} />
                <strong>{state.users.find((u) => u.id === b.to)?.name}</strong>
                <button
                  className="button secondary small push-right"
                  onClick={() =>
                    commit(
                      (s) => ({
                        ...s,
                        blocks: s.blocks.filter(
                          (x) => !(x.from === b.from && x.to === b.to),
                        ),
                      }),
                      "Blokir dibuka.",
                    )
                  }
                >
                  Buka blokir
                </button>
              </div>
            ))
        ) : (
          <Empty
            title="Tidak ada pengguna diblokir"
            text="Pengguna yang kamu blokir akan muncul di sini."
          />
        )}
      </main>,
    );
  else if (["privasi", "bantuan"].includes(parts[0]))
    content = <Information {...shared} kind={parts[0]} />;
  else
    content = (
      <main className="container page">
        <Empty
          page
          title="Halaman tidak ditemukan"
          text="Tautan ini belum tersedia di TeamUp."
        >
          <Link className="button primary" href="/">
            Kembali ke beranda
          </Link>
        </Empty>
      </main>
    );
  if (user?.suspended && !["bantuan", "privasi"].includes(parts[0]))
    content = gate(null);
  const nav = [
    ["/partner", "Cari Partner", "users"],
    ["/lomba", "Lomba", "trophy"],
    ["/tim", "Cari Tim", "grid"],
    ["/aktivitas", "Aktivitas", "activity"],
    ["/pesan", "Pesan", "chat"],
  ];
  return (
    <>
      <a className="skip-link" href="#main-content">
        Lewati ke konten
      </a>
      <header className="topbar">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="TeamUp beranda">
            Team<span className="brand-up">Up</span>
            <span className="brand-dot">.</span>
          </Link>
          <nav className="navigation" aria-label="Navigasi utama">
            {nav.map(([href, label, icon]) => (
              <Link
                key={href}
                className={
                  path.startsWith(href) ? "nav-item active" : "nav-item"
                }
                href={href}
              >
                <Icon name={icon} size={17} />
                {label}
                {href === "/aktivitas" &&
                  user &&
                  state.requests.some(
                    (r) => r.to === user.id && r.status === "Menunggu",
                  ) && <span className="nav-dot" />}
              </Link>
            ))}
            {user?.admin && (
              <Link className="nav-item" href="/admin">
                Admin
              </Link>
            )}
          </nav>
          <div className="header-actions">
            <ThemeSwitch />
            {user ? (
              <>
                <Link
                  className="account-link"
                  href="/profil"
                  aria-label="Profil saya"
                >
                  <Avatar user={user} size="tiny" />
                  <span>{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  className="icon-button logout"
                  aria-label="Keluar dari akun"
                  onClick={requestLogout}
                >
                  <Icon name="logout" size={18} />
                </button>
              </>
            ) : (
              <>
                <Link className="login-link" href="/masuk">
                  Masuk
                </Link>
                <Link className="button primary small" href="/daftar">
                  Buat akun
                </Link>
              </>
            )}
            <button
              className="icon-button mobile-menu"
              aria-label="Buka navigasi"
              aria-expanded={modal?.title === "Menu TeamUp"}
              onClick={() =>
                setModal({
                  title: "Menu TeamUp",
                  content: (
                    <nav
                      className="mobile-dialog-nav"
                      aria-label="Navigasi mobile"
                    >
                      {nav.map(([href, label, icon]) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setModal(null)}
                        >
                          <Icon name={icon} />
                          {label}
                        </Link>
                      ))}
                      {user && (
                        <Link href="/profil" onClick={() => setModal(null)}>
                          <Icon name="edit" />
                          Profil saya
                        </Link>
                      )}
                      {user?.admin && (
                        <Link href="/admin" onClick={() => setModal(null)}>
                          <Icon name="shield" />
                          Admin
                        </Link>
                      )}
                      <Link href="/bantuan" onClick={() => setModal(null)}>
                        <Icon name="info" />
                        Bantuan
                      </Link>
                      {user && (
                        <button
                          onClick={requestLogout}
                        >
                          <Icon name="logout" />
                          Keluar dari akun
                        </button>
                      )}
                    </nav>
                  ),
                })
              }
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>
      <div className="main-wrapper" id="main-content" tabIndex={-1}>
        {!ready ? (
          <main className="container page" aria-busy="true">
            <div className="skeleton title-skeleton" />
            <div className="grid three">
              {[1, 2, 3].map((x) => (
                <div className="skeleton card-skeleton" key={x} />
              ))}
            </div>
            <p className="muted">Memuat TeamUp…</p>
          </main>
        ) : (
          <>
            {storageWarning && (
              <div className="container notice warning">
                Penyimpanan browser tidak tersedia. Perubahan hanya tersimpan
                selama halaman terbuka.
              </div>
            )}
            {user &&
              !user.suspended &&
              (!user.verified || !user.complete) &&
              !["/onboarding", "/profil", "/verifikasi"].includes(path) && (
                <div className="container notice account-notice">
                  <Icon name="info" />
                  <span>
                    {!user.verified
                      ? "Verifikasi email untuk mulai berkolaborasi."
                      : "Lengkapi profil agar kamu bisa mulai berkolaborasi."}
                  </span>
                  <Link
                    href={!user.verified ? "/verifikasi" : "/onboarding"}
                    className="text-link"
                  >
                    {!user.verified ? "Verifikasi" : "Lengkapi profil"}{" "}
                    <Icon name="arrow" size={16} />
                  </Link>
                </div>
              )}
            {content}
          </>
        )}
      </div>
      {!path.startsWith("/pesan") && (
        <footer>
          <div className="container footer-inner">
            <div>
              <Link href="/" className="brand">
                Team<span className="brand-up">Up</span>
                <span className="brand-dot">.</span>
              </Link>
              <p>Temukan teman bertumbuhmu.</p>
            </div>
            <div className="footer-links">
              <Link href="/privasi">Privasi</Link>
              <Link href="/bantuan">Bantuan</Link>
              <span>© 2026 TeamUp</span>
            </div>
          </div>
        </footer>
      )}
      {toast && (
        <div className="toast" role="status">
          <Icon name="info" />
          <span>{toast}</span>
          <button
            className="icon-button"
            onClick={() => setToast("")}
            aria-label="Tutup pemberitahuan"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
      <Dialog modal={modal} close={() => setModal(null)} />
    </>
  );
}
