"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { Shared } from "./teamup";
import { Avatar, Empty, Icon, Title } from "./ui";
import { canSeeAgenda, date } from "../lib/demo";
import { calendarItems, dateKey, monthDays } from "../lib/calendar";
import { MiniCalendar } from "./calendar";

function DashboardNav({ p, close }: { p: Shared; close?: () => void }) {
  const path = usePathname();
  const links = [
    ["/dashboard", "Ringkasan", "grid"],
    ["/dashboard/profil", "Profil", "edit"],
    ["/dashboard/kalender", "Kalender", "clock"],
    ["/dashboard/aktivitas", "Aktivitas", "activity"],
    ["/dashboard/pesan", "Pesan", "chat"],
    ["/partner", "Cari Partner", "users"],
  ];
  const groups = p.state.groups.filter((g) => g.members.includes(p.user!.id));
  const teams = p.state.teams.filter((t) => t.members.includes(p.user!.id));
  return (
    <nav className="dashboard-navigation" aria-label="Navigasi dashboard">
      {links.map(([href, title, icon]) => (
        <Link
          key={href}
          href={href}
          onClick={close}
          aria-current={
            (href === "/dashboard" ? path === href : path.startsWith(href))
              ? "page"
              : undefined
          }
        >
          <Icon name={icon} size={18} />
          {title}
        </Link>
      ))}
      <details className="workspace-dropdown" open>
        <summary>
          <Icon name="book" size={18} />
          Kelompok Saya<span className="workspace-count">{groups.length}</span>
        </summary>
        <div>
          {groups.map((g) => (
            <Link key={g.id} href={"/kelompok/" + g.id} onClick={close}>
              {g.name}
              {g.status === "Bubar" ? " · Bubar" : ""}
            </Link>
          ))}
          {!groups.length && <p>Belum ada kelompok.</p>}
          <Link href="/dashboard/kelompok" onClick={close}>
            Temukan / buat kelompok
          </Link>
        </div>
      </details>
      <details className="workspace-dropdown" open>
        <summary>
          <Icon name="trophy" size={18} />
          Tim Kompetisi<span className="workspace-count">{teams.length}</span>
        </summary>
        <div>
          {teams.map((t) => (
            <Link key={t.id} href={"/tim/" + t.id} onClick={close}>
              {t.name}
              {t.status === "Bubar" ? " · Bubar" : ""}
            </Link>
          ))}
          {!teams.length && <p>Belum ada tim kompetisi.</p>}
          <Link href="/tim" onClick={close}>
            Cari tim kompetisi
          </Link>
        </div>
      </details>
      <Link href="/bantuan" onClick={close}>
        <Icon name="info" size={18} />
        Bantuan
      </Link>
    </nav>
  );
}
export function DashboardShell({
  p,
  children,
}: {
  p: Shared;
  children: ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-user">
          <Avatar user={p.user} />
          <div>
            <strong>{p.user?.name}</strong>
            <span>Ruang belajarmu</span>
          </div>
        </div>
        <DashboardNav p={p} />
      </aside>
      <div className="dashboard-content">
        <div className="dashboard-mobile-control">
          <button
            className="button secondary"
            onClick={() =>
              p.setModal({
                title: "Navigasi dashboard",
                content: <DashboardNav p={p} close={() => p.setModal(null)} />,
              })
            }
          >
            <Icon name="menu" />
            Menu dashboard
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function DashboardOverview(p: Shared) {
  const user = p.user!;
  const rooms = [
    ...p.state.teams
      .filter((t) => t.members.includes(user.id))
      .map((t) => ({
        id: "team:" + t.id,
        name: t.name,
        subtitle: "Tim kompetisi",
        href: "/tim/" + t.id,
        chat: "/dashboard/pesan/team:" + t.id,
      })),
    ...p.state.groups
      .filter((g) => g.members.includes(user.id))
      .map((g) => ({
        id: "group:" + g.id,
        name: g.name,
        subtitle: "Kelompok belajar",
        href: "/kelompok/" + g.id,
        chat: "/dashboard/pesan/study:" + g.id,
      })),
  ];
  const [roomId, setRoomId] = useState(rooms[0]?.id || "");
  const room = rooms.find((r) => r.id === roomId) || rooms[0];
  const [viewTime] = useState(() => Date.now());
  const today = dateKey(new Date(viewTime));
  const events = calendarItems(
    p.state,
    user,
    monthDays(today.slice(0, 7)),
    p.state.agenda.filter((a) => canSeeAgenda(p.state, a, user.id)),
  );
  const upcoming = events
    .filter((a) => new Date(a.at).getTime() >= viewTime && !a.done)
    .slice(0, 5);
  const pending =
    p.state.requests.filter((r) => r.to === user.id && r.status === "Menunggu")
      .length +
    p.state.applications.filter(
      (a) =>
        a.status === "Menunggu" &&
        p.state.teams.find((t) => t.id === a.team)?.leader === user.id,
    ).length +
    p.state.groupRequests.filter(
      (r) =>
        r.status === "Menunggu" &&
        p.state.groups.find((g) => g.id === r.group)?.leader === user.id,
    ).length;
  const roomAgenda = room
    ? events.filter(
        (item) =>
          item.event && item.event.scope + ":" + item.event.target === room.id,
      )
    : [];
  const team = room?.id.startsWith("team:")
    ? p.state.teams.find((t) => "team:" + t.id === room.id)
    : undefined;
  const competition = team
    ? p.state.competitions.find((c) => c.id === team.competition)
    : undefined;
  return (
    <main className="dashboard-page">
      <Title
        title="Ringkasan"
        text={`Selamat datang, ${user.name.split(" ")[0]}. Lanjutkan belajar dan kolaborasimu.`}
      />
      <div className="dashboard-overview">
        <div className="overview-main">
          <section className="card overview-profile">
            <Avatar user={user} size="large" />
            <div>
              <h2>{user.name}</h2>
              <p>{user.institution || "Institusi belum diisi"}</p>
              <p className="muted">
                {user.city || "Kota belum diisi"} ·{" "}
                {user.complete ? "Profil lengkap" : "Profil belum lengkap"}
              </p>
            </div>
            <Link className="button secondary" href="/dashboard/profil">
              Edit profil
            </Link>
          </section>
          <Link className="overview-activity" href="/dashboard/aktivitas">
            <Icon name="activity" />
            <span>
              <strong>
                {pending
                  ? `${pending} permintaan perlu ditinjau`
                  : "Lihat aktivitas kolaborasimu"}
              </strong>
              <small>
                Permintaan partner, lamaran tim, dan kelompok belajar
              </small>
            </span>
            <Icon name="arrow" />
          </Link>
          <section
            className="overview-rooms"
            aria-labelledby="overview-rooms-title"
          >
            <div className="section-heading">
              <h2 id="overview-rooms-title">Ruang kolaborasi</h2>
              <Link className="text-link" href="/dashboard/kelompok">
                Cari kelompok
              </Link>
            </div>
            <p className="muted">
              Pilih kelompok atau tim untuk melihat agenda dan melanjutkan
              diskusi.
            </p>
            <div className="room-picker">
              {rooms.map((r) => (
                <button
                  key={r.id}
                  className={room?.id === r.id ? "selected-room" : ""}
                  aria-pressed={room?.id === r.id}
                  onClick={() => setRoomId(r.id)}
                >
                  <strong>{r.name}</strong>
                  <span>{r.subtitle}</span>
                </button>
              ))}
            </div>
            {!rooms.length && (
              <Empty
                title="Belum ada ruang kolaborasi"
                text="Cari kelompok belajar atau bergabung dengan tim kompetisi."
              />
            )}
            {room && (
              <section
                className="card selected-room-panel"
                aria-label={"Ringkasan " + room.name}
              >
                <div className="section-heading">
                  <div>
                    <p className="section-label">{room.subtitle}</p>
                    <h3>{room.name}</h3>
                  </div>
                  <Link className="text-link" href={room.href}>
                    Lihat detail
                  </Link>
                </div>
                {competition && (
                  <div className="room-deadline">
                    <strong>Deadline pendaftaran</strong>
                    <span>{date(competition.deadline)}</span>
                    <Link
                      className="text-link"
                      href={"/lomba/" + competition.id}
                    >
                      {competition.name}
                    </Link>
                  </div>
                )}
                <div className="overview-agenda">
                  {roomAgenda.length ? (
                    roomAgenda.slice(0, 4).map((a) => (
                      <Link href="/dashboard/kalender" key={a.id}>
                        <strong>{a.title}</strong>
                        <span>
                          {date(a.at)}
                          {a.done ? " · Selesai" : ""}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="muted">
                      Belum ada agenda bersama. Tambahkan dari Kalender.
                    </p>
                  )}
                </div>
                <div className="actions">
                  <Link className="button primary" href={room.chat}>
                    Buka percakapan
                  </Link>
                  <Link className="button secondary" href="/dashboard/kalender">
                    Atur agenda
                  </Link>
                </div>
              </section>
            )}
          </section>
        </div>
        <aside className="overview-aside">
          <section className="card upcoming-panel">
            <h2>Agenda terdekat</h2>
            {upcoming.length ? (
              upcoming.map((item) => (
                <Link key={item.id} href="/dashboard/kalender">
                  <span className="calendar-category">{item.category}</span>
                  <strong>{item.title}</strong>
                  <time dateTime={item.at}>{date(item.at)}</time>
                  <small>{item.context}</small>
                </Link>
              ))
            ) : (
              <p className="muted">Belum ada agenda mendatang.</p>
            )}
            <Link className="text-link" href="/dashboard/kalender">
              Lihat semua agenda
            </Link>
          </section>
          <MiniCalendar {...p} />
        </aside>
      </div>
    </main>
  );
}
