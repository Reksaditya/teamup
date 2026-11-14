import type { Agenda, State, User } from "./demo";

export const dateKey = (date: Date | string) =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
export const shiftMonth = (month: string, amount: number) => {
  const d = new Date(month + "-01T12:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + amount);
  return d.toISOString().slice(0, 7);
};
export function monthDays(month: string) {
  const first = new Date(month + "-01T12:00:00Z");
  const start = first.getTime() - ((first.getUTCDay() + 6) % 7) * 86400000;
  return Array.from({ length: 42 }, (_, index) =>
    new Date(start + index * 86400000).toISOString().slice(0, 10),
  );
}
export type CalendarItem = {
  id: string;
  title: string;
  at: string;
  category: string;
  notes: string;
  done: boolean;
  source: "manual" | "competition" | "schedule";
  context: string;
  href?: string;
  event?: Agenda;
};
export function calendarItems(
  s: State,
  user: User,
  dates: string[],
  agenda: Agenda[],
): CalendarItem[] {
  const manual: CalendarItem[] = agenda.map((a) => ({
    ...a,
    event: a,
    source: "manual",
    context:
      a.scope === "personal"
        ? "Pribadi"
        : a.scope === "team"
          ? s.teams.find((t) => t.id === a.target)?.name || "Tim"
          : s.groups.find((g) => g.id === a.target)?.name || "Kelompok",
  }));
  const competitionIds = new Set(
    s.teams
      .filter((t) => t.members.includes(user.id) && t.status !== "Bubar")
      .map((t) => t.competition),
  );
  const competitions: CalendarItem[] = s.competitions
    .filter((c) => competitionIds.has(c.id))
    .flatMap((c) => [
      {
        id: "deadline-" + c.id,
        title: "Batas pendaftaran: " + c.name,
        at: c.deadline,
        category: "Pendaftaran",
        notes:
          "Deadline pendaftaran kompetisi. Bersumber dari informasi kompetisi.",
        done: false,
        source: "competition" as const,
        context: c.name,
        href: "/lomba/" + c.id,
      },
      {
        id: "competition-" + c.id,
        title: "Pelaksanaan: " + c.name,
        at: c.date,
        category: "Kompetisi",
        notes: "Tanggal pelaksanaan, terpisah dari deadline pendaftaran.",
        done: false,
        source: "competition" as const,
        context: c.name,
        href: "/lomba/" + c.id,
      },
    ]);
  const schedules: CalendarItem[] = [];
  const names = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const offsets: Record<string, string> = {
    "Asia/Jakarta": "+07:00",
    "Asia/Makassar": "+08:00",
    "Asia/Jayapura": "+09:00",
  };
  const days = new Set(dates);
  if (dates.length) {
    const candidates = new Set(dates);
    for (const day of [dates[0], dates[dates.length - 1]])
      for (const delta of [-1, 1])
        candidates.add(
          new Date(new Date(day + "T12:00:00Z").getTime() + delta * 86400000)
            .toISOString()
            .slice(0, 10),
        );
    for (const day of candidates)
      (user.availability || [user]).forEach((a, index) => {
        if (
          names[new Date(day + "T12:00:00Z").getUTCDay()] !== a.day ||
          !a.start ||
          !a.end
        )
          return;
        const at = new Date(
          day + "T" + a.start + ":00" + (offsets[a.zone] || "+07:00"),
        ).toISOString();
        if (days.has(dateKey(at)))
          schedules.push({
            id: `schedule-${user.id}-${index}-${day}`,
            title: "Jadwal belajar",
            at,
            category: "Belajar",
            notes: `${a.day}, ${a.start}-${a.end} (${a.zone}). Ubah pengulangan melalui Profil.`,
            done: false,
            source: "schedule",
            context: "Jadwal profil",
            href: "/dashboard/profil",
          });
      });
  }
  return [...manual, ...competitions, ...schedules].sort(
    (a, b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id),
  );
}
export const monthTitle = (month: string) =>
  new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(month + "-01T12:00:00Z"));
export const dayTitle = (day: string) =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(day + "T12:00:00Z"));
export const clockTime = (at: string) =>
  new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(at));
