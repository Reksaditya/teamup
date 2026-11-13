import type { ReactNode, FormEvent } from "react";
import Image from "next/image";
import { initials, type User } from "../lib/demo";
const paths: Record<string, ReactNode> = {
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  back: <path d="M19 12H5m6-6-6 6 6 6" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-4M16 3a4 4 0 0 1 0 8" />
    </>
  ),
  trophy: (
    <path d="M8 3h8v6a4 4 0 0 1-8 0V3Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 2v6m-4 2h8" />
  ),
  chat: (
    <>
      <path d="M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 0 1 9-9h1a9 9 0 0 1 9 9Z" />
      <path d="M7 8h9M7 12h6" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  filter: <path d="M4 7h16M7 12h10m-7 5h4" />,
  book: (
    <path d="M12 5v16M3 3c4-1 6 0 9 2 3-2 5-3 9-2v16c-4-1-6 0-9 2-3-2-5-3-9-2V3Z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  external: (
    <path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
  ),
  send: <path d="m22 2-7 20-4-9-9-4L22 2ZM22 2 11 13" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  logout: <path d="M9 4H4v16h5m5-14 6 6-6 6M8 12h12" />,
  edit: <path d="m16 3 5 5-12 12H4v-5L16 3Zm-3 3 5 5" />,
  code: <path d="m8 5-6 7 6 7m8-14 6 7-6 7m-3-16-2 18" />,
  flag: <path d="M5 22V3c5-4 9 4 15 0v12c-6 4-10-4-15 0" />,
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10v1" />
    </>
  ),
  wifi: (
    <path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-10 4a5 5 0 0 1 6 0m-3 4h.01" />
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V6a4 4 0 0 1 8 0v4" />
    </>
  ),
  reset: <path d="M3 4v6h6M3 10a9 9 0 1 1 1 8" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  leaf: <path d="M20 3C9 2 2 7 5 15s14 6 15-12ZM4 21 16 9" />,
};
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.info}
    </svg>
  );
}
export function Avatar({ user, size = "" }: { user?: User; size?: string }) {
  return (
    <span
      className={`avatar color-${user?.color || 0} ${size}`}
      aria-hidden="true"
    >
      {user?.photo ? (
        <Image src={user.photo} alt="" width={80} height={80} unoptimized />
      ) : (
        initials(user?.name || "Team Up")
      )}
    </span>
  );
}
export function Badge({
  children,
  tone = "",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function Status({ value }: { value: string }) {
  return (
    <Badge
      tone={
        ["Diterima", "Merekrut", "Tayang", "Ditindak", "Terkirim"].includes(
          value,
        )
          ? "success"
          : ["Menunggu", "Ditinjau", "Baru"].includes(value)
            ? "warning"
            : ["Ditolak", "Ditangguhkan", "Gagal"].includes(value)
              ? "danger"
              : ""
      }
    >
      {value}
    </Badge>
  );
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Empty({
  title = "Belum ada hasil",
  text = "Coba kurangi filter atau mulai aktivitas baru.",
  children,
  page = false,
}: {
  title?: string;
  text?: string;
  children?: ReactNode;
  page?: boolean;
}) {
  const Heading = page ? "h1" : "h2";
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon name="search" size={32} />
      </span>
      <Heading>{title}</Heading>
      <p>{text}</p>
      {children}
    </div>
  );
}
export function Title({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {children}
    </div>
  );
}
export const formData = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  return Object.fromEntries(new FormData(e.currentTarget)) as Record<
    string,
    string
  >;
};
export const topics = [
  "UI/UX Design",
  "Web Development",
  "Data Science",
  "Python",
  "Bisnis",
];
export const levels = ["Pemula", "Menengah", "Mahir"];
export const days = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];
