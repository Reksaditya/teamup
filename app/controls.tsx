import { useState } from "react";
import type { Availability, User } from "../lib/demo";
import { Icon, Field, days } from "./ui";
export function PhotoInput({
  profile,
  onChange,
}: {
  profile: User;
  onChange: (photo: string) => void;
}) {
  const [error, setError] = useState("");
  return (
    <div className="photo-upload">
      <label className="button secondary small">
        Pilih foto (opsional)
        <input
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={async (e) => {
            setError("");
            const file = e.target.files?.[0];
            if (!file) return;
            if (
              file.size > 2 * 1024 * 1024 ||
              !["image/jpeg", "image/png", "image/webp"].includes(file.type)
            ) {
              setError("Pilih JPG, PNG, atau WebP maksimal 2 MB.");
              return;
            }
            try {
              const bitmap = await createImageBitmap(file);
              const canvas = document.createElement("canvas");
              canvas.width = canvas.height = 160;
              const ctx = canvas.getContext("2d")!;
              const side = Math.min(bitmap.width, bitmap.height);
              ctx.drawImage(
                bitmap,
                (bitmap.width - side) / 2,
                (bitmap.height - side) / 2,
                side,
                side,
                0,
                0,
                160,
                160,
              );
              onChange(canvas.toDataURL("image/webp", 0.85));
              bitmap.close();
            } catch {
              setError("Gambar tidak dapat dibaca. Pilih file gambar lain.");
            }
          }}
        />
      </label>
      {profile.photo && (
        <button
          type="button"
          className="text-link danger-text"
          onClick={() => onChange("")}
        >
          Hapus foto
        </button>
      )}
      <small>
        JPG, PNG, WebP · maksimal 2 MB · tersimpan lokal. Metadata dibuang saat
        foto diproses.
      </small>
      {error && (
        <p className="danger-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
export function ScheduleEditor({
  values,
  onChange,
}: {
  values: Availability[];
  onChange: (v: Availability[]) => void;
}) {
  return (
    <div>
      {values.map((v, i) => (
        <div className="schedule-editor" key={i}>
          <div className="row between">
            <strong>Jadwal {i + 1}</strong>
            {values.length > 1 && (
              <button
                type="button"
                className="icon-button"
                aria-label={"Hapus jadwal " + (i + 1)}
                onClick={() => onChange(values.filter((_, n) => n !== i))}
              >
                <Icon name="close" />
              </button>
            )}
          </div>
          <Field label="Hari belajar">
            <select
              value={v.day}
              onChange={(e) =>
                onChange(
                  values.map((x, n) =>
                    n === i ? { ...x, day: e.target.value } : x,
                  ),
                )
              }
            >
              {days.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <div className="grid two">
            <Field label="Waktu mulai (wajib)">
              <input
                type="time"
                value={v.start}
                required
                onChange={(e) =>
                  onChange(
                    values.map((x, n) =>
                      n === i ? { ...x, start: e.target.value } : x,
                    ),
                  )
                }
              />
            </Field>
            <Field label="Waktu selesai (wajib)">
              <input
                type="time"
                value={v.end}
                required
                onChange={(e) =>
                  onChange(
                    values.map((x, n) =>
                      n === i ? { ...x, end: e.target.value } : x,
                    ),
                  )
                }
              />
            </Field>
          </div>
          <Field label="Zona waktu">
            <select
              value={v.zone}
              onChange={(e) =>
                onChange(
                  values.map((x, n) =>
                    n === i ? { ...x, zone: e.target.value } : x,
                  ),
                )
              }
            >
              <option value="Asia/Jakarta">WIB · UTC+7</option>
              <option value="Asia/Makassar">WITA · UTC+8</option>
              <option value="Asia/Jayapura">WIT · UTC+9</option>
            </select>
          </Field>
        </div>
      ))}
      <button
        type="button"
        className="button secondary full"
        onClick={() =>
          onChange([
            ...values,
            {
              day: "Minggu",
              start: "19:00",
              end: "21:00",
              zone: "Asia/Jakarta",
            },
          ])
        }
      >
        <Icon name="plus" /> Tambah interval jadwal
      </button>
      <small className="schedule-help">
        Untuk jadwal lintas tengah malam, buat dua interval pada hari terkait.
      </small>
    </div>
  );
}
export function RoleEditor({
  initial,
  remaining,
}: {
  initial?: { name: string; slots: number }[];
  remaining: number;
}) {
  const [roles, setRoles] = useState(initial || [{ name: "", slots: 1 }]);
  return (
    <div className="role-editor">
      <h3>Peran & slot terbuka</h3>
      <p className="muted">
        Total slot maksimal {remaining}. Kapasitas mencakup ketua.
      </p>
      <input type="hidden" name="roles" value={JSON.stringify(roles)} />
      {roles.map((r, i) => (
        <div className="role-edit-row" key={i}>
          <Field label={"Peran " + (i + 1) + " (wajib)"}>
            <input
              required
              value={r.name}
              onChange={(e) =>
                setRoles(
                  roles.map((x, n) =>
                    n === i ? { ...x, name: e.target.value } : x,
                  ),
                )
              }
              placeholder="Contoh: UI/UX Designer"
            />
          </Field>
          <Field label="Slot">
            <input
              type="number"
              min="0"
              required
              value={r.slots}
              onChange={(e) =>
                setRoles(
                  roles.map((x, n) =>
                    n === i ? { ...x, slots: Number(e.target.value) } : x,
                  ),
                )
              }
            />
          </Field>
          {roles.length > 1 && (
            <button
              type="button"
              className="icon-button"
              aria-label={"Hapus peran " + (i + 1)}
              onClick={() => setRoles(roles.filter((_, n) => n !== i))}
            >
              <Icon name="close" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="button secondary"
        onClick={() => setRoles([...roles, { name: "", slots: 1 }])}
      >
        <Icon name="plus" /> Tambah peran
      </button>
    </div>
  );
}
