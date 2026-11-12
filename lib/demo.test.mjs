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
} from "./demo.ts";
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

test("jadwal tambahan, perbedaan zona, dan batas hari dihitung dari irisan",()=>{const u=seed().users[0];u.availability=[{day:"Rabu",start:"10:00",end:"11:00",zone:"Asia/Jakarta"},{day:"Sabtu",start:"00:00",end:"01:00",zone:"Asia/Makassar"}];assert.ok(matchesAvailability(u,{day:"Jumat",start:"23:00",end:"23:30",zone:"Asia/Jakarta"}));assert.ok(matchesAvailability(u,{start:"23:00",end:"23:30",zone:"Asia/Jakarta"}));assert.ok(!matchesAvailability(u,{day:"Sabtu",start:"10:00",end:"11:00",zone:"Asia/Jakarta"}));});
