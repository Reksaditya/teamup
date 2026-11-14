import test from "node:test";
import assert from "node:assert/strict";
import {
  seed,
  matchesAvailability,
  requestPartner,
  decideRequest,
  applyTeam,
  decideApplication,
  blockUser,
  canRead,
  personalId,
  sendMessage,
  saveGroup,
  requestGroup,
  decideGroup,
  manageGroup,
  saveAgenda,
  deleteAgenda,
  canSeeAgenda,
  canManageAgenda,
} from "./demo.ts";
import { calendarItems, dateKey, monthDays, shiftMonth } from "./calendar.ts";

test("kelompok: syarat akun, keputusan ketua, duplikasi dan slot terakhir", () => {
  let s = seed();
  assert.throws(() => requestGroup(s, "baru", "react", "Ingin belajar"));
  s = saveGroup(s, "alya", { ...s.groups[0], capacity: 3 }, "react");
  s = requestGroup(s, "rafi", "react", "Belajar React");
  s = requestGroup(s, "citra", "react", "Belajar komponen");
  const r = s.groupRequests.find((r) => r.user === "rafi");
  assert.throws(() => requestGroup(s, "rafi", "react", "Duplikat"));
  assert.throws(() => decideGroup(s, "bima", r.id, "Diterima"));
  s = decideGroup(s, "alya", r.id, "Diterima");
  assert.equal(s.groups.find((g) => g.id === "react").members.length, 3);
  assert.equal(
    s.groupRequests.find((r) => r.user === "citra").status,
    "Ditutup sistem",
  );
  assert.throws(() => decideGroup(s, "alya", r.id, "Diterima"));
  assert.throws(() => requestGroup(s, "nadia", "react", "Slot terakhir"));
});
test("kelompok: transfer sebelum keluar dan bubar hanya-baca", () => {
  let s = seed();
  assert.throws(() => manageGroup(s, "alya", "react", "leave"));
  assert.throws(() => manageGroup(s, "alya", "react", "transfer", "rafi"));
  assert.throws(() => manageGroup(s, "bima", "react", "toggle"));
  s = manageGroup(s, "alya", "react", "transfer", "bima");
  s = manageGroup(s, "alya", "react", "leave");
  assert.equal(canRead(s, "study:react", "alya"), false);
  assert.equal(canSeeAgenda(s, s.agenda[0], "alya"), false);
  assert.throws(() => sendMessage(s, "study:react", "alya", "Sudah keluar"));
  s = manageGroup(s, "bima", "react", "dissolve");
  assert.equal(canRead(s, "study:react", "bima"), true);
  assert.equal(canManageAgenda(s, s.agenda[0], "bima"), false);
  assert.throws(() => sendMessage(s, "study:react", "bima", "Hanya baca"));
});
test("kelompok: blokir menutup permintaan dan tidak mengeluarkan anggota bersama", () => {
  let s = requestGroup(seed(), "rafi", "react", "Ingin belajar");
  s = blockUser(s, "alya", "rafi");
  assert.equal(s.groupRequests[0].status, "Ditutup sistem");
  assert.throws(() => requestGroup(s, "rafi", "react", "Masih diblokir"));
  s = blockUser(s, "alya", "bima");
  assert.equal(canRead(s, "study:react", "bima"), true);
  assert.equal(s.groups[0].members.includes("bima"), true);
});
test("agenda: privasi pemilik dan anggota biasa mengelola agenda bersama", () => {
  let s = seed();
  const base = {
    title: "Latihan",
    at: "2026-11-20T19:00:00+07:00",
    category: "Tugas",
    notes: "Catatan",
    done: false,
    target: "",
  };
  s = saveAgenda(s, "alya", { ...base, scope: "personal" }, "private");
  const privateEvent = s.agenda.find((a) => a.id === "private");
  assert.equal(canSeeAgenda(s, privateEvent, "bima"), false);
  assert.throws(() =>
    saveAgenda(
      s,
      "bima",
      { ...privateEvent, title: "Tidak berhak" },
      "private",
    ),
  );
  assert.throws(() => deleteAgenda(s, "bima", "private"));
  s = saveAgenda(
    s,
    "alya",
    { ...base, scope: "team", target: "byte" },
    "shared",
  );
  s = saveAgenda(
    s,
    "dimas",
    {
      ...s.agenda.find((a) => a.id === "shared"),
      title: "Diedit anggota biasa",
    },
    "shared",
  );
  assert.equal(
    s.agenda.find((a) => a.id === "shared").title,
    "Diedit anggota biasa",
  );
  assert.throws(() =>
    saveAgenda(s, "bima", { ...base, scope: "team", target: "byte" }),
  );
  assert.throws(() =>
    saveAgenda(s, "alya", { ...base, scope: "personal", at: "tidak valid" }),
  );
  s = {
    ...s,
    teams: s.teams.map((t) =>
      t.id === "byte"
        ? { ...t, members: t.members.filter((id) => id !== "dimas") }
        : t,
    ),
  };
  assert.equal(
    canSeeAgenda(
      s,
      s.agenda.find((a) => a.id === "shared"),
      "dimas",
    ),
    false,
  );
  assert.throws(() => deleteAgenda(s, "dimas", "shared"));
});
test("agenda: penangguhan dan grup lain ditolak, waktu dinormalisasi UTC", () => {
  let s = seed();
  const data = {
    title: "Pertemuan",
    at: "2026-11-20T19:00:00+07:00",
    category: "Belajar",
    notes: "",
    done: false,
    scope: "group",
    target: "react",
  };
  s = saveAgenda(s, "bima", data, "meet");
  assert.equal(
    s.agenda.find((a) => a.id === "meet").at,
    "2026-11-20T12:00:00.000Z",
  );
  assert.throws(() => saveAgenda(s, "citra", data));
  s = {
    ...s,
    users: s.users.map((u) =>
      u.id === "bima" ? { ...u, suspended: true } : u,
    ),
  };
  assert.equal(
    canSeeAgenda(
      s,
      s.agenda.find((a) => a.id === "meet"),
      "bima",
    ),
    false,
  );
  assert.throws(() => deleteAgenda(s, "bima", "meet"));
});
test("kalender: batas tahun, tahun kabisat, zona dan tanggal kompetisi terpisah", () => {
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
  assert.equal(shiftMonth("2027-01", -1), "2026-12");
  assert.equal(monthDays("2028-02").includes("2028-02-29"), true);
  assert.equal(monthDays("2026-11").length, 42);
  const s = seed(),
    user = {
      ...s.users[0],
      availability: [
        { day: "Minggu", start: "01:00", end: "02:00", zone: "Asia/Jayapura" },
      ],
    };
  const items = calendarItems(s, user, monthDays("2026-11"), []);
  assert.ok(
    items.some(
      (a) => a.source === "schedule" && dateKey(a.at) === "2026-11-07",
    ),
  );
  const deadline = items.find((a) => a.id === "deadline-hack"),
    competition = items.find((a) => a.id === "competition-hack");
  assert.equal(deadline.category, "Pendaftaran");
  assert.equal(competition.category, "Kompetisi");
  assert.notEqual(deadline.at, competition.at);
  assert.equal(
    items.some((a) => a.id === "deadline-innovate"),
    false,
  );
});
test("permintaan berlawanan arah dan retry tidak membuat partner ganda", () => {
  let s = seed();
  s = decideRequest(s, "r1", "alya", "Diterima");
  assert.equal(
    s.requests.filter((r) => r.status === "Diterima" && r.from === "citra")
      .length,
    1,
  );
  assert.throws(() => decideRequest(s, "r1", "alya", "Diterima"));
  assert.throws(() => requestPartner(s, "alya", "citra"));
  assert.ok(canRead(s, personalId("alya", "citra"), "alya"));
  assert.ok(!canRead(s, personalId("alya", "citra"), "bima"));
});
test("hanya penerima memutuskan, pengirim hanya membatalkan", () => {
  const s = seed();
  assert.throws(() => decideRequest(s, "r1", "citra", "Diterima"));
  assert.throws(() => decideRequest(s, "r1", "alya", "Dibatalkan"));
  assert.equal(
    decideRequest(s, "r1", "citra", "Dibatalkan").requests[0].status,
    "Dibatalkan",
  );
});
test("slot terakhir hanya menerima satu pelamar dan menutup sisanya", () => {
  let s = seed();
  s.teams.find((t) => t.id === "pixel").capacity = 3;
  s = applyTeam(s, "alya", "pixel", "UI/UX Designer", "Halo");
  s = applyTeam(s, "citra", "pixel", "UI/UX Designer", "Halo");
  const [a, b] = s.applications.filter((a) => a.team === "pixel");
  s = decideApplication(s, a.id, "bima", "Diterima");
  assert.equal(s.teams.find((t) => t.id === "pixel").members.length, 3);
  assert.equal(
    s.applications.find((x) => x.id === b.id).status,
    "Ditutup sistem",
  );
  assert.throws(() => decideApplication(s, b.id, "bima", "Diterima"));
});
test("satu tim aktif per lomba termasuk pada penerimaan", () => {
  let s = seed();
  s = applyTeam(s, "bima", "byte", "Frontend Developer", "Halo");
  s.teams.push({
    ...s.teams.find((t) => t.id === "byte"),
    id: "other",
    leader: "citra",
    members: ["citra", "bima"],
  });
  assert.throws(() =>
    decideApplication(s, s.applications.at(-1).id, "alya", "Diterima"),
  );
});
test("deadline dicek ulang saat submit dan keputusan", () => {
  let s = seed();
  s = applyTeam(s, "alya", "pixel", "UI/UX Designer", "Halo");
  s.competitions.find((c) => c.id === "innovate").deadline =
    "2000-01-01T00:00:00Z";
  assert.throws(() => applyTeam(s, "citra", "pixel", "UI/UX Designer", "Halo"));
  assert.throws(() =>
    decideApplication(s, s.applications.at(-1).id, "bima", "Diterima"),
  );
});
test("blokir membatalkan permintaan dan menghentikan personal", () => {
  let s = blockUser(seed(), "alya", "citra");
  assert.equal(s.requests.find((r) => r.id === "r1").status, "Dibatalkan");
  assert.throws(() => requestPartner(s, "citra", "alya"));
  s = blockUser(s, "alya", "bima");
  assert.throws(() =>
    sendMessage(s, personalId("alya", "bima"), "bima", "Halo"),
  );
});
test("blokir tidak otomatis mengeluarkan anggota tim bersama", () => {
  const s = blockUser(seed(), "alya", "dimas");
  assert.ok(s.teams.find((t) => t.id === "byte").members.includes("dimas"));
  assert.ok(canRead(s, "team:byte", "dimas"));
});
test("keluar tim kehilangan akses seluruh riwayat dan kirim", () => {
  const s = seed();
  s.teams.find((t) => t.id === "byte").members = ["alya"];
  assert.ok(!canRead(s, "team:byte", "dimas"));
  assert.throws(() => sendMessage(s, "team:byte", "dimas", "Halo"));
});
test("tim bubar hanya-baca bagi mantan anggota yang berhak", () => {
  const s = seed();
  s.teams.find((t) => t.id === "byte").status = "Bubar";
  assert.ok(canRead(s, "team:byte", "dimas"));
  assert.throws(() => sendMessage(s, "team:byte", "dimas", "Halo"));
});
test("akun ditangguhkan tidak dapat membaca atau mengirim", () => {
  const s = seed();
  s.users.find((u) => u.id === "alya").suspended = true;
  assert.ok(!canRead(s, "team:byte", "alya"));
  assert.throws(() => requestPartner(s, "alya", "nadia"));
});
test("retry pesan mempertahankan satu identitas tanpa duplikat", () => {
  let s = seed();
  s = sendMessage(s, "team:byte", "alya", "Halo", "retry-id");
  s = sendMessage(s, "team:byte", "alya", "Halo", "retry-id");
  assert.equal(s.messages.filter((m) => m.id === "retry-id").length, 1);
  assert.throws(() => sendMessage(s, "team:byte", "alya", "a".repeat(2001)));
});
test("email belum diverifikasi dan profil belum lengkap membatasi mutasi", () => {
  const s = seed();
  assert.throws(() => requestPartner(s, "baru", "alya"));
  s.users.find((u) => u.id === "baru").verified = true;
  assert.throws(() => applyTeam(s, "baru", "pixel", "Designer", "Halo"));
});
test("slot peran divalidasi pada pengajuan dan penerimaan", () => {
  let s = seed();
  s.teams.find((t) => t.id === "pixel").roles = [
    { name: "Designer", slots: 1 },
  ];
  assert.throws(() => applyTeam(s, "alya", "pixel", "Developer", "Halo"));
  s = applyTeam(s, "alya", "pixel", "Designer", "Halo");
  s = applyTeam(s, "citra", "pixel", "Designer", "Halo");
  s = decideApplication(
    s,
    s.applications.find((a) => a.team === "pixel").id,
    "bima",
    "Diterima",
  );
  assert.equal(s.teams.find((t) => t.id === "pixel").roles[0].slots, 0);
  assert.equal(s.applications.at(-1).status, "Ditutup sistem");
});

test("jadwal tambahan, perbedaan zona, dan batas hari dihitung dari irisan", () => {
  const u = seed().users[0];
  u.availability = [
    { day: "Rabu", start: "10:00", end: "11:00", zone: "Asia/Jakarta" },
    { day: "Sabtu", start: "00:00", end: "01:00", zone: "Asia/Makassar" },
  ];
  assert.ok(
    matchesAvailability(u, {
      day: "Jumat",
      start: "23:00",
      end: "23:30",
      zone: "Asia/Jakarta",
    }),
  );
  assert.ok(
    matchesAvailability(u, {
      start: "23:00",
      end: "23:30",
      zone: "Asia/Jakarta",
    }),
  );
  assert.ok(
    !matchesAvailability(u, {
      day: "Sabtu",
      start: "10:00",
      end: "11:00",
      zone: "Asia/Jakarta",
    }),
  );
});
