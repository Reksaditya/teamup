export type Topic = { name: string; level: string };
export type Availability = {
  day: string;
  start: string;
  end: string;
  zone: string;
};
export type User = {
  id: string;
  name: string;
  email: string;
  institution: string;
  major: string;
  city: string;
  bio: string;
  topics: Topic[];
  mode: string;
  day: string;
  start: string;
  end: string;
  zone: string;
  availability?: Availability[];
  photo?: string;
  verified: boolean;
  suspended: boolean;
  admin?: boolean;
  complete: boolean;
  color: number;
};
export type Competition = {
  id: string;
  name: string;
  organizer: string;
  category: string;
  level: string;
  fee: number;
  deadline: string;
  date: string;
  description: string;
  requirements: string;
  prize: string;
  source: string;
  status: string;
  verified: boolean;
  max: number;
  art: string;
};
export type Team = {
  id: string;
  name: string;
  competition: string;
  leader: string;
  members: string[];
  capacity: number;
  role: string;
  roles?: { name: string; slots: number }[];
  description: string;
  status: string;
};
export type Request = {
  id: string;
  from: string;
  to: string;
  status: string;
  at: string;
};
export type Application = {
  id: string;
  user: string;
  team: string;
  role: string;
  message: string;
  status: string;
  at: string;
};
export type Message = {
  id: string;
  conversation: string;
  user: string;
  text: string;
  at: string;
  status: string;
};
export type Report = {
  id: string;
  user: string;
  target: string;
  category: string;
  reason: string;
  evidence: string;
  status: string;
  at: string;
};
export type Audit = {
  id: string;
  actor: string;
  object: string;
  reason: string;
  action: string;
  at: string;
};
export type State = {
  users: User[];
  competitions: Competition[];
  teams: Team[];
  requests: Request[];
  applications: Application[];
  messages: Message[];
  blocks: { from: string; to: string }[];
  reports: Report[];
  audit: Audit[];
  session: string | null;
};
export const uid = () => crypto.randomUUID();
export const now = () => new Date().toISOString();
export const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
export const date = (s: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(s)) + " WIB";
export const closed = (c: Competition) =>
  Date.now() > new Date(c.deadline).getTime();
export const blocked = (s: State, a: string, b: string) =>
  s.blocks.some(
    (x) => (x.from === a && x.to === b) || (x.from === b && x.to === a),
  );
export const active = (s: State, id: string) =>
  s.users.find((u) => u.id === id && !u.suspended);
export function eligible(s: State, id: string) {
  const u = active(s, id);
  if (!u) throw Error("Akun tidak memiliki akses.");
  if (!u.verified) throw Error("Verifikasi email terlebih dahulu.");
  if (!u.complete) throw Error("Lengkapi profil terlebih dahulu.");
  return u;
}
export const personalId = (a: string, b: string) =>
  "personal:" + [a, b].sort().join(":");
