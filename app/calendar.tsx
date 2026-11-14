"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Shared } from "./teamup";
import {
  agendaCategories,
  canManageAgenda,
  canSeeAgenda,
  deleteAgenda,
  saveAgenda,
  type Agenda,
} from "../lib/demo";
import {
  calendarItems,
  clockTime,
  dateKey,
  dayTitle,
  monthDays,
  monthTitle,
  shiftMonth,
  type CalendarItem,
} from "../lib/calendar";
import { Empty, Field, Icon, Title, formData } from "./ui";
import { attempt } from "./groups";

function AgendaForm({
  p,
  day,
  event,
}: {
  p: Shared;
  day: string;
  event?: Agenda;
}) {
  const [error, setError] = useState("");
  const contexts = [
    { value: "personal", label: "Pribadi" },
    ...p.state.teams
      .filter((t) => t.members.includes(p.user!.id) && t.status !== "Bubar")
      .map((t) => ({ value: "team:" + t.id, label: "Tim · " + t.name })),
    ...p.state.groups
      .filter((g) => g.members.includes(p.user!.id) && g.status !== "Bubar")
      .map((g) => ({ value: "group:" + g.id, label: "Kelompok · " + g.name })),
  ];
  const context = event
    ? event.scope === "personal"
      ? "personal"
      : event.scope + ":" + event.target
    : "personal";
  return (
    <form
      onSubmit={(e) => {
        const f = formData(e),
          [scope, target = ""] = (event ? context : f.context).split(":");
        setError("");
        attempt(
          p,
          (s) =>
            saveAgenda(
              s,
              p.user!.id,
              {
                title: f.title,
                at: f.when + ":00+07:00",
                category: f.category,
                notes: f.notes,
                done: f.done === "on",
                scope: scope as Agenda["scope"],
                target,
              },
              event?.id,
            ),
          setError,
          () => p.setModal(null),
        );
      }}
    >
      {error && (
        <div className="notice danger" role="alert">
          {error}
        </div>
      )}
      <Field label="Judul agenda">
        <input
          name="title"
          required
          maxLength={120}
          defaultValue={event?.title}
        />
      </Field>
      <Field label="Tanggal dan jam (WIB)">
        <input
          name="when"
          type="datetime-local"
          required
          defaultValue={
            event
              ? dateKey(event.at) +
                "T" +
                new Intl.DateTimeFormat("en-GB", {
                  timeZone: "Asia/Jakarta",
                  hour: "2-digit",
                  minute: "2-digit",
                  hourCycle: "h23",
                }).format(new Date(event.at))
              : day + "T19:00"
          }
        />
      </Field>
      <div className="grid two">
        <Field label="Kategori">
          <select name="category" defaultValue={event?.category}>
            {agendaCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field
          label="Lokasi agenda"
          hint={
            event
              ? "Lokasi ditentukan saat agenda dibuat."
              : "Semua anggota dapat mengelola agenda bersama."
          }
        >
          <select name="context" defaultValue={context} disabled={!!event}>
            {contexts.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Catatan">
        <textarea name="notes" maxLength={2000} defaultValue={event?.notes} />
      </Field>
      <label className="check-field">
        <input name="done" type="checkbox" defaultChecked={event?.done} />
        Agenda selesai
      </label>
      <button className="button primary full">Simpan agenda</button>
    </form>
  );
}

export function AgendaList({ p, items }: { p: Shared; items: CalendarItem[] }) {
  return (
    <div className="day-agenda-list">
      {items.length ? (
        items.map((item) => (
          <article
            className={"agenda-item " + (item.done ? "agenda-done" : "")}
            key={item.id}
          >
            <div className="row between">
              <span className="calendar-category">{item.category}</span>
              <time dateTime={item.at}>{clockTime(item.at)} WIB</time>
            </div>
            <h3>{item.title}</h3>
            <p className="agenda-context">
              {item.context}
              {item.done ? " · Selesai" : ""}
            </p>
            {item.notes && <p>{item.notes}</p>}
            {item.source === "manual" && item.event ? (
              canManageAgenda(p.state, item.event, p.user!.id) ? (
                <div className="actions">
                  <button
                    className="text-link"
                    aria-label={"Edit agenda " + item.title}
                    onClick={() =>
                      p.setModal({
                        title: "Edit agenda",
                        content: (
                          <AgendaForm
                            p={p}
                            event={item.event}
                            day={dateKey(item.at)}
                          />
                        ),
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="text-link"
                    aria-label={
                      (item.done ? "Buka kembali " : "Tandai selesai ") +
                      item.title
                    }
                    onClick={() =>
                      p.commit(
                        (s) =>
                          saveAgenda(
                            s,
                            p.user!.id,
                            { ...item.event!, done: !item.done },
                            item.id,
                          ),
                        "Status agenda diperbarui.",
                      )
                    }
                  >
                    {item.done ? "Buka kembali" : "Tandai selesai"}
                  </button>
                  <button
                    className="text-link danger-text"
                    aria-label={"Hapus agenda " + item.title}
                    onClick={() =>
                      p.confirm(
                        "Hapus agenda?",
                        "Agenda ini akan dihapus dari kalender seluruh pihak yang berhak melihatnya.",
                        () =>
                          p.commit(
                            (s) => deleteAgenda(s, p.user!.id, item.id),
                            "Agenda dihapus.",
                          ),
                        "Hapus agenda",
                      )
                    }
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <small>Hanya-baca. Kamu tidak dapat mengubah agenda ini.</small>
              )
            ) : (
              <>
                <small>Otomatis · hanya-baca</small>
                <Link
                  className="text-link"
                  href={item.href || "/dashboard/kalender"}
                >
                  {item.source === "schedule"
                    ? "Ubah jadwal profil"
                    : "Lihat kompetisi"}
                </Link>
              </>
            )}
          </article>
        ))
      ) : (
        <Empty
          title="Tidak ada agenda pada tanggal ini"
          text="Pilih tanggal lain atau tambahkan agenda pribadi maupun bersama."
        />
      )}
    </div>
  );
}
export function Calendar(p: Shared) {
  const today = dateKey(new Date());
  const [month, setMonth] = useState(today.slice(0, 7)),
    [selected, setSelected] = useState(today),
    [category, setCategory] = useState("");
  const calendarRef = useRef<HTMLDivElement>(null);
  const days = monthDays(month);
  const items = calendarItems(
    p.state,
    p.user!,
    days,
    p.state.agenda.filter((a) => canSeeAgenda(p.state, a, p.user!.id)),
  ).filter((a) => !category || a.category === category);
  const selectedItems = items.filter((a) => dateKey(a.at) === selected);
  function choose(day: string) {
    setSelected(day);
    if (day.slice(0, 7) !== month) setMonth(day.slice(0, 7));
  }
  return (
    <main className="dashboard-page">
      <Title
        title="Kalender belajar"
        text="Agenda pribadi, kegiatan bersama, dan tanggal penting kompetisimu. Semua waktu ditampilkan dalam WIB."
      >
        <button
          className="button primary"
          onClick={() =>
            p.setModal({
              title: "Tambah agenda",
              content: <AgendaForm p={p} day={selected} />,
            })
          }
        >
          <Icon name="plus" />
          Tambah agenda
        </button>
      </Title>
      <div className="calendar-layout">
        <section className="calendar-month card" aria-labelledby="month-title">
          <div className="month-controls">
            <button
              className="icon-button"
              aria-label="Bulan sebelumnya"
              onClick={() => setMonth(shiftMonth(month, -1))}
            >
              <Icon name="back" />
            </button>
            <h2 id="month-title" aria-live="polite">
              {monthTitle(month)}
            </h2>
            <button
              className="icon-button"
              aria-label="Bulan berikutnya"
              onClick={() => setMonth(shiftMonth(month, 1))}
            >
              <Icon name="arrow" />
            </button>
          </div>
          <div className="calendar-toolbar">
            <button
              className="button secondary small"
              onClick={() => {
                setMonth(today.slice(0, 7));
                setSelected(today);
              }}
            >
              Hari ini
            </button>
            <label className="field">
              Kategori agenda
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Semua kategori</option>
                {agendaCategories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="calendar-scroll" ref={calendarRef}>
            <div className="calendar-table">
              <div className="calendar-weekdays" aria-hidden="true">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  ),
                )}
              </div>
              <div
                className="calendar-grid"
                onKeyDown={(e) => {
                  const shifts: Record<string, number> = {
                    ArrowLeft: -1,
                    ArrowRight: 1,
                    ArrowUp: -7,
                    ArrowDown: 7,
                  };
                  if (!(e.key in shifts)) return;
                  e.preventDefault();
                  const current =
                    (e.target as HTMLElement).getAttribute("data-day") ||
                    selected;
                  const next = new Date(
                    new Date(current + "T12:00:00Z").getTime() +
                      shifts[e.key] * 86400000,
                  )
                    .toISOString()
                    .slice(0, 10);
                  choose(next);
                  requestAnimationFrame(() =>
                    calendarRef.current
                      ?.querySelector<HTMLButtonElement>(`[data-day="${next}"]`)
                      ?.focus(),
                  );
                }}
              >
                {days.map((day) => {
                  const count = items.filter(
                    (item) => dateKey(item.at) === day,
                  ).length;
                  return (
                    <button
                      type="button"
                      key={day}
                      data-day={day}
                      aria-label={`${dayTitle(day)}, ${count} agenda`}
                      aria-current={day === today ? "date" : undefined}
                      aria-pressed={day === selected}
                      className={
                        (day.slice(0, 7) !== month ? "outside-month " : "") +
                        (day === selected ? "selected-day" : "")
                      }
                      onClick={() => choose(day)}
                    >
                      <span>{Number(day.slice(-2))}</span>
                      {count > 0 && (
                        <span className="day-count" aria-hidden="true">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <small className="calendar-scroll-hint">
            Geser kalender untuk melihat seluruh tanggal.
          </small>
        </section>
        <section
          className="calendar-daily card"
          aria-labelledby="selected-day-title"
        >
          <h2 id="selected-day-title" aria-live="polite">
            {dayTitle(selected)}
          </h2>
          <AgendaList p={p} items={selectedItems} />
        </section>
      </div>
    </main>
  );
}
export function MiniCalendar(p: Shared) {
  const today = dateKey(new Date()),
    [month, setMonth] = useState(today.slice(0, 7));
  const days = monthDays(month),
    items = calendarItems(
      p.state,
      p.user!,
      days,
      p.state.agenda.filter((a) => canSeeAgenda(p.state, a, p.user!.id)),
    );
  return (
    <section className="card mini-calendar" aria-label="Ringkasan kalender">
      <div className="month-controls">
        <button
          className="icon-button"
          aria-label="Bulan ringkasan sebelumnya"
          onClick={() => setMonth(shiftMonth(month, -1))}
        >
          <Icon name="back" size={16} />
        </button>
        <h2>{monthTitle(month)}</h2>
        <button
          className="icon-button"
          aria-label="Bulan ringkasan berikutnya"
          onClick={() => setMonth(shiftMonth(month, 1))}
        >
          <Icon name="arrow" size={16} />
        </button>
      </div>
      <div className="mini-month-grid" aria-hidden="true">
        {["S", "S", "R", "K", "J", "S", "M"].map((d, i) => (
          <strong key={i}>{d}</strong>
        ))}
        {days.map((day) => (
          <span
            key={day}
            className={
              (day === today ? "mini-today " : "") +
              (day.slice(0, 7) !== month ? "outside-month" : "")
            }
            title={dayTitle(day)}
          >
            {Number(day.slice(-2))}
            {items.some((item) => dateKey(item.at) === day) && <i />}
          </span>
        ))}
      </div>
      <Link className="text-link" href="/dashboard/kalender">
        Buka kalender lengkap
      </Link>
    </section>
  );
}