export function matchesAvailability(user: User, filters: Record<string, string>) {
  const days = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
  const offset = (zone: string) => zone === 'Asia/Makassar' ? 480 : zone === 'Asia/Jayapura' ? 540 : 420;
  const minutes = (time: string) => Number(time.split(':')[0]) * 60 + Number(time.split(':')[1]);
  const queryDays = filters.day ? [days.indexOf(filters.day)] : days.map((_, i) => i);
  return (user.availability || [user]).some(interval => {
    const start = days.indexOf(interval.day) * 1440 + minutes(interval.start) - offset(interval.zone);
    const end = days.indexOf(interval.day) * 1440 + minutes(interval.end) - offset(interval.zone);
    return queryDays.some(day => {
      const a = day * 1440 + minutes(filters.start || '00:00') - offset(filters.zone || 'Asia/Jakarta');
      const b = day * 1440 + minutes(filters.end || '24:00') - offset(filters.zone || 'Asia/Jakarta');
      return [-10080, 0, 10080].some(shift => Math.max(a, start + shift) < Math.min(b, end + shift));
    });
  });
}
export function canRead(s: State, conversation: string, id: string) {
  if (!active(s, id)) return false;
  if (conversation.startsWith("team:"))
    return !!s.teams.find(
      (t) => "team:" + t.id === conversation && t.members.includes(id),
    );
  return s.requests.some(
    (r) =>
      r.status === "Diterima" &&
      personalId(r.from, r.to) === conversation &&
      [r.from, r.to].includes(id),
  );
}
export function requestPartner(s: State, from: string, to: string): State {
  eligible(s, from);
  if (from === to || !active(s, to) || blocked(s, from, to))
    throw Error("Permintaan tidak dapat dikirim ke pengguna ini.");
  if (
    s.requests.some(
      (r) =>
        [r.from, r.to].includes(from) &&
        [r.from, r.to].includes(to) &&
        ["Menunggu", "Diterima"].includes(r.status),
    )
  )
    throw Error("Sudah ada permintaan atau hubungan partner. Lihat Aktivitas.");
  return {
    ...s,
    requests: [
      ...s.requests,
      { id: uid(), from, to, status: "Menunggu", at: now() },
    ],
  };
}
export function decideRequest(
  s: State,
  id: string,
  actor: string,
  status: string,
): State {
  const r = s.requests.find((r) => r.id === id);
  if (!r || r.status !== "Menunggu")
    throw Error("Status permintaan sudah berubah.");
  if ((status === "Dibatalkan" ? r.from : r.to) !== actor || !active(s, actor))
    throw Error("Kamu tidak berhak memutuskan permintaan ini.");
  if (status === "Diterima" && blocked(s, r.from, r.to))
    throw Error("Interaksi dibatasi karena blokir.");
  return {
    ...s,
    requests: s.requests.map((x) => (x.id === id ? { ...x, status } : x)),
  };
}
export function applyTeam(
  s: State,
  user: string,
  team: string,
  role: string,
  message: string,
): State {
  eligible(s, user);
  const t = s.teams.find((t) => t.id === team);
  const c = s.competitions.find((c) => c.id === t?.competition);
  if (
    !t ||
    !c ||
    closed(c) ||
    t.status !== "Merekrut" ||
    t.members.length >= t.capacity
  )
    throw Error(
      "Perekrutan ditutup, penuh, atau deadline sudah lewat. Lamaran belum terkirim.",
    );
  if (t.members.some((id) => blocked(s, id, user)))
    throw Error("Interaksi perekrutan dibatasi karena blokir.");
  if (
    s.teams.some(
      (x) =>
        x.competition === t.competition &&
        x.status !== "Bubar" &&
        x.members.includes(user),
    )
  )
    throw Error("Kamu sudah menjadi anggota tim aktif untuk lomba ini.");
  if (
    s.applications.some(
      (x) => x.user === user && x.team === team && x.status === "Menunggu",
    )
  )
    throw Error("Lamaran kamu masih menunggu keputusan.");
  if (t.roles && !t.roles.some((r) => r.name === role && r.slots > 0))
    throw Error("Peran ini tidak lagi memiliki slot terbuka.");
  return {
    ...s,
    applications: [
      ...s.applications,
      { id: uid(), user, team, role, message, status: "Menunggu", at: now() },
    ],
  };
}
export function decideApplication(
  s: State,
  id: string,
  actor: string,
  status: string,
): State {
  const a = s.applications.find((x) => x.id === id);
  const t = s.teams.find((t) => t.id === a?.team);
  if (!a || !t || a.status !== "Menunggu")
    throw Error("Status lamaran sudah berubah.");
  if (
    !active(s, actor) ||
    (status === "Dibatalkan" ? a.user : t.leader) !== actor
  )
    throw Error("Kamu tidak berhak memutuskan lamaran ini.");
  if (status !== "Diterima")
    return {
      ...s,
      applications: s.applications.map((x) =>
        x.id === id ? { ...x, status } : x,
      ),
    };
  eligible(s, a.user);
  const c = s.competitions.find((c) => c.id === t.competition)!;
  if (closed(c) || t.status !== "Merekrut" || t.members.length >= t.capacity)
    throw Error("Tim sudah penuh atau perekrutan ditutup.");
  if (t.members.some((id) => blocked(s, id, a.user)))
    throw Error("Interaksi perekrutan dibatasi karena blokir.");
  if (
    s.teams.some(
      (x) =>
        x.competition === t.competition &&
        x.status !== "Bubar" &&
        x.members.includes(a.user),
    )
  )
    throw Error("Pelamar sudah bergabung dengan tim lain pada lomba ini.");
  if (t.roles && !t.roles.some((r) => r.name === a.role && r.slots > 0))
    throw Error("Slot untuk peran ini sudah terisi.");
  const full = t.members.length + 1 >= t.capacity;
  return {
    ...s,
    teams: s.teams.map((x) =>
      x.id === t.id
        ? {
            ...x,
            members: [...x.members, a.user],
            roles: x.roles?.map((r) =>
              r.name === a.role ? { ...r, slots: r.slots - 1 } : r,
            ),
            status: full ? "Ditutup" : x.status,
          }
        : x,
    ),
    applications: s.applications.map((x) =>
      x.id === id
        ? { ...x, status }
        : x.status === "Menunggu" &&
            ((x.team === t.id &&
              (full ||
                (x.role === a.role &&
                  t.roles?.find((r) => r.name === a.role)?.slots === 1))) ||
              (x.user === a.user &&
                s.teams.find((y) => y.id === x.team)?.competition ===
                  t.competition))
          ? { ...x, status: "Ditutup sistem" }
          : x,
    ),
  };
}
export function blockUser(s: State, from: string, to: string): State {
  return {
    ...s,
    blocks: [
      ...s.blocks.filter((x) => !(x.from === from && x.to === to)),
      { from, to },
    ],
    requests: s.requests.map((r) =>
      [r.from, r.to].includes(from) &&
      [r.from, r.to].includes(to) &&
      r.status === "Menunggu"
        ? { ...r, status: "Dibatalkan" }
        : r,
    ),
    applications: s.applications.map((a) =>
      a.status === "Menunggu" &&
      ((a.user === from &&
        s.teams.find((t) => t.id === a.team)?.members.includes(to)) ||
        (a.user === to &&
          s.teams.find((t) => t.id === a.team)?.members.includes(from)))
        ? { ...a, status: "Ditutup sistem" }
        : a,
    ),
  };
}
export function sendMessage(
  s: State,
  conversation: string,
  user: string,
  text: string,
  id = uid(),
): State {
  if (!canRead(s, conversation, user))
    throw Error("Kamu tidak memiliki akses ke percakapan ini.");
  const u = active(s, user)!;
  if (!u.verified) throw Error("Verifikasi email sebelum mengirim pesan.");
  if (!text.trim() || text.length > 2000)
    throw Error("Pesan wajib diisi, maksimal 2.000 karakter.");
  const t = s.teams.find((t) => "team:" + t.id === conversation);
  if (t?.status === "Bubar")
    throw Error("Tim sudah bubar. Percakapan hanya dapat dibaca.");
  if (
    conversation.startsWith("personal:") &&
    conversation
      .split(":")
      .slice(1)
      .some((id) => id !== user && blocked(s, user, id))
  )
    throw Error("Pesan personal dibatasi karena blokir.");
  if (s.messages.some((m) => m.id === id && m.status === "Terkirim")) return s;
  const m = {
    id,
    conversation,
    user,
    text: text.trim(),
    at: now(),
    status: "Terkirim",
  };
  return { ...s, messages: [...s.messages.filter((x) => x.id !== id), m] };
}
export function seed(): State {
  const base = {
    major: "Teknik Informatika",
    mode: "Online",
    day: "Sabtu",
    start: "19:00",
    end: "21:00",
    zone: "Asia/Jakarta",
    verified: true,
    suspended: false,
    complete: true,
  };
  const users: User[] = [
    {
      ...base,
      id: "alya",
      name: "Alya Putri",
      email: "alya@teamup.test",
      institution: "Universitas Indonesia",
      city: "Depok",
      bio: "Belajar lebih seru kalau ada teman diskusi. Lagi mendalami frontend dan desain produk digital.",
      topics: [
        { name: "UI/UX Design", level: "Menengah" },
        { name: "Web Development", level: "Pemula" },
      ],
      color: 0,
    },
    {
      ...base,
      id: "bima",
      name: "Bima Pratama",
      email: "bima@teamup.test",
      institution: "Institut Teknologi Bandung",
      city: "Bandung",
      bio: "Suka mengubah ide menjadi produk. Cari partner belajar React dan tim yang mau tumbuh bareng.",
      topics: [
        { name: "Web Development", level: "Menengah" },
        { name: "UI/UX Design", level: "Pemula" },
      ],
      color: 1,
    },
    {
      ...base,
      id: "citra",
      name: "Citra Maharani",
      email: "citra@teamup.test",
      institution: "Universitas Gadjah Mada",
      city: "Yogyakarta",
      major: "Statistika",
      bio: "Tertarik pada data yang bisa membawa perubahan. Yuk, eksplorasi Python dan data science bareng!",
      topics: [
        { name: "Data Science", level: "Menengah" },
        { name: "Python", level: "Mahir" },
      ],
      day: "Minggu",
      color: 2,
    },
    {
      ...base,
      id: "dimas",
      name: "Dimas Saputra",
      email: "dimas@teamup.test",
      institution: "Universitas Brawijaya",
      city: "Malang",
      bio: "Mencari teman bertukar ide dan latihan problem solving untuk kompetisi berikutnya.",
      topics: [
        { name: "Web Development", level: "Mahir" },
        { name: "Python", level: "Menengah" },
      ],
      mode: "Keduanya",
      color: 3,
    },
    {
      ...base,
      id: "nadia",
      name: "Nadia Rahma",
      email: "nadia@teamup.test",
      institution: "Universitas Padjadjaran",
      city: "Bandung",
      major: "Desain Komunikasi Visual",
      bio: "Merancang pengalaman yang sederhana dan bermakna. Terbuka untuk kolaborasi lomba desain.",
      topics: [{ name: "UI/UX Design", level: "Mahir" }],
      day: "Rabu",
      color: 4,
    },
    {
      ...base,
      id: "rafi",
      name: "Rafi Ardiansyah",
      email: "rafi@teamup.test",
      institution: "Institut Teknologi Sepuluh Nopember",
      city: "Surabaya",
      bio: "Dari ide kecil jadi dampak besar. Tertarik bisnis digital dan pengembangan produk.",
      topics: [
        { name: "Bisnis", level: "Menengah" },
        { name: "Web Development", level: "Pemula" },
      ],
      color: 5,
    },
    {
      ...base,
      id: "baru",
      name: "Pengguna Baru",
      email: "baru@teamup.test",
      institution: "",
      major: "",
      city: "",
      bio: "",
      topics: [],
      verified: false,
      complete: false,
      color: 0,
    },
    {
      ...base,
      id: "admin",
      name: "Admin TeamUp",
      email: "admin@teamup.test",
      institution: "TeamUp",
      city: "Jakarta",
      bio: "",
      topics: [],
      admin: true,
      color: 1,
    },
  ];
  const competitions: Competition[] = [
    {
      id: "innovate",
      name: "Innovate UI/UX Challenge 2026",
      organizer: "Komunitas Desain Nusantara",
      category: "UI/UX Design",
      level: "Nasional",
      fee: 0,
      deadline: "2026-12-20T16:59:00Z",
      date: "2027-01-10T02:00:00Z",
      description:
        "Rancang pengalaman digital yang membantu generasi muda membangun kebiasaan baik. Jelajahi masalah, validasi ide, dan wujudkan solusi yang berdampak.",
      requirements:
        "Mahasiswa aktif; tim 2–4 orang; karya orisinal; kirim studi kasus dan prototipe interaktif.",
      prize: "Dana pengembangan dan mentoring",
      source: "https://example.com/innovate",
      status: "Tayang",
      verified: true,
      max: 4,
      art: "design",
    },
    {
      id: "hack",
      name: "Build for Tomorrow Hackathon",
      organizer: "Digital Future Indonesia",
      category: "Web Development",
      level: "Nasional",
      fee: 0,
      deadline: "2026-12-28T16:59:00Z",
      date: "2027-01-16T02:00:00Z",
      description:
        "Bangun solusi teknologi untuk tantangan sehari-hari. Kolaborasikan kemampuan desain, pengembangan, dan bisnis dalam satu tim.",
      requirements:
        "Siswa atau mahasiswa; tim 2–5 orang; aplikasi dapat didemokan.",
      prize: "Mentoring produk dan dana inkubasi",
      source: "https://example.com/hackathon",
      status: "Tayang",
      verified: true,
      max: 5,
      art: "code",
    },
    {
      id: "data",
      name: "Data for Good Competition",
      organizer: "Data Academy",
      category: "Data Science",
      level: "Nasional",
      fee: 50000,
      deadline: "2027-01-05T16:59:00Z",
      date: "2027-01-24T02:00:00Z",
      description:
        "Temukan cerita di balik data dan usulkan solusi untuk masalah sosial menggunakan analisis yang dapat dipertanggungjawabkan.",
      requirements:
        "Mahasiswa aktif; tim 2–3 orang; Python atau R; laporan analisis wajib.",
      prize: "Beasiswa kelas data",
      source: "https://example.com/data",
      status: "Tayang",
      verified: true,
      max: 3,
      art: "data",
    },
    {
      id: "business",
      name: "Student Business Plan",
      organizer: "Ruang Wirausaha",
      category: "Bisnis",
      level: "Regional",
      fee: 0,
      deadline: "2026-10-01T16:59:00Z",
      date: "2026-10-15T02:00:00Z",
      description: "Kompetisi ide bisnis berkelanjutan untuk mahasiswa.",
      requirements: "Tim 2–4 mahasiswa.",
      prize: "",
      source: "https://example.com/business",
      status: "Tayang",
      verified: true,
      max: 4,
      art: "business",
    },
  ];
  return {
    session: null,
    users,
    competitions,
    teams: [
      {
        id: "pixel",
        name: "Pixel Pioneers",
        competition: "innovate",
        leader: "bima",
        members: ["bima", "nadia"],
        capacity: 4,
        role: "UI/UX Designer",
        description:
          "Punya ide untuk membuat belajar lebih inklusif. Kami mencari teman yang suka riset dan bereksperimen dengan desain.",
        status: "Merekrut",
      },
      {
        id: "byte",
        name: "Beyond the Bytes",
        competition: "hack",
        leader: "alya",
        members: ["alya", "dimas"],
        capacity: 4,
        role: "Frontend Developer",
        description:
          "Membangun platform kecil dengan dampak besar. Yuk, bawa ide dan semangat kolaborasimu!",
        status: "Merekrut",
      },
      {
        id: "insight",
        name: "Insight Collective",
        competition: "data",
        leader: "citra",
        members: ["citra"],
        capacity: 3,
        role: "Data Analyst",
        description:
          "Mengeksplorasi data lingkungan untuk kota yang lebih nyaman. Terbuka untuk yang mau belajar bersama.",
        status: "Merekrut",
      },
    ],
    requests: [
      {
        id: "r1",
        from: "citra",
        to: "alya",
        status: "Menunggu",
        at: "2026-11-12T08:30:00Z",
      },
      {
        id: "r2",
        from: "alya",
        to: "bima",
        status: "Diterima",
        at: "2026-11-11T07:00:00Z",
      },
    ],
    applications: [
      {
        id: "a1",
        user: "rafi",
        team: "byte",
        role: "Frontend Developer",
        message:
          "Aku ingin berkontribusi di pengembangan frontend. Boleh ikut berdiskusi?",
        status: "Menunggu",
        at: "2026-11-12T09:00:00Z",
      },
    ],
    messages: [
      {
        id: "m1",
        conversation: personalId("alya", "bima"),
        user: "bima",
        text: "Hai Alya! Senang bisa terhubung. Kamu lagi belajar apa sekarang?",
        at: "2026-11-12T12:00:00Z",
        status: "Terkirim",
      },
      {
        id: "m2",
        conversation: personalId("alya", "bima"),
        user: "alya",
        text: "Hai Bima! Aku lagi eksplorasi desain sistem dan React. Sabtu ini mau diskusi bareng?",
        at: "2026-11-12T12:02:00Z",
        status: "Terkirim",
      },
      {
        id: "m3",
        conversation: "team:byte",
        user: "dimas",
        text: "Halo tim! Aku sudah menyiapkan beberapa ide untuk kita bahas. Kita mulai dari masalah yang dekat dengan keseharian, yuk.",
        at: "2026-11-12T13:00:00Z",
        status: "Terkirim",
      },
      {
        id: "m4",
        conversation: "team:pixel",
        user: "nadia",
        text: "Aku sudah menyiapkan catatan riset awal. Kita diskusikan di sini ya!",
        at: "2026-11-12T13:00:00Z",
        status: "Terkirim",
      },
    ],
    blocks: [],
    reports: [],
    audit: [],
  };
}
